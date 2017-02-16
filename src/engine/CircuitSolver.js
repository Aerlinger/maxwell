var MatrixStamper = require('./MatrixStamper.js');

var Pathfinder = require('./Pathfinder.js');
var CircuitNode = require('./CircuitNode.js');
var CircuitNodeLink = require('./CircuitNodeLink.js');
var RowInfo = require('./RowInfo.js');
var Setting = require('../Settings.js');
var Util = require('../util/Util.js');

var SimulationFrame = require('../circuit/SimulationFrame.js');

var GroundElm = require('../components/GroundElm.js');
var RailElm = require('../components/RailElm.js');
var VoltageElm = require('../components/VoltageElm.js');
var WireElm = require('../components/WireElm.js');
var CapacitorElm = require('../components/CapacitorElm.js');
var InductorElm = require('../components/InductorElm.js');
var CurrentElm = require('../components/CurrentElm.js');

class CircuitSolver {
  static initClass() {
    this.SIZE_LIMIT = 100;
    this.MAXIMUM_SUBITERATIONS = 5000;
  }

  constructor(Circuit) {
    this.Circuit = Circuit;
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

    this.simulationFrames = [];
  }

  reconstruct() {
    if (!this.analyzeFlag || (this.Circuit.numElements() === 0))
      return;

    this.Circuit.clearErrors();
    this.Circuit.resetNodes();

    this.discoverGroundReference();
    this.constructCircuitGraph();
    this.constructMatrixEquations();
    this.checkConnectivity();
    this.findInvalidPaths();
    this.optimize();

    // if a matrix is linear, we can do the lu_factor here instead of needing to do it every frame
    if (this.circuitLinear())
      return this.luFactor(this.circuitMatrix, this.circuitPermute);
  }

  solveCircuit() {
    if ((this.circuitMatrix == null) || (this.Circuit.numElements() === 0)) {
      this.circuitMatrix = null;
      //console.error("Called solve circuit when circuit Matrix not initialized")
      return;
    }

    var lit = this.lastIterTime;
    var stepRate = Math.floor(160 * this.getIterCount());
    var tm = (new Date()).getTime();

    if (1000 >= (stepRate * (tm - this.lastIterTime))) {
      return;
    }

    var iter = 1;
    while (true) {
      var subiter;
      ++this.steps;

      for (var circuitElm of this.Circuit.getElements())
        circuitElm.startIteration();

      // Sub iteration
      // TODO: Quantify convergence rate for diagnostic purposes
      for (subiter = 0; subiter < CircuitSolver.MAXIMUM_SUBITERATIONS; ++subiter) {
        this.converged = true;
        this.subIterations = subiter;

        this.restoreOriginalMatrixState();

        for (circuitElm of this.Circuit.getElements())
          circuitElm.doStep(this.Stamper);

        if (this.circuitNonLinear) {
          if (this.converged && (subiter > 0))
            break;

          this.luFactor(this.circuitMatrix, this.circuitPermute);
        }

        this.luSolve(this.circuitMatrix, this.circuitMatrixSize, this.circuitPermute, this.circuitRightSide);

        // backsolve and update each component current/voltage...
        for (var j = 0; j < this.circuitMatrixFullSize; ++j) {
          var res = this.getValueFromNode(j);
          if (!this.updateComponent(j, res))
            break;
        }

        if (this.circuitLinear())
          break;
      }

      if (subiter >= CircuitSolver.MAXIMUM_SUBITERATIONS) {
        this.halt(`Convergence failed: ${subiter}`, null);
        break;
      }

      this.Circuit.time += this.Circuit.timeStep();

      this.updateScopes(iter);

      tm = (new Date()).getTime();
      lit = tm;

      if ((tm - this.lastFrameTime) > 500)
        break;

      if ((iter * 1000) >= (stepRate * (tm - this.lastIterTime)))
        break;

      ++iter;
    }

    this.frames++;
    this.Circuit.iterations++;

    this.simulationFrames.push(new SimulationFrame(this.Circuit));

    this._updateTimings(lit);
  }

  updateScopes(iter) {
    if (((iter + 20) % 21) === 0) {
      for (var scope of this.Circuit.scopes) {
        if (scope.circuitElm) {
          scope.sampleVoltage(this.Circuit.time, scope.circuitElm.getVoltageDiff());
          scope.sampleCurrent(this.Circuit.time, scope.circuitElm.getCurrent());
        }
      }
    }
  }

