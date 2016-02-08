RailElm = require('./RailElm.coffee')
VoltageElm = require('./VoltageElm.coffee')

class ClockElm extends RailElm
  @ParameterDefinitions["maxVoltage"].default_value = 2.5
  @ParameterDefinitions["bias"].default_value = 2.5
  @ParameterDefinitions["frequency"].default_value = 100

  constructor: (xa, ya, xb = null, yb = null, params = {}, f) ->
    @waveform = VoltageElm.WF_SQUARE

    super(xa, ya, xa, ya, params, f)

    @maxVoltage ||= 2.5
    @bias ||= 2.5
    @frequency ||= 100

    @flags |= RailElm.FLAG_CLOCK;

module.exports = ClockElm
