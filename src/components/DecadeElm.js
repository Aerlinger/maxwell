let ChipElm = require("./ChipElm.js");
let VariableBitChipElm = require("./VariableBitChipElm.js");

class DecadeElm extends VariableBitChipElm {

  constructor(xa, xb, ya, yb, params, f) {
    params = params || {"bits": 2, "volts": [0, 0, 0, 0]};

    super(xa, xb, ya, yb, params, f);
  }

  static get NAME() {
    return "Decade Counter";
  }

  numPosts() {
    return this.bits + 2;
  }

  numVoltageSources() {
    return this.bits;
  }

  setupPins() {
    this.sizeX = this.bits > 2 ? this.bits : 2;
    this.sizeY = 2;

    this.pins = new Array(this.numPosts());

    this.pins[0] = new ChipElm.Pin(1, ChipElm.SIDE_W, "");
    this.pins[0].clock = true;
    this.pins[1] = new ChipElm.Pin(this.sizeX - 1, ChipElm.SIDE_S, "R");
    this.pins[1].bubble = true;

    for (let i = 0; i < this.bits; i++) {
      let ii = i + 2;
      this.pins[ii] = new ChipElm.Pin(i, ChipElm.SIDE_N, `Q${i}`);
      this.pins[ii].output = this.pins[ii].state = true;
    }

    this.allocNodes();
  }

  execute() {
    let i;
    if (this.pins[0].value && !this.lastClock) {
      for (i = 0; i < this.bits; ++i) {
        if (this.pins[i + 2].value) break;
      }

      if (i < this.bits) {
        this.pins[i++ + 2].value = false;
      }

      i %= this.bits;

      this.pins[i + 2].value = true;
    }

    if (!this.pins[1].value) {
      for (i = 1; i < this.bits; ++i)
        this.pins[i + 2].value = false;

      this.pins[2].value = true;
    }

    this.lastClock = this.pins[0].value;
  }
}

module.exports = DecadeElm;
