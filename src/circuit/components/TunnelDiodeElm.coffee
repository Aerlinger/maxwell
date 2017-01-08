CircuitComponent = require("../circuitComponent.coffee")
Util = require('../../util/util.coffee')

class TunnelDiodeElm extends CircuitComponent
  constructor: (xa, xb, ya, yb, params, f) ->
    super(xa, xb, ya, yb, params, f)

    @pvp = .1
    @pip = 4.7e-3
    @pvv = .37
    @pvt = .026
    @pvpp = .525
    @piv = 370e-6
    @hs = 8
    @lastvoltdiff = 0

    @setup()

  reset: ->
    @lastvoltdiff = @volts[0] = @volts[1] = @curcount = 0

  nonLinear: ->
    true

  setup: ->

  getDumpType: ->
    "175"

  setPoints: ->
    super
    @calcLeads(16)
    @cathode = new Array(4)
    pa = new Array(2)

    [pa[0], pa[1]] = Util.interpolateSymmetrical(@lead1, @lead2, 0, @hs)
    [@cathode[0], @cathode[1]] = Util.interpolateSymmetrical(@lead1, @lead2, 1, @hs)
    [@cathode[2], @cathode[3]] = Util.interpolateSymmetrical(@lead1, @lead2, 0.8, @hs)

    @poly = Util.createPolygon(pa[0], pa[1], @lead2)

  limitStep: (vnew, vold) ->
    if (vnew > vold + 1)
      return vold + 1

    if (vnew < vold - 1)
      return vold - 1

    return vnew

  stamp: (stamper) ->
    stamper.stampNonLinear(@nodes[0])
    stamper.stampNonLinear(@nodes[1])

  calculateCurrent: ->
    voltdiff = @volts[0] - @volts[1]

    @current = @pip * Math.exp(-@pvpp / @pvt) * (Math.exp(voltdiff / @pvt) - 1) +
      @pip * (voltdiff / @pvp) * Math.exp(1 - voltdiff / @pvp) +
      @piv * Math.exp(voltdiff - @pvv)

    #console.log("CUR: ", @current)

    @current

  doStep: (stamper) ->
    voltdiff = @volts[0] - @volts[1]

    if (Math.abs(voltdiff - @lastvoltdiff) > 0.01)
      @getParentCircuit().Solver.converged = false

    #console.log(voltdiff + " " + @lastvoltdiff + " " + Math.abs(voltdiff-@lastvoltdiff))
    voltdiff = @limitStep(voltdiff, @lastvoltdiff)

    @lastvoltdiff = voltdiff

    i = @pip * Math.exp(-@pvpp / @pvt) * (Math.exp(voltdiff / @pvt) - 1) +
      @pip * (voltdiff / @pvp) * Math.exp(1 - voltdiff / @pvp) +
      @piv * Math.exp(voltdiff - @pvv)

    geq = @pip * Math.exp(-@pvpp / @pvt) * Math.exp(voltdiff / @pvt) / @pvt +
      @pip * Math.exp(1 - voltdiff / @pvp) / @pvp
    - Math.exp(1 - voltdiff / @pvp) * @pip * voltdiff / (@pvp * @pvp) +
      Math.exp(voltdiff - @pvv) * @piv

    nc = i - geq * voltdiff

    #console.log("TD: " + geq + ", " + nc)
    stamper.stampConductance(@nodes[0], @nodes[1], geq)
    stamper.stampCurrentSource(@nodes[0], @nodes[1], nc)


module.exports = TunnelDiodeElm
