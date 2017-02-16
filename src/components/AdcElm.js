let CircuitComponent = require("./CircuitComponent.js");
let ChipElm = require("./ChipElm.js");
let Util = require('../util/Util.js');

class AdcElm extends ChipElm {

  constructor(xa, xb, ya, yb, params, f) {
    params = params || {"bits": 2, "volts": [0, 0, 0, 0]};

    super(xa, xb, ya, yb, params, f);
  }

  static get NAME() {
    return "Analog-To-Digital Converter (ADC)";
  }

  numVoltageSources() {
    return this.bits;
  }

  numPosts() {
    return this.bits + 2;
  }

  needsBits() {
    return true;
  }

  setupPins() {
    this.sizeX = 2;
    this.sizeY = (this.bits > 2) ? this.bits : 2;
    this.pins = new Array(this.numPosts());

    for (let i = 0; i < this.bits; ++i) {
      this.pins[i] = new ChipElm.Pin(this.bits - 1 - i, ChipElm.SIDE_E, `D${i}`);
      this.pins[i].output = true;
    }

    this.pins[this.bits] = new ChipElm.Pin(0, ChipElm.SIDE_W, "In");
    return this.pins[this.bits + 1] = new ChipElm.Pin(this.sizeY - 1, ChipElm.SIDE_W, "V+");
  }

  execute() {
    let imax = (1 << this.bits) - 1;
    let val = (imax * this.volts[this.bits]) / this.volts[this.bits + 1];
    let ival = Math.floor(val);

    ival = Math.min(imax, Math.max(0, ival));

    for (i=0; i < this.bits; ++i)
      this.pins[i].value = ((ival & (1 << i)) !== 0)
  }
}

module.exports = AdcElm;
