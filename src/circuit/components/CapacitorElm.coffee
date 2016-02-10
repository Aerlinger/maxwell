CircuitComponent = require('../circuitComponent.coffee')
Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
Util = require('../../util/util.coffee')

class CapacitorElm extends CircuitComponent
  @FLAG_BACK_EULER: 2

  @ParameterDefinitions = {
    "capacitance": {
      name: "Capacitance",
      unit: "Farads",
      default_value: 5e-6,
      symbol: "F",
      data_type: parseFloat
      range: [0, Infinity]
      type: "physical"
    },
    "voltDiff": {
      name: "Volts"
      unit: "Volts"
      default_value: 10
      symbol: "V"
      data_type: parseFloat
      range: [-Infinity, Infinity]
      type: "physical"
    }
  }

  constructor: (xa, ya, xb, yb, params, f) ->
    @compResistance = 11
    @plate1 = []
    @plate2 = []
    @curSourceValue = 0

    super(xa, ya, xb, yb, params, f)

  isTrapezoidal: ->
    true
#    (@flags & CapacitorElm.FLAG_BACK_EULER) is 0

  nonLinear: ->
    false

  setNodeVoltage: (n, c) ->
    super(n, c)
    @voltDiff = @volts[0] - @volts[1]

  reset: ->
    @current = @curcount = 0

    # put small charge on caps when reset to start oscillators
    @voltDiff = 1e-3

  getDumpType: ->
    "c"

  setPoints: ->
    super()

    f = (@dn / 2 - 4) / @dn

    @lead1 = Util.interpolate(@point1, @point2, f)
    @lead2 = Util.interpolate(@point1, @point2, 1 - f)

    @plate1 = [new Point(), new Point()]
    @plate2 = [new Point(), new Point()]
    [@plate1[0], @plate1[1]] = Util.interpolateSymmetrical @point1, @point2, f, 12
    [@plate2[0], @plate2[1]] = Util.interpolateSymmetrical @point1, @point2, 1 - f, 12




  draw: (renderContext) ->
    if CircuitComponent.DEBUG
      super(renderContext)

    # calc leads


    # calc plates

    hs = 12
    @setBboxPt @point1, @point2, hs

    # draw first lead and plate
    color = Util.getVoltageColor(@volts[0])
    renderContext.drawLinePt @point1, @lead1, color
#      @setPowerColor false
    renderContext.drawLinePt @plate1[0], @plate1[1], color

    # TODO:
    #    if (CirSim.powerCheckItem)
    #        g.beginFill(Color.GRAY);

    # draw second lead and plate
    color = Util.getVoltageColor(@volts[1])
    renderContext.drawLinePt @point2, @lead2, color
#      @setPowerColor false
    renderContext.drawLinePt @plate2[0], @plate2[1], color

    renderContext.drawValue 20, 0, this, Util.getUnitText(@capacitance, @unitSymbol())

    @updateDots()
    renderContext.drawDots @point1, @lead1, this
    renderContext.drawDots @lead2, @point2, this

    renderContext.drawPosts(this)

  unitSymbol: ->
    "F"

  drawUnits: ->
    s = @getUnitText(@capacitance, "F")
#    @drawValues s, hs

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

  startIteration: ->
    if @isTrapezoidal()
      @curSourceValue = -@voltDiff / @compResistance - @current
    else
      @curSourceValue = -@voltDiff / @compResistance

  calculateCurrent: ->
    vdiff = @volts[0] - @volts[1]

    # we check compResistance because this might get called before stamp(), which sets compResistance, causing
    # infinite current
    if @compResistance > 0
      @current = vdiff / @compResistance + @curSourceValue

  getInfo: (arr) ->
    super()

    arr[0] = "capacitor"
    @getBasicInfo arr
    arr[3] = "C = " + @getUnitText(@capacitance, "F")
    arr[4] = "P = " + @getUnitText(@getPower(), "W")
    v = @getVoltageDiff()
    arr[4] = "U = " + @getUnitText(.5 * @capacitance * v * v, "J")

  needsShortcut: ->
    true

  toString: ->
    "CapacitorElm"

module.exports = CapacitorElm
