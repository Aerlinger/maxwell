Settings = require('../../settings/settings.coffee')
DrawHelper = require('../../render/drawHelper.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
CircuitComponent = require('../circuitComponent.coffee')

class SparkGapElm extends CircuitComponent
  @ParameterDefinitions = {
    "onresistance": {
      name: "Resistance"
      unit: "Ohms",
      default_value: 1e3,
      symbol: "Ω",
      data_type: "float"
      range: [0, Infinity]
      type: "physical"
    },
    "offresistance": {
      name: "Resistance"
      unit: "Ohms",
      default_value: 1e9,
      symbol: "Ω",
      data_type: "float"
      range: [0, Infinity]
      type: "physical"
    },
    "breakdown": {
      name: "Voltage"
      unit: "Voltage"
      symbol: "V"
      default_value: 1e3
      data_type: "float"
      range: [-Infinity, Infinity]
      type: "physical"
    }
    "holdcurrent": {
      unit: "Amperes",
      name: "Current",
      symbol: "A",
      default_value: 0.001,
      data_type: "float"
      range: [-Infinity, Infinity]
      type: "physical"
    },
  }

  constructor: (xa, ya, xb, yb, f, params) ->
    @resistance = 0
    @offresistance = 1e9
    @onresistance = 1e3
    @breakdown = 1e3
    @holdcurrent = 0.001
    @state = false

    super(xa, ya, xb, yb, f, params)


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

  dump: ->
    "#{super()} #{@onresistance} #{@offresistance} #{@breakdown} #{@holdcurrent}"

  setPoints: ->
    super()

    dist = 16
    alen = 8
    @calcLeads dist + alen

#      p1 = DrawHelper.interpPoint(@point1, @point2, (@dn - alen) / (2 * @dn))
#      @arrow1 = DrawHelper.calcArrow(@point1, p1, alen, alen)
#      p1 = DrawHelper.interpPoint(@point1, @point2, (@dn + alen) / (2 * @dn))
#      @arrow2 = DrawHelper.calcArrow(@point2, p1, alen, alen)

#    draw: (renderContext) ->
#      v1 = @volts[0]
#      v2 = @volts[1]
#      @setBboxPt @point1, @point2, 8
#      @draw2Leads()
#      @setPowerColor true
#      color = @setVoltageColor(@volts[0])
#      CircuitComponent.drawThickPolygonP @arrow1, color
#      color = @setVoltageColor(@volts[1])
#      CircuitComponent.drawThickPolygonP @arrow2, color
#      @doDots() if @state
#      @drawPosts()

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
      console.log("SPARK!")
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
    arr[4] = "Ron = " + DrawHelper.getUnitText(@onresistance, Maxwell.OhmSymbol)
    arr[5] = "Roff = " + DrawHelper.getUnitText(@offresistance, Maxwell.OhmSymbol)
    arr[6] = "Vbreakdown = " + DrawHelper.getUnitText(@breakdown, "V")

  needsShortcut: ->
    false

module.exports = SparkGapElm