  _updateTimings(lastIterationTime) {
    this.lastIterTime = lastIterationTime;

    var sysTime = (new Date()).getTime();

    if (this.lastTime !== 0) {
      var inc = Math.floor(sysTime - this.lastTime);
      var currentSpeed = Math.exp((this.Circuit.currentSpeed() / 3.5) - 14.2);

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

  circuitLinear() {
    return !this.circuitNonLinear;
  }

  getStamper() {
    return this.Stamper;
  }

  getIterCount() {
    var sim_speed = this.Circuit.simSpeed();
    return 0.1 * Math.exp((sim_speed - 61.0) / 24.0);
  }

  discoverGroundReference() {
    var gotGround = false;
    var gotRail = false;
    var volt = null;

    // Check if this circuit has a voltage rail and if it has a voltage element.
    for (var ce of this.Circuit.getElements()) {
      if (ce instanceof GroundElm) {
        gotGround = true;
        break;
      }
      if (Util.typeOf(ce, RailElm))
        gotRail = true;

      if ((volt == null) && Util.typeOf(ce, VoltageElm))
        volt = ce;
    }

    var circuitNode = new CircuitNode(this);
    circuitNode.x = circuitNode.y = -1;

    // If no ground and no rails then voltage element's first terminal is referenced to ground:
    if (!gotGround && !gotRail && (volt != null)) {
      var pt = volt.getPost(0);

      circuitNode.x = pt.x;
      circuitNode.y = pt.y;
    }

    this.Circuit.addCircuitNode(circuitNode);
  }

  buildComponentNodes() {
    var internalNodeCount, internalVSCount, postCount;
    var internalLink, internalNode;
    var voltageSourceCount = 0;

    for (var i = 0; i < this.Circuit.getElements().length; ++i) {

      var circuitElm = this.Circuit.getElmByIdx(i);
      internalNodeCount = circuitElm.numInternalNodes();
      internalVSCount = circuitElm.numVoltageSources();
      postCount = circuitElm.numPosts();

      // allocate a node for each post and match postCount to nodes
      var result = [];
      for (var postIdx = 0; postIdx < postCount; ++postIdx) {
        var circuitNode;
        var item;
        var postPt = circuitElm.getPost(postIdx);

        var nodeIdx;
        for (nodeIdx = 0; nodeIdx < this.Circuit.numNodes(); nodeIdx++) {
          circuitNode = this.Circuit.getNode(nodeIdx);
          if (Util.overlappingPoints(postPt, circuitNode))
            break;
        }

        var nodeLink = new CircuitNodeLink();
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

          if (nodeIdx === 0)
            item = circuitElm.setNodeVoltage(postIdx, 0);

        }
        result.push(item);
      }

      for (var internalNodeIdx = 0; i < internalNodeCount; ++i) {
        internalLink = new CircuitNodeLink();
        internalLink.num = internalNodeIdx + postCount;
        internalLink.elm = circuitElm;

        internalNode = new CircuitNode(this, -1, -1, true);
        internalNode.links.push(internalLink);
        circuitElm.setNode(internalLink.num, this.Circuit.numNodes());

        this.Circuit.addCircuitNode(internalNode);
      }

      voltageSourceCount += internalVSCount
    }
  }


// Circuit nodal analysis
  constructCircuitGraph() {
    // Allocate nodes and voltage sources
    this.buildComponentNodes();
    this.Circuit.voltageSources = new Array(voltageSourceCount);

    var voltageSourceCount = 0;
    this.circuitNonLinear = false;

    // Determine if circuit is nonlinear
    for (var circuitElement of this.Circuit.getElements()) {
      if (circuitElement.nonLinear())
        this.circuitNonLinear = true;

      for (var voltSourceIdx = 0; voltSourceIdx < circuitElement.numVoltageSources(); ++voltSourceIdx) {
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

    for (var rowIdx = 0; rowIdx < this.matrixSize; ++rowIdx)
      this.circuitRowInfo[rowIdx] = new RowInfo();

    this.circuitNeedsMap = false;

    // Construct Matrix Equations
    this.Circuit.getElements().map((circuitElm) =>
        circuitElm.stamp(this.Stamper));
  }

  checkConnectivity() {// Determine nodes that are unconnected
    var closure = new Array(this.Circuit.numNodes());
    closure[0] = true;
    var changed = true;

    while (changed) {
      changed = false;
      for (var circuitElm of this.Circuit.getElements()) {

        // Loop through all ce's nodes to see if they are connected to other nodes not in closure
        for (var postIdx = 0; postIdx < circuitElm.numPosts(); ++postIdx) {
          if (!closure[circuitElm.getNode(postIdx)]) {
            if (circuitElm.hasGroundConnection(postIdx)) {
              changed = true;
              closure[circuitElm.getNode(postIdx)] = true;
            }
            continue;
          }

          for (var siblingPostIdx = 0; siblingPostIdx < circuitElm.numPosts(); siblingPostIdx++) {
            if (postIdx === siblingPostIdx)
              continue;

            var siblingNode = circuitElm.getNode(siblingPostIdx);
            if (circuitElm.getConnection(postIdx, siblingPostIdx) && !closure[siblingNode]) {
              closure[siblingNode] = true;
              changed = true;
            }
          }
        }
      }

      if (changed)
        continue;

      // connect unconnected nodes
      for (var nodeIdx = 0; nodeIdx < this.Circuit.numNodes(); ++nodeIdx) {
        if (!closure[nodeIdx] && !this.Circuit.nodeList[nodeIdx].intern) {
          console.warn(`Node ${nodeIdx} unconnected! -> ${this.Circuit.nodeList[nodeIdx].toString()}`);
          this.Stamper.stampResistor(0, nodeIdx, 1e8);
          closure[nodeIdx] = true;
          changed = true;

          break;
        }
      }
    }
  }

  findInvalidPaths() {
    for (var ce of this.Circuit.getElements()) {
      var fpi;
      if (ce instanceof InductorElm) {
        fpi = new Pathfinder(Pathfinder.INDUCT, ce, ce.getNode(1), this.Circuit.getElements(), this.Circuit.numNodes());

        if (!fpi.findPath(ce.getNode(0), 5) && !fpi.findPath(ce.getNode(0)))
          ce.reset();
      }

      // look for current sources with no current path
      if (ce instanceof CurrentElm) {
        fpi = new Pathfinder(Pathfinder.INDUCT, ce, ce.getNode(1), this.Circuit.getElements(), this.Circuit.numNodes());
        if (!fpi.findPath(ce.getNode(0)))
          console.warn("No path for current source!", ce);
      }

      // Look for voltage source loops:
      if ((Util.typeOf(ce, VoltageElm) && (ce.numPosts() === 2)) || ce instanceof WireElm) {
        var pathfinder = new Pathfinder(Pathfinder.VOLTAGE, ce, ce.getNode(1), this.Circuit.getElements(), this.Circuit.numNodes());

        if (pathfinder.findPath(ce.getNode(0)))
          this.Circuit.halt("Voltage source/wire loop with no resistance!", ce);
      }

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
    var col, rowInfo, rowNodeEq;
    var row = -1;
    while (row < (this.matrixSize - 1)) {
      row += 1;

      var re = this.circuitRowInfo[row];
      if (re.lsChanges || re.dropRow || re.rsChanges)
        continue;

      var rsadd = 0;
      var qm = -1;
      var qp = -1;
      var lastVal = 0;

      // look for rows that can be removed
      for (col = 0; col < this.matrixSize; ++col) {
        if (this.circuitRowInfo[col].type === RowInfo.ROW_CONST) {
          // Keep a running total of var values that have been removed already
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

        var elt = this.circuitRowInfo[qp];

        // We found a row with only one nonzero entry, that value is constant
        if (qm === -1) {
          var k = 0;
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
            var qq = qm;
            qm = qp;
            qp = qq;
            elt = this.circuitRowInfo[qp];

            // We should follow the chain here, but this hardly ever happens so it's not worth worrying about
            if (elt.type !== RowInfo.ROW_NORMAL)
              continue;
          }

          elt.type = RowInfo.ROW_EQUAL;
          elt.nodeEq = qm;
          this.circuitRowInfo[row].dropRow = true;
        }
      }
    }

    // Find size of new matrix:
    var newMatDim = 0;
    for (var row = 0; row < this.matrixSize; ++row) {
      rowInfo = this.circuitRowInfo[row];

      if (rowInfo.type === RowInfo.ROW_NORMAL) {
        rowInfo.mapCol = newMatDim++;

      } else {
        if (rowInfo.type === RowInfo.ROW_EQUAL) {
          // resolve chains of equality; 100 max steps to avoid loops
          for (var j = 0; j < CircuitSolver.SIZE_LIMIT; ++j) {
            rowNodeEq = this.circuitRowInfo[rowInfo.nodeEq];

            if ((rowNodeEq.type !== RowInfo.ROW_EQUAL) || (row === rowNodeEq.nodeEq))
              break;

            rowInfo.nodeEq = rowNodeEq.nodeEq;
          }
        }

        if (rowInfo.type === RowInfo.ROW_CONST)
          rowInfo.mapCol = -1;
      }
    }

    for (var row = 0; row < this.matrixSize; ++row) {
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
    var newSize = newMatDim;
    var newMatx = Util.zeroArray2(newSize, newSize);
    var newRS = new Array(newSize);

    Util.zeroArray(newRS);

    var newIdx = 0;
    for (var row = 0; row < this.matrixSize; ++row) {
      var circuitRowInfo = this.circuitRowInfo[row];

      if (circuitRowInfo.dropRow) {
        circuitRowInfo.mapRow = -1;
      } else {
        newRS[newIdx] = this.circuitRightSide[row];

        circuitRowInfo.mapRow = newIdx;
        for (col = 0; col < this.matrixSize; ++col) {
          rowInfo = this.circuitRowInfo[col];

          if (rowInfo.type === RowInfo.ROW_CONST)
            newRS[newIdx] -= rowInfo.value * this.circuitMatrix[row][col];
          else
            newMatx[newIdx][rowInfo.mapCol] += this.circuitMatrix[row][col];
        }

        newIdx++;
      }
    }

    this.circuitMatrix = newMatx;
    this.circuitRightSide = newRS;
    this.matrixSize = this.circuitMatrixSize = newSize;

    this.saveOriginalMatrixState();

    this.circuitNeedsMap = true;
    this.analyzeFlag = false;
  }

  saveOriginalMatrixState() {
    for (var row = 0; row < this.matrixSize; ++row)
      this.origRightSide[row] = this.circuitRightSide[row];

    if (this.circuitNonLinear) {
      for (var row = 0; row < this.matrixSize; ++row) {
        for (var col = 0; col < this.matrixSize; ++col) {
          this.origMatrix[row][col] = this.circuitMatrix[row][col];
        }
      }
    }
  }

  restoreOriginalMatrixState() {
    for (var row = 0; row < this.circuitMatrixSize; ++row)
      this.circuitRightSide[row] = this.origRightSide[row];

    if (this.circuitNonLinear) {
      for (var row = 0; row < this.circuitMatrixSize; ++row)
        for (var col = 0; col < this.circuitMatrixSize; ++col)
          this.circuitMatrix[row][col] = this.origMatrix[row][col];
    }
  }

  getValueFromNode(idx) {
    var rowInfo = this.circuitRowInfo[idx];

    if (rowInfo.type === RowInfo.ROW_CONST)
      return rowInfo.value;
    else
      return this.circuitRightSide[rowInfo.mapCol];
  }

  updateComponent(nodeIdx, value) {
    if (isNaN(value)) {
      this.converged = false;
      return false;
    }

    if (nodeIdx < (this.Circuit.numNodes() - 1)) {
      var circuitNode = this.Circuit.nodeList[nodeIdx + 1];

      for (var circuitNodeLink of circuitNode.links)
        circuitNodeLink.elm.setNodeVoltage(circuitNodeLink.num, value);

    } else {
      var ji = nodeIdx - (this.Circuit.numNodes() - 1);
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
  luFactor(circuitMatrix, pivotArray) {
    var i, j, k, largest, largestRow, matrix_ij, mult, x;

    var matrixSize = circuitMatrix.length;

    var scaleFactors = new Array(matrixSize);

    // i = 0;
    i = matrixSize;
    while (i--) {
      largest = 0;

      j = matrixSize;
      while (j--) {
        x = Math.abs(circuitMatrix[i][j]);
        if (x > largest)
          largest = x;
      }
      scaleFactors[i] = 1.0 / largest;
    }

    j = 0;
    while (j < matrixSize) {
      i = 0;
      while (i < j) {
        matrix_ij = circuitMatrix[i][j];

        k = i;
        while (k--)
          matrix_ij -= circuitMatrix[i][k] * circuitMatrix[k][j];

        circuitMatrix[i][j] = matrix_ij;
        ++i;
      }

      largest = 0;
      largestRow = -1;

      i = j;
      while (i < matrixSize) {
        matrix_ij = circuitMatrix[i][j];

        k = j;
        while (k--)
          matrix_ij -= circuitMatrix[i][k] * circuitMatrix[k][j];

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

        scaleFactors[largestRow] = scaleFactors[j];
      }

      pivotArray[j] = largestRow;
      if (circuitMatrix[j][j] === 0)
        circuitMatrix[j][j] = 1e-18;

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
    var j, row;
    var i = 0;
    while (i < numRows) {
      row = pivotVector[i];
      var swap = circuitRightSide[row];
      circuitRightSide[row] = circuitRightSide[i];
      circuitRightSide[i] = swap;
      if (swap !== 0)
        break;

      ++i;
    }

    var bi = i++;
    while (i < numRows) {
      row = pivotVector[i];
      var tot = circuitRightSide[row];
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
      var total = circuitRightSide[i];

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
    var out = "";

    out += this.Circuit.Params.toString() + "\n";

    for (var rowInfo of this.circuitRowInfo) {
      out += rowInfo.toString() + "\n";
    }

    out += `\nCircuit permute: ${Util.printArray(this.circuitPermute)}`;

    return out + "\n";
  }
}

CircuitSolver.initClass();

module.exports = CircuitSolver;
