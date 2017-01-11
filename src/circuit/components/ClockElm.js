let RailElm = require('./RailElm.js');
let VoltageElm = require('./VoltageElm.js');

class ClockElm extends RailElm {
  // TODO: Needs params!!

  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xa, ya, params, f);

    // if (xb == null) { xb = null; }
    // if (yb == null) { yb = null; }

    // if (params == null) { params = {}; }
    this.waveform = VoltageElm.WF_SQUARE;

    if (!this.maxVoltage) { this.maxVoltage = 2.5; }
    if (!this.bias) { this.bias = 2.5; }
    if (!this.frequency) { this.frequency = 100; }

    this.flags |= RailElm.FLAG_CLOCK;
  }
}

module.exports = ClockElm;
