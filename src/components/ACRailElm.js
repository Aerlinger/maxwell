let RailElm = require('./RailElm');
let VoltageElm = require('./VoltageElm');

class ACRailElm extends RailElm {
  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xa, ya, params, f);

    this.waveform = VoltageElm.WF_AC;
  }

  static get NAME() {
    return "AC Voltage Rail"
  }
}

module.exports = ACRailElm;
