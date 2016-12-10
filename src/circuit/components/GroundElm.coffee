CircuitComponent = require('../circuitComponent.coffee')
Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
Util = require('../../util/util.coffee')

class GroundElm extends CircuitComponent

  @Fields = []

  constructor: (xa, ya, xb, yb, params, f) ->
    super(xa, ya, xb, yb, params, f)

  getDumpType: ->
    "g"

  getPostCount: ->
    1

  draw: (renderContext) ->
    if CircuitComponent.DEBUG
      super(renderContext)

    @updateDots()

    color = Util.getVoltageColor(0)

    renderContext.drawLinePt @point1, @point2, color

    for row in [0...3]
      startPt = 10 - row * 2
      endPt = row * 3
      [pt1, pt2] = Util.interpolateSymmetrical @point1, @point2, 1 + endPt / @dn, startPt
      renderContext.drawLinePt pt1, pt2, color

    pt2 = Util.interpolate @point1, @point2, 1 + 11.0 / @dn

    renderContext.drawDots(@point1, @point2, this)
    renderContext.drawPosts this

  setCurrent: (x, currentVal) ->
    @current = -currentVal

  stamp: (stamper) ->
#    console.log("\n::Stamping GroundElm::")
    stamper.stampVoltageSource 0, @nodes[0], @voltSource, 0

  getVoltageDiff: ->
    0

  getVoltageSourceCount: ->
    1

  getInfo: (arr) ->
    super()
    arr[0] = "ground"
    arr[1] = "I = " + Util.getUnitText(@getCurrent(), "A")

  hasGroundConnection: (n1) ->
    true

  needsShortcut: ->
    true

  toString: ->
    "GroundElm"

module.exports = GroundElm

