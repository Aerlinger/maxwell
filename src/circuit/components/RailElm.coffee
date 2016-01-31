Settings = require('../../settings/settings.coffee')
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

  draw: (renderContext) ->
    @lead1 = renderContext.interpolate(@point1, @point2, 1 - VoltageElm.circleSize / @dn)

    @updateDots()
    @setBboxPt @point1, @point2, @circleSize

    color = renderContext.getVoltageColor(@volts[0])
    renderContext.drawLinePt @point1, @lead1, color

    clock = @waveform is VoltageElm.WF_SQUARE and (@flags & VoltageElm.FLAG_CLOCK) isnt 0

    if @waveform is VoltageElm.WF_DC or @waveform is VoltageElm.WF_VAR or clock
      color = "#FFFFFF"  #((if @needsHighlight() then Settings.SELECT_COLOR else "#FFFFFF"))

      #this.setPowerColor(g, false);
      v = @getVoltage()

      s = @getUnitText(v, "V")
      s = v + "V" if Math.abs(v) < 1 #showFormat.format(v)
      s = "+" + s if @getVoltage() > 0

      s = "Ant" if this instanceof AntennaElm
      s = "CLK" if clock

      renderContext.drawValue 0, 0, this, s
    else
      @drawWaveform @point2, renderContext

    renderContext.drawDots(@point2, @point1, this)
    renderContext.drawPosts(this)

    renderContext.drawDots @point1, @lead1, this # @curcount  unless Circuit.dragElm is this

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
