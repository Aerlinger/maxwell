let CircuitComponent = require('./CircuitComponent.js');
let Settings = require('../Settings.js');
let Polygon = require('../geom/Polygon.js');
let Rectangle = require('../geom/Rectangle.js');
let Point = require('../geom/Point.js');
let Util = require("../util/Util.js");

class OpAmpElm extends CircuitComponent {
  static initClass() {
    this.FLAG_SWAP = 1;
    this.FLAG_SMALL = 2;
    this.FLAG_LOWGAIN = 4;
  }

  static get Fields() {
    return {
      "maxOut": {
        name: "Voltage",
        unit: "Voltage",
        description: "Maximum allowable output voltage of the Op Amp",
        symbol: "V",
        default_value: 15,
        data_type: parseFloat,
        range: [-Infinity, Infinity],
      },
      "minOut": {
        name: "Voltage",
        unit: "Voltage",
        description: "Minimum allowable output voltage of the Op Amp",
        symbol: "V",
        default_value: -15,
        data_type: parseFloat,
        range: [-Infinity, Infinity],
        type: "physical"
      },
      "gbw": {
        name: "Gain",
        unit: "",
        description: "Gutput gain",
        symbol: "",
        default_value: 1e6,
        data_type: parseFloat,
        range: [-Infinity, Infinity],
        type: "physical"
      }
    };
  }

  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);

    this.opsize = 0;
    this.opwidth = 0;
    this.opaddtext = 0;
    this.maxOut = this.params.maxOut;
    this.minOut = this.params.minOut;

    // this.nOut = 0
    // this.lastvd = 0
    this.gain = 1e6;
    this.reset = false;
    this.in1p = [];
    this.in2p = [];
    this.textp = [];

    // GBW has no effect in this version of the simulator, but we retain it to keep the file format the same
    this.gbw = this.params.gbw;

    this.noDiagonal = true;

    this.setSize((f & OpAmpElm.FLAG_SMALL) !== 0 ? 1 : 2);
    this.setGain();

    this.place();
    this.allocNodes();
  }

  setGain() {
    // gain of 100000 breaks e-amp-dfdx
    // gain was 1000, but it broke amp-schmitt
    return this.gain = (((this.flags & OpAmpElm.FLAG_LOWGAIN) !== 0) ? 1000 : 100000);
  }

  nonLinear() {
    return true;
  }

  draw(renderContext) {
    // this.setBbox(this.point1.x, this.in1p[0].y, this.point2.x, this.in2p[0].y);
    //this.setBboxPt(this.point1, this.point2, Math.floor(this.opheight * this.dsign()));

    // Terminal 1
    let color = renderContext.getVoltageColor(this.volts[0]);
    renderContext.drawLinePt(this.in1p[0], this.in1p[1], color);
//    renderContext.drawValue(@in1p[1].x, )

    // Terminal 2
    color = renderContext.getVoltageColor(this.volts[1]);
    renderContext.drawLinePt(this.in2p[0], this.in2p[1], color);


    // Terminal 3
    color = renderContext.getVoltageColor(this.volts[2]);
    renderContext.drawLinePt(this.lead2, this.point2, color);

    // Body
    renderContext.drawPolygon(this.triangle, Settings.STROKE_COLOR, Settings.FG_COLOR);

    renderContext.drawText("+", this.in1p[1].x + 5, this.in1p[1].y + 5, Settings.LABEL_COLOR);
    renderContext.drawText("-", this.in2p[1].x + 5, this.in2p[1].y + 5, Settings.LABEL_COLOR);

    if (this.getParentCircuit() && this.getParentCircuit()) {
      this.updateDots();
      renderContext.drawDots(this.in1p[0], this.in1p[1], renderContext);
      renderContext.drawDots(this.point2, this.lead2, this);

      renderContext.drawPosts(this);
    }

    if (this.Circuit && this.Circuit.debugModeEnabled()) {
      return super.debugDraw(renderContext);
    }
  }

  getPower() {
    return this.volts[2] * this.current;
  }

  setSize(s) {
    this.opsize = s;
    this.opheight = 8 * s;
    return this.opwidth = 13 * s;
  }

  place() {
    let ww;
    //super.setPoints(...arguments);
//    @setSize 2

    if (ww > (this.dn() / 2)) {
      ww = Math.floor(this.dn() / 2);
    } else {
      ww = Math.floor(this.opwidth);
    }

    this.calcLeads(ww * 2);
    let hs = Math.floor(this.opheight * this.dsign());

    this.in1p = Util.newPointArray(2);
    this.in2p = Util.newPointArray(2);
    this.textp = Util.newPointArray(2);

    [this.in1p[0], this.in2p[0]] = Util.interpolateSymmetrical(this.point1, this.point2, 0, hs);
    [this.in1p[1], this.in2p[1]] = Util.interpolateSymmetrical(this.lead1, this.lead2, 0, hs);
    [this.textp[0], this.textp[1]] = Util.interpolateSymmetrical(this.lead1, this.lead2, .2, hs);

    let tris = Util.newPointArray(2);
    [tris[0], tris[1]] = Util.interpolateSymmetrical(this.lead1, this.lead2, 0, hs * 2);
    this.triangle = Util.createPolygonFromArray([tris[0], tris[1], this.lead2]);

    this.setBboxPt(this.lead1, this.lead2, 2*hs)
  }

  static get NAME() {
    return "OpAmp"
  }

  numPosts() {
    return 3;
  }

  getPost(n) {
    return ((n === 0) ? this.in1p[0] : ((n === 1) ? this.in2p[0] : this.point2));
  }

  numVoltageSources() {
    return 1;
  }

  getInfo(arr) {
    super.getInfo();
    arr[0] = "op-amp";
    arr[1] = `V+ = ${Util.getUnitText(this.volts[1], "V")}`;
    arr[2] = `V- = ${Util.getUnitText(this.volts[0], "V")}`;

    // sometimes the voltage goes slightly outside range, to make convergence easier.  so we hide that here.
    let vo = Math.max(Math.min(this.volts[2], this.maxOut), this.minOut);
    arr[3] = `Vout = ${Util.getUnitText(vo, "V")}`;
    arr[4] = `Iout = ${Util.getUnitText(this.getCurrent(), "A")}`;
    return arr[5] = `range = ${Util.getUnitText(this.minOut, "V")} to ${Util.getUnitText(this.maxOut, "V")}`;
  }

  stamp(stamper) {
//      console.log("\nStamping OpAmpElm")
    let vn = this.Circuit.numNodes() + this.voltSource;
    stamper.stampNonLinear(vn);
    return stamper.stampMatrix(this.nodes[2], vn, 1);
  }

  doStep(stamper) {
    let vd = this.volts[1] - this.volts[0];

    // TODO: Simplify conditional
    if (Math.abs(this.lastvd - vd) > .1) {
      this.Circuit.Solver.converged = false;
    } else if ((this.volts[2] > (this.maxOut + .1)) || (this.volts[2] < (this.minOut - .1))) {
      this.Circuit.Solver.converged = false;
    }

    let x = 0;
    let vn = this.Circuit.numNodes() + this.voltSource;
    let dx = 0;

    if ((vd >= (this.maxOut / this.gain)) && ((this.lastvd >= 0) || (Util.getRand(4) === 1))) {
      dx = 1e-4;
      x = this.maxOut - ((dx * this.maxOut) / this.gain);
    } else if ((vd <= (this.minOut / this.gain)) && ((this.lastvd <= 0) || (Util.getRand(4) === 1))) {
      dx = 1e-4;
      x = this.minOut - ((dx * this.minOut) / this.gain);
    } else {
      dx = this.gain;
    }

    //console.log("opamp " + vd + " " + volts[2] + " " + dx + " "  + x + " " + lastvd + " " + sim.converged);
    // Newton's method:
    stamper.stampMatrix(vn, this.nodes[0], dx);
    stamper.stampMatrix(vn, this.nodes[1], -dx);
    stamper.stampMatrix(vn, this.nodes[2], 1);
    stamper.stampRightSide(vn, x);
    return this.lastvd = vd;
  }


  //if (sim.converged)
  //     console.log((volts[1]-volts[0]) + " " + volts[2] + " " + initvd);

  // there is no current path through the op-amp inputs, but there is an indirect path through the output to ground.
  getConnection(n1, n2) {
    return false;
  }

  hasGroundConnection(n1) {
    return n1 === 2;
  }

  getVoltageDiff() {
    return this.volts[2] - this.volts[1];
  }
}
OpAmpElm.initClass();

module.exports = OpAmpElm;
