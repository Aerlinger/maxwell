//###################################################################################################################

// Circuit:
//     Top-level class for defining a Circuit. An array of components, and nodes are managed by a central
//     solver that updates and recalculates the conductance matrix every frame.
//
// @author Anthony Erlinger
// @date 2011-2013
//
// Uses the Observer Design Pattern:
//   Observes: <none>
//   Observed By: Solver, Render
//
//
// Event Message Passing interface:
//   ON_UPDATE
//   ON_PAUSE
//   ON_RESUME
//
//   ON_ADD_COMPONENT
//   ON_REMOVE_COMPONENT
//
//###################################################################################################################

let Oscilloscope = require('../scope/oscilloscope.js');
let Logger = require('../io/logger.js');
let SimulationParams = require('../core/simulationParams.js');
let SimulationFrame = require('./simulationFrame.js');
let CircuitSolver = require('../engine/circuitSolver.js');
let Observer = require('../util/observer.js');
let Rectangle = require('../geom/rectangle.js');
let Util = require('../util/util.js');
let environment = require("../environment.js");

fs = require('fs')


class Circuit extends Observer {
  static initClass() {
    this.components = [
  // Working
      "WireElm",
      "ResistorElm",
      "GroundElm",
      "InductorElm",
      "CapacitorElm",
      "VoltageElm",
      "DiodeElm",
      "SwitchElm",
      "SparkGapElm",
      "OpAmpElm",
      "MosfetElm",
  
  // Testing
      "RailElm",
      "VarRailElm",
      "ZenerElm",
      "CurrentElm",
      "TransistorElm",
  
  // In progress:
      "Switch2Elm",  // Needs interaction
      "TextElm",
      "ProbeElm",
      "OutputElm"
    ];
  
    // Messages Dispatched to listeners:
    //###################################################################################################################
  
    this.ON_START_UPDATE = "ON_START_UPDATE";
    this.ON_COMPLETE_UPDATE = "ON_END_UPDATE";
  
    this.ON_RESET = "ON_RESET";
  
    this.ON_SOLDER = "ON_SOLDER";
    this.ON_DESOLDER = "ON_DESOLDER";
  
    this.ON_ADD_COMPONENT = "ON_ADD_COMPONENT";
    this.ON_REMOVE_COMPONENT = "ON_MOVE_COMPONENT";
    this.ON_MOVE_COMPONENT = "ON_MOVE_COMPONENT";
  
    this.ON_ERROR = "ON_ERROR";
    this.ON_WARNING = "ON_WARNING";
  }


  constructor(name){
    super()

    if (name == null) { name = "untitled"; }
    this.name = name;
    this.Params = new SimulationParams();

    this.flags = 0;

    this.clearAndReset();
  }

  write(buffer) {}
//    unless environment.isBrowser
//      @ostream.write(buffer)

  //# Removes all circuit elements and scopes from the workspace and resets time to zero.
  //#   Called on initialization and reset.
  clearAndReset() {
    for (let element of Array.from((this.elementList != null))) {
      element.destroy();
    }

    this.Solver = new CircuitSolver(this);
    this.boundingBox = null;

    this.nodeList = [];
    this.elementList = [];
    this.voltageSources = [];

    this.scopes = [];

    this.time = 0;
    this.iterations = 0;

    this.placementElement = null;

    this.clearErrors();
    return this.notifyObservers(this.ON_RESET);
  }


  // "Solders" a new element to this circuit (adds it to the element list array).
  solder(newElement) {
    if (Array.from(this.elementList).includes(newElement)) {
      this.halt(`Circuit component ${newElement} is already in element list`);
    }

    this.notifyObservers(this.ON_SOLDER);

    newElement.Circuit = this;
    newElement.setPoints();
    newElement.recomputeBounds();

    this.elementList.push(newElement);

    newElement.onSolder(this);

    this.invalidate();
    return this.recomputeBounds();
  }

  // "Desolders" an existing element to this circuit (removes it to the element list array).
  desolder(component) {
    this.notifyObservers(this.ON_DESOLDER);

    component.Circuit = null;
    Util.removeFromArray(this.elementList, component);

    // TODO: REMOVE NODES
    //for node in component.nodes
    //  if node.getNeighboringElements().length == 1
    //    @nodeList.de

    return this.recomputeBounds();
  }

