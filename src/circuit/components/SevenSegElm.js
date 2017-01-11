let CircuitComponent = require("../circuitComponent.js");
let ChipElm = require("./ChipElm.js");

class SevenSegElm extends ChipElm {

  constructor(xa, xb, ya, yb, params, f) {
    super(xa, xb, ya, yb, params, f);
  }

  getDumpType() {
    return "157";
  }

  getPostCount() {
    return 7;
  }

  getVoltageSourceCount() {
    return 0;
  }

  getName() {
    return "7 segment display";
  }

  setupPins() {
    this.sizeX = 4;
    this.sizeY = 4;

    this.pins = new Array(7);

    this.pins[0] = new ChipElm.Pin(0, ChipElm.SIDE_W, "a");
    this.pins[1] = new ChipElm.Pin(1, ChipElm.SIDE_W, "b");
    this.pins[2] = new ChipElm.Pin(2, ChipElm.SIDE_W, "c");
    this.pins[3] = new ChipElm.Pin(3, ChipElm.SIDE_W, "d");
    this.pins[4] = new ChipElm.Pin(1, ChipElm.SIDE_S, "e");
    this.pins[5] = new ChipElm.Pin(2, ChipElm.SIDE_S, "f");
    return this.pins[6] = new ChipElm.Pin(3, ChipElm.SIDE_S, "g");
  }
}

module.exports = SevenSegElm;
