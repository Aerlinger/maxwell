// <DEFINE>
define([], function() {
// </DEFINE>

  // @deprecated
  class Inductor {
    static initClass() {
      this.FLAG_BACK_EULER = 2;
    }

    constructor() {
      this.nodes = new Array(2);
      this.flags = 0;
      this.inductance = 0;
      this.compResistance = 0;
      this.coilCurrent = 0;
      this.curSourceValue = 0;
    }

    setup(ic, cr, f) {
      this.inductance = ic;
      this.coilCurrent = cr;
      return this.flags = f;
    }

    isTrapezoidal() {
      return (this.flags & Inductor.FLAG_BACK_EULER) === 0;
    }

    // @deprecated
    reset() {
      return this.coilCurrent = 0;
    }

    // @deprecated
    stamp(stamper, n0, n1) {
      // Inductor companion model using trapezoidal or backward euler
      // approximations (Norton equivalent) consists of a current
      // source in parallel with a resistor.  Trapezoidal is more
      // accurate than backward euler but can cause oscillatory behavior.
      // The oscillation is a real problem in circuits with switches.
      this.nodes[0] = n0;
      this.nodes[1] = n1;

      if (this.isTrapezoidal()) {
        this.compResistance = (2 * this.inductance) / this.simParams().timeStep;
      // backward euler
      } else {
        this.compResistance = this.inductance / Circuit.timeStep;
      }

      stamper.stampResistor(this.nodes[0], this.nodes[1], this.compResistance);
      stamper.stampRightSide(this.nodes[0]);
      return stamper.stampRightSide(this.nodes[1]);
    }

    nonLinear() {
      return false;
    }

    startIteration(voltdiff) {
      if (this.isTrapezoidal()) {
        return this.curSourceValue = (voltdiff / this.compResistance) + this.coilCurrent;
      // backward euler
      } else {
        return this.curSourceValue = this.coilCurrent;
      }
    }

    calculateCurrent(voltdiff) {
      // we check compResistance because this might get called
      // before stamp(), which sets compResistance, causing
      // infinite current
      if (this.compResistance > 0) { this.coilCurrent = (voltdiff / this.compResistance) + this.curSourceValue; }
      return this.coilCurrent;
    }

    doStep(stamper, voltdiff) {
      return stamper.stampCurrentSource(this.nodes[0], this.nodes[1], this.curSourceValue);
    }
  }
  return Inductor.initClass();
});
