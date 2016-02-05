CircuitComponent = require('../circuitComponent.coffee')
Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
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

  constructor: (xa, ya, xb, yb, params) ->
    super(xa, ya, xb, yb, params)

  value: ->
    @resistance

  draw: (renderContext) ->
    @calcLeads 32
    @updateDots()

    numSegments = 16
    width = 5

    @setBboxPt @point1, @point2, width

    renderContext.drawLeads(this)

    parallelOffset = 1 / numSegments

    # Generate alternating sequence 0, 1, 0, -1, 0 ... to offset perpendicular to wire
    offsets = [0, 1, 0, -1]

    # Give "sawtooth" edges to resistor
    for n in [0...numSegments]
      resistorSegmentVoltage = @volts[0] + (@volts[1]-@volts[0]) * (n / numSegments)

      startPosition = renderContext.interpolate @lead1, @lead2, n*parallelOffset, width*offsets[n % 4]
      endPosition = renderContext.interpolate @lead1, @lead2, (n+1)*parallelOffset, width*offsets[(n+1) % 4]

      renderContext.drawLinePt startPosition, endPosition, renderContext.getVoltageColor(resistorSegmentVoltage)

    renderContext.drawValue 10, 0, this, @getUnitText(@resistance, @unitSymbol())

    renderContext.drawDots(@point1, @point2, this)
    renderContext.drawPosts(this)

  unitSymbol: ->
    "Ω"

  getDumpType: ->
    "r"

  getInfo: (arr) ->
    arr[0] = "resistor"
    @getBasicInfo arr
    arr[3] = "R = " + @getUnitText(@resistance, @unitSymbol)
    arr[4] = "P = " + @getUnitText(@getPower(), "W")

    return arr

  needsShortcut: ->
    true

  calculateCurrent: ->
    @current = (@volts[0] - @volts[1]) / @resistance

  stamp: (stamper) ->
#    console.log("\n::Stamping Resistor::")

    if @orphaned()
      console.warn "attempting to stamp an orphaned resistor"

    stamper.stampResistor @nodes[0], @nodes[1], @resistance

  toString: ->
    "ResistorElm"

module.exports = ResistorElm
