RailElm = require('./RailElm.coffee')
VoltageElm = require('./VoltageElm.coffee')

class ACRailElm extends RailElm
  constructor: (xa, ya, xb, yb, params = {}) ->
    super(xa, ya, xa, ya, params)

    @waveform = VoltageElm.WF_AC

module.exports = ACRailElm
