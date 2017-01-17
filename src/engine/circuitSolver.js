let MatrixStamper = require('./matrixStamper.js');

let Pathfinder = require('./pathfinder.js');
let CircuitNode = require('./circuitNode.js');
let CircuitNodeLink = require('./circuitNodeLink.js');
let RowInfo = require('./rowInfo.js');
let Setting = require('../settings/settings.js');
let Util = require('../util/util.js');

let SimulationFrame = require('../circuit/simulationFrame.js');

let GroundElm = require('../circuit/components/GroundElm.js');
let RailElm = require('../circuit/components/RailElm.js');
let VoltageElm = require('../circuit/components/VoltageElm.js');
let WireElm = require('../circuit/components/WireElm.js');
let CapacitorElm = require('../circuit/components/CapacitorElm.js');
let InductorElm = require('../circuit/components/InductorElm.js');
let CurrentElm = require('../circuit/components/CurrentElm.js');

let { sprintf } = require("sprintf-js");

class CircuitSolver {
  static initClass() {
    this.SIZE_LIMIT = 100;
    this.MAXIMUM_SUBITERATIONS = 5000;
  }

  constructor(Circuit) {
    this.Circuit = Circuit;
    this.scaleFactors = Util.zeroArray(400);
    this.reset();
    this.Stamper = new MatrixStamper(this.Circuit);
  }


  reset() {
    this.Circuit.time = 0;

    this.converged = true; // true if numerical analysis has converged
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
  }

  reconstruct() {
    if (!this.analyzeFlag || (this.Circuit.numElements() === 0)) { return; }

    this.Circuit.clearErrors();
    this.Circuit.resetNodes();

    this.discoverGroundReference();
    this.constructCircuitGraph();
    this.constructMatrixEquations();
    this.checkConnectivity();
    this.findInvalidPaths();
    this.optimize();

    // if a matrix is linear, we can do the lu_factor here instead of needing to do it every frame
    if (this.circuitLinear()) {
      return this.luFactor(this.circuitMatrix, this.circuitMatrixSize, this.circuitPermute);
    }
  }

  solveCircuit() {
    this.sysTime = (new Date()).getTime();

    if ((this.circuitMatrix == null) || (this.Circuit.numElements() === 0)) {
      this.circuitMatrix = null;
      console.error("Called solve circuit when circuit Matrix not initialized");
      return;
    }

    let stepRate = Math.floor(160 * this.getIterCount());
    let tm = (new Date()).getTime();
    let lit = this.lastIterTime;

    // if 1000 >= stepRate * (tm - @lastIterTime)
    //   return

    let iter = 1;
    while (true) {
      var subiter;
      ++this.steps;

      for (var circuitElm of Array.from(this.Circuit.getElements())) {
        circuitElm.startIteration();
      }

      // Sub iteration
      for (subiter = 0, end = CircuitSolver.MAXIMUM_SUBITERATIONS, asc = 0 <= end; asc ? subiter < end : subiter > end; asc ? subiter++ : subiter--) {
        var asc, end;
        this.converged = true;
        this.subIterations = subiter;

        this.restoreOriginalMatrixState();

        for (circuitElm of Array.from(this.Circuit.getElements())) {
          circuitElm.doStep(this.Stamper);
        }

        if (this.circuitNonLinear) {
          if (this.converged && (subiter > 0)) { break; }
          this.luFactor(this.circuitMatrix, this.circuitMatrixSize, this.circuitPermute);
        }

        this.luSolve(this.circuitMatrix, this.circuitMatrixSize, this.circuitPermute, this.circuitRightSide);

        // backsolve and update each component current/voltage...
        for (let j = 0, end1 = this.circuitMatrixFullSize, asc1 = 0 <= end1; asc1 ? j < end1 : j > end1; asc1 ? j++ : j--) {
          let res = this.getValueFromNode(j);
          if (!this.updateComponent(j, res)) { break; }
        }

        if (this.circuitLinear()) { break; }
      }

      if (subiter >= CircuitSolver.MAXIMUM_SUBITERATIONS) {
        this.halt(`Convergence failed: ${subiter}`, null);
        break;
      }

      this.Circuit.time += this.Circuit.timeStep();

      // TODO: Update scopes here
      // for scope in @Circuit.scopes
      // scope.timeStep()

      tm = (new Date()).getTime();
      lit = tm;

      if (((iter * 1000) >= (stepRate * (tm - this.lastIterTime))) || ((tm - this.lastFrameTime) > 500)) {
        break;
      }

      ++iter;
    }

    this.frames++;
    this.Circuit.iterations++;

    this.simulationFrames.push(new SimulationFrame(this.Circuit));

    return this._updateTimings(lit);
  }

