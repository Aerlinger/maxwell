(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!scope/Oscilloscope', 'cs!io/Logger', 'cs!core/SimulationParams', 'cs!engine/CircuitSolver', 'cs!util/Observer'], function(Oscilloscope, Logger, SimulationParams, CircuitSolver, Observer) {
    var Circuit;
    Circuit = (function(_super) {
      __extends(Circuit, _super);

      Circuit.ON_START_UPDATE = "ON_START_UPDATE";

      Circuit.ON_COMPLETE_UPDATE = "ON_END_UPDATE";

      Circuit.ON_RESET = "ON_RESET";

      Circuit.ON_SOLDER = "ON_SOLDER";

      Circuit.ON_DESOLDER = "ON_DESOLDER";

      Circuit.ON_ADD_COMPONENT = "ON_ADD_COMPONENT";

      Circuit.ON_REMOVE_COMPONENT = "ON_MOVE_COMPONENT";

      Circuit.ON_MOVE_COMPONENT = "ON_MOVE_COMPONENT";

      Circuit.ON_ERROR = "ON_ERROR";

      Circuit.ON_WARNING = "ON_WARNING";

      function Circuit() {
        this.Params = new SimulationParams();
        this.clearAndReset();
      }

      Circuit.prototype.clearAndReset = function() {
        var element, _i, _len, _ref;
        _ref = this.elementList != null;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          element = _ref[_i];
          element.destroy();
        }
        this.Solver = new CircuitSolver(this);
        this.nodeList = [];
        this.elementList = [];
        this.voltageSources = [];
        this.scopes = [];
        this.time = 0;
        this.iterations = 0;
        this.clearErrors();
        return this.notifyObservers(this.ON_RESET);
      };

      Circuit.prototype.solder = function(newElement) {
        console.log("\tSoldering " + newElement + ": " + (newElement.dump()));
        this.notifyObservers(this.ON_SOLDER);
        newElement.Circuit = this;
        newElement.setPoints();
        return this.elementList.push(newElement);
      };

      Circuit.prototype.desolder = function(component, destroy) {
        if (destroy == null) {
          destroy = false;
        }
        this.notifyObservers(this.ON_DESOLDER);
        component.Circuit = null;
        this.elementList.remove(component);
        if (destroy) {
          return component.destroy();
        }
      };

      Circuit.prototype.toString = function() {
        return this.Params;
      };


      /* Simulation Frame Computation
       */


      /*
      UpdateCircuit: Updates the circuit each frame.
        1. ) Reconstruct Circuit:
              Rebuilds a data representation of the circuit (only applied when circuit changes)
        2. ) Solve Circuit build matrix representation of the circuit solve for the voltage and current for each component.
              Solving is performed via LU factorization.
       */

      Circuit.prototype.updateCircuit = function() {
        this.notifyObservers(this.ON_START_UPDATE);
        this.Solver.reconstruct();
        if (this.Solver.isStopped) {
          this.Solver.lastTime = 0;
        } else {
          this.Solver.solveCircuit();
        }
        return this.notifyObservers(this.ON_COMPLETE_UPDATE);
      };

      Circuit.prototype.setSelected = function(component) {
        var elm, _i, _len, _ref, _results;
        _ref = this.elementList;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          elm = _ref[_i];
          if (elm === component) {
            console.log("Selected: " + (component.dump()));
            this.selectedElm = component;
            _results.push(component.setSelected(true));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      Circuit.prototype.warn = function(message) {
        Logger.warn(message);
        return this.warnMessage = message;
      };

      Circuit.prototype.halt = function(message) {
        Logger.error(message);
        return this.stopMessage = message;
      };

      Circuit.prototype.clearErrors = function() {
        this.stopMessage = null;
        return this.stopElm = null;
      };


      /* Circuit Element Accessors:
       */

      Circuit.prototype.getScopes = function() {
        return [];
      };

      Circuit.prototype.findElm = function(searchElm) {
        var circuitElm, _i, _len, _ref;
        _ref = this.elementList;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          circuitElm = _ref[_i];
          if (searchElm === circuitElm) {
            return circuitElm;
          }
        }
        return false;
      };

      Circuit.prototype.getElements = function() {
        return this.elementList;
      };

      Circuit.prototype.getElmByIdx = function(elmIdx) {
        return this.elementList[elmIdx];
      };

      Circuit.prototype.numElements = function() {
        return this.elementList.length;
      };

      Circuit.prototype.getVoltageSources = function() {
        return this.voltageSources;
      };


      /* Nodes
       */

      Circuit.prototype.resetNodes = function() {
        return this.nodeList = [];
      };

      Circuit.prototype.addCircuitNode = function(circuitNode) {
        return this.nodeList.push(circuitNode);
      };

      Circuit.prototype.getNode = function(idx) {
        return this.nodeList[idx];
      };

      Circuit.prototype.getNodes = function() {
        return this.nodeList;
      };

      Circuit.prototype.numNodes = function() {
        return this.nodeList.length;
      };

      Circuit.prototype.findBadNodes = function() {
        var circuitElm, circuitNode, firstCircuitNode, numBadPoints, _i, _j, _len, _len1, _ref, _ref1;
        this.badNodes = [];
        _ref = this.nodeList;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          circuitNode = _ref[_i];
          if (!circuitNode.intern && circuitNode.links.length === 1) {
            numBadPoints = 0;
            firstCircuitNode = circuitNode.links[0];
            _ref1 = this.elementList;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              circuitElm = _ref1[_j];
              if (firstCircuitNode.elm.equal_to(circuitElm) === false && circuitElm.boundingBox.contains(circuitNode.x, circuitNode.y)) {
                numBadPoints++;
              }
            }
            if (numBadPoints > 0) {
              this.badNodes.push(circuitNode);
            }
          }
        }
        return this.badNodes;
      };


      /* Simulation Accessor Methods
       */

      Circuit.prototype.subIterations = function() {
        return this.Solver.subIterations;
      };

      Circuit.prototype.eachComponent = function(callback) {
        var component, _i, _len, _ref, _results;
        _ref = this.elementList;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          component = _ref[_i];
          _results.push(callback(component));
        }
        return _results;
      };

      Circuit.prototype.isStopped = function() {
        return this.Solver.isStopped;
      };

      Circuit.prototype.timeStep = function() {
        return this.Params.timeStep;
      };

      Circuit.prototype.voltageRange = function() {
        return this.Params.voltageRange;
      };

      Circuit.prototype.powerRange = function() {
        return this.Params.powerRange;
      };

      Circuit.prototype.currentSpeed = function() {
        return this.Params.currentSpeed;
      };

      Circuit.prototype.getState = function() {
        return this.state;
      };

      Circuit.prototype.getStamper = function() {
        return this.Solver.getStamper();
      };

      Circuit.prototype.getNode = function(idx) {
        return this.nodeList[idx];
      };

      return Circuit;

    })(Observer);
    return Circuit;
  });

}).call(this);
