;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0](function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
(function(global){(function() {
  var Circuit, CircuitLoader, Maxwell;

  CircuitLoader = require('./io/CircuitLoader.coffee');

  Circuit = require('./core/circuit.coffee');

  Maxwell = (function() {
    function Maxwell(canvas, options) {
      if (options == null) {
        options = {};
      }
      this.Circuit = null;
      this.circuitName = options['circuitName'];
    }

    Maxwell._loadCircuitFromFile = function(circuitFileName) {
      return CircuitLoader.createCircuitFromJsonFile(circuitFileName);
    };

    Maxwell._loadCircuitFromJson = function(jsonData) {
      return CircuitLoader.createCircuitFromJsonData(jsonData);
    };

    Maxwell.createCircuit = function(circuitName, circuitData) {
      var circuit;
      circuit = null;
      if (circuitData) {
        if (typeof circuitData === "string") {
          circuit = Maxwell._loadCircuitFromFile(circuitData);
        } else if (typeof circuitData === "object") {
          circuit = Maxwell._loadCircuitFromJson(circuitData);
        } else {
          raise("Parameter must either be a path to a JSON file or raw JSON data representing the circuit. Use `Maxwell.createCircuit()` to create a new empty circuit object.");
        }
      } else {
        circuit = new Circuit();
      }
      this.Circuits[circuitName] = circuit;
      return circuit;
    };

    Maxwell.foo = function() {
      return "foo";
    };

    Maxwell.prototype.instance_method = function() {
      return "instance";
    };

    return Maxwell;

  })();

  if (typeof window === "undefined") {
    console.log("Not in browsier, including maxwell...");
    global.Maxwell = Maxwell;
  } else {
    window.Maxwell = Maxwell;
  }

  module.exports = Maxwell;

}).call(this);


})(window)
},{"./io/CircuitLoader.coffee":2,"./core/circuit.coffee":3}],3:[function(require,module,exports){
(function() {
  var Circuit, CircuitSolver, Logger, Observer, Oscilloscope, SimulationParams,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Oscilloscope = require('../scope/oscilloscope.coffee');

  Logger = require('../io/logger.coffee');

  SimulationParams = require('../core/simulationParams.coffee');

  CircuitSolver = require('../engine/circuitSolver.coffee');

  Observer = require('../util/observer.coffee');

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

  module.exports = Circuit;

}).call(this);


},{"../scope/oscilloscope.coffee":4,"../io/logger.coffee":5,"../core/simulationParams.coffee":6,"../engine/circuitSolver.coffee":7,"../util/observer.coffee":8}],2:[function(require,module,exports){
(function() {
  var CircuitLoader, Hint, SimulationParams;

  SimulationParams = require('../core/SimulationParams.coffee');

  Hint = require('../engine/Hint.coffee');

  CircuitLoader = (function() {
    function CircuitLoader() {}

    CircuitLoader.createCircuitFromJsonData = function(jsonData) {
      var circuit, circuitParams, elementData, elms, flags, newCircuitElm, params, type, x1, x2, y1, y2, _i, _len;
      circuit = {};
      circuitParams = jsonData.shift();
      circuit.Params = new SimulationParams(jsonData);
      console.log(circuit.Params.toString());
      console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");
      console.log("Soldering Components:");
      console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");
      elms = [];
      for (_i = 0, _len = jsonData.length; _i < _len; _i++) {
        elementData = jsonData[_i];
        type = elementData['sym'];
        x1 = parseInt(elementData['x1']);
        y1 = parseInt(elementData['y1']);
        x2 = parseInt(elementData['x2']);
        y2 = parseInt(elementData['y2']);
        flags = parseInt(elementData['flags']);
        params = elementData['params'];
        if (sym === null) {
          circuit.halt("Element: " + (JSON.stringify(elementData)) + " is null");
        }
        if (type === Hint) {
          console.log("Hint found in file!");
        }
        if (!type) {
          circuit.warn("Unrecognized Type");
        }
        if (!sym) {
          circuit.warn("Unrecognized dump type: " + type);
        } else {
          newCircuitElm = new sym(x1, y1, x2, y2, flags, params);
          elms.push(newCircuitElm);
          circuit.solder(newCircuitElm);
        }
      }
      if (elms.length === 0) {
        console.error("No elements loaded. JSON most likely malformed");
      }
      return circuit;
    };

    /*
    Retrieves string data from a circuit text file (via AJAX GET)
    */


    CircuitLoader.createCircuitFromJsonFile = function(circuitFileName, onComplete) {
      if (onComplete == null) {
        onComplete = null;
      }
    };

    return CircuitLoader;

  })();

  module.exports = CircuitLoader;

}).call(this);


},{"../core/SimulationParams.coffee":9,"../engine/Hint.coffee":10}],4:[function(require,module,exports){
(function() {
  var Oscilloscope;

  Oscilloscope = (function() {
    function Oscilloscope(timeStep) {
      var chartDiv, i, xbuffer_size, _i,
        _this = this;
      this.timeStep = timeStep != null ? timeStep : 1;
      this.timeBase = 0;
      this.frames = 0;
      this.seriesData = [[], [], [], [], [], [], [], [], []];
      xbuffer_size = 150;
      chartDiv = document.getElementById("chart");
      for (i = _i = 0; 0 <= xbuffer_size ? _i <= xbuffer_size : _i >= xbuffer_size; i = 0 <= xbuffer_size ? ++_i : --_i) {
        this.addData(0);
      }
      setInterval(function() {
        _this.step();
        return graph.update();
      }, 40);
    }

    Oscilloscope.prototype.step = function() {
      this.frames += 1;
      this.removeData(1);
      return this.addData(0.5 * Math.sin(this.frames / 10) + 0.5);
    };

    Oscilloscope.prototype.addData = function(value) {
      var index, item, _i, _len, _ref, _results;
      index = this.seriesData[0].length;
      _ref = this.seriesData;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        _results.push(item.push({
          x: index * this.timeStep + this.timeBase,
          y: value
        }));
      }
      return _results;
    };

    Oscilloscope.prototype.removeData = function(data) {
      var item, _i, _len, _ref;
      _ref = this.seriesData;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        item.shift();
      }
      return this.timeBase += this.timeStep;
    };

    return Oscilloscope;

  })();

  module.exports = Oscilloscope;

}).call(this);


},{}],6:[function(require,module,exports){
(function() {
  var SimulationParams;

  SimulationParams = (function() {
    function SimulationParams(paramsObj) {
      this.completionStatus = (paramsObj != null ? paramsObj['completion_status'] : void 0) || "in development";
      this.createdAt = paramsObj != null ? paramsObj['created_at'] : void 0;
      this.currentSpeed = (paramsObj != null ? paramsObj['current_speed'] : void 0) || 63;
      this.updatedAt = paramsObj != null ? paramsObj['updated_at'] : void 0;
      this.description = (paramsObj != null ? paramsObj['description'] : void 0) || "";
      this.flags = (paramsObj != null ? paramsObj['flags'] : void 0) || 1;
      this.id = (paramsObj != null ? paramsObj['id'] : void 0) || null;
      this.name = (paramsObj != null ? paramsObj['name_unique'] : void 0) || "default";
      this.powerRange = (paramsObj != null ? paramsObj['power_range'] : void 0) || 62.0;
      this.voltageRange = (paramsObj != null ? paramsObj['voltage_range'] : void 0) || 10.0;
      this.simSpeed = this.convertSimSpeed((paramsObj != null ? paramsObj['sim_speed'] : void 0) || 10.0);
      this.timeStep = (paramsObj != null ? paramsObj['time_step'] : void 0) || 5.0e-06;
      this.title = (paramsObj != null ? paramsObj['title'] : void 0) || "Default";
      this.topic = (paramsObj != null ? paramsObj['topic'] : void 0) || null;
      if (this.timeStep == null) {
        throw new Error("Circuit params is missing its time step (was null)!");
      }
    }

    SimulationParams.prototype.toString = function() {
      return ["", "" + this.title, "================================================================", "\tName:        " + this.name, "\tTopic:       " + this.topic, "\tStatus:      " + this.completionStatus, "\tCreated at:  " + this.createdAt, "\tUpdated At:  " + this.updatedAt, "\tDescription: " + this.description, "\tId:          " + this.id, "\tTitle:       " + this.title, "----------------------------------------------------------------", "\tFlags:       " + this.flags, "\tTimeStep:    " + this.timeStep, "\tSim Speed:   " + this.simSpeed, "\tCur Speed:   " + this.currentSpeed, "\tVolt. Range: " + this.voltageRange, "\tPwr Range:   " + this.powerRange, ""].join("\n");
    };

    SimulationParams.prototype.convertSimSpeed = function(speed) {
      return Math.floor(Math.log(10 * speed) * 24.0 + 61.5);
    };

    SimulationParams.prototype.setCurrentMult = function(mult) {
      return this.currentMult = mult;
    };

    SimulationParams.prototype.getCurrentMult = function() {
      return this.currentMult;
    };

    return SimulationParams;

  })();

  module.exports = SimulationParams;

}).call(this);


},{}],5:[function(require,module,exports){
(function() {
  var Logger;

  Logger = (function() {
    var errorStack, warningStack;

    function Logger() {}

    errorStack = new Array();

    warningStack = new Array();

    Logger.error = function(msg) {
      console.error("Error: " + msg);
      return errorStack.push(msg);
    };

    Logger.warn = function(msg) {
      console.error("Warning: " + msg);
      return warningStack.push(msg);
    };

    return Logger;

  })();

  module.exports = Logger;

}).call(this);


},{}],9:[function(require,module,exports){
(function() {
  var SimulationParams;

  SimulationParams = (function() {
    function SimulationParams(paramsObj) {
      this.completionStatus = (paramsObj != null ? paramsObj['completion_status'] : void 0) || "in development";
      this.createdAt = paramsObj != null ? paramsObj['created_at'] : void 0;
      this.currentSpeed = (paramsObj != null ? paramsObj['current_speed'] : void 0) || 63;
      this.updatedAt = paramsObj != null ? paramsObj['updated_at'] : void 0;
      this.description = (paramsObj != null ? paramsObj['description'] : void 0) || "";
      this.flags = (paramsObj != null ? paramsObj['flags'] : void 0) || 1;
      this.id = (paramsObj != null ? paramsObj['id'] : void 0) || null;
      this.name = (paramsObj != null ? paramsObj['name_unique'] : void 0) || "default";
      this.powerRange = (paramsObj != null ? paramsObj['power_range'] : void 0) || 62.0;
      this.voltageRange = (paramsObj != null ? paramsObj['voltage_range'] : void 0) || 10.0;
      this.simSpeed = this.convertSimSpeed((paramsObj != null ? paramsObj['sim_speed'] : void 0) || 10.0);
      this.timeStep = (paramsObj != null ? paramsObj['time_step'] : void 0) || 5.0e-06;
      this.title = (paramsObj != null ? paramsObj['title'] : void 0) || "Default";
      this.topic = (paramsObj != null ? paramsObj['topic'] : void 0) || null;
      if (this.timeStep == null) {
        throw new Error("Circuit params is missing its time step (was null)!");
      }
    }

    SimulationParams.prototype.toString = function() {
      return ["", "" + this.title, "================================================================", "\tName:        " + this.name, "\tTopic:       " + this.topic, "\tStatus:      " + this.completionStatus, "\tCreated at:  " + this.createdAt, "\tUpdated At:  " + this.updatedAt, "\tDescription: " + this.description, "\tId:          " + this.id, "\tTitle:       " + this.title, "----------------------------------------------------------------", "\tFlags:       " + this.flags, "\tTimeStep:    " + this.timeStep, "\tSim Speed:   " + this.simSpeed, "\tCur Speed:   " + this.currentSpeed, "\tVolt. Range: " + this.voltageRange, "\tPwr Range:   " + this.powerRange, ""].join("\n");
    };

    SimulationParams.prototype.convertSimSpeed = function(speed) {
      return Math.floor(Math.log(10 * speed) * 24.0 + 61.5);
    };

    SimulationParams.prototype.setCurrentMult = function(mult) {
      return this.currentMult = mult;
    };

    SimulationParams.prototype.getCurrentMult = function() {
      return this.currentMult;
    };

    return SimulationParams;

  })();

  module.exports = SimulationParams;

}).call(this);


},{}],8:[function(require,module,exports){
(function() {
  var Observer,
    __slice = [].slice;

  Observer = (function() {
    function Observer() {}

    Observer.prototype.addObserver = function(event, fn) {
      var _base;
      this._events || (this._events = {});
      (_base = this._events)[event] || (_base[event] = []);
      return this._events[event].push(fn);
    };

    Observer.prototype.removeObserver = function(event, fn) {
      this._events || (this._events = {});
      if (this._events[event]) {
        return this._events[event].splice(this._events[event].indexOf(fn), 1);
      }
    };

    Observer.prototype.notifyObservers = function() {
      var args, callback, event, _i, _len, _ref, _results;
      event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      this._events || (this._events = {});
      if (this._events[event]) {
        _ref = this._events[event];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          callback = _ref[_i];
          _results.push(callback.apply(this, args));
        }
        return _results;
      }
    };

    Observer.prototype.getObservers = function() {
      return this._events;
    };

    return Observer;

  })();

  module.exports = Observer;

}).call(this);


},{}],10:[function(require,module,exports){
(function() {
  var Hint;

  Hint = (function() {
    Hint.HINT_LC = "@HINT_LC";

    Hint.HINT_RC = "@HINT_RC";

    Hint.HINT_3DB_C = "@HINT_3DB_C";

    Hint.HINT_TWINT = "@HINT_TWINT";

    Hint.HINT_3DB_L = "@HINT_3DB_L";

    Hint.hintType = -1;

    Hint.hintItem1 = -1;

    Hint.hintItem2 = -1;

    function Hint(Circuit) {
      this.Circuit = Circuit;
    }

    Hint.prototype.readHint = function(st) {
      if (typeof st === 'string') {
        st = st.split(' ');
      }
      this.hintType = st[0];
      this.hintItem1 = st[1];
      return this.hintItem2 = st[2];
    };

    Hint.prototype.getHint = function() {
      var c1, c2, ce, ie, re;
      c1 = this.Circuit.getElmByIdx(this.hintItem1);
      c2 = this.Circuit.getElmByIdx(this.hintItem2);
      if ((c1 == null) || (c2 == null)) {
        return null;
      }
      if (this.hintType === this.HINT_LC) {
        if (!(c1 instanceof InductorElm)) {
          return null;
        }
        if (!(c2 instanceof CapacitorElm)) {
          return null;
        }
        ie = c1;
        ce = c2;
        return "res.f = " + getUnitText(1 / (2 * Math.PI * Math.sqrt(ie.inductance * ce.capacitance)), "Hz");
      }
      if (this.hintType === this.HINT_RC) {
        if (!(c1 instanceof ResistorElm)) {
          return null;
        }
        if (!(c2 instanceof CapacitorElm)) {
          return null;
        }
        re = c1;
        ce = c2;
        return "RC = " + getUnitText(re.resistance * ce.capacitance, "s");
      }
      if (this.hintType === this.HINT_3DB_C) {
        if (!(c1 instanceof ResistorElm)) {
          return null;
        }
        if (!(c2 instanceof CapacitorElm)) {
          return null;
        }
        re = c1;
        ce = c2;
        return "f.3db = " + getUnitText(1 / (2 * Math.PI * re.resistance * ce.capacitance), "Hz");
      }
      if (this.hintType === this.HINT_3DB_L) {
        if (!(c1 instanceof ResistorElm)) {
          return null;
        }
        if (!(c2 instanceof InductorElm)) {
          return null;
        }
        re = c1;
        ie = c2;
        return "f.3db = " + getUnitText(re.resistance / (2 * Math.PI * ie.inductance), "Hz");
      }
      if (this.hintType === this.HINT_TWINT) {
        if (!(c1 instanceof ResistorElm)) {
          return null;
        }
        if (!(c2 instanceof CapacitorElm)) {
          return null;
        }
        re = c1;
        ce = c2;
        return "fc = " + getUnitText(1 / (2 * Math.PI * re.resistance * ce.capacitance), "Hz");
      }
      return null;
    };

    return Hint;

  })();

  module.exports = Hint;

}).call(this);


},{}],7:[function(require,module,exports){
(function() {
  var ArrayUtils, CapacitorElm, CircuitNode, CircuitNodeLink, CircuitSolver, CurrentElm, GroundElm, InductorElm, MatrixStamper, Pathfinder, RailElm, RowInfo, Setting, VoltageElm, WireElm;

  MatrixStamper = require('./matrixStamper.coffee');

  Pathfinder = require('./graphTraversal/pathfinder.coffee');

  CircuitNode = require('./graphTraversal/circuitNode.coffee');

  CircuitNodeLink = require('./graphTraversal/circuitNodeLink.coffee');

  RowInfo = require('./rowInfo.coffee');

  Setting = require('../settings/settings.coffee');

  ArrayUtils = require('../util/ArrayUtils.coffee');

  GroundElm = require('../component/components/GroundElm.coffee');

  RailElm = require('../component/components/RailElm.coffee');

  VoltageElm = require('../component/components/VoltageElm.coffee');

  WireElm = require('../component/components/WireElm.coffee');

  CapacitorElm = require('../component/components/CapacitorElm.coffee');

  InductorElm = require('../component/components/InductorElm.coffee');

  CurrentElm = require('../component/components/CurrentElm.coffee');

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

  module.exports = CircuitSolver;

}).call(this);


},{"./matrixStamper.coffee":11,"./graphTraversal/pathfinder.coffee":12,"./graphTraversal/circuitNode.coffee":13,"./graphTraversal/circuitNodeLink.coffee":14,"./rowInfo.coffee":15,"../settings/settings.coffee":16,"../util/ArrayUtils.coffee":17,"../component/components/GroundElm.coffee":18,"../component/components/RailElm.coffee":19,"../component/components/VoltageElm.coffee":20,"../component/components/WireElm.coffee":21,"../component/components/CapacitorElm.coffee":22,"../component/components/InductorElm.coffee":23,"../component/components/CurrentElm.coffee":24}],13:[function(require,module,exports){
(function() {
  var CircuitNode;

  CircuitNode = (function() {
    function CircuitNode(x, y, intern, links) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
      this.intern = intern != null ? intern : false;
      this.links = links != null ? links : [];
    }

    CircuitNode.prototype.toString = function() {
      return "CircuitNode: " + this.x + " " + this.y + " " + this.intern + " [" + (this.links.toString()) + "]";
    };

    return CircuitNode;

  })();

  module.exports = CircuitNode;

}).call(this);


},{}],14:[function(require,module,exports){
(function() {
  var CircuitNodeLink;

  CircuitNodeLink = (function() {
    function CircuitNodeLink(num, elm) {
      this.num = num != null ? num : 0;
      this.elm = elm != null ? elm : null;
    }

    CircuitNodeLink.prototype.toString = function() {
      return "" + this.num + " " + (this.elm.toString());
    };

    return CircuitNodeLink;

  })();

  module.expors = CircuitNodeLink;

}).call(this);


},{}],16:[function(require,module,exports){
(function(){/*
Stores Environment-specific settings

These are the global settings for Maxwell and should defined by the user.
Settings do not change by loading a new circuit.
*/


(function() {
  var Settings;

  Settings = (function() {
    var ColorPalette;

    function Settings() {}

    ColorPalette = {
      'voltageScale': ["#ff0000", "#f70707", "#ef0f0f", "#e71717", "#df1f1f", "#d72727", "#cf2f2f", "#c73737", "#bf3f3f", "#b74747", "#af4f4f", "#a75757", "#9f5f5f", "#976767", "#8f6f6f", "#877777", "#7f7f7f", "#778777", "#6f8f6f", "#679767", "#5f9f5f", "#57a757", "#4faf4f", "#47b747", "#3fbf3f", "#37c737", "#2fcf2f", "#27d727", "#1fdf1f", "#17e717", "#0fef0f", "#07f707", "#00ff00"],
      'aliceblue': '#f0f8ff',
      'antiquewhite': '#faebd7',
      'aqua': '#00ffff',
      'aquamarine': '#7fffd4',
      'azure': '#f0ffff',
      'beige': '#f5f5dc',
      'bisque': '#ffe4c4',
      'black': '#000000',
      'blanchedalmond': '#ffebcd',
      'blue': '#0000ff',
      'blueviolet': '#8a2be2',
      'brown': '#a52a2a',
      'burlywood': '#deb887',
      'cadetblue': '#5f9ea0',
      'chartreuse': '#7fff00',
      'chocolate': '#d2691e',
      'coral': '#ff7f50',
      'cornflowerblue': '#6495ed',
      'cornsilk': '#fff8dc',
      'crimson': '#dc143c',
      'cyan': '#00ffff',
      'darkblue': '#00008b',
      'darkcyan': '#008b8b',
      'darkgoldenrod': '#b8860b',
      'darkgray': '#a9a9a9',
      'darkgrey': '#a9a9a9',
      'darkgreen': '#006400',
      'darkkhaki': '#bdb76b',
      'darkmagenta': '#8b008b',
      'darkolivegreen': '#556b2f',
      'darkorange': '#ff8c00',
      'darkorchid': '#9932cc',
      'darkred': '#8b0000',
      'darksalmon': '#e9967a',
      'darkseagreen': '#8fbc8f',
      'darkslateblue': '#483d8b',
      'darkslategray': '#2f4f4f',
      'darkslategrey': '#2f4f4f',
      'darkturquoise': '#00ced1',
      'darkviolet': '#9400d3',
      'deeppink': '#ff1493',
      'deepskyblue': '#00bfff',
      'dimgray': '#696969',
      'dimgrey': '#696969',
      'dodgerblue': '#1e90ff',
      'firebrick': '#b22222',
      'floralwhite': '#fffaf0',
      'forestgreen': '#228b22',
      'fuchsia': '#ff00ff',
      'gainsboro': '#dcdcdc',
      'ghostwhite': '#f8f8ff',
      'gold': '#ffd700',
      'goldenrod': '#daa520',
      'gray': '#808080',
      'grey': '#808080',
      'green': '#008000',
      'greenyellow': '#adff2f',
      'honeydew': '#f0fff0',
      'hotpink': '#ff69b4',
      'indianred': '#cd5c5c',
      'indigo': '#4b0082',
      'ivory': '#fffff0',
      'khaki': '#f0e68c',
      'lavender': '#e6e6fa',
      'lavenderblush': '#fff0f5',
      'lawngreen': '#7cfc00',
      'lemonchiffon': '#fffacd',
      'lightblue': '#add8e6',
      'lightcoral': '#f08080',
      'lightcyan': '#e0ffff',
      'lightgoldenrodyellow': '#fafad2',
      'lightgray': '#d3d3d3',
      'lightgrey': '#d3d3d3',
      'lightgreen': '#90ee90',
      'lightpink': '#ffb6c1',
      'lightsalmon': '#ffa07a',
      'lightseagreen': '#20b2aa',
      'lightskyblue': '#87cefa',
      'lightslategray': '#778899',
      'lightslategrey': '#778899',
      'lightsteelblue': '#b0c4de',
      'lightyellow': '#ffffe0',
      'lime': '#00ff00',
      'limegreen': '#32cd32',
      'linen': '#faf0e6',
      'magenta': '#ff00ff',
      'maroon': '#800000',
      'mediumaquamarine': '#66cdaa',
      'mediumblue': '#0000cd',
      'mediumorchid': '#ba55d3',
      'mediumpurple': '#9370d8',
      'mediumseagreen': '#3cb371',
      'mediumslateblue': '#7b68ee',
      'mediumspringgreen': '#00fa9a',
      'mediumturquoise': '#48d1cc',
      'mediumvioletred': '#c71585',
      'midnightblue': '#191970',
      'mintcream': '#f5fffa',
      'mistyrose': '#ffe4e1',
      'moccasin': '#ffe4b5',
      'navajowhite': '#ffdead',
      'navy': '#000080',
      'oldlace': '#fdf5e6',
      'olive': '#808000',
      'olivedrab': '#6b8e23',
      'orange': '#ffa500',
      'orangered': '#ff4500',
      'orchid': '#da70d6',
      'palegoldenrod': '#eee8aa',
      'palegreen': '#98fb98',
      'paleturquoise': '#afeeee',
      'palevioletred': '#d87093',
      'papayawhip': '#ffefd5',
      'peachpuff': '#ffdab9',
      'peru': '#cd853f',
      'pink': '#ffc0cb',
      'plum': '#dda0dd',
      'powderblue': '#b0e0e6',
      'purple': '#800080',
      'red': '#ff0000',
      'rosybrown': '#bc8f8f',
      'royalblue': '#4169e1',
      'saddlebrown': '#8b4513',
      'salmon': '#fa8072',
      'sandybrown': '#f4a460',
      'seagreen': '#2e8b57',
      'seashell': '#fff5ee',
      'sienna': '#a0522d',
      'silver': '#c0c0c0',
      'skyblue': '#87ceeb',
      'slateblue': '#6a5acd',
      'slategray': '#708090',
      'slategrey': '#708090',
      'snow': '#fffafa',
      'springgreen': '#00ff7f',
      'steelblue': '#4682b4',
      'tan': '#d2b48c',
      'teal': '#008080',
      'thistle': '#d8bfd8',
      'tomato': '#ff6347',
      'turquoise': '#40e0d0',
      'violet': '#ee82ee',
      'wheat': '#f5deb3',
      'white': '#ffffff',
      'whitesmoke': '#f5f5f5',
      'yellow': '#ffff00',
      'yellowgreen': '#9acd32'
    };

    Settings.FRACTIONAL_DIGITS = 2;

    Settings.CURRENT_SEGMENT_LENGTH = 16;

    Settings.POST_RADIUS = 1;

    Settings.CURRENT_RADIUS = 1;

    Settings.LINE_WIDTH = 2;

    Settings.GRID_SIZE = 16;

    Settings.SMALL_GRID = false;

    Settings.SHOW_VALUES = false;

    Settings.SELECT_COLOR = ColorPalette.orange;

    Settings.POST_COLOR_SELECTED = ColorPalette.orange;

    Settings.POST_COLOR = ColorPalette.black;

    Settings.DOTS_COLOR = ColorPalette.yellow;

    Settings.DOTS_OUTLINE = ColorPalette.orange;

    Settings.TEXT_COLOR = ColorPalette.black;

    Settings.TEXT_ERROR_COLOR = ColorPalette.red;

    Settings.TEXT_WARNING_COLOR = ColorPalette.yellow;

    Settings.SELECTION_MARQUEE_COLOR = ColorPalette.orange;

    Settings.GRID_COLOR = ColorPalette.darkyellow;

    Settings.BG_COLOR = ColorPalette.white;

    Settings.FG_COLOR = ColorPalette.darkgray;

    Settings.ERROR_COLOR = ColorPalette.darkred;

    Settings.WARNING_COLOR = ColorPalette.orange;

    return Settings;

  })();

  return Settings;

}).call(this);


})()
},{}],17:[function(require,module,exports){
(function() {
  var ArrayUtils;

  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchItem, i) {
      if (i == null) {
        i = 0;
      }
      while (i < this.length) {
        if (this[i] === searchItem) {
          return i;
        }
        ++i;
      }
      return -1;
    };
  }

  Array.prototype.remove = function() {
    var args, ax, item, num_args;
    args = arguments;
    num_args = args.length;
    while (num_args && this.length) {
      item = args[--num_args];
      while ((ax = this.indexOf(item)) !== -1) {
        this.splice(ax, 1);
      }
    }
    return this;
  };

  ArrayUtils = (function() {
    function ArrayUtils() {}

    ArrayUtils.zeroArray = function(numElements) {
      var i;
      if (numElements < 1) {
        return [];
      }
      return (function() {
        var _i, _len, _ref, _results;
        _ref = Array(numElements);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          _results.push(0);
        }
        return _results;
      })();
    };

    ArrayUtils.zeroArray2 = function(numRows, numCols) {
      var i, _i, _len, _ref, _results;
      if (numRows < 1) {
        return [];
      }
      _ref = Array(numRows);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        _results.push(this.zeroArray(numCols));
      }
      return _results;
    };

    ArrayUtils.isCleanArray = function(arr) {
      var element, valid, _i, _len;
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        element = arr[_i];
        if (element instanceof Array) {
          valid = arguments.callee(element);
        } else {
          if (!isFinite(element)) {
            console.warn("Invalid number found: " + element);
            console.printStackTrace();
            return false;
          }
        }
      }
    };

    ArrayUtils.printArray = function(arr) {
      var subarr, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        subarr = arr[_i];
        _results.push(console.log(subarr));
      }
      return _results;
    };

    return ArrayUtils;

  })();

  module.exports = ArrayUtils;

}).call(this);


},{}],15:[function(require,module,exports){
(function() {
  var RowInfo;

  RowInfo = (function() {
    RowInfo.ROW_NORMAL = 0;

    RowInfo.ROW_CONST = 1;

    RowInfo.ROW_EQUAL = 2;

    function RowInfo() {
      this.type = RowInfo.ROW_NORMAL;
      this.nodeEq = 0;
      this.mapCol = 0;
      this.mapRow = 0;
      this.value = 0;
      this.rsChanges = false;
      this.lsChanges = false;
      this.dropRow = false;
    }

    RowInfo.prototype.toString = function() {
      return "RowInfo: type: " + this.type + ", nodeEq: " + this.nodeEq + ", mapCol: " + this.mapCol + ", mapRow: " + this.mapRow + ", value: " + this.value + ", rsChanges: " + this.rsChanges + ", lsChanges: " + this.lsChanges + ", dropRow: " + this.dropRow;
    };

    return RowInfo;

  })();

  module.exports = RowInfo;

}).call(this);


},{}],11:[function(require,module,exports){
(function() {
  var MathUtils, MatrixStamper, RowInfo;

  MathUtils = require('../util/mathUtils.coffee');

  RowInfo = require('./rowInfo.coffee');

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

  module.exports = MatrixStamper;

}).call(this);


},{"../util/mathUtils.coffee":25,"./rowInfo.coffee":15}],12:[function(require,module,exports){
(function() {
  var CapacitorElm, CurrentElm, InductorElm, Pathfinder, ResistorElm, VoltageElm;

  VoltageElm = require('../../component/components/VoltageElm.coffee');

  CurrentElm = require('../../component/components/CurrentElm.coffee');

  ResistorElm = require('../../component/components/ResistorElm.coffee');

  InductorElm = require('../../component/components/InductorElm.coffee');

  CapacitorElm = require('../../component/components/CapacitorElm.coffee');

  Pathfinder = (function() {
    Pathfinder.INDUCT = 1;

    Pathfinder.VOLTAGE = 2;

    Pathfinder.SHORT = 3;

    Pathfinder.CAP_V = 4;

    function Pathfinder(type, firstElm, dest, elementList, numNodes) {
      this.type = type;
      this.firstElm = firstElm;
      this.dest = dest;
      this.elementList = elementList;
      this.used = new Array(numNodes);
    }

    Pathfinder.prototype.findPath = function(n1, depth) {
      var c, ce, j, k, _i, _j, _k, _l, _len, _ref, _ref1, _ref2, _ref3;
      if (n1 === this.dest) {
        console.log("n1 is @dest");
        return true;
      }
      if (depth-- === 0) {
        return false;
      }
      if (this.used[n1]) {
        console.log("used " + n1);
        return false;
      }
      this.used[n1] = true;
      _ref = this.elementList;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ce = _ref[_i];
        if (ce === this.firstElm) {
          console.log("ce is @firstElm");
          continue;
        }
        if ((ce instanceof CurrentElm) && (this.type === Pathfinder.INDUCT)) {
          continue;
        }
        if (this.type === Pathfinder.VOLTAGE) {
          if (!(ce.isWire() || ce instanceof VoltageElm)) {
            console.log("type == VOLTAGE");
            continue;
          }
        }
        if (this.type === Pathfinder.SHORT && !ce.isWire()) {
          console.log("(type == SHORT && !ce.isWire())");
          continue;
        }
        if (this.type === Pathfinder.CAP_V) {
          if (!(ce.isWire() || ce instanceof CapacitorElm || ce instanceof VoltageElm)) {
            console.log("if !(ce.isWire() or ce instanceof CapacitorElm or ce instanceof VoltageElm)");
            continue;
          }
        }
        if (n1 === 0) {
          for (j = _j = 0, _ref1 = ce.getPostCount(); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
            if (ce.hasGroundConnection(j) && this.findPath(ce.getNode(j), depth)) {
              console.log(ce + " has ground (n1 is 0)");
              this.used[n1] = false;
              return true;
            }
          }
        }
        for (j = _k = 0, _ref2 = ce.getPostCount(); 0 <= _ref2 ? _k < _ref2 : _k > _ref2; j = 0 <= _ref2 ? ++_k : --_k) {
          console.log("get post " + ce.dump() + " " + ce.getNode(j));
          if (ce.getNode(j) === n1) {
            break;
          }
        }
        if (j === ce.getPostCount()) {
          continue;
        }
        if (ce.hasGroundConnection(j) && this.findPath(0, depth)) {
          console.log(ce + " has ground");
          this.used[n1] = false;
          return true;
        }
        if (this.type === Pathfinder.INDUCT && ce instanceof InductorElm) {
          c = ce.getCurrent();
          if (j === 0) {
            c = -c;
          }
          console.log(ce + " > " + this.firstElm + " >> matching " + ce + " to " + this.firstElm.getCurrent());
          if (Math.abs(c - this.firstElm.getCurrent()) > 1e-10) {
            continue;
          }
        }
        for (k = _l = 0, _ref3 = ce.getPostCount(); 0 <= _ref3 ? _l < _ref3 : _l > _ref3; k = 0 <= _ref3 ? ++_l : --_l) {
          if (j === k) {
            continue;
          }
          console.log(ce + " " + ce.getNode(j) + " - " + ce.getNode(k));
          if (ce.getConnection(j, k) && this.findPath(ce.getNode(k), depth)) {
            this.used[n1] = false;
            console.log("got findpath " + n1);
            return true;
          }
        }
      }
      this.used[n1] = false;
      return false;
    };

    return Pathfinder;

  })();

  module.exports = Pathfinder;

}).call(this);


},{"../../component/components/VoltageElm.coffee":20,"../../component/components/CurrentElm.coffee":24,"../../component/components/ResistorElm.coffee":26,"../../component/components/InductorElm.coffee":23,"../../component/components/CapacitorElm.coffee":22}],18:[function(require,module,exports){
(function() {
  var CircuitComponent, DrawHelper, GroundElm, Point, Polygon, Rectangle, Settings,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Settings = require('../../settings/settings.coffee');

  DrawHelper = require('../../render/drawHelper.coffee');

  Polygon = require('../../geom/polygon.coffee');

  Rectangle = require('../../geom/rectangle.coffee');

  Point = require('../../geom/point.coffee');

  CircuitComponent = require('../circuitComponent.coffee');

  GroundElm = (function(_super) {
    __extends(GroundElm, _super);

    function GroundElm(xa, ya, xb, yb, f, st) {
      GroundElm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
    }

    GroundElm.prototype.getDumpType = function() {
      return "g";
    };

    GroundElm.prototype.getPostCount = function() {
      return 1;
    };

    GroundElm.prototype.draw = function(renderContext) {
      var color, endPt, pt1, pt2, row, startPt, _i, _ref;
      color = DrawHelper.getVoltageColor(0);
      renderContext.drawThickLinePt(this.point1, this.point2, color);
      for (row = _i = 0; _i < 3; row = ++_i) {
        startPt = 10 - row * 2;
        endPt = row * 3;
        _ref = DrawHelper.interpPoint2(this.point1, this.point2, 1 + endPt / this.dn, startPt), pt1 = _ref[0], pt2 = _ref[1];
        renderContext.drawThickLinePt(pt1, pt2, color);
      }
      pt2 = DrawHelper.interpPoint(this.point1, this.point2, 1 + 11.0 / this.dn);
      this.setBboxPt(this.point1, pt2, 11);
      this.drawPost(this.x1, this.y1, this.nodes[0], renderContext);
      return this.drawDots(this.point1, this.point2, renderContext);
    };

    GroundElm.prototype.setCurrent = function(x, currentVal) {
      return this.current = -currentVal;
    };

    GroundElm.prototype.stamp = function(stamper) {
      console.log("\nStamping Ground Elm");
      return stamper.stampVoltageSource(0, this.nodes[0], this.voltSource, 0);
    };

    GroundElm.prototype.getVoltageDiff = function() {
      return 0;
    };

    GroundElm.prototype.getVoltageSourceCount = function() {
      return 1;
    };

    GroundElm.prototype.getInfo = function(arr) {
      GroundElm.__super__.getInfo.call(this);
      arr[0] = "ground";
      return arr[1] = "I = " + DrawHelper.getCurrentText(this.getCurrent());
    };

    GroundElm.prototype.hasGroundConnection = function(n1) {
      return true;
    };

    GroundElm.prototype.needsShortcut = function() {
      return true;
    };

    GroundElm.prototype.toString = function() {
      return "GroundElm";
    };

    return GroundElm;

  })(CircuitComponent);

  module.exports = GroundElm;

}).call(this);


},{"../../render/drawHelper.coffee":27,"../../settings/settings.coffee":16,"../../geom/polygon.coffee":28,"../../geom/rectangle.coffee":29,"../../geom/point.coffee":30,"../circuitComponent.coffee":31}],19:[function(require,module,exports){
(function() {
  var AntennaElm, CircuitComponent, DrawHelper, Point, Polygon, RailElm, Rectangle, Settings, VoltageElm,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Settings = require('../../settings/settings.coffee');

  DrawHelper = require('../../render/drawHelper.coffee');

  Polygon = require('../../geom/polygon.coffee');

  Rectangle = require('../../geom/rectangle.coffee');

  Point = require('../../geom/point.coffee');

  CircuitComponent = require('../circuitComponent.coffee');

  VoltageElm = require('./VoltageElm.coffee');

  AntennaElm = require('./AntennaElm.coffee');

  RailElm = (function(_super) {
    __extends(RailElm, _super);

    RailElm.FLAG_CLOCK = 1;

    function RailElm(xa, ya, xb, yb, f, st) {
      RailElm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
    }

    RailElm.prototype.getDumpType = function() {
      return "R";
    };

    RailElm.prototype.getPostCount = function() {
      return 1;
    };

    RailElm.prototype.setPoints = function() {
      RailElm.__super__.setPoints.call(this);
      return this.lead1 = DrawHelper.interpPoint(this.point1, this.point2, 1 - VoltageElm.circleSize / this.dn);
    };

    RailElm.prototype.draw = function(renderContext) {
      var clock, color, s, v;
      this.setBboxPt(this.point1, this.point2, this.circleSize);
      color = DrawHelper.getVoltageColor(this.volts[0]);
      renderContext.drawThickLinePt(this.point1, this.lead1, color);
      clock = this.waveform === VoltageElm.WF_SQUARE && (this.flags & VoltageElm.FLAG_CLOCK) !== 0;
      if (this.waveform === VoltageElm.WF_DC || this.waveform === VoltageElm.WF_VAR || clock) {
        color = (this.needsHighlight() ? Settings.SELECT_COLOR : "#FFFFFF");
        v = this.getVoltage();
        s = DrawHelper.getShortUnitText(v, "V");
        if (Math.abs(v) < 1) {
          s = v + "V";
        }
        if (this.getVoltage() > 0) {
          s = "+" + s;
        }
        if (this instanceof AntennaElm) {
          s = "Ant";
        }
        if (clock) {
          s = "CLK";
        }
        this.drawCenteredText(s, this.x2, this.y2, true, renderContext);
      } else {
        this.drawWaveform(this.point2, renderContext);
      }
      this.drawPosts(renderContext);
      return this.drawDots(this.point1, this.lead1, renderContext);
    };

    RailElm.prototype.getVoltageDiff = function() {
      return this.volts[0];
    };

    RailElm.prototype.stamp = function(stamper) {
      if (this.waveform === VoltageElm.WF_DC) {
        return stamper.stampVoltageSource(0, this.nodes[0], this.voltSource, this.getVoltage());
      } else {
        return stamper.stampVoltageSource(0, this.nodes[0], this.voltSource);
      }
    };

    RailElm.prototype.doStep = function(stamper) {
      if (this.waveform !== VoltageElm.WF_DC) {
        return stamper.updateVoltageSource(0, this.nodes[0], this.voltSource, this.getVoltage());
      }
    };

    RailElm.prototype.hasGroundConnection = function(n1) {
      return true;
    };

    return RailElm;

  })(VoltageElm);

  module.exports = RailElm;

}).call(this);


},{"../../settings/settings.coffee":16,"../../render/drawHelper.coffee":27,"../../geom/polygon.coffee":28,"../../geom/rectangle.coffee":29,"../../geom/point.coffee":30,"./VoltageElm.coffee":20,"./AntennaElm.coffee":32,"../circuitComponent.coffee":31}],20:[function(require,module,exports){
(function() {
  var CircuitComponent, DrawHelper, Point, Polygon, Rectangle, Settings, VoltageElm,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Settings = require('../../settings/settings.coffee');

  DrawHelper = require('../../render/drawHelper.coffee');

  Polygon = require('../../geom/polygon.coffee');

  Rectangle = require('../../geom/rectangle.coffee');

  Point = require('../../geom/point.coffee');

  CircuitComponent = require('../circuitComponent.coffee');

  VoltageElm = (function(_super) {
    __extends(VoltageElm, _super);

    VoltageElm.FLAG_COS = 2;

    VoltageElm.WF_DC = 0;

    VoltageElm.WF_AC = 1;

    VoltageElm.WF_SQUARE = 2;

    VoltageElm.WF_TRIANGLE = 3;

    VoltageElm.WF_SAWTOOTH = 4;

    VoltageElm.WF_PULSE = 5;

    VoltageElm.WF_VAR = 6;

    VoltageElm.circleSize = 17;

    function VoltageElm(xa, ya, xb, yb, f, st) {
      VoltageElm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
      this.waveform = VoltageElm.WF_DC;
      this.frequency = 40;
      this.maxVoltage = 5;
      this.freqTimeZero = 0;
      this.bias = 0;
      this.phaseShift = 0;
      this.dutyCycle = 0.5;
      if (st) {
        if (typeof st === "string") {
          st = st.split(" ");
        }
        this.waveform = (st[0] ? Math.floor(parseInt(st[0])) : VoltageElm.WF_DC);
        this.frequency = (st[1] ? parseFloat(st[1]) : 40);
        this.maxVoltage = (st[2] ? parseFloat(st[2]) : 5);
        this.bias = (st[3] ? parseFloat(st[3]) : 0);
        this.phaseShift = (st[4] ? parseFloat(st[4]) : 0);
        this.dutyCycle = (st[5] ? parseFloat(st[5]) : 0.5);
      }
      if (this.flags & VoltageElm.FLAG_COS !== 0) {
        this.flags &= ~VoltageElm.FLAG_COS;
        this.phaseShift = Math.PI / 2;
      }
      this.reset();
    }

    VoltageElm.prototype.getDumpType = function() {
      return "v";
    };

    VoltageElm.prototype.dump = function() {
      return "" + (VoltageElm.__super__.dump.call(this)) + " " + this.waveform + " " + this.frequency + " " + this.maxVoltage + " " + this.bias + " " + this.phaseShift + " " + this.dutyCycle;
    };

    VoltageElm.prototype.reset = function() {
      this.freqTimeZero = 0;
      return this.curcount = 5;
    };

    VoltageElm.prototype.triangleFunc = function(x) {
      if (x < Math.PI) {
        return x * (2 / Math.PI) - 1;
      }
      return 1 - (x - Math.PI) * (2 / Math.PI);
    };

    VoltageElm.prototype.stamp = function(stamper) {
      console.log("\nStamping Voltage Elm");
      if (this.waveform === VoltageElm.WF_DC) {
        return stamper.stampVoltageSource(this.nodes[0], this.nodes[1], this.voltSource, this.getVoltage());
      } else {
        return stamper.stampVoltageSource(this.nodes[0], this.nodes[1], this.voltSource);
      }
    };

    VoltageElm.prototype.doStep = function(stamper) {
      if (this.waveform !== VoltageElm.WF_DC) {
        return stamper.updateVoltageSource(this.nodes[0], this.nodes[1], this.voltSource, this.getVoltage());
      }
    };

    VoltageElm.prototype.getVoltage = function() {
      var omega;
      omega = 2 * Math.PI * (this.Circuit.time - this.freqTimeZero) * this.frequency + this.phaseShift;
      switch (this.waveform) {
        case VoltageElm.WF_DC:
          return this.maxVoltage + this.bias;
        case VoltageElm.WF_AC:
          return Math.sin(omega) * this.maxVoltage + this.bias;
        case VoltageElm.WF_SQUARE:
          return this.bias + (omega % (2 * Math.PI) > (2 * Math.PI * this.dutyCycle) ? -this.maxVoltage : this.maxVoltage);
        case VoltageElm.WF_TRIANGLE:
          return this.bias + this.triangleFunc(omega % (2 * Math.PI)) * this.maxVoltage;
        case VoltageElm.WF_SAWTOOTH:
          return this.bias + (omega % (2 * Math.PI)) * (this.maxVoltage / Math.PI) - this.maxVoltage;
        case VoltageElm.WF_PULSE:
          if ((omega % (2 * Math.PI)) < 1) {
            return this.maxVoltage + this.bias;
          } else {
            return this.bias;
          }
          break;
        default:
          return 0;
      }
    };

    VoltageElm.prototype.setPoints = function() {
      VoltageElm.__super__.setPoints.call(this);
      if (this.waveform === VoltageElm.WF_DC || this.waveform === VoltageElm.WF_VAR) {
        return this.calcLeads(8);
      } else {
        return this.calcLeads(VoltageElm.circleSize * 2);
      }
    };

    VoltageElm.prototype.draw = function(renderContext) {
      var ps1, ptA, ptB, _ref, _ref1;
      this.setBbox(this.x1, this.y2, this.x2, this.y2);
      this.draw2Leads(renderContext);
      if (!this.isBeingDragged()) {
        if (this.waveform === VoltageElm.WF_DC) {
          this.drawDots(this.point1, this.point2, renderContext);
        } else {
          this.drawDots(this.point1, this.lead1, renderContext);
        }
      }
      if (this.waveform === VoltageElm.WF_DC) {
        _ref = DrawHelper.interpPoint2(this.lead1, this.lead2, 0, 10), ptA = _ref[0], ptB = _ref[1];
        renderContext.drawThickLinePt(this.lead1, ptA, DrawHelper.getVoltageColor(this.volts[0]));
        renderContext.drawThickLinePt(ptA, ptB, DrawHelper.getVoltageColor(this.volts[0]));
        this.setBboxPt(this.point1, this.point2, 16);
        _ref1 = DrawHelper.interpPoint2(this.lead1, this.lead2, 1, 16), ptA = _ref1[0], ptB = _ref1[1];
        renderContext.drawThickLinePt(ptA, ptB, DrawHelper.getVoltageColor(this.volts[1]));
      } else {
        this.setBboxPt(this.point1, this.point2, VoltageElm.circleSize);
        ps1 = DrawHelper.interpPoint(this.lead1, this.lead2, 0.5);
        this.drawWaveform(ps1, renderContext);
      }
      return this.drawPosts(renderContext);
    };

    VoltageElm.prototype.drawWaveform = function(center, renderContext) {
      var color, i, ox, oy, valueString, wl, xc, xc2, xl, yc, yy;
      color = this.needsHighlight() ? Settings.FG_COLOR : void 0;
      xc = center.x;
      yc = center.y;
      renderContext.fillCircle(xc, yc, VoltageElm.circleSize, 2, "#FFFFFF");
      wl = 8;
      this.adjustBbox(xc - VoltageElm.circleSize, yc - VoltageElm.circleSize, xc + VoltageElm.circleSize, yc + VoltageElm.circleSize);
      xc2 = void 0;
      switch (this.waveform) {
        case VoltageElm.WF_DC:
          break;
        case VoltageElm.WF_SQUARE:
          xc2 = Math.floor(wl * 2 * this.dutyCycle - wl + xc);
          xc2 = Math.max(xc - wl + 3, Math.min(xc + wl - 3, xc2));
          renderContext.drawThickLine(xc - wl, yc - wl, xc - wl, yc, color);
          renderContext.drawThickLine(xc - wl, yc - wl, xc2, yc - wl, color);
          renderContext.drawThickLine(xc2, yc - wl, xc2, yc + wl, color);
          renderContext.drawThickLine(xc + wl, yc + wl, xc2, yc + wl, color);
          renderContext.drawThickLine(xc + wl, yc, xc + wl, yc + wl, color);
          break;
        case VoltageElm.WF_PULSE:
          yc += wl / 2;
          renderContext.drawThickLine(xc - wl, yc - wl, xc - wl, yc, color);
          renderContext.drawThickLine(xc - wl, yc - wl, xc - wl / 2, yc - wl, color);
          renderContext.drawThickLine(xc - wl / 2, yc - wl, xc - wl / 2, yc, color);
          renderContext.drawThickLine(xc - wl / 2, yc, xc + wl, yc, color);
          break;
        case VoltageElm.WF_SAWTOOTH:
          renderContext.drawThickLine(xc, yc - wl, xc - wl, yc, color);
          renderContext.drawThickLine(xc, yc - wl, xc, yc + wl, color);
          renderContext.drawThickLine(xc, yc + wl, xc + wl, yc, color);
          break;
        case VoltageElm.WF_TRIANGLE:
          xl = 5;
          renderContext.drawThickLine(xc - xl * 2, yc, xc - xl, yc - wl, color);
          renderContext.drawThickLine(xc - xl, yc - wl, xc, yc, color);
          renderContext.drawThickLine(xc, yc, xc + xl, yc + wl, color);
          renderContext.drawThickLine(xc + xl, yc + wl, xc + xl * 2, yc, color);
          break;
        case VoltageElm.WF_AC:
          xl = 10;
          ox = -1;
          oy = -1;
          i = -xl;
          while (i <= xl) {
            yy = yc + Math.floor(0.95 * Math.sin(i * Math.PI / xl) * wl);
            if (ox !== -1) {
              renderContext.drawThickLine(ox, oy, xc + i, yy, color);
            }
            ox = xc + i;
            oy = yy;
            i++;
          }
      }
      if (Settings.SHOW_VALUES) {
        valueString = DrawHelper.getShortUnitText(this.frequency, "Hz");
        if (this.dx === 0 || this.dy === 0) {
          return this.drawValues(valueString, VoltageElm.circleSize);
        }
      }
    };

    VoltageElm.prototype.getVoltageSourceCount = function() {
      return 1;
    };

    VoltageElm.prototype.getPower = function() {
      return -this.getVoltageDiff() * this.current;
    };

    VoltageElm.prototype.getVoltageDiff = function() {
      return this.volts[1] - this.volts[0];
    };

    VoltageElm.prototype.getInfo = function(arr) {
      var i;
      switch (this.waveform) {
        case VoltageElm.WF_DC:
        case VoltageElm.WF_VAR:
          arr[0] = "voltage source";
          break;
        case VoltageElm.WF_AC:
          arr[0] = "A/C source";
          break;
        case VoltageElm.WF_SQUARE:
          arr[0] = "square wave gen";
          break;
        case VoltageElm.WF_PULSE:
          arr[0] = "pulse gen";
          break;
        case VoltageElm.WF_SAWTOOTH:
          arr[0] = "sawtooth gen";
          break;
        case VoltageElm.WF_TRIANGLE:
          arr[0] = "triangle gen";
      }
      arr[1] = "I = " + DrawHelper.getCurrentText(this.getCurrent());
      if (this.waveform !== VoltageElm.WF_DC && this.waveform !== VoltageElm.WF_VAR) {
        arr[3] = "f = " + DrawHelper.getUnitText(this.frequency, "Hz");
        arr[4] = "Vmax = " + DrawHelper.getVoltageText(this.maxVoltage);
        i = 5;
        if (this.bias !== 0) {
          arr[i++] = "Voff = " + this.getVoltageText(this.bias);
        } else {
          if (this.frequency > 500) {
            arr[i++] = "wavelength = " + DrawHelper.getUnitText(2.9979e8 / this.frequency, "m");
          }
        }
        return arr[i++] = "P = " + DrawHelper.getUnitText(this.getPower(), "W");
      }
    };

    VoltageElm.prototype.getEditInfo = function(n) {
      var ei;
      if (n === 0) {
        return new EditInfo((this.waveform === VoltageElm.WF_DC ? "Voltage" : "Max Voltage"), this.maxVoltage, -20, 20);
      }
      if (n === 1) {
        ei = new EditInfo("Waveform", this.waveform, -1, -1);
        ei.choice = new Array();
        ei.choice.push("D/C");
        ei.choice.push("A/C");
        ei.choice.push("Square Wave");
        ei.choice.push("Triangle");
        ei.choice.push("Sawtooth");
        ei.choice.push("Pulse");
        ei.choice.push(this.waveform);
        return ei;
        if (this.waveform === VoltageElm.WF_DC) {
          return null;
        }
        if (n === 2) {
          return new EditInfo("Frequency (Hz)", this.frequency, 4, 500);
        }
        if (n === 3) {
          return new EditInfo("DC Offset (V)", this.bias, -20, 20);
        }
        if (n === 4) {
          return new EditInfo("Phase Offset (degrees)", this.phaseShift * 180 / Math.PI, -180, 180).setDimensionless();
        }
        if (n === 5 && this.waveform === VoltageElm.WF_SQUARE) {
          return new EditInfo("Duty Cycle", this.dutyCycle * 100, 0, 100).setDimensionless();
        }
      }
    };

    VoltageElm.prototype.setEditValue = function(n, ei) {
      var adj, maxfreq, oldfreq, waveform, _ref, _ref1;
      if (n === 0) {
        this.maxVoltage = ei.value;
      }
      if (n === 3) {
        this.bias = ei.value;
      }
      if (n === 2) {
        oldfreq = this.frequency;
        this.frequency = ei.value;
        maxfreq = 1 / (8 * simParams);
        if (this.frequency > maxfreq) {
          this.frequency = maxfreq;
        }
        adj = this.frequency - oldfreq;
        this.freqTimeZero = ((_ref = this.Circuit) != null ? _ref.time : void 0) - oldfreq * (((_ref1 = this.Circuit) != null ? _ref1.time : void 0) - this.freqTimeZero) / this.frequency;
      }
      if (n === 1) {
        waveform = this.waveform;
        if (this.waveform === VoltageElm.WF_DC && waveform !== VoltageElm.WF_DC) {
          this.bias = 0;
        } else {
          this.waveform !== VoltageElm.WF_DC && waveform === VoltageElm.WF_DC;
        }
        if ((this.waveform === VoltageElm.WF_SQUARE || waveform === VoltageElm.WF_SQUARE) && this.waveform !== waveform) {
          this.setPoints();
        }
      }
      if (n === 4) {
        this.phaseShift = ei.value * Math.PI / 180;
      }
      if (n === 5) {
        return this.dutyCycle = ei.value * 0.01;
      }
    };

    VoltageElm.prototype.toString = function() {
      return "VoltageElm";
    };

    return VoltageElm;

  })(CircuitComponent);

  module.exports = VoltageElm;

}).call(this);


},{"../../settings/settings.coffee":16,"../../render/drawHelper.coffee":27,"../../geom/polygon.coffee":28,"../../geom/rectangle.coffee":29,"../../geom/point.coffee":30,"../circuitComponent.coffee":31}],22:[function(require,module,exports){
(function() {
  var CapacitorElm, CircuitComponent, DrawHelper, Point, Polygon, Rectangle, Settings,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Settings = require('../../settings/settings.coffee');

  DrawHelper = require('../../render/drawHelper.coffee');

  Polygon = require('../../geom/polygon.coffee');

  Rectangle = require('../../geom/rectangle.coffee');

  Point = require('../../geom/point.coffee');

  CircuitComponent = require('../circuitComponent.coffee');

  CapacitorElm = (function(_super) {
    __extends(CapacitorElm, _super);

    CapacitorElm.FLAG_BACK_EULER = 2;

    function CapacitorElm(xa, ya, xb, yb, f, st) {
      CapacitorElm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
      this.capacitance = 5e-6;
      this.compResistance = 11;
      this.voltDiff = 10;
      this.plate1 = [];
      this.plate2 = [];
      this.curSourceValue = 0;
      if (st) {
        if (typeof st === "string") {
          st = st.split(" ");
        }
        this.capacitance = Number(st[0]);
        this.voltDiff = Number(st[1]);
      }
    }

    CapacitorElm.prototype.isTrapezoidal = function() {
      return (this.flags & CapacitorElm.FLAG_BACK_EULER) === 0;
    };

    CapacitorElm.prototype.nonLinear = function() {
      return false;
    };

    CapacitorElm.prototype.setNodeVoltage = function(n, c) {
      CapacitorElm.__super__.setNodeVoltage.call(this, n, c);
      return this.voltDiff = this.volts[0] - this.volts[1];
    };

    CapacitorElm.prototype.reset = function() {
      this.current = this.curcount = 0;
      return this.voltDiff = 1e-3;
    };

    CapacitorElm.prototype.getDumpType = function() {
      return "c";
    };

    CapacitorElm.prototype.dump = function() {
      return "" + CapacitorElm.__super__.dump.apply(this, arguments) + " " + this.capacitance + " " + this.voltDiff;
    };

    CapacitorElm.prototype.setPoints = function() {
      var f, _ref, _ref1;
      CapacitorElm.__super__.setPoints.call(this);
      f = (this.dn / 2 - 4) / this.dn;
      this.lead1 = DrawHelper.interpPoint(this.point1, this.point2, f);
      this.lead2 = DrawHelper.interpPoint(this.point1, this.point2, 1 - f);
      this.plate1 = [new Point(), new Point()];
      this.plate2 = [new Point(), new Point()];
      _ref = DrawHelper.interpPoint2(this.point1, this.point2, f, 12), this.plate1[0] = _ref[0], this.plate1[1] = _ref[1];
      return _ref1 = DrawHelper.interpPoint2(this.point1, this.point2, 1 - f, 12), this.plate2[0] = _ref1[0], this.plate2[1] = _ref1[1], _ref1;
    };

    CapacitorElm.prototype.draw = function(renderContext) {
      var color, hs;
      hs = 12;
      this.setBboxPt(this.point1, this.point2, hs);
      color = DrawHelper.getVoltageColor(this.volts[0]);
      renderContext.drawThickLinePt(this.point1, this.lead1, color);
      renderContext.drawThickLinePt(this.plate1[0], this.plate1[1], color);
      color = DrawHelper.getVoltageColor(this.volts[1]);
      renderContext.drawThickLinePt(this.point2, this.lead2, color);
      renderContext.drawThickLinePt(this.plate2[0], this.plate2[1], color);
      this.drawDots(this.point1, this.lead1, renderContext);
      this.drawDots(this.lead2, this.point2, renderContext);
      return this.drawPosts(renderContext);
    };

    CapacitorElm.prototype.drawUnits = function() {
      var s;
      s = DrawHelper.getUnitText(this.capacitance, "F");
      return this.drawValues(s, hs);
    };

    CapacitorElm.prototype.doStep = function(stamper) {
      return stamper.stampCurrentSource(this.nodes[0], this.nodes[1], this.curSourceValue);
    };

    CapacitorElm.prototype.stamp = function(stamper) {
      if (this.isTrapezoidal()) {
        this.compResistance = this.timeStep() / (2 * this.capacitance);
      } else {
        this.compResistance = this.timeStep() / this.capacitance;
      }
      stamper.stampResistor(this.nodes[0], this.nodes[1], this.compResistance);
      stamper.stampRightSide(this.nodes[0]);
      stamper.stampRightSide(this.nodes[1]);
    };

    CapacitorElm.prototype.startIteration = function() {
      if (this.isTrapezoidal()) {
        this.curSourceValue = -this.voltDiff / this.compResistance - this.current;
      } else {
        this.curSourceValue = -this.voltDiff / this.compResistance;
      }
    };

    CapacitorElm.prototype.calculateCurrent = function() {
      var vdiff;
      vdiff = this.volts[0] - this.volts[1];
      if (this.compResistance > 0) {
        return this.current = vdiff / this.compResistance + this.curSourceValue;
      }
    };

    CapacitorElm.prototype.getInfo = function(arr) {
      var v;
      CapacitorElm.__super__.getInfo.call(this);
      arr[0] = "capacitor";
      this.getBasicInfo(arr);
      arr[3] = "C = " + DrawHelper.getUnitText(this.capacitance, "F");
      arr[4] = "P = " + DrawHelper.getUnitText(this.getPower(), "W");
      v = this.getVoltageDiff();
      return arr[4] = "U = " + DrawHelper.getUnitText(.5 * this.capacitance * v * v, "J");
    };

    CapacitorElm.prototype.getEditInfo = function(n) {
      var ei;
      if (n === 0) {
        return new EditInfo("Capacitance (F)", this.capacitance, 0, 0);
      }
      if (n === 1) {
        ei = new EditInfo("", 0, -1, -1);
        ei.checkbox = "Trapezoidal Approximation";
        return ei;
      }
      return null;
    };

    CapacitorElm.prototype.setEditValue = function(n, ei) {
      if (n === 0 && ei.value > 0) {
        this.capacitance = ei.value;
      }
      if (n === 1) {
        if (ei.isChecked) {
          return this.flags &= ~CapacitorElm.FLAG_BACK_EULER;
        } else {
          return this.flags |= CapacitorElm.FLAG_BACK_EULER;
        }
      }
    };

    CapacitorElm.prototype.needsShortcut = function() {
      return true;
    };

    CapacitorElm.prototype.toString = function() {
      return "CapacitorElm";
    };

    return CapacitorElm;

  })(CircuitComponent);

  module.exports = CapacitorElm;

}).call(this);


},{"../../settings/settings.coffee":16,"../../render/drawHelper.coffee":27,"../../geom/polygon.coffee":28,"../../geom/rectangle.coffee":29,"../../geom/point.coffee":30,"../circuitComponent.coffee":31}],21:[function(require,module,exports){
(function() {
  var CircuitComponent, DrawHelper, Point, Polygon, Rectangle, Settings, WireElm,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Settings = require('../../settings/settings.coffee');

  DrawHelper = require('../../render/drawHelper.coffee');

  Polygon = require('../../geom/polygon.coffee');

  Rectangle = require('../../geom/rectangle.coffee');

  Point = require('../../geom/point.coffee');

  CircuitComponent = require('../circuitComponent.coffee');

  WireElm = (function(_super) {
    __extends(WireElm, _super);

    function WireElm(xa, ya, xb, yb, f, st) {
      WireElm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
    }

    WireElm.prototype.toString = function() {
      return "WireElm";
    };

    WireElm.FLAG_SHOWCURRENT = 1;

    WireElm.FLAG_SHOWVOLTAGE = 2;

    WireElm.prototype.draw = function(renderContext) {
      var s;
      renderContext.drawThickLinePt(this.point1, this.point2, DrawHelper.getVoltageColor(this.volts[0]));
      this.setBboxPt(this.point1, this.point2, 3);
      if (this.mustShowCurrent()) {
        s = DrawHelper.getUnitText(Math.abs(this.getCurrent()), "A");
        this.drawValues(s, 4, renderContext);
      } else if (this.mustShowVoltage()) {
        s = DrawHelper.getUnitText(this.volts[0], "V");
      }
      this.drawValues(s, 4, renderContext);
      this.drawPosts(renderContext);
      return this.drawDots(this.point1, this.point2, renderContext);
    };

    WireElm.prototype.stamp = function(stamper) {
      console.log("\nStamping Wire Elm");
      return stamper.stampVoltageSource(this.nodes[0], this.nodes[1], this.voltSource, 0);
    };

    WireElm.prototype.mustShowCurrent = function() {
      return (this.flags & WireElm.FLAG_SHOWCURRENT) !== 0;
    };

    WireElm.prototype.mustShowVoltage = function() {
      return (this.flags & WireElm.FLAG_SHOWVOLTAGE) !== 0;
    };

    WireElm.prototype.getVoltageSourceCount = function() {
      return 1;
    };

    WireElm.prototype.getInfo = function(arr) {
      WireElm.__super__.getInfo.call(this);
      arr[0] = "Wire";
      arr[1] = "I = " + DrawHelper.getCurrentDText(this.getCurrent());
      return arr[2] = "V = " + DrawHelper.getVoltageText(this.volts[0]);
    };

    WireElm.prototype.getEditInfo = function(n) {};

    WireElm.prototype.setEditValue = function(n, ei) {};

    WireElm.prototype.getDumpType = function() {
      return "w";
    };

    WireElm.prototype.getPower = function() {
      return 0;
    };

    WireElm.prototype.getVoltageDiff = function() {
      return this.volts[0];
    };

    WireElm.prototype.isWire = function() {
      return true;
    };

    WireElm.prototype.needsShortcut = function() {
      return true;
    };

    return WireElm;

  })(CircuitComponent);

  module.exports = WireElm;

}).call(this);


},{"../../settings/settings.coffee":16,"../../render/drawHelper.coffee":27,"../../geom/polygon.coffee":28,"../../geom/rectangle.coffee":29,"../../geom/point.coffee":30,"../circuitComponent.coffee":31}],23:[function(require,module,exports){
(function() {
  var CircuitComponent, DrawHelper, InductorElm, Point, Polygon, Rectangle, Settings,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Settings = require('../../settings/settings.coffee');

  DrawHelper = require('../../render/drawHelper.coffee');

  Polygon = require('../../geom/polygon.coffee');

  Rectangle = require('../../geom/rectangle.coffee');

  Point = require('../../geom/point.coffee');

  CircuitComponent = require('../circuitComponent.coffee');

  InductorElm = (function(_super) {
    __extends(InductorElm, _super);

    InductorElm.FLAG_BACK_EULER = 2;

    function InductorElm(xa, ya, xb, yb, f, st) {
      InductorElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
      this.inductance = 0;
      this.nodes = new Array(2);
      this.flags = 0;
      this.compResistance = 0;
      this.current = 0;
      this.curSourceValue = 0;
      if (st) {
        if (typeof st === "string") {
          st = st.split(" ");
        }
        this.inductance = parseFloat(st[0]);
        this.current = parseFloat(st[1]);
      }
    }

    InductorElm.prototype.stamp = function(stamper) {
      var ts;
      ts = this.getParentCircuit().timeStep();
      console.log(ts);
      console.log(this.inductance);
      if (this.isTrapezoidal()) {
        this.compResistance = 2 * this.inductance / ts;
      } else {
        this.compResistance = this.inductance / ts;
      }
      stamper.stampResistor(this.nodes[0], this.nodes[1], this.compResistance);
      stamper.stampRightSide(this.nodes[0]);
      return stamper.stampRightSide(this.nodes[1]);
    };

    InductorElm.prototype.doStep = function(stamper) {
      return stamper.stampCurrentSource(this.nodes[0], this.nodes[1], this.curSourceValue);
    };

    InductorElm.prototype.draw = function(renderContext) {
      var hs, unit_text, v1, v2;
      v1 = this.volts[0];
      v2 = this.volts[1];
      hs = 8;
      this.setBboxPt(this.point1, this.point2, hs);
      this.draw2Leads(renderContext);
      DrawHelper.drawCoil(8, this.lead1, this.lead2, v1, v2, renderContext);
      unit_text = DrawHelper.getUnitText(this.inductance, "H");
      this.drawValues(unit_text, hs, renderContext);
      this.drawPosts(renderContext);
      return this.drawDots(this.point1, this.point2, renderContext);
    };

    InductorElm.prototype.dump = function() {
      return "" + (InductorElm.__super__.dump.call(this)) + " " + this.inductance + " " + this.current;
    };

    InductorElm.prototype.getDumpType = function() {
      return "l";
    };

    InductorElm.prototype.startIteration = function() {
      if (this.isTrapezoidal()) {
        return this.curSourceValue = this.getVoltageDiff() / this.compResistance + this.current;
      } else {
        return this.curSourceValue = this.current;
      }
    };

    InductorElm.prototype.nonLinear = function() {
      return false;
    };

    InductorElm.prototype.isTrapezoidal = function() {
      return (this.flags & InductorElm.FLAG_BACK_EULER) === 0;
    };

    InductorElm.prototype.calculateCurrent = function() {
      if (this.compResistance > 0) {
        this.current = this.getVoltageDiff() / this.compResistance + this.curSourceValue;
      }
      return this.current;
    };

    InductorElm.prototype.getInfo = function(arr) {
      arr[0] = "inductor";
      this.getBasicInfo(arr);
      arr[3] = "L = " + DrawHelper.getUnitText(this.inductance, "H");
      return arr[4] = "P = " + DrawHelper.getUnitText(this.getPower(), "W");
    };

    InductorElm.prototype.reset = function() {
      this.current = 0;
      this.volts[0] = 0;
      this.volts[1] = 0;
      return this.curcount = 0;
    };

    InductorElm.prototype.getVoltageDiff = function() {
      return this.volts[0] - this.volts[1];
    };

    InductorElm.prototype.toString = function() {
      return "InductorElm";
    };

    InductorElm.prototype.getEditInfo = function(n) {
      var ei;
      if (n === 0) {
        return new EditInfo("Inductance (H)", this.inductance, 0, 0);
      }
      if (n === 1) {
        ei = new EditInfo("", 0, -1, -1);
        ei.checkbox = "Trapezoidal Approximation";
        return ei;
      }
      return null;
    };

    InductorElm.prototype.setEditValue = function(n, ei) {
      if (n === 0) {
        this.inductance = ei.value;
      }
      if (n === 1) {
        if (ei.checkbox.getState()) {
          return this.flags &= ~Inductor.FLAG_BACK_EULER;
        } else {
          return this.flags |= Inductor.FLAG_BACK_EULER;
        }
      }
    };

    InductorElm.prototype.setPoints = function() {
      InductorElm.__super__.setPoints.call(this);
      return this.calcLeads(32);
    };

    return InductorElm;

  })(CircuitComponent);

  module.exports = InductorElm;

}).call(this);


},{"../../settings/settings.coffee":16,"../../render/drawHelper.coffee":27,"../../geom/polygon.coffee":28,"../../geom/rectangle.coffee":29,"../../geom/point.coffee":30,"../circuitComponent.coffee":31}],24:[function(require,module,exports){
(function() {
  var CircuitComponent, CurrentElm, DrawHelper, Point, Polygon, Rectangle, Settings,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Settings = require('../../settings/settings.coffee');

  DrawHelper = require('../../render/drawHelper.coffee');

  Polygon = require('../../geom/polygon.coffee');

  Rectangle = require('../../geom/rectangle.coffee');

  Point = require('../../geom/point.coffee');

  CircuitComponent = require('../circuitComponent.coffee');

  CurrentElm = (function(_super) {
    __extends(CurrentElm, _super);

    function CurrentElm(xa, ya, xb, yb, f, st) {
      var e;
      CurrentElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
      try {
        if (typeof st === "string") {
          st = st.split(" ");
        }
        this.currentValue || (this.currentValue = parseFloat(st[0]));
      } catch (_error) {
        e = _error;
        this.currentValue = .01;
      }
    }

    CurrentElm.prototype.dump = function() {
      return CurrentElm.__super__.dump.call(this) + " " + this.currentValue;
    };

    CurrentElm.prototype.getDumpType = function() {
      return "i";
    };

    CurrentElm.prototype.setPoints = function() {
      var p2;
      CurrentElm.__super__.setPoints.call(this);
      this.calcLeads(26);
      this.ashaft1 = DrawHelper.interpPoint(this.lead1, this.lead2, .25);
      this.ashaft2 = DrawHelper.interpPoint(this.lead1, this.lead2, .6);
      this.center = DrawHelper.interpPoint(this.lead1, this.lead2, .5);
      p2 = DrawHelper.interpPoint(this.lead1, this.lead2, .75);
      return this.arrow = DrawHelper.calcArrow(this.center, p2, 4, 4);
    };

    CurrentElm.prototype.draw = function(renderContext) {
      var color, cr;
      cr = 12;
      this.draw2Leads(renderContext);
      color = DrawHelper.getVoltageColor((this.volts[0] + this.volts[1]) / 2);
      renderContext.drawCircle(this.center.x, this.center.y, cr);
      renderContext.drawCircle(this.ashaft1, this.ashaft2);
      renderContext.fillPolygon(this.arrow);
      renderContext.setBboxPt(this.point1, this.point2, cr);
      this.drawPosts(renderContext);
      return this.doDots(renderContext);
    };

    CurrentElm.prototype.stamp = function(stamper) {
      this.current = this.currentValue;
      return stamper.stampCurrentSource(this.nodes[0], this.nodes[1], this.current);
    };

    CurrentElm.prototype.getInfo = function(arr) {
      CurrentElm.__super__.getInfo.call(this);
      arr[0] = "current source";
      return this.getBasicInfo(arr);
    };

    CurrentElm.prototype.getVoltageDiff = function() {
      return this.volts[1] - this.volts[0];
    };

    return CurrentElm;

  })(CircuitComponent);

  module.exports = CurrentElm;

}).call(this);


},{"../../settings/settings.coffee":16,"../../render/drawHelper.coffee":27,"../../geom/polygon.coffee":28,"../../geom/rectangle.coffee":29,"../../geom/point.coffee":30,"../circuitComponent.coffee":31}],25:[function(require,module,exports){
(function() {
  var MathUtils;

  MathUtils = (function() {
    function MathUtils() {}

    MathUtils.isInfinite = function(num) {
      return num > 1e18 || !isFinite(num);
    };

    MathUtils.sign = function(x) {
      if (x < 0) {
        return -1;
      } else if (x === 0) {
        return 0;
      } else {
        return 1;
      }
    };

    MathUtils.getRand = function(x) {
      return Math.floor(Math.random() * (x + 1));
    };

    return MathUtils;

  })();

  module.exports = MathUtils;

}).call(this);


},{}],29:[function(require,module,exports){
(function() {
  var Rectangle;

  Rectangle = (function() {
    function Rectangle(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }

    Rectangle.prototype.contains = function(x, y) {
      return x >= this.x && x <= (this.x + this.width) && y >= this.y && (y <= this.y + this.height);
    };

    Rectangle.prototype.equals = function(otherRect) {
      if (otherRect != null) {
        if (otherRect.x === this.x && otherRect.y === this.y && otherRect.width === this.width && otherRect.height === this.height) {
          return true;
        }
      }
      return false;
    };

    Rectangle.prototype.intersects = function(otherRect) {
      var otherX, otherX2, otherY, otherY2;
      this.x2 = this.x + this.width;
      this.y2 = this.y + this.height;
      otherX = otherRect.x;
      otherY = otherRect.y;
      otherX2 = otherRect.x + otherRect.width;
      otherY2 = otherRect.y + otherRect.height;
      return this.x < otherX2 && this.x2 > otherX && this.y < otherY2 && this.y2 > otherY;
    };

    Rectangle.prototype.collidesWithComponent = function(circuitComponent) {
      return this.intersects(circuitComponent.getBoundingBox());
    };

    return Rectangle;

  })();

  module.exports = Rectangle;

}).call(this);


},{}],28:[function(require,module,exports){
(function() {
  var Polygon;

  Polygon = (function() {
    function Polygon(vertices) {
      var i;
      this.vertices = [];
      if (vertices && vertices.length % 2 === 0) {
        i = 0;
        while (i < vertices.length) {
          this.addVertex(vertices[i], vertices[i + 1]);
          i += 2;
        }
      }
    }

    Polygon.prototype.addVertex = function(x, y) {
      return this.vertices.push(new Point(x, y));
    };

    Polygon.prototype.getX = function(n) {
      return this.vertices[n].x;
    };

    Polygon.prototype.getY = function(n) {
      return this.vertices[n].y;
    };

    Polygon.prototype.numPoints = function() {
      return this.vertices.length;
    };

    return Polygon;

  })();

  module.exports = Polygon;

}).call(this);


},{}],30:[function(require,module,exports){
(function() {
  var Point;

  Point = (function() {
    function Point(x, y) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
    }

    Point.prototype.equals = function(otherPoint) {
      return this.x === otherPoint.x && this.y === otherPoint.y;
    };

    Point.toArray = function(num) {
      var i, _i, _len, _ref, _results;
      _ref = Array(num);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        _results.push(new Point(0, 0));
      }
      return _results;
    };

    Point.comparePair = function(x1, x2, y1, y2) {
      return (x1 === y1 && x2 === y2) || (x1 === y2 && x2 === y1);
    };

    Point.distanceSq = function(x1, y1, x2, y2) {
      x2 -= x1;
      y2 -= y1;
      return x2 * x2 + y2 * y2;
    };

    Point.prototype.toString = function() {
      return "[\t" + this.x + ", \t" + this.y + "]";
    };

    return Point;

  })();

  module.exports = Point;

}).call(this);


},{}],27:[function(require,module,exports){
(function() {
  var DrawHelper, Point, Polygon, Rectangle, Settings;

  Settings = require('../settings/settings.coffee');

  Polygon = require('../geom/polygon.coffee');

  Rectangle = require('../geom/rectangle.coffee');

  Point = require('../geom/point.coffee');

  DrawHelper = (function() {
    var EPSILON;

    function DrawHelper() {}

    DrawHelper.ps1 = new Point(0, 0);

    DrawHelper.ps2 = new Point(0, 0);

    DrawHelper.colorScaleCount = 32;

    DrawHelper.colorScale = [];

    DrawHelper.muString = "u";

    DrawHelper.ohmString = "ohm";

    EPSILON = 0.48;

    DrawHelper.initializeColorScale = function() {
      var i, n1, n2, voltage, _i, _ref, _results;
      this.colorScale = new Array(this.colorScaleCount);
      _results = [];
      for (i = _i = 0, _ref = this.colorScaleCount; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        voltage = i * 2 / this.colorScaleCount - 1;
        if (voltage < 0) {
          n1 = Math.floor((128 * -voltage) + 127);
          n2 = Math.floor(127 * (1 + voltage));
          _results.push(this.colorScale[i] = new Color(n1, n2, n2));
        } else {
          n1 = Math.floor((128 * voltage) + 127);
          n2 = Math.floor(127 * (1 - voltage));
          _results.push(this.colorScale[i] = new Color(n2, n1, n2));
        }
      }
      return _results;
    };

    DrawHelper.scale = ["#ff0000", "#f70707", "#ef0f0f", "#e71717", "#df1f1f", "#d72727", "#cf2f2f", "#c73737", "#bf3f3f", "#b74747", "#af4f4f", "#a75757", "#9f5f5f", "#976767", "#8f6f6f", "#877777", "#7f7f7f", "#778777", "#6f8f6f", "#679767", "#5f9f5f", "#57a757", "#4faf4f", "#47b747", "#3fbf3f", "#37c737", "#2fcf2f", "#27d727", "#1fdf1f", "#17e717", "#0fef0f", "#07f707", "#00ff00"];

    DrawHelper.unitsFont = "Arial, Helvetica, sans-serif";

    DrawHelper.interpPoint = function(ptA, ptB, f, g) {
      var gx, gy, ptOut;
      if (g == null) {
        g = 0;
      }
      gx = ptB.y - ptA.y;
      gy = ptA.x - ptB.x;
      g /= Math.sqrt(gx * gx + gy * gy);
      ptOut = new Point();
      ptOut.x = Math.floor((1 - f) * ptA.x + (f * ptB.x) + g * gx + EPSILON);
      ptOut.y = Math.floor((1 - f) * ptA.y + (f * ptB.y) + g * gy + EPSILON);
      return ptOut;
    };

    DrawHelper.interpPoint2 = function(ptA, ptB, f, g) {
      var gx, gy, ptOut1, ptOut2;
      gx = ptB.y - ptA.y;
      gy = ptA.x - ptB.x;
      g /= Math.sqrt(gx * gx + gy * gy);
      ptOut1 = new Point();
      ptOut2 = new Point();
      ptOut1.x = Math.floor((1 - f) * ptA.x + (f * ptB.x) + g * gx + EPSILON);
      ptOut1.y = Math.floor((1 - f) * ptA.y + (f * ptB.y) + g * gy + EPSILON);
      ptOut2.x = Math.floor((1 - f) * ptA.x + (f * ptB.x) - g * gx + EPSILON);
      ptOut2.y = Math.floor((1 - f) * ptA.y + (f * ptB.y) - g * gy + EPSILON);
      return [ptOut1, ptOut2];
    };

    DrawHelper.calcArrow = function(point1, point2, al, aw) {
      var dist, dx, dy, p1, p2, poly, _ref;
      poly = new Polygon();
      dx = point2.x - point1.x;
      dy = point2.y - point1.y;
      dist = Math.sqrt(dx * dx + dy * dy);
      poly.addVertex(point2.x, point2.y);
      _ref = this.interpPoint2(point1, point2, 1 - al / dist, aw), p1 = _ref[0], p2 = _ref[1];
      poly.addVertex(p1.x, p1.y);
      poly.addVertex(p2.x, p2.y);
      return poly;
    };

    DrawHelper.createPolygon = function(pt1, pt2, pt3, pt4) {
      var newPoly;
      newPoly = new Polygon();
      newPoly.addVertex(pt1.x, pt1.y);
      newPoly.addVertex(pt2.x, pt2.y);
      newPoly.addVertex(pt3.x, pt3.y);
      if (pt4) {
        newPoly.addVertex(pt4.x, pt4.y);
      }
      return newPoly;
    };

    DrawHelper.createPolygonFromArray = function(vertexArray) {
      var newPoly, vertex, _i, _len;
      newPoly = new Polygon();
      for (_i = 0, _len = vertexArray.length; _i < _len; _i++) {
        vertex = vertexArray[_i];
        newPoly.addVertex(vertex.x, vertex.y);
      }
      return newPoly;
    };

    DrawHelper.drawCoil = function(hs, point1, point2, vStart, vEnd, renderContext) {
      var color, cx, hsx, i, segments, voltageLevel, _i, _results;
      segments = 40;
      this.ps1.x = point1.x;
      this.ps1.y = point1.y;
      _results = [];
      for (i = _i = 0; 0 <= segments ? _i < segments : _i > segments; i = 0 <= segments ? ++_i : --_i) {
        cx = (((i + 1) * 8 / segments) % 2) - 1;
        hsx = Math.sqrt(1 - cx * cx);
        this.ps2 = this.interpPoint(point1, point2, i / segments, hsx * hs);
        voltageLevel = vStart + (vEnd - vStart) * i / segments;
        color = this.getVoltageColor(voltageLevel);
        renderContext.drawThickLinePt(this.ps1, this.ps2, color);
        this.ps1.x = this.ps2.x;
        _results.push(this.ps1.y = this.ps2.y);
      }
      return _results;
    };

    DrawHelper.getShortUnitText = function(value, unit) {
      return this.getUnitText(value, unit, 1);
    };

    DrawHelper.getUnitText = function(value, unit, decimalPoints) {
      var absValue;
      if (decimalPoints == null) {
        decimalPoints = 2;
      }
      absValue = Math.abs(value);
      if (absValue < 1e-18) {
        return "0 " + unit;
      }
      if (absValue < 1e-12) {
        return (value * 1e15).toFixed(decimalPoints) + " f" + unit;
      }
      if (absValue < 1e-9) {
        return (value * 1e12).toFixed(decimalPoints) + " p" + unit;
      }
      if (absValue < 1e-6) {
        return (value * 1e9).toFixed(decimalPoints) + " n" + unit;
      }
      if (absValue < 1e-3) {
        return (value * 1e6).toFixed(decimalPoints) + " " + this.muString + unit;
      }
      if (absValue < 1) {
        return (value * 1e3).toFixed(decimalPoints) + " m" + unit;
      }
      if (absValue < 1e3) {
        return value.toFixed(decimalPoints) + " " + unit;
      }
      if (absValue < 1e6) {
        return (value * 1e-3).toFixed(decimalPoints) + " k" + unit;
      }
      if (absValue < 1e9) {
        return (value * 1e-6).toFixed(decimalPoints) + " M" + unit;
      }
      return (value * 1e-9).toFixed(decimalPoints) + " G" + unit;
    };

    DrawHelper.getVoltageDText = function(v) {
      return this.getUnitText(Math.abs(v), "V");
    };

    DrawHelper.getVoltageText = function(v) {
      return this.getUnitText(v, "V");
    };

    DrawHelper.getCurrentText = function(value) {
      return this.getUnitText(value, "A");
    };

    DrawHelper.getCurrentDText = function(value) {
      return this.getUnitText(Math.abs(value), "A");
    };

    DrawHelper.getVoltageColor = function(volts, fullScaleVRange) {
      var value;
      if (fullScaleVRange == null) {
        fullScaleVRange = 10;
      }
      value = Math.floor((volts + fullScaleVRange) * (this.colorScaleCount - 1) / (2 * fullScaleVRange));
      if (value < 0) {
        value = 0;
      } else if (value >= this.colorScaleCount) {
        value = this.colorScaleCount - 1;
      }
      return this.scale[value];
    };

    DrawHelper.getPowerColor = function(power, scaleFactor) {
      var b, powerLevel, rg;
      if (scaleFactor == null) {
        scaleFactor = 1;
      }
      if (!Settings.powerCheckItem) {
        return;
      }
      powerLevel = power * scaleFactor;
      power = Math.abs(powerLevel);
      if (power > 1) {
        power = 1;
      }
      rg = 128 + Math.floor(power * 127);
      return b = Math.floor(128 * (1 - power));
    };

    return DrawHelper;

  })();

  module.exports = DrawHelper;

}).call(this);


},{"../settings/settings.coffee":16,"../geom/polygon.coffee":28,"../geom/rectangle.coffee":29,"../geom/point.coffee":30}],26:[function(require,module,exports){
(function() {
  var CircuitComponent, DrawHelper, Point, Polygon, Rectangle, ResistorElm, Settings,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Settings = require('../../settings/settings.coffee');

  DrawHelper = require('../../render/drawHelper.coffee');

  Polygon = require('../../geom/polygon.coffee');

  Rectangle = require('../../geom/rectangle.coffee');

  Point = require('../../geom/point.coffee');

  CircuitComponent = require('../circuitComponent.coffee');

  ResistorElm = (function(_super) {
    __extends(ResistorElm, _super);

    function ResistorElm(xa, ya, xb, yb, f, st) {
      if (f == null) {
        f = 0;
      }
      if (st == null) {
        st = null;
      }
      ResistorElm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
      if (st && st.length > 0) {
        this.resistance = parseFloat(st);
      } else {
        this.resistance = 500;
      }
      this.ps3 = new Point(100, 50);
      this.ps4 = new Point(100, 150);
    }

    ResistorElm.prototype.draw = function(renderContext) {
      var hs, i, newOffset, oldOffset, pt1, pt2, resistanceVal, segf, segments, volt1, volt2, voltDrop, _i;
      segments = 16;
      oldOffset = 0;
      hs = 6;
      volt1 = this.volts[0];
      volt2 = this.volts[1];
      this.setBboxPt(this.point1, this.point2, hs);
      this.draw2Leads(renderContext);
      DrawHelper.getPowerColor(this.getPower);
      segf = 1 / segments;
      for (i = _i = 0; 0 <= segments ? _i < segments : _i > segments; i = 0 <= segments ? ++_i : --_i) {
        newOffset = 0;
        switch (i & 3) {
          case 0:
            newOffset = 1;
            break;
          case 2:
            newOffset = -1;
            break;
          default:
            newOffset = 0;
        }
        voltDrop = volt1 + (volt2 - volt1) * i / segments;
        pt1 = DrawHelper.interpPoint(this.lead1, this.lead2, i * segf, hs * oldOffset);
        pt2 = DrawHelper.interpPoint(this.lead1, this.lead2, (i + 1) * segf, hs * newOffset);
        renderContext.drawThickLinePt(pt1, pt2, DrawHelper.getVoltageColor(voltDrop));
        oldOffset = newOffset;
      }
      resistanceVal = DrawHelper.getUnitText(this.resistance, "ohm");
      this.drawValues(resistanceVal, hs, renderContext);
      this.drawDots(this.point1, this.point2, renderContext);
      return this.drawPosts(renderContext);
    };

    ResistorElm.prototype.dump = function() {
      return ResistorElm.__super__.dump.call(this) + " " + this.resistance;
    };

    ResistorElm.prototype.getDumpType = function() {
      return "r";
    };

    ResistorElm.prototype.getEditInfo = function(n) {
      if (n === 0) {
        return new EditInfo("Resistance (ohms):", this.resistance, 0, 0);
      }
      return null;
    };

    ResistorElm.prototype.setEditValue = function(n, ei) {
      if (ei.value > 0) {
        return this.resistance = ei.value;
      }
    };

    ResistorElm.prototype.getInfo = function(arr) {
      arr[0] = "resistor";
      this.getBasicInfo(arr);
      arr[3] = "R = " + DrawHelper.getUnitText(this.resistance, DrawHelper.ohmString);
      arr[4] = "P = " + DrawHelper.getUnitText(this.getPower(), "W");
      return arr;
    };

    ResistorElm.prototype.needsShortcut = function() {
      return true;
    };

    ResistorElm.prototype.calculateCurrent = function() {
      return this.current = (this.volts[0] - this.volts[1]) / this.resistance;
    };

    ResistorElm.prototype.setPoints = function() {
      ResistorElm.__super__.setPoints.call(this);
      this.calcLeads(32);
      this.ps3 = new Point(0, 0);
      return this.ps4 = new Point(0, 0);
    };

    ResistorElm.prototype.stamp = function(stamper) {
      console.log("\nStamping Resistor Elm");
      if (this.orphaned()) {
        console.warn("attempting to stamp an orphaned resistor");
      }
      return stamper.stampResistor(this.nodes[0], this.nodes[1], this.resistance);
    };

    ResistorElm.prototype.toString = function() {
      return "ResistorElm";
    };

    return ResistorElm;

  })(CircuitComponent);

  module.exports = ResistorElm;

}).call(this);


},{"../../settings/settings.coffee":16,"../../render/drawHelper.coffee":27,"../../geom/polygon.coffee":28,"../../geom/rectangle.coffee":29,"../../geom/point.coffee":30,"../circuitComponent.coffee":31}],31:[function(require,module,exports){
(function() {
  var ArrayUtils, CircuitComponent, DrawHelper, MathUtils, Point, Rectangle, Settings,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Settings = require('../settings/settings.coffee');

  DrawHelper = '../render/drawHelper.coffee';

  Rectangle = require('../geom/rectangle.coffee');

  Point = require('../geom/point.coffee');

  MathUtils = require('../util/mathUtils.coffee');

  ArrayUtils = require('../util/arrayUtils.coffee');

  CircuitComponent = (function() {
    function CircuitComponent(x1, y1, x2, y2, flags, st) {
      this.x1 = x1 != null ? x1 : 100;
      this.y1 = y1 != null ? y1 : 100;
      this.x2 = x2 != null ? x2 : 100;
      this.y2 = y2 != null ? y2 : 200;
      if (flags == null) {
        flags = 0;
      }
      if (st == null) {
        st = [];
      }
      this.drawDots = __bind(this.drawDots, this);
      this.destroy = __bind(this.destroy, this);
      this.current = 0;
      this.curcount = 0;
      this.noDiagonal = false;
      this.selected = false;
      this.dragging = false;
      this.parentCircuit = null;
      this.focused = false;
      this.flags = flags || this.getDefaultFlags();
      this.setPoints();
      this.allocNodes();
      this.initBoundingBox();
      this.component_id = MathUtils.getRand(100000000) + (new Date()).getTime();
    }

    CircuitComponent.prototype.getParentCircuit = function() {
      return this.Circuit;
    };

    CircuitComponent.prototype.isBeingDragged = function() {
      return this.dragging;
    };

    CircuitComponent.prototype.beingDragged = function(dragging) {
      return this.dragging = dragging;
    };

    CircuitComponent.prototype.allocNodes = function() {
      this.nodes = ArrayUtils.zeroArray(this.getPostCount() + this.getInternalNodeCount());
      return this.volts = ArrayUtils.zeroArray(this.getPostCount() + this.getInternalNodeCount());
    };

    CircuitComponent.prototype.setPoints = function() {
      this.dx = this.x2 - this.x1;
      this.dy = this.y2 - this.y1;
      this.dn = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
      this.dpx1 = this.dy / this.dn;
      this.dpy1 = -this.dx / this.dn;
      this.dsign = (this.dy === 0 ? MathUtils.sign(this.dx) : MathUtils.sign(this.dy));
      this.point1 = new Point(this.x1, this.y1);
      return this.point2 = new Point(this.x2, this.y2);
    };

    CircuitComponent.prototype.setPowerColor = function(color) {
      return console.warn("Set power color not yet implemented");
    };

    CircuitComponent.prototype.getDumpType = function() {
      return 0;
    };

    CircuitComponent.prototype.reset = function() {
      this.volts = ArrayUtils.zeroArray(this.volts.length);
      return this.curcount = 0;
    };

    CircuitComponent.prototype.setCurrent = function(x, current) {
      return this.current = current;
    };

    CircuitComponent.prototype.getCurrent = function() {
      return this.current;
    };

    CircuitComponent.prototype.getVoltageDiff = function() {
      return this.volts[0] - this.volts[1];
    };

    CircuitComponent.prototype.getPower = function() {
      return this.getVoltageDiff() * this.current;
    };

    CircuitComponent.prototype.calculateCurrent = function() {};

    CircuitComponent.prototype.doStep = function() {};

    CircuitComponent.prototype.orphaned = function() {
      return this.Circuit === null || this.Circuit === void 0;
    };

    CircuitComponent.prototype.destroy = function() {
      return this.Circuit.desolder(this);
    };

    CircuitComponent.prototype.startIteration = function() {};

    CircuitComponent.prototype.getPostVoltage = function(post_idx) {
      return this.volts[post_idx];
    };

    CircuitComponent.prototype.setNodeVoltage = function(node_idx, voltage) {
      this.volts[node_idx] = voltage;
      return this.calculateCurrent();
    };

    CircuitComponent.prototype.calcLeads = function(len) {
      if (this.dn < len || len === 0) {
        this.lead1 = this.point1;
        this.lead2 = this.point2;
        console.log("Len: " + len);
        return;
      }
      this.lead1 = DrawHelper.interpPoint(this.point1, this.point2, (this.dn - len) / (2 * this.dn));
      return this.lead2 = DrawHelper.interpPoint(this.point1, this.point2, (this.dn + len) / (2 * this.dn));
    };

    CircuitComponent.prototype.updateDotCount = function(cur, cc) {
      var cadd;
      if (isNaN(cur) || (cur == null)) {
        cur = this.current;
      }
      if (isNaN(cc) || (cc == null)) {
        cc = this.curcount;
      }
      cadd = cur * this.Circuit.Params.getCurrentMult();
      cadd %= 8;
      this.curcount = cc + cadd;
      return this.curcount;
    };

    CircuitComponent.prototype.getDefaultFlags = function() {
      return 0;
    };

    CircuitComponent.prototype.equal_to = function(otherComponent) {
      return this.component_id === otherComponent.component_id;
    };

    CircuitComponent.prototype.drag = function(newX, newY) {
      newX = this.Circuit.snapGrid(newX);
      newY = this.Circuit.snapGrid(newY);
      if (this.noDiagonal) {
        if (Math.abs(this.x1 - newX) < Math.abs(this.y1 - newY)) {
          newX = this.x1;
        } else {
          newY = this.y1;
        }
      }
      this.x2 = newX;
      this.y2 = newY;
      return this.setPoints();
    };

    CircuitComponent.prototype.move = function(deltaX, deltaY) {
      this.x1 += deltaX;
      this.y1 += deltaY;
      this.x2 += deltaX;
      this.y2 += deltaY;
      this.boundingBox.x += deltaX;
      this.boundingBox.y += deltaY;
      return this.setPoints();
    };

    CircuitComponent.prototype.allowMove = function(deltaX, deltaY) {
      var circuitElm, newX, newX2, newY, newY2, _i, _len, _ref;
      newX = this.x1 + deltaX;
      newY = this.y1 + deltaY;
      newX2 = this.x2 + deltaX;
      newY2 = this.y2 + deltaY;
      _ref = this.Circuit.elementList;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        circuitElm = _ref[_i];
        if (circuitElm.x1 === newX && circuitElm.y1 === newY && circuitElm.x2 === newX2 && circuitElm.y2 === newY2) {
          return false;
        }
        if (circuitElm.x1 === newX2 && circuitElm.y1 === newY2 && circuitElm.x2 === newX && circuitElm.y2 === newY) {
          return false;
        }
      }
      return true;
    };

    CircuitComponent.prototype.movePoint = function(n, deltaX, deltaY) {
      if (n === 0) {
        this.x1 += deltaX;
        this.y1 += deltaY;
      } else {
        this.x2 += deltaX;
        this.y2 += deltaY;
      }
      return this.setPoints();
    };

    CircuitComponent.prototype.stamp = function() {
      throw "Called abstract function stamp() in Circuit " + (this.getDumpType());
    };

    CircuitComponent.prototype.getDumpClass = function() {
      return this.toString();
    };

    CircuitComponent.prototype.toString = function() {
      return console.error("Virtual call on toString in circuitComponent was " + (this.dump()));
    };

    CircuitComponent.prototype.dump = function() {
      return this.getDumpType() + " " + this.x1 + " " + this.y1 + " " + this.x2 + " " + this.y2 + " " + this.flags;
    };

    CircuitComponent.prototype.getVoltageSourceCount = function() {
      return 0;
    };

    CircuitComponent.prototype.getInternalNodeCount = function() {
      return 0;
    };

    CircuitComponent.prototype.setNode = function(nodeIdx, newValue) {
      return this.nodes[nodeIdx] = newValue;
    };

    CircuitComponent.prototype.setVoltageSource = function(node, value) {
      return this.voltSource = value;
    };

    CircuitComponent.prototype.getVoltageSource = function() {
      return this.voltSource;
    };

    CircuitComponent.prototype.nonLinear = function() {
      return false;
    };

    CircuitComponent.prototype.getPostCount = function() {
      return 2;
    };

    CircuitComponent.prototype.getNode = function(nodeIdx) {
      return this.nodes[nodeIdx];
    };

    CircuitComponent.prototype.getPost = function(postIdx) {
      if (postIdx === 0) {
        return this.point1;
      } else if (postIdx === 1) {
        return this.point2;
      }
      return console.printStackTrace();
    };

    CircuitComponent.prototype.getBoundingBox = function() {
      return this.boundingBox;
    };

    CircuitComponent.prototype.initBoundingBox = function() {
      this.boundingBox = new Rectangle();
      this.boundingBox.x = Math.min(this.x1, this.x2);
      this.boundingBox.y = Math.min(this.y1, this.y2);
      this.boundingBox.width = Math.abs(this.x2 - this.x1) + 1;
      return this.boundingBox.height = Math.abs(this.y2 - this.y1) + 1;
    };

    CircuitComponent.prototype.setBbox = function(x1, y1, x2, y2) {
      var temp;
      if (x1 > x2) {
        temp = x1;
        x1 = x2;
        x2 = temp;
      }
      if (y1 > y2) {
        temp = y1;
        y1 = y2;
        y2 = temp;
      }
      this.boundingBox.x = x1;
      this.boundingBox.y = y1;
      this.boundingBox.width = x2 - x1 + 1;
      return this.boundingBox.height = y2 - y1 + 1;
    };

    CircuitComponent.prototype.setBboxPt = function(p1, p2, width) {
      var deltaX, deltaY;
      this.setBbox(p1.x, p1.y, p2.x, p2.y);
      deltaX = this.dpx1 * width;
      deltaY = this.dpy1 * width;
      return this.adjustBbox(p1.x + deltaX, p1.y + deltaY, p1.x - deltaX, p1.y - deltaY);
    };

    CircuitComponent.prototype.adjustBbox = function(x1, y1, x2, y2) {
      var q;
      if (x1 > x2) {
        q = x1;
        x1 = x2;
        x2 = q;
      }
      if (y1 > y2) {
        q = y1;
        y1 = y2;
        y2 = q;
      }
      x1 = Math.min(this.boundingBox.x, x1);
      y1 = Math.min(this.boundingBox.y, y1);
      x2 = Math.max(this.boundingBox.x + this.boundingBox.width - 1, x2);
      y2 = Math.max(this.boundingBox.y + this.boundingBox.height - 1, y2);
      this.boundingBox.x = x1;
      this.boundingBox.y = y1;
      this.boundingBox.width = x2 - x1;
      return this.boundingBox.height = y2 - y1;
    };

    CircuitComponent.prototype.adjustBboxPt = function(p1, p2) {
      return this.adjustBbox(p1.x, p1.y, p2.x, p2.y);
    };

    CircuitComponent.prototype.isCenteredText = function() {
      return false;
    };

    CircuitComponent.prototype.getInfo = function(arr) {
      return arr = new Array(15);
    };

    CircuitComponent.prototype.getEditInfo = function(n) {
      throw "Called abstract function getEditInfo() in AbstractCircuitElement";
    };

    CircuitComponent.prototype.setEditValue = function(n, ei) {
      throw "Called abstract function setEditInfo() in AbstractCircuitElement";
    };

    CircuitComponent.prototype.getBasicInfo = function(arr) {
      arr[1] = "I = " + DrawHelper.getCurrentDText(this.getCurrent());
      arr[2] = "Vd = " + DrawHelper.getVoltageDText(this.getVoltageDiff());
      return 3;
    };

    CircuitComponent.prototype.getScopeValue = function(x) {
      if (x === 1) {
        return this.getPower();
      } else {
        return this.getVoltageDiff();
      }
    };

    CircuitComponent.getScopeUnits = function(x) {
      if (x === 1) {
        return "W";
      } else {
        return "V";
      }
    };

    CircuitComponent.prototype.getConnection = function(n1, n2) {
      return true;
    };

    CircuitComponent.prototype.hasGroundConnection = function(n1) {
      return false;
    };

    CircuitComponent.prototype.isWire = function() {
      return false;
    };

    CircuitComponent.prototype.canViewInScope = function() {
      return this.getPostCount() <= 2;
    };

    CircuitComponent.prototype.needsHighlight = function() {
      return this.focused;
    };

    CircuitComponent.prototype.setSelected = function(selected) {
      return this.selected = selected;
    };

    CircuitComponent.prototype.isSelected = function() {
      return this.selected;
    };

    CircuitComponent.prototype.needsShortcut = function() {
      return false;
    };

    /**/


    /**/


    CircuitComponent.prototype.draw = function(renderContext) {
      this.curcount = this.updateDotCount();
      this.drawPosts(renderContext);
      return this.draw2Leads(renderContext);
    };

    CircuitComponent.prototype.draw2Leads = function(renderContext) {
      if ((this.point1 != null) && (this.lead1 != null)) {
        renderContext.drawThickLinePt(this.point1, this.lead1, DrawHelper.getVoltageColor(this.volts[0]));
      }
      if ((this.point2 != null) && (this.lead2 != null)) {
        return renderContext.drawThickLinePt(this.lead2, this.point2, DrawHelper.getVoltageColor(this.volts[1]));
      }
    };

    CircuitComponent.prototype.drawDots = function(point1, point2, renderContext) {
      var currentIncrement, dn, ds, dx, dy, newPos, x0, y0, _ref, _results;
      if (point1 == null) {
        point1 = this.point1;
      }
      if (point2 == null) {
        point2 = this.point2;
      }
      if (((_ref = this.Circuit) != null ? _ref.isStopped() : void 0) || this.current === 0) {
        return;
      }
      dx = point2.x - point1.x;
      dy = point2.y - point1.y;
      dn = Math.sqrt(dx * dx + dy * dy);
      ds = 16;
      currentIncrement = this.current * this.Circuit.currentSpeed();
      this.curcount = (this.curcount + currentIncrement) % ds;
      if (this.curcount < 0) {
        this.curcount += ds;
      }
      newPos = this.curcount;
      _results = [];
      while (newPos < dn) {
        x0 = point1.x + newPos * dx / dn;
        y0 = point1.y + newPos * dy / dn;
        renderContext.fillCircle(x0, y0, Settings.CURRENT_RADIUS);
        _results.push(newPos += ds);
      }
      return _results;
    };

    /*
    Todo: Not yet implemented
    */


    CircuitComponent.prototype.drawCenteredText = function(text, x, y, doCenter, renderContext) {
      var ascent, descent, strWidth;
      strWidth = 10 * text.length;
      if (doCenter) {
        x -= strWidth / 2;
      }
      ascent = -10;
      descent = 5;
      renderContext.fillStyle = Settings.TEXT_COLOR;
      renderContext.fillText(text, x, y + ascent);
      this.adjustBbox(x, y - ascent, x + strWidth, y + ascent + descent);
      return text;
    };

    /*
    # Draws relevant values near components
    #  e.g. 500 Ohms, 10V, etc...
    */


    CircuitComponent.prototype.drawValues = function(valueText, hs, renderContext) {
      var dpx, dpy, offset, stringWidth, xc, xx, ya, yc;
      if (!valueText) {
        return;
      }
      stringWidth = 100;
      ya = -10;
      xc = (this.x2 + this.x1) / 2;
      yc = (this.y2 + this.y1) / 2;
      dpx = Math.floor(this.dpx1 * hs);
      dpy = Math.floor(this.dpy1 * hs);
      offset = 20;
      renderContext.fillStyle = Settings.TEXT_COLOR;
      if (dpx === 0) {
        return renderContext.fillText(valueText, xc - stringWidth / 2 + 3 * offset / 2, yc - Math.abs(dpy) - offset / 3);
      } else {
        xx = xc + Math.abs(dpx) + offset;
        return renderContext.fillText(valueText, xx, yc + dpy + ya);
      }
    };

    CircuitComponent.prototype.drawPosts = function(renderContext) {
      var i, post, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this.getPostCount(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        post = this.getPost(i);
        _results.push(this.drawPost(post.x, post.y, this.nodes[i], renderContext));
      }
      return _results;
    };

    CircuitComponent.prototype.drawPost = function(x0, y0, node, renderContext) {
      var fillColor, strokeColor;
      if (this.needsHighlight()) {
        fillColor = Settings.POST_COLOR_SELECTED;
        strokeColor = Settings.POST_COLOR_SELECTED;
      } else {
        fillColor = Settings.POST_COLOR;
        strokeColor = Settings.POST_COLOR;
      }
      return renderContext.fillCircle(x0, y0, Settings.POST_RADIUS, 1, fillColor, strokeColor);
    };

    CircuitComponent.newPointArray = function(n) {
      var a;
      a = new Array(n);
      while (n > 0) {
        a[--n] = new Point(0, 0);
      }
      return a;
    };

    CircuitComponent.prototype.comparePair = function(x1, x2, y1, y2) {
      (x1 === y1 && x2 === y2) || (x1 === y2 && x2 === y1);
      return this.Circuit.Params;
    };

    CircuitComponent.prototype.timeStep = function() {
      return this.Circuit.timeStep();
    };

    module.exports = CircuitComponent;

    return CircuitComponent;

  })();

}).call(this);


},{"../settings/settings.coffee":16,"../geom/rectangle.coffee":29,"../geom/point.coffee":30,"../util/mathUtils.coffee":25,"../util/arrayUtils.coffee":33}],32:[function(require,module,exports){
(function() {
  var AntennaElm, CircuitComponent, DrawHelper, Point, Polygon, Rectangle, Settings,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Settings = require('../../settings/settings.coffee');

  DrawHelper = require('../../render/drawHelper.coffee');

  Polygon = require('../../geom/polygon.coffee');

  Rectangle = require('../../geom/rectangle.coffee');

  Point = require('../../geom/point.coffee');

  CircuitComponent = require('../circuitComponent.coffee');

  AntennaElm = (function(_super) {
    __extends(AntennaElm, _super);

    function AntennaElm(xa, ya, xb, yb, f, st) {
      AntennaElm.__super__.constructor.call(this, this, xa, ya, xb, yb, f);
    }

    return AntennaElm;

  })(CircuitComponent);

  module.exports = AntennaElm;

}).call(this);


},{"../../settings/settings.coffee":16,"../../render/drawHelper.coffee":27,"../../geom/polygon.coffee":28,"../../geom/rectangle.coffee":29,"../../geom/point.coffee":30,"../circuitComponent.coffee":31}],33:[function(require,module,exports){
(function() {
  var ArrayUtils;

  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchItem, i) {
      if (i == null) {
        i = 0;
      }
      while (i < this.length) {
        if (this[i] === searchItem) {
          return i;
        }
        ++i;
      }
      return -1;
    };
  }

  Array.prototype.remove = function() {
    var args, ax, item, num_args;
    args = arguments;
    num_args = args.length;
    while (num_args && this.length) {
      item = args[--num_args];
      while ((ax = this.indexOf(item)) !== -1) {
        this.splice(ax, 1);
      }
    }
    return this;
  };

  ArrayUtils = (function() {
    function ArrayUtils() {}

    ArrayUtils.zeroArray = function(numElements) {
      var i;
      if (numElements < 1) {
        return [];
      }
      return (function() {
        var _i, _len, _ref, _results;
        _ref = Array(numElements);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          _results.push(0);
        }
        return _results;
      })();
    };

    ArrayUtils.zeroArray2 = function(numRows, numCols) {
      var i, _i, _len, _ref, _results;
      if (numRows < 1) {
        return [];
      }
      _ref = Array(numRows);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        _results.push(this.zeroArray(numCols));
      }
      return _results;
    };

    ArrayUtils.isCleanArray = function(arr) {
      var element, valid, _i, _len;
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        element = arr[_i];
        if (element instanceof Array) {
          valid = arguments.callee(element);
        } else {
          if (!isFinite(element)) {
            console.warn("Invalid number found: " + element);
            console.printStackTrace();
            return false;
          }
        }
      }
    };

    ArrayUtils.printArray = function(arr) {
      var subarr, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        subarr = arr[_i];
        _results.push(console.log(subarr));
      }
      return _results;
    };

    return ArrayUtils;

  })();

  module.exports = ArrayUtils;

}).call(this);


},{}]},{},[1])
;