# <DEFINE>
define [
  'cs!Settings',
  'cs!DrawHelper',
  'cs!Polygon',
  'cs!Rectangle',
  'cs!Point',
  'cs!CircuitComponent',
  'cs!Units'
], (Settings,
    DrawHelper,
    Polygon,
    Rectangle,
    Point,
    CircuitComponent,
    Units) ->
# </DEFINE>
  class InductorElm extends CircuitComponent

    constructor: (xa, ya, xb, yb, f, st) ->
      super xa, ya, xb, yb, f
      #      @ind = new Inductor()

      @inductance = 0
      @nodes = new Array(2)
      @flags = 0
      @compResistance = 0
      @current = 0
      @curSourceValue = 0

      if st
        st = st.split(" ")  if typeof st is "string"
        @inductance = parseFloat(st[0])
        @current = parseFloat(st[1])

#      @ind.setup @inductance, @current, @flags

    stamp: (stamper) ->
      # Inductor companion model using trapezoidal or backward euler
      # approximations (Norton equivalent) consists of a current
      # source in parallel with a resistor.  Trapezoidal is more
      # accurate than backward euler but can cause oscillatory behavior.
      # The oscillation is a real problem in circuits with switches.
      @nodes[0] = n0
      @nodes[1] = n1

      if @isTrapezoidal()
        @compResistance = 2 * @inductance / ts
        # backward euler
      else
        @compResistance = @inductance / ts

      stamper.stampResistor @nodes[0], @nodes[1], @compResistance
      stamper.stampRightSide @nodes[0]
      stamper.stampRightSide @nodes[1]


    doStep: (stamper) ->
      stamper.stampCurrentSource @nodes[0], @nodes[1], @curSourceValue


#      voltdiff = @volts[0] - @volts[1]
#      @ind.doStep stamper, voltdiff

    draw: (renderContext) ->
      @doDots()
      v1 = @volts[0]
      v2 = @volts[1]
      hs = 8

      @setBboxPt @point1, @point2, hs
      @draw2Leads()
      @setPowerColor false
      @drawCoil 8, @lead1, @lead2, v1, v2

      if Circuit.showValuesCheckItem
        unit_text = DrawHelper.getShortUnitText(@inductance, "H")
        @drawValues unit_text, hs

      @drawPosts()

    dump: ->
      "#{super()} #{@inductance} #{@current}"

    getDumpType: ->
      "l"

    startIteration: ->
      voltdiff = @volts[0] - @volts[1]

      if @isTrapezoidal()
        @curSourceValue = voltdiff / @compResistance + @current
        # backward euler
      else
        @curSourceValue = @current

    nonLinear: ->
      false

    isTrapezoidal: ->
      (@flags & Inductor.FLAG_BACK_EULER) is 0

    calculateCurrent: ->
      voltdiff = @volts[0] - @volts[1]

      if @compResistance > 0
        @current = voltdiff / @compResistance + @curSourceValue

      @current

    getInfo: (arr) ->
      arr[0] = "inductor"
      @getBasicInfo arr
      arr[3] = "L = " + DrawHelper.getUnitText(@inductance, "H")
      arr[4] = "P = " + DrawHelper.getUnitText(@getPower(), "W")

    reset: ->
      @current = 0
      @volts[0] = 0
      @volts[1] = 0
      @curcount = 0
#      @ind.reset()

    getEditInfo: (n) ->
      return new EditInfo("Inductance (H)", @inductance, 0, 0)  if n is 0
      if n is 1
        ei = new EditInfo("", 0, -1, -1)
        ei.checkbox = "Trapezoidal Approximation" # new Checkbox("Trapezoidal Approximation",	ind.isTrapezoidal());
        return ei
      null

    setEditValue: (n, ei) ->
      # TODO Auto Generated method stub
      @inductance = ei.value  if n is 0
      if n is 1
        if ei.checkbox.getState()
          @flags &= ~Inductor.FLAG_BACK_EULER
        else
          @flags |= Inductor.FLAG_BACK_EULER
#      @ind.setup @inductance, @current, @flags

    setPoints: ->
      super()
      @calcLeads 32


  return InductorElm
