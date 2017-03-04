let CircuitApplication = require("./CircuitApplication");
let Circuit = require('./circuit/Circuit');
let CircuitComponent = require('./components/CircuitComponent');
let CircuitLoader = require('./io/CircuitLoader');
let SampleCircuits = require(__dirname + "/../circuits/index.json");

class Maxwell {
  static createContext(circuitName, circuitData, context, onComplete) {
    if (circuitName) {
      let circuit = CircuitLoader.createCircuitFromJsonData(circuitData, circuitName);
      this.Circuits[circuitName] = circuit;

      let CircuitApp = new CircuitApplication(circuit, context);

      onComplete(CircuitApp);
    } else {
      console.error(`createContext must be called with a unique circuit name`)
    }
  }

  static createBlankCircuit(circuitName, context, onComplete) {
    if (circuitName) {
      let circuit = new Circuit(circuit_name);
      this.Circuits[circuitName] = circuit;

      let CircuitApp = new CircuitApplication(circuit, context);

      onComplete(CircuitApp);
    } else {
      console.error(`createContext must be called with a unique circuit name`)
    }
  }
}

Maxwell.Circuits = {};

Maxwell.SampleCircuits = SampleCircuits;
Maxwell.version = "0.0.1";

if (typeof window !== 'undefined') {
  window.Maxwell = Maxwell;
} else {
  console.log("Not in browser, declaring global Maxwell object");
  global.Maxwell = Maxwell;
}

module.exports = Maxwell;
