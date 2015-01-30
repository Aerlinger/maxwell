Settings = require('../../settings/settings.coffee')
DrawHelper = require('../../render/drawHelper.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
CircuitComponent = require('../circuitComponent.coffee')

class CurrentElm extends CircuitComponent
  @ParameterDefinitions = {
    "currentValue": {
      unit: "Amperes",
      name: "Current",
      symbol: "A",
      default_value: 0.01,
      data_type: "float"
      range: [-Infinity, Infinity]
      type: "physical"
    }
  }

  constructor: (xa, ya, xb, yb, f, params) ->
    super(xa, ya, xb, yb, f, params)

  dump: ->
    super() + " " + @currentValue

  getDumpType: ->
    "i"

  setPoints: ->
    super()

    @calcLeads 26

    @ashaft1 = DrawHelper.interpPoint(@lead1, @lead2, .25)
    @ashaft2 = DrawHelper.interpPoint(@lead1, @lead2, .6)
    @center = DrawHelper.interpPoint(@lead1, @lead2, .5)

    p2 = DrawHelper.interpPoint(@lead1, @lead2, .75)

    @arrow = DrawHelper.calcArrow(@center, p2, 4, 4)

  draw: (renderContext) ->
    cr = 12
    @draw2Leads(renderContext)
    color = DrawHelper.getVoltageColor (@volts[0] + @volts[1]) / 2
#      @setPowerColor false
    renderContext.drawCircle @center.x, @center.y, cr
    renderContext.drawCircle @ashaft1, @ashaft2
    renderContext.fillPolygon @arrow
    renderContext.setBboxPt @point1, @point2, cr

#      if Circuit.showValuesCheckItem
#        s = DrawHelper.getShortUnitText(@currentValue, "A")
#        @drawValues s, cr  if @dx is 0 or @dy is 0

    @drawPosts(renderContext)
    @doDots(renderContext)

  stamp: (stamper) ->
    @current = @currentValue
    stamper.stampCurrentSource @nodes[0], @nodes[1], @current

#    getEditInfo: (n) ->
#      return new EditInfo("Current (A)", @currentValue, 0, .1)  if n is 0

#    setEditValue: (n, ei) ->
#      @currentValue = ei.value

  getInfo: (arr) ->
    super()
    arr[0] = "current source"
    @getBasicInfo arr

  getVoltageDiff: ->
    @volts[1] - @volts[0]

module.exports = CurrentElm
