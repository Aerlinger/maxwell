CircuitComponent = require("../circuitComponent.coffee")
Util = require('../../util/util.coffee')
Point = require('../../geom/point.coffee')

class MemristorElm extends CircuitComponent

  @Fields = {
    r_on: {
      name: "On resistance"
      data_type: parseFloat

    }
    r_off: {
      name: "Off resistance"
      data_type: parseFloat
    }
    dopeWidth: {
      name: "Doping Width"
      data_type: parseFloat
    }
    totalWidth: {
      name: "Total Width"
      data_type: parseFloat
    }
    mobility: {
      name: "Majority carrier mobility"
      data_type: parseFloat
    }
    resistance: {
      name: "Overall resistance"
      data_type: parseFloat
      default_value: 100
    }
  }

  constructor: (xa, xb, ya, yb, params, f) ->
    super(xa, xb, ya, yb, params, f)


  getDumpType: ->
    "m"

  setPoints: ->
    super
    @calcLeads(32)
    @ps3 = new Point()
    @ps4 = new Point()

  reset: ->
    @dopeWidth = 0

  nonLinear: ->
    true

  doStep: (stamper) ->
    stamper.stampResistor(@nodes[0], @nodes[1], @resistance)

  stamp: (stamper) ->
    stamper.stampNonLinear(@nodes[0])
    stamper.stampNonLinear(@nodes[1])

  calculateCurrent: () ->
    @current = (@volts[0] - @volts[1]) / @resistance

  startIteration: ->
    wd = @dopeWidth / @totalWidth
    @dopeWidth += @getParentCircuit().timeStep() * @mobility * @r_on * @current / @totalWidth

    if (@dopeWidth < 0)
      @dopeWidth = 0
    if (@dopeWidth > @totalWidth)
      @dopeWidth = @totalWidth

    @resistance = @r_on * wd + @r_off * (1 - wd)


module.exports = MemristorElm
