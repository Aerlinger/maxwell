(function() {
  define(['jquery', 'cs!component/ComponentRegistry', 'cs!core/SimulationParams', 'cs!core/Circuit', 'cs!scope/Oscilloscope', 'cs!engine/Hint'], function($, ComponentRegistry, SimulationParams, Circuit, Oscilloscope, Hint) {
    var CircuitLoader;
    CircuitLoader = (function() {
      function CircuitLoader() {}

      CircuitLoader.createCircuitFromJsonData = function(jsonData) {
        var circuit, circuitParams, elementData, elms, flags, newCircuitElm, params, sym, type, x1, x2, y1, y2, _i, _len;
        circuit = new Circuit();
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
          sym = ComponentRegistry.ComponentDefs[type];
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
          if (type === Oscilloscope) {
            console.log("Scope found in file!");
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
        return $.getJSON(circuitFileName, (function(_this) {
          return function(jsonData) {
            var circuit;
            circuit = CircuitLoader.createCircuitFromJsonData(jsonData);
            return typeof onComplete === "function" ? onComplete(circuit) : void 0;
          };
        })(this));
      };

      return CircuitLoader;

    })();
    return CircuitLoader;
  });

}).call(this);
