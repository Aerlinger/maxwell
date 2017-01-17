let CircuitComponent = require("../circuitComponent.js");
let ChipElm = require("./ChipElm.js");
let Util = require('../../util/util.js');

class AdcElm extends ChipElm {

  constructor(xa, xb, ya, yb, params, f) {
    params = params || {"bits": 2, "volts": [0, 0, 0, 0]};

    super(xa, xb, ya, yb, params, f);
  }

  getName() {
    return "ADC";
  }

  getVoltageSourceCount() {
    return this.bits;
  }

  getPostCount() {
    return this.bits + 2;
  }

  needsBits() {
    return true;
  }

  setupPins() {
    this.sizeX = 2;
    this.sizeY = (this.bits > 2) ? this.bits : 2;
    this.pins = new Array(this.getPostCount());

    for (let i = 0, end = this.bits, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
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

    return __range__(0, this.bits, false).map((i) =>
      this.pins[i].value = ((ival & (1 << i)) !== 0));
  }
}

module.exports = AdcElm;


function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}