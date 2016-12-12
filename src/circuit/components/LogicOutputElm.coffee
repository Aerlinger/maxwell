CircuitComponent = require('../circuitComponent.coffee')
Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
Util = require('../../util/util.coffee')

class LogicOutputElm extends CircuitComponent
  @FLAG_TERNARY = 1
  @FLAG_NUMERIC = 2
  @FLAG_PULLDOWN = 4

  @Fields = {
    threshold: {
      name: "Threshold Voltage"
      data_type: parseFloat
      default_value: 2.5
    }
  }


  constructor: (xa, ya, xb, yb, params, f) ->
    super(xa, ya, xb, yb, params, f)


  isTernary: ->
    (@flags & LogicOutputElm.FLAG_TERNARY) != 0

  isNumeric: ->
    (@flags & (LogicOutputElm.FLAG_TERNARY | LogicOutputElm.FLAG_NUMERIC)) != 0

  needsPullDown: ->
    (@flags & LogicOutputElm.FLAG_PULLDOWN) != 0

  getDumpType: ->
    'M'

  getPostCount: ->
    1

  draw: (renderContext) ->
    s = if @volts < @threshold then "L" else "H"

    if @isTernary()
      if (@volts[0] > 3.75)
        s = "2"
      else if (@volts[0] > 1.25)
        s = "1"
      else
        s = "0"
    else if @isNumeric()
      s = if (@volts[0] < @threshold) then "0" else "1"

    @value = s

    renderContext.fillText(s, @x2, @y2)

    color = Util.getVoltageColor(@volts[0])
    renderContext.drawLinePt(@point1, @lead1, color)
    renderContext.drawPosts(this)

    if CircuitComponent.DEBUG
      super(renderContext)

  setPoints: ->
    super()

    @lead1 = Util.interpolate(@point1, @point2, 1 - 12 / @dn)


  stamp: (stamper) ->
    if @needsPullDown()
      stamper.stampResistor(@nodes[0], 0, 1e6)

  getVoltageDiff: ->
    return @volts[0]



module.exports = LogicOutputElm
