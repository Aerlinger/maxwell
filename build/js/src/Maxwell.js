(function() {
  define(['cs!io/CircuitLoader', 'cs!core/Circuit'], function(CircuitLoader, Circuit) {
    var Maxwell;
    Maxwell = (function() {
      Maxwell.Circuits = {};

      function Maxwell(canvas, options) {
        if (options == null) {
          options = {};
        }
        this.Circuit = null;
        this.circuitName = options['circuitName'];
        if (this.circuitName) {
          CircuitLoader.createCircuitFromJsonFile(this.circuitName, (function(_this) {
            return function(circuit) {
              return _this.Circuit = circuit;
            };
          })(this));
        }
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

      return Maxwell;

    })();
    return Maxwell;
  });

}).call(this);
