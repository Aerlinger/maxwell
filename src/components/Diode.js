// Unused!
class Diode {
  static initClass() {
    this.leakage = 1e-14;
  }
  //Inductor.FLAG_BACK_EULER = 2;

  constructor(circuit) {
    this.nodes = new Array(2);
    this.vt = 0;
    this.vdcoef = 0;
    this.fwdrop = 0;
    this.zvoltage = 0;
    this.zoffset = 0;
    this.lastvoltdiff = 0;
    this.crit = 0;
    this.circuit = circuit;
    this.leakage = 1e-14;
  }

  setup(fw, zv) {
    this.fwdrop = fw;
    this.zvoltage = zv;
    this.vdcoef = Math.log((1 / this.leakage) + 1) / this.fwdrop;
    this.vt = 1 / this.vdcoef;

    // critical voltage for limiting; current is vt/sqrt(2) at this voltage
    this.vcrit = this.vt * Math.log(this.vt / (Math.sqrt(2) * this.leakage));

    if (this.zvoltage !== 0) {
      // calculate offset which will give us 5mA at zvoltage
      let i = -.005;
      return this.zoffset = this.zvoltage - (Math.log(-(1 + (i / this.leakage))) / this.vdcoef);
    }
  }

  reset() {
    return this.lastvoltdiff = 0;
  }

  limitStep(vnew, vold) {
    let v0;
    let arg = undefined;
    let oo = vnew;

    // check new voltage; has current changed by factor of e^2?
    if ((vnew > this.vcrit) && (Math.abs(vnew - vold) > (this.vt + this.vt))) {
      if (vold > 0) {
        arg = 1 + ((vnew - vold) / this.vt);
        if (arg > 0) {
          // adjust vnew so that the current is the same
          // as in linearized model from previous iteration.
          // current at vnew = old current * arg
          vnew = vold + (this.vt * Math.log(arg));

          // current at v0 = 1uA
          v0 = Math.log(1e-6 / this.leakage) * this.vt;
          vnew = Math.max(v0, vnew);
        } else {
          vnew = this.vcrit;
        }
      } else {
        // adjust vnew so that the current is the same
        // as in linearized model from previous iteration.
        // (1/vt = slope of load line)
        vnew = this.vt * Math.log(vnew / this.vt);
      }
      this.circuit.Solver.converged = false;

    } else if ((vnew < 0) && (this.zoffset !== 0)) {
      // for Zener breakdown, use the same logic but translate the values
      vnew = -vnew - this.zoffset;
      vold = -vold - this.zoffset;
      if ((vnew > this.vcrit) && (Math.abs(vnew - vold) > (this.vt + this.vt))) {
        if (vold > 0) {
          arg = 1 + ((vnew - vold) / this.vt);
          if (arg > 0) {
            vnew = vold + (this.vt * Math.log(arg));
            v0 = Math.log(1e-6 / this.leakage) * this.vt;
            vnew = Math.max(v0, vnew);

          } else {
            vnew = this.vcrit;
          }
        } else {
          vnew = this.vt * Math.log(vnew / this.vt);
        }
        this.circuit.Solver.converged = false;
      }
      vnew = -(vnew + this.zoffset);
    }
    return vnew;
  }


  // public
  stamp(n0, n1, stamper) {
    this.nodes[0] = n0;
    this.nodes[1] = n1;
    stamper.stampNonLinear(this.nodes[0]);
    return stamper.stampNonLinear(this.nodes[1]);
  }

  // public
  doStep(voltdiff, stamper) {
    // used to have .1 here, but needed .01 for peak detector
    let geq, nc;
    if (Math.abs(voltdiff - this.lastvoltdiff) > .01) {
      this.circuit.Solver.converged = false;
    }
    voltdiff = this.limitStep(voltdiff, this.lastvoltdiff);

    this.lastvoltdiff = voltdiff;

    if ((voltdiff >= 0) || (this.zvoltage === 0)) {
      // regular diode or forward-biased zener
      let eval_ = Math.exp(voltdiff * this.vdcoef);

      // make diode linear with negative voltages; aids convergence
      if (voltdiff < 0) { eval_ = 1; }
      geq = this.vdcoef * this.leakage * eval_;
      nc = ((eval_ - 1) * this.leakage) - (geq * voltdiff);

      stamper.stampConductance(this.nodes[0], this.nodes[1], geq);
      return stamper.stampCurrentSource(this.nodes[0], this.nodes[1], nc);
    } else {
      // Zener diode
      //* I(Vd) = Is * (exp[Vd*C] - exp[(-Vd-Vz)*C] - 1 )
      //*
      //* geq is I'(Vd)
      //* nc is I(Vd) + I'(Vd)*(-Vd)
      let exp0 = Math.exp(voltdiff * this.vdcoef);
      let exp1 = Math.exp((-voltdiff - this.zoffset) * this.vdcoef);

      geq =  this.leakage * (exp0 + exp1) * this.vdcoef;
      nc =   (this.leakage * (exp0 - exp1 - 1)) + (geq * -voltdiff);

      stamper.stampConductance(this.nodes[0], this.nodes[1], geq);
      return stamper.stampCurrentSource(this.nodes[0], this.nodes[1], nc);
    }
  }

  calculateCurrent(voltdiff) {
    if ((voltdiff >= 0) || (this.zvoltage === 0)) {
      return this.leakage * (Math.exp(voltdiff * this.vdcoef) - 1);
    }

    return this.leakage * (Math.exp(voltdiff * this.vdcoef) - Math.exp((-voltdiff - this.zoffset) * this.vdcoef) - 1);
  }
}
Diode.initClass();

module.exports = Diode;
