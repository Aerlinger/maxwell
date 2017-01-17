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

  /**
   <div class="form-group row has-success">
     <label for="inputHorizontalSuccess" class="col-sm-2 col-form-label">
     Resistance
     </label>

     <div class="col-sm-10">
       <div>
         <input type="float" value="100" class="form-control form-control-success" data-range-min="-Infinity" data-range-max="Infinity" data-component-id="1484677177243" id="inputHorizontalSuccess" placeholder="1000">
        <small class="form-symbol text-muted">Ω</small>
       </div>

       <div>
        <small class="form-text text-muted">Amount of current per unit voltage applied to this resistor (ideal).</small>
       </div>

     </div>
   </div>
   */

  static renderEdit(circuitComponent) {
    let fields = circuitComponent.constructor.Fields;

    let result = [];

    let container = document.createElement("div");
    container.className = "container";

    let componentTitle = document.createElement("h3");
    componentTitle.className = "componentTitle";
    componentTitle.innerText = circuitComponent.getName();

    container.prepend(componentTitle);

    let form = document.createElement("form");

    container.append(form);

    for (let fieldName in fields) {
      if (fieldName) {

        let field = fields[fieldName];

        let fieldValue = circuitComponent[fieldName];
        let componentId = circuitComponent.component_id;
        let fieldType = field["field_type"] || "float";
        let fieldDefault = field["default_value"];
        let fieldLabel = field["name"];
        let fieldSymbol = field["symbol"] || "";
        let fieldDescription = field["description"];
        let fieldRange = field["range"];
        let selectValues = field["select_values"];

        // Set our min/max permissible values if they exist, otherwise default to +/- Infinity
        let fieldMin = (fieldRange && fieldRange[0]) || -Infinity;
        let fieldMax = (fieldRange && fieldRange[1]) || Infinity;

        // console.log(`fieldValue:${fieldValue} fieldType:${fieldType} fieldLabel:${fieldLabel} fieldSymbol:${fieldSymbol} fieldDescription:${fieldDescription} fieldRange:${fieldRange}`);

        // Render form object into DOM

        // FORM GROUP
        let formGroup = document.createElement("div");
        formGroup.className = "form-group row has-success";

        // INPUT LABEL
        let label = document.createElement("label");
        label.className = "col-sm-2 col-form-label";
        label.setAttribute("for", "inputHorizontalSuccess");
        label.innerText = fieldLabel;

        // INPUT WRAPPER
        let columnWrapper = document.createElement("div");
        columnWrapper.className = "col-sm-10";

        let inputDivWrapper = document.createElement("div");
        columnWrapper.append(inputDivWrapper);

        let inputElm;

        if (fieldType == "select") {
          inputElm = document.createElement("select");
          inputElm.className = "form-control";

          for (let value in selectValues) {
            var optionElm = document.createElement("option");
            optionElm.setAttribute("value", selectValues[value]);
            optionElm.innerText = value;

            inputElm.append(optionElm);
          }

          inputDivWrapper.append(inputElm);
        } else if (fieldType == "boolean") {
          label = "";

          let checkboxWrapper = document.createElement("div");
          checkboxWrapper.className = "checkbox"
          let labelElm = document.createElement("label");
          inputElm = document.createElement("input");
          inputElm.setAttribute("type", "checkbox");

          checkboxWrapper.append(labelElm);
          labelElm.append(inputElm);
          labelElm.append(fieldLabel);

          inputDivWrapper.append(checkboxWrapper);

        } else {
          inputElm = document.createElement("input");
          inputElm.className = "form-control form-control-success";

          inputDivWrapper.append(inputElm);
        }

        inputElm.setAttribute("data-range-min", fieldMin);
        inputElm.setAttribute("data-range-max", fieldMax);
        inputElm.setAttribute("data-component-id", componentId);
        inputElm.setAttribute("placeholder", fieldDefault);
        inputElm.setAttribute("value", fieldValue);

        inputDivWrapper.addEventListener("change", function(evt) {
          let updateObj = {}
          updateObj[fieldName] = evt.target.value;

          console.log("CHANGE", evt.target);
          console.log("CHANGE", `circuitComponent.update(${JSON.stringify(updateObj)})`);

          circuitComponent.update(updateObj);
        });

        let symbolSuffix = document.createElement("small");
        symbolSuffix.className = "form-symbol text-muted";
        symbolSuffix.innerText = fieldSymbol;

        inputDivWrapper.append(symbolSuffix)
        columnWrapper.append(inputDivWrapper)

        let descriptionWrapper = document.createElement("div");
        let smallDescription = document.createElement("small");
        smallDescription.className = "form-text text-muted";
        smallDescription.innerText = fieldDescription || "";
        descriptionWrapper.append(smallDescription);

        formGroup.append(label);
        formGroup.append(columnWrapper);
        formGroup.append(descriptionWrapper);

        form.append(formGroup);

      } else {
        console.error(`Field name missing for ${circuitComponent}`)
      }
    }

    let sidebar = document.getElementById('component_sidebar');
    sidebar.innerHTML = "";
    sidebar.appendChild(container);

    return container;
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
