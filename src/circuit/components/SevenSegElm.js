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
    this.pins[6] = new ChipElm.Pin(3, ChipElm.SIDE_S, "g");
  }

  draw(renderContext) {
    this.drawChip(renderContext);

    let xl = this.point1.x + this.cspc * 5;
    let yl = this.point1.y + this.cspc;

    // TOP
    if (this.pins[0])
      renderContext.drawLine(xl, yl, xl + this.cspc, yl, "#FF0000");

    // TOP-RIGHT
    if (this.pins[1])
      renderContext.drawLine(xl + this.cspc, yl, xl + this.cspc, yl + this.cspc, "#00FF00");

    // BOTTOM-RIGHT
    if (this.pins[2])
      renderContext.drawLine(xl + this.cspc, yl + this.cspc, xl + this.cspc, yl + this.cspc2, "#0000FF");

    // BOTTOM
    if (this.pins[3])
      renderContext.drawLine(xl, yl + this.cspc2, xl + this.cspc, yl + this.cspc2, "#FF00FF");

    // BOTTOM-LEFT
    if (this.pins[4])
      renderContext.drawLine(xl, yl + this.cspc, xl, yl + this.cspc2, "#00FFFF");

    // TOP-LEFT
    if (this.pins[5])
      renderContext.drawLine(xl, yl, xl, yl + this.cspc, "#FFFF00");

    // MIDDLE
    if (this.pins[6])
      renderContext.drawLine(xl, yl + this.cspc, xl + this.cspc, yl + this.cspc);

  }

  getColor(p) {
    return this.pins[p].value;
  }
}

module.exports = SevenSegElm;
