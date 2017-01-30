let CircuitComponent = require("./CircuitComponent.js");
let ChipElm = require("./ChipElm.js");
let Util = require('../util/Util.js');

class DacElm extends ChipElm {

  constructor(xa, xb, ya, yb, params, f) {
    params = params || {"bits": 2, "volts": [0, 0, 0, 0]};

    super(xa, xb, ya, yb, params, f);
  }

  needsBits() {
    return true;
  }

  static get NAME() {
    return "Digital-To-Analog Converter (ADC)";
  }

  numVoltageSources() {
    return 1;
  }

  numPosts() {
    return this.bits + 2;
  }

  setupPins() {
    this.sizeX = 2;
    this.sizeY = this.bits > 2 ? this.bits : 2;
    this.pins = new Array(this.numPosts());

    for (let i = 0, end = this.bits, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
      this.pins[i] = new ChipElm.Pin(this.bits - 1 - i, ChipElm.SIDE_W, `D${i}`);
      this.pins[this.bits] = new ChipElm.Pin(0, ChipElm.SIDE_E, "O");
      this.pins[this.bits].output = true;
      this.pins[this.bits + 1] = new ChipElm.Pin(this.sizeY - 1, ChipElm.SIDE_E, "V+");
    }

    return this.allocNodes();
  }

  doStep(stamper) {
    let ival = 0;

    for (let i = 0, end = this.bits, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
      if (this.volts[i] > 2.5) {
        ival |= 1 << i;
      }
    }

    let ivalmax = (1 << this.bits) - 1;
    let v = (ival * this.volts[this.bits + 1]) / ivalmax;

    return stamper.updateVoltageSource(0, this.nodes[this.bits], this.pins[this.bits].voltSource, v);
  }
}

module.exports = DacElm;
