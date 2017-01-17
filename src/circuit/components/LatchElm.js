let CircuitComponent = require("../circuitComponent.js");
let ChipElm = require("./ChipElm.js");
let Util = require('../../util/util.js');

class LatchElm extends ChipElm {

  constructor(xa, xb, ya, yb, params, f) {
    params = params || {"bits": 2, "volts": [0, 0, 0, 0, 0]};

    super(xa, xb, ya, yb, params, f);
    
    this.lastLoad = false;
    this.loadPin = 0;
  }

  getName() {
    return "Latch";
  }

  needsBits() {
    return true;
  }

  getPostCount() {
    return (this.bits * 2) + 1;
  }

  getVoltageSourceCount() {
    return this.bits;
  }

  setupPins() {
    let i;
    this.sizeX = 2;
    this.sizeY = this.bits + 1;
    this.pins = new Array(this.getPostCount());

    for (i = 0; i < this.bits; i++) {
      this.pins[i] = new ChipElm.Pin(this.bits - 1 - i, ChipElm.SIDE_W, `I${i}`);
    }

    for (i = 0; i < this.bits; i++) {
      this.pins[i + this.bits] = new ChipElm.Pin(this.bits - 1 - i, ChipElm.SIDE_E, "O");
      this.pins[i + this.bits].output = true;
    }

    this.loadPin = this.bits * 2;
    this.pins[this.loadPin] = new ChipElm.Pin(this.bits, ChipElm.SIDE_W, "Ld");

    return this.allocNodes();
  }

  execute() {
    if (this.pins[this.loadPin].value && !this.lastLoad) {
      for (let i = 0; i < this.bits; i++) {
        this.pins[i + this.bits].value = this.pins[i].value;
      }
    }

    return this.lastLoad = this.pins[this.loadPin].value;
  }
}


module.exports = LatchElm;
