CircuitComponent = require('../circuitComponent.coffee')
Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
Util = require("../../util/util.coffee")

VoltageElm = require('./VoltageElm.coffee')


class RailElm extends VoltageElm
  @FLAG_CLOCK: 1

  constructor: (xa, ya, xb, yb, params, f) ->
    super(xa, ya, xb, yb, params, f)

  getDumpType: ->
    "R"

  getPostCount: ->
    1

  draw: (renderContext) ->
    @lead1 = Util.interpolate(@point1, @point2, 1 - VoltageElm.circleSize / @dn())

    @setBboxPt @point1, @point2, @circleSize
    renderContext.drawLinePt @point2, @point1, Settings.STROKE_COLOR

    color = Util.getVoltageColor(@volts[0])
    renderContext.drawLinePt @point1, @lead1, color

    clock = @waveform is VoltageElm.WF_SQUARE and (@flags & VoltageElm.FLAG_CLOCK) isnt 0

    @updateDots()

#    renderContext.drawDots @point2, @point1, this
    renderContext.drawDots @lead1, @point1, this
    renderContext.drawPosts(this)

    if @waveform is VoltageElm.WF_DC or @waveform is VoltageElm.WF_VAR or clock
      color = "#FFFFFF"  #((if @needsHighlight() then Settings.SELECT_COLOR else "#FFFFFF"))

      #this.setPowerColor(g, false);
      v = @getVoltage()

      s = Util.getUnitText(v, "V")
      s = v + "V" if Math.abs(v) < 1 #showFormat.format(v)
      s = "+" + s if @getVoltage() > 0

      renderContext.fillText(s, @point2.x, @point2.y - 5)

#      s = "Ant" if this instanceof AntennaElm
      s = "CLK" if clock

      Util.drawValue 0, 0, this, s
    else
      @drawWaveform @point2, renderContext

#    if CircuitComponent.DEBUG
#      super(renderContext)


#    renderContext.drawDots @point1, @lead1, this # @curcount  unless Circuit.dragElm is this

  getVoltageDiff: ->
    @volts[0]

#    getVoltage: ->
#      super()

  setPoints: ->
    super

    @lead1 = Util.interpolate(@point1, @point2, 1 - @circleSize / @dn())

  stamp: (stamper) ->
#    console.log("\n::Stamping RailElm:: " + @waveform)
    if @waveform is VoltageElm.WF_DC
      stamper.stampVoltageSource 0, @nodes[0], @voltSource, @getVoltage()
    else
      stamper.stampVoltageSource 0, @nodes[0], @voltSource
#    stamper.stampVoltageSource 0, @nodes[0], @voltSource

  doStep: (stamper) ->
#    e = new Error("DOSTEP")

#    console.log(e.stack)
#    console.log("WF", @waveform, @voltSource, @getVoltage())
    unless @waveform is VoltageElm.WF_DC
      stamper.updateVoltageSource 0, @nodes[0], @voltSource, @getVoltage()

  hasGroundConnection: (n1) ->
    true

module.exports = RailElm
