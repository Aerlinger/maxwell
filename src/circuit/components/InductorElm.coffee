Settings = require('../../settings/settings.coffee')
DrawHelper = require('../../render/drawHelper.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
CircuitComponent = require('../circuitComponent.coffee')

class InductorElm extends CircuitComponent
  @FLAG_BACK_EULER = 2

  @ParameterDefinitions = {
    "inductance": {
      name: "inductance"
      unit: "Henries"
      symbol: "H"
      default_value: 1e-3
      range: [-Infinity, Infinity]
      data_type: "float"
      type: "physical"
    },
    "current": {
      name: "current"
      unit: "Amperes"
      symbol: "A"
      default_value: 0
      range: [-Infinity, Infinity]
      data_type: "float"
      type: "physical"
    }
  }

  constructor: (xa, ya, xb, yb, f, params) ->
    @inductance = 0
    @nodes = new Array(2)
    @flags = 0
    @compResistance = 1e-3
    @current = 0
    @curSourceValue = 0

    super(xa, ya, xb, yb, f, params)
    #      @ind = new Inductor()



#    if st
#      st = st.split(" ")  if typeof st is "string"
#      @inductance = parseFloat(st[0])
#      @current = parseFloat(st[1])

#      @ind.setup @inductance, @current, @flags

  stamp: (stamper) ->
    # Inductor companion model using trapezoidal or backward euler
    # approximations (Norton equivalent) consists of a current
    # source in parallel with a resistor.  Trapezoidal is more
    # accurate than backward euler but can cause oscillatory behavior.
    # The oscillation is a real problem in circuits with switches.
#      @nodes[0] = n0
#      @nodes[1] = n1

    ts = @getParentCircuit().timeStep()

#    console.log ts
#    console.log @inductance

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
    v1 = @volts[0]
    v2 = @volts[1]
    hs = 8

    @setBboxPt @point1, @point2, hs
    @draw2Leads(renderContext)
#      @setPowerColor false
    renderContext.drawCoil @lead1, @lead2, v1, v2, renderContext

#      if @getParentCircuit().showValuesCheckItem
    unit_text = DrawHelper.getUnitText(@inductance, "H")
    @drawValues unit_text, hs, renderContext

    @drawPosts(renderContext)
    @drawDots(@point1, @point2, renderContext)

  dump: ->
    "#{super()} #{@inductance} #{@current}"

  getDumpType: ->
    "l"

  startIteration: ->
    if @isTrapezoidal()
      @curSourceValue = @getVoltageDiff() / @compResistance + @current
      # backward euler
    else
      @curSourceValue = @current

  nonLinear: ->
    false

  isTrapezoidal: ->
    (@flags & InductorElm.FLAG_BACK_EULER) is 0

  calculateCurrent: ->
    if @compResistance > 0
      @current = @getVoltageDiff() / @compResistance + @curSourceValue

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

  getVoltageDiff: ->
    @volts[0] - @volts[1]

  toString: ->
    "InductorElm"

  setPoints: ->
    super()
    @calcLeads 32


module.exports = InductorElm
