Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
CircuitComponent = require('../circuitComponent.coffee')

class GroundElm extends CircuitComponent

  constructor: (xa, ya, xb, yb, params) ->
    super(xa, ya, xb, yb, params)

  getDumpType: ->
    "g"

  getPostCount: ->
    1

  draw: (renderContext) ->
    @updateDots()

    color = renderContext.getVoltageColor(0)

    renderContext.drawLinePt @point1, @point2, color

    for row in [0...3]
      startPt = 10 - row * 2
      endPt = row * 3
      [pt1, pt2] = renderContext.interpolateSymmetrical @point1, @point2, 1 + endPt / @dn, startPt
      renderContext.drawLinePt pt1, pt2, color

    pt2 = renderContext.interpolate @point1, @point2, 1 + 11.0 / @dn
    @setBboxPt @point1, pt2, 11

    renderContext.drawDots(@point1, @point2, this)
    renderContext.drawPosts this

  setCurrent: (x, currentVal) ->
    @current = -currentVal

  stamp: (stamper) ->
#    console.log("\nStamping Ground Elm")
#      console.log("vs: #{@voltSource}")
    stamper.stampVoltageSource 0, @nodes[0], @voltSource, 0

  getVoltageDiff: ->
    0

  getVoltageSourceCount: ->
    1

  getInfo: (arr) ->
    super()
    arr[0] = "ground"
    arr[1] = "I = " + getUnitText(@getCurrent(), "A")

  hasGroundConnection: (n1) ->
    true

  needsShortcut: ->
    true

  toString: ->
    "GroundElm"

module.exports = GroundElm

