CircuitComponent = require('../circuitComponent.coffee')
Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
Util = require('../../util/util.coffee')

class OutputElm extends CircuitComponent

  @FLAG_VALUE: 1

  constructor: (xa, ya, xb, yb, params, f) ->
    # st not used for OutputElm
    super(xa, ya, xb, yb, params, f)


  getDumpType: ->
    "O"

  getPostCount: ->
    1

  setPoints: ->
    super()
    @lead1 = new Point()

    @setBboxPt(@lead1, @point1, 8)

  draw: (renderContext) ->
    color = "#FFF"
    s = (if (@flags & OutputElm.FLAG_VALUE) isnt 0 then Util.getUnitText(@volts[0], "V") else "out")

    @lead1 = Util.interpolate @point1, @point2, 1 - (3 * s.length / 2 + 8) / @dn

    renderContext.drawValue -5, 25, this, s

    color = Util.getVoltageColor(@volts[0])

    renderContext.drawLinePt @point1, @lead1, color
    renderContext.drawCircle @lead1.x + Settings.POST_RADIUS, @lead1.y, Settings.POST_RADIUS, 1, Settings.STROKE_COLOR
    renderContext.drawPosts(this)

    if CircuitComponent.DEBUG
      super(renderContext)


  getVoltageDiff: ->
    @volts[0]

  getInfo: (arr) ->
    arr[0] = "output"
    arr[1] = "V = " + Util.getUnitText(@volts[0], "V")

  stamp: (stamper) ->

  toString: ->
    "OutputElm"

module.exports = OutputElm
