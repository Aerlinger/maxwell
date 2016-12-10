CircuitComponent = require('../circuitComponent.coffee')
Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
Util = require('../../util/util.coffee')

class WireElm extends CircuitComponent
  @FLAG_SHOWCURRENT: 1
  @FLAG_SHOWVOLTAGE: 2

  @Fields = []

  constructor: (xa, ya, xb, yb, params, f) ->
    super(xa, ya, xb, yb, params, f)

  getName: ->
    "Wire"

  draw: (renderContext) ->
#    if CircuitComponent.DEBUG
#      super(renderContext)

    @updateDots()
    renderContext.drawDots(@point1, @point2, this)

    renderContext.drawLinePt @point1, @point2, Util.getVoltageColor(@volts[0])
#    @setBboxPt @point1, @point2, 3

    if @mustShowCurrent()
      s = Util.getUnitText(Math.abs(@getCurrent()), "A")
    else if @mustShowVoltage()
      s = Util.getUnitText(@volts[0], "V")

    @updateDots()
    renderContext.drawDots(@point1, @point2, this)

#    renderContext.drawPosts(this)


  stamp: (stamper) ->
#    console.log("\n::Stamping WireElm::")
    stamper.stampVoltageSource @nodes[0], @nodes[1], @voltSource, 0

  mustShowCurrent: ->
    (@flags & WireElm.FLAG_SHOWCURRENT) isnt 0

  mustShowVoltage: ->
    (@flags & WireElm.FLAG_SHOWVOLTAGE) isnt 0

  getVoltageSourceCount: ->
    1

  getInfo: (arr) ->
    super()

    arr[0] = "Wire"
    arr[1] = "I = " + Util.getUnitText(@getCurrent(), "A")
    arr[2] = "V = " + Util.getUnitText(@volts[0], "V")

  getDumpType: ->
    "w"

  getPower: ->
    0

  getVoltageDiff: ->
    @volts[0]

  isWire: ->
    true

  needsShortcut: ->
    true

module.exports = WireElm
