let RowInfo = require('./rowInfo.js');
let Util = require('../util/util.js');

class MatrixStamper {

  constructor(Circuit) {
    this.Circuit = Circuit;
  }

  /**
  control voltage source vs with voltage from n1 to n2 (must also call stampVoltageSource())
  */
  stampVCVS(n1, n2, coef, vs) {
    if (isNaN(vs) || isNaN(coef)) {
      console.warn("NaN in stampVCVS");
    }

    let vn = this.Circuit.numNodes() + vs;

    this.stampMatrix(vn, n1, coef);
    return this.stampMatrix(vn, n2, -coef);
  }


  // stamp independent voltage source #vs, from n1 to n2, amount v
  stampVoltageSource(n1, n2, vs, v) {
    if (v == null) { v = null; }
    let vn = this.Circuit.numNodes() + vs;

    this.stampMatrix(vn, n1, -1);
    this.stampMatrix(vn, n2, 1);
    this.stampRightSide(vn, v);
    this.stampMatrix(n1, vn, 1);
    return this.stampMatrix(n2, vn, -1);
  }


  updateVoltageSource(n1, n2, vs, voltage) {
    if (isNaN(voltage) || Util.isInfinite(voltage)) {
      this.Circuit.halt(`updateVoltageSource: bad voltage ${voltage} at ${n1} ${n2} ${vs}`);
    }

    let vn = this.Circuit.numNodes() + vs;
    return this.stampRightSide(vn, voltage);
  }


  stampResistor(n1, n2, r) {
    return this.stampConductance(n1, n2, 1 / r);
  }


  stampConductance(n1, n2, g) {
    if (isNaN(g) || Util.isInfinite(g)) {
      this.Circuit.halt(`bad conductance at ${n1} ${n2}`);
    }

    this.stampMatrix(n1, n1, g);
    this.stampMatrix(n2, n2, g);
    this.stampMatrix(n1, n2, -g);
    return this.stampMatrix(n2, n1, -g);
  }


  /**
  current from cn1 to cn2 is equal to voltage from vn1 to 2, divided by g
  */
  stampVCCurrentSource(cn1, cn2, vn1, vn2, value) {
    if (isNaN(value) || Util.isInfinite(value)) {
      this.Circuit.halt(`Invalid gain ${value} on voltage controlled current source`);
    }

    this.stampMatrix(cn1, vn1, value);
    this.stampMatrix(cn2, vn2, value);
    this.stampMatrix(cn1, vn2, -value);

    return this.stampMatrix(cn2, vn1, -value);
  }


  stampCurrentSource(n1, n2, value) {
    this.stampRightSide(n1, -value);
    return this.stampRightSide(n2, value);
  }


  /**
  stamp a current source from n1 to n2 depending on current through vs
  */
  stampCCCS(n1, n2, vs, gain) {
    if (isNaN(gain) || Util.isInfinite(gain)) {
      this.Circuit.halt(`Invalid gain on current source: (was ${gain})`);
    }

    let vn = this.Circuit.numNodes() + vs;
    this.stampMatrix(n1, vn, gain);
    return this.stampMatrix(n2, vn, -gain);
  }


  /**
  stamp value x in row i, column j, meaning that a voltage change
  of dv in node j will increase the current into node i by x dv.
  (Unless i or j is a voltage source node.)
  */
  stampMatrix(row, col, value) {
    if (isNaN(value) || Util.isInfinite(value) || value == null || value == undefined) {
      this.Circuit.halt(`attempted to stamp Matrix with invalid value (${value}) at ${row} ${col}`);
    }

    if ((row > 0) && (col > 0)) {
      if (this.Circuit.Solver.circuitNeedsMap) {
        row = this.Circuit.Solver.circuitRowInfo[row - 1].mapRow;
        let rowInfo = this.Circuit.Solver.circuitRowInfo[col - 1];
        if (rowInfo.type === RowInfo.ROW_CONST) {
          this.Circuit.Solver.circuitRightSide[row] -= value * rowInfo.value;
          return;
        }
        col = rowInfo.mapCol;
      } else {
        row--;
        col--;
      }

      return this.Circuit.Solver.circuitMatrix[row][col] += value;
    }
  }


  /**
  Stamp value x on the right side of row i, representing an
  independent current source flowing into node i
  */
  stampRightSide(row, value) {
    if (isNaN(value) || (value === null)) {
      if (row > 0) {
        return this.Circuit.Solver.circuitRowInfo[row - 1].rsChanges = true;
      }
    } else {
      if (row > 0) {
        if (this.Circuit.Solver.circuitNeedsMap) {
          row = this.Circuit.Solver.circuitRowInfo[row - 1].mapRow;
        } else {
          row--;
        }

        return this.Circuit.Solver.circuitRightSide[row] += value;
      }
    }
  }


  /**
  Indicate that the values on the left side of row i change in doStep()
  */
  stampNonLinear(row) {
    if (isNaN(row) || (row === null)) {
      console.error("null/NaN in stampNonlinear");
    }
    if (row > 0) { return this.Circuit.Solver.circuitRowInfo[row - 1].lsChanges = true; }
  }
}


module.exports = MatrixStamper;
