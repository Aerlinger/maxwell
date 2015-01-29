Settings = require('../../settings/settings.coffee')
DrawHelper = require('../../render/drawHelper.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
CircuitComponent = require('../circuitComponent.coffee')

class GroundElm extends CircuitComponent

  constructor: (xa, ya, xb, yb, f, st) ->
    super xa, ya, xb, yb, f, st

  getDumpType: ->
    "g"

  getPostCount: ->
    1

  draw: (renderContext) ->
    color = DrawHelper.getVoltageColor(0)

    renderContext.drawThickLinePt @point1, @point2, color

    for row in [0...3]
      startPt = 10 - row * 2
      endPt = row * 3
      [pt1, pt2] = DrawHelper.interpPoint2 @point1, @point2, 1 + endPt / @dn, startPt
      renderContext.drawThickLinePt pt1, pt2, color

    pt2 = DrawHelper.interpPoint @point1, @point2, 1 + 11.0 / @dn
    @setBboxPt @point1, pt2, 11
    @drawPost @x1, @y1, @nodes[0], renderContext

    @drawDots(@point1, @point2, renderContext)

  setCurrent: (x, currentVal) ->
    @current = -currentVal

  stamp: (stamper) ->
    console.log("\nStamping Ground Elm")
#      console.log("vs: #{@voltSource}")
    stamper.stampVoltageSource 0, @nodes[0], @voltSource, 0

  getVoltageDiff: ->
    0

  getVoltageSourceCount: ->
    1

  getInfo: (arr) ->
    super()
    arr[0] = "ground"
    arr[1] = "I = " + DrawHelper.getCurrentText(@getCurrent())

  hasGroundConnection: (n1) ->
    true

  needsShortcut: ->
    true

  toString: ->
    "GroundElm"

module.exports = GroundElm
