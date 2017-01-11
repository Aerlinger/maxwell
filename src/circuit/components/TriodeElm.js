let CircuitComponent = require("../circuitComponent.js");
let Util = require('../../util/util.js');

class TriodeElm extends CircuitComponent {
  static get Fields() {
    return {
      mu: {
        name: "",
        data_type: parseFloat
      },
      kg1: {
        name: "",
        data_type: parseFloat
      }
    };
  }

  constructor(xa, xb, ya, yb, params, f) {
    super(xa, xb, ya, yb, params, f);

    this.gridCurrentR = 6000;

    this.setup();
  }

  setup() {
    return this.noDiagonal = true;
  }

  nonLinear() {
    return true;
  }

  reset() {
    this.volts[0] = 0;
    this.volts[1] = 0;
    this.volts[2] = 0;
    return this.curcount = 0;
  }

  getDumpType() {
    return '173';
  }

  getPost(n) {
    if (n === 0) {
      return this.plate[0];
    } else {
      if (n === 1) {
        return this.grid[0];
      } else {
        return this.cath[0];
      }
    }
  }

  getPostCount() {
    return 3;
  }

  nonLinear() {
    return true;
  }

  getPower() {
    return (this.volts[0] - this.volts[2]) * this.current;
  }

  setPoints() {
    super.setPoints(...arguments);

    this.plate = new Array(4);
    this.grid = new Array(8);
    this.cath = new Array(4);

    this.grid[0] = this.point1;

    let nearw = 8;
    let farw = 32;
    let platew = 18;

    this.plate[1] = Util.interpolate(this.point1, this.point2, 1, nearw);
    this.plate[0] = Util.interpolate(this.point1, this.point2, 1, farw);
    [this.plate[2], this.plate[3]] = Util.interpolateSymmetrical(this.point2, this.plate[1], 1, platew);

    let circler = 24;
    this.grid[1] = Util.interpolate(this.point1, this.point2, (this.dn() - circler) / this.dn(), 0);

    for (let i = 0; i < 3; i++) {
      this.grid[2 + (i * 2)] = Util.interpolate(this.grid[1], this.point2, ((i * 3) + 1) / 4.5, 0);
      this.grid[3 + (i * 2)] = Util.interpolate(this.grid[1], this.point2, ((i * 3) + 2) / 4.5, 0);
    }

    this.midgrid = this.point2;

    let cathw = 16;
    this.midcath = Util.interpolate(this.point1, this.point2, 1, -nearw);

    [this.cath[1], this.cath[2]] = Util.interpolateSymmetrical(this.point2, this.plate[1], -1, cathw);
    this.cath[3] = Util.interpolate(this.point2, this.plate[1], -1.2, -cathw);
    return this.cath[0] = Util.interpolate(this.point2, this.plate[1], Math.floor(-farw / nearw), cathw);
  }

  stamp(stamper) {
    stamper.stampNonLinear(this.nodes[0]);
    stamper.stampNonLinear(this.nodes[1]);
    return stamper.stampNonLinear(this.nodes[2]);
  }

  getConnection(n1, n2) {
    return !((n1 === 1) || (n2 === 1));
  }

  doStep(stamper) {
    let vs = new Array(3);

    vs[0] = this.volts[0];
    vs[1] = this.volts[1];
    vs[2] = this.volts[2];

    if (vs[1] > (this.lastv1 + 0.5)) {
      vs[1] = this.lastv1 + 0.5;
    }
    if (vs[1] < (this.lastv1 - 0.5)) {
      vs[1] = this.lastv1 - 0.5;
    }
    if (vs[2] > (this.lastv2 + 0.5)) {
      vs[2] = this.lastv2 + 0.5;
    }
    if (vs[2] < (this.lastv2 - 0.5)) {
      vs[2] = this.lastv2 - 0.5;
    }

    let grid = 1;
    let cath = 2;
    let plate = 0;

    let vgk = vs[grid] - vs[cath];
    let vpk = vs[plate] - vs[cath];

    if ((Math.abs(this.lastv0 - vs[0]) > .01) || (Math.abs(this.lastv1 - vs[1]) > .01) || (Math.abs(this.lastv2 - vs[2]) > .01)) {
      this.getParentCircuit().Solver.converged = false;
    }

    this.lastv0 = vs[0];
    this.lastv1 = vs[1];
    this.lastv2 = vs[2];

    let ids = 0;
    let gm = 0;
    let Gds = 0;
    let ival = vgk + (vpk / this.mu);

    this.currentg = 0;

    if (vgk > .01) {
      stamper.stampResistor(this.nodes[grid], this.nodes[cath], this.gridCurrentR);
      this.currentg = vgk / this.gridCurrentR;
    }

    if (ival < 0) {
      Gds = 1e-8;
      ids = vpk * Gds;
    } else {
      ids = Math.pow(ival, 1.5) / this.kg1;
      let q = (1.5 * Math.sqrt(ival)) / this.kg1;
      // gm = dids/dgk
      // Gds = dids/dpk
      Gds = q;
      gm = q / this.mu;
    }

    this.currentp = ids;
    this.currentc = ids + this.currentg;
    
    let rs = -ids + (Gds * vpk) + (gm * vgk);
    
    stamper.stampMatrix(this.nodes[plate], this.nodes[plate], Gds);
    stamper.stampMatrix(this.nodes[plate], this.nodes[cath], -Gds - gm);
    stamper.stampMatrix(this.nodes[plate], this.nodes[grid], gm);

    stamper.stampMatrix(this.nodes[cath], this.nodes[plate], -Gds);
    stamper.stampMatrix(this.nodes[cath], this.nodes[cath], Gds + gm);
    stamper.stampMatrix(this.nodes[cath], this.nodes[grid], -gm);

    stamper.stampRightSide(this.nodes[plate], rs);
    return stamper.stampRightSide(this.nodes[cath], -rs);
  }
}
TriodeElm.initClass();

module.exports = TriodeElm;
