Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
CircuitComponent = require('../circuitComponent.coffee')

class OutputElm extends CircuitComponent

  @FLAG_VALUE: 1

  constructor: (xa, ya, xb, yb, params) ->
    # st not used for OutputElm
    super(xa, ya, xb, yb, params)


  getDumpType: ->
    "O"

  getPostCount: ->
    1

  setPoints: ->
    super()
    @lead1 = new Point()

  draw: (renderContext) ->
#      selected = (@needsHighlight() or Circuit.plotYElm is this)
#    selected = @needsHighlight()

    #Font f = new Font("SansSerif", selected ? Font.BOLD : 0, 14);
    #g.setFont(f);
    color = "#FFF";
    s = (if (@flags & OutputElm.FLAG_VALUE) isnt 0 then @getUnitText(@volts[0], "V") else "out")

    #FontMetrics fm = g.getFontMetrics();
#      s = "X"  if this is Circuit.plotXElm
#      s = "Y"  if this is Circuit.plotYElm

    @lead1 = renderContext.interpolate @point1, @point2, 1 - (3 * s.length / 2 + 8) / @dn

    @setBboxPt @point1, @lead1, 0
    renderContext.drawValue 0, 0, this, s

    color = renderContext.getVoltageColor(@volts[0])

    renderContext.drawLinePt @point1, @lead1, color
    renderContext.drawPosts(this)

  getVoltageDiff: ->
    @volts[0]

  getInfo: (arr) ->
    arr[0] = "output"
    arr[1] = "V = " + @getUnitText(@volts[0], "V")

  stamp: (stamper) ->

  toString: ->
    "OutputElm"

module.exports = OutputElm
