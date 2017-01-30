let ComponentRegistry = require('../circuit/componentRegistry.js');
let SimulationParams = require('../circuit/simulationParams.js');

let Circuit = require('../circuit/circuit.js');
let CircuitComponent = require('../circuit/circuitComponent.js');
let Hint = require('../engine/hint.js');
fs = require('fs')

let VoltageElm = require('../circuit/components/VoltageElm.js');

let Scope = require('../circuit/Scope.js');

let environment = require("../environment.js");

class CircuitLoader {
  static createCircuitFromJsonData(jsonData) {
    let circuit = new Circuit();

    // Valid class identifier name
    let validName = /^[$A-Z_][0-9A-Z_$]*$/i;

    let circuitParams = jsonData.shift();
    circuit.Params = SimulationParams.deserialize(circuitParams);
    circuit.flags = parseInt(circuitParams['flags']);

//    console.log(circuit.Params.toString())

    // Load each Circuit component from JSON data:
    let elms = [];

    for (let elementData of Array.from(jsonData)) {
      let type = elementData['sym'];

//      if type in Circuit.components
//        console.log("Found #{type}...")

      let sym = ComponentRegistry.ComponentDefs[type];
      let x1 = parseInt(elementData['x1']);
      let y1 = parseInt(elementData['y1']);
      let x2 = parseInt(elementData['x2']);
      let y2 = parseInt(elementData['y2']);

      let flags = parseInt(elementData['flags']) || 0;

      let params = elementData['params'];

//      console.log("#{type} #{x1} #{y1} #{x2} #{y2} #{flags} #{params}")

      if (!sym) {
        circuit.warn(`No matching component for ${type}: ${sym}`);
      } else if (type === "h") {
        console.log("Hint found in file!");

        //  TODO: Proper types
        this.hintType = x1;
        this.hintItem1 = x2;
        this.hintItem2 = y1;
        break;
      } else if (sym === Scope) {
      } else if (!type) {
        circuit.error(`Unrecognized Type ${type}`);
      } else {
        var newCircuitElm;
        try {
          newCircuitElm = new sym(x1, y1, x2, y2, params, parseInt(flags));
        } catch (e) {
          console.log(e);
          console.log(`type: ${type}, sym: ${sym}`);
          console.log("elm: ", elementData);
          console.log(e.stack);

          if (!environment.isBrowser) {
            process.exit(1);
          }
        }

        elms.push(newCircuitElm);
        circuit.solder(newCircuitElm);
      }
    }

    if (elms.length === 0) {
      console.error("No elements loaded. JSON most likely malformed");
    }

//    unless environment.isBrowser
//      circuit.ostream ||= fs.createWriteStream("dump/#{circuit.Params.name}")

//    console.log("--------------------------------------------------------------------\n")

    return circuit;
  }

  /*
   Retrieves string data from a circuit text file (via AJAX GET)
   */
  static createCircuitFromJsonFile(circuitFileName, onComplete) {
    if (onComplete == null) { onComplete = null; }
    if (environment.isBrowser) {
      return $.getJSON(circuitFileName, function(jsonData) {
        let circuit = CircuitLoader.createCircuitFromJsonData(jsonData);

        return __guardFunc__(onComplete, f => f(circuit));
      });
    } else {
      let jsonData = JSON.parse(fs.readFileSync(circuitFileName))
      return CircuitLoader.createCircuitFromJsonData(jsonData)
    }
  }
}


module.exports = CircuitLoader;

function __guardFunc__(func, transform) {
  return typeof func === 'function' ? transform(func) : undefined;
}
