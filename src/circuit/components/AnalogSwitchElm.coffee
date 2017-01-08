CircuitComponent = require("../circuitComponent.js")
Util = require('../../util/util.coffee')
Point = require('../../geom/point.coffee')

class AnalogSwitchElm extends CircuitComponent
  @FLAG_INVERT = 1

  @Fields = {
    r_on: {
      name: "On Resistance"
      data_type: parseFloat
      default_value: 20


    },
    r_off: {
      name: "Off Resistance"
      data_type: parseFloat
      default_value: 1e10
    }
  }

  constructor: (xa, ya, xb, yb, params, f) ->
    super(xa, ya, xb, yb, params, f)

  getDumpType: ->
    159

  setPoints: ->
    super

    @calcLeads(32)

    @ps = new Point()
    openhs = 16

    @point3 = Util.interpolate(@point1, @point2, 0.5, -openhs)
    @lead3 = Util.interpolate(@point1, @point2, 0.5, -openhs / 2)

  calculateCurrent: ->
    @current = (@volts[0] - @volts[1]) / @resistance

  nonLinear: ->
    true

  stamp: (stamper) ->
    stamper.stampNonLinear(@nodes[0])
    stamper.stampNonLinear(@nodes[1])

  doStep: (stamper) ->
    @open = @volts[2] < 2.5

    if (@flags & AnalogSwitchElm) != 0
      @open = !@open

    @resistance = if @open then @r_off else @r_on

    stamper.stampResistor(@nodes[0], @nodes[1], @resistance)

  getPostCount: ->
    3

  getPost: (n)->
    if (n == 0)
      @point1
    else
      if n == 1
        @point2
      else
        @point3


  getConnection: (n1, n2) ->
    !(n1 == 2 || n2 == 2)





module.exports = AnalogSwitchElm
