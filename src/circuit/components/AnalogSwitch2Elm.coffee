CircuitComponent = require("../CircuitComponent")
AnalogSwitchElm = require("./AnalogSwitchElm.coffee")
DrawUtil = require('../../util/drawUtil')

class AnalogSwitch2Elm extends AnalogSwitchElm

  constructor: (xa, ya, xb, yb, params, f) ->
    super(xa, yz, xb, yb, params, f)
    @openhs = 16


  setPoints: ->
    super()

    @calcLeads(32)

    @swpostsosts = DrawUtil.newPointArray(2)
    @swpoles = DrawUtil.newPointArray(2)

    [@swpoles[0], @swpoles[1]] = DrawUtil.interpolateSymmetrical(@lead1, @lead2, 1, @openhs)
    [@swposts[0], @swposts[1]] = DrawUtil.interpolateSymmetrical(@point1, @point2, 1, @openhs)

    @ctlPoint = DrawUtil.interpolate(@point1, @point2, 0.5, @openhs)

  getPostCount: ->
    4

  getPost: (n) ->
    if (n==0)
      @point1
    else
      if n == 3
        @ctlPoint
      else
        @swposts[n - 1]

  getDumpType: ->
    160

  calculateCurrent: ->
    if @open
      @current = (@volts[0] - @volts[2]) / @r_on
    else
      @current = (@volts[0] - @volts[1]) / @r_on


  stamp: (stamper) ->
    stamper.stampNonLinear(@nodes[0])
    stamper.stampNonLinear(@nodes[1])
    stamper.stampNonLinear(@nodes[2])

  doStep: (stamper) ->
    @open = @voltes[3] < 3

    if @flags & AnalogSwitch2Elm.FLAG_INVERT != 0
      @open = !@open

    if @open
      stamper.stampResistor(@nodes[0], @nodes[2], @r_on)
      stamper.stampResistor(@nodes[0], @nodes[1], @r_off)
    else
      stamper.stampResistor(@nodes[0], @nodes[1], @r_on)
      stamper.stampResistor(@nodes[0], @nodes[2], @r_off)

  getConnection: (n1, n2) ->
    !(n1 == 3 || n2 == 3)

