let RailElm = require('./RailElm.js');
let VoltageElm = require('./VoltageElm.js');

class ACRailElm extends RailElm {
  constructor(xa, ya, xb, yb, params, f) {
    if (params == null) { params = {}; }
    if (f == null) { f = 0; }
    super(xa, ya, xa, ya, params, f);

    this.waveform = VoltageElm.WF_AC;
  }
}

module.exports = ACRailElm;
