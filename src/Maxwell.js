let CircuitComponent = require('./circuit/circuitComponent.js');
let CircuitLoader = require('./io/circuitLoader.js');
let ComponentRegistry = require('./circuit/componentRegistry.js');
let Circuit = require('./circuit/circuit.js');
let Renderer = require('./render/renderer.js');

let environment = require("./environment.js");

//unless environment.isBrowser
//  Winston = require('winston')

let version = undefined;
class Maxwell {
  static initClass() {
    version = "0.0.0";
  
    this.Circuits = {};
  
    this.Components = ((() => {
      let result = [];
      for (let k in ComponentRegistry.ComponentDefs) {
        let v = ComponentRegistry.ComponentDefs[k];
        result.push(v);
      }
      return result;
    })());
  }

//  if environment.isBrowser
//    @logger = console
//  else
//    @logger = new (Winston.Logger)({
//      transports: [
//        new (Winston.transports.Console)(),
//        new (Winston.transports.File)({ filename: 'log/maxwell.log' })
//      ]
//    })

  static loadCircuitFromFile(circuitFileName, onComplete) {
    let circuit = CircuitLoader.createCircuitFromJsonFile(circuitFileName, onComplete);
    this.Circuits[circuitFileName] = circuit;

    return circuit;
  }

  static loadCircuitFromJson(jsonData) {
    let circuit = CircuitLoader.createCircuitFromJsonData(jsonData);
    this.Circuits[circuitFileName] = circuit;

    return circuit;
  }

  static createCircuit(circuitName, circuitData, onComplete) {
    let circuit = null;

    if (circuitName) {
      if (typeof circuitData === "string") {
        circuit = Maxwell.loadCircuitFromFile(circuitData, onComplete);
      } else if (typeof circuitData === "object") {
        circuit = Maxwell.loadCircuitFromJson(circuitData);
      } else {
        throw new Error(`\
Parameter must either be a path to a JSON file or raw JSON data representing the circuit.
Use \`Maxwell.createCircuit()\` to create a new empty circuit object.

was:
${circuitData}\
`);
      }
    } else {
      circuit = new Circuit();
    }

    this.Circuits[circuitName] = circuit;

    return new Renderer(circuit, canvas);
  }

  static renderEdit(circuitComponent) {
    let fields = circuitComponent.constructor.Fields;

    let result = [];
    let html = `
    <div class="container">
      <h3 class="componentTitle">
          ${circuitComponent.getName()}
        </h3>
    
      <form>
    `;

    for (let fieldName in fields) {
      if (fieldName) {

        let field = fields[fieldName];

        let fieldValue = circuitComponent[fieldName];
        let fieldType = field["field_type"] || "float";
        let fieldDefault = field["default_value"];
        let fieldLabel = field["name"];
        let fieldSymbol = field["symbol"];
        let fieldDescription = field["description"];
        let fieldRange = field["range"];

        result.push(`fieldValue:${fieldValue} fieldType:${fieldType} fieldLabel:${fieldLabel} fieldSymbol:${fieldSymbol} fieldDescription:${fieldDescription} fieldRange:${fieldRange}`);

        html += `
        
        <div class="form-group row has-success">
          <label for="inputHorizontalSuccess" class="col-sm-2 col-form-label">
            ${fieldLabel}
          </label>
    
          <div class="col-sm-10">
            <div>
              <input type="${fieldType}" value="${fieldValue}" class="form-control form-control-success" data-range-min="${fieldRange[0]}" data-range-max="${fieldRange[1]}" id="inputHorizontalSuccess" placeholder="${fieldDefault}">
              <small class="form-symbol text-muted">${fieldSymbol}</small>
            </div>
            `;

            if (fieldDescription) {
              html += `
              <div>
                <small class="form-text text-muted">${fieldDescription}</small>
              </div>
              `
            }
            html += `
          </div>
        </div>
        `;
      } else {
        result.push("?");
      }
    }

    html += `    
      </form>
    </div>
    `
    
    return html;
  }

  static createContext(circuitName, filepath, context, onComplete) {
    let circuit = null;

    if (circuitName) {
      if (typeof filepath === "string") {
        circuit = Maxwell.loadCircuitFromFile(filepath, circuit => onComplete(new Renderer(circuit, context)));

      } else if (typeof filepath === "object") {
        circuit = Maxwell.loadCircuitFromJson(filepath);
      } else {
        throw new Error(`\
Parameter must either be a path to a JSON file or raw JSON data representing the circuit.
Use \`Maxwell.createCircuit()\` to create a new empty circuit object.\
`);
      }
    } else {
      circuit = new Circuit();
    }

    this.Circuits[circuitName] = circuit;

    return circuit;
  }
}

Maxwell.initClass();

Maxwell.Renderer = Renderer;

if (environment.isBrowser) {
  window.Maxwell = Maxwell;
} else {
  console.log("Not in browser, declaring global Maxwell object");
  global.Maxwell = Maxwell;
}

module.exports = Maxwell;
