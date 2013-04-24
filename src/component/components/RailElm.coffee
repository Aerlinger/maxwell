# <DEFINE>
define [
  'cs!Settings',
  'cs!DrawHelper',
  'cs!Polygon',
  'cs!Rectangle',
  'cs!Point'
  'cs!VoltageElm',
  'cs!CircuitComponent'
], (
  Settings,
  DrawHelper,
  Polygon,
  Rectangle,
  Point,

  VoltageElm,
  CircuitComponent
) ->
# </DEFINE>


  class RailElm extends VoltageElm

    @FLAG_CLOCK: 1

    constructor: (xa, ya, xb, yb, f, st) ->
      super xa, ya, xb, yb, f, st

    getDumpType: ->
      "R"

    getPostCount: ->
      1

    setPoints: ->
      super()
      @lead1 = DrawHelper.interpPoint(@point1, @point2, 1 - VoltageElm.circleSize / @dn)

    draw: ->
      @setBboxPt @point1, @point2, @circleSize
      color = @setVoltageColor(@volts[0])
      CircuitComponent.drawThickLinePt @point1, @lead1, color
      clock = @waveform is VoltageElm.WF_SQUARE and (@flags & VoltageElm.FLAG_CLOCK) isnt 0

      if @waveform is VoltageElm.WF_DC or @waveform is VoltageElm.WF_VAR or clock
        #Font f = new Font("SansSerif", 0, 12);
        #g.setFont(f);
        color = ((if @needsHighlight() then Settings.selectColor else Settings.whiteColor))

        #this.setPowerColor(g, false);
        v = @getVoltage()
        s = CircuitComponent.getShortUnitText(v, "V")
        s = v + "V" if Math.abs(v) < 1 #showFormat.format(v)
        s = "+" + s if @getVoltage() > 0
        s = "Ant" if this instanceof AntennaElm
        s = "CLK" if clock
        @drawCenteredText s, @x2, @y2, true
      else
        @drawWaveform @point2
      @drawPosts()
      @curcount = @updateDotCount(-@current, @curcount)
      @drawDots @point1, @lead1, @curcount  unless Circuit.dragElm is this

    getVoltageDiff: ->
      @volts[0]

    stamp: ->
      if @waveform is VoltageElm.WF_DC
        Circuit.stampVoltageSource 0, @nodes[0], @voltSource, @getVoltage()
      else
        Circuit.stampVoltageSource 0, @nodes[0], @voltSource

    doStep: ->
      Circuit.updateVoltageSource 0, @nodes[0], @voltSource, @getVoltage() unless @waveform is VoltageElm.WF_DC

    hasGroundConnection: (n1) ->
      true

  return RailElm