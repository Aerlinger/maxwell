# <DEFINE>
define [
  'cs!Settings',
  'cs!DrawHelper',
  'cs!Polygon',
  'cs!Rectangle',
  'cs!Point',
  'cs!CircuitComponent',
  'cs!Units'
], (
  Settings,
  DrawHelper,
  Polygon,
  Rectangle,
  Point,

  CircuitComponent,
  Units
) ->
# </DEFINE>


  class InductorElm extends CircuitComponent

    constructor: (xa, ya, xb, yb, f, st) ->
      super xa, ya, xb, yb, f
      @ind = new Inductor()

      @inductance = 0

      if st
        st = st.split(" ")  if typeof st is "string"
        @inductance = parseFloat(st[0])
        @current = parseFloat(st[1])

      @ind.setup @inductance, @current, @flags

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
        s = CircuitComponent.getShortUnitText(@inductance, "H")
        @drawValues s, hs

      @drawPosts()

    dump: ->
      CircuitComponent::dump.call(this) + " " + @inductance + " " + @current

    getDumpType: ->
      "l"

    startIteration: ->
      @ind.startIteration @volts[0] - @volts[1]

    nonLinear: ->
      @ind.nonLinear()

    calculateCurrent: ->
      voltdiff = @volts[0] - @volts[1]
      @current = @ind.calculateCurrent(voltdiff)

    doStep: ->
      voltdiff = @volts[0] - @volts[1]
      @ind.doStep voltdiff

    getInfo: (arr) ->
      arr[0] = "inductor"
      @getBasicInfo arr
      arr[3] = "L = " + CircuitComponent.getUnitText(@inductance, "H")
      arr[4] = "P = " + CircuitComponent.getUnitText(@getPower(), "W")

    reset: ->
      @current = @volts[0] = @volts[1] = @curcount = 0
      @ind.reset()

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
      @ind.setup @inductance, @current, @flags

    setPoints: ->
      super()
      @calcLeads 32

    stamp: ->
      @ind.stamp @nodes[0], @nodes[1]

  return InductorElm
