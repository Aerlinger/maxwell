let RailElm = require('./RailElm.js');
let VoltageElm = require('./VoltageElm.js');

class ACRailElm extends RailElm {
  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xa, ya, params, f);

    this.waveform = VoltageElm.WF_AC;
  }

  getName() {
    return "AC Voltage Rail"
  }
}

module.exports = ACRailElm;
