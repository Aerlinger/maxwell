let Circuit = require('../circuit/Circuit');
let Scope = require('../circuit/Scope');
let SimulationParams = require('../circuit/SimulationParams');
let Hint = require('../engine/Hint');
let Components = require('../components');

class CircuitLoader {
  static createCircuitFromJsonData(circuit_name, jsonData) {

    // Create a defensive copy of jsonData
    jsonData = JSON.parse(JSON.stringify(jsonData));

    let circuit = new Circuit(circuit_name);

    // Extract circuit simulation params
    let circuitParams = jsonData.params;
    let circuitComponents = jsonData.components;

    if (!circuitParams)
      console.error("Circuit params missing");

    if (!circuitComponents)
      console.error("Circuit components missing");

    if ((circuitParams['flags'] == null) || (circuitParams['flags'] == undefined))
      console.error("Circuit flags missing");

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

    if (typeof window !== 'undefined')
      console.log(circuit, circuitParams);

    if (circuit.getElements().length === 0)
      console.error("No elements loaded. JSON most likely malformed");

    return circuit;
  }
}

module.exports = CircuitLoader;

