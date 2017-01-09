let CircuitComponent = require("../circuitComponent.js");
let Util = require('../../util/util.js');

class TunnelDiodeElm extends CircuitComponent {
  constructor(xa, xb, ya, yb, params, f) {
    super(xa, xb, ya, yb, params, f);

    this.pvp = .1;
    this.pip = 4.7e-3;
    this.pvv = .37;
    this.pvt = .026;
    this.pvpp = .525;
    this.piv = 370e-6;
    this.hs = 8;
    this.lastvoltdiff = 0;

    this.setup();
  }

  reset() {
    return this.lastvoltdiff = this.volts[0] = this.volts[1] = this.curcount = 0;
  }

  nonLinear() {
    return true;
  }

  setup() {}

  getDumpType() {
    return "175";
  }

  setPoints() {
    super.setPoints(...arguments);
    this.calcLeads(16);
    this.cathode = new Array(4);
    let pa = new Array(2);

    [pa[0], pa[1]] = Util.interpolateSymmetrical(this.lead1, this.lead2, 0, this.hs);
    [this.cathode[0], this.cathode[1]] = Util.interpolateSymmetrical(this.lead1, this.lead2, 1, this.hs);
    [this.cathode[2], this.cathode[3]] = Util.interpolateSymmetrical(this.lead1, this.lead2, 0.8, this.hs);

    return this.poly = Util.createPolygon(pa[0], pa[1], this.lead2);
  }

  limitStep(vnew, vold) {
    if (vnew > (vold + 1)) {
      return vold + 1;
    }

    if (vnew < (vold - 1)) {
      return vold - 1;
    }

    return vnew;
  }

  stamp(stamper) {
    stamper.stampNonLinear(this.nodes[0]);
    return stamper.stampNonLinear(this.nodes[1]);
  }

  calculateCurrent() {
    let voltdiff = this.volts[0] - this.volts[1];

    this.current = (this.pip * Math.exp(-this.pvpp / this.pvt) * (Math.exp(voltdiff / this.pvt) - 1)) +
      (this.pip * (voltdiff / this.pvp) * Math.exp(1 - (voltdiff / this.pvp))) +
      (this.piv * Math.exp(voltdiff - this.pvv));

    //console.log("CUR: ", @current)

    return this.current;
  }

  doStep(stamper) {
    let voltdiff = this.volts[0] - this.volts[1];

    if (Math.abs(voltdiff - this.lastvoltdiff) > 0.01) {
      this.getParentCircuit().Solver.converged = false;
    }

    //console.log(voltdiff + " " + @lastvoltdiff + " " + Math.abs(voltdiff-@lastvoltdiff))
    voltdiff = this.limitStep(voltdiff, this.lastvoltdiff);

    this.lastvoltdiff = voltdiff;

    let i = (this.pip * Math.exp(-this.pvpp / this.pvt) * (Math.exp(voltdiff / this.pvt) - 1)) +
      (this.pip * (voltdiff / this.pvp) * Math.exp(1 - (voltdiff / this.pvp))) +
      (this.piv * Math.exp(voltdiff - this.pvv));

    let geq = ((this.pip * Math.exp(-this.pvpp / this.pvt) * Math.exp(voltdiff / this.pvt)) / this.pvt) +
      ((this.pip * Math.exp(1 - (voltdiff / this.pvp))) / this.pvp);
    ((- Math.exp(1 - (voltdiff / this.pvp)) * this.pip * voltdiff) / (this.pvp * this.pvp)) +
      (Math.exp(voltdiff - this.pvv) * this.piv);

    let nc = i - (geq * voltdiff);

    //console.log("TD: " + geq + ", " + nc)
    stamper.stampConductance(this.nodes[0], this.nodes[1], geq);
    return stamper.stampCurrentSource(this.nodes[0], this.nodes[1], nc);
  }
}


module.exports = TunnelDiodeElm;