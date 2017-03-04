let ChipElm = require("./ChipElm.js");
let VariableBitChipElm = require("./VariableBitChipElm.js");
let Util = require('../util/Util');

class CounterElm extends VariableBitChipElm {
  static get FLAG_ENABLE() {
    return 2;
  }

  constructor(xa, xb, ya, yb, params, f) {
    params = params || {"bits": 4, "volts": [0, 0, 0, 0]};

    super(xa, xb, ya, yb, params, f);
  }

  static get NAME() {
    return "Digital Counter";
  }

  numPosts() {
    if (this.hasEnable()) {
      return this.bits + 3;
    }

    return this.bits + 2;
  }

  hasEnable() {
    return (this.flags & CounterElm.FLAG_ENABLE) != 0;
  }

  numVoltageSources() {
    return this.bits;
  }

  setupPins() {
    this.sizeX = 2;
    this.sizeY = (this.bits > 2) ? this.bits : 2;

    this.pins = new Array(this.numPosts());

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

    if (this.hasEnable())
      en = this.pins[this.bits + 2].value;

    if (this.pins[0].value && !this.lastClock && en) {
      for (i = this.bits - 1; i >= 0; i--) {
        let ii = i + 2;

        if (!this.pins[ii].value) {
          this.pins[ii].value = true;
          break;
        }

        this.pins[ii].value = false;
      }
    }

    if (!this.pins[1].value)
      for (i = 0; i < this.bits; ++i)
        this.pins[i + 2].value = false;

    this.lastClock = this.pins[0].value;
  }
}

CounterElm.initClass();

module.exports = CounterElm;
