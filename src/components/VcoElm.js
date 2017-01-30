let CircuitComponent = require("./CircuitComponent.js");
let ChipElm = require("./ChipElm.js");
let Util = require('../util/Util.js');

// TODO Fails on this line: stamper.updateVoltageSource(0, this.nodes[1], this.pins[1].voltSource, vo);
class VcoElm extends ChipElm {
  constructor(xa, xb, ya, yb, params, f) {
    super(xa, xb, ya, yb, params, f);

    // TODO: paramify
    this.cResistance = 1e6;
  }

  getName() {
    return "Voltage Controlled Oscillator";
  }

  nonLinear() {
    return true;
  }

  numPosts() {
    return 6;
  }

  numVoltageSources() {
    return 3;
  }

  setupPins() {
    this.sizeX = 2;
    this.sizeY = 4;
    this.pins = new Array(6);

    this.pins[0] = new ChipElm.Pin(0, ChipElm.SIDE_W, "Vi");
    this.pins[1] = new ChipElm.Pin(3, ChipElm.SIDE_W, "Vo");
    this.pins[1].output = true;

    this.pins[2] = new ChipElm.Pin(0, ChipElm.SIDE_E, "C");
    this.pins[3] = new ChipElm.Pin(1, ChipElm.SIDE_E, "C");
    this.pins[4] = new ChipElm.Pin(2, ChipElm.SIDE_E, "R1");
    this.pins[4].output = true;

    this.pins[5] = new ChipElm.Pin(3, ChipElm.SIDE_E, "R2");
    this.pins[5].output = true;
  }

  computeCurrent() {
    if (this.cResistance === 0) {
      return;
    }

    let c = (this.cDir * (this.pins[4].current + this.pins[5].current)) + ((this.volts[3] - this.volts[2]) / this.cResistance);

    this.pins[2].current = -c;
    this.pins[3].current = c;
    return this.pins[0].current = -this.pins[4].current;
  }

  stamp(stamper) {
    stamper.stampVoltageSource(0, this.nodes[1], this.pins[1].voltSource);
    stamper.stampVoltageSource(this.nodes[0], this.nodes[4], this.pins[4].voltSource, 0);
    stamper.stampVoltageSource(0, this.nodes[5], this.pins[5].voltSource, 5);

    stamper.stampResistor(this.nodes[2], this.nodes[3], this.cResistance);
    stamper.stampNonLinear(this.nodes[2]);
    return stamper.stampNonLinear(this.nodes[3]);
  }

  doStep(stamper) {
    let vc = this.volts[3] - this.volts[2];
    let vo = this.volts[1];

    let dir = (vo < 2.5) ? 1 : -1;

    if ((vo < 2.5) && (vc > 4.5)) {
      vo = 5;
      dir = -1;
    }

    if ((vo > 2.5) && (vc < 0.5)) {
      vo = 0;
      dir = 1;
    }

    stamper.updateVoltageSource(0, this.nodes[1], this.pins[1].voltSource, vo);

    let cur1 = this.getParentCircuit().getNodes().length + this.pins[4].voltSource;
    let cur2 = this.getParentCircuit().getNodes().length + this.pins[5].voltSource;

    stamper.stampMatrix(this.nodes[2], cur1, dir);
    stamper.stampMatrix(this.nodes[2], cur2, dir);
    stamper.stampMatrix(this.nodes[3], cur1, -dir);
    stamper.stampMatrix(this.nodes[3], cur2, -dir);

    return this.cDir = dir;
  }


  draw(renderContext) {
    this.computeCurrent();
    return this.drawChip(renderContext);
  }
}


module.exports = VcoElm;
