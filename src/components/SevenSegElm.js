let CircuitComponent = require("./CircuitComponent.js");
let Settings = require('../settings/Settings.js');
let ChipElm = require("./ChipElm.js");

class SevenSegElm extends ChipElm {

  constructor(xa, xb, ya, yb, params, f) {
    super(xa, xb, ya, yb, params, f);
  }

  getPostCount() {
    return 7;
  }

  getVoltageSourceCount() {
    return 0;
  }

  getName() {
    return "7 Segment Display";
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
    
    let color = "#333";

    // TOP
    if (this.pins[0].value > 0)
      renderContext.drawLine(xl, yl, xl + this.cspc, yl, 2*Settings.LINE_WIDTH);

    // TOP-RIGHT
    if (this.pins[1].value > 0)
      renderContext.drawLine(xl + this.cspc, yl, xl + this.cspc, yl + this.cspc, 2*Settings.LINE_WIDTH);

    // BOTTOM-RIGHT
    if (this.pins[2].value > 0)
      renderContext.drawLine(xl + this.cspc, yl + this.cspc, xl + this.cspc, yl + this.cspc2, 2*Settings.LINE_WIDTH);

    // BOTTOM
    if (this.pins[3].value > 0)
      renderContext.drawLine(xl, yl + this.cspc2, xl + this.cspc, yl + this.cspc2, 2*Settings.LINE_WIDTH);

    // BOTTOM-LEFT
    if (this.pins[4].value > 0)
      renderContext.drawLine(xl, yl + this.cspc, xl, yl + this.cspc2, 2*Settings.LINE_WIDTH);

    // TOP-LEFT
    if (this.pins[5].value > 0)
      renderContext.drawLine(xl, yl, xl, yl + this.cspc, 2*Settings.LINE_WIDTH);

    // MIDDLE
    if (this.pins[6].value > 0)
      renderContext.drawLine(xl, yl + this.cspc, xl + this.cspc, yl + this.cspc, 2*Settings.LINE_WIDTH);

  }

  getColor(p) {
    return this.pins[p].value;
  }
}

module.exports = SevenSegElm;
