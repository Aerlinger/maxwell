Settings = require('../../settings/settings.coffee')
DrawHelper = require('../../render/drawHelper.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
CircuitComponent = require('../circuitComponent.coffee')

class SweepElm extends CircuitComponent
  @FLAG_LOG: 1
  @FLAG_BIDIR: 2
  @circleSize: 17

  @ParameterDefinitions = {
    "minF": {
      name: "Frequency"
      unit: "Hertz",
      default_value: 20,
      symbol: "Hz",
      data_type: "float"
      range: [-Infinity, Infinity]
      type: "physical"
    },
    "maxF": {
      name: "Frequency"
      unit: "Hertz",
      default_value: 4e4,
      symbol: "Hz",
      data_type: "float"
      range: [-Infinity, Infinity]
      type: "physical"
    },
    "maxV": {
      name: "Voltage"
      unit: "Voltage"
      symbol: "V"
      default_value: 5
      data_type: "float"
      range: [-Infinity, Infinity]
      type: "physical"
    },
    "sweepTime": {
      unit: "seconds",
      name: "Time",
      symbol: "s",
      default_value: 0.1,
      data_type: "float"
      range: [0, -Infinity]
      type: "physical"
    }
  }

  constructor: (xa, ya, xb, yb, f, params) ->
    @dir = 1

#    if st
#      st = st.split(" ")  if typeof st is "string"
#
#      Define defaults:
#      @minF = (if st[0] then parseFloat(st[0]) else 20)
#      @maxF = (if st[1] then parseFloat(st[1]) else 4e4)
#      @maxV = (if st[2] then parseFloat(st[2]) else 5)
#      @sweepTime = (if st[3] then parseFloat(st[3]) else 0.1)

    @reset()

    super(xa, ya, xb, yb, f, params)


  getDumpType: ->
    170

  getPostCount: ->
    1

  setPoints: ->
    CircuitComponent::setPoints.call this
    @lead1 = DrawHelper.interpPoint(@point1, @point2, 1 - @circleSize / @dn)

  draw: ->
    @setBboxPt @point1, @point2, @circleSize
    color = @setVoltageColor(@volts[0])
    CircuitComponent.drawThickLinePt @point1, @lead1, color
    @setVoltageColor (if @needsHighlight() then CircuitComponent.selectColor else Color.GREY)
    powerColor = @setPowerColor(false)
    xc = @point2.x1
    yc = @point2.y
    CircuitComponent.drawCircle xc, yc, @circleSize
    wl = 8
    @adjustBbox xc - @circleSize, yc - @circleSize, xc + @circleSize, yc + @circleSize
    i = undefined
    xl = 10
    ox = -1
    oy = -1
    tm = (new Date()).getTime() #System.currentTimeMillis();
    #double w = (this == mouseElm ? 3 : 2);
    tm %= 2000
    tm = 2000 - tm  if tm > 1000
    w = 1 + tm * .002
    w = 1 + 2 * (@frequency - @minF) / (@maxF - @minF)  unless Circuit.stoppedCheck
    i = -xl
    while i <= xl
      yy = yc + Math.floor(.95 * Math.sin(i * Math.PI * w / xl) * wl)
      CircuitComponent.drawThickLine ox, oy, xc + i, yy  unless ox is -1
      ox = xc + i
      oy = yy
      i++
    if Circuit.showValuesCheckItem
      s = CircuitComponent.getShortUnitText(@frequency, "Hz")
      @drawValues s, @circleSize  if @dx is 0 or @dy is 0
    @drawPosts()
    @curcount = @updateDotCount(-@current, @curcount)
    @drawDots @point1, @lead1, @curcount  unless Circuit.dragElm is this

  stamp: ->
    Circuit.stampVoltageSource 0, @nodes[0], @voltSource


  setParams: ->
    if @frequency < @minF or @frequency > @maxF
      @frequency = @minF
      @freqTime = 0
      @dir = 1
    if (@flags & SweepElm.FLAG_LOG) is 0
      @fadd = @dir * Circuit.timeStep * (@maxF - @minF) / @sweepTime
      @fmul = 1
    else
      @fadd = 0
      @fmul = Math.pow(@maxF / @minF, @dir * Circuit.timeStep / @sweepTime)
    @savedTimeStep = Circuit.timeStep

  reset: ->
    @frequency = @minF
    @freqTime = 0
    @dir = 1
    @setParams()


  startIteration: ->

    # has timestep been changed?
    @setParams()  unless Circuit.timeStep is @savedTimeStep
    @v = Math.sin(@freqTime) * @maxV
    @freqTime += @frequency * 2 * Math.PI * Circuit.timeStep
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
    arr[1] = "I = " + CircuitComponent.getCurrentDText(@getCurrent())
    arr[2] = "V = " + CircuitComponent.getVoltageText(@volts[0])
    arr[3] = "f = " + CircuitComponent.getUnitText(@frequency, "Hz")
    arr[4] = "range = " + CircuitComponent.getUnitText(@minF, "Hz") + " .. " + CircuitComponent.getUnitText(@maxF, "Hz")
    arr[5] = "time = " + CircuitComponent.getUnitText(@sweepTime, "s")

module.exports = SweepElm
