(function() {
  define(['cs!engine/MatrixStamper', 'cs!component/components/GroundElm', 'cs!component/components/RailElm', 'cs!component/components/VoltageElm', 'cs!component/components/WireElm', 'cs!engine/graphTraversal/Pathfinder', 'cs!engine/graphTraversal/CircuitNode', 'cs!engine/graphTraversal/CircuitNodeLink', 'cs!engine/RowInfo', 'cs!settings/Settings', 'cs!util/ArrayUtils', 'cs!component/components/CapacitorElm', 'cs!component/components/InductorElm', 'cs!component/components/CurrentElm'], function(MatrixStamper, GroundElm, RailElm, VoltageElm, WireElm, Pathfinder, CircuitNode, CircuitNodeLink, RowInfo, Settings, ArrayUtils, CapacitorElm, InductorElm, CurrentElm) {
    var CircuitSolver;
    CircuitSolver = (function() {
      function CircuitSolver(Circuit) {
        this.Circuit = Circuit;
        this.scaleFactors = ArrayUtils.zeroArray(400);
        this.reset();
        this.Stamper = new MatrixStamper(this.Circuit);
      }

      CircuitSolver.prototype.reset = function() {
        this.Circuit.time = 0;
        this.Circuit.frames = 0;
        this.converged = true;
        this.subIterations = 5000;
        this.circuitMatrix = [];
        this.circuitRightSide = [];
        this.origMatrix = [];
        this.origRightSide = [];
        this.circuitRowInfo = [];
        this.circuitPermute = [];
        this.circuitNonLinear = false;
        this.lastTime = 0;
        this.secTime = 0;
        this.lastFrameTime = 0;
        this.lastIterTime = 0;
        return this.analyzeFlag = true;
      };

      CircuitSolver.prototype._updateTimings = function(lastIterationTime) {
        var currentSpeed, inc, sysTime;
        this.lastIterTime = lastIterationTime;
        sysTime = (new Date()).getTime();
        if (this.lastTime !== 0) {
          inc = Math.floor(sysTime - this.lastTime);
          currentSpeed = Math.exp(this.Circuit.currentSpeed() / 3.5 - 14.2);
          this.Circuit.Params.setCurrentMult(1.7 * inc * currentSpeed);
        }
        if ((sysTime - this.secTime) >= 1000) {
          console.log("Reset!");
          this.frames = 0;
          this.steps = 0;
          this.secTime = sysTime;
        }
        this.lastTime = sysTime;
        return this.lastFrameTime = this.lastTime;
      };

      CircuitSolver.prototype.getStamper = function() {
        return this.Stamper;
      };

      CircuitSolver.prototype.getIterCount = function() {
        var sim_speed;
        sim_speed = 150;
        return 0.1 * Math.exp((sim_speed - 61.0) / 24.0);
      };

      CircuitSolver.prototype.reconstruct = function() {
        var ce, changed, circuitElement, circuitElm, circuitNodeLink, circuitRowInfo, closure, cn, cnl, elt, fpi, gotGround, gotRail, i, ii, internalNodeCount, internalVSCount, j, k, kn, newMatDim, newMatx, newRS, newSize, pathfinder, postCount, postPt, pt, q, qm, qp, qq, qv, re, rowInfo, rowNodeEq, rsadd, tempclosure, volt, voltageSourceCount, vs, _aa, _ab, _ac, _ad, _ae, _i, _j, _k, _l, _len, _len1, _len2, _m, _n, _o, _p, _q, _r, _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _results, _s, _t, _u, _v, _w, _x, _y, _z;
        if (!this.analyzeFlag || (this.Circuit.numElements() === 0)) {
          return;
        }
        this.Circuit.clearErrors();
        this.Circuit.resetNodes();
        voltageSourceCount = 0;
        gotGround = false;
        gotRail = false;
        volt = null;
        _ref = this.Circuit.getElements();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          ce = _ref[_i];
          if (ce instanceof GroundElm) {
            console.log("Found ground");
            gotGround = true;
            break;
          }
          if (ce instanceof RailElm) {
            console.log("Got rail");
            gotRail = true;
          }
          if ((volt == null) && ce instanceof VoltageElm) {
            console.log("Ve");
            volt = ce;
          }
        }
        if (!gotGround && (volt != null) && !gotRail) {
          cn = new CircuitNode();
          pt = volt.getPost(0);
          console.log("GOT GROUND cn=" + cn + ", pt=" + pt);
          cn.x = pt.x;
          cn.y = pt.y;
          this.Circuit.addCircuitNode(cn);
        } else {
          cn = new CircuitNode();
          cn.x = cn.y = -1;
          this.Circuit.addCircuitNode(cn);
        }
        for (i = _j = 0, _ref1 = this.Circuit.numElements(); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
          circuitElm = this.Circuit.getElmByIdx(i);
          internalNodeCount = circuitElm.getInternalNodeCount();
          internalVSCount = circuitElm.getVoltageSourceCount();
          postCount = circuitElm.getPostCount();
          for (j = _k = 0; 0 <= postCount ? _k < postCount : _k > postCount; j = 0 <= postCount ? ++_k : --_k) {
            postPt = circuitElm.getPost(j);
            console.log("D: " + circuitElm.dump());
            k = 0;
            while (k < this.Circuit.numNodes()) {
              cn = this.Circuit.getNode(k);
              console.log("j=" + j + "  k=" + k + "  pt=" + postPt + "  " + cn);
              if (postPt.x === cn.x && postPt.y === cn.y) {
                console.log("" + i + " Break!");
                break;
              }
              k++;
            }
            console.log(("NUM NODES: " + i + " ") + this.Circuit.numNodes());
            if (k === this.Circuit.numNodes()) {
              cn = new CircuitNode();
              cn.x = postPt.x;
              cn.y = postPt.y;
              circuitNodeLink = new CircuitNodeLink();
              circuitNodeLink.num = j;
              circuitNodeLink.elm = circuitElm;
              cn.links.push(circuitNodeLink);
              circuitElm.setNode(j, this.Circuit.numNodes());
              this.Circuit.addCircuitNode(cn);
            } else {
              cnl = new CircuitNodeLink();
              cnl.num = j;
              cnl.elm = circuitElm;
              this.Circuit.getNode(k).links.push(cnl);
              circuitElm.setNode(j, k);
              if (k === 0) {
                circuitElm.setNodeVoltage(j, 0);
              }
            }
          }
          for (j = _l = 0; 0 <= internalNodeCount ? _l < internalNodeCount : _l > internalNodeCount; j = 0 <= internalNodeCount ? ++_l : --_l) {
            cn = new CircuitNode(null, null, true);
            cnl = new CircuitNodeLink();
            cnl.num = j + postCount;
            cnl.elm = circuitElm;
            cn.links.push(cnl);
            circuitElm.setNode(cnl.num, this.Circuit.numNodes());
            this.Circuit.addCircuitNode(cn);
          }
          voltageSourceCount += internalVSCount;
        }
        this.Circuit.voltageSources = new Array(voltageSourceCount);
        voltageSourceCount = 0;
        this.circuitNonLinear = false;
        _ref2 = this.Circuit.getElements();
        for (_m = 0, _len1 = _ref2.length; _m < _len1; _m++) {
          circuitElement = _ref2[_m];
          if (circuitElement.nonLinear()) {
            this.circuitNonLinear = true;
          }
          internalVSCount = circuitElement.getVoltageSourceCount();
          for (j = _n = 0; 0 <= internalVSCount ? _n < internalVSCount : _n > internalVSCount; j = 0 <= internalVSCount ? ++_n : --_n) {
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
        vs = 0;
        for (i = _o = 0, _ref3 = this.matrixSize; 0 <= _ref3 ? _o < _ref3 : _o > _ref3; i = 0 <= _ref3 ? ++_o : --_o) {
          this.circuitRowInfo[i] = new RowInfo();
        }
        this.circuitNeedsMap = false;
        _ref4 = this.Circuit.getElements();
        for (_p = 0, _len2 = _ref4.length; _p < _len2; _p++) {
          circuitElm = _ref4[_p];
          circuitElm.stamp(this.Stamper);
        }
        closure = new Array(this.Circuit.numNodes());
        tempclosure = new Array(this.Circuit.numNodes());
        closure[0] = true;
        changed = true;
        while (changed) {
          changed = false;
          for (i = _q = 0, _ref5 = this.Circuit.numElements(); 0 <= _ref5 ? _q < _ref5 : _q > _ref5; i = 0 <= _ref5 ? ++_q : --_q) {
            circuitElm = this.Circuit.getElmByIdx(i);
            for (j = _r = 0, _ref6 = circuitElm.getPostCount(); 0 <= _ref6 ? _r < _ref6 : _r > _ref6; j = 0 <= _ref6 ? ++_r : --_r) {
              if (!closure[circuitElm.getNode(j)]) {
                if (circuitElm.hasGroundConnection(j)) {
                  changed = true;
                  closure[circuitElm.getNode(j)] = true;
                }
                continue;
              }
              for (k = _s = 0, _ref7 = circuitElm.getPostCount(); 0 <= _ref7 ? _s < _ref7 : _s > _ref7; k = 0 <= _ref7 ? ++_s : --_s) {
                if (j === k) {
                  continue;
                }
                kn = circuitElm.getNode(k);
                if (circuitElm.getConnection(j, k) && !closure[kn]) {
                  closure[kn] = true;
                  changed = true;
                }
              }
            }
          }
          if (changed) {
            continue;
          }
          for (i = _t = 0, _ref8 = this.Circuit.numNodes(); 0 <= _ref8 ? _t < _ref8 : _t > _ref8; i = 0 <= _ref8 ? ++_t : --_t) {
            if (!closure[i] && !this.Circuit.nodeList[i].intern) {
              console.warn("Node " + i + " unconnected!");
              this.Stamper.stampResistor(0, i, 1e8);
              closure[i] = true;
              changed = true;
              break;
            }
          }
        }
        for (i = _u = 0, _ref9 = this.Circuit.numElements(); 0 <= _ref9 ? _u < _ref9 : _u > _ref9; i = 0 <= _ref9 ? ++_u : --_u) {
          ce = this.Circuit.getElmByIdx(i);
          if (ce instanceof InductorElm) {
            fpi = new Pathfinder(Pathfinder.INDUCT, ce, ce.getNode(1), this.Circuit.getElements(), this.Circuit.numNodes());
            if (!fpi.findPath(ce.getNode(0), 5) && !fpi.findPath(ce.getNode(0))) {
              ce.reset();
            }
          }
          if (ce instanceof CurrentElm) {
            fpi = new Pathfinder(Pathfinder.INDUCT, ce, ce.getNode(1), this.Circuit.getElements(), this.Circuit.numNodes());
            if (!fpi.findPath(ce.getNode(0))) {
              this.Circuit.halt("No path for current source!", ce);
              return;
            }
          }
          if ((ce instanceof VoltageElm && ce.getPostCount() === 2) || ce instanceof WireElm) {
            console.log("Examining Loop: " + (ce.dump()));
            pathfinder = new Pathfinder(Pathfinder.VOLTAGE, ce, ce.getNode(1), this.Circuit.getElements(), this.Circuit.numNodes());
            if (pathfinder.findPath(ce.getNode(0))) {
              this.Circuit.halt("Voltage source/wire loop with no resistance!", ce);
            }
          }
          if (ce instanceof CapacitorElm) {
            fpi = new Pathfinder(Pathfinder.SHORT, ce, ce.getNode(1), this.Circuit.getElements(), this.Circuit.numNodes());
            if (fpi.findPath(ce.getNode(0))) {
              ce.reset();
            } else {
              fpi = new Pathfinder(Pathfinder.CAP_V, ce, ce.getNode(1), this.Circuit.getElements(), this.Circuit.numNodes());
              if (fpi.findPath(ce.getNode(0))) {
                this.Circuit.halt("Capacitor loop with no resistance!", ce);
                return;
              }
            }
          }
        }
        for (i = _v = 0, _ref10 = this.matrixSize; 0 <= _ref10 ? _v < _ref10 : _v > _ref10; i = 0 <= _ref10 ? ++_v : --_v) {
          qm = -1;
          qp = -1;
          qv = 0;
          re = this.circuitRowInfo[i];
          if (re.lsChanges || re.dropRow || re.rsChanges) {
            continue;
          }
          rsadd = 0;
          for (j = _w = 0, _ref11 = this.matrixSize; 0 <= _ref11 ? _w < _ref11 : _w > _ref11; j = 0 <= _ref11 ? ++_w : --_w) {
            q = this.circuitMatrix[i][j];
            if (this.circuitRowInfo[j].type === RowInfo.ROW_CONST) {
              rsadd -= this.circuitRowInfo[j].value * q;
              continue;
            }
            if (q === 0) {
              continue;
            }
            if (qp === -1) {
              qp = j;
              qv = q;
              continue;
            }
            if (qm === -1 && (q === -qv)) {
              qm = j;
              continue;
            }
            break;
          }
          if (j === this.matrixSize) {
            if (qp === -1) {
              this.Circuit.halt("Matrix error qp (rsadd = " + rsadd + ")", null);
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
                continue;
              }
              if (elt.type !== RowInfo.ROW_NORMAL) {
                continue;
              }
              elt.type = RowInfo.ROW_CONST;
              elt.value = (this.circuitRightSide[i] + rsadd) / qv;
              this.circuitRowInfo[i].dropRow = true;
              console.error("iter = 0 # start over from scratch");
              i = -1;
            } else if ((this.circuitRightSide[i] + rsadd) === 0) {
              if (elt.type !== RowInfo.ROW_NORMAL) {
                qq = qm;
                qm = qp;
                qp = qq;
                elt = this.circuitRowInfo[qp];
                if (elt.type !== RowInfo.ROW_NORMAL) {
                  console.error("Swap failed!");
                  continue;
                }
              }
              elt.type = RowInfo.ROW_EQUAL;
              elt.nodeEq = qm;
              this.circuitRowInfo[i].dropRow = true;
            }
          }
        }
        newMatDim = 0;
        for (i = _x = 0, _ref12 = this.matrixSize; 0 <= _ref12 ? _x < _ref12 : _x > _ref12; i = 0 <= _ref12 ? ++_x : --_x) {
          rowInfo = this.circuitRowInfo[i];
          if (rowInfo.type === RowInfo.ROW_NORMAL) {
            rowInfo.mapCol = newMatDim++;
            continue;
          }
          if (rowInfo.type === RowInfo.ROW_EQUAL) {
            while (j !== (function() {
                _results = [];
                for (_y = 0; _y < 100; _y++){ _results.push(_y); }
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
        for (i = _z = 0, _ref13 = this.matrixSize; 0 <= _ref13 ? _z < _ref13 : _z > _ref13; i = 0 <= _ref13 ? ++_z : --_z) {
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
        for (i = _aa = 0, _ref14 = this.matrixSize; 0 <= _ref14 ? _aa < _ref14 : _aa > _ref14; i = 0 <= _ref14 ? ++_aa : --_aa) {
          circuitRowInfo = this.circuitRowInfo[i];
          if (circuitRowInfo.dropRow) {
            circuitRowInfo.mapRow = -1;
            continue;
          }
          newRS[ii] = this.circuitRightSide[i];
          circuitRowInfo.mapRow = ii;
          for (j = _ab = 0, _ref15 = this.matrixSize; 0 <= _ref15 ? _ab < _ref15 : _ab > _ref15; j = 0 <= _ref15 ? ++_ab : --_ab) {
            rowInfo = this.circuitRowInfo[j];
            if (rowInfo.type === RowInfo.ROW_CONST) {
              newRS[ii] -= rowInfo.value * this.circuitMatrix[i][j];
            } else {
              newMatx[ii][rowInfo.mapCol] += this.circuitMatrix[i][j];
            }
          }
          ii++;
        }
        this.circuitMatrix = newMatx;
        this.circuitRightSide = newRS;
        this.matrixSize = this.circuitMatrixSize = newSize;
        for (i = _ac = 0, _ref16 = this.matrixSize; 0 <= _ref16 ? _ac < _ref16 : _ac > _ref16; i = 0 <= _ref16 ? ++_ac : --_ac) {
          this.origRightSide[i] = this.circuitRightSide[i];
        }
        for (i = _ad = 0, _ref17 = this.matrixSize; 0 <= _ref17 ? _ad < _ref17 : _ad > _ref17; i = 0 <= _ref17 ? ++_ad : --_ad) {
          for (j = _ae = 0, _ref18 = this.matrixSize; 0 <= _ref18 ? _ae < _ref18 : _ae > _ref18; j = 0 <= _ref18 ? ++_ae : --_ae) {
            this.origMatrix[i][j] = this.circuitMatrix[i][j];
          }
        }
        this.circuitNeedsMap = true;
        this.analyzeFlag = false;
        if (!this.circuitNonLinear) {
          if (!this.luFactor(this.circuitMatrix, this.circuitMatrixSize, this.circuitPermute)) {
            this.Circuit.halt("Singular matrix in linear circuit!", null);
          }
        }
      };

      CircuitSolver.prototype.solveCircuit = function() {
        var circuitElm, circuitNode, cn1, debugPrint, i, iter, j, ji, lit, res, rowInfo, stepRate, subiter, subiterCount, tm, _i, _j, _k, _l, _len, _len1, _len2, _m, _n, _o, _p, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
        this.sysTime = (new Date()).getTime();
        if ((this.circuitMatrix == null) || this.Circuit.numElements() === 0) {
          this.circuitMatrix = null;
          return;
        }
        debugPrint = this.dumpMatrix;
        this.dumpMatrix = false;
        stepRate = Math.floor(160 * this.getIterCount());
        tm = (new Date()).getTime();
        lit = this.lastIterTime;
        if (1000 >= stepRate * (tm - this.lastIterTime)) {
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
          subiterCount = 5000;
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
              circuitElm.doStep(this.Stamper);
            }
            if (this.stopMessage != null) {
              return;
            }
            debugPrint = false;
            if (this.circuitNonLinear) {
              if (this.converged && subiter > 0) {
                break;
              }
              if (!this.luFactor(this.circuitMatrix, this.circuitMatrixSize, this.circuitPermute)) {
                this.Circuit.halt("Singular matrix in nonlinear circuit!", null);
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
                circuitNode = this.Circuit.nodeList[j + 1];
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
          if (subiter > 5) {
            console.log("converged after " + subiter + " iterations\n");
          }
          if (subiter >= subiterCount) {
            this.halt("Convergence failed: " + subiter, null);
            break;
          }
          this.Circuit.time += this.Circuit.timeStep();
          tm = (new Date()).getTime();
          lit = tm;
          if (iter * 1000 >= stepRate * (tm - this.lastIterTime)) {
            break;
          } else if ((tm - this.lastFrameTime) > 500) {
            break;
          }
          ++iter;
        }
        this.frames++;
        this.Circuit.iterations++;
        return this._updateTimings(lit);
      };


      /*
        luFactor: finds a solution to a factored matrix through LU (Lower-Upper) factorization
      
        Called once each frame for resistive circuits, otherwise called many times each frame
      
        @param circuitMatrix 2D matrix to be solved
        @param matrixSize number or rows/columns in the matrix
        @param pivotArray pivot index
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
        Step 2: `lu_solve`: (Called by lu_factor)
        finds a solution to a factored matrix through LU (Lower-Upper) factorization
      
        Called once each frame for resistive circuits, otherwise called many times each frame
      
        @param circuitMatrix matrix to be solved
        @param numRows dimension
        @param pivotVector pivot index
        @param circuitRightSide Right-side (dependent) matrix
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

      return CircuitSolver;

    })();
    return CircuitSolver;
  });

}).call(this);
