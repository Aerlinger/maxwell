let CircuitComponent = require('./circuit/circuitComponent.js');
let CircuitLoader = require('./io/circuitLoader.js');
let ComponentRegistry = require('./circuit/componentRegistry.js');

let Circuit = require('./circuit/circuit.js');
let CircuitUI = require('./CircuitUI.js');

let RickshawScopeCanvas = require("./render/RickshawScopeCanvas");

let environment = require("./environment.js");

// let Maxwell = require("./Maxwell.js");

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

    return new CircuitUI(circuit, canvas);
  }

  static renderInput(labelText, value, symbolText, helpText) {
    let wrapper = document.createElement('div');
    wrapper.className = "param-control";

    let label = document.createElement('label');

    let input_wrapper = document.createElement('div');
    input_wrapper.className = "input-group";

    let input = document.createElement('input');

    input.setAttribute("type", "number");
    input.setAttribute("value", value);

    input.className = "input-group-field"

    label.append(labelText);
    label.append(input_wrapper);
    // label.append(help);

    input_wrapper.append(input);

    if (symbolText) {
      let symbolSpan = document.createElement('span');

      symbolSpan.innerText = symbolText;
      symbolSpan.className = "input-group-label";

      input_wrapper.append(symbolSpan);
    }

    wrapper.append(label)

    if (helpText && helpText != "") {
      let help = document.createElement("p");
      help.className = "help-text";
      help.innerText = helpText;

      wrapper.append(help)
    }

    return wrapper;
  }

  static renderSelect(labelText, selectValues, helpText) {
    let wrapper = document.createElement('div');
    wrapper.className = "param-control";

    let label = document.createElement('label');
    let select = document.createElement('select');

    for (let value in selectValues) {
      var optionElm = document.createElement("option");
      optionElm.setAttribute("value", selectValues[value]);
      optionElm.innerText = value;

      select.append(optionElm);
    }

    label.append(labelText);

    wrapper.append(label);
    wrapper.append(select);

    if (helpText && helpText != "") {
      let help = document.createElement("p");
      help.className = "help-text";
      help.innerText = helpText;
      wrapper.append(help);
    }

    return wrapper;
  }

  static renderCheckbox(labelText, value, helpText) {
    let wrapper = document.createElement('div');
    wrapper.className = "param-control";

    let input = document.createElement('input');
    let inputID = "inputID";

    input.setAttribute("type", "checkbox");
    input.setAttribute("value", value);

    if (value) {
      input.setAttribute("checked", "true");
    }
    input.setAttribute("id", inputID);

    let label = document.createElement('label');
    label.append(labelText);
    label.setAttribute("for", inputID);

    wrapper.append(input);
    wrapper.append(label);

    if (helpText && helpText != "") {
      let help = document.createElement("p");
      help.className = "help-text";
      help.innerText = helpText;
      wrapper.append(help);
    }

    return wrapper;
  }

  static renderSlider(labelText, value, rangeMin, rangeMax, step, helpText) {
    let sliderId = "sliderID";

    let wrapper = document.createElement('div');
    wrapper.className = "param-control slider-container small-collapse";

    let label = document.createElement('label');
    label.append(labelText);

    let sliderContainer = document.createElement('div');
    sliderContainer.className = "small-8 columns";

    let slider = document.createElement("div");

    slider.setAttribute("data-slider", "");
    slider.setAttribute("data-initial-start", value);
    slider.setAttribute("data-start", rangeMin);
    slider.setAttribute("data-end", rangeMax);
    slider.setAttribute("data-step", step);
    slider.setAttribute("class", "slider");

    let handleSpan = document.createElement("span");

    handleSpan.setAttribute("data-slider-handle", "");
    handleSpan.setAttribute("role", "slider");
    handleSpan.setAttribute("aria-controls", sliderId);
    handleSpan.setAttribute("class", "slider-handle");

    let handleFillSpan = document.createElement("span");
    handleFillSpan.setAttribute("data-slider-fill", "");
    handleFillSpan.setAttribute("class", "slider-fill");

    slider.append(handleSpan);
    slider.append(handleFillSpan);

    let inputContainer = document.createElement('div');
    inputContainer.className = "small-4 columns"

    let input = document.createElement('input');
    input.id = sliderId;
    input.setAttribute("id", sliderId);
    input.setAttribute("type", "number");

    inputContainer.append(input);

    input.className = "input-group-field";

    let clearfix = document.createElement('div');
    clearfix.className = "clearfix";

    wrapper.append(label);
    wrapper.append(sliderContainer);
    wrapper.append(inputContainer);
    wrapper.append(clearfix);

    sliderContainer.append(slider);

    return wrapper
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

    let componentTitle = document.createElement("h6");
    componentTitle.className = "componentTitle";
    componentTitle.innerText = circuitComponent.getName();

    container.append(componentTitle);
    let hr = document.createElement("hr");
    hr.className = "component-title-sep";
    container.append(hr);

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

        // Render form object into DOM
        let inputElm;

        if (fieldType == "select") {
          inputElm = Maxwell.renderSelect(fieldLabel, selectValues, fieldSymbol, fieldDescription);
        } else if (fieldType == "boolean") {
          inputElm = Maxwell.renderCheckbox(fieldLabel, fieldValue, fieldDescription);
        } else {
          inputElm = Maxwell.renderInput(fieldLabel, fieldValue, fieldSymbol, fieldDescription);
        }

        inputElm.addEventListener("change", function(evt) {
          let updateObj = {}
          updateObj[fieldName] = evt.target.value;

          console.log("CHANGE", `circuitComponent.update(${JSON.stringify(updateObj)})`);

          circuitComponent.update(updateObj);
        });

        form.append(inputElm);

      } else {
        console.error(`Field name missing for ${circuitComponent}`)
      }
    }

    return container;
  }

  static createContext(circuitName, filepath, context, onComplete) {
    let circuit = null;

    if (circuitName) {
      if (typeof filepath === "string") {
        circuit = Maxwell.loadCircuitFromFile(filepath, circuit => onComplete(new CircuitUI(circuit, context)));

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
Maxwell.Renderer = CircuitUI;
Maxwell.ScopeCanvas = RickshawScopeCanvas;

if (environment.isBrowser) {
  window.Maxwell = Maxwell;
} else {
  console.log("Not in browser, declaring global Maxwell object");
  global.Maxwell = Maxwell;
}

module.exports = Maxwell;