  circuitLinear() {
    return !this.circuitNonLinear;
  }

  _updateTimings(lastIterationTime) {
    this.lastIterTime = lastIterationTime;

    let sysTime = (new Date()).getTime();

    if (this.lastTime !== 0) {
      let inc = Math.floor(sysTime - this.lastTime);
      let currentSpeed = Math.exp((this.Circuit.currentSpeed() / 3.5) - 14.2);

      this.Circuit.Params.setCurrentMult(1.7 * inc * currentSpeed);
    }

    if ((sysTime - this.secTime) >= 1000) {
//      console.log("Reset!")
      this.frames = 0;
      this.steps = 0;
      this.secTime = sysTime;
    }

    this.lastTime = sysTime;
    return this.lastFrameTime = this.lastTime;
  }


  getStamper() {
    return this.Stamper;
  }

  getIterCount() {
    let sim_speed = this.Circuit.simSpeed();
    return 0.1 * Math.exp((sim_speed - 61.0) / 24.0);
  }

  discoverGroundReference() {
    let gotGround = false;
    let gotRail = false;
    let volt = null;

    // Check if this circuit has a voltage rail and if it has a voltage element.
    for (let ce of Array.from(this.Circuit.getElements())) {
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

    let circuitNode = new CircuitNode(this);
    circuitNode.x = circuitNode.y = -1;

    // If no ground and no rails then voltage element's first terminal is referenced to ground:
    if (!gotGround && !gotRail && (volt != null)) {
      let pt = volt.getPost(0);

      circuitNode.x = pt.x;
      circuitNode.y = pt.y;
    }

    return this.Circuit.addCircuitNode(circuitNode);
  }

  buildComponentNodes() {
    let internalNodeCount, internalVSCount, postCount;
    let internalLink, internalNode;
    let voltageSourceCount = 0;

    return Array.from(this.Circuit.getElements()).map((circuitElm) =>
      (internalNodeCount = circuitElm.getInternalNodeCount(),
      internalVSCount = circuitElm.getVoltageSourceCount(),
      postCount = circuitElm.getPostCount(),

      // allocate a node for each post and match postCount to nodes
      (() => {
        let result = [];
        for (let postIdx = 0, end = postCount, asc = 0 <= end; asc ? postIdx < end : postIdx > end; asc ? postIdx++ : postIdx--) {
          var circuitNode, nodeIdx;
          let item;
          let postPt = circuitElm.getPost(postIdx);

          for (nodeIdx = 0, end1 = this.Circuit.numNodes(), asc1 = 0 <= end1; asc1 ? nodeIdx < end1 : nodeIdx > end1; asc1 ? nodeIdx++ : nodeIdx--) {
            var asc1, end1;
            circuitNode = this.Circuit.getNode(nodeIdx);
            try  {
              if (Util.overlappingPoints(postPt, circuitNode)) {
                break;
              }
            } catch (e) {
              console.log(`ERR INVALID COMPONENT: ${circuitElm} (${postIdx}) ${e.message}`)
              console.log(e.stack)
            }
          }

          let nodeLink = new CircuitNodeLink();
          nodeLink.num = postIdx;
          nodeLink.elm = circuitElm;

          if (nodeIdx === this.Circuit.numNodes()) {

            try {
              circuitNode = new CircuitNode(this, postPt.x, postPt.y);
              circuitNode.links.push(nodeLink);

            } catch (e) {
              console.log(`ERR INVALID COMPONENT: ${circuitElm} (${postIdx}) ${e.message}`)
              console.log(e.stack)
            }

            circuitElm.setNode(postIdx, this.Circuit.numNodes());
            item = this.Circuit.addCircuitNode(circuitNode);

          } else {
            this.Circuit.getNode(nodeIdx).links.push(nodeLink);
            circuitElm.setNode(postIdx, nodeIdx);

            if (nodeIdx === 0) {
              item = circuitElm.setNodeVoltage(postIdx, 0);
            }
          }
          result.push(item);
        }
        return result;
      })(),

      __range__(0, internalNodeCount, false).map((internalNodeIdx) =>
        (internalLink = new CircuitNodeLink(),
        internalLink.num = internalNodeIdx + postCount,
        internalLink.elm = circuitElm,

        internalNode = new CircuitNode(this, -1, -1, true),
        internalNode.links.push(internalLink),
        circuitElm.setNode(internalLink.num, this.Circuit.numNodes()),

        this.Circuit.addCircuitNode(internalNode))),

      voltageSourceCount += internalVSCount));
  }


  constructCircuitGraph() {
    // Allocate nodes and voltage sources
    this.buildComponentNodes();

    this.Circuit.voltageSources = new Array(voltageSourceCount);

    var voltageSourceCount = 0;
    this.circuitNonLinear = false;

    // Determine if circuit is nonlinear
    for (let circuitElement of Array.from(this.Circuit.getElements())) {
      if (circuitElement.nonLinear()) {
        this.circuitNonLinear = true;
      }

      for (let voltSourceIdx = 0, end = circuitElement.getVoltageSourceCount(), asc = 0 <= end; asc ? voltSourceIdx < end : voltSourceIdx > end; asc ? voltSourceIdx++ : voltSourceIdx--) {
        this.Circuit.voltageSources[voltageSourceCount] = circuitElement;
        circuitElement.setVoltageSource(voltSourceIdx, voltageSourceCount++);
      }
    }

    this.Circuit.voltageSourceCount = voltageSourceCount;

    return this.matrixSize = (this.Circuit.numNodes() + voltageSourceCount) - 1;
  }

  constructMatrixEquations() {
    this.circuitMatrixSize = this.circuitMatrixFullSize = this.matrixSize;

    this.circuitMatrix = Util.zeroArray2(this.matrixSize, this.matrixSize);
    this.origMatrix = Util.zeroArray2(this.matrixSize, this.matrixSize);

    this.circuitRightSide = Util.zeroArray(this.matrixSize);
    this.origRightSide = Util.zeroArray(this.matrixSize);
    this.circuitRowInfo = Util.zeroArray(this.matrixSize);
    this.circuitPermute = Util.zeroArray(this.matrixSize);

    for (let rowIdx = 0, end = this.matrixSize, asc = 0 <= end; asc ? rowIdx < end : rowIdx > end; asc ? rowIdx++ : rowIdx--) {
      this.circuitRowInfo[rowIdx] = new RowInfo();
    }

    this.circuitNeedsMap = false;

    // Construct Matrix Equations
    return Array.from(this.Circuit.getElements()).map((circuitElm) =>
      circuitElm.stamp(this.Stamper));
  }

  checkConnectivity() {// Determine nodes that are unconnected
    let closure = new Array(this.Circuit.numNodes());
    closure[0] = true;
    let changed = true;

    return (() => {
      let result = [];
      while (changed) {
        changed = false;
        for (let circuitElm of Array.from(this.Circuit.getElements())) {

          // Loop through all ce's nodes to see if they are connected to other nodes not in closure
          for (let postIdx = 0, end = circuitElm.getPostCount(), asc = 0 <= end; asc ? postIdx < end : postIdx > end; asc ? postIdx++ : postIdx--) {
            if (!closure[circuitElm.getNode(postIdx)]) {
              if (circuitElm.hasGroundConnection(postIdx)) {
                changed = true;
                closure[circuitElm.getNode(postIdx)] = true;
              }
              continue;
            }

            for (let siblingPostIdx = 0, end1 = circuitElm.getPostCount(), asc1 = 0 <= end1; asc1 ? siblingPostIdx < end1 : siblingPostIdx > end1; asc1 ? siblingPostIdx++ : siblingPostIdx--) {
              if (postIdx === siblingPostIdx) {
                continue;
              }

              let siblingNode = circuitElm.getNode(siblingPostIdx);
              if (circuitElm.getConnection(postIdx, siblingPostIdx) && !closure[siblingNode]) {
                closure[siblingNode] = true;
                changed = true;
              }
            }
          }
        }

        if (changed) { continue; }

        // connect unconnected nodes
        result.push((() => {
          let result1 = [];
          for (let nodeIdx = 0, end2 = this.Circuit.numNodes(), asc2 = 0 <= end2; asc2 ? nodeIdx < end2 : nodeIdx > end2; asc2 ? nodeIdx++ : nodeIdx--) {
            let item;
            if (!closure[nodeIdx] && !this.Circuit.nodeList[nodeIdx].intern) {
              console.warn(`Node ${nodeIdx} unconnected! -> ${this.Circuit.nodeList[nodeIdx].toString()}`);
              this.Stamper.stampResistor(0, nodeIdx, 1e8);
              closure[nodeIdx] = true;
              changed = true;
              break;
            }
            result1.push(item);
          }
          return result1;
        })());
      }
      return result;
    })();
  }


  findInvalidPaths() {
    for (let ce of Array.from(this.Circuit.getElements())) {
      var fpi;
      if (ce instanceof InductorElm) {
        fpi = new Pathfinder(Pathfinder.INDUCT, ce, ce.getNode(1), this.Circuit.getElements(), this.Circuit.numNodes());

        if (!fpi.findPath(ce.getNode(0), 5) && !fpi.findPath(ce.getNode(0))) {
          ce.reset();
        }
      }

      // look for current sources with no current path
      if (ce instanceof CurrentElm) {
        fpi = new Pathfinder(Pathfinder.INDUCT, ce, ce.getNode(1), this.Circuit.getElements(), this.Circuit.numNodes());
        if (!fpi.findPath(ce.getNode(0))) {
          this.Circuit.halt("No path for current source!", ce);
          return;
        }
      }

      // Look for voltage source loops:
      if ((Util.typeOf(ce, VoltageElm) && (ce.getPostCount() === 2)) || ce instanceof WireElm) {
        let pathfinder = new Pathfinder(Pathfinder.VOLTAGE, ce, ce.getNode(1), this.Circuit.getElements(), this.Circuit.numNodes());

        if (pathfinder.findPath(ce.getNode(0))) {
          this.Circuit.halt("Voltage source/wire loop with no resistance!", ce);
        }
      }
//          return

      // Look for shorted caps or caps with voltage but no resistance
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
  }

  optimize() {
    let col, rowInfo, rowNodeEq;
    let row = -1;
    while (row < (this.matrixSize-1)) {
      row += 1;

      let re = this.circuitRowInfo[row];
      if (re.lsChanges || re.dropRow || re.rsChanges) {
        // console.log("CONT: " + re.toString())
        continue;
      }

      let rsadd = 0;
      let qm = -1;
      let qp = -1;
      let lastVal = 0;

      // look for rows that can be removed
      for (col = 0, end = this.matrixSize, asc = 0 <= end; asc ? col < end : col > end; asc ? col++ : col--) {
        var asc, end;
        if (this.circuitRowInfo[col].type === RowInfo.ROW_CONST) {
          // Keep a running total of const values that have been removed already
          rsadd -= this.circuitRowInfo[col].value * this.circuitMatrix[row][col];
        } else if (this.circuitMatrix[row][col] === 0) {
        } else if (qp === -1) { // First col
          qp = col;  // First nonzero value is qp
          lastVal = this.circuitMatrix[row][col];
        } else if ((qm === -1) && (this.circuitMatrix[row][col] === -lastVal)) {
          qm = col;
        } else {
          break;
        }
      }

      if (col === this.matrixSize) {
        if (qp === -1) {
          this.Circuit.halt(`Matrix error qp (row with all zeros) (rsadd = ${rsadd})`, null);
          return;
        }

        let elt = this.circuitRowInfo[qp];

        // We found a row with only one nonzero entry, that value is constant
        if (qm === -1) {
          let k = 0;
          while ((elt.type === RowInfo.ROW_EQUAL) && (k < CircuitSolver.SIZE_LIMIT)) {
            // Follow the chain
            qp = elt.nodeEq;
            elt = this.circuitRowInfo[qp];
            ++k;
          }

          if (elt.type === RowInfo.ROW_EQUAL) {
            // break equal chains
            elt.type = RowInfo.ROW_NORMAL;

          } else if (elt.type !== RowInfo.ROW_NORMAL) {
          } else {
            elt.type = RowInfo.ROW_CONST;
            elt.value = (this.circuitRightSide[row] + rsadd) / lastVal;

            this.circuitRowInfo[row].dropRow = true;

            row = -1; // start over from scratch
          }

        // We found a row with only two nonzero entries, and one is the negative of the other -> the values are equal
        } else if ((this.circuitRightSide[row] + rsadd) === 0) {
          if (elt.type !== RowInfo.ROW_NORMAL) {
            let qq = qm;
            qm = qp;
            qp = qq;
            elt = this.circuitRowInfo[qp];

            if (elt.type !== RowInfo.ROW_NORMAL) {
              // We should follow the chain here, but this hardly ever happens so it's not worth worrying about
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

    // find size of new matrix:
    let newMatDim = 0;
    for (row = 0, end1 = this.matrixSize, asc1 = 0 <= end1; asc1 ? row < end1 : row > end1; asc1 ? row++ : row--) {
      var asc1, end1;
      rowInfo = this.circuitRowInfo[row];

      if (rowInfo.type === RowInfo.ROW_NORMAL) {
        rowInfo.mapCol = newMatDim++;

      } else {
        if (rowInfo.type === RowInfo.ROW_EQUAL) {
          // resolve chains of equality; 100 max steps to avoid loops
          for (let j = 0, end2 = CircuitSolver.SIZE_LIMIT, asc2 = 0 <= end2; asc2 ? j < end2 : j > end2; asc2 ? j++ : j--) {
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

    for (row = 0, end3 = this.matrixSize, asc3 = 0 <= end3; asc3 ? row < end3 : row > end3; asc3 ? row++ : row--) {
      var asc3, end3;
      rowInfo = this.circuitRowInfo[row];
      if (rowInfo.type === RowInfo.ROW_EQUAL) {
        rowNodeEq = this.circuitRowInfo[rowInfo.nodeEq];
        if (rowNodeEq.type === RowInfo.ROW_CONST) {
          // if something is equal to a const, it's a const
          rowInfo.type = rowNodeEq.type;
          rowInfo.value = rowNodeEq.value;
          rowInfo.mapCol = -1;
        } else {
          rowInfo.mapCol = rowNodeEq.mapCol;
        }
      }
    }

    // make the new, simplified matrix
    let newSize = newMatDim;
    let newMatx = Util.zeroArray2(newSize, newSize);
    let newRS = new Array(newSize);

    Util.zeroArray(newRS);

    let newIdx = 0;
    for (row = 0, end4 = this.matrixSize, asc4 = 0 <= end4; asc4 ? row < end4 : row > end4; asc4 ? row++ : row--) {
      var asc4, end4;
      let circuitRowInfo = this.circuitRowInfo[row];

      if (circuitRowInfo.dropRow) {
        circuitRowInfo.mapRow = -1;
      } else {
        newRS[newIdx] = this.circuitRightSide[row];

        circuitRowInfo.mapRow = newIdx;
        for (col = 0, end5 = this.matrixSize, asc5 = 0 <= end5; asc5 ? col < end5 : col > end5; asc5 ? col++ : col--) {
          var asc5, end5;
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
  }


  saveOriginalMatrixState() {
    let row;
    for (row = 0, end = this.matrixSize, asc = 0 <= end; asc ? row < end : row > end; asc ? row++ : row--) {
      var asc, end;
      this.origRightSide[row] = this.circuitRightSide[row];
    }

    if (this.circuitNonLinear) {
      return (() => {
        let result = [];
        for (row = 0, end1 = this.matrixSize, asc1 = 0 <= end1; asc1 ? row < end1 : row > end1; asc1 ? row++ : row--) {
          var asc1, end1;
          result.push(__range__(0, this.matrixSize, false).map((col) =>
            this.origMatrix[row][col] = this.circuitMatrix[row][col]));
        }
        return result;
      })();
    }
  }

  restoreOriginalMatrixState() {
    let row;
    for (row = 0, end = this.circuitMatrixSize, asc = 0 <= end; asc ? row < end : row > end; asc ? row++ : row--) {
      var asc, end;
      this.circuitRightSide[row] = this.origRightSide[row];
    }

    if (this.circuitNonLinear) {
      return (() => {
        let result = [];
        for (row = 0, end1 = this.circuitMatrixSize, asc1 = 0 <= end1; asc1 ? row < end1 : row > end1; asc1 ? row++ : row--) {
          var asc1, end1;
          result.push(__range__(0, this.circuitMatrixSize, false).map((col) =>
            this.circuitMatrix[row][col] = this.origMatrix[row][col]));
        }
        return result;
      })();
    }
  }

  getValueFromNode(idx) {
    let rowInfo = this.circuitRowInfo[idx];

    if (rowInfo.type === RowInfo.ROW_CONST) {
      return rowInfo.value;
    } else {
      return this.circuitRightSide[rowInfo.mapCol];
    }
  }

  updateComponent(nodeIdx, value) {
    if (isNaN(value)) {
      this.converged = false;
      return false;
    }

    if (nodeIdx < (this.Circuit.numNodes() - 1)) {
      let circuitNode = this.Circuit.nodeList[nodeIdx + 1];
      for (let circuitNodeLink of Array.from(circuitNode.links)) {
        circuitNodeLink.elm.setNodeVoltage(circuitNodeLink.num, value);
      }

    } else {
      let ji = nodeIdx - (this.Circuit.numNodes() - 1);
      this.Circuit.voltageSources[ji].setCurrent(ji, value);
    }

    return true;
  }


  /**
    luFactor: finds a solution to a factored matrix through LU (Lower-Upper) factorization

    Called once each frame for resistive circuits, otherwise called many times each frame

    returns a falsy value if the provided circuitMatrix can't be factored

    @param (input/output) circuitMatrix 2D matrix to be solved
    @param (input) matrixSize number or rows/columns in the matrix
    @param (output) pivotArray pivot index
  */
  luFactor(circuitMatrix, matrixSize, pivotArray) {
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
  }


  /*
    Step 2: `lu_solve`: (Called by lu_factor)
    finds a solution to a factored matrix through LU (Lower-Upper) factorization

    Called once each frame for resistive circuits, otherwise called many times each frame

    @param circuitMatrix matrix to be solved
    @param numRows dimension
    @param pivotVector pivot index
    @param circuitRightSide Right-side (dependent) matrix
  */
  luSolve(circuitMatrix, numRows, pivotVector, circuitRightSide) {
    // Find first nonzero element of circuitRightSide
    let j, row;
    let i = 0;
    while (i < numRows) {
      row = pivotVector[i];
      let swap = circuitRightSide[row];
      circuitRightSide[row] = circuitRightSide[i];
      circuitRightSide[i] = swap;
      if (swap !== 0) { break; }
      ++i;
    }

    let bi = i++;
    while (i < numRows) {
      row = pivotVector[i];
      let tot = circuitRightSide[row];
      circuitRightSide[row] = circuitRightSide[i];

      // Forward substitution by using the lower triangular matrix
      j = bi;
      while (j < i) {
        tot -= circuitMatrix[i][j] * circuitRightSide[j];
        ++j;
      }
      circuitRightSide[i] = tot;
      ++i;
    }

    i = numRows - 1;
    return (() => {
      let result = [];
      while (i >= 0) {
        let total = circuitRightSide[i];

        // back-substitution using the upper triangular matrix
        j = i + 1;
        while (j !== numRows) {
          total -= circuitMatrix[i][j] * circuitRightSide[j];
          ++j;
        }

        circuitRightSide[i] = total / circuitMatrix[i][i];

        result.push(i--);
      }
      return result;
    })();
  }

  dump() {
    let out = "";

    out += this.Circuit.Params.toString() + "\n";

    for (let rowInfo of Array.from(this.circuitRowInfo)) {
      out += rowInfo.toString() + "\n";
    }

    out += `\nCircuit permute: ${Util.printArray(this.circuitPermute)}`;

    return out + "\n";
  }

  dumpFrame() {
    let matrixRowCount = this.circuitRightSide.length;

    let out = "";

    let circuitMatrixDump = "";
    let circuitRightSideDump = "";

    for (let i = 0, end = matrixRowCount, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
      circuitRightSideDump += Util.tidyFloat(this.circuitRightSide[i]);
//      circuitMatrixDump += @tidyFloat(@circuitRightSide[i])

      circuitMatrixDump += "[";
      for (let j = 0, end1 = matrixRowCount, asc1 = 0 <= end1; asc1 ? j < end1 : j > end1; asc1 ? j++ : j--) {
        circuitMatrixDump += Util.tidyFloat(this.circuitMatrix[i][j]);

        if(j !== (matrixRowCount - 1)) {
          circuitMatrixDump += ", ";
        }
      }

      circuitMatrixDump += "]";

      if(i !== (matrixRowCount - 1)) {
        circuitRightSideDump += ", ";
        circuitMatrixDump += ", ";
      }
    }

    out += sprintf("%d %.7f %d %d\n", this.Circuit.iterations, this.Circuit.time, this.subIterations, matrixRowCount);
    out += circuitMatrixDump + "\n";
    out += circuitRightSideDump;

    return out;
  }
}
CircuitSolver.initClass();

module.exports = CircuitSolver;

function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}