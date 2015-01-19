;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0](function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
(function() {
  var CircuitLoader, Maxwell;

  CircuitLoader = require('./io/CircuitLoader.coffee');

  Maxwell = (function() {
    Maxwell.Circuits = {};

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

    window.Maxwell = Maxwell;

    return Maxwell;

  })();

}).call(this);


},{"./io/CircuitLoader.coffee":2}],2:[function(require,module,exports){
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

    module.exports = CircuitLoader;

    return CircuitLoader;

  })();

}).call(this);


},{"../core/SimulationParams.coffee":3,"../engine/Hint.coffee":4}],3:[function(require,module,exports){
(function() {
  define([], function() {
    /*
      Stores Circuit-specific settings.
      Usually loaded from the params object of a .json file
    */

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
    return SimulationParams;
  });

}).call(this);


},{}],4:[function(require,module,exports){
(function() {
  define([], function() {
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
    return Hint;
  });

}).call(this);


},{}]},{},[1])
;