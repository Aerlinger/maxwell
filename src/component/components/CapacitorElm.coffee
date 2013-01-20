# <DEFINE>
define [
  'cs!CircuitComponent',
  'cs!DrawHelper',
  'cs!Units',
  'cs!Point'
], (
  CircuitComponent,
  DrawHelper,
  Units,
  Point
) ->
# </DEFINE>

  class CapacitorElm extends CircuitComponent

    constructor: (xa, ya, xb, yb, f, st) ->
      CircuitComponent.call this, xa, ya, xb, yb, f

      if st
        st = st.split(" ")  if typeof st is "string"
        @capacitance = Number(st[0])
        @voltdiff = Number(st[1])


    CapacitorElm::capacitance = 5e-6
    CapacitorElm::compResistance = 0
    CapacitorElm::voltDiff = 10
    CapacitorElm::plate1 = []
    CapacitorElm::plate2 = []
    CapacitorElm.FLAG_BACK_EULER = 2
    CapacitorElm::curSourceValue = 0

    CapacitorElm::isTrapezoidal = ->
      (@flags & CapacitorElm.FLAG_BACK_EULER) is 0

    CapacitorElm::setNodeVoltage = (n, c) ->
      CircuitComponent::setNodeVoltage.call this, n, c
      @voltdiff = @volts[0] - @volts[1]

    CapacitorElm::reset = ->
      @current = @curcount = 0

      # put small charge on caps when reset to start oscillators
      @voltdiff = 1e-3

    CapacitorElm::getDumpType = ->
      "c"

    CapacitorElm::dump = ->
      CircuitComponent::dump.call(this) + " " + @capacitance + " " + @voltdiff

    CapacitorElm::setPoints = ->
      CircuitComponent::setPoints.call this
      f = (@dn / 2 - 4) / @dn

      # calc leads
      @lead1 = DrawHelper.interpPointPt(@point1, @point2, f)
      @lead2 = DrawHelper.interpPointPt(@point1, @point2, 1 - f)

      # calc plates
      @plate1 = [new Point(), new Point()]
      @plate2 = [new Point(), new Point()]
      DrawHelper.interpPoint2 @point1, @point2, @plate1[0], @plate1[1], f, 12
      DrawHelper.interpPoint2 @point1, @point2, @plate2[0], @plate2[1], 1 - f, 12

    CapacitorElm::draw = (renderContext) ->
      hs = 12
      @setBboxPt @point1, @point2, hs
      @curcount = @updateDotCount()

      unless @isBeingDragged()
        @drawDots @point1, @lead1, @curcount
        @drawDots @point2, @lead2, -@curcount

      # draw first lead and plate
      color = @setVoltageColor(@volts[0])
      renderContext.drawThickLinePt @point1, @lead1, color
      @setPowerColor false
      renderContext.drawThickLinePt @plate1[0], @plate1[1], color

      # TODO:
      #    if (CirSim.powerCheckItem)
      #        g.beginFill(Color.GRAY);

      # draw second lead and plate
      color = @setVoltageColor(@volts[1])
      renderContext.drawThickLinePt @point2, @lead2, color
      @setPowerColor false
      renderContext.drawThickLinePt @plate2[0], @plate2[1], color
      @drawPosts()


    CapacitorElm::drawUnits = () ->
      s = Units.getUnitText(@capacitance, "F")
      @drawValues s, hs


    CapacitorElm::stamp = (stamper) ->
      # capacitor companion model using trapezoidal approximation (Norton equivalent) consists of a current source in
      # parallel with a resistor.  Trapezoidal is more accurate than Backward Euler but can cause oscillatory behavior
      # if RC is small relative to the timestep.
      Solver = @getParentCircuit().Solver

      if @isTrapezoidal()
        @compResistance = Solver.timeStep / (2 * @capacitance)
      else
        @compResistance = Solver.timeStep / @capacitance

      stamper.stampResistor @nodes[0], @nodes[1], @compResistance
      stamper.stampRightSide @nodes[0]
      stamper.stampRightSide @nodes[1]

    CapacitorElm::startIteration = ->
      if @isTrapezoidal()
        @curSourceValue = -@voltdiff / @compResistance - @current
      else
        @curSourceValue = -@voltdiff / @compResistance


    #console.log("cap " + compResistance + " " + curSourceValue + " " + current + " " + voltdiff);
    CapacitorElm::calculateCurrent = ->
      voltdiff = @volts[0] - @volts[1]

      # we check compResistance because this might get called before stamp(), which sets compResistance, causing
      # infinite current
      @current = voltdiff / @compResistance + @curSourceValue  if @compResistance > 0


    CapacitorElm::doStep = ->
      Circuit = @getParentCircuit()
      Circuit.Solver.Stamper.stampCurrentSource @nodes[0], @nodes[1], @curSourceValue

    CapacitorElm::getInfo = (arr) ->
      arr[0] = "capacitor"
      @getBasicInfo arr
      arr[3] = "C = " + Units.getUnitText(@capacitance, "F")
      arr[4] = "P = " + Units.getUnitText(@getPower(), "W")
      v = @getVoltageDiff()
      arr[4] = "U = " + Units.getUnitText(.5 * @capacitance * v * v, "J")

    CapacitorElm::getEditInfo = (n) ->
      return new EditInfo("Capacitance (F)", @capacitance, 0, 0)  if n is 0
      if n is 1
        ei = new EditInfo("", 0, -1, -1)
        ei.checkbox = "Trapezoidal Approximation" #new Checkbox("Trapezoidal Approximation", isTrapezoidal());
        return ei
      null

    CapacitorElm::setEditValue = (n, ei) ->
      @capacitance = ei.value  if n is 0 and ei.value > 0
      if n is 1
        if ei.isChecked
          @flags &= ~CapacitorElm.FLAG_BACK_EULER
        else
          @flags |= CapacitorElm.FLAG_BACK_EULER

    CapacitorElm::needsShortcut = ->
      true

    CapacitorElm::toString = ->
      "Capacitor"

  return CapacitorElm
