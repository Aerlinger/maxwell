CircuitComponent = require('../circuitComponent.js')
Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
Util = require('../../util/util.coffee')

class SparkGapElm extends CircuitComponent
  @Fields = {
    "onresistance": {
      name: "Resistance"
      unit: "Ohms",
      default_value: 1e3,
      symbol: "Ω",
      data_type: parseFloat
      range: [0, Infinity]
      type: "physical"
    },
    "offresistance": {
      name: "Resistance"
      unit: "Ohms",
      default_value: 1e9,
      symbol: "Ω",
      data_type: parseFloat
      range: [0, Infinity]
      type: "physical"
    },
    "breakdown": {
      name: "Voltage"
      unit: "Voltage"
      symbol: "V"
      default_value: 1e3
      data_type: parseFloat
      range: [-Infinity, Infinity]
      type: "physical"
    }
    "holdcurrent": {
      unit: "Amperes",
      name: "Current",
      symbol: "A",
      default_value: 0.001,
      data_type: parseFloat
      range: [-Infinity, Infinity]
      type: "physical"
    },
  }

  constructor: (xa, ya, xb, yb, params, f) ->
    @resistance = 0
    @offresistance = 1e9
    @onresistance = 1e3
    @breakdown = 1e3
    @holdcurrent = 0.001
    @state = false

    super(xa, ya, xb, yb, params, f)

  setPoints: ->
    super

    dist = 16
    alen = 8

    @calcLeads(dist + alen)

    p1 = Util.interpolate(@point1, @point2, (@dn() - alen) / (2 * @dn()))
    @arrow1 = Util.calcArrow(@point1, p1, alen, alen)

    p1 = Util.interpolate(@point1, @point2, (@dn() + alen) / (2 * @dn()))
    @arrow2 = Util.calcArrow(@point2, p1, alen, alen)

    @setBboxPt @point1, @point2, 8


#    if st
#      st = st.split(" ")  if typeof st is "string"
#      @onresistance = parseFloat(st?.shift())  if st
#      @offresistance = parseFloat(st?.shift())  if st
#      @breakdown = parseFloat(st?.shift())  if st
#      @holdcurrent = parseFloat(st?.shift())  if st

  nonLinear: ->
    true

  getDumpType: ->
    187


#      p1 = DrawHelper.interpPoint(@point1, @point2, (@dn() - alen) / (2 * @dn()))
#      @arrow1 = DrawHelper.calcArrow(@point1, p1, alen, alen)
#      p1 = DrawHelper.interpPoint(@point1, @point2, (@dn() + alen) / (2 * @dn()))
#      @arrow2 = DrawHelper.calcArrow(@point2, p1, alen, alen)

  draw: (renderContext) ->
    if CircuitComponent.DEBUG
      super(renderContext)

    @updateDots()

    dist = 16
    alen = 8
    @calcLeads dist + alen

    v1 = @volts[0]
    v2 = @volts[1]

    renderContext.drawLeads(this)

    color = Util.getVoltageColor(@volts[0])
    renderContext.drawThickPolygonP @arrow1, color

    color = Util.getVoltageColor(@volts[1])
    renderContext.drawThickPolygonP @arrow2, color

    renderContext.drawDots(@point1, @point2, this) if @state
    renderContext.drawPosts(this)

  calculateCurrent: ->
    @current = (@volts[0] - @volts[1]) / @resistance

  reset: ->
    super()
    @state = false

  startIteration: ->
    @state = false  if Math.abs(@current) < @holdcurrent
    vd = @volts[0] - @volts[1]
    @state = true  if Math.abs(vd) > @breakdown

  doStep: (stamper) ->
    if @state
#      console.log("SPARK!")
      @resistance = @onresistance
    else
      @resistance = @offresistance

    stamper.stampResistor @nodes[0], @nodes[1], @resistance

  toString: ->
    "SparkGapElm"

  stamp: (stamper) ->
    stamper.stampNonLinear @nodes[0]
    stamper.stampNonLinear @nodes[1]

  getInfo: (arr) ->
    arr[0] = "spark gap"
    @getBasicInfo arr
    arr[3] = (if @state then "on" else "off")
    arr[4] = "Ron = " + Util.getUnitText(@onresistance, "Ω")
    arr[5] = "Roff = " + Util.getUnitText(@offresistance, "Ω")
    arr[6] = "Vbreakdown = " + Util.getUnitText(@breakdown, "V")

  needsShortcut: ->
    false

module.exports = SparkGapElm
