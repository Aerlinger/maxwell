const MatrixStamper = require('./MatrixStamper.js');

const Pathfinder = require('./Pathfinder.js');
const CircuitNode = require('./CircuitNode.js');
const CircuitNodeLink = require('./CircuitNodeLink.js');
const RowInfo = require('./RowInfo.js');
const Setting = require('../Settings.js');
const Util = require('../util/Util.js');

const SimulationFrame = require('../circuit/SimulationFrame.js');

const GroundElm = require('../components/GroundElm.js');
const RailElm = require('../components/RailElm.js');
const VoltageElm = require('../components/VoltageElm.js');
const WireElm = require('../components/WireElm.js');
const CapacitorElm = require('../components/CapacitorElm.js');
const InductorElm = require('../components/InductorElm.js');
const CurrentElm = require('../components/CurrentElm.js');

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
    this.iterations = 0;

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

    // if a matrix is linear, we can do the lu_factor here instead of needing to do it every frame
    if (this.circuitLinear()) {
      return this.luFactor(this.circuitMatrix, this.circuitMatrixSize, this.circuitPermute);
    }
  }

  solveCircuit() {
    if ((this.circuitMatrix == null) || (this.Circuit.numElements() === 0)) {
      this.circuitMatrix = null;
      //console.error("Called solve circuit when circuit Matrix not initialized")
      return;
    }

    this.sysTime = (new Date()).getTime();

    const stepRate = Math.floor(160 * this.getIterCount());

    let tm = (new Date()).getTime();
    let lit = this.lastIterTime;

    if (1000 >= (stepRate * (tm - this.lastIterTime))) {
      return;
    }

    let iter = 1;
    while (true) {
      var subiter;
      ++this.steps;

      for (var circuitElm of this.Circuit.getElements()) {
        circuitElm.startIteration();
      }

      // Sub iteration
      // TODO: Quantify convergence rate for diagnostic purposes
      for (subiter = 0; subiter < CircuitSolver.MAXIMUM_SUBITERATIONS; ++subiter) {
        this.converged = true;
        this.subIterations = subiter;

        this.restoreOriginalMatrixState();

        for (circuitElm of this.Circuit.getElements()) {
          circuitElm.doStep(this.Stamper);
        }

        if (this.circuitNonLinear) {
          if (this.converged && (subiter > 0)) {
            break;
          }
          this.luFactor(this.circuitMatrix, this.circuitMatrixSize, this.circuitPermute);
        }

        this.luSolve(this.circuitMatrix, this.circuitMatrixSize, this.circuitPermute, this.circuitRightSide);

        // backsolve and update each component current/voltage...
        for (let j = 0; j < this.circuitMatrixFullSize; ++j) {
          const res = this.getValueFromNode(j);
          if (!this.updateComponent(j, res)) {
            break;
          }
        }

        if (this.circuitLinear()) {
          break;
        }
      }

      if (subiter >= CircuitSolver.MAXIMUM_SUBITERATIONS) {
        this.halt(`Convergence failed: ${subiter}`, null);
        break;
      }

      this.Circuit.time += this.Circuit.timeStep();

      if (((iter + 20) % 21) === 0) {
        for (let scope of this.Circuit.scopes) {
          if (scope.circuitElm) {
            scope.sampleVoltage(this.Circuit.time, scope.circuitElm.getVoltageDiff());
            scope.sampleCurrent(this.Circuit.time, scope.circuitElm.getCurrent());
          }
        }
      }

      tm = (new Date()).getTime();
      lit = tm;

      if ((tm - this.lastFrameTime) > 2000) {
//        console.log("force break", iter)
        break;
      }

      if ((iter * 1000) >= (stepRate * (tm - this.lastIterTime))) {
//        console.log("Break", iter)
        break;
      }

      ++iter;
    }

    this.frames++;
    this.Circuit.iterations++;

    this.simulationFrames.push(new SimulationFrame(this.Circuit));

    this._updateTimings(lit);
  }

  circuitLinear() {
    return !this.circuitNonLinear;
  }

  _updateTimings(lastIterationTime) {
    this.lastIterTime = lastIterationTime;

    const sysTime = (new Date()).getTime();

    if (this.lastTime !== 0) {
      const inc = Math.floor(sysTime - this.lastTime);
      const currentSpeed = Math.exp((this.Circuit.currentSpeed() / 3.5) - 14.2);

      this.Circuit.Params.setCurrentMult(1.7 * inc * currentSpeed);
    }

    if ((sysTime - this.secTime) >= 1000) {
      // console.log("Reset!")
      this.frames = 0;
      this.steps = 0;
      this.secTime = sysTime;
    }

    this.lastTime = sysTime;
    this.lastFrameTime = this.lastTime;
    return this.iterations++;
  }


  getStamper() {
    return this.Stamper;
  }

  getIterCount() {
    const sim_speed = this.Circuit.simSpeed();
    return 0.1 * Math.exp((sim_speed - 61.0) / 24.0);
  }

  discoverGroundReference() {
    let gotGround = false;
    let gotRail = false;
    let volt = null;

    // Check if this circuit has a voltage rail and if it has a voltage element.
    for (let ce of this.Circuit.getElements()) {
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

    const circuitNode = new CircuitNode(this);
    circuitNode.x = circuitNode.y = -1;

    // If no ground and no rails then voltage element's first terminal is referenced to ground:
    if (!gotGround && !gotRail && (volt != null)) {
      const pt = volt.getPost(0);

      circuitNode.x = pt.x;
      circuitNode.y = pt.y;
    }

    return this.Circuit.addCircuitNode(circuitNode);
  }

  buildComponentNodes() {
    let internalNodeCount, internalVSCount, postCount;
    let internalLink, internalNode;
    let voltageSourceCount = 0;

    return this.Circuit.getElements().map((circuitElm) =>
        (internalNodeCount = circuitElm.numInternalNodes(),
            internalVSCount = circuitElm.numVoltageSources(),
            postCount = circuitElm.numPosts(),

            // allocate a node for each post and match postCount to nodes
            (() => {
              const result = [];
              for (let postIdx = 0, end = postCount, asc = 0 <= end; asc ? postIdx < end : postIdx > end; asc ? postIdx++ : postIdx--) {
                var circuitNode, nodeIdx;
                let item;
                const postPt = circuitElm.getPost(postIdx);

                for (nodeIdx = 0, end1 = this.Circuit.numNodes(), asc1 = 0 <= end1; asc1 ? nodeIdx < end1 : nodeIdx > end1; asc1 ? nodeIdx++ : nodeIdx--) {
                  var asc1, end1;
                  circuitNode = this.Circuit.getNode(nodeIdx);
                  if (Util.overlappingPoints(postPt, circuitNode)) {
                    break;
                  }
                }

                const nodeLink = new CircuitNodeLink();
                nodeLink.num = postIdx;
                nodeLink.elm = circuitElm;

                if (nodeIdx === this.Circuit.numNodes()) {
                  circuitNode = new CircuitNode(this, postPt.x, postPt.y);
                  circuitNode.links.push(nodeLink);

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


  // Circuit nodal analysis
  constructCircuitGraph() {
    // Allocate nodes and voltage sources
    this.buildComponentNodes();

    this.Circuit.voltageSources = new Array(voltageSourceCount);

    var voltageSourceCount = 0;
    this.circuitNonLinear = false;

    // Determine if circuit is nonlinear
    for (let circuitElement of this.Circuit.getElements()) {
      if (circuitElement.nonLinear()) {
        this.circuitNonLinear = true;
      }

      for (let voltSourceIdx = 0; voltSourceIdx < circuitElement.numVoltageSources(); ++voltSourceIdx) {
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

    for (let rowIdx = 0; rowIdx < this.matrixSize; ++rowIdx) {
      this.circuitRowInfo[rowIdx] = new RowInfo();
    }

    this.circuitNeedsMap = false;

    // Construct Matrix Equations
    this.Circuit.getElements().map((circuitElm) =>
        circuitElm.stamp(this.Stamper));
  }

  checkConnectivity() {// Determine nodes that are unconnected
    const closure = new Array(this.Circuit.numNodes());
    closure[0] = true;
    let changed = true;

    return (() => {
      const result = [];
      while (changed) {
        changed = false;
        for (let circuitElm of this.Circuit.getElements()) {

          // Loop through all ce's nodes to see if they are connected to other nodes not in closure
          for (let postIdx = 0; postIdx < circuitElm.numPosts(); ++postIdx) {
            if (!closure[circuitElm.getNode(postIdx)]) {
              if (circuitElm.hasGroundConnection(postIdx)) {
                changed = true;
                closure[circuitElm.getNode(postIdx)] = true;
              }
              continue;
            }

            for (let siblingPostIdx = 0, end1 = circuitElm.numPosts(), asc1 = 0 <= end1; asc1 ? siblingPostIdx < end1 : siblingPostIdx > end1; asc1 ? siblingPostIdx++ : siblingPostIdx--) {
              if (postIdx === siblingPostIdx) {
                continue;
              }

              const siblingNode = circuitElm.getNode(siblingPostIdx);
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

        // connect unconnected nodes
        result.push((() => {
          const result1 = [];
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
    for (let ce of this.Circuit.getElements()) {
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
          console.warn("No path for current source!", ce);
        }
      }
      //return

      // Look for voltage source loops:
      if ((Util.typeOf(ce, VoltageElm) && (ce.numPosts() === 2)) || ce instanceof WireElm) {
        const pathfinder = new Pathfinder(Pathfinder.VOLTAGE, ce, ce.getNode(1), this.Circuit.getElements(), this.Circuit.numNodes());

        if (pathfinder.findPath(ce.getNode(0))) {
          this.Circuit.halt("Voltage source/wire loop with no resistance!", ce);
        }
      }
      // return

      // Look for shorted caps or caps with voltage but no resistance
      if (ce instanceof CapacitorElm) {
        fpi = new Pathfinder(Pathfinder.SHORT, ce, ce.getNode(1), this.Circuit.getElements(), this.Circuit.numNodes());
        if (fpi.findPath(ce.getNode(0))) {
          ce.reset();
        } else {
          fpi = new Pathfinder(Pathfinder.CAP_V, ce, ce.getNode(1), this.Circuit.getElements(), this.Circuit.numNodes());
          if (fpi.findPath(ce.getNode(0))) {
            console.warn("Capacitor loop with no resistance!", ce);
            return;
          }
        }
      }
    }
  }


  /*
   Apply Sparse Tableau Analysis to reduce dimensionality of circuit equations.
   */
  optimize() {
    let col, rowInfo, rowNodeEq;
    let row = -1;
    while (row < (this.matrixSize - 1)) {
      row += 1;

      const re = this.circuitRowInfo[row];
      if (re.lsChanges || re.dropRow || re.rsChanges) {
        continue;
      }

      let rsadd = 0;
      let qm = -1;
      let qp = -1;
      let lastVal = 0;

      // look for rows that can be removed
      for (col = 0; col < this.matrixSize; ++col) {
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
            const qq = qm;
            qm = qp;
            qp = qq;
            elt = this.circuitRowInfo[qp];

            if (elt.type !== RowInfo.ROW_NORMAL) {
              // We should follow the chain here, but this hardly ever happens so it's not worth worrying about
              //console.warn("elt.type != RowInfo.ROW_NORMAL", elt)
              continue;
            }
          }

          elt.type = RowInfo.ROW_EQUAL;
          elt.nodeEq = qm;
          this.circuitRowInfo[row].dropRow = true;
        }
      }
    }

    // END WHILE row < @matrixSize-1

    // Find size of new matrix:
    let newMatDim = 0;
    for (let row = 0; row < this.matrixSize; ++row) {
      rowInfo = this.circuitRowInfo[row];

      if (rowInfo.type === RowInfo.ROW_NORMAL) {
        rowInfo.mapCol = newMatDim++;

      } else {
        if (rowInfo.type === RowInfo.ROW_EQUAL) {
          // resolve chains of equality; 100 max steps to avoid loops
          for (let j = 0; j < CircuitSolver.SIZE_LIMIT; ++j) {
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

    for (let row = 0; row < this.matrixSize; ++row) {
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
    const newSize = newMatDim;
    const newMatx = Util.zeroArray2(newSize, newSize);
    const newRS = new Array(newSize);

    Util.zeroArray(newRS);

    let newIdx = 0;
    for (let row = 0; row < this.matrixSize; ++row) {
      const circuitRowInfo = this.circuitRowInfo[row];

      if (circuitRowInfo.dropRow) {
        circuitRowInfo.mapRow = -1;
      } else {
        newRS[newIdx] = this.circuitRightSide[row];

        circuitRowInfo.mapRow = newIdx;
        for (col = 0; col < this.matrixSize; ++col) {
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
    for (let row = 0; row < this.matrixSize; ++row)
      this.origRightSide[row] = this.circuitRightSide[row];

    if (this.circuitNonLinear) {
      for (let row = 0; row < this.matrixSize; ++row) {
        for (let col = 0; col < this.matrixSize; ++col) {
          this.origMatrix[row][col] = this.circuitMatrix[row][col];
        }
      }
    }
  }

  restoreOriginalMatrixState() {
    for (let row = 0; row < this.circuitMatrixSize; ++row)
      this.circuitRightSide[row] = this.origRightSide[row];

    if (this.circuitNonLinear) {
      for (let row = 0; row < this.circuitMatrixSize; ++row)
        for (let col = 0; col < this.circuitMatrixSize; ++col)
          this.circuitMatrix[row][col] = this.origMatrix[row][col];
    }
  }

  getValueFromNode(idx) {
    const rowInfo = this.circuitRowInfo[idx];

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
      const circuitNode = this.Circuit.nodeList[nodeIdx + 1];
      for (let circuitNodeLink of circuitNode.links) {
        circuitNodeLink.elm.setNodeVoltage(circuitNodeLink.num, value);
      }

    } else {
      const ji = nodeIdx - (this.Circuit.numNodes() - 1);
      this.Circuit.voltageSources[ji].setCurrent(ji, value);
    }

    return true;
  }

  /*
   luFactor: finds a solution to a factored matrix through LU (Lower-Upper) factorization

   Called once each frame for resistive circuits, otherwise called many times each frame

   returns a falsy value if the provided circuitMatrix can't be factored

   @param (input/output) circuitMatrix 2D matrix to be solved
   @param (input) matrixSize number or rows/columns in the matrix
   @param (output) pivotArray pivot index
   */
  luFactor(circuitMatrix, matrixSize, pivotArray) {
// Divide each row by largest element in that row and remember scale factors
    let j, largest, x;
    let i = 0;
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

      // Check for singular matrix:
      //if largest == 0
      //  console.error("Singular matrix (#{i}, #{j}) -> #{largest}")

      this.scaleFactors[i] = 1.0 / largest;
      ++i;
    }

    // Crout's method: Loop through columns first
    j = 0;
    while (j < matrixSize) {

// Calculate upper trangular elements for this column:
      var k, matrix_ij;
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

      // Calculate lower triangular elements for this column
      largest = 0;
      let largestRow = -1;
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

      // Pivot
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

      // keep track of row interchanges
      pivotArray[j] = largestRow;

      // avoid zeros
      if (circuitMatrix[j][j] === 0) {
        circuitMatrix[j][j] = 1e-18;
      }
      if (j !== (matrixSize - 1)) {
        const mult = 1 / circuitMatrix[j][j];
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
      const swap = circuitRightSide[row];
      circuitRightSide[row] = circuitRightSide[i];
      circuitRightSide[i] = swap;
      if (swap !== 0) {
        break;
      }
      ++i;
    }

    const bi = i++;
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

    while (i >= 0) {
      let total = circuitRightSide[i];

      // back-substitution using the upper triangular matrix
      j = i + 1;
      while (j !== numRows) {
        total -= circuitMatrix[i][j] * circuitRightSide[j];
        ++j;
      }

      circuitRightSide[i] = total / circuitMatrix[i][i];

      i--;
    }
  }

  dump() {
    let out = "";

    out += this.Circuit.Params.toString() + "\n";

    for (let rowInfo of this.circuitRowInfo) {
      out += rowInfo.toString() + "\n";
    }

    out += `\nCircuit permute: ${Util.printArray(this.circuitPermute)}`;

    return out + "\n";
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