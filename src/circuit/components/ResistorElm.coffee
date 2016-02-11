CircuitComponent = require('../circuitComponent.coffee')
Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
Util = require('../../util/util.coffee')
#Maxwell = require('../../Maxwell.coffee')

class ResistorElm extends CircuitComponent
  @ParameterDefinitions = {
    "resistance": {
      name: "Resistance"
      unit: "Ohms",
      default_value: 1000,
      symbol: "Ω",
      data_type: parseFloat
      range: [0, Infinity]
      type: "physical"
    }
  }

  constructor: (xa, ya, xb, yb, params, f) ->
    super(xa, ya, xb, yb, params, f)

  value: ->
    @resistance

  draw: (renderContext) ->
    @calcLeads 32

    numSegments = 16
    width = 5

#    @setBboxPt @point1, @point2, width

    renderContext.drawLeads(this)

    parallelOffset = 1 / numSegments

    # Generate alternating sequence 0, 1, 0, -1, 0 ... to offset perpendicular to wire
    offsets = [0, 1, 0, -1]

    # Give "sawtooth" edges to resistor
    for n in [0...numSegments]
      resistorSegmentVoltage = @volts[0] + (@volts[1]-@volts[0]) * (n / numSegments)

      startPosition = Util.interpolate @lead1, @lead2, n*parallelOffset, width*offsets[n % 4]
      endPosition = Util.interpolate @lead1, @lead2, (n+1)*parallelOffset, width*offsets[(n+1) % 4]

      renderContext.drawLinePt startPosition, endPosition, Util.getVoltageColor(resistorSegmentVoltage)

    renderContext.drawValue 15, 0, this, Util.getUnitText(@resistance, @unitSymbol())

    @updateDots()
    renderContext.drawDots(@point1, @lead1, this)
    renderContext.drawDots(@lead2, @point2, this)

    renderContext.drawPosts(this)

    if CircuitComponent.DEBUG
      super(renderContext)

  unitSymbol: ->
    "Ω"

  getDumpType: ->
    "r"

  getInfo: (arr) ->
    arr[0] = "resistor"
    @getBasicInfo arr
    arr[3] = "R = " + Util.getUnitText(@resistance, @unitSymbol)
    arr[4] = "P = " + Util.getUnitText(@getPower(), "W")

    return arr

  needsShortcut: ->
    true

  calculateCurrent: ->
    @current = (@volts[0] - @volts[1]) / @resistance

  stamp: (stamper) ->
    if @orphaned()
      console.warn "attempting to stamp an orphaned resistor"

    stamper.stampResistor @nodes[0], @nodes[1], @resistance

  toString: ->
    "ResistorElm"

module.exports = ResistorElm
