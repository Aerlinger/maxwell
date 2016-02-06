RailElm = require('./RailElm.coffee')
VoltageElm = require('./VoltageElm.coffee')

class ACRailElm extends RailElm
  constructor: (xa, ya, xb, yb, params = {}, f=0) ->
    super(xa, ya, xa, ya, params, f)

    @waveform = VoltageElm.WF_AC

module.exports = ACRailElm
