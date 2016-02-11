CircuitComponent = require('../circuitComponent.coffee')
Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
Util = require("../../util/util.coffee")

class OpAmpElm extends CircuitComponent
  @FLAG_SWAP: 1
  @FLAG_SMALL: 2
  @FLAG_LOWGAIN: 4

  @Fields = {
    "maxOut": {
      name: "Voltage"
      unit: "Voltage"
      description: "Maximum allowable output voltage of the Op Amp"
      symbol: "V"
      default_value: 15
      data_type: parseFloat
      range: [-Infinity, Infinity]
      type: "physical"
    },
    "minOut": {
      name: "Voltage"
      unit: "Voltage"
      description: "Minimum allowable output voltage of the Op Amp"
      symbol: "V"
      default_value: -15
      data_type: parseFloat
      range: [-Infinity, Infinity]
      type: "physical"
    },
    "gbw": {
      name: "Gain"
      unit: ""
      description: "Gutput gain"
      symbol: ""
      default_value: 1e6
      data_type: parseFloat
      range: [-Infinity, Infinity]
      type: "physical"
    }
  }

  constructor: (xa = 104, ya = 104, xb = 208, yb = 104, params, f) ->
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

    super(xa, ya, xb, yb, params, f)

#      @lastvd = 0

#    if st and st.length > 0
#      st = st.split(" ")  if typeof st is "string"
#      try
#        @maxOut ||= parseFloat(st[0])
#        @minOut ||= parseFloat(st[1])

    @noDiagonal = true

    @setSize(if f & OpAmpElm.FLAG_SMALL isnt 0 then 1 else 2)
    @setGain()


  setGain: ->
    # gain of 100000 breaks e-amp-dfdx.txt
    # gain was 1000, but it broke amp-schmitt.txt
    @gain = (if ((@flags & OpAmpElm.FLAG_LOWGAIN) isnt 0) then 1000 else 100000)

  nonLinear: ->
    true

  draw: (renderContext) ->
    if CircuitComponent.DEBUG
      super(renderContext)

    @setBbox @x1, @in1p[0].y, @x2, @in2p[0].y

    # Terminal 1
    color = Util.getVoltageColor(@volts[0])
    renderContext.drawLinePt @in1p[0], @in1p[1], color
#    renderContext.drawValue(@in1p[1].x, )

    # Terminal 2
    color = Util.getVoltageColor(@volts[1])
    renderContext.drawLinePt @in2p[0], @in2p[1], color

    # Terminal 3
    color = Util.getVoltageColor(@volts[2])
    renderContext.drawLinePt @lead2, @point2, color

    # Body
    renderContext.drawThickPolygonP @triangle, Settings.FG_COLOR

    if @getParentCircuit() && @getParentCircuit()
      @updateDots()
      renderContext.drawDots @in1p[0], @in1p[1], renderContext
      renderContext.drawDots @point2, @lead2, this

      renderContext.drawPosts(this)
#      @(renderContext)

  getPower: ->
    @volts[2] * @current

  setSize: (s) ->
    @opsize = s
    @opheight = 8 * s
    @opwidth = 13 * s

  setPoints: ->
    super()
    @setSize 2

    if ww > @dn / 2
      ww = Math.floor(@dn / 2)
    else
      ww = Math.floor(@opwidth)

    @calcLeads ww * 2
    hs = Math.floor(@opheight * @dsign)
    hs = -hs unless (@flags & OpAmpElm.FLAG_SWAP) is 0

    @in1p = Util.newPointArray(2)
    @in2p = Util.newPointArray(2)
    @textp = Util.newPointArray(2)

    [@in1p[0], @in2p[0]] = Util.interpolateSymmetrical @point1, @point2, 0, hs
    [@in1p[1], @in2p[1]] = Util.interpolateSymmetrical @lead1, @lead2, 0, hs
    [@textp[0], @textp[1]] = Util.interpolateSymmetrical @lead1, @lead2, .2, hs

    tris = Util.newPointArray(2)
    [tris[0], tris[1]] = Util.interpolateSymmetrical @lead1, @lead2, 0, hs * 2
    @triangle = Util.createPolygonFromArray([tris[0], tris[1], @lead2])


  getPostCount: ->
    3

  getPost: (n) ->
    (if (n is 0) then @in1p[0] else (if (n is 1) then @in2p[0] else @point2))

  getVoltageSourceCount: ->
    1

  getInfo: (arr) ->
    super()
    arr[0] = "op-amp"
    arr[1] = "V+ = " + Util.getUnitText(@volts[1], "V")
    arr[2] = "V- = " + Util.getUnitText(@volts[0], "V")

    # sometimes the voltage goes slightly outside range, to make convergence easier.  so we hide that here.
    vo = Math.max(Math.min(@volts[2], @maxOut), @minOut)
    arr[3] = "Vout = " + Util.getUnitText(vo, "V")
    arr[4] = "Iout = " + Util.getUnitText(@getCurrent(), "A")
    arr[5] = "range = " + Util.getUnitText(@minOut, "V") + " to " + Util.getUnitText(@maxOut, "V")

  stamp: (stamper) ->
#      console.log("\nStamping OpAmpElm")
    vn = @Circuit.numNodes() + @voltSource
    stamper.stampNonLinear vn
    stamper.stampMatrix @nodes[2], vn, 1

  doStep: (stamper) ->
    vd = @volts[1] - @volts[0]
    if Math.abs(@lastvd - vd) > .1
      @Circuit.Solver.converged = false
    else if @volts[2] > @maxOut + .1 or @volts[2] < @minOut - .1
      @Circuit.Solver.converged = false

    x = 0
    vn = @Circuit.numNodes() + @voltSource
    dx = 0

    if vd >= @maxOut / @gain and (@lastvd >= 0 or Util.getRand(4) is 1)
      dx = 1e-4
      x = @maxOut - dx * @maxOut / @gain
    else if vd <= @minOut / @gain and (@lastvd <= 0 or Util.getRand(4) is 1)
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
