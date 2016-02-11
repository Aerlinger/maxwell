RailElm = require('./RailElm.coffee')
VoltageElm = require('./VoltageElm.coffee')

class ClockElm extends RailElm
  constructor: (xa, ya, xb = null, yb = null, params = {}, f) ->
    @waveform = VoltageElm.WF_SQUARE

    @maxVoltage ||= 2.5
    @bias ||= 2.5
    @frequency ||= 100

    @flags |= RailElm.FLAG_CLOCK;

    super(xa, ya, xa, ya, params, f)

module.exports = ClockElm
