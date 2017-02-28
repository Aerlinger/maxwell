let CircuitComponent = require("./CircuitComponent.js");
let ChipElm = require("./ChipElm.js");
let Util = require('../util/Util.js');

class DFlipFlopElm extends ChipElm {
  static get Fields() {
    return {
      "volts": {
        title: "Volts",
        description: "Initial voltages on output",
        unit: "Volts",
        default_value: 0,
        symbol: "V",
        data_type: (v) => {
          v
        },
        range: [0, Infinity]
      }
    }
  }

  static initClass() {
    this.FLAG_RESET = 2;
  }

  constructor(xa, xb, ya, yb, params, f) {

    // Set [4] as default value for params['volts']
    params = params || {};
    params['volts'] = params['volts'] || [4];

    super(xa, xb, ya, yb, params, f);

    this.pins[2].value = !this.pins[1].value;
  }

  numPosts() {
    if (this.hasReset()) {
      return 5;
    } else {
      return 4;
    }
  }

  static get NAME() {
    return "D Flip-Flop"
  }

  numVoltageSources() {
    return 2;
  }

  hasReset() {
    return (this.flags & DFlipFlopElm.FLAG_RESET) !== 0;
  }

  setupPins() {
    this.sizeX = 2;
    this.sizeY = 3;

    this.pins = new Array(this.numPosts());

    this.pins[0] = new ChipElm.Pin(0, ChipElm.SIDE_W, "D");

    this.pins[1] = new ChipElm.Pin(0, ChipElm.SIDE_E, "Q");
    this.pins[1].output = this.pins[1].state = true;

    this.pins[2] = new ChipElm.Pin(2, ChipElm.SIDE_E, "Q");
    this.pins[2].output = true;
    this.pins[2].lineOver = true;

    this.pins[3] = new ChipElm.Pin(1, ChipElm.SIDE_W, "");
    this.pins[3].clock = true;

    if (this.hasReset()) {
      this.pins[4] = new ChipElm.Pin(2, ChipElm.SIDE_W, "R");
    }
  }

  execute() {
    if (this.pins[3].value && !this.lastClock) {
      this.pins[1].value = this.pins[0].value;
      this.pins[2].value = !this.pins[0].value;
    }

    if ((this.pins.length > 4) && this.pins[4].value) {
      this.pins[1].value = false;
      this.pins[2].value = true;
    }

    return this.lastClock = this.pins[3].value;
  }
}

DFlipFlopElm.initClass();

module.exports = DFlipFlopElm;