  toString() {
    return this.Params;
  }

  inspect() {
    return this.elementList.map(elm => elm.inspect());
  }

  invalidate() {
    return this.Solver.analyzeFlag = true;
  }

  dump() {
    let out = "";

    for (let elm of Array.from(this.getElements())) {
      out += elm.dump() + "\n";
    }

    return out;
  }

  getVoltageForNode(nodeIdx) {
    if (this.nodeList[nodeIdx].links[0]) {
      return this.nodeList[nodeIdx].links[0].elm.getVoltageForNode(nodeIdx);
    }
  }

  //###################################################################################################################
  /* Simulation Frame Computation
   *///################################################################################################################

  /*
  UpdateCircuit: Updates the circuit each frame.
    1. ) Reconstruct Circuit:
          Rebuilds a data representation of the circuit (only applied when circuit changes)
    2. ) Solve Circuit build matrix representation of the circuit solve for the voltage and current for each component.
          Solving is performed via LU factorization.
  */
  updateCircuit() {
    this.notifyObservers(this.ON_START_UPDATE);

    this.Solver.reconstruct();

    if (this.Solver.isStopped || (this.placementElement !== null)) {
      this.Solver.lastTime = 0;
    } else {
      this.Solver.solveCircuit();
    }

//    @write(@Solver.dumpFrame() + "\n")
//    @write(@dump() + "\n")

    this.notifyObservers(this.ON_COMPLETE_UPDATE);
  }

  setSelected(component) {
    return (() => {
      let result = [];
      for (let elm of Array.from(this.elementList)) {
        let item;
        if (elm === component) {
          this.selectedElm = component;
          item = component.setSelected(true);
        }
        result.push(item);
      }
      return result;
    })();
  }

  warn(message) {
    Logger.warn(message);
    return this.warnMessage = message;
  }

  halt(message) {
    let e = new Error(message);

    console.warn(e.stack);
    Logger.error(message);
    
    return this.stopMessage = message;
  }

  clearErrors() {
    this.stopMessage = null;
    return this.stopElm = null;
  }


  //#####################################################N##############################################################
  /* Circuit Element Accessors:
   *///################################################################################################################

  // TODO: Scopes aren't implemented yet
  getScopes() {
    return [];
  }

  findElm(searchElm) {
    for (let circuitElm of Array.from(this.elementList)) {
      if (searchElm === circuitElm) { return circuitElm; }
    }
    return false;
  }

  //TODO: It may be worthwhile to return a defensive copy here
  getElements() {
    return this.elementList;
  }

  getElmByIdx(elmIdx) {
    return this.elementList[elmIdx];
  }

  numElements() {
    return this.elementList.length;
  }

  //TODO: It may be worthwhile to return a defensive copy here
  getVoltageSources() {
    return this.voltageSources;
  }

  recomputeBounds() {
    let minX = 10000000000;
    let minY = 10000000000;
    let maxX = -10000000000;
    let maxY = -10000000000;

    this.eachComponent(function(component) {
      let componentBounds = component.boundingBox;

      let componentMinX = componentBounds.x;
      let componentMinY = componentBounds.y;
      let componentMaxX = componentBounds.x + componentBounds.width;
      let componentMaxY = componentBounds.y + componentBounds.height;

      if (componentMinX < minX) {
        minX = componentMinX;
      }

      if (componentMinY < minY) {
        minY = componentMinY;
      }

      if (componentMaxX > maxX) {
        maxX = componentMaxX;
      }
        
      if (componentMaxY > maxY) {
        return maxY = componentMaxY;
      }
    });

    return this.boundingBox = new Rectangle(minX, minY, maxX - minX, maxY - minY);
  }


  getBoundingBox() {
    return this.boundingBox;
  }

  //###################################################################################################################
  /* Nodes
   *///################################################################################################################

  resetNodes() {
    return this.nodeList = [];
  }

  addCircuitNode(circuitNode) {
    return this.nodeList.push(circuitNode);
  }

  getNode(idx) {
    return this.nodeList[idx];
  }

  getNodeAtCoordinates(x, y) {
    for (let node of Array.from(this.nodeList)) {
      if ((node.x === x) && (node.y === y)) {
        return node;
      }
    }
  }

