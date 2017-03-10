let CircuitApplication = require("./CircuitApplication");
let Circuit = require('./circuit/Circuit');
let CircuitComponent = require('./components/CircuitComponent');
let CircuitLoader = require('./io/CircuitLoader');
let SampleCircuits = require(__dirname + "/../circuits/index.json");

class Maxwell {
  static createContext(circuitName, circuitData, context) {
    let circuit = CircuitLoader.createCircuitFromJsonData(circuitName, circuitData);
    // this.Circuits[circuitName] = circuit;

    return new CircuitApplication(circuit, context);
  }

  static createBlankCircuit(circuitName, context) {
    let circuit = new Circuit(circuitName);
    // this.Circuits[circuitName] = circuit;

    return new CircuitApplication(circuit, context);
  }
}

Maxwell.Circuit = Circuit;
Maxwell.CircuitApplication = CircuitApplication;
Maxwell.CircuitLoader = CircuitLoader;

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
