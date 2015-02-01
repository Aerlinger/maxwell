Settings = require('../../settings/settings.coffee')
DrawHelper = require('../../render/drawHelper.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
CircuitComponent = require('../circuitComponent.coffee')

class OpAmpElm extends CircuitComponent

  @FLAG_SWAP: 1
  @FLAG_SMALL: 2
  @FLAG_LOWGAIN: 4

  @ComponentDefinitions = {
    "maxOut": {
      name: "Voltage"
      unit: "Voltage"
      description: "Maximum allowable output voltage of the Op Amp"
      symbol: "V"
      default_value: 15
      data_type: "float"
      range: [-Infinity, Infinity]
      type: "physical"
    },
    "minOut": {
      name: "Voltage"
      unit: "Voltage"
      description: "Minimum allowable output voltage of the Op Amp"
      symbol: "V"
      default_value: 15
      data_type: "float"
      range: [-Infinity, Infinity]
      type: "physical"
    }

    # FLAGS:
    #    @FLAG_SWAP: 1
    #    @FLAG_SMALL: 2
    #    @FLAG_LOWGAIN: 4
  }

  constructor: (xa, ya, xb, yb, params) ->
    @opsize = 0
#      @opheight = 0
    @opwidth = 0
    @opaddtext = 0
    @maxOut = 15
    @minOut = -15
#      @nOut = 0
    @gain = 1e6
    @reset = false
    @in1p = []
    @in2p = []
    @textp = []

    #Font plusFont;
    @maxOut = 15
    @minOut = -15

    # GBW has no effect in this version of the simulator, but we retain it to keep the file format the same
    @gbw = 1e6

    super(xa, ya, xb, yb, params)

#      @lastvd = 0

#    if st and st.length > 0
#      st = st.split(" ")  if typeof st is "string"
#      try
#        @maxOut ||= parseFloat(st[0])
#        @minOut ||= parseFloat(st[1])

    @noDiagonal = true
    @setSize(if (f & OpAmpElm.FLAG_SMALL) isnt 0 then 1 else 2)
    @setGain()


  setGain: ->
    # gain of 100000 breaks e-amp-dfdx.txt
    # gain was 1000, but it broke amp-schmitt.txt
    @gain = (if ((@flags & OpAmpElm.FLAG_LOWGAIN) isnt 0) then 1000 else 100000)

  nonLinear: ->
    true

  draw: (renderContext) ->
    @setBboxPt @point1, @point2, @opheight * 2

    color = DrawHelper.getVoltageColor(@volts[0])
    renderContext.drawThickLinePt @in1p[0], @in1p[1], color

    color = DrawHelper.getVoltageColor(@volts[1])
    renderContext.drawThickLinePt @in2p[0], @in2p[1], color

#      #g.setColor(this.needsHighlight() ? this.selectColor : this.lightGrayColor);
#      @setPowerColor true
    renderContext.drawThickPolygonP @triangle, (if @needsHighlight() then Settings.SELECT_COLOR else Settings.FG_COLOR)
#
#      #g.setFont(plusFont);
#      #this.drawCenteredText("-", this.textp[0].x + 3, this.textp[0].y + 8, true).attr({'font-weight':'bold', 'font-size':17});
#      #this.drawCenteredText("+", this.textp[1].x + 3, this.textp[1].y + 10, true).attr({'font-weight':'bold', 'font-size':14});
    color = DrawHelper.getVoltageColor(@volts[2])
    renderContext.drawThickLinePt @lead2, @point2, color
#      @curcount = @updateDotCount(@current, @curcount)
    @drawDots @point2, @lead2, renderContext
    @drawPosts(renderContext)
#      @(renderContext)

  getPower: ->
    @volts[2] * @current

  setSize: (s) ->
#      console.log("s = #{s}")
    @opsize = s
    @opheight = 8 * s
    @opwidth = 13 * s
#    @flags = (@flags & ~OpAmpElm.FLAG_SMALL) | ((if (s is 1) then OpAmpElm.FLAG_SMALL else 0))

  setPoints: ->
    super()
#      if @dn > 150 and this is Circuit.dragElm
    @setSize 2

    if ww > @dn / 2
#        console.log("1")
      ww = Math.floor(@dn / 2)
    else
#        console.log("2")
#        throw("error")
      ww = Math.floor(@opwidth)

#      console.log("ww = #{ww}")

    @calcLeads ww * 2
    hs = Math.floor(@opheight * @dsign)
    hs = -hs  unless (@flags & OpAmpElm.FLAG_SWAP) is 0

    @in1p = ArrayUtils.newPointArray(2)
    @in2p = ArrayUtils.newPointArray(2)
    @textp = ArrayUtils.newPointArray(2)

    [@in1p[0], @in2p[0]] = DrawHelper.interpPoint2 @point1, @point2, 0, hs
    [@in1p[1], @in2p[1]] = DrawHelper.interpPoint2 @lead1, @lead2, 0, hs
    [@textp[0], @textp[1]] = DrawHelper.interpPoint2 @lead1, @lead2, .2, hs

    tris = ArrayUtils.newPointArray(2)
    [tris[0], tris[1]] = DrawHelper.interpPoint2 @lead1, @lead2, 0, hs * 2
    @triangle = DrawHelper.createPolygonFromArray([tris[0], tris[1], @lead2])


  #this.plusFont = new Font("SansSerif", 0, opsize == 2 ? 14 : 10);
  getPostCount: ->
    3

  getPost: (n) ->
    (if (n is 0) then @in1p[0] else (if (n is 1) then @in2p[0] else @point2))

  getVoltageSourceCount: ->
    1

  getInfo: (arr) ->
    super()
    arr[0] = "op-amp"
    arr[1] = "V+ = " + DrawHelper.getVoltageText(@volts[1])
    arr[2] = "V- = " + DrawHelper.getVoltageText(@volts[0])

    # sometimes the voltage goes slightly outside range, to make convergence easier.  so we hide that here.
    vo = Math.max(Math.min(@volts[2], @maxOut), @minOut)
    arr[3] = "Vout = " + DrawHelper.getVoltageText(vo)
    arr[4] = "Iout = " + DrawHelper.getCurrentText(@getCurrent())
    arr[5] = "range = " + DrawHelper.getVoltageText(@minOut) + " to " + DrawHelper.getVoltageText(@maxOut)

  stamp: (stamper) ->
#      console.log("\nStamping OpAmpElm")
    vn = @Circuit.numNodes() + @voltSource
    stamper.stampNonLinear vn
    stamper.stampMatrix @nodes[2], vn, 1

  doStep: (stamper) ->
    vd = @volts[1] - @volts[0]
    if Math.abs(@lastvd - vd) > .1
      @Circuit.converged = false
    else if @volts[2] > @maxOut + .1 or @volts[2] < @minOut - .1
      @Circuit.converged = false

    x = 0
    vn = @Circuit.numNodes() + @voltSource
    dx = 0

    if vd >= @maxOut / @gain and (@lastvd >= 0 or MathUtils.getRand(4) is 1)
      dx = 1e-4
      x = @maxOut - dx * @maxOut / @gain
    else if vd <= @minOut / @gain and (@lastvd <= 0 or MathUtils.getRand(4) is 1)
      dx = 1e-4
      x = @minOut - dx * @minOut / @gain
    else
      dx = @gain

    #console.log("opamp " + vd + " " + volts[2] + " " + dx + " "  + x + " " + lastvd + " " + sim.converged);
    # Newton's method:
    stamper.stampMatrix vn, @nodes[0], dx
    stamper.stampMatrix vn, @nodes[1], -dx
    stamper.stampMatrix vn, @nodes[2], 1
    stamper.stampRightSide vn, x
    @lastvd = vd


  #if (sim.converged)
  #     console.log((volts[1]-volts[0]) + " " + volts[2] + " " + initvd);

  # there is no current path through the op-amp inputs, but there is an indirect path through the output to ground.
  getConnection: (n1, n2) ->
    false

  toString: ->
    "OpAmpElm"

  hasGroundConnection: (n1) ->
    n1 is 2

  getVoltageDiff: ->
    @volts[2] - @volts[1]

  getDumpType: ->
    "a"

module.exports = OpAmpElm
