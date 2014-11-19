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

    @FLAG_BACK_EULER: 2

    constructor: (xa, ya, xb, yb, f, st) ->
      super(xa, ya, xb, yb, f, st)

      @capacitance = 5e-6
      @compResistance = 11
      @voltDiff = 10
      @plate1 = []
      @plate2 = []
      @curSourceValue = 0

      if st
        st = st.split(" ") if typeof st is "string"
        @capacitance = Number(st[0])
        @voltDiff = Number(st[1])


    isTrapezoidal: ->
      (@flags & CapacitorElm.FLAG_BACK_EULER) is 0

    nonLinear: ->
      false

    setNodeVoltage: (n, c) ->
      super n, c
      @voltDiff = @volts[0] - @volts[1]

    reset: ->
      @current = @curcount = 0

      # put small charge on caps when reset to start oscillators
      @voltDiff = 1e-3

    getDumpType: ->
      "c"

    dump: ->
      "#{super} #{@capacitance} #{@voltDiff}"

    setPoints: ->
      super()
      f = (@dn / 2 - 4) / @dn

      # calc leads
      @lead1 = DrawHelper.interpPoint(@point1, @point2, f)
      @lead2 = DrawHelper.interpPoint(@point1, @point2, 1 - f)

      # calc plates
      @plate1 = [new Point(), new Point()]
      @plate2 = [new Point(), new Point()]
      [@plate1[0], @plate1[1]] = DrawHelper.interpPoint2 @point1, @point2, f, 12
      [@plate2[0], @plate2[1]] = DrawHelper.interpPoint2 @point1, @point2, 1 - f, 12


    draw: (renderContext) ->
      hs = 12
      @setBboxPt @point1, @point2, hs
#      @curcount = @updateDotCount()

#      unless @isBeingDragged()

      # draw first lead and plate
      color = DrawHelper.getVoltageColor(@volts[0])
      renderContext.drawThickLinePt @point1, @lead1, color
#      @setPowerColor false
      renderContext.drawThickLinePt @plate1[0], @plate1[1], color

      # TODO:
      #    if (CirSim.powerCheckItem)
      #        g.beginFill(Color.GRAY);

      # draw second lead and plate
      color = DrawHelper.getVoltageColor(@volts[1])
      renderContext.drawThickLinePt @point2, @lead2, color
#      @setPowerColor false
      renderContext.drawThickLinePt @plate2[0], @plate2[1], color

      @drawDots @point1, @lead1, renderContext
#      @drawDots @point2, @lead2, renderContext
      @drawDots @lead2, @point2, renderContext

      @drawPosts(renderContext)


    drawUnits: () ->
      s = DrawHelper.getUnitText(@capacitance, "F")
      @drawValues s, hs

    doStep: (stamper) ->
      stamper.stampCurrentSource(@nodes[0], @nodes[1], @curSourceValue)

    stamp: (stamper) ->
      # capacitor companion model using trapezoidal approximation (Norton equivalent) consists of a current source in
      # parallel with a resistor.  Trapezoidal is more accurate than Backward Euler but can cause oscillatory behavior
      # if RC is small relative to the timestep.

      if @isTrapezoidal()
        @compResistance = @timeStep() / (2 * @capacitance)
      else
        @compResistance = @timeStep() / @capacitance

      stamper.stampResistor @nodes[0], @nodes[1], @compResistance
      stamper.stampRightSide @nodes[0]
      stamper.stampRightSide @nodes[1]

      return

    startIteration: ->
      if @isTrapezoidal()
        @curSourceValue = -@voltDiff / @compResistance - @current
      else
        @curSourceValue = -@voltDiff / @compResistance

      return

    calculateCurrent: ->
      vdiff = @volts[0] - @volts[1]

      # we check compResistance because this might get called before stamp(), which sets compResistance, causing
      # infinite current
      @current = vdiff / @compResistance + @curSourceValue  if @compResistance > 0

    getInfo: (arr) ->
      super()

      arr[0] = "capacitor"
      @getBasicInfo arr
      arr[3] = "C = " + DrawHelper.getUnitText(@capacitance, "F")
      arr[4] = "P = " + DrawHelper.getUnitText(@getPower(), "W")
      v = @getVoltageDiff()
      arr[4] = "U = " + DrawHelper.getUnitText(.5 * @capacitance * v * v, "J")

    getEditInfo: (n) ->
      return new EditInfo("Capacitance (F)", @capacitance, 0, 0)  if n is 0
      if n is 1
        ei = new EditInfo("", 0, -1, -1)
        ei.checkbox = "Trapezoidal Approximation" #new Checkbox("Trapezoidal Approximation", isTrapezoidal());
        return ei
      null

    setEditValue: (n, ei) ->
      @capacitance = ei.value  if n is 0 and ei.value > 0
      if n is 1
        if ei.isChecked
          @flags &= ~CapacitorElm.FLAG_BACK_EULER
        else
          @flags |= CapacitorElm.FLAG_BACK_EULER

    needsShortcut: ->
      true

    toString: ->
      "CapacitorElm"

  return CapacitorElm
