CircuitComponent = require('../circuitComponent')
Settings = require('../../settings/settings')
Polygon = require('../../geom/polygon')
Rectangle = require('../../geom/rectangle')
Point = require('../../geom/point')
RailElm = require('./RailElm')

class AntennaElm extends RailElm

  constructor: (xa, ya, xb, yb, params, f) ->
    super(xa, ya, xb, yb, params, f)
    @waveform = RailElm.WF_DC

  doStep: (stamper) ->
    stamper.stampVoltageSource(0, @nodes[0], @voltSource)

  stamp: (stamper) ->
    stamper.stampVoltageSource(0, @nodes[0], @voltSource, @getVoltage())

  getVoltage: ->
    fmphase += 2 * pi * (2200 + Math.sin(2 * pi * sim.t * 13) * 100) * sim.timeStep;

    double fm = 3 * Math.sin(fmphase);

    pi = Math.PI
    t = @getParentCircuit().time

    wave1 = Math.sin(2 * pi * t * 3000) * (1.3 + Math.sin(2 * pi * t * 12)) * 3
    wave2 = Math.sin(2 * pi * t * 2710) * (1.3 + Math.sin(2 * pi * t * 13)) * 3
    wave3 = Math.sin(2 * pi * t * 2433) * (1.3 + Math.sin(2 * pi * t * 14)) * 3

    wave1 + wave2 + wave3

  getDumpType: ->
    return 'A'

module.exports = AntennaElm
