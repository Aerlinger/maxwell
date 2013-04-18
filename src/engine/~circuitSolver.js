// Generated by CoffeeScript 1.4.0
(function() {

  define(['cs!MatrixStamper', 'cs!GroundElm', 'cs!RailElm', 'cs!VoltageElm', 'cs!WireElm', 'cs!Pathfinder', 'cs!CircuitNode', 'cs!CircuitNodeLink', 'cs!RowInfo', 'cs!Settings', 'cs!ArrayUtils'], function(MatrixStamper, GroundElm, RailElm, VoltageElm, WireElm, Pathfinder, CircuitNode, CircuitNodeLink, RowInfo, Settings, ArrayUtils) {
    var CircuitSolver;
    CircuitSolver = (function() {

      function CircuitSolver(Circuit) {
        this.Circuit = Circuit;
        this.scaleFactors = ArrayUtils.zeroArray(400);
        this.reset();
        this.Stamper = new MatrixStamper(this.Circuit);
      }

      CircuitSolver.prototype.reset = function() {
        this.time = 0;
        this.converged = true;
        this.subIterations = 5000;
        this.circuitMatrix = [];
        this.circuitRightSide = [];
        this.origMatrix = [];
        this.origRightSide = [];
        this.circuitRowInfo = [];
        this.circuitPermute = [];
        this.circuitNonLinear = false;
        this.lastFrameTime = 0;
        this.lastIterTime = 0;
        this.frames = 0;
        this.lastTime = 0;
        return this.invalidate();
      };

      CircuitSolver.prototype.invalidate = function() {
        return this.analyzeFlag = true;
      };

      CircuitSolver.prototype.needsRemap = function() {
        return this.analyzeFlag;
      };

      CircuitSolver.prototype.stop = function(message) {
        if (message == null) {
          message = "Simulator Stopped";
        }
        Logger.log(message);
        return this.isStopped = true;
      };

      CircuitSolver.prototype.run = function() {
        return this.isStopped = false;
      };

      CircuitSolver.prototype.getSimSpeed = function() {
        if (Settings.SPEED === 0) {
          return 0;
        }
        return 0.1 * Math.exp((Settings.SPEED - 61) / 24);
      };

      CircuitSolver.prototype.reconstruct = function() {
        var ce, changed, circuitElement, circuitElm, circuitNode, circuitNodeLink, circuitRowInfo, closure, elt, gotGround, gotRail, i, ii, internalNodeCount, internalVSCount, iter, j, k, kn, matrix_ij, newMatDim, newMatx, newRS, newSize, node, pathfinder, postCount, postPt, qm, qp, qq, qv, re, rowInfo, rowNodeEq, rsadd, terminalPt, volt, voltageSourceCount, _aa, _i, _j, _k, _l, _len, _len1, _len2, _len3, _m, _n, _o, _p, _q, _r, _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _results, _s, _t, _u, _v, _w, _x, _y, _z;
        if (!this.analyzeFlag || this.Circuit.numElements() === 0) {
          return;
        }
        this.Circuit.getCircuitBottom();
        this.Circuit.clearErrors();
        this.Circuit.resetNodes();
        voltageSourceCount = 0;
        gotGround = false;
        gotRail = false;
        volt = null;
        _ref = this.Circuit.getElements();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          circuitElm = _ref[_i];
          if (circuitElm.toString() === 'GroundElm') {
            this.gotGround = true;
            break;
          }
          if (circuitElm.toString === 'RailElm') {
            gotRail = true;
          }
          if (!(volt != null) && circuitElm.toString() === 'VoltageElm') {
            volt = circuitElm;
          }
        }
        circuitNode = new CircuitNode();
        if (!gotGround && (volt != null) && !gotRail) {
          terminalPt = volt.getPost(0);
          circuitNode.x = terminalPt.x;
          circuitNode.y = terminalPt.y;
        } else {
          circuitNode.x = circuitNode.y = -1;
        }
        this.Circuit.addCircuitNode(circuitNode);
        for (i = _j = 0, _ref1 = this.Circuit.numElements(); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
          circuitElm = this.Circuit.getElmByIdx(i);
          internalNodeCount = circuitElm.getInternalNodeCount();
          internalVSCount = circuitElm.getVoltageSourceCount();
          postCount = circuitElm.getPostCount();
          for (j = _k = 0; 0 <= postCount ? _k < postCount : _k > postCount; j = 0 <= postCount ? ++_k : --_k) {
            postPt = circuitElm.getPost(j);
            k = 0;
            _ref2 = this.Circuit.getNodes();
            for (_l = 0, _len1 = _ref2.length; _l < _len1; _l++) {
              node = _ref2[_l];
              if (postPt.x === node.x && postPt.y === node.y) {
                break;
              }
              k++;
            }
            if (k === this.Circuit.numNodes()) {
              circuitNode = new CircuitNode();
              circuitNode.x = postPt.x;
              circuitNode.y = postPt.y;
              circuitNodeLink = new CircuitNodeLink();
              circuitNodeLink.num = j;
              circuitNodeLink.elm = circuitElm;
              circuitNode.links.push(circuitNodeLink);
              circuitElm.setNode(j, this.Circuit.numNodes());
              this.Circuit.addCircuitNode(circuitNode);
            } else {
              circuitNodeLink = new CircuitNodeLink();
              circuitNodeLink.num = j;
              circuitNodeLink.elm = circuitElm;
              this.Circuit.getNode(k).links.push(circuitNodeLink);
              circuitElm.setNode(j, k);
              if (k === 0) {
                circuitElm.setNodeVoltage(j, 0);
              }
            }
          }
          for (j = _m = 0; 0 <= internalNodeCount ? _m < internalNodeCount : _m > internalNodeCount; j = 0 <= internalNodeCount ? ++_m : --_m) {
            circuitNode = new CircuitNode();
            circuitNode.x = -1;
            circuitNode.y = -1;
            circuitNode.intern = true;
            circuitNodeLink = new CircuitNodeLink();
            circuitNodeLink.num = j + postCount;
            circuitNodeLink.elm = circuitElm;
            circuitNode.links.push(circuitNodeLink);
            circuitElm.setNode(circuitNodeLink.num, this.Circuit.numNodes());
            this.Circuit.addCircuitNode(circuitNode);
          }
          voltageSourceCount += internalVSCount;
        }
        this.Circuit.voltageSources = new Array(voltageSourceCount);
        voltageSourceCount = 0;
        this.circuitNonLinear = false;
        _ref3 = this.Circuit.getElements();
        for (_n = 0, _len2 = _ref3.length; _n < _len2; _n++) {
          circuitElement = _ref3[_n];
          if (circuitElement.nonLinear()) {
            this.circuitNonLinear = true;
          }
          internalVSCount = circuitElement.getVoltageSourceCount();
          for (j = _o = 0; 0 <= internalVSCount ? _o < internalVSCount : _o > internalVSCount; j = 0 <= internalVSCount ? ++_o : --_o) {
            this.Circuit.voltageSources[voltageSourceCount] = circuitElement;
            circuitElement.setVoltageSource(j, voltageSourceCount++);
          }
        }
        this.Circuit.voltageSourceCount = voltageSourceCount;
        this.matrixSize = this.Circuit.numNodes() - 1 + voltageSourceCount;
        this.circuitMatrixSize = this.circuitMatrixFullSize = this.matrixSize;
        this.circuitMatrix = ArrayUtils.zeroArray2(this.matrixSize, this.matrixSize);
        this.origMatrix = ArrayUtils.zeroArray2(this.matrixSize, this.matrixSize);
        this.circuitRightSide = ArrayUtils.zeroArray(this.matrixSize);
        this.origRightSide = ArrayUtils.zeroArray(this.matrixSize);
        this.circuitRowInfo = ArrayUtils.zeroArray(this.matrixSize);
        this.circuitPermute = ArrayUtils.zeroArray(this.matrixSize);
        for (i = _p = 0, _ref4 = this.matrixSize; 0 <= _ref4 ? _p < _ref4 : _p > _ref4; i = 0 <= _ref4 ? ++_p : --_p) {
          this.circuitRowInfo[i] = new RowInfo();
        }
        this.circuitNeedsMap = false;
        _ref5 = this.Circuit.getElements();
        for (_q = 0, _len3 = _ref5.length; _q < _len3; _q++) {
          circuitElm = _ref5[_q];
          circuitElm.stamp(this.Stamper);
        }
        closure = new Array(this.Circuit.numNodes());
        closure[0] = true;
        while (changed) {
          changed = false;
          i = 0;
          while (i !== this.Circuit.numElements()) {
            circuitElm = this.Circuit.getElm(i);
            j = 0;
            while (j < circuitElm.getPostCount()) {
              if (!closure[circuitElm.getNode(j)]) {
                if (circuitElm.hasGroundConnection(j)) {
                  changed = true;
                  closure[circuitElm.getNode(j)] = true;
                }
                continue;
              }
              k = 0;
              while (k !== circuitElm.getPostCount()) {
                if (j === k) {
                  continue;
                }
                kn = circuitElm.getNode(k);
                if (circuitElm.getConnection(j, k) && !closure[kn]) {
                  closure[kn] = true;
                  changed = true;
                }
                ++k;
              }
              ++j;
            }
            ++i;
          }
          if (changed) {
            continue;
          }
          for (i = _r = 0, _ref6 = this.Circuit.numNodes(); 0 <= _ref6 ? _r < _ref6 : _r > _ref6; i = 0 <= _ref6 ? ++_r : --_r) {
            if (!closure[i] && !this.Circuit.getCircuitNode(i).intern) {
              this.Stamper.stampResistor(0, i, 1e8);
              closure[i] = true;
              changed = true;
              break;
            }
          }
        }
        for (i = _s = 0, _ref7 = this.Circuit.numElements(); 0 <= _ref7 ? _s < _ref7 : _s > _ref7; i = 0 <= _ref7 ? ++_s : --_s) {
          ce = this.Circuit.getElmByIdx(i);
          if ((ce instanceof VoltageElm && ce.getPostCount() === 2) || ce instanceof WireElm) {
            pathfinder = new Pathfinder(Pathfinder.VOLTAGE, ce, ce.getNode(1), this.Circuit.getElements(), this.Circuit.numNodes());
          }
        }
        iter = 0;
        while (iter < this.matrixSize) {
          qm = -1;
          qp = -1;
          qv = 0;
          re = this.circuitRowInfo[iter];
          if (re.lsChanges || re.dropRow || re.rsChanges) {
            iter++;
            continue;
          }
          rsadd = 0;
          for (j = _t = 0, _ref8 = this.matrixSize; 0 <= _ref8 ? _t < _ref8 : _t > _ref8; j = 0 <= _ref8 ? ++_t : --_t) {
            matrix_ij = this.circuitMatrix[iter][j];
            if (this.circuitRowInfo[j].type === RowInfo.ROW_CONST) {
              rsadd -= this.circuitRowInfo[j].value * matrix_ij;
              continue;
            }
            if (matrix_ij === 0) {
              continue;
            }
            if (qp === -1) {
              qp = j;
              qv = matrix_ij;
              continue;
            }
            if (qm === -1 && (matrix_ij === -qv)) {
              qm = j;
              continue;
            }
            break;
          }
          if (j === this.matrixSize) {
            if (qp === -1) {
              this.circuitRowInfo[j].type;
              this.Circuit.halt("Matrix error qp", null);
              return;
            }
            elt = this.circuitRowInfo[qp];
            if (qm === -1) {
              k = 0;
              while (elt.type === RowInfo.ROW_EQUAL && k < 100) {
                qp = elt.nodeEq;
                elt = this.circuitRowInfo[qp];
                ++k;
              }
              if (elt.type === RowInfo.ROW_EQUAL) {
                elt.type = RowInfo.ROW_NORMAL;
                iter++;
                continue;
              }
              if (elt.type !== RowInfo.ROW_NORMAL) {
                iter++;
                continue;
              }
              elt.type = RowInfo.ROW_CONST;
              elt.value = (this.circuitRightSide[iter] + rsadd) / qv;
              this.circuitRowInfo[iter].dropRow = true;
              iter = -1;
            } else if ((this.circuitRightSide[iter] + rsadd) === 0) {
              if (elt.type !== RowInfo.ROW_NORMAL) {
                qq = qm;
                qm = qp;
                qp = qq;
                elt = this.circuitRowInfo[qp];
                if (elt.type !== RowInfo.ROW_NORMAL) {
                  iter++;
                  continue;
                }
              }
              elt.type = RowInfo.ROW_EQUAL;
              elt.nodeEq = qm;
              this.circuitRowInfo[iter].dropRow = true;
            }
          }
          iter++;
        }
        newMatDim = 0;
        for (i = _u = 0, _ref9 = this.matrixSize; 0 <= _ref9 ? _u < _ref9 : _u > _ref9; i = 0 <= _ref9 ? ++_u : --_u) {
          rowInfo = this.circuitRowInfo[i];
          if (rowInfo.type === RowInfo.ROW_NORMAL) {
            rowInfo.mapCol = newMatDim++;
            continue;
          }
          if (rowInfo.type === RowInfo.ROW_EQUAL) {
            while (j !== (function() {
                _results = [];
                for (_v = 0; _v < 100; _v++){ _results.push(_v); }
                return _results;
              }).apply(this)) {
              rowNodeEq = this.circuitRowInfo[rowInfo.nodeEq];
              if (rowNodeEq.type !== RowInfo.ROW_EQUAL) {
                break;
              }
              if (i === rowNodeEq.nodeEq) {
                break;
              }
              rowInfo.nodeEq = rowNodeEq.nodeEq;
            }
          }
          if (rowInfo.type === RowInfo.ROW_CONST) {
            rowInfo.mapCol = -1;
          }
        }
        for (i = _w = 0, _ref10 = this.matrixSize; 0 <= _ref10 ? _w < _ref10 : _w > _ref10; i = 0 <= _ref10 ? ++_w : --_w) {
          rowInfo = this.circuitRowInfo[i];
          if (rowInfo.type === RowInfo.ROW_EQUAL) {
            rowNodeEq = this.circuitRowInfo[rowInfo.nodeEq];
            if (rowNodeEq.type === RowInfo.ROW_CONST) {
              rowInfo.type = rowNodeEq.type;
              rowInfo.value = rowNodeEq.value;
              rowInfo.mapCol = -1;
            } else {
              rowInfo.mapCol = rowNodeEq.mapCol;
            }
          }
        }
        newSize = newMatDim;
        newMatx = ArrayUtils.zeroArray2(newSize, newSize);
        newRS = new Array(newSize);
        ArrayUtils.zeroArray(newRS);
        ii = 0;
        i = 0;
        while (i !== this.matrixSize) {
          circuitRowInfo = this.circuitRowInfo[i];
          if (circuitRowInfo.dropRow) {
            circuitRowInfo.mapRow = -1;
            i++;
            continue;
          }
          newRS[ii] = this.circuitRightSide[i];
          circuitRowInfo.mapRow = ii;
          for (j = _x = 0, _ref11 = this.matrixSize; 0 <= _ref11 ? _x < _ref11 : _x > _ref11; j = 0 <= _ref11 ? ++_x : --_x) {
            rowInfo = this.circuitRowInfo[j];
            if (rowInfo.type === RowInfo.ROW_CONST) {
              newRS[ii] -= rowInfo.value * this.circuitMatrix[i][j];
            } else {
              newMatx[ii][rowInfo.mapCol] += this.circuitMatrix[i][j];
            }
          }
          ii++;
          i++;
        }
        this.circuitMatrix = newMatx;
        this.circuitRightSide = newRS;
        this.matrixSize = this.circuitMatrixSize = newSize;
        for (i = _y = 0, _ref12 = this.matrixSize; 0 <= _ref12 ? _y < _ref12 : _y > _ref12; i = 0 <= _ref12 ? ++_y : --_y) {
          this.origRightSide[i] = this.circuitRightSide[i];
        }
        for (i = _z = 0, _ref13 = this.matrixSize; 0 <= _ref13 ? _z < _ref13 : _z > _ref13; i = 0 <= _ref13 ? ++_z : --_z) {
          for (j = _aa = 0, _ref14 = this.matrixSize; 0 <= _ref14 ? _aa < _ref14 : _aa > _ref14; j = 0 <= _ref14 ? ++_aa : --_aa) {
            this.origMatrix[i][j] = this.circuitMatrix[i][j];
          }
        }
        this.circuitNeedsMap = true;
        this.analyzeFlag = false;
        if (!this.circuitNonLinear) {
          if (!this.luFactor(this.circuitMatrix, this.circuitMatrixSize, this.circuitPermute)) {
            this.Circuit.halt("Singular matrix!", null);
          }
        }
      };

      CircuitSolver.prototype.solveCircuit = function() {
        var circuitElm, circuitNode, cn1, debugPrint, i, iter, j, ji, lastIterTime, printit, res, rowInfo, stepRate, subiter, subiterCount, timeEnd, _i, _j, _k, _l, _len, _len1, _len2, _m, _n, _o, _p, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
        if (!(this.circuitMatrix != null) || this.Circuit.numElements() === 0) {
          this.circuitMatrix = null;
          return;
        }
        debugPrint = this.dumpMatrix;
        this.dumpMatrix = false;
        stepRate = Math.floor(160 * this.getSimSpeed());
        timeEnd = (new Date()).getTime();
        lastIterTime = this.lastIterTime;
        if (1000 >= stepRate * (timeEnd - this.lastIterTime)) {
          return;
        }
        iter = 1;
        while (true) {
          _ref = this.Circuit.getElements();
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            circuitElm = _ref[_i];
            circuitElm.startIteration();
          }
          ++this.steps;
          subiterCount = 500;
          for (subiter = _j = 0; 0 <= subiterCount ? _j < subiterCount : _j > subiterCount; subiter = 0 <= subiterCount ? ++_j : --_j) {
            this.converged = true;
            this.subIterations = subiter;
            for (i = _k = 0, _ref1 = this.circuitMatrixSize; 0 <= _ref1 ? _k < _ref1 : _k > _ref1; i = 0 <= _ref1 ? ++_k : --_k) {
              this.circuitRightSide[i] = this.origRightSide[i];
            }
            if (this.circuitNonLinear) {
              for (i = _l = 0, _ref2 = this.circuitMatrixSize; 0 <= _ref2 ? _l < _ref2 : _l > _ref2; i = 0 <= _ref2 ? ++_l : --_l) {
                for (j = _m = 0, _ref3 = this.circuitMatrixSize; 0 <= _ref3 ? _m < _ref3 : _m > _ref3; j = 0 <= _ref3 ? ++_m : --_m) {
                  this.circuitMatrix[i][j] = this.origMatrix[i][j];
                }
              }
            }
            _ref4 = this.Circuit.getElements();
            for (_n = 0, _len1 = _ref4.length; _n < _len1; _n++) {
              circuitElm = _ref4[_n];
              circuitElm.doStep();
            }
            if (this.stopMessage != null) {
              return;
            }
            printit = debugPrint;
            debugPrint = false;
            if (this.circuitNonLinear) {
              if (this.converged && subiter > 0) {
                break;
              }
              if (!this.luFactor(this.circuitMatrix, this.circuitMatrixSize, this.circuitPermute)) {
                this.Circuit.halt("Singular matrix!", null);
                return;
              }
            }
            this.luSolve(this.circuitMatrix, this.circuitMatrixSize, this.circuitPermute, this.circuitRightSide);
            for (j = _o = 0, _ref5 = this.circuitMatrixFullSize; 0 <= _ref5 ? _o < _ref5 : _o > _ref5; j = 0 <= _ref5 ? ++_o : --_o) {
              rowInfo = this.circuitRowInfo[j];
              res = 0;
              if (rowInfo.type === RowInfo.ROW_CONST) {
                res = rowInfo.value;
              } else {
                res = this.circuitRightSide[rowInfo.mapCol];
              }
              if (isNaN(res)) {
                this.converged = false;
                break;
              }
              if (j < (this.Circuit.numNodes() - 1)) {
                circuitNode = this.Circuit.getNode(j + 1);
                _ref6 = circuitNode.links;
                for (_p = 0, _len2 = _ref6.length; _p < _len2; _p++) {
                  cn1 = _ref6[_p];
                  cn1.elm.setNodeVoltage(cn1.num, res);
                }
              } else {
                ji = j - (this.Circuit.numNodes() - 1);
                this.Circuit.voltageSources[ji].setCurrent(ji, res);
              }
            }
            if (!this.circuitNonLinear) {
              break;
            }
            subiter++;
          }
          if (subiter >= subiterCount) {
            this.halt("Convergence failed: " + subiter, null);
            break;
          }
          this.time += this.timeStep;
          i = 0;
          while (i < this.Circuit.scopeCount) {
            this.Circuit.scopes[i].timeStep();
            ++i;
          }
          timeEnd = (new Date()).getTime();
          lastIterTime = timeEnd;
          if (iter * 1000 >= stepRate * (timeEnd - this.lastIterTime)) {
            break;
          } else {
            if (timeEnd - this.lastFrameTime > 500) {
              break;
            }
          }
          ++iter;
        }
        return this.lastIterTime = lastIterTime;
      };

      /*
          luFactor: finds a solution to a factored matrix through LU (Lower-Upper) factorization
      
          Called once each frame for resistive circuits, otherwise called many times each frame
      
          @param circuitMatrix 2D matrix to be solved
          @param matrixSize number or rows/columns in the matrix
          @param pivotArray pivot index
      
          References:
      */


      CircuitSolver.prototype.luFactor = function(circuitMatrix, matrixSize, pivotArray) {
        var i, j, k, largest, largestRow, matrix_ij, mult, x;
        i = 0;
        while (i < matrixSize) {
          largest = 0;
          j = 0;
          while (j < matrixSize) {
            x = Math.abs(circuitMatrix[i][j]);
            if (x > largest) {
              largest = x;
            }
            ++j;
          }
          if (largest === 0) {
            return false;
          }
          this.scaleFactors[i] = 1.0 / largest;
          ++i;
        }
        j = 0;
        while (j < matrixSize) {
          i = 0;
          while (i < j) {
            matrix_ij = circuitMatrix[i][j];
            k = 0;
            while (k !== i) {
              matrix_ij -= circuitMatrix[i][k] * circuitMatrix[k][j];
              ++k;
            }
            circuitMatrix[i][j] = matrix_ij;
            ++i;
          }
          largest = 0;
          largestRow = -1;
          i = j;
          while (i < matrixSize) {
            matrix_ij = circuitMatrix[i][j];
            k = 0;
            while (k < j) {
              matrix_ij -= circuitMatrix[i][k] * circuitMatrix[k][j];
              ++k;
            }
            circuitMatrix[i][j] = matrix_ij;
            x = Math.abs(matrix_ij);
            if (x >= largest) {
              largest = x;
              largestRow = i;
            }
            ++i;
          }
          if (j !== largestRow) {
            k = 0;
            while (k < matrixSize) {
              x = circuitMatrix[largestRow][k];
              circuitMatrix[largestRow][k] = circuitMatrix[j][k];
              circuitMatrix[j][k] = x;
              ++k;
            }
            this.scaleFactors[largestRow] = this.scaleFactors[j];
          }
          pivotArray[j] = largestRow;
          if (circuitMatrix[j][j] === 0) {
            circuitMatrix[j][j] = 1e-18;
          }
          if (j !== matrixSize - 1) {
            mult = 1 / circuitMatrix[j][j];
            i = j + 1;
            while (i !== matrixSize) {
              circuitMatrix[i][j] *= mult;
              ++i;
            }
          }
          ++j;
        }
        return true;
      };

      /*
          Step 2: lu_solve: Called by lu_factor
      
          finds a solution to a factored matrix through LU (Lower-Upper) factorization
      
          Called once each frame for resistive circuits, otherwise called many times each frame
      
          @param circuitMatrix matrix to be solved
          @param numRows dimension
          @param pivotVector pivot index
          @param circuitRightSide Right-side (dependent) matrix
      
          References:
      */


      CircuitSolver.prototype.luSolve = function(circuitMatrix, numRows, pivotVector, circuitRightSide) {
        var bi, i, j, row, swap, tot, total, _results;
        i = 0;
        while (i < numRows) {
          row = pivotVector[i];
          swap = circuitRightSide[row];
          circuitRightSide[row] = circuitRightSide[i];
          circuitRightSide[i] = swap;
          if (swap !== 0) {
            break;
          }
          ++i;
        }
        bi = i++;
        while (i < numRows) {
          row = pivotVector[i];
          tot = circuitRightSide[row];
          circuitRightSide[row] = circuitRightSide[i];
          j = bi;
          while (j < i) {
            tot -= circuitMatrix[i][j] * circuitRightSide[j];
            ++j;
          }
          circuitRightSide[i] = tot;
          ++i;
        }
        i = numRows - 1;
        _results = [];
        while (i >= 0) {
          total = circuitRightSide[i];
          j = i + 1;
          while (j !== numRows) {
            total -= circuitMatrix[i][j] * circuitRightSide[j];
            ++j;
          }
          circuitRightSide[i] = total / circuitMatrix[i][i];
          _results.push(i--);
        }
        return _results;
      };

      CircuitSolver.prototype.updateVoltageSource = function(n1, n2, vs, voltage) {
        var vn;
        vn = this.Circuit.numNodes() + vs;
        return this.Stamper.stampRightSide(vn, voltage);
      };

      return CircuitSolver;

    })();
    return CircuitSolver;
  });

}).call(this);
