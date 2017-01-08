CircuitComponent = require('../circuitComponent.js')
Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
Util = require('../../util/util.coffee')

class CurrentElm extends CircuitComponent
  @Fields = {
    "currentValue": {
      unit: "Amperes",
      name: "Current",
      symbol: "A",
      default_value: 0.01,
      data_type: parseFloat
      range: [-Infinity, Infinity]
      type: "physical"
    }
  }

  constructor: (xa, ya, xb, yb, params, f) ->
    super(xa, ya, xb, yb, params, f)

  getDumpType: ->
    "i"

  draw: (renderContext) ->
    if CircuitComponent.DEBUG
      super(renderContext)

    @calcLeads 26

    @ashaft1 = Util.interpolate(@lead1, @lead2, .25)
    @ashaft2 = Util.interpolate(@lead1, @lead2, .6)
    @center = Util.interpolate(@lead1, @lead2, .5)

    p2 = Util.interpolate(@lead1, @lead2, .75)

    @arrow = Util.calcArrow(@center, p2, 4, 4)

    @updateDots()
    renderContext.drawLeads(this)
    renderContext.drawDots(@point1, @lead1, this)
    renderContext.drawDots(@lead2, @point2, this)

    cr = 12
    color = Util.getVoltageColor (@volts[0] + @volts[1]) / 2
#      @setPowerColor false
    renderContext.drawCircle @center.x, @center.y, cr
    renderContext.fillCircle @center.x, @center.y, cr, Settings.LINE_WIDTH, Settings.FG_COLOR
    renderContext.drawLinePt @ashaft1, @ashaft2
    renderContext.drawThickPolygonP @arrow, Settings.STROKE_COLOR, Settings.STROKE_COLOR

#      if Circuit.showValuesCheckItem
#        s = DrawHelper.getShortUnitText(@currentValue, "A")
#        @drawValues s, cr  if @dx() is 0 or @dy() is 0

    renderContext.drawPosts(this)


  stamp: (stamper) ->
    @current = @currentValue
    stamper.stampCurrentSource @nodes[0], @nodes[1], @current

  getInfo: (arr) ->
    super()
    arr[0] = "current source"
    @getBasicInfo arr

  getVoltageDiff: ->
    @volts[1] - @volts[0]

module.exports = CurrentElm
