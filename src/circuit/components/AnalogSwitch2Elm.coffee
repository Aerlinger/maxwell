CircuitComponent = require("../CircuitComponent.coffee")
AnalogSwitchElm = require("./AnalogSwitchElm.coffee")
Util = require('../../util/util.coffee')
Point = require('../../geom/Point.coffee')
Settings = require('../../settings/settings.coffee')

class AnalogSwitch2Elm extends AnalogSwitchElm

  constructor: (xa, ya, xb, yb, params, f) ->
    super(xa, ya, xb, yb, params, f)
    @openhs = 16


  setPoints: ->
    super()

    @calcLeads(32)

    @swposts = Util.newPointArray(2)
    @swpoles = Util.newPointArray(2)

    [@swpoles[0], @swpoles[1]] = Util.interpolateSymmetrical(@lead1, @lead2, 1, @openhs)
    [@swposts[0], @swposts[1]] = Util.interpolateSymmetrical(@point1, @point2, 1, @openhs)

    @ctlPoint = Util.interpolate(@point1, @point2, 0.5, @openhs)

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

  draw: (renderContext) ->
    color = Util.getVoltageColor(@volts[0])
    renderContext.drawLinePt(@point1, @lead1, color)

    # draw second lead
    color = Util.getVoltageColor(@volts[0])
    renderContext.drawLinePt(@swpoles[0], @swposts[0], color)

    # draw third lead
    color = Util.getVoltageColor(@volts[2])
    renderContext.drawLinePt(@swpoles[1], @swposts[1], color)

    # draw switch

    position = if @open then 1 else 0
    renderContext.drawLinePt(@lead1, @swpoles[position], Settings.GREY)

    renderContext.fillCircle(@lead1.x, @lead1.y, 3, 0, Settings.LIGHT_POST_COLOR)
    renderContext.fillCircle(@swpoles[1].x, @swpoles[1].y, 3, 0, Settings.LIGHT_POST_COLOR)
    renderContext.fillCircle(@swpoles[0].x, @swpoles[0].y, 3, 0, Settings.LIGHT_POST_COLOR)

    @updateDots()

    renderContext.drawDots(@point1, @lead1, this)
    renderContext.drawDots(@swpoles[position], @swposts[position], this)
    renderContext.drawPosts(this)

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
    @open = @volts[3] < 2.5

    if (@flags & AnalogSwitch2Elm.FLAG_INVERT) != 0
      @open = !@open

    if @open
      stamper.stampResistor(@nodes[0], @nodes[2], @r_on)
      stamper.stampResistor(@nodes[0], @nodes[1], @r_off)
    else
      stamper.stampResistor(@nodes[0], @nodes[1], @r_on)
      stamper.stampResistor(@nodes[0], @nodes[2], @r_off)

  getConnection: (n1, n2) ->
    if (n1 == 3 || n2 == 3)
      return false
    return true

module.exports = AnalogSwitch2Elm
