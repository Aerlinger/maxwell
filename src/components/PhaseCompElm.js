let CircuitComponent = require("./CircuitComponent.js");
let ChipElm = require("./ChipElm.js");
let Util = require('../util/Util.js');

class PhaseCompElm extends ChipElm {

  constructor(xa, xb, ya, yb, params, f) {
    super(xa, xb, ya, yb, params, f);
    
    this.ff1 = false;
    this.ff2 = false;
  }

  getName() {
    return "Phase Comparator";
  }

  setupPins() {
    this.sizeX = 2;
    this.sizeY = 2;
    this.pins = new Array(3);

    this.pins[0] = new ChipElm.Pin(0, ChipElm.SIDE_W, "I1");
    this.pins[1] = new ChipElm.Pin(1, ChipElm.SIDE_W, "I2");
    this.pins[2] = new ChipElm.Pin(0, ChipElm.SIDE_E, "O");

    return this.pins[2].output = true;
  }

  numPosts() {
    return 3;
  }

  numVoltageSources() {
    return 1;
  }

  nonLinear() {
    return true;
  }

  stamp(stamper) {
    let vn = this.getParentCircuit().getNodes().length + this.pins[2].voltSource;

    stamper.stampNonLinear(vn);
    stamper.stampNonLinear(0);
    return stamper.stampNonLinear(this.nodes[2]);
  }

  doStep(stamper) {
    let out;
    let v1 = this.volts[0] > 2.5;
    let v2 = this.volts[1] > 2.5;

    if (v1 && !this.pins[0].value) {
      this.ff1 = true;
    }
    if (v2 && !this.pins[1].value) {
      this.ff2 = true;
    }
    if (this.ff1 && this.ff2) {
      this.ff1 = this.ff2 = false;
    }

    if (this.ff1) {
      out = 5;
    } else {
      if (this.ff2) {
        out = 0;
      } else {
        out = -1;
      }
    }

    if (out !== -1) {
      stamper.stampVoltageSource(0, this.nodes[2], this.pins[2].voltSource, out);
    } else {
      let vn = this.getParentCircuit().numNodes() + this.pins[2].voltSource;
      stamper.stampMatrix(vn, vn, 1);
    }

    this.pins[0].value = v1;
    return this.pins[1].value = v2;
  }
}

module.exports = PhaseCompElm;
