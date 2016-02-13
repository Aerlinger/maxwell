CircuitComponent = require("../CircuitComponent.coffee")
Util = require('../../util/util.coffee')

class InverterElm extends CircuitComponent

  @Fields = {
    slewRate: {
      name: "Slew Rate"
      data_type: parseFloat
    }
  }

  constructor: (xa, ya, xb, yb, params, f) ->
    super(xa, ya, xb, yb, params, f)

    @noDiagonal = true


  getDumpType: ->
    'I'

  setPoints: ->
    super()

    hs = 16
    ww = 16

    if ww > @dn / 2
      ww = Math.floor(@dn/2)

    @lead1 = Util.interpolate(@point1, @point2, 0.5 - ww / @dn)
    @lead2 = Util.interpolate(@point1, @point2, 0.5 + (ww + 2) / @dn)

    @pcircle = Util.interpolate(@point1, @point2, 0.5 + (ww - 2) / @dn)

    triPoints = Util.newPointArray(3)

    [triPoints[0], triPoints[1]] = Util.interpolateSymmetrical(@lead1, @lead2, 0, hs)

    triPoints[2] = Util.interpolate(@point1, @point2, 0.5 + (ww - 5) / @dn)

    @gatePoly = triPoints

    @setBboxPt(@point1, @point2, hs)


  getVoltageSourceCount: ->
    1

  stamp: (stamper) ->
    stamper.stampVoltageSource(0, @nodes[1], @voltSource)

  doStep: (stamper) ->
    v0 = @volts[1]
    out = if @volts[0] > 2.5 then 0 else 5
    maxStep = @slewRate * @getParentCircuit.timeStep() * 1e9

    out = Math.max(Math.min(v0 + maxStep, out), v0 - maxStep)

    stamper.updateVoltageSource(0, @nodes[1], @voltSource, out)

  getVoltageDiff: ->
    @volts[0]

  getConnection: (n1, n2) ->
    return false

  hasGroundConnection: (n1) ->
    n1 == 1

module.exports = InverterElm

