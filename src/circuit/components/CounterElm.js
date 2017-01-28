let CircuitComponent = require("../circuitComponent.js");
let ChipElm = require("./ChipElm.js");
let Util = require('../../util/util.js');

class CounterElm extends ChipElm {
  static get FLAG_ENABLE() {
    return 2;
  }

  constructor(xa, xb, ya, yb, params, f) {
    // console.log("FLAG", f)

    params = params || {"bits": 4, "volts": [0, 0, 0, 0]};

    super(xa, xb, ya, yb, params, f);
  }

  needsBits() {
    return true;
  }

  getName() {
    return "Counter";
  }

  getPostCount() {
    if (this.hasEnable()) {
      return this.bits + 3;
    }

    return this.bits + 2;
  }

  hasEnable() {
    return (this.flags & CounterElm.FLAG_ENABLE) != 0;
  }

  getVoltageSourceCount() {
    return this.bits;
  }

  setupPins() {
    this.sizeX = 2;
    this.sizeY = (this.bits > 2) ? this.bits : 2;

    this.pins = new Array(this.getPostCount());

    this.pins[0] = new ChipElm.Pin(0, ChipElm.SIDE_W, "");
    this.pins[0].clock = true;
    this.pins[1] = new ChipElm.Pin(this.sizeY - 1, ChipElm.SIDE_W, "R");
    this.pins[1].bubble = true;

    for (let i = 0; i < this.bits; i++) {
      let ii = i + 2;
      this.pins[ii] = new ChipElm.Pin(i, ChipElm.SIDE_E, `Q${this.bits - i - 1}`);
      this.pins[ii].output = this.pins[ii].state = true;
    }

    if (this.hasEnable()) {
      this.pins[this.bits + 2] = new ChipElm.Pin(this.sizeY - 2, ChipElm.SIDE_W, "En");
    }

    this.allocNodes();
  }

  execute() {
    let i;
    let en = true;

    if (this.hasEnable()) {
      en = this.pins[this.bits + 2].value;
    }

    if (this.pins[0].value && !this.lastClock && en) {
      for (start = this.bits - 1, i = start, asc = start <= 0; asc ? i <= 0 : i >= 0; asc ? i++ : i--) {
        var asc, start;
        let ii = i + 2;

        if (!this.pins[ii].value) {
          this.pins[ii].value = true;
          break;
        }

        this.pins[ii].value = false;
      }
    }

    if (!this.pins[1].value) {
      for (i = 0, end = this.bits, asc1 = 0 <= end; asc1 ? i < end : i > end; asc1 ? i++ : i--) {
        var asc1, end;
        this.pins[i + 2].value = false;
      }
    }

    return this.lastClock = this.pins[0].value;
  }
}
CounterElm.initClass();

module.exports = CounterElm;
