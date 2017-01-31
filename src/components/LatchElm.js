let CircuitComponent = require("./CircuitComponent.js");
let ChipElm = require("./ChipElm.js");
let Util = require('../util/Util.js');

class LatchElm extends ChipElm {
  constructor(xa, xb, ya, yb, params, f) {
    params = params || {"bits": 2, "volts": [0, 0, 0, 0, 0]};

    super(xa, xb, ya, yb, params, f);
  }

  static get NAME() {
    return "Latch";
  }

  needsBits() {
    return true;
  }

  numPosts() {
    return (this.bits * 2) + 1;
  }

  numVoltageSources() {
    return this.bits;
  }

  setupPins() {
    this.lastLoad = false;
    this.loadPin = 0;

    let i;
    this.sizeX = 2;
    this.sizeY = this.bits + 1;
    this.pins = new Array(this.numPosts());

    for (i = 0; i < this.bits; i++) {
      this.pins[i] = new ChipElm.Pin(this.bits - 1 - i, ChipElm.SIDE_W, `I${i}`);
    }

    for (i = 0; i < this.bits; i++) {
      this.pins[i + this.bits] = new ChipElm.Pin(this.bits - 1 - i, ChipElm.SIDE_E, "O");
      this.pins[i + this.bits].output = true;
    }

    this.loadPin = this.bits * 2;
    this.pins[this.loadPin] = new ChipElm.Pin(this.bits, ChipElm.SIDE_W, "Ld");

    this.allocNodes();
  }

  execute() {
    if (this.pins[this.loadPin].value && !this.lastLoad) {
      for (let i = 0; i < this.bits; i++) {
        this.pins[i + this.bits].value = this.pins[i].value;
      }
    }

    this.lastLoad = this.pins[this.loadPin].value;
  }
}

module.exports = LatchElm;
