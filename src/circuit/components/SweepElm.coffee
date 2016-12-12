CircuitComponent = require('../circuitComponent.coffee')
Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
Util = require('../../util/util.coffee')

class SweepElm extends CircuitComponent
  @FLAG_LOG: 1
  @FLAG_BIDIR: 2
  @circleSize: 17

  @Fields = {
    "minF": {
      name: "Min. Frequency"
      unit: "Hertz"
      default_value: 20
      symbol: "Hz"
      data_type: parseFloat
    },
    "maxF": {
      name: "Min. Frequency"
      unit: "Hertz"
      default_value: 4e4
      symbol: "Hz"
      data_type: parseFloat
    },
    "maxV": {
      name: "Voltage"
      unit: "Voltage"
      symbol: "V"
      default_value: 5
      data_type: parseFloat
    },
    "sweepTime": {
      unit: "seconds"
      name: "Time"
      symbol: "s"
      default_value: 0.1
      data_type: parseFloat
      range: [0, -Infinity]
    }
  }

  constructor: (xa, ya, xb, yb, params, f) ->
    @dir = 1

    super(xa, ya, xb, yb, params, f)

  onSolder: (circuit) ->
    @reset()

  getDumpType: ->
    170

  getPostCount: ->
    1

  draw: (renderContext) ->
    if CircuitComponent.DEBUG
      super(renderContext)

    color = Util.getVoltageColor(@volts[0])
    @lead1 = Util.interpolate(@point1, @point2, 1 - SweepElm.circleSize / @dn())

    renderContext.drawLinePt @point1, @lead1, color
#    @setVoltageColor (if @needsHighlight() then CircuitComponent.selectColor else Color.GREY)
#    @setVoltageColor(Color.GREY)
#    powerColor = @setPowerColor(false)

    xc = @point2.x
    yc = @point2.y

    renderContext.drawCircle xc, yc, SweepElm.circleSize

    wl = 8

#    @adjustBbox xc - SweepElm.circleSize, yc - SweepElm.circleSize, xc + SweepElm.circleSize, yc + SweepElm.circleSize

    xl = 10
    ox = -1
    oy = -1
    tm = (new Date()).getTime() #System.currentTimeMillis()
    #double w = (this == mouseElm ? 3 : 2)

    tm %= 2000
    if tm > 1000
      tm = 2000 - tm

#    if Circuit.stoppedCheck
#      w = 1 + tm * .002
#    else
    w = 1 + 2 * (@frequency - @minF) / (@maxF - @minF)

    i = -xl

    while i <= xl
      yy = yc + Math.floor(.95 * Math.sin(i * Math.PI * w / xl) * wl)

      unless ox is -1
        renderContext.drawLine ox, oy, xc + i, yy

      ox = xc + i
      oy = yy
      i++

#    if Circuit.showValuesCheckItem
#      s = renderContext.getShortUnitText(@frequency, "Hz")
#      if @axisAligned()
#        @drawValues s, @circleSize

    renderContext.drawPosts(this)

    @updateDots()
    renderContext.drawDots(@point1, @point2, this)
#    @curcount = @updateDotCount(-@current, @curcount)
#    @drawDots @point1, @lead1, @curcount  unless Circuit.dragElm is this

  stamp: (stamper) ->
    stamper.stampVoltageSource 0, @nodes[0], @voltSource

  setPoints: ->
    super
    Util.interpolate(@point1, @point2, 1 - SweepElm.circleSize / @dn())

  setParams: ->
    if @frequency < @minF or @frequency > @maxF
      @frequency = @minF
      @freqTime = 0
      @dir = 1

    if (@flags & SweepElm.FLAG_LOG) is 0
      @fadd = @dir * @getParentCircuit().timeStep() * (@maxF - @minF) / @sweepTime
      @fmul = 1
    else
      @fadd = 0
      @fmul = Math.pow(@maxF / @minF, @dir * @getParentCircuit().timeStep() / @sweepTime)

    @savedTimeStep = @getParentCircuit().timeStep()

  reset: ->
    @frequency = @minF
    @freqTime = 0
    @dir = 1
    @setParams()

  startIteration: ->
    # has timestep been changed?
    unless @getParentCircuit().timeStep() is @savedTimeStep
      @setParams()

    @v = Math.sin(@freqTime) * @maxV

    @freqTime += @frequency * 2 * Math.PI * @getParentCircuit().timeStep()
    @frequency = @frequency * @fmul + @fadd
    if @frequency >= @maxF and @dir is 1
      unless (@flags & SweepElm.FLAG_BIDIR) is 0
        @fadd = -@fadd
        @fmul = 1 / @fmul
        @dir = -1
      else
        @frequency = @minF
    if @frequency <= @minF and @dir is -1
      @fadd = -@fadd
      @fmul = 1 / @fmul
      @dir = 1

  doStep: (stamper) ->
    stamper.updateVoltageSource 0, @nodes[0], @voltSource, @v

  getVoltageDiff: ->
    @volts[0]

  getVoltageSourceCount: ->
    1

  hasGroundConnection: (n1) ->
    true

  getInfo: (arr) ->
    arr[0] = "sweep " + ((if ((@flags & SweepElm.FLAG_LOG) is 0) then "(linear)" else "(log)"))
    arr[1] = "I = " + Util.getUnitText(@getCurrent(), "A")
    arr[2] = "V = " + Util.getUnitText(@volts[0], "V")
    arr[3] = "f = " + Util.getUnitText(@frequency, "Hz")
    arr[4] = "range = " + Util.getUnitText(@minF, "Hz") + " .. " + Util.getUnitText(@maxF, "Hz")
    arr[5] = "time = " + Util.getUnitText(@sweepTime, "s")

module.exports = SweepElm
