CircuitComponent = require('../circuitComponent.coffee')
Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
Util = require('../../util/util.coffee')

class ProbeElm extends CircuitComponent

  @FLAG_SHOWVOLTAGE: 1

  @Fields = []

  constructor: (xa, ya, xb, yb, params, f) ->
    super(xa, ya, xb, yb, params, f)

  getDumpType: ->
    "p"

  toString: ->
    "ProbeElm"

  setPoints: ->
    super()

    # swap points so that we subtract higher from lower
    if @point2.y < @point1.y
      x = @point1
      @point1 = @point2
      @point2 = x

    @center = @getCenter()

  draw: (renderContext) ->
    if CircuitComponent.DEBUG
      super(renderContext)

    hs = 8
    @setBboxPt @point1, @point2, hs
    #      selected = (@needsHighlight() or Circuit.plotYElm is this)

    #      if selected or Circuit.dragElm is this
    #        len = 16
    #      else
    len = @dn - 32

    @calcLeads Math.floor(len)

#    if @isSelected()
#      color = Settings.SELECT_COLOR
#    else
    color = Util.getVoltageColor(@volts[0])

    renderContext.drawLinePt @point1, @lead1, color

#    if @isSelected()
#      color = Settings.SELECT_COLOR
#    else
    color = Util.getVoltageColor(@volts[1])

    renderContext.drawLinePt @lead2, @point2, color

    #      renderContext.setFont new Font("SansSerif", Font.BOLD, 14)

    #      renderContext.drawCenteredText("X", @center.x1, @center.y, color) if this is Circuit.plotXElm
    #      renderContext.drawCenteredText("Y", @center.x1, @center.y, color) if this is Circuit.plotYElm

    if @mustShowVoltage()
      unit_text = Util.getUnitText(@volts[0], "V")
#      @drawValues unit_text, 4, renderContext

    renderContext.drawPosts(this)

  mustShowVoltage: ->
    (@flags & ProbeElm.FLAG_SHOWVOLTAGE) isnt 0

  getInfo: (arr) ->
    arr[0] = "scope probe"
    arr[1] = "Vd = " + getUnitText(@getVoltageDiff(), "V")

  stamp: (stamper) ->

  getConnection: (n1, n2) ->
    false


module.exports = ProbeElm
