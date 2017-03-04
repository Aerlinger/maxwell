let RailElm = require('./RailElm');
let VoltageElm = require('./VoltageElm');

class ClockElm extends RailElm {
  // TODO: Needs params!!

  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xa, ya, params, f);

    this.waveform = VoltageElm.WF_SQUARE;

    if (!this.maxVoltage) { this.maxVoltage = 2.5; }
    if (!this.bias) { this.bias = 2.5; }
    if (!this.frequency) { this.frequency = 100; }

    this.flags |= RailElm.FLAG_CLOCK;
  }

  static get NAME() {
    return "Clock Voltage Source"
  }
}

module.exports = ClockElm;