  //TODO: It may be worthwhile to return a defensive copy here
  getNodes() {
    return this.nodeList;
  }

  numNodes() {
    return this.nodeList.length;
  }

  findBadNodes() {
    this.badNodes = [];

    for (let circuitNode of Array.from(this.nodeList)) {
      if (!circuitNode.intern && (circuitNode.links.length === 1)) {
        let numBadPoints = 0;
        let firstCircuitNode = circuitNode.links[0];
        for (let circuitElm of Array.from(this.elementList)) {
          // If firstCircuitNode isn't the same as the second
          if ((firstCircuitNode.elm.equalTo(circuitElm) === false) && circuitElm.boundingBox.contains(circuitNode.x,
            circuitNode.y)) {
            numBadPoints++;
          }
        }
        if (numBadPoints > 0) {
          // Todo: outline bad nodes here
          this.badNodes.push(circuitNode);
        }
      }
    }

    return this.badNodes;
  }

  destroy(components) {
    return Array.from(components).map((component) =>
      (() => {
        let result = [];
        for (let circuitComponent of Array.from(this.getElements())) {
          let item;
          if (circuitComponent.equalTo(component)) {
            item = this.desolder(circuitComponent, true);
          }
          result.push(item);
        }
        return result;
      })());
  }


  //###################################################################################################################
  /* Simulation Accessor Methods
   *///################################################################################################################

  subIterations() {
    return this.Solver.subIterations;
  }

  eachComponent(callback) {
    return Array.from(this.elementList).map((component) =>
      callback(component));
  }

  isStopped() {
    return this.Solver.isStopped;
  }

  timeStep() {
    return this.Params.timeStep;
  }

  getTime() {
    return this.time;
  }

  voltageRange() {
    return this.Params.voltageRange;
  }

  powerRange() {
    return this.Params.powerRange;
  }

  currentSpeed() {
    return this.Params.currentSpeed;
  }

  simSpeed() {
    return this.Params.simSpeed;
  }

  getState() {
    return this.state;
  }

  getStamper() {
    return this.Solver.getStamper();
  }

  serialize() {
    return [{
          type: this.Params.name,
          timeStep: this.timeStep(),
          simSpeed: this.simSpeed(),
          currentSpeed: this.currentSpeed(),
          voltageRange: this.voltageRange(),
          powerRange: this.powerRange(),
          flags: this.flags
        }].concat(this.elementList.map(element => element.serialize()));
  }

  toJson() {
    return {
      startCircuit: this.Params.name,
      timeStep: this.timeStep(),
      flags: this.flags,
      circuitNonLinear: this.Solver.circuitNonLinear,
      voltageSourceCount: this.voltageSourceCount,
      circuitMatrixSize: this.Solver.circuitMatrixSize,
      circuitMatrixFullSize: this.Solver.circuitMatrixFullSize,
      circuitPermute: this.Solver.circuitPermute,
      voltageSources: this.getVoltageSources().map(elm => elm.toJson()),
      circuitRowInfo: this.Solver.circuitRowInfo.map(rowInfo => rowInfo.toJson()),
      elmList: this.elementList.map(element => element.toJson()),
      nodeList: this.nodeList.map(node => node.toJson())
    };
  }

  frameJson() {
    return {
      nFrames: this.iterations,
      t: this.time,
      circuitMatrix: this.Solver.circuitMatrix,
      circuitRightSide: this.Solver.circuitRightSide,
      simulationFrames: this.Solver.simulationFrames.map(element => element.toJson())
    };
  }

  dumpFrameJson(filename) {
    let circuitFramsJson;
    if (filename == null) { filename = `./dump/${this.Params.name}_FRAMES.json`; }
    circuitFramsJson = JSON.stringify(this.frameJson(), null, 2);

    return fs.writeFileSync(filename, circuitFramsJson)
  }

  dumpAnalysisJson() {
    let circuitAnalysisJson = JSON.stringify(this.toJson(), null, 2);

    return fs.writeFileSync("./dump/#{@Params.name}_ANALYSIS.json", circuitAnalysisJson)
  }
}

Circuit.initClass();


module.exports = Circuit;
