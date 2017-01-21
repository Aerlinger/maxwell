var MatrixStamper = require('./matrixStamper.js');
var Pathfinder = require('./pathfinder.js');
var CircuitNode = require('./circuitNode.js');
var CircuitNodeLink = require('./circuitNodeLink.js');
var RowInfo = require('./rowInfo.js');

var Setting = require('../settings/settings.js');
var Util = require('../util/util.js');
var SimulationFrame = require('../circuit/simulationFrame.js');
var GroundElm = require('../circuit/components/GroundElm.js');
var RailElm = require('../circuit/components/RailElm.js');
var VoltageElm = require('../circuit/components/VoltageElm.js');
var WireElm = require('../circuit/components/WireElm.js');
var CapacitorElm = require('../circuit/components/CapacitorElm.js');
var InductorElm = require('../circuit/components/InductorElm.js');
var CurrentElm = require('../circuit/components/CurrentElm.js');

var sprintf = require("sprintf-js").sprintf;

CircuitSolver = (function () {
  CircuitSolver.SIZE_LIMIT = 100;
  CircuitSolver.MAXIMUM_SUBITERATIONS = 5000;

  function CircuitSolver(Circuit) {
    this.Circuit = Circuit;
    this.scaleFactors = Util.zeroArray(400);
    this.reset();
    this.Stamper = new MatrixStamper(this.Circuit);
  }

  CircuitSolver.prototype.reset = function () {
    this.Circuit.time = 0;
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
    this.analyzeFlag = true;
    return this.simulationFrames = [];
  };

  CircuitSolver.prototype.reconstruct = function () {
    if (!this.analyzeFlag || (this.Circuit.numElements() === 0)) {
      return;
    }
    this.Circuit.clearErrors();
    this.Circuit.resetNodes();
    this.discoverGroundReference();
    this.constructCircuitGraph();
    this.constructMatrixEquations();
    this.checkConnectivity();
    this.findInvalidPaths();
    this.optimize();
    if (this.circuitLinear()) {
      return this.luFactor(this.circuitMatrix, this.circuitMatrixSize, this.circuitPermute);
    }
  };

  CircuitSolver.prototype.solveCircuit = function () {
    var circuitElm, iter, j, lit, res, stepRate, subiter, tm, _i, _j, _k, _l, _len, _len1, _ref, _ref1, _ref2, _ref3;
    this.sysTime = (new Date()).getTime();
    if ((this.circuitMatrix == null) || this.Circuit.numElements() === 0) {
      this.circuitMatrix = null;
      console.error("Called solve circuit when circuit Matrix not initialized");
      return;
    }
    stepRate = Math.floor(160 * this.getIterCount());
    tm = (new Date()).getTime();
    lit = this.lastIterTime;
    iter = 1;
    while (true) {
      ++this.steps;
      _ref = this.Circuit.getElements();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        circuitElm = _ref[_i];
        circuitElm.startIteration();
      }
      for (subiter = _j = 0, _ref1 = CircuitSolver.MAXIMUM_SUBITERATIONS; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; subiter = 0 <= _ref1 ? ++_j : --_j) {
        this.converged = true;
        this.subIterations = subiter;
        this.restoreOriginalMatrixState();
        _ref2 = this.Circuit.getElements();
        for (_k = 0, _len1 = _ref2.length; _k < _len1; _k++) {
          circuitElm = _ref2[_k];
          circuitElm.doStep(this.Stamper);
        }
        if (this.circuitNonLinear) {
          if (this.converged && subiter > 0) {
            break;
          }
          this.luFactor(this.circuitMatrix, this.circuitMatrixSize, this.circuitPermute);
        }
        this.luSolve(this.circuitMatrix, this.circuitMatrixSize, this.circuitPermute, this.circuitRightSide);
        for (j = _l = 0, _ref3 = this.circuitMatrixFullSize; 0 <= _ref3 ? _l < _ref3 : _l > _ref3; j = 0 <= _ref3 ? ++_l : --_l) {
          res = this.getValueFromNode(j);
          if (!this.updateComponent(j, res)) {
            break;
          }
        }
        if (this.circuitLinear()) {
          break;
        }
      }
      if (subiter >= CircuitSolver.MAXIMUM_SUBITERATIONS) {
        this.halt("Convergence failed: " + subiter, null);
        break;
      }
      this.Circuit.time += this.Circuit.timeStep();
      tm = (new Date()).getTime();
      lit = tm;
      if ((iter * 1000 >= stepRate * (tm - this.lastIterTime)) || (tm - this.lastFrameTime) > 500) {
        break;
      }
      ++iter;
    }
    this.frames++;
    this.Circuit.iterations++;

    this.simulationFrames.push(new SimulationFrame(this.Circuit));
    return this._updateTimings(lit);
  };

  CircuitSolver.prototype.circuitLinear = function () {
    return !this.circuitNonLinear;
  };

  CircuitSolver.prototype._updateTimings = function (lastIterationTime) {
    var currentSpeed, inc, sysTime;
    this.lastIterTime = lastIterationTime;
    sysTime = (new Date()).getTime();
    if (this.lastTime !== 0) {
      inc = Math.floor(sysTime - this.lastTime);
      currentSpeed = Math.exp(this.Circuit.currentSpeed() / 3.5 - 14.2);
      this.Circuit.Params.setCurrentMult(1.7 * inc * currentSpeed);
    }
    if ((sysTime - this.secTime) >= 1000) {
      this.frames = 0;
      this.steps = 0;
      this.secTime = sysTime;
    }
    this.lastTime = sysTime;
    return this.lastFrameTime = this.lastTime;
  };

  CircuitSolver.prototype.getStamper = function () {
    return this.Stamper;
  };

  CircuitSolver.prototype.getIterCount = function () {
    var sim_speed;
    sim_speed = this.Circuit.simSpeed();
    return 0.1 * Math.exp((sim_speed - 61.0) / 24.0);
  };

  CircuitSolver.prototype.discoverGroundReference = function () {
    var ce, circuitNode, gotGround, gotRail, pt, volt, _i, _len, _ref;
    gotGround = false;
    gotRail = false;
    volt = null;
    _ref = this.Circuit.getElements();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      ce = _ref[_i];
      if (ce instanceof GroundElm) {
        gotGround = true;
        break;
      }
      if (Util.typeOf(ce, RailElm)) {
        gotRail = true;
      }
      if ((volt == null) && Util.typeOf(ce, VoltageElm)) {
        volt = ce;
      }
    }
    circuitNode = new CircuitNode(this);
    circuitNode.x = circuitNode.y = -1;
    if (!gotGround && !gotRail && (volt != null)) {
      pt = volt.getPost(0);
      circuitNode.x = pt.x;
      circuitNode.y = pt.y;
    }
    return this.Circuit.addCircuitNode(circuitNode);
  };

  CircuitSolver.prototype.buildComponentNodes = function () {
    var circuitElm, circuitNode, internalLink, internalNode, internalNodeCount, internalNodeIdx, internalVSCount, nodeIdx, nodeLink, postCount, postIdx, postPt, voltageSourceCount, _i, _j, _k, _l, _len, _ref, _ref1, _results;
    voltageSourceCount = 0;
    _ref = this.Circuit.getElements();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      circuitElm = _ref[_i];
      internalNodeCount = circuitElm.getInternalNodeCount();
      internalVSCount = circuitElm.getVoltageSourceCount();
      postCount = circuitElm.getPostCount();
      for (postIdx = _j = 0; 0 <= postCount ? _j < postCount : _j > postCount; postIdx = 0 <= postCount ? ++_j : --_j) {
        postPt = circuitElm.getPost(postIdx);
        for (nodeIdx = _k = 0, _ref1 = this.Circuit.numNodes(); 0 <= _ref1 ? _k < _ref1 : _k > _ref1; nodeIdx = 0 <= _ref1 ? ++_k : --_k) {
          circuitNode = this.Circuit.getNode(nodeIdx);
          if (Util.overlappingPoints(postPt, circuitNode)) {
            break;
          }
        }
        nodeLink = new CircuitNodeLink();
        nodeLink.num = postIdx;
        nodeLink.elm = circuitElm;
        if (nodeIdx === this.Circuit.numNodes()) {
          circuitNode = new CircuitNode(this, postPt.x, postPt.y);
          circuitNode.links.push(nodeLink);
          circuitElm.setNode(postIdx, this.Circuit.numNodes());
          this.Circuit.addCircuitNode(circuitNode);
        } else {
          this.Circuit.getNode(nodeIdx).links.push(nodeLink);
          circuitElm.setNode(postIdx, nodeIdx);
          if (nodeIdx === 0) {
            circuitElm.setNodeVoltage(postIdx, 0);
          }
        }
      }
      for (internalNodeIdx = _l = 0; 0 <= internalNodeCount ? _l < internalNodeCount : _l > internalNodeCount; internalNodeIdx = 0 <= internalNodeCount ? ++_l : --_l) {
        internalLink = new CircuitNodeLink();
        internalLink.num = internalNodeIdx + postCount;
        internalLink.elm = circuitElm;
        internalNode = new CircuitNode(this, -1, -1, true);
        internalNode.links.push(internalLink);
        circuitElm.setNode(internalLink.num, this.Circuit.numNodes());
        this.Circuit.addCircuitNode(internalNode);
      }
      _results.push(voltageSourceCount += internalVSCount);
    }
    return _results;
  };

  CircuitSolver.prototype.constructCircuitGraph = function () {
    var circuitElement, voltSourceIdx, voltageSourceCount, _i, _j, _len, _ref, _ref1;
    this.buildComponentNodes();
    this.Circuit.voltageSources = new Array(voltageSourceCount);
    voltageSourceCount = 0;
    this.circuitNonLinear = false;
    _ref = this.Circuit.getElements();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      circuitElement = _ref[_i];
      if (circuitElement.nonLinear()) {
        this.circuitNonLinear = true;
      }
      for (voltSourceIdx = _j = 0, _ref1 = circuitElement.getVoltageSourceCount(); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; voltSourceIdx = 0 <= _ref1 ? ++_j : --_j) {
        this.Circuit.voltageSources[voltageSourceCount] = circuitElement;
        circuitElement.setVoltageSource(voltSourceIdx, voltageSourceCount++);
      }
    }
    this.Circuit.voltageSourceCount = voltageSourceCount;
    return this.matrixSize = this.Circuit.numNodes() + voltageSourceCount - 1;
  };

  CircuitSolver.prototype.constructMatrixEquations = function () {
    var circuitElm, rowIdx, _i, _j, _len, _ref, _ref1, _results;
    this.circuitMatrixSize = this.circuitMatrixFullSize = this.matrixSize;
    this.circuitMatrix = Util.zeroArray2(this.matrixSize, this.matrixSize);
    this.origMatrix = Util.zeroArray2(this.matrixSize, this.matrixSize);
    this.circuitRightSide = Util.zeroArray(this.matrixSize);
    this.origRightSide = Util.zeroArray(this.matrixSize);
    this.circuitRowInfo = Util.zeroArray(this.matrixSize);
    this.circuitPermute = Util.zeroArray(this.matrixSize);
    for (rowIdx = _i = 0, _ref = this.matrixSize; 0 <= _ref ? _i < _ref : _i > _ref; rowIdx = 0 <= _ref ? ++_i : --_i) {
      this.circuitRowInfo[rowIdx] = new RowInfo();
    }
    this.circuitNeedsMap = false;
    _ref1 = this.Circuit.getElements();
    _results = [];
    for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
      circuitElm = _ref1[_j];
      _results.push(circuitElm.stamp(this.Stamper));
    }
    return _results;
  };

  CircuitSolver.prototype.checkConnectivity = function () {
    var changed, circuitElm, closure, nodeIdx, postIdx, siblingNode, siblingPostIdx, _i, _j, _k, _len, _ref, _ref1, _ref2, _results;
    closure = new Array(this.Circuit.numNodes());
    closure[0] = true;
    changed = true;
    _results = [];
    while (changed) {
      changed = false;
      _ref = this.Circuit.getElements();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        circuitElm = _ref[_i];
        for (postIdx = _j = 0, _ref1 = circuitElm.getPostCount(); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; postIdx = 0 <= _ref1 ? ++_j : --_j) {
          if (!closure[circuitElm.getNode(postIdx)]) {
            if (circuitElm.hasGroundConnection(postIdx)) {
              changed = true;
              closure[circuitElm.getNode(postIdx)] = true;
            }
            continue;
          }
          for (siblingPostIdx = _k = 0, _ref2 = circuitElm.getPostCount(); 0 <= _ref2 ? _k < _ref2 : _k > _ref2; siblingPostIdx = 0 <= _ref2 ? ++_k : --_k) {
            if (postIdx === siblingPostIdx) {
              continue;
            }
            siblingNode = circuitElm.getNode(siblingPostIdx);
            if (circuitElm.getConnection(postIdx, siblingPostIdx) && !closure[siblingNode]) {
              closure[siblingNode] = true;
              changed = true;
            }
          }
        }
      }
      if (changed) {
        continue;
      }
      _results.push((function () {
        var _l, _ref3, _results1;
        _results1 = [];
        for (nodeIdx = _l = 0, _ref3 = this.Circuit.numNodes(); 0 <= _ref3 ? _l < _ref3 : _l > _ref3; nodeIdx = 0 <= _ref3 ? ++_l : --_l) {
          if (!closure[nodeIdx] && !this.Circuit.nodeList[nodeIdx].intern) {
            console.warn("Node " + nodeIdx + " unconnected! -> " + (this.Circuit.nodeList[nodeIdx].toString()));
            this.Stamper.stampResistor(0, nodeIdx, 1e8);
            closure[nodeIdx] = true;
            changed = true;
            break;
          } else {
            _results1.push(void 0);
          }
        }
        return _results1;
      }).call(this));
    }
    return _results;
  };

  CircuitSolver.prototype.findInvalidPaths = function () {
    var ce, fpi, pathfinder, _i, _len, _ref;
    _ref = this.Circuit.getElements();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      ce = _ref[_i];
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
      if ((Util.typeOf(ce, VoltageElm) && ce.getPostCount() === 2) || ce instanceof WireElm) {
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
  };

  CircuitSolver.prototype.optimize = function () {
    var circuitRowInfo, col, elt, j, k, lastVal, newIdx, newMatDim, newMatx, newRS, newSize, qm, qp, qq, re, row, rowInfo, rowNodeEq, rsadd, _i, _j, _k, _l, _m, _n, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
    row = -1;
    while (row < this.matrixSize - 1) {
      row += 1;
      re = this.circuitRowInfo[row];
      if (re.lsChanges || re.dropRow || re.rsChanges) {
        continue;
      }
      rsadd = 0;
      qm = -1;
      qp = -1;
      lastVal = 0;
      for (col = _i = 0, _ref = this.matrixSize; 0 <= _ref ? _i < _ref : _i > _ref; col = 0 <= _ref ? ++_i : --_i) {
        if (this.circuitRowInfo[col].type === RowInfo.ROW_CONST) {
          rsadd -= this.circuitRowInfo[col].value * this.circuitMatrix[row][col];
        } else if (this.circuitMatrix[row][col] === 0) {

        } else if (qp === -1) {
          qp = col;
          lastVal = this.circuitMatrix[row][col];
        } else if (qm === -1 && (this.circuitMatrix[row][col] === -lastVal)) {
          qm = col;
        } else {
          break;
        }
      }
      if (col === this.matrixSize) {
        if (qp === -1) {
          this.Circuit.halt("Matrix error qp (row with all zeros) (rsadd = " + rsadd + ")", null);
          return;
        }
        elt = this.circuitRowInfo[qp];
        if (qm === -1) {
          k = 0;
          while (elt.type === RowInfo.ROW_EQUAL && k < CircuitSolver.SIZE_LIMIT) {
            qp = elt.nodeEq;
            elt = this.circuitRowInfo[qp];
            ++k;
          }
          if (elt.type === RowInfo.ROW_EQUAL) {
            elt.type = RowInfo.ROW_NORMAL;
          } else if (elt.type !== RowInfo.ROW_NORMAL) {

          } else {
            elt.type = RowInfo.ROW_CONST;
            elt.value = (this.circuitRightSide[row] + rsadd) / lastVal;
            this.circuitRowInfo[row].dropRow = true;
            row = -1;
          }
        } else if ((this.circuitRightSide[row] + rsadd) === 0) {
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
          this.circuitRowInfo[row].dropRow = true;
        }
      }
    }
    newMatDim = 0;
    for (row = _j = 0, _ref1 = this.matrixSize; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; row = 0 <= _ref1 ? ++_j : --_j) {
      rowInfo = this.circuitRowInfo[row];
      if (rowInfo.type === RowInfo.ROW_NORMAL) {
        rowInfo.mapCol = newMatDim++;
      } else {
        if (rowInfo.type === RowInfo.ROW_EQUAL) {
          for (j = _k = 0, _ref2 = CircuitSolver.SIZE_LIMIT; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; j = 0 <= _ref2 ? ++_k : --_k) {
            rowNodeEq = this.circuitRowInfo[rowInfo.nodeEq];
            if ((rowNodeEq.type !== RowInfo.ROW_EQUAL) || (row === rowNodeEq.nodeEq)) {
              break;
            }
            rowInfo.nodeEq = rowNodeEq.nodeEq;
          }
        }
        if (rowInfo.type === RowInfo.ROW_CONST) {
          rowInfo.mapCol = -1;
        }
      }
    }
    for (row = _l = 0, _ref3 = this.matrixSize; 0 <= _ref3 ? _l < _ref3 : _l > _ref3; row = 0 <= _ref3 ? ++_l : --_l) {
      rowInfo = this.circuitRowInfo[row];
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
    newMatx = Util.zeroArray2(newSize, newSize);
    newRS = new Array(newSize);
    Util.zeroArray(newRS);
    newIdx = 0;
    for (row = _m = 0, _ref4 = this.matrixSize; 0 <= _ref4 ? _m < _ref4 : _m > _ref4; row = 0 <= _ref4 ? ++_m : --_m) {
      circuitRowInfo = this.circuitRowInfo[row];
      if (circuitRowInfo.dropRow) {
        circuitRowInfo.mapRow = -1;
      } else {
        newRS[newIdx] = this.circuitRightSide[row];
        circuitRowInfo.mapRow = newIdx;
        for (col = _n = 0, _ref5 = this.matrixSize; 0 <= _ref5 ? _n < _ref5 : _n > _ref5; col = 0 <= _ref5 ? ++_n : --_n) {
          rowInfo = this.circuitRowInfo[col];
          if (rowInfo.type === RowInfo.ROW_CONST) {
            newRS[newIdx] -= rowInfo.value * this.circuitMatrix[row][col];
          } else {
            newMatx[newIdx][rowInfo.mapCol] += this.circuitMatrix[row][col];
          }
        }
        newIdx++;
      }
    }
    this.circuitMatrix = newMatx;
    this.circuitRightSide = newRS;
    this.matrixSize = this.circuitMatrixSize = newSize;
    this.saveOriginalMatrixState();
    this.circuitNeedsMap = true;
    return this.analyzeFlag = false;
  };

  CircuitSolver.prototype.saveOriginalMatrixState = function () {
    var col, row, _i, _j, _ref, _ref1, _results;
    for (row = _i = 0, _ref = this.matrixSize; 0 <= _ref ? _i < _ref : _i > _ref; row = 0 <= _ref ? ++_i : --_i) {
      this.origRightSide[row] = this.circuitRightSide[row];
    }
    if (this.circuitNonLinear) {
      _results = [];
      for (row = _j = 0, _ref1 = this.matrixSize; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; row = 0 <= _ref1 ? ++_j : --_j) {
        _results.push((function () {
          var _k, _ref2, _results1;
          _results1 = [];
          for (col = _k = 0, _ref2 = this.matrixSize; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; col = 0 <= _ref2 ? ++_k : --_k) {
            _results1.push(this.origMatrix[row][col] = this.circuitMatrix[row][col]);
          }
          return _results1;
        }).call(this));
      }
      return _results;
    }
  };

  CircuitSolver.prototype.restoreOriginalMatrixState = function () {
    var col, row, _i, _j, _ref, _ref1, _results;
    for (row = _i = 0, _ref = this.circuitMatrixSize; 0 <= _ref ? _i < _ref : _i > _ref; row = 0 <= _ref ? ++_i : --_i) {
      this.circuitRightSide[row] = this.origRightSide[row];
    }
    if (this.circuitNonLinear) {
      _results = [];
      for (row = _j = 0, _ref1 = this.circuitMatrixSize; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; row = 0 <= _ref1 ? ++_j : --_j) {
        _results.push((function () {
          var _k, _ref2, _results1;
          _results1 = [];
          for (col = _k = 0, _ref2 = this.circuitMatrixSize; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; col = 0 <= _ref2 ? ++_k : --_k) {
            _results1.push(this.circuitMatrix[row][col] = this.origMatrix[row][col]);
          }
          return _results1;
        }).call(this));
      }
      return _results;
    }
  };

  CircuitSolver.prototype.getValueFromNode = function (idx) {
    var rowInfo;
    rowInfo = this.circuitRowInfo[idx];
    if (rowInfo.type === RowInfo.ROW_CONST) {
      return rowInfo.value;
    } else {
      return this.circuitRightSide[rowInfo.mapCol];
    }
  };

  CircuitSolver.prototype.updateComponent = function (nodeIdx, value) {
    var circuitNode, circuitNodeLink, ji, _i, _len, _ref;
    if (isNaN(value)) {
      this.converged = false;
      return false;
    }
    if (nodeIdx < (this.Circuit.numNodes() - 1)) {
      circuitNode = this.Circuit.nodeList[nodeIdx + 1];
      _ref = circuitNode.links;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        circuitNodeLink = _ref[_i];
        circuitNodeLink.elm.setNodeVoltage(circuitNodeLink.num, value);
      }
    } else {
      ji = nodeIdx - (this.Circuit.numNodes() - 1);
      this.Circuit.voltageSources[ji].setCurrent(ji, value);
    }
    return true;
  };


  /*
   luFactor: finds a solution to a factored matrix through LU (Lower-Upper) factorization

   Called once each frame for resistive circuits, otherwise called many times each frame

   returns a falsy value if the provided circuitMatrix can't be factored

   @param (input/output) circuitMatrix 2D matrix to be solved
   @param (input) matrixSize number or rows/columns in the matrix
   @param (output) pivotArray pivot index
   */

  CircuitSolver.prototype.luFactor = function (circuitMatrix, matrixSize, pivotArray) {
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
        throw new Error("Singular matrix (" + i + ", " + j + ") -> " + largest);
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

  CircuitSolver.prototype.luSolve = function (circuitMatrix, numRows, pivotVector, circuitRightSide) {
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

  CircuitSolver.prototype.dump = function () {
    var out, rowInfo, _i, _len, _ref;
    out = "";
    out += this.Circuit.Params.toString() + "\n";
    _ref = this.circuitRowInfo;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      rowInfo = _ref[_i];
      out += rowInfo.toString() + "\n";
    }
    out += "\nCircuit permute: " + Util.printArray(this.circuitPermute);
    return out + "\n";
  };

  CircuitSolver.prototype.dumpFrame = function () {
    var circuitMatrixDump, circuitRightSideDump, i, j, matrixRowCount, out, _i, _j;
    matrixRowCount = this.circuitRightSide.length;
    out = "";
    circuitMatrixDump = "";
    circuitRightSideDump = "";
    for (i = _i = 0; 0 <= matrixRowCount ? _i < matrixRowCount : _i > matrixRowCount; i = 0 <= matrixRowCount ? ++_i : --_i) {
      circuitRightSideDump += Util.tidyFloat(this.circuitRightSide[i]);
      circuitMatrixDump += "[";
      for (j = _j = 0; 0 <= matrixRowCount ? _j < matrixRowCount : _j > matrixRowCount; j = 0 <= matrixRowCount ? ++_j : --_j) {
        circuitMatrixDump += Util.tidyFloat(this.circuitMatrix[i][j]);
        if (j !== matrixRowCount - 1) {
          circuitMatrixDump += ", ";
        }
      }
      circuitMatrixDump += "]";
      if (i !== matrixRowCount - 1) {
        circuitRightSideDump += ", ";
        circuitMatrixDump += ", ";
      }
    }
    out += sprintf("%d %.7f %d %d\n", this.Circuit.iterations, this.Circuit.time, this.subIterations, matrixRowCount);
    out += circuitMatrixDump + "\n";
    out += circuitRightSideDump;
    return out;
  };

  return CircuitSolver;

})();

module.exports = CircuitSolver;

