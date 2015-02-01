Settings = require('../../settings/settings.coffee')
DrawHelper = require('../../render/drawHelper.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
CircuitComponent = require('../circuitComponent.coffee')

VoltageElm = require('./VoltageElm.coffee')
AntennaElm = require('./AntennaElm.coffee')


class RailElm extends VoltageElm
  @FLAG_CLOCK: 1

  constructor: (xa, ya, xb, yb, params) ->
    super(xa, ya, xb, yb, params)

  getDumpType: ->
    "R"

  getPostCount: ->
    1

  setPoints: ->
    super()
    @lead1 = DrawHelper.interpPoint(@point1, @point2, 1 - VoltageElm.circleSize / @dn)

  draw: (renderContext) ->
    @setBboxPt @point1, @point2, @circleSize

    color = DrawHelper.getVoltageColor(@volts[0])
    renderContext.drawThickLinePt @point1, @lead1, color

    clock = @waveform is VoltageElm.WF_SQUARE and (@flags & VoltageElm.FLAG_CLOCK) isnt 0

    if @waveform is VoltageElm.WF_DC or @waveform is VoltageElm.WF_VAR or clock
      color = ((if @needsHighlight() then Settings.SELECT_COLOR else "#FFFFFF"))

      #this.setPowerColor(g, false);
      v = @getVoltage()

      s = DrawHelper.getShortUnitText(v, "V")
      s = v + "V" if Math.abs(v) < 1 #showFormat.format(v)
      s = "+" + s if @getVoltage() > 0

      s = "Ant" if this instanceof AntennaElm
      s = "CLK" if clock

      @drawCenteredText s, @x2, @y2, true, renderContext
    else
      @drawWaveform @point2, renderContext

    @drawPosts(renderContext)
#      @curcount = @updateDotCount(-@current, @curcount)

    @drawDots @point1, @lead1, renderContext # @curcount  unless Circuit.dragElm is this

  getVoltageDiff: ->
    @volts[0]

#    getVoltage: ->
#      super()

  stamp: (stamper) ->
    if @waveform is VoltageElm.WF_DC
      stamper.stampVoltageSource 0, @nodes[0], @voltSource, @getVoltage()
    else
      stamper.stampVoltageSource 0, @nodes[0], @voltSource

  doStep: (stamper) ->
    stamper.updateVoltageSource 0, @nodes[0], @voltSource, @getVoltage() unless @waveform is VoltageElm.WF_DC

  hasGroundConnection: (n1) ->
    true

module.exports = RailElm
