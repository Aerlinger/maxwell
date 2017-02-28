let Circuit = require('../circuit/Circuit.js');
let Scope = require('../circuit/Scope.js');
let SimulationParams = require('../circuit/SimulationParams.js');
let Hint = require('../engine/Hint.js');
let Components = require('../components');

let environment = require("../Environment.js");

class CircuitLoader {
  static createCircuitFromJsonData(jsonData, circuit_name) {

    // Create a defensive copy of jsonData
    jsonData = JSON.parse(JSON.stringify(jsonData));

    let circuit = new Circuit(circuit_name);

    // Extract circuit simulation params
    let circuitParams = jsonData.params;
    let circuitComponents = jsonData.components;

    if (!circuitParams || !circuitComponents || !circuitParams['flags']) {
      console.error("Circuit data malformed (Either circuit params or components are missing)");
      return
    }

    circuit.Params = new SimulationParams(circuitParams);
    circuit.flags = parseInt(circuitParams['flags']);

    // Load each component from JSON data:
    for (let elementData of Array.from(circuitComponents)) {
      let type = elementData['name'];
      let Component = Components[type];

      if (!Component)
        console.error(`No matching component for ${type}`);

      if (!type)
        console.error(`Unrecognized Type ${type}`);

      else if (type === "Hint")
        circuit.setHint(elementData['hintType'], elementData['hintItem1'], elementData['hintItem2']);

      else if (type === "Scope")
        circuit.addScope(new Scope(elementData["pos"], elementData["params"]));

      else {
        let [x1, y1, x2, y2] = elementData['pos'];
        let flags = parseInt(elementData['flags']) || 0;

        circuit.solder(new Component(x1, y1, x2, y2, elementData['params'], parseInt(flags)));
      }
    }

    if (environment.isBrowser)
      console.log(circuit, circuitParams);

    if (circuit.getElements().length === 0)
      console.error("No elements loaded. JSON most likely malformed");

    return circuit;
  }
}

module.exports = CircuitLoader;

