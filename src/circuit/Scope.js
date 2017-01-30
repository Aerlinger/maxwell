let Rectangle = require("../geom/Rectangle.js");
let Util = require("../util/Util.js");

class Scope {
  static initClass() {
    this.VAL_POWER = 1;
    this.VAL_IB = 1;
    this.VAL_IC = 2;
    this.VAL_IE = 3;
    this.VAL_VBE = 4;
    this.VAL_VBC = 5;
    this.VAL_VCE = 6;
    this.VAL_R = 2;
  }

  // Position is a vector of [x1, y1, x2, y2] where x1, y1 is the upper-left corner and x2, y2 is the lower-right corner
  constructor(position, params) {
    this.params = params;

    this.elm = parseInt(params['elm']);
    this.speed = parseFloat(params['speed']);
    this.value = parseFloat(params['value']);
    this.options = params['options'];
    this.voltageRange = parseFloat(params["voltageRange"]);
    this.currentRange = parseFloat(params["currentRange"]);

    this.pos = parseInt(params['pos']) || 0;
    this.ye = parseInt(params['ye']) || 0;
    this.label = params['label'] || "";

    this.context = null;

    if (!position) {
      // console.log(position, this.pos)
      // Bounding Box?
      this.boundingBox = new Rectangle(this.pos * 100, 100, this.pos * 100 + 300, 100);
    } else {
      this.boundingBox = new Rectangle(position[0], position[1], position[2] - position[0], position[3] - position[1]);
    }
  }

  setCanvas(scopeCanvas) {
    this.scopeCanvas = scopeCanvas;
  }

  getCanvas(scopeCanvas) {
    return this.scopeCanvas;
  }

  setCircuit(circuit) {
    this.circuitElm = circuit.getElmByIdx(this.elm);
    this.circuit = circuit;
  }

  setContext(context) {

  }

  reset() {
    let lockScale, showMax, showMin, showV;
    this.minMaxV = 5;
    this.minMaxI = 0.1;
    this.speed = 64;
    this.showI = showV = showMax = true;
    this.showFreq = lockScale = showMin = false;
    this.plot2d = false;

    // no showI for Output
    if ((elm !== null) && (this.elm instanceof OutputElm || this.elm instanceof LogicOutputElm || this.elm instanceof ProbeElm)) {
      this.showI = false;
    }

    this.value = this.ivalue = 0;

    if (this.elm instanceof TransistorElm) {
      return this.value = VAL_VCE;
    }
  }

  getName() {
    return "Scope Output"
  }

  resetGraph() {
    this.scopePointCount = 1;

    while (this.scopePointCount <= this.boundingBox.width) {
      this.scopePointCount *= 2;
    }

    this.minV = Util.zeroArray(this.scopePointCount);
    this.maxV = Util.zeroArray(this.scopePointCount);
    this.minI = Util.zeroArray(this.scopePointCount);
    this.maxI = Util.zeroArray(this.scopePointCount);

    return this.ptr = this.ctr = 0;
  }

  draw(renderContext) {
    return renderContext.drawLinePt(this.boundingBox.x, this.boundingBox.y, this.boundingBox.x + this.boundingBox.width, this.boundingBox.y + this.boundingBox.height);
  }

  setElm(ce){
    return this.elm = ce;
  }

  serialize() {
    let pos = [
      this.boundingBox.x,
      this.boundingBox.y,
      this.boundingBox.x + this.boundingBox.width,
      this.boundingBox.y + this.boundingBox.height
    ];

    return {
      name: "Scope",
      pos: pos,
      params: {
        elm: this.elm,
        speed: this.speed,
        value: this.value,
        voltageRange: this.voltageRange,
        currentRange: this.currentRange,
        options: this.options,
        pos: this.pos,
        ye: this.ye
      }
    }
  }

  sampleVoltage(time, voltage) {
    if (this.scopeCanvas) {
      this.scopeCanvas.addVoltage(time, voltage);
    }
  }

  redraw() {
    if (this.scopeCanvas) {
      this.scopeCanvas.redraw();
    }
  }

  sampleCurrent(time, voltage) {
    if (this.scopeCanvas) {
      this.scopeCanvas.addCurrent(time, voltage);
    }
  }

  static tokenize(inputStr) {
    // inputStr = "1 64 0 34 12.0 1.220703125E-5 0 -1";

    let tokens = inputStr.split(" ");

    tokens.shift();
    let elm = parseInt(tokens[0]);
    let speed = parseFloat(tokens[1]);
    let value = parseFloat(tokens[2]);
    let options = parseInt(tokens[3]);

    let voltageRange
    if (tokens.length > 4)
      voltageRange = parseFloat(tokens[4]);

    let currentRange
    if (tokens.length > 5)
      currentRange = parseFloat(tokens[5]);

    let pos;
    if (tokens.length > 6)
      pos = parseInt(tokens[6]);

    let ye;
    if (tokens.length > 7)
      ye = parseFloat(tokens[7]);

    let label;
    if (tokens.length > 8)
      label = tokens[8];

    return {
      elm,
      speed,
      value,
      options,
      voltageRange,
      currentRange,
      pos,
      ye,
      label
    }
  }

}
Scope.initClass();


module.exports = Scope;
