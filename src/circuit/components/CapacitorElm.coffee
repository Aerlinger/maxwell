CircuitComponent = require('../circuitComponent.js')
Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
Util = require('../../util/util.coffee')

class CapacitorElm extends CircuitComponent
  @FLAG_BACK_EULER: 2

  @Fields = {
    "capacitance": {
      name: "Capacitance",
      unit: "Farads",
      default_value: 5e-6,
      symbol: "F",
      data_type: parseFloat
      range: [0, Infinity]
    },
    "voltdiff": {
      name: "Volts"
      unit: "Volts"
      default_value: 10
      symbol: "V"
      data_type: parseFloat
      range: [-Infinity, Infinity]
    }
  }

  constructor: (xa, ya, xb, yb, params, f) ->
    super(xa, ya, xb, yb, params, f)
    
    @compResistance = 11
    @plate1 = []
    @plate2 = []
    @curSourceValue = 0

    console.log("ca", xa)


  isTrapezoidal: ->
    true
#    (@flags & CapacitorElm.FLAG_BACK_EULER) is 0

  nonLinear: ->
    false

  setNodeVoltage: (n, c) ->
    super(n, c)
    @voltdiff = @volts[0] - @volts[1]

  reset: ->
    @current = @curcount = 0

    # put small charge on caps when reset to start oscillators
    @voltdiff = 1e-3

  getDumpType: ->
    "c"

  setPoints: ->
    console.log("capelm", arguments)
#    super(arguments...)
    super

    f = (@dn() / 2 - 4) / @dn()

    @lead1 = Util.interpolate(@point1, @point2, f)
    @lead2 = Util.interpolate(@point1, @point2, 1 - f)

    @plate1 = [new Point(), new Point()]
    @plate2 = [new Point(), new Point()]
    [@plate1[0], @plate1[1]] = Util.interpolateSymmetrical @point1, @point2, f, 12
    [@plate2[0], @plate2[1]] = Util.interpolateSymmetrical @point1, @point2, 1 - f, 12


  draw: (renderContext) ->
    hs = 12
#    @setBboxPt @point1, @point2, hs

    # draw first lead and plate
    color = Util.getVoltageColor(@volts[0])
    renderContext.drawLinePt @point1, @lead1, color
    renderContext.drawLinePt @plate2[0], @plate2[1], color

    # draw second lead and plate
    color = Util.getVoltageColor(@volts[1])
    renderContext.drawLinePt @point2, @lead2, color

    @updateDots()
    renderContext.drawDots @point1, @lead1, this
    renderContext.drawDots @lead2, @point2, this

    renderContext.drawLinePt @plate1[0], @plate1[1], color

    renderContext.drawValue 20, 0, this, Util.getUnitText(@capacitance, @unitSymbol())

    renderContext.drawPosts(this)

    if CircuitComponent.DEBUG
      super(renderContext)

  unitSymbol: ->
    "F"

  drawUnits: ->
    s = Util.getUnitText(@capacitance, "F")
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
      @curSourceValue = -@voltdiff / @compResistance - @current
    else
      @curSourceValue = -@voltdiff / @compResistance

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
    arr[3] = "C = " + Util.getUnitText(@capacitance, "F")
    arr[4] = "P = " + Util.getUnitText(@getPower(), "W")
    v = @getVoltageDiff()
    arr[4] = "U = " + Util.getUnitText(.5 * @capacitance * v * v, "J")

  needsShortcut: ->
    true

  getName: ->
    "Capacitor"

module.exports = CapacitorElm
