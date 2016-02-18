CircuitComponent = require('../circuitComponent.coffee')
Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
RailElm = require('./RailElm.coffee')

class AntennaElm extends RailElm

  constructor: (xa, ya, xb, yb, params, f) ->
    super(xa, ya, xb, yb, params, f)
    @waveform = RailElm.WF_DC
    @fmphase = 0

  doStep: (stamper) ->
    stamper.updateVoltageSource(0, @nodes[0], @voltSource, @getVoltage())

  stamp: (stamper) ->
    stamper.stampVoltageSource(0, @nodes[0], @voltSource)


  getVoltage: ->
    @fmphase += 2 * Math.PI * (2200 + Math.sin(2 * Math.PI * @getParentCircuit().getTime() * 13) * 100) * @getParentCircuit().timeStep()

    fm = 3 * Math.sin(@fmphase)

    pi = Math.PI
    t = @getParentCircuit().time

    wave1 = Math.sin(2 * pi * t * 3000) * (1.3 + Math.sin(2 * pi * t * 12)) * 3
    wave2 = Math.sin(2 * pi * t * 2710) * (1.3 + Math.sin(2 * pi * t * 13)) * 3
    wave3 = Math.sin(2 * pi * t * 2433) * (1.3 + Math.sin(2 * pi * t * 14)) * 3 + fm

    wave1 + wave2 + wave3

  getDumpType: ->
    return 'A'

module.exports = AntennaElm
