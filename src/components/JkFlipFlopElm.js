let CircuitComponent = require("./CircuitComponent.js");
let ChipElm = require("./ChipElm.js");
let Util = require('../util/Util');

class JkFlipFlopElm extends ChipElm {
  constructor(xa, xb, ya, yb, params, f) {
    // Set [4] as default value for params['volts']
    params = params || {};
    params['volts'] = params['volts'] || [4];

    super(xa, xb, ya, yb, params, f);

    this.pins[4].value = !this.pins[3].value;
  }

  static get NAME() {
    return "JK Flip-Flop";
  }

  numPosts() {
    return 5;
  }

  numVoltageSources() {
    return 2;
  }

  setupPins() {
    this.sizeX = 2;
    this.sizeY = 3;

    this.pins = new Array(5);
    this.pins[0] = new ChipElm.Pin(0, ChipElm.SIDE_W, "J");
    this.pins[1] = new ChipElm.Pin(1, ChipElm.SIDE_W, "");
    this.pins[1].clock = true;
    this.pins[1].bubble = true;
    this.pins[2] = new ChipElm.Pin(2, ChipElm.SIDE_W, "K");
    this.pins[3] = new ChipElm.Pin(0, ChipElm.SIDE_E, "Q");
    this.pins[3].output = this.pins[3].state = true;
    this.pins[4] = new ChipElm.Pin(2, ChipElm.SIDE_E, "Q");
    this.pins[4].output = true;
    this.pins[4].lineOver = true;
  }

  execute() {
    if (!this.pins[1].value && this.lastClock) {
      let q = this.pins[3].value;

      if (this.pins[0].value) {
        if (this.pins[2].value) {
          q = !q;
        } else {
          q = true;
        }
      } else if (this.pins[2].value) {
        q = false;
      }

      this.pins[3].value = q;
      this.pins[4].value = !q;
    }

    return this.lastClock = this.pins[1].value;
  }
}


module.exports = JkFlipFlopElm;
