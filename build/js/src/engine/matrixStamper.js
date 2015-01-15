(function() {
  define(['cs!util/MathUtils', 'cs!engine/RowInfo'], function(MathUtils, RowInfo) {
    var MatrixStamper;
    MatrixStamper = (function() {
      function MatrixStamper(Circuit) {
        this.Circuit = Circuit;
      }


      /*
      control voltage source vs with voltage from n1 to n2 (must also call stampVoltageSource())
       */

      MatrixStamper.prototype.stampVCVS = function(n1, n2, coef, vs) {
        var vn;
        if (isNaN(vs) || isNaN(coef)) {
          console.log("NaN in stampVCVS");
        }
        vn = this.Circuit.numNodes() + vs;
        this.stampMatrix(vn, n1, coef);
        return this.stampMatrix(vn, n2, -coef);
      };

      MatrixStamper.prototype.stampVoltageSource = function(n1, n2, vs, v) {
        var vn;
        vn = this.Circuit.numNodes() + vs;
        console.log("Stamp voltage source " + " " + n1 + " " + n2 + " " + vs + " " + v);
        this.stampMatrix(vn, n1, -1);
        this.stampMatrix(vn, n2, 1);
        this.stampRightSide(vn, v);
        this.stampMatrix(n1, vn, 1);
        return this.stampMatrix(n2, vn, -1);
      };

      MatrixStamper.prototype.updateVoltageSource = function(n1, n2, vs, voltage) {
        var vn;
        vn = this.Circuit.numNodes() + vs;
        return this.stampRightSide(vn, voltage);
      };

      MatrixStamper.prototype.stampResistor = function(n1, n2, r) {
        var a, r0;
        console.log("Stamp resistor: " + n1 + " " + n2 + " " + r);
        r0 = 1 / r;
        if (isNaN(r0) || MathUtils.isInfinite(r0)) {
          this.Circuit.halt("bad resistance");
          a = 0;
          a /= a;
        }
        this.stampMatrix(n1, n1, r0);
        this.stampMatrix(n2, n2, r0);
        this.stampMatrix(n1, n2, -r0);
        return this.stampMatrix(n2, n1, -r0);
      };

      MatrixStamper.prototype.stampConductance = function(n1, n2, r0) {
        if (isNaN(r0) || MathUtils.isInfinite(r0)) {
          this.Circuit.halt("bad conductance");
        }
        this.stampMatrix(n1, n1, r0);
        this.stampMatrix(n2, n2, r0);
        this.stampMatrix(n1, n2, -r0);
        return this.stampMatrix(n2, n1, -r0);
      };


      /*
      current from cn1 to cn2 is equal to voltage from vn1 to 2, divided by g
       */

      MatrixStamper.prototype.stampVCCurrentSource = function(cn1, cn2, vn1, vn2, value) {
        if (isNaN(gain) || MathUtils.isInfinite(gain)) {
          this.Circuit.halt("Invalid gain on voltage controlled current source");
        }
        this.stampMatrix(cn1, vn1, value);
        this.stampMatrix(cn2, vn2, value);
        this.stampMatrix(cn1, vn2, -value);
        return this.stampMatrix(cn2, vn1, -value);
      };

      MatrixStamper.prototype.stampCurrentSource = function(n1, n2, value) {
        this.stampRightSide(n1, -value);
        return this.stampRightSide(n2, value);
      };


      /*
      stamp a current source from n1 to n2 depending on current through vs
       */

      MatrixStamper.prototype.stampCCCS = function(n1, n2, vs, gain) {
        var vn;
        if (isNaN(gain) || MathUtils.isInfinite(gain)) {
          this.Circuit.halt("Invalid gain on current source");
        }
        vn = this.Circuit.numNodes() + vs;
        this.stampMatrix(n1, vn, gain);
        return this.stampMatrix(n2, vn, -gain);
      };


      /*
      stamp value x in row i, column j, meaning that a voltage change
      of dv in node j will increase the current into node i by x dv.
      (Unless i or j is a voltage source node.)
       */

      MatrixStamper.prototype.stampMatrix = function(row, col, value) {
        var rowInfo;
        if (isNaN(value) || MathUtils.isInfinite(value)) {
          this.Circuit.halt("attempted to stamp Matrix with invalid value");
        }
        if (row > 0 && col > 0) {
          if (this.Circuit.Solver.circuitNeedsMap) {
            row = this.Circuit.Solver.circuitRowInfo[row - 1].mapRow;
            rowInfo = this.Circuit.Solver.circuitRowInfo[col - 1];
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
      };


      /*
      Stamp value x on the right side of row i, representing an
      independent current source flowing into node i
       */

      MatrixStamper.prototype.stampRightSide = function(row, value) {
        if (isNaN(value) || value === null) {
          if (row > 0) {
            console.log("rschanges true " + (row - 1));
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
      };


      /*
      Indicate that the values on the left side of row i change in doStep()
       */

      MatrixStamper.prototype.stampNonLinear = function(row) {
        if (isNaN(row) || (row === null)) {
          console.error("null/NaN in stampNonlinear");
        }
        if (row > 0) {
          return this.Circuit.Solver.circuitRowInfo[row - 1].lsChanges = true;
        }
      };

      return MatrixStamper;

    })();
    return MatrixStamper;
  });

}).call(this);
