/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {let CircuitComponent = __webpack_require__(1);
	let CircuitLoader = __webpack_require__(16);
	let ComponentRegistry = __webpack_require__(90);
	
	let Circuit = __webpack_require__(77);
	let CircuitUI = __webpack_require__(91);
	
	let RickshawScopeCanvas = __webpack_require__(93);
	
	let AcRailElm = __webpack_require__(95);
	let AntennaElm = __webpack_require__(17);
	let WireElm = __webpack_require__(20);
	let ResistorElm = __webpack_require__(22);
	let GroundElm = __webpack_require__(23);
	let VoltageElm = __webpack_require__(19);
	let DiodeElm = __webpack_require__(24);
	let OutputElm = __webpack_require__(25);
	let SwitchElm = __webpack_require__(26);
	let CapacitorElm = __webpack_require__(27);
	let InductorElm = __webpack_require__(28);
	let SparkGapElm = __webpack_require__(29);
	let CurrentElm = __webpack_require__(30);
	let RailElm = __webpack_require__(18);
	let MosfetElm = __webpack_require__(31);
	let JfetElm = __webpack_require__(32);
	let TransistorElm = __webpack_require__(33);
	let VarRailElm = __webpack_require__(34);
	let OpAmpElm = __webpack_require__(35);
	let ZenerElm = __webpack_require__(36);
	let Switch2Elm = __webpack_require__(37);
	let SweepElm = __webpack_require__(38);
	let TextElm = __webpack_require__(39);
	let ProbeElm = __webpack_require__(40);
	
	let AndGateElm = __webpack_require__(41);
	let NandGateElm = __webpack_require__(42);
	let OrGateElm = __webpack_require__(43);
	let NorGateElm = __webpack_require__(44);
	let XorGateElm = __webpack_require__(45);
	let InverterElm = __webpack_require__(46);
	
	let LogicInputElm = __webpack_require__(47);
	let LogicOutputElm = __webpack_require__(48);
	let AnalogSwitchElm = __webpack_require__(49);
	let AnalogSwitch2Elm = __webpack_require__(50);
	let MemristorElm = __webpack_require__(51);
	let RelayElm = __webpack_require__(52);
	let TunnelDiodeElm = __webpack_require__(53);
	
	let ScrElm = __webpack_require__(54);
	let TriodeElm = __webpack_require__(55);
	
	let DecadeElm = __webpack_require__(56);
	let LatchElm = __webpack_require__(58);
	let TimerElm = __webpack_require__(59);
	let JkFlipFlopElm = __webpack_require__(60);
	let DFlipFlopElm = __webpack_require__(61);
	let CounterElm = __webpack_require__(62);
	let DacElm = __webpack_require__(63);
	let AdcElm = __webpack_require__(64);
	let VcoElm = __webpack_require__(65);
	let PhaseCompElm = __webpack_require__(66);
	let SevenSegElm = __webpack_require__(67);
	let CC2Elm = __webpack_require__(68);
	
	let TransLineElm = __webpack_require__(69);
	
	let TransformerElm = __webpack_require__(70);
	let TappedTransformerElm = __webpack_require__(71);
	
	let LedElm = __webpack_require__(72);
	let PotElm = __webpack_require__(73);
	let ClockElm = __webpack_require__(74);
	
	
	
	let environment = __webpack_require__(10);
	
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
	
	Maxwell.ComponentLibrary = {
	  VoltageElm,
	  RailElm,
	  VarRailElm,
	  ClockElm,
	  AntennaElm,
	  AcRailElm
	};
	
	module.exports = Maxwell;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 CircuitComponent:
	 Base class from which all components inherit
	
	 @author Anthony Erlinger
	 @year 2012
	
	 Uses the Observer Design Pattern:
	 Observes: Circuit, CircuitRender
	 Observed By: CircuitCanvas
	
	 Events:
	 <None>
	
	 */
	
	let Settings = __webpack_require__(2);
	let Rectangle = __webpack_require__(3);
	let Point = __webpack_require__(4);
	let Util = __webpack_require__(5);
	let debug = __webpack_require__(11)('circuitComponent');
	
	let _ = __webpack_require__(14);
	
	class CircuitComponent {
	
	  static get Fields() {
	    return {}
	  }
	
	  static initClass() {
	    this.DEBUG = true;
	  }
	
	  constructor(x1, y1, x2, y2, params, f) {
	    if (f == null) {
	      f = 0;
	    }
	    this.current = 0;
	    this.flags = f || 0;
	
	    this.voltSource = 0;
	    this.noDiagonal = false;
	    this.Circuit = null;
	
	    this.component_id = Util.getRand(100000000) + (new Date()).getTime();
	
	    this.setParameters(params);
	
	    this.setPoints(x1, y1, x2, y2);
	    this.allocNodes();
	  }
	
	  allocNodes() {
	    this.nodes = Util.zeroArray(this.getPostCount() + this.getInternalNodeCount());
	    this.volts = Util.zeroArray(this.getPostCount() + this.getInternalNodeCount());
	  }
	
	  setParameters(component_params) {
	    if (component_params && (component_params.constructor === Array)) {
	      console.error(`component_params ${component_params} is an array on ${this.constructor.name}`)
	    }
	
	    let {Fields} = this.constructor;
	
	    this.params = this.params || {};
	
	    for (let param_name in Fields) {
	      let definition = Fields[param_name];
	      let {default_value, data_type} = definition;
	
	      if (!Util.isFunction(data_type)) {
	        console.error("data_type must be a function");
	      }
	
	      // Parameter exists in our Fields attribute table...
	      if (component_params && (param_name in component_params)) {
	        let param_value = data_type(component_params[param_name]);
	
	        this.setValue(param_name, param_value);
	
	        delete component_params[param_name];
	
	      } else {
	        if ((default_value != null) && (default_value != undefined)) {
	          if (this.Circuit && this.Circuit && this.Circuit.debugModeEnabled()) {
	            console.log(`INFO: Assigning default value of ${default_value} for ${param_name} in ${this.constructor.name} (was ${this[param_name]})`)
	          }
	        } else {
	          console.warn(`No default value defined for ${param_name} in ${this.constructor.name}!`)
	        }
	
	        if (!this[param_name])
	          this[param_name] = data_type(default_value);
	
	        this.params[param_name] = this[param_name];
	
	        if (!Util.isValue(this[param_name])) {
	          debug(`Parameter ${param_name} is unset in ${this.constructor.name}. Value: ${this[param_name]}!`);
	        }
	      }
	    }
	
	    let unmatched_params = ((() => {
	      let result = [];
	      for (let param in component_params) {
	        result.push(param);
	      }
	      return result;
	    })());
	
	    if (unmatched_params.length > 0) {
	      console.error(`The following parameters [${unmatched_params.join(" ")}] do not belong in ${this.getName()}`);
	      throw new Error(`Invalid params '${unmatched_params.join(" ")}' assigned to ${this.getName()}`);
	    }
	  }
	
	
	  getParentCircuit() {
	    return this.Circuit;
	  }
	
	  setx1(value) {
	    return this.point1.x = value;
	  }
	
	  sety1(value) {
	    return this.point1.y = value;
	  }
	
	  setx2(value) {
	    return this.point2.x = value;
	  }
	
	  sety2(value) {
	    return this.point2.y = value;
	  }
	
	  x1() {
	    return this.point1.x;
	  }
	
	  y1() {
	    return this.point1.y;
	  }
	
	  x2() {
	    return this.point2.x;
	  }
	
	  y2() {
	    return this.point2.y;
	  }
	
	  dx() {
	    return this.point2.x - this.point1.x;
	  }
	
	  dy() {
	    return this.point2.y - this.point1.y;
	  }
	
	  dn() {
	    return Math.sqrt((this.dx() * this.dx()) + (this.dy() * this.dy()));
	  }
	
	  dpx1() {
	    return this.dy() / this.dn();
	  }
	
	  dpy1() {
	    return -this.dx() / this.dn();
	  }
	
	  dsign() {
	    if (this.dy() === 0)
	      return Math.sign(this.dx());
	    else
	      return Math.sign(this.dy());
	  }
	
	  setPoints(x1, y1, x2, y2) {
	    /*
	    if (!x1 || !y1)
	      console.trace("No x1, y1 location for ", this.getName());
	
	    if (!x2 || !y2)
	      console.trace("No x2, y2 location for ", this.getName());
	      */
	
	    if (!this.point1)
	      this.point1 = new Point(x1, y1);
	
	    if (!this.point2)
	      this.point2 = new Point(x2, y2);
	
	    this.recomputeBounds();
	  }
	
	  place() {
	    this.recomputeBounds();
	  }
	
	  unitText() {
	    return "?";
	  }
	
	  height() {
	    return Math.abs(this.point2.y - this.point1.y);
	  }
	
	  width() {
	    return Math.abs(this.point2.x - this.point1.x);
	  }
	
	  axisAligned() {
	    return (this.height() === 0) || (this.width() === 0);
	  }
	
	  setPowerColor(color) {
	    return console.warn("Set power color not yet implemented");
	  }
	
	  reset() {
	    this.volts = Util.zeroArray(this.volts.length);
	    return this.curcount = 0;
	  }
	
	  setCurrent(x, current) {
	    return this.current = current;
	  }
	
	  getCurrent() {
	    return this.current;
	  }
	
	  getVoltageDiff() {
	    return this.volts[0] - this.volts[1];
	  }
	
	  getPower() {
	    return this.getVoltageDiff() * this.getCurrent();
	  }
	
	  calculateCurrent() {
	  }
	
	  // To be implemented by subclasses
	
	  doStep() {
	  }
	
	  // To be implemented by subclasses
	
	  orphaned() {
	    return (this.Circuit === null) || (this.Circuit === undefined);
	  }
	
	  destroy() {
	    return this.Circuit.desolder(this);
	  }
	
	  dump() {
	    let tidyVoltage = Util.tidyFloat(this.getVoltageDiff());
	    let tidyCurrent = Util.tidyFloat(this.getCurrent());
	
	    let paramStr = ((() => {
	      let result = [];
	      for (let key in this.params) {
	        let val = this.params[key];
	        result.push(val);
	      }
	      return result;
	    })()).join(" ");
	
	    return `[v ${tidyVoltage}, i ${tidyCurrent}]\t${this.getName()} ${this.point1.x} ${this.point1.y} ${this.point2.x} ${this.point2.y}`;
	  }
	
	  startIteration() {
	  }
	
	  // Called on reactive elements such as inductors and capacitors.
	
	  getPostAt(x, y) {
	    for (let postIdx = 0, end = this.getPostCount(), asc = 0 <= end; asc ? postIdx < end : postIdx > end; asc ? postIdx++ : postIdx--) {
	      let post = this.getPost(postIdx);
	
	      if ((post.x === x) && (post.y === y)) {
	        return post;
	      }
	    }
	  }
	
	  getPostVoltage(post_idx) {
	    return this.volts[post_idx];
	  }
	
	  setNodeVoltage(node_idx, voltage) {
	    this.volts[node_idx] = voltage;
	    return this.calculateCurrent();
	  }
	
	  calcLeads(len) {
	    if ((this.dn() < len) || (len === 0)) {
	      this.lead1 = this.point1;
	      return this.lead2 = this.point2;
	    } else {
	      this.lead1 = Util.interpolate(this.point1, this.point2, (this.dn() - len) / (2 * this.dn()));
	      return this.lead2 = Util.interpolate(this.point1, this.point2, (this.dn() + len) / (2 * this.dn()));
	    }
	  }
	
	  isVertical() {
	    return Math.abs(this.point1.x - this.point2.x) < 0.01;
	  }
	
	  getCenter() {
	    let centerX = (this.point1.x + this.point2.x) / 2.0;
	    let centerY = (this.point1.y + this.point2.y) / 2.0;
	
	    return new Point(centerX, centerY);
	  }
	
	  equalTo(otherComponent) {
	    return this.component_id === otherComponent.component_id;
	  }
	
	  getNeighborsAtPostIdx(postIdx) {
	    let post = this.getPost(postIdx);
	
	    for (let nodeIdx of this.nodes) {
	      let node = this.Circuit.getNode(nodeIdx);
	
	      if (node.x == post.x && node.y == post.y) {
	        return node.getNeighboringElements();
	      }
	    }
	
	    return [];
	  }
	
	  drag(newX, newY) {
	    newX = Util.snapGrid(newX);
	    newY = Util.snapGrid(newY);
	
	    if (this.noDiagonal) {
	      if (Math.abs(this.point1.x - newX) < Math.abs(this.point1.y - newY)) {
	        newX = this.point1.x;
	      } else {
	        newY = this.point1.y;
	      }
	    }
	
	    this.point2.x = newX;
	    return this.point2.y = newY;
	  }
	
	  move(deltaX, deltaY) {
	    this.point1.x += deltaX;
	    this.point1.y += deltaY;
	    this.point2.x += deltaX;
	    this.point2.y += deltaY;
	
	    //this.recomputeBounds();
	
	    if (this.getParentCircuit()) {
	      this.getParentCircuit().invalidate();
	    }
	
	    this.setPoints(this.point1.x, this.point1.y, this.point2.x, this.point2.y);
	
	    if (this.place) {
	      this.place()
	    }
	  }
	
	  moveTo(x, y) {
	    let deltaX = Util.snapGrid(x - this.getCenter().x);
	    let deltaY = Util.snapGrid(y - this.getCenter().y);
	
	    return this.move(deltaX, deltaY);
	  }
	
	  stamp() {
	    return this.Circuit.halt(`Called abstract function stamp() in Circuit ${this.constructor.name}`);
	  }
	
	  inspect() {
	    let paramValues = ((() => {
	      let result = [];
	      for (let key in this.params) {
	        let val = this.params[key];
	        result.push(val);
	      }
	      return result;
	    })());
	
	    return {
	      name: this.getName(),
	      pos: [this.point1.x, this.point1.y, this.point2.x, this.point2.y],
	      params: paramValues,
	      voltage: this.getVoltageDiff(),
	      current: this.getCurrent()
	    };
	  }
	
	  simpleString() {
	    let name = this.constructor.name.replace("Elm", "");
	    return `${name}@[${this.point1.x} ${this.point1.y} ${this.point2.x} ${this.point2.y}]`;
	  }
	
	  toString() {
	    let paramStrs = [];
	
	    if (Object.keys(this.params).length !== 0) {
	      for (let param in this.params) {
	        paramStrs.push(`${param}: ${this.getFieldText(param, 1)}`);
	      }
	    }
	
	    let paramStr = ` {${paramStrs.join(", ")}}`;
	
	    return this.simpleString() + paramStr;
	  }
	
	  getVoltageSourceCount() {
	    return 0;
	  }
	
	  getInternalNodeCount() {
	    return 0;
	  }
	
	  setNode(nodeIdx, newValue) {
	    return this.nodes[nodeIdx] = newValue;
	  }
	
	  setVoltageSource(node, value) {
	    return this.voltSource = value;
	  }
	
	  getVoltageSource() {
	    return this.voltSource;
	  }
	
	  nonLinear() {
	    return false;
	  }
	
	  // Two terminals by default, but likely to be overidden by subclasses
	  getPostCount() {
	    return 2;
	  }
	
	  getName() {
	    console.warn(`getName() was called by circuitComponent base class, but should be extended by subclasses (${this.constructor.name})`)
	    // return `${this.constructor.name}@[${this.point1.x} ${this.point1.y} ${this.point2.x} ${this.point2.y}] : ${JSON.stringify(this.params)}`;
	    return this.constructor.name
	  }
	
	  getNode(nodeIdx) {
	    return this.nodes[nodeIdx];
	  }
	
	  getVoltageForNode(nodeIdx) {
	    let subIdx = 0;
	
	    for (let node of Array.from(this.nodes)) {
	      if (node === nodeIdx) {
	        return this.volts[subIdx];
	      }
	
	      subIdx++;
	    }
	  }
	
	  getPost(postIdx) {
	    if (postIdx === 0) {
	      return this.point1;
	    } else if (postIdx === 1) {
	      return this.point2;
	    }
	  }
	
	  recomputeBounds() {
	    let center = this.getCenter();
	
	    let x = center.x;
	    let y = center.y;
	
	    let width = Math.max(this.width(), 5);
	    let height = Math.max(this.height(), 5);
	
	    this.setBbox(x-width/2, y-height/2, x + width/2, y+height/2);
	  }
	
	  getBoundingBox() {
	    return this.boundingBox;
	  }
	
	  isPlaced() {
	    return this.point1 && this.point1.x && this.point1.y
	  }
	
	  setBbox(x1, y1, x2, y2) {
	    //if (!(Util.isValue(x1) && Util.isValue(y1) && Util.isValue(x2) && Util.isValue(y2) && Util.isValue(this.dpx1()) && Util.isValue(this.dpy1())))
	      //console.trace(`Invalid BBox value for ${this.constructor.name} isPlaced: ${this.isPlaced()} [${this.x1()} ${this.y1()} ${this.x2()} ${this.y2()}] -> bbox(${x1}, ${y1}, ${x2}, ${y2})`);
	
	    let x = Math.min(x1, x2);
	    let y = Math.min(y1, y2);
	    let width = Math.max(Math.abs(x2 - x1), 3);
	    let height = Math.max(Math.abs(y2 - y1), 3);
	
	    this.boundingBox = new Rectangle(x, y, width, height);
	  }
	
	  setBboxPt(p1, p2, width = 1) {
	    //let width = Math.max(Math.abs(x2 - x1), 3);
	    //let height = Math.max(Math.abs(y2 - y1), 3);
	
	    let deltaX = (this.dy()/this.dn() * width);
	    let deltaY = (this.dx()/this.dn() * width);
	
	    //let deltaX = 0;
	    //let deltaY = 0;
	
	    this.setBbox(p1.x - deltaX/2, p1.y - deltaY/2, p2.x + deltaX/2, p2.y + deltaY/2);
	  }
	
	// Extended by subclasses
	  getSummary(additonalInfo = []) {
	    let summary = [
	      `${this.constructor.name} (${this.getName()})`,
	      this.simpleString(),
	      `V: ${Util.getUnitText(this.getVoltageDiff(), "V")}`,
	      `I = ${Util.getUnitText(this.getCurrent(), "A")}`,
	      `P = ${Util.getUnitText(this.getCurrent(), "W")}`
	    ];
	
	
	    if (additonalInfo && additonalInfo.length > 0)
	      summary = summary.concat(additonalInfo);
	
	    let paramsSummary = Object.keys(this.params).map((param) => {return `  ${param}: ${this.getFieldText(param)}`});
	
	    return summary.concat(paramsSummary);
	  }
	
	  getScopeValue(x) {
	    ((x === 1) ? this.getPower() : this.getVoltageDiff());
	  }
	
	  getScopeUnits(x) {
	    if (x === 1) {
	      return "W";
	    } else {
	      return "V";
	    }
	  }
	
	  getConnection(n1, n2) {
	    return true;
	  }
	
	  hasGroundConnection(n1) {
	    return false;
	  }
	
	  isWire() {
	    return false;
	  }
	
	  canViewInScope() {
	    return this.getPostCount() <= 2;
	  }
	
	  needsShortcut() {
	    return false;
	  }
	
	  //
	  // RENDERING METHODS
	  //
	
	  draw(renderContext) {
	    let post;
	    let color = Util.getColorForId(this.component_id);
	
	    renderContext.drawRect(this.boundingBox.x - 2, this.boundingBox.y - 2, this.boundingBox.width + 2, this.boundingBox.height + 2, 0.5, color);
	
	    // renderContext.drawValue 10, -15, this, @constructor.name
	    // renderContext.drawValue(12, -15 + (height * i), this, `${name}: ${value}`);
	
	    /*
	     renderContext.drawValue(-14, 0, this, this.toString());
	
	     if (this.params) {
	     let height = 8;
	     let i = 0;
	     for (let value = 0; value < this.params.length; value++) {
	     let name = this.params[value];
	     console.log(name, value);
	     renderContext.drawValue(12, -15 + (height * i), this, `${name}: ${value}`);
	     i += 1;
	     }
	     }
	     */
	
	    let outlineRadius = 7;
	
	    /*
	     // Draw node values
	     nodeIdx = 0
	     for node in @nodes
	     if @point1 && @point2
	     renderContext.drawValue 25+10*nodeIdx, -10*nodeIdx, this, "#{node}-#{@getVoltageForNode(node)}"
	     nodeIdx += 1
	     */
	
	
	    if (this.point1) {
	      renderContext.drawCircle(this.point1.x, this.point1.y, outlineRadius - 1, 1, color);
	    }
	
	    if (this.point2) {
	      renderContext.drawRect(this.point2.x - (outlineRadius / 2), this.point2.y - (outlineRadius / 2), outlineRadius - 1, outlineRadius - 1, 2, color);
	    }
	
	    /*
	     if (this.lead1) {
	     renderContext.drawRect(this.lead1.x - (outlineRadius / 2), this.lead1.y - (outlineRadius / 2), outlineRadius, outlineRadius, 2, 'rgba(0,255,0,0.7)');
	     }
	
	     if (this.lead2) {
	     renderContext.drawRect(this.lead2.x - (outlineRadius / 2), this.lead2.y - (outlineRadius / 2), outlineRadius, outlineRadius, 2, 'rgba(0,255,0,0.7)');
	     }
	     */
	
	    /*
	     for (let i=0; i<this.getPostCount(); ++i) {
	     let post = this.getPost(i);
	     renderContext.drawCircle(post.x, post.y, outlineRadius + 2, 1, 'rgba(255,0,255,0.5)')
	     }
	     */
	  }
	
	  debugDraw(renderContext) {
	    let post;
	    let color = Util.getColorForId(this.component_id);
	
	    renderContext.drawRect(this.boundingBox.x, this.boundingBox.y, this.boundingBox.width, this.boundingBox.height, 0, color);
	
	    // renderContext.drawValue 10, -15, this, @constructor.name
	    // renderContext.drawValue(12, -15 + (height * i), this, `${name}: ${value}`);
	
	    /*
	     renderContext.drawValue(-14, 0, this, this.toString());
	
	     if (this.params) {
	     let height = 8;
	     let i = 0;
	     for (let value = 0; value < this.params.length; value++) {
	     let name = this.params[value];
	     console.log(name, value);
	     renderContext.drawValue(12, -15 + (height * i), this, `${name}: ${value}`);
	     i += 1;
	     }
	     }
	     */
	
	    let outlineRadius = 7;
	
	    /*
	     // Draw node values
	     nodeIdx = 0
	     for node in @nodes
	     if @point1 && @point2
	     renderContext.drawValue 25+10*nodeIdx, -10*nodeIdx, this, "#{node}-#{@getVoltageForNode(node)}"
	     nodeIdx += 1
	     */
	
	
	    /*
	
	     if (this.point1) {
	     renderContext.drawCircle(this.point1.x, this.point1.y, outlineRadius - 1, 1, color);
	     }
	
	     if (this.point2) {
	     renderContext.drawRect(this.point2.x - (outlineRadius / 2), this.point2.y - (outlineRadius / 2), outlineRadius - 1, outlineRadius - 1, 2, color);
	     }
	
	
	     if (this.lead1) {
	     renderContext.drawRect(this.lead1.x - (outlineRadius / 2), this.lead1.y - (outlineRadius / 2), outlineRadius, outlineRadius, 2, 'rgba(0,255,0,0.7)');
	     }
	
	     if (this.lead2) {
	     renderContext.drawRect(this.lead2.x - (outlineRadius / 2), this.lead2.y - (outlineRadius / 2), outlineRadius, outlineRadius, 2, 'rgba(0,255,0,0.7)');
	     }
	     */
	
	
	    /*
	    for (let i = 0; i < this.getPostCount(); ++i) {
	      let post = this.getPost(i);
	      renderContext.drawCircle(post.x, post.y, outlineRadius + 2, 1, 'rgba(255,0,255,0.5)')
	    }
	    */
	
	  }
	
	  updateDots(ds, current = null) {
	    if (this.Circuit && this.Circuit.isStopped) {
	      return
	    }
	
	    if (ds == null) {
	      ds = Settings.CURRENT_SEGMENT_LENGTH;
	    }
	    if (this.Circuit) {
	      if (!this.curcount) {
	        this.curcount = 0;
	      }
	
	      let currentIncrement = (current || this.current) * this.Circuit.Params.getCurrentMult();
	
	      this.curcount = (this.curcount + currentIncrement) % ds;
	      if (this.curcount < 0) {
	        this.curcount += ds;
	      }
	
	      return this.curcount;
	    }
	  }
	
	  timeStep() {
	    return this.Circuit.timeStep();
	  }
	
	  needsShortcut() {
	    return false;
	  }
	
	  hash() {
	    return `${this.constructor.name}${this.point1.x}${this.point1.y}${this.point2.x}${this.point2.y}`;
	  }
	
	  equals(otherComponent) {
	    return otherComponent.toString() === this.toString();
	  }
	
	  serialize() {
	    return {
	      name: this.constructor.name,
	      pos: [this.point1.x, this.point1.y, this.point2.x, this.point2.y],
	      flags: this.flags,
	      params: this.params
	    }
	  }
	
	  toJson() {
	    return {
	      x: this.point1.x,
	      y: this.point1.y,
	      x2: this.point2.x,
	      y2: this.point2.y,
	      flags: this.flags,
	      nodes: this.nodes,
	      params: this.params,
	      selected: false,
	      voltSource: this.getVoltageSource(),
	      needsShortcut: this.needsShortcut(),
	      name: this.constructor.name,
	      postCount: this.getPostCount(),
	      nonLinear: this.nonLinear()
	    };
	  }
	
	  getProperties() {
	    return {
	      name: this.getName(),
	      pos: [this.point1.x, this.point1.y, this.point2.x, this.point2.y],
	      params: this.params,
	      current: this.getCurrent(),
	      voltDiff: this.getVoltageDiff(),
	      power: this.getPower()
	    };
	  }
	
	  isValidParam(paramName, paramValue) {
	    let field = this.constructor.Fields[paramName];
	
	    if (!field) {
	      console.error(`Error while setting param for ${this.getName()}: '${paramName}' is not a field in ${this.getParamNames()}`);
	      return false
	    }
	
	    if (field && field["range"]) {
	      let [minValue, maxValue] = field["range"];
	
	      if (paramValue > maxValue || paramValue < minValue) {
	        console.error(`${this.constructor.name}: invalid param value for ${paramName}: ${paramValue}. Not in range [${minValue}, ${maxValue}]`)
	        return false
	      }
	    }
	
	    if (field && field["select_values"]) {
	      let selectValues = Object.keys(field["select_values"]).map(key => field["select_values"][key]);
	
	      if (!(selectValues.includes(paramValue))) {
	        console.error(`${this.constructor.name}: invalid param value for ${paramName}: ${paramValue}. Not in possible values: ${selectValues}`)
	        return false
	      }
	    }
	
	    return true
	  }
	
	  update(params) {
	    for (let paramName in params) {
	      this.setValue(paramName, params[paramName])
	    }
	  }
	
	  setValue(paramName, paramValue) {
	    /**
	     * parseFunction converts a *possibly* stringified `paramValue` to a raw value. Common examples of parseFunction
	     * are builtins like parseFloat, parseInt, etc.
	     */
	    let parseFunction = (this.constructor.Fields[paramName] && this.constructor.Fields[paramName]['data_type'])
	
	    // default to a no-op if parseFunction isn't defined
	    if (!parseFunction) {
	      parseFunction = function noop(x) {
	        return x;
	      };
	    }
	
	    if (this.isValidParam(paramName, paramValue)) {
	      this[paramName] = parseFunction(paramValue);
	      this.params[paramName] = parseFunction(paramValue);
	    }
	  }
	
	  getParamNames() {
	    return Object.keys(this.constructor.Fields);
	  }
	
	  /**
	   Returns the JSON metadata object for this field with an additional key/value pair for the assigned value.
	   Used externally to edit/update component values
	
	   Eg:
	   voltageElm.getFieldWithValue("waveform")
	
	   {
	     name: "none"
	     default_value: 0
	     data_type: parseInt
	     range: [0, 6]
	     input_type: "select"
	     select_values: ...
	     value: 2   Square wave
	   }
	
	   @see @Fields
	   */
	  getFieldWithValue(param_name) {
	    let param_value = this.params[param_name];
	
	    let field_metadata = {};
	
	    for (let key in this.constructor.Fields[param_name]) {
	      let value = this.constructor.Fields[param_name][key];
	      if (key !== "data_type") {
	        field_metadata[key] = value;
	      }
	    }
	
	    field_metadata['value'] = param_value;
	
	    return field_metadata;
	  }
	
	  onSolder(circuit) {
	  }
	
	  onclick() {
	  }
	
	  getFieldText(fieldname, decimalPoints = 1) {
	    let fields = this.constructor.Fields;
	    let field = fields[fieldname];
	
	    let symbol = "";
	    if (field)
	      symbol = field["symbol"] || "";
	
	    let paramValue = this.params[fieldname];
	
	    //console.log(fieldname, paramValue);
	
	    if (typeof paramValue == 'number') {
	      return Util.getUnitText(paramValue, symbol, decimalPoints);
	    } else {
	      return paramValue;
	    }
	  };
	}
	
	
	module.exports = CircuitComponent;


/***/ },
/* 2 */
/***/ function(module, exports) {

	/*
	Stores Environment-specific settings
	
	These are the global settings for Maxwell and should defined by the user.
	Settings do not change by loading a new circuit.
	*/
	
	
	let ColorPalette = undefined;
	class Settings {
	  static initClass() {
	    // Used from https://github.com/matthewbj/Colors/blob/master/colors.js:
	    ColorPalette = {
	  
	    // Voltage scale goes from Red (low voltage) to Green (high volage)
	      'voltageScale': [
	        // Red color scale
	        "#ff0000", "#f70707", "#ef0f0f", "#e71717", "#df1f1f", "#d72727", "#cf2f2f", "#c73737",
	        "#bf3f3f", "#b74747", "#af4f4f", "#a75757", "#9f5f5f", "#976767", "#8f6f6f", "#877777",
	  
	        "#7f7f7f", // Grey
	  
	        // Green color scale
	        "#778777", "#6f8f6f", "#679767", "#5f9f5f", "#57a757", "#4faf4f", "#47b747", "#3fbf3f",
	        "#37c737", "#2fcf2f", "#27d727", "#1fdf1f", "#17e717", "#0fef0f", "#07f707", "#00ff00"
	      ],
	  
	      'aliceblue': '#f0f8ff',
	      'antiquewhite': '#faebd7',
	      'aqua': '#00ffff',
	      'aquamarine': '#7fffd4',
	      'azure': '#f0ffff',
	      'beige': '#f5f5dc',
	      'bisque': '#ffe4c4',
	      'black': '#000000',
	      'blanchedalmond': '#ffebcd',
	      'blue': '#0000ff',
	      'blueviolet': '#8a2be2',
	      'brown': '#a52a2a',
	      'burlywood': '#deb887',
	      'cadetblue': '#5f9ea0',
	      'chartreuse': '#7fff00',
	      'chocolate': '#d2691e',
	      'coral': '#ff7f50',
	      'cornflowerblue': '#6495ed',
	      'cornsilk': '#fff8dc',
	      'crimson': '#dc143c',
	      'cyan': '#00ffff',
	      'darkblue': '#00008b',
	      'darkcyan': '#008b8b',
	      'darkgoldenrod': '#b8860b',
	      'darkgray': '#a9a9a9',
	      'darkgrey': '#a9a9a9',
	      'darkgreen': '#006400',
	      'darkkhaki': '#bdb76b',
	      'darkmagenta': '#8b008b',
	      'darkolivegreen': '#556b2f',
	      'darkorange': '#ff8c00',
	      'darkorchid': '#9932cc',
	      'darkred': '#8b0000',
	      'darksalmon': '#e9967a',
	      'darkseagreen': '#8fbc8f',
	      'darkslateblue': '#483d8b',
	      'darkslategray': '#2f4f4f',
	      'darkslategrey': '#2f4f4f',
	      'darkturquoise': '#00ced1',
	      'darkviolet': '#9400d3',
	      'deeppink': '#ff1493',
	      'deepskyblue': '#00bfff',
	      'dimgray': '#696969',
	      'dimgrey': '#696969',
	      'dodgerblue': '#1e90ff',
	      'firebrick': '#b22222',
	      'floralwhite': '#fffaf0',
	      'forestgreen': '#228b22',
	      'fuchsia': '#ff00ff',
	      'gainsboro': '#dcdcdc',
	      'ghostwhite': '#f8f8ff',
	      'gold': '#ffd700',
	      'goldenrod': '#daa520',
	      'gray': '#808080',
	      'grey': '#808080',
	      'green': '#008000',
	      'greenyellow': '#adff2f',
	      'honeydew': '#f0fff0',
	      'hotpink': '#ff69b4',
	      'indianred': '#cd5c5c',
	      'indigo': '#4b0082',
	      'ivory': '#fffff0',
	      'khaki': '#f0e68c',
	      'lavender': '#e6e6fa',
	      'lavenderblush': '#fff0f5',
	      'lawngreen': '#7cfc00',
	      'lemonchiffon': '#fffacd',
	      'lightblue': '#add8e6',
	      'lightcoral': '#f08080',
	      'lightcyan': '#e0ffff',
	      'lightgoldenrodyellow': '#fafad2',
	      'lightgray': '#d3d3d3',
	      'lightgrey': '#d3d3d3',
	      'lightgreen': '#90ee90',
	      'lightpink': '#ffb6c1',
	      'lightsalmon': '#ffa07a',
	      'lightseagreen': '#20b2aa',
	      'lightskyblue': '#87cefa',
	      'lightslategray': '#778899',
	      'lightslategrey': '#778899',
	      'lightsteelblue': '#b0c4de',
	      'lightyellow': '#ffffe0',
	      'lime': '#00ff00',
	      'limegreen': '#32cd32',
	      'linen': '#faf0e6',
	      'magenta': '#ff00ff',
	      'maroon': '#800000',
	      'mediumaquamarine': '#66cdaa',
	      'mediumblue': '#0000cd',
	      'mediumorchid': '#ba55d3',
	      'mediumpurple': '#9370d8',
	      'mediumseagreen': '#3cb371',
	      'mediumslateblue': '#7b68ee',
	      'mediumspringgreen': '#00fa9a',
	      'mediumturquoise': '#48d1cc',
	      'mediumvioletred': '#c71585',
	      'midnightblue': '#191970',
	      'mintcream': '#f5fffa',
	      'mistyrose': '#ffe4e1',
	      'moccasin': '#ffe4b5',
	      'navajowhite': '#ffdead',
	      'navy': '#000080',
	      'oldlace': '#fdf5e6',
	      'olive': '#808000',
	      'olivedrab': '#6b8e23',
	      'orange': '#ffa500',
	      'orangered': '#ff4500',
	      'orchid': '#da70d6',
	      'palegoldenrod': '#eee8aa',
	      'palegreen': '#98fb98',
	      'paleturquoise': '#afeeee',
	      'palevioletred': '#d87093',
	      'papayawhip': '#ffefd5',
	      'peachpuff': '#ffdab9',
	      'peru': '#cd853f',
	      'pink': '#ffc0cb',
	      'plum': '#dda0dd',
	      'powderblue': '#b0e0e6',
	      'purple': '#800080',
	      'red': '#ff0000',
	      'rosybrown': '#bc8f8f',
	      'royalblue': '#4169e1',
	      'saddlebrown': '#8b4513',
	      'salmon': '#fa8072',
	      'sandybrown': '#f4a460',
	      'seagreen': '#2e8b57',
	      'seashell': '#fff5ee',
	      'sienna': '#a0522d',
	      'silver': '#c0c0c0',
	      'skyblue': '#87ceeb',
	      'slateblue': '#6a5acd',
	      'slategray': '#708090',
	      'slategrey': '#708090',
	      'snow': '#fffafa',
	      'springgreen': '#00ff7f',
	      'steelblue': '#4682b4',
	      'tan': '#d2b48c',
	      'teal': '#008080',
	      'thistle': '#d8bfd8',
	      'tomato': '#ff6347',
	      'turquoise': '#40e0d0',
	      'violet': '#ee82ee',
	      'wheat': '#f5deb3',
	      'white': '#ffffff',
	      'whitesmoke': '#f5f5f5',
	      'yellow': '#ffff00',
	      'yellowgreen': '#9acd32'
	    };
	  
	    this.CURENT_TYPE_DOTS = "DOTS";
	    this.CURENT_TYPE_DASHES = "DASHES";
	  
	    this.FRACTIONAL_DIGITS = 2;
	    this.CURRENT_SEGMENT_LENGTH = 16;
	    this.WIRE_POSTS = true;
	  
	    // Line Widths:
	    this.POST_RADIUS = 2;
	    this.POST_OUTLINE_SIZE = 1;
	    this.CURRENT_RADIUS = 2;
	    this.CURRENT_COLOR = "rgba(255, 255, 255, 0.7)";
	    this.LINE_WIDTH = 2;
	    this.BOLD_LINE_WIDTH = 4;
	
	    // Grid
	    this.GRID_SIZE = 8;
	    this.SMALL_GRID = false;
	  
	    this.SHOW_VALUES = false;
	
	    this.TEXT_STROKE_COLOR = "#FFF";
	  
	    this.CURRENT_DISPLAY_TYPE = "DASHES";
	  
	    // ColorPalettes:
	    // this.SELECT_COLOR = ColorPalette.ivory;
	    this.SELECT_COLOR = "#573400";
	    this.HIGHLIGHT_COLOR = ColorPalette.orangered;
	
	    this.LIGHT_POST_COLOR = "#333";
	    this.POST_COLOR = ColorPalette.black;
	    this.POST_OUTLINE_COLOR = "#666";
	    this.POST_SELECT_COLOR = '#ff8c00';
	    this.POST_SELECT_OUTLINE_COLOR = '#F0F';
	
	    this.DOTS_COLOR = ColorPalette.yellow;
	    this.DOTS_OUTLINE = ColorPalette.orange;
	  
	    this.TEXT_COLOR = ColorPalette.black;
	    this.TEXT_ERROR_COLOR = ColorPalette.red;
	    this.TEXT_WARNING_COLOR = ColorPalette.yellow;
	
	    this.TEXT_SIZE = 7.5;
	    this.FONT = 'Monaco';
	    this.TEXT_STYLE = 'bold';
	    this.LABEL_COLOR = '#0000cd';
	    this.PIN_LABEL_COLOR = '#444';
	    this.SECONDARY_COLOR = '#777';
	
	    this.SELECTION_MARQUEE_COLOR = ColorPalette.orange;
	  
	    this.GREY = "#666";
	    this.GRAY = "#666";
	  
	    this.COMPONENT_DECIMAL_PLACES = 1;
	
	    this.GRID_COLOR = ColorPalette.darkyellow;
	    this.SWITCH_COLOR = "#666";
	    this.FILL_COLOR = ColorPalette.white;
	    this.BG_COLOR = ColorPalette.white;
	    this.FG_COLOR = ColorPalette.white;
	    this.STROKE_COLOR = ColorPalette.black;
	    this.ERROR_COLOR = ColorPalette.darkred;
	    this.WARNING_COLOR = ColorPalette.orange;
	  }
	}
	Settings.initClass();
	
	module.exports = Settings;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	let Point = __webpack_require__(4);
	
	class Rectangle {
	  constructor(x, y, width, height) {
	    this.x = x;
	    this.y = y;
	    this.width = width;
	    this.height = height;
	  }
	
	  contains(x, y) {
	    return ((x >= this.x) && (x <= (this.x + this.width)) && (y >= this.y) && (y <= (this.y + this.height)));
	  }
	
	  getCenter() {
	    return new Point(this.x + this.width/2, this.y + this.height/2);
	  }
	
	  equals(otherRect) {
	    if (otherRect != null) {
	      if( (otherRect.x === this.x) && (otherRect.y === this.y) &&
	          (otherRect.width === this.width) && (otherRect.height === this.height) ) {
	        return true;
	      }
	    }
	    return false;
	  }
	
	  intersects(otherRect) {
	    this.x2 = this.x + this.width;
	    this.y2 = this.y + this.height;
	
	    let otherX = otherRect.x;
	    let otherY = otherRect.y;
	    let otherX2 = otherRect.x + otherRect.width;
	    let otherY2 = otherRect.y + otherRect.height;
	
	    return (this.x < otherX2) && (this.x2 > otherX) && (this.y < otherY2) && (this.y2 > otherY);
	  }
	
	  collidesWithComponent(circuitComponent) {
	    return this.intersects(circuitComponent.getBoundingBox());
	  }
	
	  toString() {
	    return `(${this.x}, ${this.y}) [w: ${this.width}, h: ${this.height}]`;
	  }
	}
	
	module.exports = Rectangle;


/***/ },
/* 4 */
/***/ function(module, exports) {

	class Point {
	  constructor(x, y) {
	    this.x = x;
	    this.y = y;
	  }
	
	  equals(otherPoint) {
	    return ((this.x === otherPoint.x) && (this.y === otherPoint.y));
	  }
	
	  static distanceSq(x1, y1, x2, y2) {
	    x2 -= x1;
	    y2 -= y1;
	    return (x2 * x2) + (y2 * y2);
	  }
	
	  static toArray(num) {
	    return (Array.from(Array(num)).map((i) => new Point(0, 0)));
	  }
	
	  toString() {
	    return `[${this.x}, ${this.y}]`;
	  }
	}
	
	module.exports = Point;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {let Point = __webpack_require__(4);
	let Polygon = __webpack_require__(7);
	let Settings = __webpack_require__(2);
	let Color = __webpack_require__(8);
	let { sprintf } = __webpack_require__(9);
	let environment = __webpack_require__(10);
	
	class Util {
	
	  static extend(originalObj, newObject) {
	    let value;
	    let extendedObj = {};
	
	    for (var key in originalObj) {
	      value = originalObj[key];
	      extendedObj[key] = originalObj[key];
	    }
	
	    for (key in newObject) {
	      value = newObject[key];
	      extendedObj[key] = newObject[key];
	    }
	
	    return extendedObj;
	  }
	
	  // Calculate fractional vector between AB
	  static interpolate(ptA, ptB, u, v) {
	    if (v == null) { v = 0; }
	    if ((arguments.length) > 4) {
	      this.halt(`Wrong arguments (${arguments.length}) in 'interpolate' ${arguments}`);
	    }
	
	    let dx = ptB.y - ptA.y;
	    let dy = ptA.x - ptB.x;
	    v /= Math.sqrt((dx*dx) + (dy*dy));
	
	    let interpX = Math.round(((1-u)*ptA.x) + (u*ptB.x) + (v*dx));
	    let interpY = Math.round(((1-u)*ptA.y) + (u*ptB.y) + (v*dy));
	
	    return new Point(interpX, interpY);
	  }
	
	  //#
	  // From a vector between points AB, calculate a new point in space relative to some multiple of the parallel (u)
	  // and perpindicular (v) components of the the original AB vector.
	  //
	  static interpolateSymmetrical(ptA, ptB, u, v) {
	    if ((arguments.length) > 4) {
	      this.halt(`Wrong # of arguments (${arguments.length}) in 'interpolateSymmetrical' ${arguments}`);
	    }
	
	    let dx = ptB.y - ptA.y;
	    let dy = ptA.x - ptB.x;
	    v /= Math.sqrt((dx*dx) + (dy*dy));
	
	    let interpX = Math.round(((1-u)*ptA.x) + (u*ptB.x) + (v*dx));
	    let interpY = Math.round(((1-u)*ptA.y) + (u*ptB.y) + (v*dy));
	
	    let interpXReflection = Math.round((((1-u)*ptA.x) + (u*ptB.x)) - (v*dx));
	    let interpYReflection = Math.round((((1-u)*ptA.y) + (u*ptB.y)) - (v*dy));
	
	    return [new Point(interpX, interpY), new Point(interpXReflection, interpYReflection)];
	  }
	
	  static calcArrow(point1, point2, al, aw) {
	    if ((arguments.length) !== 4) {
	      this.halt(`Wrong arguments (${arguments.length}) in 'calcArrow' ${arguments}`);
	    }
	
	    let poly = new Polygon();
	
	    let dx = point2.x - point1.x;
	    let dy = point2.y - point1.y;
	    let dist = Math.sqrt((dx * dx) + (dy * dy));
	
	    poly.addVertex(point2.x, point2.y);
	
	    let [p1, p2] = Util.interpolateSymmetrical(point1, point2, 1 - (al / dist), aw);
	
	    poly.addVertex(p1.x, p1.y);
	    poly.addVertex(p2.x, p2.y);
	
	    return poly;
	  }
	
	  static createPolygon(pt1, pt2, pt3, pt4) {
	    let newPoly = new Polygon();
	    newPoly.addVertex(pt1.x, pt1.y);
	    newPoly.addVertex(pt2.x, pt2.y);
	    newPoly.addVertex(pt3.x, pt3.y);
	    if (pt4) { newPoly.addVertex(pt4.x, pt4.y); }
	
	    return newPoly;
	  }
	
	  static createPolygonFromArray(vertexArray) {
	    let newPoly = new Polygon();
	    for (let vertex of Array.from(vertexArray)) {
	      newPoly.addVertex(vertex.x, vertex.y);
	    }
	
	    return newPoly;
	  }
	
	  static zeroArray(numElements) {
	    if (!numElements || numElements < 1) {
	      return [];
	    } else {
	      return (Array.from(Array(numElements)).map((i) => 0));
	    }
	  }
	
	  static zeroArray2(numRows, numCols) {
	    if (numRows < 1) { return []; }
	    return (Array.from(Array(numRows)).map((i) => this.zeroArray(numCols)));
	  }
	
	// Loops through an array, returning false and throwing an error if NaN or Inf values are found.
	//  If no NaN or Inf values are found, this array is determined to be clean and the method returns true.
	  static isCleanArray(arr) {
	    for (let element of Array.from(arr)) {
	      if (element instanceof Array) {
	        let valid = arguments.callee(element);
	      } else {
	        if (!isFinite(element)) {
	          console.trace(`Invalid number found: ${element}`);
	          return false;
	        }
	      }
	    }
	  }
	
	  static newPointArray(n) {
	    let a = new Array(n);
	    while (n > 0) {
	      a[--n] = new Point(0, 0);
	    }
	
	    return a;
	  }
	
	  /*
	  static printArray(arr) {
	    return Array.from(arr).map((subarr) => console.log(subarr));
	  }
	  */
	
	  static removeFromArray(arr, ...items) {
	    for (let item of Array.from(items)) {
	      var ax;
	      while ((ax = arr.indexOf(item)) !== -1) {
	        arr.splice(ax, 1);
	      }
	    }
	
	    return arr;
	  }
	
	  static isInfinite(x) {
	    return !isFinite(x);
	  }
	
	  static getRand(x) {
	    return Math.floor(Math.random() * (x + 1));
	  }
	
	  static getUnitText(value, unit = "", decimalPoints = 2) {
	    let absValue = Math.abs(value);
	    if (absValue < 1e-18) { return `0 ${unit}`; }
	    if (absValue < 1e-12) { return (value * 1e15).toFixed(decimalPoints) + " f" + unit; }
	    if (absValue < 1e-9) { return (value * 1e12).toFixed(decimalPoints) + " p" + unit; }
	    if (absValue < 1e-6) { return (value * 1e9).toFixed(decimalPoints) + " n" + unit; }
	    if (absValue < 1e-3) { return (value * 1e6).toFixed(decimalPoints) + " μ" + unit; }
	    if (absValue < 1) { return (value * 1e3).toFixed(decimalPoints) + " m" + unit; }
	    if (absValue < 1e3) { return (value).toFixed(decimalPoints) + " " + unit; }
	    if (absValue < 1e6) { return (value * 1e-3).toFixed(decimalPoints) + " k" + unit; }
	    if (absValue < 1e9) { return (value * 1e-6).toFixed(decimalPoints) + " M" + unit; }
	    return (value * 1e-9).toFixed(decimalPoints) + " G" + unit;
	  }
	
	  static snapGrid(x) {
	    return Settings.GRID_SIZE * Math.round(x/Settings.GRID_SIZE);
	  }
	
	  static showFormat(decimalNum) {
	    return decimalNum.toPrecision(2);
	  }
	
	  static longFormat(decimalNum) {
	    return decimalNum.toPrecision(4);
	  }
	
	  static singleFloat(f) {
	    if (f === undefined) {
	      return "undef";
	    } else {
	      return sprintf("%0.1f", f);
	    }
	  }
	
	  static tidyFloat(f) {
	    if (f === undefined) {
	      return "undef";
	    } else {
	      return sprintf("%0.2f", f);
	    }
	  }
	
	  static floatToPercent(f, digits = 1) {
	    return sprintf("%0.0f", f * 100) + "%";
	  }
	
	  static isFunction(v) {
	    return typeof v === "function";
	  }
	
	  /*
	  Removes commas from a number containing a string:
	  e.g. 1,234,567.99 -> 1234567.99
	  */
	  static noCommaFormat(numberWithCommas) {
	    return numberWithCommas.replace(/,/g, '');
	  }
	
	  static printArray(array) {
	    let matrixRowCount = array.length;
	
	    let arrayStr = "[";
	
	    for (let i = 0, end = matrixRowCount, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
	      arrayStr += Util.tidyFloat(array[i]);
	
	      if(i !== (matrixRowCount - 1)) {
	        arrayStr += ", ";
	      }
	    }
	//        circuitMatrixDump += ", "
	
	    arrayStr += "]";
	
	    return arrayStr;
	  }
	
	  static isValue(x) {
	    return !isNaN(x) && ((typeof x == "string") || (typeof x == "number") || (typeof x == "boolean"))
	  }
	
	  static commaFormat(plainNumber) {
	    // Simple method of converting a parameter to a string
	    plainNumber += "";
	
	    // Ignore any numbers after a '.'
	    let x = plainNumber.split(".");
	    let x1 = x[0];
	    let x2 = (x.length > 1 ? `.${x[1]}` : "");
	    let pattern = /(\d+)(\d{3})/;
	    while (pattern.test(x1)) { x1 = x1.replace(pattern, "$1,$2"); }
	
	    return x1 + x2;
	  }
	
	  static colorHash() {
	
	  }
	
	  static getColorForId(id) {
	    let letters = '0123456789ABCDEF';
	    let color = '#';
	
	    for (let i = 0; i < 6; i++ ) {
	      color += letters[(i+3)*(i+4)*id % 16];
	    }
	
	    return color;
	  }
	
	  static typeOf(obj, klassType) {
	    return (obj.constructor === klassType) || (obj.constructor.prototype instanceof klassType);
	  }
	
	  static halt(message) {
	    console.trace(message);
	
	    if (!environment.isBrowser) {
	      return process.exit(1);
	    }
	  }
	
	  static comparePair(x1, x2, y1, y2) {
	    return ((x1 === y1) && (x2 === y2)) || ((x1 === y2) && (x2 === y1));
	  }
	
	  static overlappingPoints(pt1, pt2) {
	    return (pt1.x === pt2.x) && (pt1.y === pt2.y);
	  }
	
	  static rgb2hex(r, g, b) {
	    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
	  }
	
	  static diff(a, b) {
	    return a.filter(function(i) {return b.indexOf(i) < 0;});
	  }
	}
	
	
	module.exports = Util;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 6 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	
	
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	
	
	
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	let Point = __webpack_require__(4);
	
	class Polygon {
	  constructor(vertices) {
	    this.vertices = [];
	    if (vertices && ((vertices.length % 2) === 0)) {
	      let i = 0;
	      while (i < vertices.length) {
	        this.addVertex(vertices[i], vertices[i + 1]);
	        i += 2;
	      }
	    }
	  }
	
	  addVertex(x, y) {
	    return this.vertices.push(new Point(x, y));
	  }
	
	  getX(n) {
	    return this.vertices[n].x;
	  }
	
	  getY(n) {
	    return this.vertices[n].y;
	  }
	
	  numPoints() {
	    return this.vertices.length;
	  }
	
	  toString(){
	    return JSON.stringify(this.vertices);
	  }
	}
	
	module.exports = Polygon;


/***/ },
/* 8 */
/***/ function(module, exports) {

	let RedGreen =
	    ["#ff0000", "#f70707", "#ef0f0f", "#e71717", "#df1f1f", "#d72727", "#cf2f2f", "#c73737",
	      "#bf3f3f", "#b74747", "#af4f4f", "#a75757", "#9f5f5f", "#976767", "#8f6f6f", "#877777",
	      "#7f7f7f", "#778777", "#6f8f6f", "#679767", "#5f9f5f", "#57a757", "#4faf4f", "#47b747",
	      "#3fbf3f", "#37c737", "#2fcf2f", "#27d727", "#1fdf1f", "#17e717", "#0fef0f", "#07f707", "#00ff00"];
	
	let scale =
	    ["#B81B00", "#B21F00", "#AC2301", "#A72801", "#A12C02", "#9C3002", "#963503", "#913903",
	      "#8B3E04", "#854205", "#804605", "#7A4B06", "#754F06", "#6F5307", "#6A5807", "#645C08",
	      "#5F6109", "#596509", "#53690A", "#4E6E0A", "#48720B", "#43760B", "#3D7B0C", "#387F0C",
	      "#32840D", "#2C880E", "#278C0E", "#21910F", "#1C950F", "#169910", "#119E10", "#0BA211", "#06A712"];
	
	let blueScale =
	    ["#EB1416", "#E91330", "#E7134A", "#E51363", "#E3137C", "#E11394", "#E013AC", "#DE13C3",
	      "#DC13DA", "#C312DA", "#AA12D8", "#9012D7", "#7712D5", "#5F12D3", "#4612D1", "#2F12CF",
	      "#1712CE", "#1123CC", "#1139CA", "#114FC8", "#1164C6", "#1179C4", "#118EC3", "#11A2C1",
	      "#11B6BF", "#10BDB1", "#10BB9B", "#10BA84", "#10B86F", "#10B659", "#10B444", "#10B230", "#10B11C"];
	
	let Color = {
	  'aliceblue': '#f0f8ff',
	  'antiquewhite': '#faebd7',
	  'aqua': '#00ffff',
	  'aquamarine': '#7fffd4',
	  'azure': '#f0ffff',
	  'beige': '#f5f5dc',
	  'bisque': '#ffe4c4',
	  'black': '#000000',
	  'blanchedalmond': '#ffebcd',
	  'blue': '#0000ff',
	  'blueviolet': '#8a2be2',
	  'brown': '#a52a2a',
	  'burlywood': '#deb887',
	  'cadetblue': '#5f9ea0',
	  'chartreuse': '#7fff00',
	  'chocolate': '#d2691e',
	  'coral': '#ff7f50',
	  'cornflowerblue': '#6495ed',
	  'cornsilk': '#fff8dc',
	  'crimson': '#dc143c',
	  'cyan': '#00ffff',
	  'darkblue': '#00008b',
	  'darkcyan': '#008b8b',
	  'darkgoldenrod': '#b8860b',
	  'darkgray': '#a9a9a9',
	  'darkgrey': '#a9a9a9',
	  'darkgreen': '#006400',
	  'darkkhaki': '#bdb76b',
	  'darkmagenta': '#8b008b',
	  'darkolivegreen': '#556b2f',
	  'darkorange': '#ff8c00',
	  'darkorchid': '#9932cc',
	  'darkred': '#8b0000',
	  'darksalmon': '#e9967a',
	  'darkseagreen': '#8fbc8f',
	  'darkslateblue': '#483d8b',
	  'darkslategray': '#2f4f4f',
	  'darkslategrey': '#2f4f4f',
	  'darkturquoise': '#00ced1',
	  'darkviolet': '#9400d3',
	  'deeppink': '#ff1493',
	  'deepskyblue': '#00bfff',
	  'dimgray': '#696969',
	  'dimgrey': '#696969',
	  'dodgerblue': '#1e90ff',
	  'firebrick': '#b22222',
	  'floralwhite': '#fffaf0',
	  'forestgreen': '#228b22',
	  'fuchsia': '#ff00ff',
	  'gainsboro': '#dcdcdc',
	  'ghostwhite': '#f8f8ff',
	  'gold': '#ffd700',
	  'goldenrod': '#daa520',
	  'gray': '#808080',
	  'grey': '#808080',
	  'green': '#008000',
	  'greenyellow': '#adff2f',
	  'honeydew': '#f0fff0',
	  'hotpink': '#ff69b4',
	  'indianred': '#cd5c5c',
	  'indigo': '#4b0082',
	  'ivory': '#fffff0',
	  'khaki': '#f0e68c',
	  'lavender': '#e6e6fa',
	  'lavenderblush': '#fff0f5',
	  'lawngreen': '#7cfc00',
	  'lemonchiffon': '#fffacd',
	  'lightblue': '#add8e6',
	  'lightcoral': '#f08080',
	  'lightcyan': '#e0ffff',
	  'lightgoldenrodyellow': '#fafad2',
	  'lightgray': '#d3d3d3',
	  'lightgrey': '#d3d3d3',
	  'lightgreen': '#90ee90',
	  'lightpink': '#ffb6c1',
	  'lightsalmon': '#ffa07a',
	  'lightseagreen': '#20b2aa',
	  'lightskyblue': '#87cefa',
	  'lightslategray': '#778899',
	  'lightslategrey': '#778899',
	  'lightsteelblue': '#b0c4de',
	  'lightyellow': '#ffffe0',
	  'lime': '#00ff00',
	  'limegreen': '#32cd32',
	  'linen': '#faf0e6',
	  'magenta': '#ff00ff',
	  'maroon': '#800000',
	  'mediumaquamarine': '#66cdaa',
	  'mediumblue': '#0000cd',
	  'mediumorchid': '#ba55d3',
	  'mediumpurple': '#9370d8',
	  'mediumseagreen': '#3cb371',
	  'mediumslateblue': '#7b68ee',
	  'mediumspringgreen': '#00fa9a',
	  'mediumturquoise': '#48d1cc',
	  'mediumvioletred': '#c71585',
	  'midnightblue': '#191970',
	  'mintcream': '#f5fffa',
	  'mistyrose': '#ffe4e1',
	  'moccasin': '#ffe4b5',
	  'navajowhite': '#ffdead',
	  'navy': '#000080',
	  'oldlace': '#fdf5e6',
	  'olive': '#808000',
	  'olivedrab': '#6b8e23',
	  'orange': '#ffa500',
	  'orangered': '#ff4500',
	  'orchid': '#da70d6',
	  'palegoldenrod': '#eee8aa',
	  'palegreen': '#98fb98',
	  'paleturquoise': '#afeeee',
	  'palevioletred': '#d87093',
	  'papayawhip': '#ffefd5',
	  'peachpuff': '#ffdab9',
	  'peru': '#cd853f',
	  'pink': '#ffc0cb',
	  'plum': '#dda0dd',
	  'powderblue': '#b0e0e6',
	  'purple': '#800080',
	  'red': '#ff0000',
	  'rosybrown': '#bc8f8f',
	  'royalblue': '#4169e1',
	  'saddlebrown': '#8b4513',
	  'salmon': '#fa8072',
	  'sandybrown': '#f4a460',
	  'seagreen': '#2e8b57',
	  'seashell': '#fff5ee',
	  'sienna': '#a0522d',
	  'silver': '#c0c0c0',
	  'skyblue': '#87ceeb',
	  'slateblue': '#6a5acd',
	  'slategray': '#708090',
	  'slategrey': '#708090',
	  'snow': '#fffafa',
	  'springgreen': '#00ff7f',
	  'steelblue': '#4682b4',
	  'tan': '#d2b48c',
	  'teal': '#008080',
	  'thistle': '#d8bfd8',
	  'tomato': '#ff6347',
	  'turquoise': '#40e0d0',
	  'violet': '#ee82ee',
	  'wheat': '#f5deb3',
	  'white': '#ffffff',
	  'whitesmoke': '#f5f5f5',
	  'yellow': '#ffff00',
	  'yellowgreen': '#9acd32',
	
	  'Gradients': {
	    'voltage_default': ["#FF0000", "#F40000", "#EA0000", "#E00000", "#D60000", "#CC0000", "#C10000", "#B70000", "#AD0000", "#A30000", "#990000", "#8E0000", "#840000", "#7A0000", "#700000", "#660000", "#5B0000", "#510000", "#470000", "#3D0000", "#320000", "#280000", "#1E0000", "#140000", "#0A0000", "#000000", "#000700", "#000F00", "#001700", "#001F00", "#002700", "#002F00", "#003600", "#003E00", "#004600", "#004E00", "#005600", "#005E00", "#006500", "#006D00", "#007500", "#007D00", "#008500", "#008D00", "#009400", "#009C00", "#00A400", "#00AC00", "#00B400", "#00BC00", "#00C400"],
	    'power_default': ["#00FFFF", "#00F4F4", "#00EAEA", "#00E0E0", "#00D6D6", "#00CCCC", "#00C1C1", "#00B7B7", "#00ADAD", "#00A3A3", "#009999", "#008E8E", "#008484", "#007A7A", "#007070", "#006666", "#005B5B", "#005151", "#004747", "#003D3D", "#003232", "#002828", "#001E1E", "#001414", "#000A0A", "#000000", "#0A000A", "#140014", "#1E001E", "#280028", "#330033", "#3D003D", "#470047", "#510051", "#5B005B", "#660066", "#700070", "#7A007A", "#840084", "#8E008E", "#990099", "#A300A3", "#AD00AD", "#B700B7", "#C100C1", "#CC00CC", "#D600D6", "#E000E0", "#EA00EA", "#F400F4", "#FF00FF"]
	  }
	};
	
	
	module.exports = Color;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	(function(window) {
	    var re = {
	        not_string: /[^s]/,
	        number: /[diefg]/,
	        json: /[j]/,
	        not_json: /[^j]/,
	        text: /^[^\x25]+/,
	        modulo: /^\x25{2}/,
	        placeholder: /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijosuxX])/,
	        key: /^([a-z_][a-z_\d]*)/i,
	        key_access: /^\.([a-z_][a-z_\d]*)/i,
	        index_access: /^\[(\d+)\]/,
	        sign: /^[\+\-]/
	    }
	
	    function sprintf() {
	        var key = arguments[0], cache = sprintf.cache
	        if (!(cache[key] && cache.hasOwnProperty(key))) {
	            cache[key] = sprintf.parse(key)
	        }
	        return sprintf.format.call(null, cache[key], arguments)
	    }
	
	    sprintf.format = function(parse_tree, argv) {
	        var cursor = 1, tree_length = parse_tree.length, node_type = "", arg, output = [], i, k, match, pad, pad_character, pad_length, is_positive = true, sign = ""
	        for (i = 0; i < tree_length; i++) {
	            node_type = get_type(parse_tree[i])
	            if (node_type === "string") {
	                output[output.length] = parse_tree[i]
	            }
	            else if (node_type === "array") {
	                match = parse_tree[i] // convenience purposes only
	                if (match[2]) { // keyword argument
	                    arg = argv[cursor]
	                    for (k = 0; k < match[2].length; k++) {
	                        if (!arg.hasOwnProperty(match[2][k])) {
	                            throw new Error(sprintf("[sprintf] property '%s' does not exist", match[2][k]))
	                        }
	                        arg = arg[match[2][k]]
	                    }
	                }
	                else if (match[1]) { // positional argument (explicit)
	                    arg = argv[match[1]]
	                }
	                else { // positional argument (implicit)
	                    arg = argv[cursor++]
	                }
	
	                if (get_type(arg) == "function") {
	                    arg = arg()
	                }
	
	                if (re.not_string.test(match[8]) && re.not_json.test(match[8]) && (get_type(arg) != "number" && isNaN(arg))) {
	                    throw new TypeError(sprintf("[sprintf] expecting number but found %s", get_type(arg)))
	                }
	
	                if (re.number.test(match[8])) {
	                    is_positive = arg >= 0
	                }
	
	                switch (match[8]) {
	                    case "b":
	                        arg = arg.toString(2)
	                    break
	                    case "c":
	                        arg = String.fromCharCode(arg)
	                    break
	                    case "d":
	                    case "i":
	                        arg = parseInt(arg, 10)
	                    break
	                    case "j":
	                        arg = JSON.stringify(arg, null, match[6] ? parseInt(match[6]) : 0)
	                    break
	                    case "e":
	                        arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential()
	                    break
	                    case "f":
	                        arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg)
	                    break
	                    case "g":
	                        arg = match[7] ? parseFloat(arg).toPrecision(match[7]) : parseFloat(arg)
	                    break
	                    case "o":
	                        arg = arg.toString(8)
	                    break
	                    case "s":
	                        arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg)
	                    break
	                    case "u":
	                        arg = arg >>> 0
	                    break
	                    case "x":
	                        arg = arg.toString(16)
	                    break
	                    case "X":
	                        arg = arg.toString(16).toUpperCase()
	                    break
	                }
	                if (re.json.test(match[8])) {
	                    output[output.length] = arg
	                }
	                else {
	                    if (re.number.test(match[8]) && (!is_positive || match[3])) {
	                        sign = is_positive ? "+" : "-"
	                        arg = arg.toString().replace(re.sign, "")
	                    }
	                    else {
	                        sign = ""
	                    }
	                    pad_character = match[4] ? match[4] === "0" ? "0" : match[4].charAt(1) : " "
	                    pad_length = match[6] - (sign + arg).length
	                    pad = match[6] ? (pad_length > 0 ? str_repeat(pad_character, pad_length) : "") : ""
	                    output[output.length] = match[5] ? sign + arg + pad : (pad_character === "0" ? sign + pad + arg : pad + sign + arg)
	                }
	            }
	        }
	        return output.join("")
	    }
	
	    sprintf.cache = {}
	
	    sprintf.parse = function(fmt) {
	        var _fmt = fmt, match = [], parse_tree = [], arg_names = 0
	        while (_fmt) {
	            if ((match = re.text.exec(_fmt)) !== null) {
	                parse_tree[parse_tree.length] = match[0]
	            }
	            else if ((match = re.modulo.exec(_fmt)) !== null) {
	                parse_tree[parse_tree.length] = "%"
	            }
	            else if ((match = re.placeholder.exec(_fmt)) !== null) {
	                if (match[2]) {
	                    arg_names |= 1
	                    var field_list = [], replacement_field = match[2], field_match = []
	                    if ((field_match = re.key.exec(replacement_field)) !== null) {
	                        field_list[field_list.length] = field_match[1]
	                        while ((replacement_field = replacement_field.substring(field_match[0].length)) !== "") {
	                            if ((field_match = re.key_access.exec(replacement_field)) !== null) {
	                                field_list[field_list.length] = field_match[1]
	                            }
	                            else if ((field_match = re.index_access.exec(replacement_field)) !== null) {
	                                field_list[field_list.length] = field_match[1]
	                            }
	                            else {
	                                throw new SyntaxError("[sprintf] failed to parse named argument key")
	                            }
	                        }
	                    }
	                    else {
	                        throw new SyntaxError("[sprintf] failed to parse named argument key")
	                    }
	                    match[2] = field_list
	                }
	                else {
	                    arg_names |= 2
	                }
	                if (arg_names === 3) {
	                    throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported")
	                }
	                parse_tree[parse_tree.length] = match
	            }
	            else {
	                throw new SyntaxError("[sprintf] unexpected placeholder")
	            }
	            _fmt = _fmt.substring(match[0].length)
	        }
	        return parse_tree
	    }
	
	    var vsprintf = function(fmt, argv, _argv) {
	        _argv = (argv || []).slice(0)
	        _argv.splice(0, 0, fmt)
	        return sprintf.apply(null, _argv)
	    }
	
	    /**
	     * helpers
	     */
	    function get_type(variable) {
	        return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase()
	    }
	
	    function str_repeat(input, multiplier) {
	        return Array(multiplier + 1).join(input)
	    }
	
	    /**
	     * export to either browser or node.js
	     */
	    if (true) {
	        exports.sprintf = sprintf
	        exports.vsprintf = vsprintf
	    }
	    else {
	        window.sprintf = sprintf
	        window.vsprintf = vsprintf
	
	        if (typeof define === "function" && define.amd) {
	            define(function() {
	                return {
	                    sprintf: sprintf,
	                    vsprintf: vsprintf
	                }
	            })
	        }
	    }
	})(typeof window === "undefined" ? this : window);


/***/ },
/* 10 */
/***/ function(module, exports) {

	exports.isBrowser = typeof window !== 'undefined';


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */
	
	exports = module.exports = __webpack_require__(12);
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = 'undefined' != typeof chrome
	               && 'undefined' != typeof chrome.storage
	                  ? chrome.storage.local
	                  : localstorage();
	
	/**
	 * Colors.
	 */
	
	exports.colors = [
	  'lightseagreen',
	  'forestgreen',
	  'goldenrod',
	  'dodgerblue',
	  'darkorchid',
	  'crimson'
	];
	
	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */
	
	function useColors() {
	  // NB: In an Electron preload script, document will be defined but not fully
	  // initialized. Since we know we're in Chrome, we'll just detect this case
	  // explicitly
	  if (typeof window !== 'undefined' && window && typeof window.process !== 'undefined' && window.process.type === 'renderer') {
	    return true;
	  }
	
	  // is webkit? http://stackoverflow.com/a/16459606/376773
	  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	  return (typeof document !== 'undefined' && document && 'WebkitAppearance' in document.documentElement.style) ||
	    // is firebug? http://stackoverflow.com/a/398120/376773
	    (typeof window !== 'undefined' && window && window.console && (console.firebug || (console.exception && console.table))) ||
	    // is firefox >= v31?
	    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	    (typeof navigator !== 'undefined' && navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
	    // double check webkit in userAgent just in case we are in a worker
	    (typeof navigator !== 'undefined' && navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
	}
	
	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */
	
	exports.formatters.j = function(v) {
	  try {
	    return JSON.stringify(v);
	  } catch (err) {
	    return '[UnexpectedJSONParseError]: ' + err.message;
	  }
	};
	
	
	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */
	
	function formatArgs(args) {
	  var useColors = this.useColors;
	
	  args[0] = (useColors ? '%c' : '')
	    + this.namespace
	    + (useColors ? ' %c' : ' ')
	    + args[0]
	    + (useColors ? '%c ' : ' ')
	    + '+' + exports.humanize(this.diff);
	
	  if (!useColors) return;
	
	  var c = 'color: ' + this.color;
	  args.splice(1, 0, c, 'color: inherit')
	
	  // the final "%c" is somewhat tricky, because there could be other
	  // arguments passed either before or after the %c, so we need to
	  // figure out the correct index to insert the CSS into
	  var index = 0;
	  var lastC = 0;
	  args[0].replace(/%[a-zA-Z%]/g, function(match) {
	    if ('%%' === match) return;
	    index++;
	    if ('%c' === match) {
	      // we only are interested in the *last* %c
	      // (the user may have provided their own)
	      lastC = index;
	    }
	  });
	
	  args.splice(lastC, 0, c);
	}
	
	/**
	 * Invokes `console.log()` when available.
	 * No-op when `console.log` is not a "function".
	 *
	 * @api public
	 */
	
	function log() {
	  // this hackery is required for IE8/9, where
	  // the `console.log` function doesn't have 'apply'
	  return 'object' === typeof console
	    && console.log
	    && Function.prototype.apply.call(console.log, console, arguments);
	}
	
	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */
	
	function save(namespaces) {
	  try {
	    if (null == namespaces) {
	      exports.storage.removeItem('debug');
	    } else {
	      exports.storage.debug = namespaces;
	    }
	  } catch(e) {}
	}
	
	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */
	
	function load() {
	  try {
	    return exports.storage.debug;
	  } catch(e) {}
	
	  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	  if (typeof process !== 'undefined' && 'env' in process) {
	    return process.env.DEBUG;
	  }
	}
	
	/**
	 * Enable namespaces listed in `localStorage.debug` initially.
	 */
	
	exports.enable(load());
	
	/**
	 * Localstorage attempts to return the localstorage.
	 *
	 * This is necessary because safari throws
	 * when a user disables cookies/localstorage
	 * and you attempt to access it.
	 *
	 * @return {LocalStorage}
	 * @api private
	 */
	
	function localstorage() {
	  try {
	    return window.localStorage;
	  } catch (e) {}
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */
	
	exports = module.exports = createDebug.debug = createDebug.default = createDebug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = __webpack_require__(13);
	
	/**
	 * The currently active debug mode names, and names to skip.
	 */
	
	exports.names = [];
	exports.skips = [];
	
	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	 */
	
	exports.formatters = {};
	
	/**
	 * Previous log timestamp.
	 */
	
	var prevTime;
	
	/**
	 * Select a color.
	 * @param {String} namespace
	 * @return {Number}
	 * @api private
	 */
	
	function selectColor(namespace) {
	  var hash = 0, i;
	
	  for (i in namespace) {
	    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
	    hash |= 0; // Convert to 32bit integer
	  }
	
	  return exports.colors[Math.abs(hash) % exports.colors.length];
	}
	
	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */
	
	function createDebug(namespace) {
	
	  function debug() {
	    // disabled?
	    if (!debug.enabled) return;
	
	    var self = debug;
	
	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;
	
	    // turn the `arguments` into a proper Array
	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }
	
	    args[0] = exports.coerce(args[0]);
	
	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %O
	      args.unshift('%O');
	    }
	
	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);
	
	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });
	
	    // apply env-specific formatting (colors, etc.)
	    exports.formatArgs.call(self, args);
	
	    var logFn = debug.log || exports.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }
	
	  debug.namespace = namespace;
	  debug.enabled = exports.enabled(namespace);
	  debug.useColors = exports.useColors();
	  debug.color = selectColor(namespace);
	
	  // env-specific initialization logic for debug instances
	  if ('function' === typeof exports.init) {
	    exports.init(debug);
	  }
	
	  return debug;
	}
	
	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */
	
	function enable(namespaces) {
	  exports.save(namespaces);
	
	  var split = (namespaces || '').split(/[\s,]+/);
	  var len = split.length;
	
	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}
	
	/**
	 * Disable debug output.
	 *
	 * @api public
	 */
	
	function disable() {
	  exports.enable('');
	}
	
	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */
	
	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}
	
	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */
	
	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}


/***/ },
/* 13 */
/***/ function(module, exports) {

	/**
	 * Helpers.
	 */
	
	var s = 1000
	var m = s * 60
	var h = m * 60
	var d = h * 24
	var y = d * 365.25
	
	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} options
	 * @throws {Error} throw an error if val is not a non-empty string or a number
	 * @return {String|Number}
	 * @api public
	 */
	
	module.exports = function (val, options) {
	  options = options || {}
	  var type = typeof val
	  if (type === 'string' && val.length > 0) {
	    return parse(val)
	  } else if (type === 'number' && isNaN(val) === false) {
	    return options.long ?
				fmtLong(val) :
				fmtShort(val)
	  }
	  throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val))
	}
	
	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */
	
	function parse(str) {
	  str = String(str)
	  if (str.length > 10000) {
	    return
	  }
	  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str)
	  if (!match) {
	    return
	  }
	  var n = parseFloat(match[1])
	  var type = (match[2] || 'ms').toLowerCase()
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n
	    default:
	      return undefined
	  }
	}
	
	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */
	
	function fmtShort(ms) {
	  if (ms >= d) {
	    return Math.round(ms / d) + 'd'
	  }
	  if (ms >= h) {
	    return Math.round(ms / h) + 'h'
	  }
	  if (ms >= m) {
	    return Math.round(ms / m) + 'm'
	  }
	  if (ms >= s) {
	    return Math.round(ms / s) + 's'
	  }
	  return ms + 'ms'
	}
	
	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */
	
	function fmtLong(ms) {
	  return plural(ms, d, 'day') ||
	    plural(ms, h, 'hour') ||
	    plural(ms, m, 'minute') ||
	    plural(ms, s, 'second') ||
	    ms + ' ms'
	}
	
	/**
	 * Pluralization helper.
	 */
	
	function plural(ms, n, name) {
	  if (ms < n) {
	    return
	  }
	  if (ms < n * 1.5) {
	    return Math.floor(ms / n) + ' ' + name
	  }
	  return Math.ceil(ms / n) + ' ' + name + 's'
	}


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/**
	 * @license
	 * lodash 4.1.0 (Custom Build) <https://lodash.com/>
	 * Build: `lodash -d -o ./foo/lodash.js`
	 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	;(function() {
	
	  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
	  var undefined;
	
	  /** Used as the semantic version number. */
	  var VERSION = '4.1.0';
	
	  /** Used to compose bitmasks for wrapper metadata. */
	  var BIND_FLAG = 1,
	      BIND_KEY_FLAG = 2,
	      CURRY_BOUND_FLAG = 4,
	      CURRY_FLAG = 8,
	      CURRY_RIGHT_FLAG = 16,
	      PARTIAL_FLAG = 32,
	      PARTIAL_RIGHT_FLAG = 64,
	      ARY_FLAG = 128,
	      REARG_FLAG = 256,
	      FLIP_FLAG = 512;
	
	  /** Used to compose bitmasks for comparison styles. */
	  var UNORDERED_COMPARE_FLAG = 1,
	      PARTIAL_COMPARE_FLAG = 2;
	
	  /** Used as default options for `_.truncate`. */
	  var DEFAULT_TRUNC_LENGTH = 30,
	      DEFAULT_TRUNC_OMISSION = '...';
	
	  /** Used to detect hot functions by number of calls within a span of milliseconds. */
	  var HOT_COUNT = 150,
	      HOT_SPAN = 16;
	
	  /** Used as the size to enable large array optimizations. */
	  var LARGE_ARRAY_SIZE = 200;
	
	  /** Used to indicate the type of lazy iteratees. */
	  var LAZY_FILTER_FLAG = 1,
	      LAZY_MAP_FLAG = 2,
	      LAZY_WHILE_FLAG = 3;
	
	  /** Used as the `TypeError` message for "Functions" methods. */
	  var FUNC_ERROR_TEXT = 'Expected a function';
	
	  /** Used to stand-in for `undefined` hash values. */
	  var HASH_UNDEFINED = '__lodash_hash_undefined__';
	
	  /** Used as references for various `Number` constants. */
	  var INFINITY = 1 / 0,
	      MAX_SAFE_INTEGER = 9007199254740991,
	      MAX_INTEGER = 1.7976931348623157e+308,
	      NAN = 0 / 0;
	
	  /** Used as references for the maximum length and index of an array. */
	  var MAX_ARRAY_LENGTH = 4294967295,
	      MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
	      HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;
	
	  /** Used as the internal argument placeholder. */
	  var PLACEHOLDER = '__lodash_placeholder__';
	
	  /** `Object#toString` result references. */
	  var argsTag = '[object Arguments]',
	      arrayTag = '[object Array]',
	      boolTag = '[object Boolean]',
	      dateTag = '[object Date]',
	      errorTag = '[object Error]',
	      funcTag = '[object Function]',
	      genTag = '[object GeneratorFunction]',
	      mapTag = '[object Map]',
	      numberTag = '[object Number]',
	      objectTag = '[object Object]',
	      regexpTag = '[object RegExp]',
	      setTag = '[object Set]',
	      stringTag = '[object String]',
	      symbolTag = '[object Symbol]',
	      weakMapTag = '[object WeakMap]';
	
	  var arrayBufferTag = '[object ArrayBuffer]',
	      float32Tag = '[object Float32Array]',
	      float64Tag = '[object Float64Array]',
	      int8Tag = '[object Int8Array]',
	      int16Tag = '[object Int16Array]',
	      int32Tag = '[object Int32Array]',
	      uint8Tag = '[object Uint8Array]',
	      uint8ClampedTag = '[object Uint8ClampedArray]',
	      uint16Tag = '[object Uint16Array]',
	      uint32Tag = '[object Uint32Array]';
	
	  /** Used to match empty string literals in compiled template source. */
	  var reEmptyStringLeading = /\b__p \+= '';/g,
	      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
	      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
	
	  /** Used to match HTML entities and HTML characters. */
	  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39|#96);/g,
	      reUnescapedHtml = /[&<>"'`]/g,
	      reHasEscapedHtml = RegExp(reEscapedHtml.source),
	      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
	
	  /** Used to match template delimiters. */
	  var reEscape = /<%-([\s\S]+?)%>/g,
	      reEvaluate = /<%([\s\S]+?)%>/g,
	      reInterpolate = /<%=([\s\S]+?)%>/g;
	
	  /** Used to match property names within property paths. */
	  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
	      reIsPlainProp = /^\w*$/,
	      rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]/g;
	
	  /** Used to match `RegExp` [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns). */
	  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
	      reHasRegExpChar = RegExp(reRegExpChar.source);
	
	  /** Used to match leading and trailing whitespace. */
	  var reTrim = /^\s+|\s+$/g,
	      reTrimStart = /^\s+/,
	      reTrimEnd = /\s+$/;
	
	  /** Used to match backslashes in property paths. */
	  var reEscapeChar = /\\(\\)?/g;
	
	  /** Used to match [ES template delimiters](http://ecma-international.org/ecma-262/6.0/#sec-template-literal-lexical-components). */
	  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
	
	  /** Used to match `RegExp` flags from their coerced string values. */
	  var reFlags = /\w*$/;
	
	  /** Used to detect hexadecimal string values. */
	  var reHasHexPrefix = /^0x/i;
	
	  /** Used to detect bad signed hexadecimal string values. */
	  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
	
	  /** Used to detect binary string values. */
	  var reIsBinary = /^0b[01]+$/i;
	
	  /** Used to detect host constructors (Safari > 5). */
	  var reIsHostCtor = /^\[object .+?Constructor\]$/;
	
	  /** Used to detect octal string values. */
	  var reIsOctal = /^0o[0-7]+$/i;
	
	  /** Used to detect unsigned integer values. */
	  var reIsUint = /^(?:0|[1-9]\d*)$/;
	
	  /** Used to match latin-1 supplementary letters (excluding mathematical operators). */
	  var reLatin1 = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g;
	
	  /** Used to ensure capturing order of template delimiters. */
	  var reNoMatch = /($^)/;
	
	  /** Used to match unescaped characters in compiled string literals. */
	  var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
	
	  /** Used to compose unicode character classes. */
	  var rsAstralRange = '\\ud800-\\udfff',
	      rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23',
	      rsComboSymbolsRange = '\\u20d0-\\u20f0',
	      rsDingbatRange = '\\u2700-\\u27bf',
	      rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
	      rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
	      rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
	      rsQuoteRange = '\\u2018\\u2019\\u201c\\u201d',
	      rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
	      rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
	      rsVarRange = '\\ufe0e\\ufe0f',
	      rsBreakRange = rsMathOpRange + rsNonCharRange + rsQuoteRange + rsSpaceRange;
	
	  /** Used to compose unicode capture groups. */
	  var rsAstral = '[' + rsAstralRange + ']',
	      rsBreak = '[' + rsBreakRange + ']',
	      rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']',
	      rsDigits = '\\d+',
	      rsDingbat = '[' + rsDingbatRange + ']',
	      rsLower = '[' + rsLowerRange + ']',
	      rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
	      rsFitz = '\\ud83c[\\udffb-\\udfff]',
	      rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
	      rsNonAstral = '[^' + rsAstralRange + ']',
	      rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
	      rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
	      rsUpper = '[' + rsUpperRange + ']',
	      rsZWJ = '\\u200d';
	
	  /** Used to compose unicode regexes. */
	  var rsLowerMisc = '(?:' + rsLower + '|' + rsMisc + ')',
	      rsUpperMisc = '(?:' + rsUpper + '|' + rsMisc + ')',
	      reOptMod = rsModifier + '?',
	      rsOptVar = '[' + rsVarRange + ']?',
	      rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
	      rsSeq = rsOptVar + reOptMod + rsOptJoin,
	      rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq,
	      rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';
	
	  /**
	   * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
	   * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
	   */
	  var reComboMark = RegExp(rsCombo, 'g');
	
	  /** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
	  var reComplexSymbol = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');
	
	  /** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
	  var reHasComplexSymbol = RegExp('[' + rsZWJ + rsAstralRange  + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + ']');
	
	  /** Used to match non-compound words composed of alphanumeric characters. */
	  var reBasicWord = /[a-zA-Z0-9]+/g;
	
	  /** Used to match complex or compound words. */
	  var reComplexWord = RegExp([
	    rsUpper + '?' + rsLower + '+(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
	    rsUpperMisc + '+(?=' + [rsBreak, rsUpper + rsLowerMisc, '$'].join('|') + ')',
	    rsUpper + '?' + rsLowerMisc + '+',
	    rsUpper + '+',
	    rsDigits,
	    rsEmoji
	  ].join('|'), 'g');
	
	  /** Used to detect strings that need a more robust regexp to match words. */
	  var reHasComplexWord = /[a-z][A-Z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
	
	  /** Used to assign default `context` object properties. */
	  var contextProps = [
	    'Array', 'Date', 'Error', 'Float32Array', 'Float64Array', 'Function',
	    'Int8Array', 'Int16Array', 'Int32Array', 'Map', 'Math', 'Object',
	    'Reflect', 'RegExp', 'Set', 'String', 'Symbol', 'TypeError', 'Uint8Array',
	    'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap', '_',
	    'clearTimeout', 'isFinite', 'parseInt', 'setTimeout'
	  ];
	
	  /** Used to make template sourceURLs easier to identify. */
	  var templateCounter = -1;
	
	  /** Used to identify `toStringTag` values of typed arrays. */
	  var typedArrayTags = {};
	  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	  typedArrayTags[uint32Tag] = true;
	  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
	  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	  typedArrayTags[dateTag] = typedArrayTags[errorTag] =
	  typedArrayTags[funcTag] = typedArrayTags[mapTag] =
	  typedArrayTags[numberTag] = typedArrayTags[objectTag] =
	  typedArrayTags[regexpTag] = typedArrayTags[setTag] =
	  typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
	
	  /** Used to identify `toStringTag` values supported by `_.clone`. */
	  var cloneableTags = {};
	  cloneableTags[argsTag] = cloneableTags[arrayTag] =
	  cloneableTags[arrayBufferTag] = cloneableTags[boolTag] =
	  cloneableTags[dateTag] = cloneableTags[float32Tag] =
	  cloneableTags[float64Tag] = cloneableTags[int8Tag] =
	  cloneableTags[int16Tag] = cloneableTags[int32Tag] =
	  cloneableTags[mapTag] = cloneableTags[numberTag] =
	  cloneableTags[objectTag] = cloneableTags[regexpTag] =
	  cloneableTags[setTag] = cloneableTags[stringTag] =
	  cloneableTags[symbolTag] = cloneableTags[uint8Tag] =
	  cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] =
	  cloneableTags[uint32Tag] = true;
	  cloneableTags[errorTag] = cloneableTags[funcTag] =
	  cloneableTags[weakMapTag] = false;
	
	  /** Used to map latin-1 supplementary letters to basic latin letters. */
	  var deburredLetters = {
	    '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
	    '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
	    '\xc7': 'C',  '\xe7': 'c',
	    '\xd0': 'D',  '\xf0': 'd',
	    '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
	    '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
	    '\xcC': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
	    '\xeC': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
	    '\xd1': 'N',  '\xf1': 'n',
	    '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
	    '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
	    '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
	    '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
	    '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
	    '\xc6': 'Ae', '\xe6': 'ae',
	    '\xde': 'Th', '\xfe': 'th',
	    '\xdf': 'ss'
	  };
	
	  /** Used to map characters to HTML entities. */
	  var htmlEscapes = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#39;',
	    '`': '&#96;'
	  };
	
	  /** Used to map HTML entities to characters. */
	  var htmlUnescapes = {
	    '&amp;': '&',
	    '&lt;': '<',
	    '&gt;': '>',
	    '&quot;': '"',
	    '&#39;': "'",
	    '&#96;': '`'
	  };
	
	  /** Used to determine if values are of the language type `Object`. */
	  var objectTypes = {
	    'function': true,
	    'object': true
	  };
	
	  /** Used to escape characters for inclusion in compiled string literals. */
	  var stringEscapes = {
	    '\\': '\\',
	    "'": "'",
	    '\n': 'n',
	    '\r': 'r',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	  };
	
	  /** Built-in method references without a dependency on `root`. */
	  var freeParseFloat = parseFloat,
	      freeParseInt = parseInt;
	
	  /** Detect free variable `exports`. */
	  var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType) ? exports : null;
	
	  /** Detect free variable `module`. */
	  var freeModule = (objectTypes[typeof module] && module && !module.nodeType) ? module : null;
	
	  /** Detect free variable `global` from Node.js. */
	  var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global);
	
	  /** Detect free variable `self`. */
	  var freeSelf = checkGlobal(objectTypes[typeof self] && self);
	
	  /** Detect free variable `window`. */
	  var freeWindow = checkGlobal(objectTypes[typeof window] && window);
	
	  /** Detect the popular CommonJS extension `module.exports`. */
	  var moduleExports = (freeModule && freeModule.exports === freeExports) ? freeExports : null;
	
	  /** Detect `this` as the global object. */
	  var thisGlobal = checkGlobal(objectTypes[typeof this] && this);
	
	  /**
	   * Used as a reference to the global object.
	   *
	   * The `this` value is used if it's the global object to avoid Greasemonkey's
	   * restricted `window` object, otherwise the `window` object is used.
	   */
	  var root = freeGlobal || ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) || freeSelf || thisGlobal || Function('return this')();
	
	  /*--------------------------------------------------------------------------*/
	
	  /**
	   * Adds the key-value `pair` to `map`.
	   *
	   * @private
	   * @param {Object} map The map to modify.
	   * @param {Array} pair The key-value pair to add.
	   * @returns {Object} Returns `map`.
	   */
	  function addMapEntry(map, pair) {
	    map.set(pair[0], pair[1]);
	    return map;
	  }
	
	  /**
	   * Adds `value` to `set`.
	   *
	   * @private
	   * @param {Object} set The set to modify.
	   * @param {*} value The value to add.
	   * @returns {Object} Returns `set`.
	   */
	  function addSetEntry(set, value) {
	    set.add(value);
	    return set;
	  }
	
	  /**
	   * A faster alternative to `Function#apply`, this function invokes `func`
	   * with the `this` binding of `thisArg` and the arguments of `args`.
	   *
	   * @private
	   * @param {Function} func The function to invoke.
	   * @param {*} thisArg The `this` binding of `func`.
	   * @param {...*} [args] The arguments to invoke `func` with.
	   * @returns {*} Returns the result of `func`.
	   */
	  function apply(func, thisArg, args) {
	    var length = args ? args.length : 0;
	    switch (length) {
	      case 0: return func.call(thisArg);
	      case 1: return func.call(thisArg, args[0]);
	      case 2: return func.call(thisArg, args[0], args[1]);
	      case 3: return func.call(thisArg, args[0], args[1], args[2]);
	    }
	    return func.apply(thisArg, args);
	  }
	
	  /**
	   * A specialized version of `baseAggregator` for arrays.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} setter The function to set `accumulator` values.
	   * @param {Function} iteratee The iteratee to transform keys.
	   * @param {Object} accumulator The initial aggregated object.
	   * @returns {Function} Returns `accumulator`.
	   */
	  function arrayAggregator(array, setter, iteratee, accumulator) {
	    var index = -1,
	        length = array.length;
	
	    while (++index < length) {
	      var value = array[index];
	      setter(accumulator, value, iteratee(value), array);
	    }
	    return accumulator;
	  }
	
	  /**
	   * Creates a new array concatenating `array` with `other`.
	   *
	   * @private
	   * @param {Array} array The first array to concatenate.
	   * @param {Array} other The second array to concatenate.
	   * @returns {Array} Returns the new concatenated array.
	   */
	  function arrayConcat(array, other) {
	    var index = -1,
	        length = array.length,
	        othIndex = -1,
	        othLength = other.length,
	        result = Array(length + othLength);
	
	    while (++index < length) {
	      result[index] = array[index];
	    }
	    while (++othIndex < othLength) {
	      result[index++] = other[othIndex];
	    }
	    return result;
	  }
	
	  /**
	   * A specialized version of `_.forEach` for arrays without support for
	   * iteratee shorthands.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @returns {Array} Returns `array`.
	   */
	  function arrayEach(array, iteratee) {
	    var index = -1,
	        length = array.length;
	
	    while (++index < length) {
	      if (iteratee(array[index], index, array) === false) {
	        break;
	      }
	    }
	    return array;
	  }
	
	  /**
	   * A specialized version of `_.forEachRight` for arrays without support for
	   * iteratee shorthands.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @returns {Array} Returns `array`.
	   */
	  function arrayEachRight(array, iteratee) {
	    var length = array.length;
	
	    while (length--) {
	      if (iteratee(array[length], length, array) === false) {
	        break;
	      }
	    }
	    return array;
	  }
	
	  /**
	   * A specialized version of `_.every` for arrays without support for
	   * iteratee shorthands.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} predicate The function invoked per iteration.
	   * @returns {boolean} Returns `true` if all elements pass the predicate check, else `false`.
	   */
	  function arrayEvery(array, predicate) {
	    var index = -1,
	        length = array.length;
	
	    while (++index < length) {
	      if (!predicate(array[index], index, array)) {
	        return false;
	      }
	    }
	    return true;
	  }
	
	  /**
	   * A specialized version of `_.filter` for arrays without support for
	   * iteratee shorthands.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} predicate The function invoked per iteration.
	   * @returns {Array} Returns the new filtered array.
	   */
	  function arrayFilter(array, predicate) {
	    var index = -1,
	        length = array.length,
	        resIndex = -1,
	        result = [];
	
	    while (++index < length) {
	      var value = array[index];
	      if (predicate(value, index, array)) {
	        result[++resIndex] = value;
	      }
	    }
	    return result;
	  }
	
	  /**
	   * A specialized version of `_.includes` for arrays without support for
	   * specifying an index to search from.
	   *
	   * @private
	   * @param {Array} array The array to search.
	   * @param {*} target The value to search for.
	   * @returns {boolean} Returns `true` if `target` is found, else `false`.
	   */
	  function arrayIncludes(array, value) {
	    return !!array.length && baseIndexOf(array, value, 0) > -1;
	  }
	
	  /**
	   * A specialized version of `_.includesWith` for arrays without support for
	   * specifying an index to search from.
	   *
	   * @private
	   * @param {Array} array The array to search.
	   * @param {*} target The value to search for.
	   * @param {Function} comparator The comparator invoked per element.
	   * @returns {boolean} Returns `true` if `target` is found, else `false`.
	   */
	  function arrayIncludesWith(array, value, comparator) {
	    var index = -1,
	        length = array.length;
	
	    while (++index < length) {
	      if (comparator(value, array[index])) {
	        return true;
	      }
	    }
	    return false;
	  }
	
	  /**
	   * A specialized version of `_.map` for arrays without support for iteratee
	   * shorthands.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @returns {Array} Returns the new mapped array.
	   */
	  function arrayMap(array, iteratee) {
	    var index = -1,
	        length = array.length,
	        result = Array(length);
	
	    while (++index < length) {
	      result[index] = iteratee(array[index], index, array);
	    }
	    return result;
	  }
	
	  /**
	   * Appends the elements of `values` to `array`.
	   *
	   * @private
	   * @param {Array} array The array to modify.
	   * @param {Array} values The values to append.
	   * @returns {Array} Returns `array`.
	   */
	  function arrayPush(array, values) {
	    var index = -1,
	        length = values.length,
	        offset = array.length;
	
	    while (++index < length) {
	      array[offset + index] = values[index];
	    }
	    return array;
	  }
	
	  /**
	   * A specialized version of `_.reduce` for arrays without support for
	   * iteratee shorthands.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @param {*} [accumulator] The initial value.
	   * @param {boolean} [initAccum] Specify using the first element of `array` as the initial value.
	   * @returns {*} Returns the accumulated value.
	   */
	  function arrayReduce(array, iteratee, accumulator, initAccum) {
	    var index = -1,
	        length = array.length;
	
	    if (initAccum && length) {
	      accumulator = array[++index];
	    }
	    while (++index < length) {
	      accumulator = iteratee(accumulator, array[index], index, array);
	    }
	    return accumulator;
	  }
	
	  /**
	   * A specialized version of `_.reduceRight` for arrays without support for
	   * iteratee shorthands.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @param {*} [accumulator] The initial value.
	   * @param {boolean} [initAccum] Specify using the last element of `array` as the initial value.
	   * @returns {*} Returns the accumulated value.
	   */
	  function arrayReduceRight(array, iteratee, accumulator, initAccum) {
	    var length = array.length;
	    if (initAccum && length) {
	      accumulator = array[--length];
	    }
	    while (length--) {
	      accumulator = iteratee(accumulator, array[length], length, array);
	    }
	    return accumulator;
	  }
	
	  /**
	   * A specialized version of `_.some` for arrays without support for iteratee
	   * shorthands.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} predicate The function invoked per iteration.
	   * @returns {boolean} Returns `true` if any element passes the predicate check, else `false`.
	   */
	  function arraySome(array, predicate) {
	    var index = -1,
	        length = array.length;
	
	    while (++index < length) {
	      if (predicate(array[index], index, array)) {
	        return true;
	      }
	    }
	    return false;
	  }
	
	  /**
	   * The base implementation of methods like `_.max` and `_.min` which accepts a
	   * `comparator` to determine the extremum value.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} iteratee The iteratee invoked per iteration.
	   * @param {Function} comparator The comparator used to compare values.
	   * @returns {*} Returns the extremum value.
	   */
	  function baseExtremum(array, iteratee, comparator) {
	    var index = -1,
	        length = array.length;
	
	    while (++index < length) {
	      var value = array[index],
	          current = iteratee(value);
	
	      if (current != null && (computed === undefined
	            ? current === current
	            : comparator(current, computed)
	          )) {
	        var computed = current,
	            result = value;
	      }
	    }
	    return result;
	  }
	
	  /**
	   * The base implementation of methods like `_.find` and `_.findKey`, without
	   * support for iteratee shorthands, which iterates over `collection` using
	   * `eachFunc`.
	   *
	   * @private
	   * @param {Array|Object} collection The collection to search.
	   * @param {Function} predicate The function invoked per iteration.
	   * @param {Function} eachFunc The function to iterate over `collection`.
	   * @param {boolean} [retKey] Specify returning the key of the found element instead of the element itself.
	   * @returns {*} Returns the found element or its key, else `undefined`.
	   */
	  function baseFind(collection, predicate, eachFunc, retKey) {
	    var result;
	    eachFunc(collection, function(value, key, collection) {
	      if (predicate(value, key, collection)) {
	        result = retKey ? key : value;
	        return false;
	      }
	    });
	    return result;
	  }
	
	  /**
	   * The base implementation of `_.findIndex` and `_.findLastIndex` without
	   * support for iteratee shorthands.
	   *
	   * @private
	   * @param {Array} array The array to search.
	   * @param {Function} predicate The function invoked per iteration.
	   * @param {boolean} [fromRight] Specify iterating from right to left.
	   * @returns {number} Returns the index of the matched value, else `-1`.
	   */
	  function baseFindIndex(array, predicate, fromRight) {
	    var length = array.length,
	        index = fromRight ? length : -1;
	
	    while ((fromRight ? index-- : ++index < length)) {
	      if (predicate(array[index], index, array)) {
	        return index;
	      }
	    }
	    return -1;
	  }
	
	  /**
	   * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
	   *
	   * @private
	   * @param {Array} array The array to search.
	   * @param {*} value The value to search for.
	   * @param {number} fromIndex The index to search from.
	   * @returns {number} Returns the index of the matched value, else `-1`.
	   */
	  function baseIndexOf(array, value, fromIndex) {
	    if (value !== value) {
	      return indexOfNaN(array, fromIndex);
	    }
	    var index = fromIndex - 1,
	        length = array.length;
	
	    while (++index < length) {
	      if (array[index] === value) {
	        return index;
	      }
	    }
	    return -1;
	  }
	
	  /**
	   * The base implementation of `_.reduce` and `_.reduceRight`, without support
	   * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
	   *
	   * @private
	   * @param {Array|Object} collection The collection to iterate over.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @param {*} accumulator The initial value.
	   * @param {boolean} initAccum Specify using the first or last element of `collection` as the initial value.
	   * @param {Function} eachFunc The function to iterate over `collection`.
	   * @returns {*} Returns the accumulated value.
	   */
	  function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
	    eachFunc(collection, function(value, index, collection) {
	      accumulator = initAccum
	        ? (initAccum = false, value)
	        : iteratee(accumulator, value, index, collection);
	    });
	    return accumulator;
	  }
	
	  /**
	   * The base implementation of `_.sortBy` which uses `comparer` to define
	   * the sort order of `array` and replaces criteria objects with their
	   * corresponding values.
	   *
	   * @private
	   * @param {Array} array The array to sort.
	   * @param {Function} comparer The function to define sort order.
	   * @returns {Array} Returns `array`.
	   */
	  function baseSortBy(array, comparer) {
	    var length = array.length;
	
	    array.sort(comparer);
	    while (length--) {
	      array[length] = array[length].value;
	    }
	    return array;
	  }
	
	  /**
	   * The base implementation of `_.sum` without support for iteratee shorthands.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @returns {number} Returns the sum.
	   */
	  function baseSum(array, iteratee) {
	    var result,
	        index = -1,
	        length = array.length;
	
	    while (++index < length) {
	      var current = iteratee(array[index]);
	      if (current !== undefined) {
	        result = result === undefined ? current : (result + current);
	      }
	    }
	    return length ? result : 0;
	  }
	
	  /**
	   * The base implementation of `_.times` without support for iteratee shorthands
	   * or max array length checks.
	   *
	   * @private
	   * @param {number} n The number of times to invoke `iteratee`.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @returns {Array} Returns the array of results.
	   */
	  function baseTimes(n, iteratee) {
	    var index = -1,
	        result = Array(n);
	
	    while (++index < n) {
	      result[index] = iteratee(index);
	    }
	    return result;
	  }
	
	  /**
	   * The base implementation of `_.toPairs` and `_.toPairsIn` which creates an array
	   * of key-value pairs for `object` corresponding to the property names of `props`.
	   *
	   * @private
	   * @param {Object} object The object to query.
	   * @param {Array} props The property names to get values for.
	   * @returns {Object} Returns the new array of key-value pairs.
	   */
	  function baseToPairs(object, props) {
	    return arrayMap(props, function(key) {
	      return [key, object[key]];
	    });
	  }
	
	  /**
	   * The base implementation of `_.unary` without support for storing wrapper metadata.
	   *
	   * @private
	   * @param {Function} func The function to cap arguments for.
	   * @returns {Function} Returns the new function.
	   */
	  function baseUnary(func) {
	    return function(value) {
	      return func(value);
	    };
	  }
	
	  /**
	   * The base implementation of `_.values` and `_.valuesIn` which creates an
	   * array of `object` property values corresponding to the property names
	   * of `props`.
	   *
	   * @private
	   * @param {Object} object The object to query.
	   * @param {Array} props The property names to get values for.
	   * @returns {Object} Returns the array of property values.
	   */
	  function baseValues(object, props) {
	    return arrayMap(props, function(key) {
	      return object[key];
	    });
	  }
	
	  /**
	   * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
	   * that is not found in the character symbols.
	   *
	   * @private
	   * @param {Array} strSymbols The string symbols to inspect.
	   * @param {Array} chrSymbols The character symbols to find.
	   * @returns {number} Returns the index of the first unmatched string symbol.
	   */
	  function charsStartIndex(strSymbols, chrSymbols) {
	    var index = -1,
	        length = strSymbols.length;
	
	    while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
	    return index;
	  }
	
	  /**
	   * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
	   * that is not found in the character symbols.
	   *
	   * @private
	   * @param {Array} strSymbols The string symbols to inspect.
	   * @param {Array} chrSymbols The character symbols to find.
	   * @returns {number} Returns the index of the last unmatched string symbol.
	   */
	  function charsEndIndex(strSymbols, chrSymbols) {
	    var index = strSymbols.length;
	
	    while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
	    return index;
	  }
	
	  /**
	   * Checks if `value` is a global object.
	   *
	   * @private
	   * @param {*} value The value to check.
	   * @returns {null|Object} Returns `value` if it's a global object, else `null`.
	   */
	  function checkGlobal(value) {
	    return (value && value.Object === Object) ? value : null;
	  }
	
	  /**
	   * Compares values to sort them in ascending order.
	   *
	   * @private
	   * @param {*} value The value to compare.
	   * @param {*} other The other value to compare.
	   * @returns {number} Returns the sort order indicator for `value`.
	   */
	  function compareAscending(value, other) {
	    if (value !== other) {
	      var valIsNull = value === null,
	          valIsUndef = value === undefined,
	          valIsReflexive = value === value;
	
	      var othIsNull = other === null,
	          othIsUndef = other === undefined,
	          othIsReflexive = other === other;
	
	      if ((value > other && !othIsNull) || !valIsReflexive ||
	          (valIsNull && !othIsUndef && othIsReflexive) ||
	          (valIsUndef && othIsReflexive)) {
	        return 1;
	      }
	      if ((value < other && !valIsNull) || !othIsReflexive ||
	          (othIsNull && !valIsUndef && valIsReflexive) ||
	          (othIsUndef && valIsReflexive)) {
	        return -1;
	      }
	    }
	    return 0;
	  }
	
	  /**
	   * Used by `_.orderBy` to compare multiple properties of a value to another
	   * and stable sort them.
	   *
	   * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
	   * specify an order of "desc" for descending or "asc" for ascending sort order
	   * of corresponding values.
	   *
	   * @private
	   * @param {Object} object The object to compare.
	   * @param {Object} other The other object to compare.
	   * @param {boolean[]|string[]} orders The order to sort by for each property.
	   * @returns {number} Returns the sort order indicator for `object`.
	   */
	  function compareMultiple(object, other, orders) {
	    var index = -1,
	        objCriteria = object.criteria,
	        othCriteria = other.criteria,
	        length = objCriteria.length,
	        ordersLength = orders.length;
	
	    while (++index < length) {
	      var result = compareAscending(objCriteria[index], othCriteria[index]);
	      if (result) {
	        if (index >= ordersLength) {
	          return result;
	        }
	        var order = orders[index];
	        return result * (order == 'desc' ? -1 : 1);
	      }
	    }
	    // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
	    // that causes it, under certain circumstances, to provide the same value for
	    // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
	    // for more details.
	    //
	    // This also ensures a stable sort in V8 and other engines.
	    // See https://code.google.com/p/v8/issues/detail?id=90 for more details.
	    return object.index - other.index;
	  }
	
	  /**
	   * Used by `_.deburr` to convert latin-1 supplementary letters to basic latin letters.
	   *
	   * @private
	   * @param {string} letter The matched letter to deburr.
	   * @returns {string} Returns the deburred letter.
	   */
	  function deburrLetter(letter) {
	    return deburredLetters[letter];
	  }
	
	  /**
	   * Used by `_.escape` to convert characters to HTML entities.
	   *
	   * @private
	   * @param {string} chr The matched character to escape.
	   * @returns {string} Returns the escaped character.
	   */
	  function escapeHtmlChar(chr) {
	    return htmlEscapes[chr];
	  }
	
	  /**
	   * Used by `_.template` to escape characters for inclusion in compiled string literals.
	   *
	   * @private
	   * @param {string} chr The matched character to escape.
	   * @returns {string} Returns the escaped character.
	   */
	  function escapeStringChar(chr) {
	    return '\\' + stringEscapes[chr];
	  }
	
	  /**
	   * Gets the index at which the first occurrence of `NaN` is found in `array`.
	   *
	   * @private
	   * @param {Array} array The array to search.
	   * @param {number} fromIndex The index to search from.
	   * @param {boolean} [fromRight] Specify iterating from right to left.
	   * @returns {number} Returns the index of the matched `NaN`, else `-1`.
	   */
	  function indexOfNaN(array, fromIndex, fromRight) {
	    var length = array.length,
	        index = fromIndex + (fromRight ? 0 : -1);
	
	    while ((fromRight ? index-- : ++index < length)) {
	      var other = array[index];
	      if (other !== other) {
	        return index;
	      }
	    }
	    return -1;
	  }
	
	  /**
	   * Checks if `value` is a host object in IE < 9.
	   *
	   * @private
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
	   */
	  function isHostObject(value) {
	    // Many host objects are `Object` objects that can coerce to strings
	    // despite having improperly defined `toString` methods.
	    var result = false;
	    if (value != null && typeof value.toString != 'function') {
	      try {
	        result = !!(value + '');
	      } catch (e) {}
	    }
	    return result;
	  }
	
	  /**
	   * Checks if `value` is a valid array-like index.
	   *
	   * @private
	   * @param {*} value The value to check.
	   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	   */
	  function isIndex(value, length) {
	    value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
	    length = length == null ? MAX_SAFE_INTEGER : length;
	    return value > -1 && value % 1 == 0 && value < length;
	  }
	
	  /**
	   * Converts `iterator` to an array.
	   *
	   * @private
	   * @param {Object} iterator The iterator to convert.
	   * @returns {Array} Returns the converted array.
	   */
	  function iteratorToArray(iterator) {
	    var data,
	        result = [];
	
	    while (!(data = iterator.next()).done) {
	      result.push(data.value);
	    }
	    return result;
	  }
	
	  /**
	   * Converts `map` to an array.
	   *
	   * @private
	   * @param {Object} map The map to convert.
	   * @returns {Array} Returns the converted array.
	   */
	  function mapToArray(map) {
	    var index = -1,
	        result = Array(map.size);
	
	    map.forEach(function(value, key) {
	      result[++index] = [key, value];
	    });
	    return result;
	  }
	
	  /**
	   * Replaces all `placeholder` elements in `array` with an internal placeholder
	   * and returns an array of their indexes.
	   *
	   * @private
	   * @param {Array} array The array to modify.
	   * @param {*} placeholder The placeholder to replace.
	   * @returns {Array} Returns the new array of placeholder indexes.
	   */
	  function replaceHolders(array, placeholder) {
	    var index = -1,
	        length = array.length,
	        resIndex = -1,
	        result = [];
	
	    while (++index < length) {
	      if (array[index] === placeholder) {
	        array[index] = PLACEHOLDER;
	        result[++resIndex] = index;
	      }
	    }
	    return result;
	  }
	
	  /**
	   * Converts `set` to an array.
	   *
	   * @private
	   * @param {Object} set The set to convert.
	   * @returns {Array} Returns the converted array.
	   */
	  function setToArray(set) {
	    var index = -1,
	        result = Array(set.size);
	
	    set.forEach(function(value) {
	      result[++index] = value;
	    });
	    return result;
	  }
	
	  /**
	   * Gets the number of symbols in `string`.
	   *
	   * @private
	   * @param {string} string The string to inspect.
	   * @returns {number} Returns the string size.
	   */
	  function stringSize(string) {
	    if (!(string && reHasComplexSymbol.test(string))) {
	      return string.length;
	    }
	    var result = reComplexSymbol.lastIndex = 0;
	    while (reComplexSymbol.test(string)) {
	      result++;
	    }
	    return result;
	  }
	
	  /**
	   * Converts `string` to an array.
	   *
	   * @private
	   * @param {string} string The string to convert.
	   * @returns {Array} Returns the converted array.
	   */
	  function stringToArray(string) {
	    return string.match(reComplexSymbol);
	  }
	
	  /**
	   * Used by `_.unescape` to convert HTML entities to characters.
	   *
	   * @private
	   * @param {string} chr The matched character to unescape.
	   * @returns {string} Returns the unescaped character.
	   */
	  function unescapeHtmlChar(chr) {
	    return htmlUnescapes[chr];
	  }
	
	  /*--------------------------------------------------------------------------*/
	
	  /**
	   * Create a new pristine `lodash` function using the `context` object.
	   *
	   * @static
	   * @memberOf _
	   * @category Util
	   * @param {Object} [context=root] The context object.
	   * @returns {Function} Returns a new `lodash` function.
	   * @example
	   *
	   * _.mixin({ 'foo': _.constant('foo') });
	   *
	   * var lodash = _.runInContext();
	   * lodash.mixin({ 'bar': lodash.constant('bar') });
	   *
	   * _.isFunction(_.foo);
	   * // => true
	   * _.isFunction(_.bar);
	   * // => false
	   *
	   * lodash.isFunction(lodash.foo);
	   * // => false
	   * lodash.isFunction(lodash.bar);
	   * // => true
	   *
	   * // using `context` to mock `Date#getTime` use in `_.now`
	   * var mock = _.runInContext({
	   *   'Date': function() {
	   *     return { 'getTime': getTimeMock };
	   *   }
	   * });
	   *
	   * // or creating a suped-up `defer` in Node.js
	   * var defer = _.runInContext({ 'setTimeout': setImmediate }).defer;
	   */
	  function runInContext(context) {
	    context = context ? _.defaults({}, context, _.pick(root, contextProps)) : root;
	
	    /** Built-in constructor references. */
	    var Date = context.Date,
	        Error = context.Error,
	        Math = context.Math,
	        RegExp = context.RegExp,
	        TypeError = context.TypeError;
	
	    /** Used for built-in method references. */
	    var arrayProto = context.Array.prototype,
	        objectProto = context.Object.prototype;
	
	    /** Used to resolve the decompiled source of functions. */
	    var funcToString = context.Function.prototype.toString;
	
	    /** Used to check objects for own properties. */
	    var hasOwnProperty = objectProto.hasOwnProperty;
	
	    /** Used to generate unique IDs. */
	    var idCounter = 0;
	
	    /** Used to infer the `Object` constructor. */
	    var objectCtorString = funcToString.call(Object);
	
	    /**
	     * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	     * of values.
	     */
	    var objectToString = objectProto.toString;
	
	    /** Used to restore the original `_` reference in `_.noConflict`. */
	    var oldDash = root._;
	
	    /** Used to detect if a method is native. */
	    var reIsNative = RegExp('^' +
	      funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
	      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	    );
	
	    /** Built-in value references. */
	    var Reflect = context.Reflect,
	        Symbol = context.Symbol,
	        Uint8Array = context.Uint8Array,
	        clearTimeout = context.clearTimeout,
	        enumerate = Reflect ? Reflect.enumerate : undefined,
	        getPrototypeOf = Object.getPrototypeOf,
	        getOwnPropertySymbols = Object.getOwnPropertySymbols,
	        iteratorSymbol = typeof (iteratorSymbol = Symbol && Symbol.iterator) == 'symbol' ? iteratorSymbol : undefined,
	        propertyIsEnumerable = objectProto.propertyIsEnumerable,
	        setTimeout = context.setTimeout,
	        splice = arrayProto.splice;
	
	    /* Built-in method references for those with the same name as other `lodash` methods. */
	    var nativeCeil = Math.ceil,
	        nativeFloor = Math.floor,
	        nativeIsFinite = context.isFinite,
	        nativeJoin = arrayProto.join,
	        nativeKeys = Object.keys,
	        nativeMax = Math.max,
	        nativeMin = Math.min,
	        nativeParseInt = context.parseInt,
	        nativeRandom = Math.random,
	        nativeReverse = arrayProto.reverse;
	
	    /* Built-in method references that are verified to be native. */
	    var Map = getNative(context, 'Map'),
	        Set = getNative(context, 'Set'),
	        WeakMap = getNative(context, 'WeakMap'),
	        nativeCreate = getNative(Object, 'create');
	
	    /** Used to store function metadata. */
	    var metaMap = WeakMap && new WeakMap;
	
	    /** Used to detect maps and sets. */
	    var mapCtorString = Map ? funcToString.call(Map) : '',
	        setCtorString = Set ? funcToString.call(Set) : '';
	
	    /** Used to convert symbols to primitives and strings. */
	    var symbolProto = Symbol ? Symbol.prototype : undefined,
	        symbolValueOf = Symbol ? symbolProto.valueOf : undefined,
	        symbolToString = Symbol ? symbolProto.toString : undefined;
	
	    /** Used to lookup unminified function names. */
	    var realNames = {};
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Creates a `lodash` object which wraps `value` to enable implicit method
	     * chaining. Methods that operate on and return arrays, collections, and
	     * functions can be chained together. Methods that retrieve a single value or
	     * may return a primitive value will automatically end the chain sequence and
	     * return the unwrapped value. Otherwise, the value must be unwrapped with
	     * `_#value`.
	     *
	     * Explicit chaining, which must be unwrapped with `_#value` in all cases,
	     * may be enabled using `_.chain`.
	     *
	     * The execution of chained methods is lazy, that is, it's deferred until
	     * `_#value` is implicitly or explicitly called.
	     *
	     * Lazy evaluation allows several methods to support shortcut fusion. Shortcut
	     * fusion is an optimization to merge iteratee calls; this avoids the creation
	     * of intermediate arrays and can greatly reduce the number of iteratee executions.
	     * Sections of a chain sequence qualify for shortcut fusion if the section is
	     * applied to an array of at least two hundred elements and any iteratees
	     * accept only one argument. The heuristic for whether a section qualifies
	     * for shortcut fusion is subject to change.
	     *
	     * Chaining is supported in custom builds as long as the `_#value` method is
	     * directly or indirectly included in the build.
	     *
	     * In addition to lodash methods, wrappers have `Array` and `String` methods.
	     *
	     * The wrapper `Array` methods are:
	     * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
	     *
	     * The wrapper `String` methods are:
	     * `replace` and `split`
	     *
	     * The wrapper methods that support shortcut fusion are:
	     * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
	     * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
	     * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
	     *
	     * The chainable wrapper methods are:
	     * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`,
	     * `at`, `before`, `bind`, `bindAll`, `bindKey`, `chain`, `chunk`, `commit`,
	     * `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`, `curry`,
	     * `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`, `difference`,
	     * `differenceBy`, `differenceWith`, `drop`, `dropRight`, `dropRightWhile`,
	     * `dropWhile`, `fill`, `filter`, `flatten`, `flattenDeep`, `flip`, `flow`,
	     * `flowRight`, `fromPairs`, `functions`, `functionsIn`, `groupBy`, `initial`,
	     * `intersection`, `intersectionBy`, `intersectionWith`, `invert`, `invertBy`,
	     * `invokeMap`, `iteratee`, `keyBy`, `keys`, `keysIn`, `map`, `mapKeys`,
	     * `mapValues`, `matches`, `matchesProperty`, `memoize`, `merge`, `mergeWith`,
	     * `method`, `methodOf`, `mixin`, `negate`, `nthArg`, `omit`, `omitBy`, `once`,
	     * `orderBy`, `over`, `overArgs`, `overEvery`, `overSome`, `partial`,
	     * `partialRight`, `partition`, `pick`, `pickBy`, `plant`, `property`,
	     * `propertyOf`, `pull`, `pullAll`, `pullAllBy`, `pullAt`, `push`, `range`,
	     * `rangeRight`, `rearg`, `reject`, `remove`, `rest`, `reverse`, `sampleSize`,
	     * `set`, `setWith`, `shuffle`, `slice`, `sort`, `sortBy`, `splice`, `spread`,
	     * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, `tap`, `throttle`,
	     * `thru`, `toArray`, `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`,
	     * `transform`, `unary`, `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`,
	     * `uniqWith`, `unset`, `unshift`, `unzip`, `unzipWith`, `values`, `valuesIn`,
	     * `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`, `zipObject`,
	     * `zipObjectDeep`, and `zipWith`
	     *
	     * The wrapper methods that are **not** chainable by default are:
	     * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
	     * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `deburr`, `endsWith`, `eq`,
	     * `escape`, `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`,
	     * `findLast`, `findLastIndex`, `findLastKey`, `floor`, `forEach`, `forEachRight`,
	     * `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
	     * `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
	     * `isArguments`, `isArray`, `isArrayLike`, `isArrayLikeObject`, `isBoolean`,
	     * `isDate`, `isElement`, `isEmpty`, `isEqual`, `isEqualWith`, `isError`,
	     * `isFinite`, `isFunction`, `isInteger`, `isLength`, `isMatch`, `isMatchWith`,
	     * `isNaN`, `isNative`, `isNil`, `isNull`, `isNumber`, `isObject`, `isObjectLike`,
	     * `isPlainObject`, `isRegExp`, `isSafeInteger`, `isString`, `isUndefined`,
	     * `isTypedArray`, `join`, `kebabCase`, `last`, `lastIndexOf`, `lowerCase`,
	     * `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `min`, `minBy`,
	     * `noConflict`, `noop`, `now`, `pad`, `padEnd`, `padStart`, `parseInt`,
	     * `pop`, `random`, `reduce`, `reduceRight`, `repeat`, `result`, `round`,
	     * `runInContext`, `sample`, `shift`, `size`, `snakeCase`, `some`, `sortedIndex`,
	     * `sortedIndexBy`, `sortedLastIndex`, `sortedLastIndexBy`, `startCase`,
	     * `startsWith`, `subtract`, `sum`, `sumBy`, `template`, `times`, `toLower`,
	     * `toInteger`, `toLength`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`,
	     * `trim`, `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`,
	     * `upperCase`, `upperFirst`, `value`, and `words`
	     *
	     * @name _
	     * @constructor
	     * @category Seq
	     * @param {*} value The value to wrap in a `lodash` instance.
	     * @returns {Object} Returns the new `lodash` wrapper instance.
	     * @example
	     *
	     * function square(n) {
	     *   return n * n;
	     * }
	     *
	     * var wrapped = _([1, 2, 3]);
	     *
	     * // returns an unwrapped value
	     * wrapped.reduce(_.add);
	     * // => 6
	     *
	     * // returns a wrapped value
	     * var squares = wrapped.map(square);
	     *
	     * _.isArray(squares);
	     * // => false
	     *
	     * _.isArray(squares.value());
	     * // => true
	     */
	    function lodash(value) {
	      if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
	        if (value instanceof LodashWrapper) {
	          return value;
	        }
	        if (hasOwnProperty.call(value, '__wrapped__')) {
	          return wrapperClone(value);
	        }
	      }
	      return new LodashWrapper(value);
	    }
	
	    /**
	     * The function whose prototype all chaining wrappers inherit from.
	     *
	     * @private
	     */
	    function baseLodash() {
	      // No operation performed.
	    }
	
	    /**
	     * The base constructor for creating `lodash` wrapper objects.
	     *
	     * @private
	     * @param {*} value The value to wrap.
	     * @param {boolean} [chainAll] Enable chaining for all wrapper methods.
	     */
	    function LodashWrapper(value, chainAll) {
	      this.__wrapped__ = value;
	      this.__actions__ = [];
	      this.__chain__ = !!chainAll;
	      this.__index__ = 0;
	      this.__values__ = undefined;
	    }
	
	    /**
	     * By default, the template delimiters used by lodash are like those in
	     * embedded Ruby (ERB). Change the following template settings to use
	     * alternative delimiters.
	     *
	     * @static
	     * @memberOf _
	     * @type Object
	     */
	    lodash.templateSettings = {
	
	      /**
	       * Used to detect `data` property values to be HTML-escaped.
	       *
	       * @memberOf _.templateSettings
	       * @type RegExp
	       */
	      'escape': reEscape,
	
	      /**
	       * Used to detect code to be evaluated.
	       *
	       * @memberOf _.templateSettings
	       * @type RegExp
	       */
	      'evaluate': reEvaluate,
	
	      /**
	       * Used to detect `data` property values to inject.
	       *
	       * @memberOf _.templateSettings
	       * @type RegExp
	       */
	      'interpolate': reInterpolate,
	
	      /**
	       * Used to reference the data object in the template text.
	       *
	       * @memberOf _.templateSettings
	       * @type string
	       */
	      'variable': '',
	
	      /**
	       * Used to import variables into the compiled template.
	       *
	       * @memberOf _.templateSettings
	       * @type Object
	       */
	      'imports': {
	
	        /**
	         * A reference to the `lodash` function.
	         *
	         * @memberOf _.templateSettings.imports
	         * @type Function
	         */
	        '_': lodash
	      }
	    };
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
	     *
	     * @private
	     * @param {*} value The value to wrap.
	     */
	    function LazyWrapper(value) {
	      this.__wrapped__ = value;
	      this.__actions__ = [];
	      this.__dir__ = 1;
	      this.__filtered__ = false;
	      this.__iteratees__ = [];
	      this.__takeCount__ = MAX_ARRAY_LENGTH;
	      this.__views__ = [];
	    }
	
	    /**
	     * Creates a clone of the lazy wrapper object.
	     *
	     * @private
	     * @name clone
	     * @memberOf LazyWrapper
	     * @returns {Object} Returns the cloned `LazyWrapper` object.
	     */
	    function lazyClone() {
	      var result = new LazyWrapper(this.__wrapped__);
	      result.__actions__ = copyArray(this.__actions__);
	      result.__dir__ = this.__dir__;
	      result.__filtered__ = this.__filtered__;
	      result.__iteratees__ = copyArray(this.__iteratees__);
	      result.__takeCount__ = this.__takeCount__;
	      result.__views__ = copyArray(this.__views__);
	      return result;
	    }
	
	    /**
	     * Reverses the direction of lazy iteration.
	     *
	     * @private
	     * @name reverse
	     * @memberOf LazyWrapper
	     * @returns {Object} Returns the new reversed `LazyWrapper` object.
	     */
	    function lazyReverse() {
	      if (this.__filtered__) {
	        var result = new LazyWrapper(this);
	        result.__dir__ = -1;
	        result.__filtered__ = true;
	      } else {
	        result = this.clone();
	        result.__dir__ *= -1;
	      }
	      return result;
	    }
	
	    /**
	     * Extracts the unwrapped value from its lazy wrapper.
	     *
	     * @private
	     * @name value
	     * @memberOf LazyWrapper
	     * @returns {*} Returns the unwrapped value.
	     */
	    function lazyValue() {
	      var array = this.__wrapped__.value(),
	          dir = this.__dir__,
	          isArr = isArray(array),
	          isRight = dir < 0,
	          arrLength = isArr ? array.length : 0,
	          view = getView(0, arrLength, this.__views__),
	          start = view.start,
	          end = view.end,
	          length = end - start,
	          index = isRight ? end : (start - 1),
	          iteratees = this.__iteratees__,
	          iterLength = iteratees.length,
	          resIndex = 0,
	          takeCount = nativeMin(length, this.__takeCount__);
	
	      if (!isArr || arrLength < LARGE_ARRAY_SIZE || (arrLength == length && takeCount == length)) {
	        return baseWrapperValue(array, this.__actions__);
	      }
	      var result = [];
	
	      outer:
	      while (length-- && resIndex < takeCount) {
	        index += dir;
	
	        var iterIndex = -1,
	            value = array[index];
	
	        while (++iterIndex < iterLength) {
	          var data = iteratees[iterIndex],
	              iteratee = data.iteratee,
	              type = data.type,
	              computed = iteratee(value);
	
	          if (type == LAZY_MAP_FLAG) {
	            value = computed;
	          } else if (!computed) {
	            if (type == LAZY_FILTER_FLAG) {
	              continue outer;
	            } else {
	              break outer;
	            }
	          }
	        }
	        result[resIndex++] = value;
	      }
	      return result;
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Creates an hash object.
	     *
	     * @private
	     * @returns {Object} Returns the new hash object.
	     */
	    function Hash() {}
	
	    /**
	     * Removes `key` and its value from the hash.
	     *
	     * @private
	     * @param {Object} hash The hash to modify.
	     * @param {string} key The key of the value to remove.
	     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	     */
	    function hashDelete(hash, key) {
	      return hashHas(hash, key) && delete hash[key];
	    }
	
	    /**
	     * Gets the hash value for `key`.
	     *
	     * @private
	     * @param {Object} hash The hash to query.
	     * @param {string} key The key of the value to get.
	     * @returns {*} Returns the entry value.
	     */
	    function hashGet(hash, key) {
	      if (nativeCreate) {
	        var result = hash[key];
	        return result === HASH_UNDEFINED ? undefined : result;
	      }
	      return hasOwnProperty.call(hash, key) ? hash[key] : undefined;
	    }
	
	    /**
	     * Checks if a hash value for `key` exists.
	     *
	     * @private
	     * @param {Object} hash The hash to query.
	     * @param {string} key The key of the entry to check.
	     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	     */
	    function hashHas(hash, key) {
	      return nativeCreate ? hash[key] !== undefined : hasOwnProperty.call(hash, key);
	    }
	
	    /**
	     * Sets the hash `key` to `value`.
	     *
	     * @private
	     * @param {Object} hash The hash to modify.
	     * @param {string} key The key of the value to set.
	     * @param {*} value The value to set.
	     */
	    function hashSet(hash, key, value) {
	      hash[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Creates a map cache object to store key-value pairs.
	     *
	     * @private
	     * @param {Array} [values] The values to cache.
	     */
	    function MapCache(values) {
	      var index = -1,
	          length = values ? values.length : 0;
	
	      this.clear();
	      while (++index < length) {
	        var entry = values[index];
	        this.set(entry[0], entry[1]);
	      }
	    }
	
	    /**
	     * Removes all key-value entries from the map.
	     *
	     * @private
	     * @name clear
	     * @memberOf MapCache
	     */
	    function mapClear() {
	      this.__data__ = { 'hash': new Hash, 'map': Map ? new Map : [], 'string': new Hash };
	    }
	
	    /**
	     * Removes `key` and its value from the map.
	     *
	     * @private
	     * @name delete
	     * @memberOf MapCache
	     * @param {string} key The key of the value to remove.
	     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	     */
	    function mapDelete(key) {
	      var data = this.__data__;
	      if (isKeyable(key)) {
	        return hashDelete(typeof key == 'string' ? data.string : data.hash, key);
	      }
	      return Map ? data.map['delete'](key) : assocDelete(data.map, key);
	    }
	
	    /**
	     * Gets the map value for `key`.
	     *
	     * @private
	     * @name get
	     * @memberOf MapCache
	     * @param {string} key The key of the value to get.
	     * @returns {*} Returns the entry value.
	     */
	    function mapGet(key) {
	      var data = this.__data__;
	      if (isKeyable(key)) {
	        return hashGet(typeof key == 'string' ? data.string : data.hash, key);
	      }
	      return Map ? data.map.get(key) : assocGet(data.map, key);
	    }
	
	    /**
	     * Checks if a map value for `key` exists.
	     *
	     * @private
	     * @name has
	     * @memberOf MapCache
	     * @param {string} key The key of the entry to check.
	     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	     */
	    function mapHas(key) {
	      var data = this.__data__;
	      if (isKeyable(key)) {
	        return hashHas(typeof key == 'string' ? data.string : data.hash, key);
	      }
	      return Map ? data.map.has(key) : assocHas(data.map, key);
	    }
	
	    /**
	     * Sets the map `key` to `value`.
	     *
	     * @private
	     * @name set
	     * @memberOf MapCache
	     * @param {string} key The key of the value to set.
	     * @param {*} value The value to set.
	     * @returns {Object} Returns the map cache object.
	     */
	    function mapSet(key, value) {
	      var data = this.__data__;
	      if (isKeyable(key)) {
	        hashSet(typeof key == 'string' ? data.string : data.hash, key, value);
	      } else if (Map) {
	        data.map.set(key, value);
	      } else {
	        assocSet(data.map, key, value);
	      }
	      return this;
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     *
	     * Creates a set cache object to store unique values.
	     *
	     * @private
	     * @param {Array} [values] The values to cache.
	     */
	    function SetCache(values) {
	      var index = -1,
	          length = values ? values.length : 0;
	
	      this.__data__ = new MapCache;
	      while (++index < length) {
	        this.push(values[index]);
	      }
	    }
	
	    /**
	     * Checks if `value` is in `cache`.
	     *
	     * @private
	     * @param {Object} cache The set cache to search.
	     * @param {*} value The value to search for.
	     * @returns {number} Returns `true` if `value` is found, else `false`.
	     */
	    function cacheHas(cache, value) {
	      var map = cache.__data__;
	      if (isKeyable(value)) {
	        var data = map.__data__,
	            hash = typeof value == 'string' ? data.string : data.hash;
	
	        return hash[value] === HASH_UNDEFINED;
	      }
	      return map.has(value);
	    }
	
	    /**
	     * Adds `value` to the set cache.
	     *
	     * @private
	     * @name push
	     * @memberOf SetCache
	     * @param {*} value The value to cache.
	     */
	    function cachePush(value) {
	      var map = this.__data__;
	      if (isKeyable(value)) {
	        var data = map.__data__,
	            hash = typeof value == 'string' ? data.string : data.hash;
	
	        hash[value] = HASH_UNDEFINED;
	      }
	      else {
	        map.set(value, HASH_UNDEFINED);
	      }
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Creates a stack cache object to store key-value pairs.
	     *
	     * @private
	     * @param {Array} [values] The values to cache.
	     */
	    function Stack(values) {
	      var index = -1,
	          length = values ? values.length : 0;
	
	      this.clear();
	      while (++index < length) {
	        var entry = values[index];
	        this.set(entry[0], entry[1]);
	      }
	    }
	
	    /**
	     * Removes all key-value entries from the stack.
	     *
	     * @private
	     * @name clear
	     * @memberOf Stack
	     */
	    function stackClear() {
	      this.__data__ = { 'array': [], 'map': null };
	    }
	
	    /**
	     * Removes `key` and its value from the stack.
	     *
	     * @private
	     * @name delete
	     * @memberOf Stack
	     * @param {string} key The key of the value to remove.
	     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	     */
	    function stackDelete(key) {
	      var data = this.__data__,
	          array = data.array;
	
	      return array ? assocDelete(array, key) : data.map['delete'](key);
	    }
	
	    /**
	     * Gets the stack value for `key`.
	     *
	     * @private
	     * @name get
	     * @memberOf Stack
	     * @param {string} key The key of the value to get.
	     * @returns {*} Returns the entry value.
	     */
	    function stackGet(key) {
	      var data = this.__data__,
	          array = data.array;
	
	      return array ? assocGet(array, key) : data.map.get(key);
	    }
	
	    /**
	     * Checks if a stack value for `key` exists.
	     *
	     * @private
	     * @name has
	     * @memberOf Stack
	     * @param {string} key The key of the entry to check.
	     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	     */
	    function stackHas(key) {
	      var data = this.__data__,
	          array = data.array;
	
	      return array ? assocHas(array, key) : data.map.has(key);
	    }
	
	    /**
	     * Sets the stack `key` to `value`.
	     *
	     * @private
	     * @name set
	     * @memberOf Stack
	     * @param {string} key The key of the value to set.
	     * @param {*} value The value to set.
	     * @returns {Object} Returns the stack cache object.
	     */
	    function stackSet(key, value) {
	      var data = this.__data__,
	          array = data.array;
	
	      if (array) {
	        if (array.length < (LARGE_ARRAY_SIZE - 1)) {
	          assocSet(array, key, value);
	        } else {
	          data.array = null;
	          data.map = new MapCache(array);
	        }
	      }
	      var map = data.map;
	      if (map) {
	        map.set(key, value);
	      }
	      return this;
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Removes `key` and its value from the associative array.
	     *
	     * @private
	     * @param {Array} array The array to query.
	     * @param {string} key The key of the value to remove.
	     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	     */
	    function assocDelete(array, key) {
	      var index = assocIndexOf(array, key);
	      if (index < 0) {
	        return false;
	      }
	      var lastIndex = array.length - 1;
	      if (index == lastIndex) {
	        array.pop();
	      } else {
	        splice.call(array, index, 1);
	      }
	      return true;
	    }
	
	    /**
	     * Gets the associative array value for `key`.
	     *
	     * @private
	     * @param {Array} array The array to query.
	     * @param {string} key The key of the value to get.
	     * @returns {*} Returns the entry value.
	     */
	    function assocGet(array, key) {
	      var index = assocIndexOf(array, key);
	      return index < 0 ? undefined : array[index][1];
	    }
	
	    /**
	     * Checks if an associative array value for `key` exists.
	     *
	     * @private
	     * @param {Array} array The array to query.
	     * @param {string} key The key of the entry to check.
	     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	     */
	    function assocHas(array, key) {
	      return assocIndexOf(array, key) > -1;
	    }
	
	    /**
	     * Gets the index at which the first occurrence of `key` is found in `array`
	     * of key-value pairs.
	     *
	     * @private
	     * @param {Array} array The array to search.
	     * @param {*} key The key to search for.
	     * @returns {number} Returns the index of the matched value, else `-1`.
	     */
	    function assocIndexOf(array, key) {
	      var length = array.length;
	      while (length--) {
	        if (eq(array[length][0], key)) {
	          return length;
	        }
	      }
	      return -1;
	    }
	
	    /**
	     * Sets the associative array `key` to `value`.
	     *
	     * @private
	     * @param {Array} array The array to modify.
	     * @param {string} key The key of the value to set.
	     * @param {*} value The value to set.
	     */
	    function assocSet(array, key, value) {
	      var index = assocIndexOf(array, key);
	      if (index < 0) {
	        array.push([key, value]);
	      } else {
	        array[index][1] = value;
	      }
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Used by `_.defaults` to customize its `_.assignIn` use.
	     *
	     * @private
	     * @param {*} objValue The destination value.
	     * @param {*} srcValue The source value.
	     * @param {string} key The key of the property to assign.
	     * @param {Object} object The parent object of `objValue`.
	     * @returns {*} Returns the value to assign.
	     */
	    function assignInDefaults(objValue, srcValue, key, object) {
	      if (objValue === undefined ||
	          (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
	        return srcValue;
	      }
	      return objValue;
	    }
	
	    /**
	     * This function is like `assignValue` except that it doesn't assign `undefined` values.
	     *
	     * @private
	     * @param {Object} object The object to modify.
	     * @param {string} key The key of the property to assign.
	     * @param {*} value The value to assign.
	     */
	    function assignMergeValue(object, key, value) {
	      if ((value !== undefined && !eq(object[key], value)) ||
	          (typeof key == 'number' && value === undefined && !(key in object))) {
	        object[key] = value;
	      }
	    }
	
	    /**
	     * Assigns `value` to `key` of `object` if the existing value is not equivalent
	     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	     * for equality comparisons.
	     *
	     * @private
	     * @param {Object} object The object to modify.
	     * @param {string} key The key of the property to assign.
	     * @param {*} value The value to assign.
	     */
	    function assignValue(object, key, value) {
	      var objValue = object[key];
	      if ((!eq(objValue, value) ||
	            (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) ||
	          (value === undefined && !(key in object))) {
	        object[key] = value;
	      }
	    }
	
	    /**
	     * Aggregates elements of `collection` on `accumulator` with keys transformed
	     * by `iteratee` and values set by `setter`.
	     *
	     * @private
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function} setter The function to set `accumulator` values.
	     * @param {Function} iteratee The iteratee to transform keys.
	     * @param {Object} accumulator The initial aggregated object.
	     * @returns {Function} Returns `accumulator`.
	     */
	    function baseAggregator(collection, setter, iteratee, accumulator) {
	      baseEach(collection, function(value, key, collection) {
	        setter(accumulator, value, iteratee(value), collection);
	      });
	      return accumulator;
	    }
	
	    /**
	     * The base implementation of `_.assign` without support for multiple sources
	     * or `customizer` functions.
	     *
	     * @private
	     * @param {Object} object The destination object.
	     * @param {Object} source The source object.
	     * @returns {Object} Returns `object`.
	     */
	    function baseAssign(object, source) {
	      return object && copyObject(source, keys(source), object);
	    }
	
	    /**
	     * The base implementation of `_.at` without support for individual paths.
	     *
	     * @private
	     * @param {Object} object The object to iterate over.
	     * @param {string[]} paths The property paths of elements to pick.
	     * @returns {Array} Returns the new array of picked elements.
	     */
	    function baseAt(object, paths) {
	      var index = -1,
	          isNil = object == null,
	          length = paths.length,
	          result = Array(length);
	
	      while (++index < length) {
	        result[index] = isNil ? undefined : get(object, paths[index]);
	      }
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.clamp` which doesn't coerce arguments to numbers.
	     *
	     * @private
	     * @param {number} number The number to clamp.
	     * @param {number} [lower] The lower bound.
	     * @param {number} upper The upper bound.
	     * @returns {number} Returns the clamped number.
	     */
	    function baseClamp(number, lower, upper) {
	      if (number === number) {
	        if (upper !== undefined) {
	          number = number <= upper ? number : upper;
	        }
	        if (lower !== undefined) {
	          number = number >= lower ? number : lower;
	        }
	      }
	      return number;
	    }
	
	    /**
	     * The base implementation of `_.clone` and `_.cloneDeep` which tracks
	     * traversed objects.
	     *
	     * @private
	     * @param {*} value The value to clone.
	     * @param {boolean} [isDeep] Specify a deep clone.
	     * @param {Function} [customizer] The function to customize cloning.
	     * @param {string} [key] The key of `value`.
	     * @param {Object} [object] The parent object of `value`.
	     * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
	     * @returns {*} Returns the cloned value.
	     */
	    function baseClone(value, isDeep, customizer, key, object, stack) {
	      var result;
	      if (customizer) {
	        result = object ? customizer(value, key, object, stack) : customizer(value);
	      }
	      if (result !== undefined) {
	        return result;
	      }
	      if (!isObject(value)) {
	        return value;
	      }
	      var isArr = isArray(value);
	      if (isArr) {
	        result = initCloneArray(value);
	        if (!isDeep) {
	          return copyArray(value, result);
	        }
	      } else {
	        var tag = getTag(value),
	            isFunc = tag == funcTag || tag == genTag;
	
	        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
	          if (isHostObject(value)) {
	            return object ? value : {};
	          }
	          result = initCloneObject(isFunc ? {} : value);
	          if (!isDeep) {
	            return copySymbols(value, baseAssign(result, value));
	          }
	        } else {
	          return cloneableTags[tag]
	            ? initCloneByTag(value, tag, isDeep)
	            : (object ? value : {});
	        }
	      }
	      // Check for circular references and return its corresponding clone.
	      stack || (stack = new Stack);
	      var stacked = stack.get(value);
	      if (stacked) {
	        return stacked;
	      }
	      stack.set(value, result);
	
	      // Recursively populate clone (susceptible to call stack limits).
	      (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
	        assignValue(result, key, baseClone(subValue, isDeep, customizer, key, value, stack));
	      });
	      return isArr ? result : copySymbols(value, result);
	    }
	
	    /**
	     * The base implementation of `_.conforms` which doesn't clone `source`.
	     *
	     * @private
	     * @param {Object} source The object of property predicates to conform to.
	     * @returns {Function} Returns the new function.
	     */
	    function baseConforms(source) {
	      var props = keys(source),
	          length = props.length;
	
	      return function(object) {
	        if (object == null) {
	          return !length;
	        }
	        var index = length;
	        while (index--) {
	          var key = props[index],
	              predicate = source[key],
	              value = object[key];
	
	          if ((value === undefined && !(key in Object(object))) || !predicate(value)) {
	            return false;
	          }
	        }
	        return true;
	      };
	    }
	
	    /**
	     * The base implementation of `_.create` without support for assigning
	     * properties to the created object.
	     *
	     * @private
	     * @param {Object} prototype The object to inherit from.
	     * @returns {Object} Returns the new object.
	     */
	    var baseCreate = (function() {
	      function object() {}
	      return function(prototype) {
	        if (isObject(prototype)) {
	          object.prototype = prototype;
	          var result = new object;
	          object.prototype = undefined;
	        }
	        return result || {};
	      };
	    }());
	
	    /**
	     * The base implementation of `_.delay` and `_.defer` which accepts an array
	     * of `func` arguments.
	     *
	     * @private
	     * @param {Function} func The function to delay.
	     * @param {number} wait The number of milliseconds to delay invocation.
	     * @param {Object} args The arguments provide to `func`.
	     * @returns {number} Returns the timer id.
	     */
	    function baseDelay(func, wait, args) {
	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      return setTimeout(function() { func.apply(undefined, args); }, wait);
	    }
	
	    /**
	     * The base implementation of methods like `_.difference` without support for
	     * excluding multiple arrays or iteratee shorthands.
	     *
	     * @private
	     * @param {Array} array The array to inspect.
	     * @param {Array} values The values to exclude.
	     * @param {Function} [iteratee] The iteratee invoked per element.
	     * @param {Function} [comparator] The comparator invoked per element.
	     * @returns {Array} Returns the new array of filtered values.
	     */
	    function baseDifference(array, values, iteratee, comparator) {
	      var index = -1,
	          includes = arrayIncludes,
	          isCommon = true,
	          length = array.length,
	          result = [],
	          valuesLength = values.length;
	
	      if (!length) {
	        return result;
	      }
	      if (iteratee) {
	        values = arrayMap(values, baseUnary(iteratee));
	      }
	      if (comparator) {
	        includes = arrayIncludesWith;
	        isCommon = false;
	      }
	      else if (values.length >= LARGE_ARRAY_SIZE) {
	        includes = cacheHas;
	        isCommon = false;
	        values = new SetCache(values);
	      }
	      outer:
	      while (++index < length) {
	        var value = array[index],
	            computed = iteratee ? iteratee(value) : value;
	
	        if (isCommon && computed === computed) {
	          var valuesIndex = valuesLength;
	          while (valuesIndex--) {
	            if (values[valuesIndex] === computed) {
	              continue outer;
	            }
	          }
	          result.push(value);
	        }
	        else if (!includes(values, computed, comparator)) {
	          result.push(value);
	        }
	      }
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.forEach` without support for iteratee shorthands.
	     *
	     * @private
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Array|Object} Returns `collection`.
	     */
	    var baseEach = createBaseEach(baseForOwn);
	
	    /**
	     * The base implementation of `_.forEachRight` without support for iteratee shorthands.
	     *
	     * @private
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Array|Object} Returns `collection`.
	     */
	    var baseEachRight = createBaseEach(baseForOwnRight, true);
	
	    /**
	     * The base implementation of `_.every` without support for iteratee shorthands.
	     *
	     * @private
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function} predicate The function invoked per iteration.
	     * @returns {boolean} Returns `true` if all elements pass the predicate check, else `false`
	     */
	    function baseEvery(collection, predicate) {
	      var result = true;
	      baseEach(collection, function(value, index, collection) {
	        result = !!predicate(value, index, collection);
	        return result;
	      });
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.fill` without an iteratee call guard.
	     *
	     * @private
	     * @param {Array} array The array to fill.
	     * @param {*} value The value to fill `array` with.
	     * @param {number} [start=0] The start position.
	     * @param {number} [end=array.length] The end position.
	     * @returns {Array} Returns `array`.
	     */
	    function baseFill(array, value, start, end) {
	      var length = array.length;
	
	      start = toInteger(start);
	      if (start < 0) {
	        start = -start > length ? 0 : (length + start);
	      }
	      end = (end === undefined || end > length) ? length : toInteger(end);
	      if (end < 0) {
	        end += length;
	      }
	      end = start > end ? 0 : toLength(end);
	      while (start < end) {
	        array[start++] = value;
	      }
	      return array;
	    }
	
	    /**
	     * The base implementation of `_.filter` without support for iteratee shorthands.
	     *
	     * @private
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function} predicate The function invoked per iteration.
	     * @returns {Array} Returns the new filtered array.
	     */
	    function baseFilter(collection, predicate) {
	      var result = [];
	      baseEach(collection, function(value, index, collection) {
	        if (predicate(value, index, collection)) {
	          result.push(value);
	        }
	      });
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.flatten` with support for restricting flattening.
	     *
	     * @private
	     * @param {Array} array The array to flatten.
	     * @param {boolean} [isDeep] Specify a deep flatten.
	     * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
	     * @param {Array} [result=[]] The initial result value.
	     * @returns {Array} Returns the new flattened array.
	     */
	    function baseFlatten(array, isDeep, isStrict, result) {
	      result || (result = []);
	
	      var index = -1,
	          length = array.length;
	
	      while (++index < length) {
	        var value = array[index];
	        if (isArrayLikeObject(value) &&
	            (isStrict || isArray(value) || isArguments(value))) {
	          if (isDeep) {
	            // Recursively flatten arrays (susceptible to call stack limits).
	            baseFlatten(value, isDeep, isStrict, result);
	          } else {
	            arrayPush(result, value);
	          }
	        } else if (!isStrict) {
	          result[result.length] = value;
	        }
	      }
	      return result;
	    }
	
	    /**
	     * The base implementation of `baseForIn` and `baseForOwn` which iterates
	     * over `object` properties returned by `keysFunc` invoking `iteratee` for
	     * each property. Iteratee functions may exit iteration early by explicitly
	     * returning `false`.
	     *
	     * @private
	     * @param {Object} object The object to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @param {Function} keysFunc The function to get the keys of `object`.
	     * @returns {Object} Returns `object`.
	     */
	    var baseFor = createBaseFor();
	
	    /**
	     * This function is like `baseFor` except that it iterates over properties
	     * in the opposite order.
	     *
	     * @private
	     * @param {Object} object The object to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @param {Function} keysFunc The function to get the keys of `object`.
	     * @returns {Object} Returns `object`.
	     */
	    var baseForRight = createBaseFor(true);
	
	    /**
	     * The base implementation of `_.forIn` without support for iteratee shorthands.
	     *
	     * @private
	     * @param {Object} object The object to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Object} Returns `object`.
	     */
	    function baseForIn(object, iteratee) {
	      return object == null ? object : baseFor(object, iteratee, keysIn);
	    }
	
	    /**
	     * The base implementation of `_.forOwn` without support for iteratee shorthands.
	     *
	     * @private
	     * @param {Object} object The object to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Object} Returns `object`.
	     */
	    function baseForOwn(object, iteratee) {
	      return object && baseFor(object, iteratee, keys);
	    }
	
	    /**
	     * The base implementation of `_.forOwnRight` without support for iteratee shorthands.
	     *
	     * @private
	     * @param {Object} object The object to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Object} Returns `object`.
	     */
	    function baseForOwnRight(object, iteratee) {
	      return object && baseForRight(object, iteratee, keys);
	    }
	
	    /**
	     * The base implementation of `_.functions` which creates an array of
	     * `object` function property names filtered from those provided.
	     *
	     * @private
	     * @param {Object} object The object to inspect.
	     * @param {Array} props The property names to filter.
	     * @returns {Array} Returns the new array of filtered property names.
	     */
	    function baseFunctions(object, props) {
	      return arrayFilter(props, function(key) {
	        return isFunction(object[key]);
	      });
	    }
	
	    /**
	     * The base implementation of `_.get` without support for default values.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @param {Array|string} path The path of the property to get.
	     * @returns {*} Returns the resolved value.
	     */
	    function baseGet(object, path) {
	      path = isKey(path, object) ? [path + ''] : baseToPath(path);
	
	      var index = 0,
	          length = path.length;
	
	      while (object != null && index < length) {
	        object = object[path[index++]];
	      }
	      return (index && index == length) ? object : undefined;
	    }
	
	    /**
	     * The base implementation of `_.has` without support for deep paths.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @param {Array|string} key The key to check.
	     * @returns {boolean} Returns `true` if `key` exists, else `false`.
	     */
	    function baseHas(object, key) {
	      // Avoid a bug in IE 10-11 where objects with a [[Prototype]] of `null`,
	      // that are composed entirely of index properties, return `false` for
	      // `hasOwnProperty` checks of them.
	      return hasOwnProperty.call(object, key) ||
	        (typeof object == 'object' && key in object && getPrototypeOf(object) === null);
	    }
	
	    /**
	     * The base implementation of `_.hasIn` without support for deep paths.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @param {Array|string} key The key to check.
	     * @returns {boolean} Returns `true` if `key` exists, else `false`.
	     */
	    function baseHasIn(object, key) {
	      return key in Object(object);
	    }
	
	    /**
	     * The base implementation of `_.inRange` which doesn't coerce arguments to numbers.
	     *
	     * @private
	     * @param {number} number The number to check.
	     * @param {number} start The start of the range.
	     * @param {number} end The end of the range.
	     * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
	     */
	    function baseInRange(number, start, end) {
	      return number >= nativeMin(start, end) && number < nativeMax(start, end);
	    }
	
	    /**
	     * The base implementation of methods like `_.intersection`, without support
	     * for iteratee shorthands, that accepts an array of arrays to inspect.
	     *
	     * @private
	     * @param {Array} arrays The arrays to inspect.
	     * @param {Function} [iteratee] The iteratee invoked per element.
	     * @param {Function} [comparator] The comparator invoked per element.
	     * @returns {Array} Returns the new array of shared values.
	     */
	    function baseIntersection(arrays, iteratee, comparator) {
	      var includes = comparator ? arrayIncludesWith : arrayIncludes,
	          othLength = arrays.length,
	          othIndex = othLength,
	          caches = Array(othLength),
	          result = [];
	
	      while (othIndex--) {
	        var array = arrays[othIndex];
	        if (othIndex && iteratee) {
	          array = arrayMap(array, baseUnary(iteratee));
	        }
	        caches[othIndex] = !comparator && (iteratee || array.length >= 120)
	          ? new SetCache(othIndex && array)
	          : undefined;
	      }
	      array = arrays[0];
	
	      var index = -1,
	          length = array.length,
	          seen = caches[0];
	
	      outer:
	      while (++index < length) {
	        var value = array[index],
	            computed = iteratee ? iteratee(value) : value;
	
	        if (!(seen ? cacheHas(seen, computed) : includes(result, computed, comparator))) {
	          var othIndex = othLength;
	          while (--othIndex) {
	            var cache = caches[othIndex];
	            if (!(cache ? cacheHas(cache, computed) : includes(arrays[othIndex], computed, comparator))) {
	              continue outer;
	            }
	          }
	          if (seen) {
	            seen.push(computed);
	          }
	          result.push(value);
	        }
	      }
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.invert` and `_.invertBy` which inverts
	     * `object` with values transformed by `iteratee` and set by `setter`.
	     *
	     * @private
	     * @param {Object} object The object to iterate over.
	     * @param {Function} setter The function to set `accumulator` values.
	     * @param {Function} iteratee The iteratee to transform values.
	     * @param {Object} accumulator The initial inverted object.
	     * @returns {Function} Returns `accumulator`.
	     */
	    function baseInverter(object, setter, iteratee, accumulator) {
	      baseForOwn(object, function(value, key, object) {
	        setter(accumulator, iteratee(value), key, object);
	      });
	      return accumulator;
	    }
	
	    /**
	     * The base implementation of `_.invoke` without support for individual
	     * method arguments.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @param {Array|string} path The path of the method to invoke.
	     * @param {Array} args The arguments to invoke the method with.
	     * @returns {*} Returns the result of the invoked method.
	     */
	    function baseInvoke(object, path, args) {
	      if (!isKey(path, object)) {
	        path = baseToPath(path);
	        object = parent(object, path);
	        path = last(path);
	      }
	      var func = object == null ? object : object[path];
	      return func == null ? undefined : apply(func, object, args);
	    }
	
	    /**
	     * The base implementation of `_.isEqual` which supports partial comparisons
	     * and tracks traversed objects.
	     *
	     * @private
	     * @param {*} value The value to compare.
	     * @param {*} other The other value to compare.
	     * @param {Function} [customizer] The function to customize comparisons.
	     * @param {boolean} [bitmask] The bitmask of comparison flags.
	     *  The bitmask may be composed of the following flags:
	     *     1 - Unordered comparison
	     *     2 - Partial comparison
	     * @param {Object} [stack] Tracks traversed `value` and `other` objects.
	     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	     */
	    function baseIsEqual(value, other, customizer, bitmask, stack) {
	      if (value === other) {
	        return true;
	      }
	      if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
	        return value !== value && other !== other;
	      }
	      return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
	    }
	
	    /**
	     * A specialized version of `baseIsEqual` for arrays and objects which performs
	     * deep comparisons and tracks traversed objects enabling objects with circular
	     * references to be compared.
	     *
	     * @private
	     * @param {Object} object The object to compare.
	     * @param {Object} other The other object to compare.
	     * @param {Function} equalFunc The function to determine equivalents of values.
	     * @param {Function} [customizer] The function to customize comparisons.
	     * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual` for more details.
	     * @param {Object} [stack] Tracks traversed `object` and `other` objects.
	     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	     */
	    function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
	      var objIsArr = isArray(object),
	          othIsArr = isArray(other),
	          objTag = arrayTag,
	          othTag = arrayTag;
	
	      if (!objIsArr) {
	        objTag = getTag(object);
	        if (objTag == argsTag) {
	          objTag = objectTag;
	        } else if (objTag != objectTag) {
	          objIsArr = isTypedArray(object);
	        }
	      }
	      if (!othIsArr) {
	        othTag = getTag(other);
	        if (othTag == argsTag) {
	          othTag = objectTag;
	        } else if (othTag != objectTag) {
	          othIsArr = isTypedArray(other);
	        }
	      }
	      var objIsObj = objTag == objectTag && !isHostObject(object),
	          othIsObj = othTag == objectTag && !isHostObject(other),
	          isSameTag = objTag == othTag;
	
	      if (isSameTag && !(objIsArr || objIsObj)) {
	        return equalByTag(object, other, objTag, equalFunc, customizer, bitmask);
	      }
	      var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
	      if (!isPartial) {
	        var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
	            othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');
	
	        if (objIsWrapped || othIsWrapped) {
	          return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, bitmask, stack);
	        }
	      }
	      if (!isSameTag) {
	        return false;
	      }
	      stack || (stack = new Stack);
	      return (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, bitmask, stack);
	    }
	
	    /**
	     * The base implementation of `_.isMatch` without support for iteratee shorthands.
	     *
	     * @private
	     * @param {Object} object The object to inspect.
	     * @param {Object} source The object of property values to match.
	     * @param {Array} matchData The property names, values, and compare flags to match.
	     * @param {Function} [customizer] The function to customize comparisons.
	     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
	     */
	    function baseIsMatch(object, source, matchData, customizer) {
	      var index = matchData.length,
	          length = index,
	          noCustomizer = !customizer;
	
	      if (object == null) {
	        return !length;
	      }
	      object = Object(object);
	      while (index--) {
	        var data = matchData[index];
	        if ((noCustomizer && data[2])
	              ? data[1] !== object[data[0]]
	              : !(data[0] in object)
	            ) {
	          return false;
	        }
	      }
	      while (++index < length) {
	        data = matchData[index];
	        var key = data[0],
	            objValue = object[key],
	            srcValue = data[1];
	
	        if (noCustomizer && data[2]) {
	          if (objValue === undefined && !(key in object)) {
	            return false;
	          }
	        } else {
	          var stack = new Stack,
	              result = customizer ? customizer(objValue, srcValue, key, object, source, stack) : undefined;
	
	          if (!(result === undefined
	                ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack)
	                : result
	              )) {
	            return false;
	          }
	        }
	      }
	      return true;
	    }
	
	    /**
	     * The base implementation of `_.iteratee`.
	     *
	     * @private
	     * @param {*} [value=_.identity] The value to convert to an iteratee.
	     * @returns {Function} Returns the iteratee.
	     */
	    function baseIteratee(value) {
	      var type = typeof value;
	      if (type == 'function') {
	        return value;
	      }
	      if (value == null) {
	        return identity;
	      }
	      if (type == 'object') {
	        return isArray(value)
	          ? baseMatchesProperty(value[0], value[1])
	          : baseMatches(value);
	      }
	      return property(value);
	    }
	
	    /**
	     * The base implementation of `_.keys` which doesn't skip the constructor
	     * property of prototypes or treat sparse arrays as dense.
	     *
	     * @private
	     * @type Function
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the array of property names.
	     */
	    function baseKeys(object) {
	      return nativeKeys(Object(object));
	    }
	
	    /**
	     * The base implementation of `_.keysIn` which doesn't skip the constructor
	     * property of prototypes or treat sparse arrays as dense.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the array of property names.
	     */
	    function baseKeysIn(object) {
	      object = object == null ? object : Object(object);
	
	      var result = [];
	      for (var key in object) {
	        result.push(key);
	      }
	      return result;
	    }
	
	    // Fallback for IE < 9 with es6-shim.
	    if (enumerate && !propertyIsEnumerable.call({ 'valueOf': 1 }, 'valueOf')) {
	      baseKeysIn = function(object) {
	        return iteratorToArray(enumerate(object));
	      };
	    }
	
	    /**
	     * The base implementation of `_.map` without support for iteratee shorthands.
	     *
	     * @private
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Array} Returns the new mapped array.
	     */
	    function baseMap(collection, iteratee) {
	      var index = -1,
	          result = isArrayLike(collection) ? Array(collection.length) : [];
	
	      baseEach(collection, function(value, key, collection) {
	        result[++index] = iteratee(value, key, collection);
	      });
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.matches` which doesn't clone `source`.
	     *
	     * @private
	     * @param {Object} source The object of property values to match.
	     * @returns {Function} Returns the new function.
	     */
	    function baseMatches(source) {
	      var matchData = getMatchData(source);
	      if (matchData.length == 1 && matchData[0][2]) {
	        var key = matchData[0][0],
	            value = matchData[0][1];
	
	        return function(object) {
	          if (object == null) {
	            return false;
	          }
	          return object[key] === value &&
	            (value !== undefined || (key in Object(object)));
	        };
	      }
	      return function(object) {
	        return object === source || baseIsMatch(object, source, matchData);
	      };
	    }
	
	    /**
	     * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
	     *
	     * @private
	     * @param {string} path The path of the property to get.
	     * @param {*} srcValue The value to match.
	     * @returns {Function} Returns the new function.
	     */
	    function baseMatchesProperty(path, srcValue) {
	      return function(object) {
	        var objValue = get(object, path);
	        return (objValue === undefined && objValue === srcValue)
	          ? hasIn(object, path)
	          : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
	      };
	    }
	
	    /**
	     * The base implementation of `_.merge` without support for multiple sources.
	     *
	     * @private
	     * @param {Object} object The destination object.
	     * @param {Object} source The source object.
	     * @param {number} srcIndex The index of `source`.
	     * @param {Function} [customizer] The function to customize merged values.
	     * @param {Object} [stack] Tracks traversed source values and their merged counterparts.
	     */
	    function baseMerge(object, source, srcIndex, customizer, stack) {
	      if (object === source) {
	        return;
	      }
	      var props = (isArray(source) || isTypedArray(source)) ? undefined : keysIn(source);
	      arrayEach(props || source, function(srcValue, key) {
	        if (props) {
	          key = srcValue;
	          srcValue = source[key];
	        }
	        if (isObject(srcValue)) {
	          stack || (stack = new Stack);
	          baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
	        }
	        else {
	          var newValue = customizer ? customizer(object[key], srcValue, (key + ''), object, source, stack) : undefined;
	          if (newValue === undefined) {
	            newValue = srcValue;
	          }
	          assignMergeValue(object, key, newValue);
	        }
	      });
	    }
	
	    /**
	     * A specialized version of `baseMerge` for arrays and objects which performs
	     * deep merges and tracks traversed objects enabling objects with circular
	     * references to be merged.
	     *
	     * @private
	     * @param {Object} object The destination object.
	     * @param {Object} source The source object.
	     * @param {string} key The key of the value to merge.
	     * @param {number} srcIndex The index of `source`.
	     * @param {Function} mergeFunc The function to merge values.
	     * @param {Function} [customizer] The function to customize assigned values.
	     * @param {Object} [stack] Tracks traversed source values and their merged counterparts.
	     */
	    function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
	      var objValue = object[key],
	          srcValue = source[key],
	          stacked = stack.get(srcValue);
	
	      if (stacked) {
	        assignMergeValue(object, key, stacked);
	        return;
	      }
	      var newValue = customizer ? customizer(objValue, srcValue, (key + ''), object, source, stack) : undefined,
	          isCommon = newValue === undefined;
	
	      if (isCommon) {
	        newValue = srcValue;
	        if (isArray(srcValue) || isTypedArray(srcValue)) {
	          if (isArray(objValue)) {
	            newValue = srcIndex ? copyArray(objValue) : objValue;
	          }
	          else if (isArrayLikeObject(objValue)) {
	            newValue = copyArray(objValue);
	          }
	          else {
	            isCommon = false;
	            newValue = baseClone(srcValue);
	          }
	        }
	        else if (isPlainObject(srcValue) || isArguments(srcValue)) {
	          if (isArguments(objValue)) {
	            newValue = toPlainObject(objValue);
	          }
	          else if (!isObject(objValue) || (srcIndex && isFunction(objValue))) {
	            isCommon = false;
	            newValue = baseClone(srcValue);
	          }
	          else {
	            newValue = srcIndex ? baseClone(objValue) : objValue;
	          }
	        }
	        else {
	          isCommon = false;
	        }
	      }
	      stack.set(srcValue, newValue);
	
	      if (isCommon) {
	        // Recursively merge objects and arrays (susceptible to call stack limits).
	        mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
	      }
	      assignMergeValue(object, key, newValue);
	    }
	
	    /**
	     * The base implementation of `_.orderBy` without param guards.
	     *
	     * @private
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
	     * @param {string[]} orders The sort orders of `iteratees`.
	     * @returns {Array} Returns the new sorted array.
	     */
	    function baseOrderBy(collection, iteratees, orders) {
	      var index = -1,
	          toIteratee = getIteratee();
	
	      iteratees = arrayMap(iteratees.length ? iteratees : Array(1), function(iteratee) {
	        return toIteratee(iteratee);
	      });
	
	      var result = baseMap(collection, function(value, key, collection) {
	        var criteria = arrayMap(iteratees, function(iteratee) {
	          return iteratee(value);
	        });
	        return { 'criteria': criteria, 'index': ++index, 'value': value };
	      });
	
	      return baseSortBy(result, function(object, other) {
	        return compareMultiple(object, other, orders);
	      });
	    }
	
	    /**
	     * The base implementation of `_.pick` without support for individual
	     * property names.
	     *
	     * @private
	     * @param {Object} object The source object.
	     * @param {string[]} props The property names to pick.
	     * @returns {Object} Returns the new object.
	     */
	    function basePick(object, props) {
	      object = Object(object);
	      return arrayReduce(props, function(result, key) {
	        if (key in object) {
	          result[key] = object[key];
	        }
	        return result;
	      }, {});
	    }
	
	    /**
	     * The base implementation of  `_.pickBy` without support for iteratee shorthands.
	     *
	     * @private
	     * @param {Object} object The source object.
	     * @param {Function} predicate The function invoked per property.
	     * @returns {Object} Returns the new object.
	     */
	    function basePickBy(object, predicate) {
	      var result = {};
	      baseForIn(object, function(value, key) {
	        if (predicate(value, key)) {
	          result[key] = value;
	        }
	      });
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.property` without support for deep paths.
	     *
	     * @private
	     * @param {string} key The key of the property to get.
	     * @returns {Function} Returns the new function.
	     */
	    function baseProperty(key) {
	      return function(object) {
	        return object == null ? undefined : object[key];
	      };
	    }
	
	    /**
	     * A specialized version of `baseProperty` which supports deep paths.
	     *
	     * @private
	     * @param {Array|string} path The path of the property to get.
	     * @returns {Function} Returns the new function.
	     */
	    function basePropertyDeep(path) {
	      return function(object) {
	        return baseGet(object, path);
	      };
	    }
	
	    /**
	     * The base implementation of `_.pullAll`.
	     *
	     * @private
	     * @param {Array} array The array to modify.
	     * @param {Array} values The values to remove.
	     * @returns {Array} Returns `array`.
	     */
	    function basePullAll(array, values) {
	      return basePullAllBy(array, values);
	    }
	
	    /**
	     * The base implementation of `_.pullAllBy` without support for iteratee
	     * shorthands.
	     *
	     * @private
	     * @param {Array} array The array to modify.
	     * @param {Array} values The values to remove.
	     * @param {Function} [iteratee] The iteratee invoked per element.
	     * @returns {Array} Returns `array`.
	     */
	    function basePullAllBy(array, values, iteratee) {
	      var index = -1,
	          length = values.length,
	          seen = array;
	
	      if (iteratee) {
	        seen = arrayMap(array, function(value) { return iteratee(value); });
	      }
	      while (++index < length) {
	        var fromIndex = 0,
	            value = values[index],
	            computed = iteratee ? iteratee(value) : value;
	
	        while ((fromIndex = baseIndexOf(seen, computed, fromIndex)) > -1) {
	          if (seen !== array) {
	            splice.call(seen, fromIndex, 1);
	          }
	          splice.call(array, fromIndex, 1);
	        }
	      }
	      return array;
	    }
	
	    /**
	     * The base implementation of `_.pullAt` without support for individual
	     * indexes or capturing the removed elements.
	     *
	     * @private
	     * @param {Array} array The array to modify.
	     * @param {number[]} indexes The indexes of elements to remove.
	     * @returns {Array} Returns `array`.
	     */
	    function basePullAt(array, indexes) {
	      var length = array ? indexes.length : 0,
	          lastIndex = length - 1;
	
	      while (length--) {
	        var index = indexes[length];
	        if (lastIndex == length || index != previous) {
	          var previous = index;
	          if (isIndex(index)) {
	            splice.call(array, index, 1);
	          }
	          else if (!isKey(index, array)) {
	            var path = baseToPath(index),
	                object = parent(array, path);
	
	            if (object != null) {
	              delete object[last(path)];
	            }
	          }
	          else {
	            delete array[index];
	          }
	        }
	      }
	      return array;
	    }
	
	    /**
	     * The base implementation of `_.random` without support for returning
	     * floating-point numbers.
	     *
	     * @private
	     * @param {number} lower The lower bound.
	     * @param {number} upper The upper bound.
	     * @returns {number} Returns the random number.
	     */
	    function baseRandom(lower, upper) {
	      return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
	    }
	
	    /**
	     * The base implementation of `_.range` and `_.rangeRight` which doesn't
	     * coerce arguments to numbers.
	     *
	     * @private
	     * @param {number} start The start of the range.
	     * @param {number} end The end of the range.
	     * @param {number} step The value to increment or decrement by.
	     * @param {boolean} [fromRight] Specify iterating from right to left.
	     * @returns {Array} Returns the new array of numbers.
	     */
	    function baseRange(start, end, step, fromRight) {
	      var index = -1,
	          length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
	          result = Array(length);
	
	      while (length--) {
	        result[fromRight ? length : ++index] = start;
	        start += step;
	      }
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.set`.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @param {Array|string} path The path of the property to set.
	     * @param {*} value The value to set.
	     * @param {Function} [customizer] The function to customize path creation.
	     * @returns {Object} Returns `object`.
	     */
	    function baseSet(object, path, value, customizer) {
	      path = isKey(path, object) ? [path + ''] : baseToPath(path);
	
	      var index = -1,
	          length = path.length,
	          lastIndex = length - 1,
	          nested = object;
	
	      while (nested != null && ++index < length) {
	        var key = path[index];
	        if (isObject(nested)) {
	          var newValue = value;
	          if (index != lastIndex) {
	            var objValue = nested[key];
	            newValue = customizer ? customizer(objValue, key, nested) : undefined;
	            if (newValue === undefined) {
	              newValue = objValue == null ? (isIndex(path[index + 1]) ? [] : {}) : objValue;
	            }
	          }
	          assignValue(nested, key, newValue);
	        }
	        nested = nested[key];
	      }
	      return object;
	    }
	
	    /**
	     * The base implementation of `setData` without support for hot loop detection.
	     *
	     * @private
	     * @param {Function} func The function to associate metadata with.
	     * @param {*} data The metadata.
	     * @returns {Function} Returns `func`.
	     */
	    var baseSetData = !metaMap ? identity : function(func, data) {
	      metaMap.set(func, data);
	      return func;
	    };
	
	    /**
	     * The base implementation of `_.slice` without an iteratee call guard.
	     *
	     * @private
	     * @param {Array} array The array to slice.
	     * @param {number} [start=0] The start position.
	     * @param {number} [end=array.length] The end position.
	     * @returns {Array} Returns the slice of `array`.
	     */
	    function baseSlice(array, start, end) {
	      var index = -1,
	          length = array.length;
	
	      if (start < 0) {
	        start = -start > length ? 0 : (length + start);
	      }
	      end = end > length ? length : end;
	      if (end < 0) {
	        end += length;
	      }
	      length = start > end ? 0 : ((end - start) >>> 0);
	      start >>>= 0;
	
	      var result = Array(length);
	      while (++index < length) {
	        result[index] = array[index + start];
	      }
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.some` without support for iteratee shorthands.
	     *
	     * @private
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function} predicate The function invoked per iteration.
	     * @returns {boolean} Returns `true` if any element passes the predicate check, else `false`.
	     */
	    function baseSome(collection, predicate) {
	      var result;
	
	      baseEach(collection, function(value, index, collection) {
	        result = predicate(value, index, collection);
	        return !result;
	      });
	      return !!result;
	    }
	
	    /**
	     * The base implementation of `_.sortedIndex` and `_.sortedLastIndex` which
	     * performs a binary search of `array` to determine the index at which `value`
	     * should be inserted into `array` in order to maintain its sort order.
	     *
	     * @private
	     * @param {Array} array The sorted array to inspect.
	     * @param {*} value The value to evaluate.
	     * @param {boolean} [retHighest] Specify returning the highest qualified index.
	     * @returns {number} Returns the index at which `value` should be inserted
	     *  into `array`.
	     */
	    function baseSortedIndex(array, value, retHighest) {
	      var low = 0,
	          high = array ? array.length : low;
	
	      if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
	        while (low < high) {
	          var mid = (low + high) >>> 1,
	              computed = array[mid];
	
	          if ((retHighest ? (computed <= value) : (computed < value)) && computed !== null) {
	            low = mid + 1;
	          } else {
	            high = mid;
	          }
	        }
	        return high;
	      }
	      return baseSortedIndexBy(array, value, identity, retHighest);
	    }
	
	    /**
	     * The base implementation of `_.sortedIndexBy` and `_.sortedLastIndexBy`
	     * which invokes `iteratee` for `value` and each element of `array` to compute
	     * their sort ranking. The iteratee is invoked with one argument; (value).
	     *
	     * @private
	     * @param {Array} array The sorted array to inspect.
	     * @param {*} value The value to evaluate.
	     * @param {Function} iteratee The iteratee invoked per element.
	     * @param {boolean} [retHighest] Specify returning the highest qualified index.
	     * @returns {number} Returns the index at which `value` should be inserted into `array`.
	     */
	    function baseSortedIndexBy(array, value, iteratee, retHighest) {
	      value = iteratee(value);
	
	      var low = 0,
	          high = array ? array.length : 0,
	          valIsNaN = value !== value,
	          valIsNull = value === null,
	          valIsUndef = value === undefined;
	
	      while (low < high) {
	        var mid = nativeFloor((low + high) / 2),
	            computed = iteratee(array[mid]),
	            isDef = computed !== undefined,
	            isReflexive = computed === computed;
	
	        if (valIsNaN) {
	          var setLow = isReflexive || retHighest;
	        } else if (valIsNull) {
	          setLow = isReflexive && isDef && (retHighest || computed != null);
	        } else if (valIsUndef) {
	          setLow = isReflexive && (retHighest || isDef);
	        } else if (computed == null) {
	          setLow = false;
	        } else {
	          setLow = retHighest ? (computed <= value) : (computed < value);
	        }
	        if (setLow) {
	          low = mid + 1;
	        } else {
	          high = mid;
	        }
	      }
	      return nativeMin(high, MAX_ARRAY_INDEX);
	    }
	
	    /**
	     * The base implementation of `_.sortedUniq`.
	     *
	     * @private
	     * @param {Array} array The array to inspect.
	     * @returns {Array} Returns the new duplicate free array.
	     */
	    function baseSortedUniq(array) {
	      return baseSortedUniqBy(array);
	    }
	
	    /**
	     * The base implementation of `_.sortedUniqBy` without support for iteratee
	     * shorthands.
	     *
	     * @private
	     * @param {Array} array The array to inspect.
	     * @param {Function} [iteratee] The iteratee invoked per element.
	     * @returns {Array} Returns the new duplicate free array.
	     */
	    function baseSortedUniqBy(array, iteratee) {
	      var index = 0,
	          length = array.length,
	          value = array[0],
	          computed = iteratee ? iteratee(value) : value,
	          seen = computed,
	          resIndex = 0,
	          result = [value];
	
	      while (++index < length) {
	        value = array[index],
	        computed = iteratee ? iteratee(value) : value;
	
	        if (!eq(computed, seen)) {
	          seen = computed;
	          result[++resIndex] = value;
	        }
	      }
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.toPath` which only converts `value` to a
	     * path if it's not one.
	     *
	     * @private
	     * @param {*} value The value to process.
	     * @returns {Array} Returns the property path array.
	     */
	    function baseToPath(value) {
	      return isArray(value) ? value : stringToPath(value);
	    }
	
	    /**
	     * The base implementation of `_.uniqBy` without support for iteratee shorthands.
	     *
	     * @private
	     * @param {Array} array The array to inspect.
	     * @param {Function} [iteratee] The iteratee invoked per element.
	     * @param {Function} [comparator] The comparator invoked per element.
	     * @returns {Array} Returns the new duplicate free array.
	     */
	    function baseUniq(array, iteratee, comparator) {
	      var index = -1,
	          includes = arrayIncludes,
	          length = array.length,
	          isCommon = true,
	          result = [],
	          seen = result;
	
	      if (comparator) {
	        isCommon = false;
	        includes = arrayIncludesWith;
	      }
	      else if (length >= LARGE_ARRAY_SIZE) {
	        var set = iteratee ? null : createSet(array);
	        if (set) {
	          return setToArray(set);
	        }
	        isCommon = false;
	        includes = cacheHas;
	        seen = new SetCache;
	      }
	      else {
	        seen = iteratee ? [] : result;
	      }
	      outer:
	      while (++index < length) {
	        var value = array[index],
	            computed = iteratee ? iteratee(value) : value;
	
	        if (isCommon && computed === computed) {
	          var seenIndex = seen.length;
	          while (seenIndex--) {
	            if (seen[seenIndex] === computed) {
	              continue outer;
	            }
	          }
	          if (iteratee) {
	            seen.push(computed);
	          }
	          result.push(value);
	        }
	        else if (!includes(seen, computed, comparator)) {
	          if (seen !== result) {
	            seen.push(computed);
	          }
	          result.push(value);
	        }
	      }
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.unset`.
	     *
	     * @private
	     * @param {Object} object The object to modify.
	     * @param {Array|string} path The path of the property to unset.
	     * @returns {boolean} Returns `true` if the property is deleted, else `false`.
	     */
	    function baseUnset(object, path) {
	      path = isKey(path, object) ? [path + ''] : baseToPath(path);
	      object = parent(object, path);
	      var key = last(path);
	      return (object != null && has(object, key)) ? delete object[key] : true;
	    }
	
	    /**
	     * The base implementation of methods like `_.dropWhile` and `_.takeWhile`
	     * without support for iteratee shorthands.
	     *
	     * @private
	     * @param {Array} array The array to query.
	     * @param {Function} predicate The function invoked per iteration.
	     * @param {boolean} [isDrop] Specify dropping elements instead of taking them.
	     * @param {boolean} [fromRight] Specify iterating from right to left.
	     * @returns {Array} Returns the slice of `array`.
	     */
	    function baseWhile(array, predicate, isDrop, fromRight) {
	      var length = array.length,
	          index = fromRight ? length : -1;
	
	      while ((fromRight ? index-- : ++index < length) &&
	        predicate(array[index], index, array)) {}
	
	      return isDrop
	        ? baseSlice(array, (fromRight ? 0 : index), (fromRight ? index + 1 : length))
	        : baseSlice(array, (fromRight ? index + 1 : 0), (fromRight ? length : index));
	    }
	
	    /**
	     * The base implementation of `wrapperValue` which returns the result of
	     * performing a sequence of actions on the unwrapped `value`, where each
	     * successive action is supplied the return value of the previous.
	     *
	     * @private
	     * @param {*} value The unwrapped value.
	     * @param {Array} actions Actions to perform to resolve the unwrapped value.
	     * @returns {*} Returns the resolved value.
	     */
	    function baseWrapperValue(value, actions) {
	      var result = value;
	      if (result instanceof LazyWrapper) {
	        result = result.value();
	      }
	      return arrayReduce(actions, function(result, action) {
	        return action.func.apply(action.thisArg, arrayPush([result], action.args));
	      }, result);
	    }
	
	    /**
	     * The base implementation of methods like `_.xor`, without support for
	     * iteratee shorthands, that accepts an array of arrays to inspect.
	     *
	     * @private
	     * @param {Array} arrays The arrays to inspect.
	     * @param {Function} [iteratee] The iteratee invoked per element.
	     * @param {Function} [comparator] The comparator invoked per element.
	     * @returns {Array} Returns the new array of values.
	     */
	    function baseXor(arrays, iteratee, comparator) {
	      var index = -1,
	          length = arrays.length;
	
	      while (++index < length) {
	        var result = result
	          ? arrayPush(
	              baseDifference(result, arrays[index], iteratee, comparator),
	              baseDifference(arrays[index], result, iteratee, comparator)
	            )
	          : arrays[index];
	      }
	      return (result && result.length) ? baseUniq(result, iteratee, comparator) : [];
	    }
	
	    /**
	     * This base implementation of `_.zipObject` which assigns values using `assignFunc`.
	     *
	     * @private
	     * @param {Array} props The property names.
	     * @param {Array} values The property values.
	     * @param {Function} assignFunc The function to assign values.
	     * @returns {Object} Returns the new object.
	     */
	    function baseZipObject(props, values, assignFunc) {
	      var index = -1,
	          length = props.length,
	          valsLength = values.length,
	          result = {};
	
	      while (++index < length) {
	        assignFunc(result, props[index], index < valsLength ? values[index] : undefined);
	      }
	      return result;
	    }
	
	    /**
	     * Creates a clone of `buffer`.
	     *
	     * @private
	     * @param {ArrayBuffer} buffer The array buffer to clone.
	     * @returns {ArrayBuffer} Returns the cloned array buffer.
	     */
	    function cloneBuffer(buffer) {
	      var Ctor = buffer.constructor,
	          result = new Ctor(buffer.byteLength),
	          view = new Uint8Array(result);
	
	      view.set(new Uint8Array(buffer));
	      return result;
	    }
	
	    /**
	     * Creates a clone of `map`.
	     *
	     * @private
	     * @param {Object} map The map to clone.
	     * @returns {Object} Returns the cloned map.
	     */
	    function cloneMap(map) {
	      var Ctor = map.constructor;
	      return arrayReduce(mapToArray(map), addMapEntry, new Ctor);
	    }
	
	    /**
	     * Creates a clone of `regexp`.
	     *
	     * @private
	     * @param {Object} regexp The regexp to clone.
	     * @returns {Object} Returns the cloned regexp.
	     */
	    function cloneRegExp(regexp) {
	      var Ctor = regexp.constructor,
	          result = new Ctor(regexp.source, reFlags.exec(regexp));
	
	      result.lastIndex = regexp.lastIndex;
	      return result;
	    }
	
	    /**
	     * Creates a clone of `set`.
	     *
	     * @private
	     * @param {Object} set The set to clone.
	     * @returns {Object} Returns the cloned set.
	     */
	    function cloneSet(set) {
	      var Ctor = set.constructor;
	      return arrayReduce(setToArray(set), addSetEntry, new Ctor);
	    }
	
	    /**
	     * Creates a clone of the `symbol` object.
	     *
	     * @private
	     * @param {Object} symbol The symbol object to clone.
	     * @returns {Object} Returns the cloned symbol object.
	     */
	    function cloneSymbol(symbol) {
	      return Symbol ? Object(symbolValueOf.call(symbol)) : {};
	    }
	
	    /**
	     * Creates a clone of `typedArray`.
	     *
	     * @private
	     * @param {Object} typedArray The typed array to clone.
	     * @param {boolean} [isDeep] Specify a deep clone.
	     * @returns {Object} Returns the cloned typed array.
	     */
	    function cloneTypedArray(typedArray, isDeep) {
	      var buffer = typedArray.buffer,
	          Ctor = typedArray.constructor;
	
	      return new Ctor(isDeep ? cloneBuffer(buffer) : buffer, typedArray.byteOffset, typedArray.length);
	    }
	
	    /**
	     * Creates an array that is the composition of partially applied arguments,
	     * placeholders, and provided arguments into a single array of arguments.
	     *
	     * @private
	     * @param {Array|Object} args The provided arguments.
	     * @param {Array} partials The arguments to prepend to those provided.
	     * @param {Array} holders The `partials` placeholder indexes.
	     * @returns {Array} Returns the new array of composed arguments.
	     */
	    function composeArgs(args, partials, holders) {
	      var holdersLength = holders.length,
	          argsIndex = -1,
	          argsLength = nativeMax(args.length - holdersLength, 0),
	          leftIndex = -1,
	          leftLength = partials.length,
	          result = Array(leftLength + argsLength);
	
	      while (++leftIndex < leftLength) {
	        result[leftIndex] = partials[leftIndex];
	      }
	      while (++argsIndex < holdersLength) {
	        result[holders[argsIndex]] = args[argsIndex];
	      }
	      while (argsLength--) {
	        result[leftIndex++] = args[argsIndex++];
	      }
	      return result;
	    }
	
	    /**
	     * This function is like `composeArgs` except that the arguments composition
	     * is tailored for `_.partialRight`.
	     *
	     * @private
	     * @param {Array|Object} args The provided arguments.
	     * @param {Array} partials The arguments to append to those provided.
	     * @param {Array} holders The `partials` placeholder indexes.
	     * @returns {Array} Returns the new array of composed arguments.
	     */
	    function composeArgsRight(args, partials, holders) {
	      var holdersIndex = -1,
	          holdersLength = holders.length,
	          argsIndex = -1,
	          argsLength = nativeMax(args.length - holdersLength, 0),
	          rightIndex = -1,
	          rightLength = partials.length,
	          result = Array(argsLength + rightLength);
	
	      while (++argsIndex < argsLength) {
	        result[argsIndex] = args[argsIndex];
	      }
	      var offset = argsIndex;
	      while (++rightIndex < rightLength) {
	        result[offset + rightIndex] = partials[rightIndex];
	      }
	      while (++holdersIndex < holdersLength) {
	        result[offset + holders[holdersIndex]] = args[argsIndex++];
	      }
	      return result;
	    }
	
	    /**
	     * Copies the values of `source` to `array`.
	     *
	     * @private
	     * @param {Array} source The array to copy values from.
	     * @param {Array} [array=[]] The array to copy values to.
	     * @returns {Array} Returns `array`.
	     */
	    function copyArray(source, array) {
	      var index = -1,
	          length = source.length;
	
	      array || (array = Array(length));
	      while (++index < length) {
	        array[index] = source[index];
	      }
	      return array;
	    }
	
	    /**
	     * Copies properties of `source` to `object`.
	     *
	     * @private
	     * @param {Object} source The object to copy properties from.
	     * @param {Array} props The property names to copy.
	     * @param {Object} [object={}] The object to copy properties to.
	     * @returns {Object} Returns `object`.
	     */
	    function copyObject(source, props, object) {
	      return copyObjectWith(source, props, object);
	    }
	
	    /**
	     * This function is like `copyObject` except that it accepts a function to
	     * customize copied values.
	     *
	     * @private
	     * @param {Object} source The object to copy properties from.
	     * @param {Array} props The property names to copy.
	     * @param {Object} [object={}] The object to copy properties to.
	     * @param {Function} [customizer] The function to customize copied values.
	     * @returns {Object} Returns `object`.
	     */
	    function copyObjectWith(source, props, object, customizer) {
	      object || (object = {});
	
	      var index = -1,
	          length = props.length;
	
	      while (++index < length) {
	        var key = props[index],
	            newValue = customizer ? customizer(object[key], source[key], key, object, source) : source[key];
	
	        assignValue(object, key, newValue);
	      }
	      return object;
	    }
	
	    /**
	     * Copies own symbol properties of `source` to `object`.
	     *
	     * @private
	     * @param {Object} source The object to copy symbols from.
	     * @param {Object} [object={}] The object to copy symbols to.
	     * @returns {Object} Returns `object`.
	     */
	    function copySymbols(source, object) {
	      return copyObject(source, getSymbols(source), object);
	    }
	
	    /**
	     * Creates a function like `_.groupBy`.
	     *
	     * @private
	     * @param {Function} setter The function to set accumulator values.
	     * @param {Function} [initializer] The accumulator object initializer.
	     * @returns {Function} Returns the new aggregator function.
	     */
	    function createAggregator(setter, initializer) {
	      return function(collection, iteratee) {
	        var func = isArray(collection) ? arrayAggregator : baseAggregator,
	            accumulator = initializer ? initializer() : {};
	
	        return func(collection, setter, getIteratee(iteratee), accumulator);
	      };
	    }
	
	    /**
	     * Creates a function like `_.assign`.
	     *
	     * @private
	     * @param {Function} assigner The function to assign values.
	     * @returns {Function} Returns the new assigner function.
	     */
	    function createAssigner(assigner) {
	      return rest(function(object, sources) {
	        var index = -1,
	            length = sources.length,
	            customizer = length > 1 ? sources[length - 1] : undefined,
	            guard = length > 2 ? sources[2] : undefined;
	
	        customizer = typeof customizer == 'function' ? (length--, customizer) : undefined;
	        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
	          customizer = length < 3 ? undefined : customizer;
	          length = 1;
	        }
	        object = Object(object);
	        while (++index < length) {
	          var source = sources[index];
	          if (source) {
	            assigner(object, source, index, customizer);
	          }
	        }
	        return object;
	      });
	    }
	
	    /**
	     * Creates a `baseEach` or `baseEachRight` function.
	     *
	     * @private
	     * @param {Function} eachFunc The function to iterate over a collection.
	     * @param {boolean} [fromRight] Specify iterating from right to left.
	     * @returns {Function} Returns the new base function.
	     */
	    function createBaseEach(eachFunc, fromRight) {
	      return function(collection, iteratee) {
	        if (collection == null) {
	          return collection;
	        }
	        if (!isArrayLike(collection)) {
	          return eachFunc(collection, iteratee);
	        }
	        var length = collection.length,
	            index = fromRight ? length : -1,
	            iterable = Object(collection);
	
	        while ((fromRight ? index-- : ++index < length)) {
	          if (iteratee(iterable[index], index, iterable) === false) {
	            break;
	          }
	        }
	        return collection;
	      };
	    }
	
	    /**
	     * Creates a base function for methods like `_.forIn`.
	     *
	     * @private
	     * @param {boolean} [fromRight] Specify iterating from right to left.
	     * @returns {Function} Returns the new base function.
	     */
	    function createBaseFor(fromRight) {
	      return function(object, iteratee, keysFunc) {
	        var index = -1,
	            iterable = Object(object),
	            props = keysFunc(object),
	            length = props.length;
	
	        while (length--) {
	          var key = props[fromRight ? length : ++index];
	          if (iteratee(iterable[key], key, iterable) === false) {
	            break;
	          }
	        }
	        return object;
	      };
	    }
	
	    /**
	     * Creates a function that wraps `func` to invoke it with the optional `this`
	     * binding of `thisArg`.
	     *
	     * @private
	     * @param {Function} func The function to wrap.
	     * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` for more details.
	     * @param {*} [thisArg] The `this` binding of `func`.
	     * @returns {Function} Returns the new wrapped function.
	     */
	    function createBaseWrapper(func, bitmask, thisArg) {
	      var isBind = bitmask & BIND_FLAG,
	          Ctor = createCtorWrapper(func);
	
	      function wrapper() {
	        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
	        return fn.apply(isBind ? thisArg : this, arguments);
	      }
	      return wrapper;
	    }
	
	    /**
	     * Creates a function like `_.lowerFirst`.
	     *
	     * @private
	     * @param {string} methodName The name of the `String` case method to use.
	     * @returns {Function} Returns the new function.
	     */
	    function createCaseFirst(methodName) {
	      return function(string) {
	        string = toString(string);
	
	        var strSymbols = reHasComplexSymbol.test(string) ? stringToArray(string) : undefined,
	            chr = strSymbols ? strSymbols[0] : string.charAt(0),
	            trailing = strSymbols ? strSymbols.slice(1).join('') : string.slice(1);
	
	        return chr[methodName]() + trailing;
	      };
	    }
	
	    /**
	     * Creates a function like `_.camelCase`.
	     *
	     * @private
	     * @param {Function} callback The function to combine each word.
	     * @returns {Function} Returns the new compounder function.
	     */
	    function createCompounder(callback) {
	      return function(string) {
	        return arrayReduce(words(deburr(string)), callback, '');
	      };
	    }
	
	    /**
	     * Creates a function that produces an instance of `Ctor` regardless of
	     * whether it was invoked as part of a `new` expression or by `call` or `apply`.
	     *
	     * @private
	     * @param {Function} Ctor The constructor to wrap.
	     * @returns {Function} Returns the new wrapped function.
	     */
	    function createCtorWrapper(Ctor) {
	      return function() {
	        // Use a `switch` statement to work with class constructors.
	        // See http://ecma-international.org/ecma-262/6.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
	        // for more details.
	        var args = arguments;
	        switch (args.length) {
	          case 0: return new Ctor;
	          case 1: return new Ctor(args[0]);
	          case 2: return new Ctor(args[0], args[1]);
	          case 3: return new Ctor(args[0], args[1], args[2]);
	          case 4: return new Ctor(args[0], args[1], args[2], args[3]);
	          case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
	          case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
	          case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
	        }
	        var thisBinding = baseCreate(Ctor.prototype),
	            result = Ctor.apply(thisBinding, args);
	
	        // Mimic the constructor's `return` behavior.
	        // See https://es5.github.io/#x13.2.2 for more details.
	        return isObject(result) ? result : thisBinding;
	      };
	    }
	
	    /**
	     * Creates a function that wraps `func` to enable currying.
	     *
	     * @private
	     * @param {Function} func The function to wrap.
	     * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` for more details.
	     * @param {number} arity The arity of `func`.
	     * @returns {Function} Returns the new wrapped function.
	     */
	    function createCurryWrapper(func, bitmask, arity) {
	      var Ctor = createCtorWrapper(func);
	
	      function wrapper() {
	        var length = arguments.length,
	            index = length,
	            args = Array(length),
	            fn = (this && this !== root && this instanceof wrapper) ? Ctor : func,
	            placeholder = wrapper.placeholder;
	
	        while (index--) {
	          args[index] = arguments[index];
	        }
	        var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
	          ? []
	          : replaceHolders(args, placeholder);
	
	        length -= holders.length;
	        return length < arity
	          ? createRecurryWrapper(func, bitmask, createHybridWrapper, placeholder, undefined, args, holders, undefined, undefined, arity - length)
	          : apply(fn, this, args);
	      }
	      return wrapper;
	    }
	
	    /**
	     * Creates a `_.flow` or `_.flowRight` function.
	     *
	     * @private
	     * @param {boolean} [fromRight] Specify iterating from right to left.
	     * @returns {Function} Returns the new flow function.
	     */
	    function createFlow(fromRight) {
	      return rest(function(funcs) {
	        funcs = baseFlatten(funcs);
	
	        var length = funcs.length,
	            index = length,
	            prereq = LodashWrapper.prototype.thru;
	
	        if (fromRight) {
	          funcs.reverse();
	        }
	        while (index--) {
	          var func = funcs[index];
	          if (typeof func != 'function') {
	            throw new TypeError(FUNC_ERROR_TEXT);
	          }
	          if (prereq && !wrapper && getFuncName(func) == 'wrapper') {
	            var wrapper = new LodashWrapper([], true);
	          }
	        }
	        index = wrapper ? index : length;
	        while (++index < length) {
	          func = funcs[index];
	
	          var funcName = getFuncName(func),
	              data = funcName == 'wrapper' ? getData(func) : undefined;
	
	          if (data && isLaziable(data[0]) && data[1] == (ARY_FLAG | CURRY_FLAG | PARTIAL_FLAG | REARG_FLAG) && !data[4].length && data[9] == 1) {
	            wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
	          } else {
	            wrapper = (func.length == 1 && isLaziable(func)) ? wrapper[funcName]() : wrapper.thru(func);
	          }
	        }
	        return function() {
	          var args = arguments,
	              value = args[0];
	
	          if (wrapper && args.length == 1 && isArray(value) && value.length >= LARGE_ARRAY_SIZE) {
	            return wrapper.plant(value).value();
	          }
	          var index = 0,
	              result = length ? funcs[index].apply(this, args) : value;
	
	          while (++index < length) {
	            result = funcs[index].call(this, result);
	          }
	          return result;
	        };
	      });
	    }
	
	    /**
	     * Creates a function that wraps `func` to invoke it with optional `this`
	     * binding of `thisArg`, partial application, and currying.
	     *
	     * @private
	     * @param {Function|string} func The function or method name to wrap.
	     * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` for more details.
	     * @param {*} [thisArg] The `this` binding of `func`.
	     * @param {Array} [partials] The arguments to prepend to those provided to the new function.
	     * @param {Array} [holders] The `partials` placeholder indexes.
	     * @param {Array} [partialsRight] The arguments to append to those provided to the new function.
	     * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
	     * @param {Array} [argPos] The argument positions of the new function.
	     * @param {number} [ary] The arity cap of `func`.
	     * @param {number} [arity] The arity of `func`.
	     * @returns {Function} Returns the new wrapped function.
	     */
	    function createHybridWrapper(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
	      var isAry = bitmask & ARY_FLAG,
	          isBind = bitmask & BIND_FLAG,
	          isBindKey = bitmask & BIND_KEY_FLAG,
	          isCurry = bitmask & CURRY_FLAG,
	          isCurryRight = bitmask & CURRY_RIGHT_FLAG,
	          isFlip = bitmask & FLIP_FLAG,
	          Ctor = isBindKey ? undefined : createCtorWrapper(func);
	
	      function wrapper() {
	        var length = arguments.length,
	            index = length,
	            args = Array(length);
	
	        while (index--) {
	          args[index] = arguments[index];
	        }
	        if (partials) {
	          args = composeArgs(args, partials, holders);
	        }
	        if (partialsRight) {
	          args = composeArgsRight(args, partialsRight, holdersRight);
	        }
	        if (isCurry || isCurryRight) {
	          var placeholder = wrapper.placeholder,
	              argsHolders = replaceHolders(args, placeholder);
	
	          length -= argsHolders.length;
	          if (length < arity) {
	            return createRecurryWrapper(func, bitmask, createHybridWrapper, placeholder, thisArg, args, argsHolders, argPos, ary, arity - length);
	          }
	        }
	        var thisBinding = isBind ? thisArg : this,
	            fn = isBindKey ? thisBinding[func] : func;
	
	        if (argPos) {
	          args = reorder(args, argPos);
	        } else if (isFlip && args.length > 1) {
	          args.reverse();
	        }
	        if (isAry && ary < args.length) {
	          args.length = ary;
	        }
	        if (this && this !== root && this instanceof wrapper) {
	          fn = Ctor || createCtorWrapper(fn);
	        }
	        return fn.apply(thisBinding, args);
	      }
	      return wrapper;
	    }
	
	    /**
	     * Creates a function like `_.invertBy`.
	     *
	     * @private
	     * @param {Function} setter The function to set accumulator values.
	     * @param {Function} toIteratee The function to resolve iteratees.
	     * @returns {Function} Returns the new inverter function.
	     */
	    function createInverter(setter, toIteratee) {
	      return function(object, iteratee) {
	        return baseInverter(object, setter, toIteratee(iteratee), {});
	      };
	    }
	
	    /**
	     * Creates a function like `_.over`.
	     *
	     * @private
	     * @param {Function} arrayFunc The function to iterate over iteratees.
	     * @returns {Function} Returns the new invoker function.
	     */
	    function createOver(arrayFunc) {
	      return rest(function(iteratees) {
	        iteratees = arrayMap(baseFlatten(iteratees), getIteratee());
	        return rest(function(args) {
	          var thisArg = this;
	          return arrayFunc(iteratees, function(iteratee) {
	            return apply(iteratee, thisArg, args);
	          });
	        });
	      });
	    }
	
	    /**
	     * Creates the padding for `string` based on `length`. The `chars` string
	     * is truncated if the number of characters exceeds `length`.
	     *
	     * @private
	     * @param {string} string The string to create padding for.
	     * @param {number} [length=0] The padding length.
	     * @param {string} [chars=' '] The string used as padding.
	     * @returns {string} Returns the padding for `string`.
	     */
	    function createPadding(string, length, chars) {
	      length = toInteger(length);
	
	      var strLength = stringSize(string);
	      if (!length || strLength >= length) {
	        return '';
	      }
	      var padLength = length - strLength;
	      chars = chars === undefined ? ' ' : (chars + '');
	
	      var result = repeat(chars, nativeCeil(padLength / stringSize(chars)));
	      return reHasComplexSymbol.test(chars)
	        ? stringToArray(result).slice(0, padLength).join('')
	        : result.slice(0, padLength);
	    }
	
	    /**
	     * Creates a function that wraps `func` to invoke it with the optional `this`
	     * binding of `thisArg` and the `partials` prepended to those provided to
	     * the wrapper.
	     *
	     * @private
	     * @param {Function} func The function to wrap.
	     * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` for more details.
	     * @param {*} thisArg The `this` binding of `func`.
	     * @param {Array} partials The arguments to prepend to those provided to the new function.
	     * @returns {Function} Returns the new wrapped function.
	     */
	    function createPartialWrapper(func, bitmask, thisArg, partials) {
	      var isBind = bitmask & BIND_FLAG,
	          Ctor = createCtorWrapper(func);
	
	      function wrapper() {
	        var argsIndex = -1,
	            argsLength = arguments.length,
	            leftIndex = -1,
	            leftLength = partials.length,
	            args = Array(leftLength + argsLength),
	            fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
	
	        while (++leftIndex < leftLength) {
	          args[leftIndex] = partials[leftIndex];
	        }
	        while (argsLength--) {
	          args[leftIndex++] = arguments[++argsIndex];
	        }
	        return apply(fn, isBind ? thisArg : this, args);
	      }
	      return wrapper;
	    }
	
	    /**
	     * Creates a `_.range` or `_.rangeRight` function.
	     *
	     * @private
	     * @param {boolean} [fromRight] Specify iterating from right to left.
	     * @returns {Function} Returns the new range function.
	     */
	    function createRange(fromRight) {
	      return function(start, end, step) {
	        if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
	          end = step = undefined;
	        }
	        // Ensure the sign of `-0` is preserved.
	        start = toNumber(start);
	        start = start === start ? start : 0;
	        if (end === undefined) {
	          end = start;
	          start = 0;
	        } else {
	          end = toNumber(end) || 0;
	        }
	        step = step === undefined ? (start < end ? 1 : -1) : (toNumber(step) || 0);
	        return baseRange(start, end, step, fromRight);
	      };
	    }
	
	    /**
	     * Creates a function that wraps `func` to continue currying.
	     *
	     * @private
	     * @param {Function} func The function to wrap.
	     * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` for more details.
	     * @param {Function} wrapFunc The function to create the `func` wrapper.
	     * @param {*} placeholder The placeholder to replace.
	     * @param {*} [thisArg] The `this` binding of `func`.
	     * @param {Array} [partials] The arguments to prepend to those provided to the new function.
	     * @param {Array} [holders] The `partials` placeholder indexes.
	     * @param {Array} [argPos] The argument positions of the new function.
	     * @param {number} [ary] The arity cap of `func`.
	     * @param {number} [arity] The arity of `func`.
	     * @returns {Function} Returns the new wrapped function.
	     */
	    function createRecurryWrapper(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
	      var isCurry = bitmask & CURRY_FLAG,
	          newArgPos = argPos ? copyArray(argPos) : undefined,
	          newsHolders = isCurry ? holders : undefined,
	          newHoldersRight = isCurry ? undefined : holders,
	          newPartials = isCurry ? partials : undefined,
	          newPartialsRight = isCurry ? undefined : partials;
	
	      bitmask |= (isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG);
	      bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);
	
	      if (!(bitmask & CURRY_BOUND_FLAG)) {
	        bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG);
	      }
	      var newData = [func, bitmask, thisArg, newPartials, newsHolders, newPartialsRight, newHoldersRight, newArgPos, ary, arity],
	          result = wrapFunc.apply(undefined, newData);
	
	      if (isLaziable(func)) {
	        setData(result, newData);
	      }
	      result.placeholder = placeholder;
	      return result;
	    }
	
	    /**
	     * Creates a function like `_.round`.
	     *
	     * @private
	     * @param {string} methodName The name of the `Math` method to use when rounding.
	     * @returns {Function} Returns the new round function.
	     */
	    function createRound(methodName) {
	      var func = Math[methodName];
	      return function(number, precision) {
	        number = toNumber(number);
	        precision = toInteger(precision);
	        if (precision) {
	          // Shift with exponential notation to avoid floating-point issues.
	          // See [MDN](https://mdn.io/round#Examples) for more details.
	          var pair = (toString(number) + 'e').split('e'),
	              value = func(pair[0] + 'e' + (+pair[1] + precision));
	
	          pair = (toString(value) + 'e').split('e');
	          return +(pair[0] + 'e' + (+pair[1] - precision));
	        }
	        return func(number);
	      };
	    }
	
	    /**
	     * Creates a set of `values`.
	     *
	     * @private
	     * @param {Array} values The values to add to the set.
	     * @returns {Object} Returns the new set.
	     */
	    var createSet = !(Set && new Set([1, 2]).size === 2) ? noop : function(values) {
	      return new Set(values);
	    };
	
	    /**
	     * Creates a function that either curries or invokes `func` with optional
	     * `this` binding and partially applied arguments.
	     *
	     * @private
	     * @param {Function|string} func The function or method name to wrap.
	     * @param {number} bitmask The bitmask of wrapper flags.
	     *  The bitmask may be composed of the following flags:
	     *     1 - `_.bind`
	     *     2 - `_.bindKey`
	     *     4 - `_.curry` or `_.curryRight` of a bound function
	     *     8 - `_.curry`
	     *    16 - `_.curryRight`
	     *    32 - `_.partial`
	     *    64 - `_.partialRight`
	     *   128 - `_.rearg`
	     *   256 - `_.ary`
	     * @param {*} [thisArg] The `this` binding of `func`.
	     * @param {Array} [partials] The arguments to be partially applied.
	     * @param {Array} [holders] The `partials` placeholder indexes.
	     * @param {Array} [argPos] The argument positions of the new function.
	     * @param {number} [ary] The arity cap of `func`.
	     * @param {number} [arity] The arity of `func`.
	     * @returns {Function} Returns the new wrapped function.
	     */
	    function createWrapper(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
	      var isBindKey = bitmask & BIND_KEY_FLAG;
	      if (!isBindKey && typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      var length = partials ? partials.length : 0;
	      if (!length) {
	        bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG);
	        partials = holders = undefined;
	      }
	      ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0);
	      arity = arity === undefined ? arity : toInteger(arity);
	      length -= holders ? holders.length : 0;
	
	      if (bitmask & PARTIAL_RIGHT_FLAG) {
	        var partialsRight = partials,
	            holdersRight = holders;
	
	        partials = holders = undefined;
	      }
	      var data = isBindKey ? undefined : getData(func),
	          newData = [func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity];
	
	      if (data) {
	        mergeData(newData, data);
	      }
	      func = newData[0];
	      bitmask = newData[1];
	      thisArg = newData[2];
	      partials = newData[3];
	      holders = newData[4];
	      arity = newData[9] = newData[9] == null
	        ? (isBindKey ? 0 : func.length)
	        : nativeMax(newData[9] - length, 0);
	
	      if (!arity && bitmask & (CURRY_FLAG | CURRY_RIGHT_FLAG)) {
	        bitmask &= ~(CURRY_FLAG | CURRY_RIGHT_FLAG);
	      }
	      if (!bitmask || bitmask == BIND_FLAG) {
	        var result = createBaseWrapper(func, bitmask, thisArg);
	      } else if (bitmask == CURRY_FLAG || bitmask == CURRY_RIGHT_FLAG) {
	        result = createCurryWrapper(func, bitmask, arity);
	      } else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !holders.length) {
	        result = createPartialWrapper(func, bitmask, thisArg, partials);
	      } else {
	        result = createHybridWrapper.apply(undefined, newData);
	      }
	      var setter = data ? baseSetData : setData;
	      return setter(result, newData);
	    }
	
	    /**
	     * A specialized version of `baseIsEqualDeep` for arrays with support for
	     * partial deep comparisons.
	     *
	     * @private
	     * @param {Array} array The array to compare.
	     * @param {Array} other The other array to compare.
	     * @param {Function} equalFunc The function to determine equivalents of values.
	     * @param {Function} [customizer] The function to customize comparisons.
	     * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual` for more details.
	     * @param {Object} [stack] Tracks traversed `array` and `other` objects.
	     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
	     */
	    function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
	      var index = -1,
	          isPartial = bitmask & PARTIAL_COMPARE_FLAG,
	          isUnordered = bitmask & UNORDERED_COMPARE_FLAG,
	          arrLength = array.length,
	          othLength = other.length;
	
	      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
	        return false;
	      }
	      // Assume cyclic values are equal.
	      var stacked = stack.get(array);
	      if (stacked) {
	        return stacked == other;
	      }
	      var result = true;
	      stack.set(array, other);
	
	      // Ignore non-index properties.
	      while (++index < arrLength) {
	        var arrValue = array[index],
	            othValue = other[index];
	
	        if (customizer) {
	          var compared = isPartial
	            ? customizer(othValue, arrValue, index, other, array, stack)
	            : customizer(arrValue, othValue, index, array, other, stack);
	        }
	        if (compared !== undefined) {
	          if (compared) {
	            continue;
	          }
	          result = false;
	          break;
	        }
	        // Recursively compare arrays (susceptible to call stack limits).
	        if (isUnordered) {
	          if (!arraySome(other, function(othValue) {
	                return arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack);
	              })) {
	            result = false;
	            break;
	          }
	        } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
	          result = false;
	          break;
	        }
	      }
	      stack['delete'](array);
	      return result;
	    }
	
	    /**
	     * A specialized version of `baseIsEqualDeep` for comparing objects of
	     * the same `toStringTag`.
	     *
	     * **Note:** This function only supports comparing values with tags of
	     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	     *
	     * @private
	     * @param {Object} object The object to compare.
	     * @param {Object} other The other object to compare.
	     * @param {string} tag The `toStringTag` of the objects to compare.
	     * @param {Function} equalFunc The function to determine equivalents of values.
	     * @param {Function} [customizer] The function to customize comparisons.
	     * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual` for more details.
	     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	     */
	    function equalByTag(object, other, tag, equalFunc, customizer, bitmask) {
	      switch (tag) {
	        case arrayBufferTag:
	          if ((object.byteLength != other.byteLength) ||
	              !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
	            return false;
	          }
	          return true;
	
	        case boolTag:
	        case dateTag:
	          // Coerce dates and booleans to numbers, dates to milliseconds and booleans
	          // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
	          return +object == +other;
	
	        case errorTag:
	          return object.name == other.name && object.message == other.message;
	
	        case numberTag:
	          // Treat `NaN` vs. `NaN` as equal.
	          return (object != +object) ? other != +other : object == +other;
	
	        case regexpTag:
	        case stringTag:
	          // Coerce regexes to strings and treat strings primitives and string
	          // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
	          return object == (other + '');
	
	        case mapTag:
	          var convert = mapToArray;
	
	        case setTag:
	          var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
	          convert || (convert = setToArray);
	
	          // Recursively compare objects (susceptible to call stack limits).
	          return (isPartial || object.size == other.size) &&
	            equalFunc(convert(object), convert(other), customizer, bitmask | UNORDERED_COMPARE_FLAG);
	
	        case symbolTag:
	          return !!Symbol && (symbolValueOf.call(object) == symbolValueOf.call(other));
	      }
	      return false;
	    }
	
	    /**
	     * A specialized version of `baseIsEqualDeep` for objects with support for
	     * partial deep comparisons.
	     *
	     * @private
	     * @param {Object} object The object to compare.
	     * @param {Object} other The other object to compare.
	     * @param {Function} equalFunc The function to determine equivalents of values.
	     * @param {Function} [customizer] The function to customize comparisons.
	     * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual` for more details.
	     * @param {Object} [stack] Tracks traversed `object` and `other` objects.
	     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	     */
	    function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
	      var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
	          objProps = keys(object),
	          objLength = objProps.length,
	          othProps = keys(other),
	          othLength = othProps.length;
	
	      if (objLength != othLength && !isPartial) {
	        return false;
	      }
	      var index = objLength;
	      while (index--) {
	        var key = objProps[index];
	        if (!(isPartial ? key in other : baseHas(other, key))) {
	          return false;
	        }
	      }
	      // Assume cyclic values are equal.
	      var stacked = stack.get(object);
	      if (stacked) {
	        return stacked == other;
	      }
	      var result = true;
	      stack.set(object, other);
	
	      var skipCtor = isPartial;
	      while (++index < objLength) {
	        key = objProps[index];
	        var objValue = object[key],
	            othValue = other[key];
	
	        if (customizer) {
	          var compared = isPartial
	            ? customizer(othValue, objValue, key, other, object, stack)
	            : customizer(objValue, othValue, key, object, other, stack);
	        }
	        // Recursively compare objects (susceptible to call stack limits).
	        if (!(compared === undefined
	              ? (objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack))
	              : compared
	            )) {
	          result = false;
	          break;
	        }
	        skipCtor || (skipCtor = key == 'constructor');
	      }
	      if (result && !skipCtor) {
	        var objCtor = object.constructor,
	            othCtor = other.constructor;
	
	        // Non `Object` object instances with different constructors are not equal.
	        if (objCtor != othCtor &&
	            ('constructor' in object && 'constructor' in other) &&
	            !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
	              typeof othCtor == 'function' && othCtor instanceof othCtor)) {
	          result = false;
	        }
	      }
	      stack['delete'](object);
	      return result;
	    }
	
	    /**
	     * Gets metadata for `func`.
	     *
	     * @private
	     * @param {Function} func The function to query.
	     * @returns {*} Returns the metadata for `func`.
	     */
	    var getData = !metaMap ? noop : function(func) {
	      return metaMap.get(func);
	    };
	
	    /**
	     * Gets the name of `func`.
	     *
	     * @private
	     * @param {Function} func The function to query.
	     * @returns {string} Returns the function name.
	     */
	    function getFuncName(func) {
	      var result = (func.name + ''),
	          array = realNames[result],
	          length = hasOwnProperty.call(realNames, result) ? array.length : 0;
	
	      while (length--) {
	        var data = array[length],
	            otherFunc = data.func;
	        if (otherFunc == null || otherFunc == func) {
	          return data.name;
	        }
	      }
	      return result;
	    }
	
	    /**
	     * Gets the appropriate "iteratee" function. If the `_.iteratee` method is
	     * customized this function returns the custom method, otherwise it returns
	     * `baseIteratee`. If arguments are provided the chosen function is invoked
	     * with them and its result is returned.
	     *
	     * @private
	     * @param {*} [value] The value to convert to an iteratee.
	     * @param {number} [arity] The arity of the created iteratee.
	     * @returns {Function} Returns the chosen function or its result.
	     */
	    function getIteratee() {
	      var result = lodash.iteratee || iteratee;
	      result = result === iteratee ? baseIteratee : result;
	      return arguments.length ? result(arguments[0], arguments[1]) : result;
	    }
	
	    /**
	     * Gets the "length" property value of `object`.
	     *
	     * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
	     * that affects Safari on at least iOS 8.1-8.3 ARM64.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @returns {*} Returns the "length" value.
	     */
	    var getLength = baseProperty('length');
	
	    /**
	     * Gets the property names, values, and compare flags of `object`.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the match data of `object`.
	     */
	    function getMatchData(object) {
	      var result = toPairs(object),
	          length = result.length;
	
	      while (length--) {
	        result[length][2] = isStrictComparable(result[length][1]);
	      }
	      return result;
	    }
	
	    /**
	     * Gets the native function at `key` of `object`.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @param {string} key The key of the method to get.
	     * @returns {*} Returns the function if it's native, else `undefined`.
	     */
	    function getNative(object, key) {
	      var value = object == null ? undefined : object[key];
	      return isNative(value) ? value : undefined;
	    }
	
	    /**
	     * Creates an array of the own symbol properties of `object`.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the array of symbols.
	     */
	    var getSymbols = getOwnPropertySymbols || function() {
	      return [];
	    };
	
	    /**
	     * Gets the `toStringTag` of `value`.
	     *
	     * @private
	     * @param {*} value The value to query.
	     * @returns {string} Returns the `toStringTag`.
	     */
	    function getTag(value) {
	      return objectToString.call(value);
	    }
	
	    // Fallback for IE 11 providing `toStringTag` values for maps and sets.
	    if ((Map && getTag(new Map) != mapTag) || (Set && getTag(new Set) != setTag)) {
	      getTag = function(value) {
	        var result = objectToString.call(value),
	            Ctor = result == objectTag ? value.constructor : null,
	            ctorString = typeof Ctor == 'function' ? funcToString.call(Ctor) : '';
	
	        if (ctorString) {
	          if (ctorString == mapCtorString) {
	            return mapTag;
	          }
	          if (ctorString == setCtorString) {
	            return setTag;
	          }
	        }
	        return result;
	      };
	    }
	
	    /**
	     * Gets the view, applying any `transforms` to the `start` and `end` positions.
	     *
	     * @private
	     * @param {number} start The start of the view.
	     * @param {number} end The end of the view.
	     * @param {Array} transforms The transformations to apply to the view.
	     * @returns {Object} Returns an object containing the `start` and `end`
	     *  positions of the view.
	     */
	    function getView(start, end, transforms) {
	      var index = -1,
	          length = transforms.length;
	
	      while (++index < length) {
	        var data = transforms[index],
	            size = data.size;
	
	        switch (data.type) {
	          case 'drop':      start += size; break;
	          case 'dropRight': end -= size; break;
	          case 'take':      end = nativeMin(end, start + size); break;
	          case 'takeRight': start = nativeMax(start, end - size); break;
	        }
	      }
	      return { 'start': start, 'end': end };
	    }
	
	    /**
	     * Checks if `path` exists on `object`.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @param {Array|string} path The path to check.
	     * @param {Function} hasFunc The function to check properties.
	     * @returns {boolean} Returns `true` if `path` exists, else `false`.
	     */
	    function hasPath(object, path, hasFunc) {
	      if (object == null) {
	        return false;
	      }
	      var result = hasFunc(object, path);
	      if (!result && !isKey(path)) {
	        path = baseToPath(path);
	        object = parent(object, path);
	        if (object != null) {
	          path = last(path);
	          result = hasFunc(object, path);
	        }
	      }
	      var length = object ? object.length : undefined;
	      return result || (
	        !!length && isLength(length) && isIndex(path, length) &&
	        (isArray(object) || isString(object) || isArguments(object))
	      );
	    }
	
	    /**
	     * Initializes an array clone.
	     *
	     * @private
	     * @param {Array} array The array to clone.
	     * @returns {Array} Returns the initialized clone.
	     */
	    function initCloneArray(array) {
	      var length = array.length,
	          result = array.constructor(length);
	
	      // Add properties assigned by `RegExp#exec`.
	      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
	        result.index = array.index;
	        result.input = array.input;
	      }
	      return result;
	    }
	
	    /**
	     * Initializes an object clone.
	     *
	     * @private
	     * @param {Object} object The object to clone.
	     * @returns {Object} Returns the initialized clone.
	     */
	    function initCloneObject(object) {
	      if (isPrototype(object)) {
	        return {};
	      }
	      var Ctor = object.constructor;
	      return baseCreate(isFunction(Ctor) ? Ctor.prototype : undefined);
	    }
	
	    /**
	     * Initializes an object clone based on its `toStringTag`.
	     *
	     * **Note:** This function only supports cloning values with tags of
	     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	     *
	     * @private
	     * @param {Object} object The object to clone.
	     * @param {string} tag The `toStringTag` of the object to clone.
	     * @param {boolean} [isDeep] Specify a deep clone.
	     * @returns {Object} Returns the initialized clone.
	     */
	    function initCloneByTag(object, tag, isDeep) {
	      var Ctor = object.constructor;
	      switch (tag) {
	        case arrayBufferTag:
	          return cloneBuffer(object);
	
	        case boolTag:
	        case dateTag:
	          return new Ctor(+object);
	
	        case float32Tag: case float64Tag:
	        case int8Tag: case int16Tag: case int32Tag:
	        case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
	          return cloneTypedArray(object, isDeep);
	
	        case mapTag:
	          return cloneMap(object);
	
	        case numberTag:
	        case stringTag:
	          return new Ctor(object);
	
	        case regexpTag:
	          return cloneRegExp(object);
	
	        case setTag:
	          return cloneSet(object);
	
	        case symbolTag:
	          return cloneSymbol(object);
	      }
	    }
	
	    /**
	     * Creates an array of index keys for `object` values of arrays,
	     * `arguments` objects, and strings, otherwise `null` is returned.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @returns {Array|null} Returns index keys, else `null`.
	     */
	    function indexKeys(object) {
	      var length = object ? object.length : undefined;
	      if (isLength(length) &&
	          (isArray(object) || isString(object) || isArguments(object))) {
	        return baseTimes(length, String);
	      }
	      return null;
	    }
	
	    /**
	     * Checks if the provided arguments are from an iteratee call.
	     *
	     * @private
	     * @param {*} value The potential iteratee value argument.
	     * @param {*} index The potential iteratee index or key argument.
	     * @param {*} object The potential iteratee object argument.
	     * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
	     */
	    function isIterateeCall(value, index, object) {
	      if (!isObject(object)) {
	        return false;
	      }
	      var type = typeof index;
	      if (type == 'number'
	          ? (isArrayLike(object) && isIndex(index, object.length))
	          : (type == 'string' && index in object)) {
	        return eq(object[index], value);
	      }
	      return false;
	    }
	
	    /**
	     * Checks if `value` is a property name and not a property path.
	     *
	     * @private
	     * @param {*} value The value to check.
	     * @param {Object} [object] The object to query keys on.
	     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
	     */
	    function isKey(value, object) {
	      if (typeof value == 'number') {
	        return true;
	      }
	      return !isArray(value) &&
	        (reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
	          (object != null && value in Object(object)));
	    }
	
	    /**
	     * Checks if `value` is suitable for use as unique object key.
	     *
	     * @private
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	     */
	    function isKeyable(value) {
	      var type = typeof value;
	      return type == 'number' || type == 'boolean' ||
	        (type == 'string' && value !== '__proto__') || value == null;
	    }
	
	    /**
	     * Checks if `func` has a lazy counterpart.
	     *
	     * @private
	     * @param {Function} func The function to check.
	     * @returns {boolean} Returns `true` if `func` has a lazy counterpart, else `false`.
	     */
	    function isLaziable(func) {
	      var funcName = getFuncName(func),
	          other = lodash[funcName];
	
	      if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
	        return false;
	      }
	      if (func === other) {
	        return true;
	      }
	      var data = getData(other);
	      return !!data && func === data[0];
	    }
	
	    /**
	     * Checks if `value` is likely a prototype object.
	     *
	     * @private
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	     */
	    function isPrototype(value) {
	      var Ctor = value && value.constructor,
	          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;
	
	      return value === proto;
	    }
	
	    /**
	     * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
	     *
	     * @private
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` if suitable for strict
	     *  equality comparisons, else `false`.
	     */
	    function isStrictComparable(value) {
	      return value === value && !isObject(value);
	    }
	
	    /**
	     * Merges the function metadata of `source` into `data`.
	     *
	     * Merging metadata reduces the number of wrappers used to invoke a function.
	     * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
	     * may be applied regardless of execution order. Methods like `_.ary` and `_.rearg`
	     * modify function arguments, making the order in which they are executed important,
	     * preventing the merging of metadata. However, we make an exception for a safe
	     * combined case where curried functions have `_.ary` and or `_.rearg` applied.
	     *
	     * @private
	     * @param {Array} data The destination metadata.
	     * @param {Array} source The source metadata.
	     * @returns {Array} Returns `data`.
	     */
	    function mergeData(data, source) {
	      var bitmask = data[1],
	          srcBitmask = source[1],
	          newBitmask = bitmask | srcBitmask,
	          isCommon = newBitmask < (BIND_FLAG | BIND_KEY_FLAG | ARY_FLAG);
	
	      var isCombo =
	        (srcBitmask == ARY_FLAG && (bitmask == CURRY_FLAG)) ||
	        (srcBitmask == ARY_FLAG && (bitmask == REARG_FLAG) && (data[7].length <= source[8])) ||
	        (srcBitmask == (ARY_FLAG | REARG_FLAG) && (source[7].length <= source[8]) && (bitmask == CURRY_FLAG));
	
	      // Exit early if metadata can't be merged.
	      if (!(isCommon || isCombo)) {
	        return data;
	      }
	      // Use source `thisArg` if available.
	      if (srcBitmask & BIND_FLAG) {
	        data[2] = source[2];
	        // Set when currying a bound function.
	        newBitmask |= (bitmask & BIND_FLAG) ? 0 : CURRY_BOUND_FLAG;
	      }
	      // Compose partial arguments.
	      var value = source[3];
	      if (value) {
	        var partials = data[3];
	        data[3] = partials ? composeArgs(partials, value, source[4]) : copyArray(value);
	        data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : copyArray(source[4]);
	      }
	      // Compose partial right arguments.
	      value = source[5];
	      if (value) {
	        partials = data[5];
	        data[5] = partials ? composeArgsRight(partials, value, source[6]) : copyArray(value);
	        data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : copyArray(source[6]);
	      }
	      // Use source `argPos` if available.
	      value = source[7];
	      if (value) {
	        data[7] = copyArray(value);
	      }
	      // Use source `ary` if it's smaller.
	      if (srcBitmask & ARY_FLAG) {
	        data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
	      }
	      // Use source `arity` if one is not provided.
	      if (data[9] == null) {
	        data[9] = source[9];
	      }
	      // Use source `func` and merge bitmasks.
	      data[0] = source[0];
	      data[1] = newBitmask;
	
	      return data;
	    }
	
	    /**
	     * Used by `_.defaultsDeep` to customize its `_.merge` use.
	     *
	     * @private
	     * @param {*} objValue The destination value.
	     * @param {*} srcValue The source value.
	     * @param {string} key The key of the property to merge.
	     * @param {Object} object The parent object of `objValue`.
	     * @param {Object} source The parent object of `srcValue`.
	     * @param {Object} [stack] Tracks traversed source values and their merged counterparts.
	     * @returns {*} Returns the value to assign.
	     */
	    function mergeDefaults(objValue, srcValue, key, object, source, stack) {
	      if (isObject(objValue) && isObject(srcValue)) {
	        stack.set(srcValue, objValue);
	        baseMerge(objValue, srcValue, undefined, mergeDefaults, stack);
	      }
	      return objValue;
	    }
	
	    /**
	     * Gets the parent value at `path` of `object`.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @param {Array} path The path to get the parent value of.
	     * @returns {*} Returns the parent value.
	     */
	    function parent(object, path) {
	      return path.length == 1 ? object : get(object, baseSlice(path, 0, -1));
	    }
	
	    /**
	     * Reorder `array` according to the specified indexes where the element at
	     * the first index is assigned as the first element, the element at
	     * the second index is assigned as the second element, and so on.
	     *
	     * @private
	     * @param {Array} array The array to reorder.
	     * @param {Array} indexes The arranged array indexes.
	     * @returns {Array} Returns `array`.
	     */
	    function reorder(array, indexes) {
	      var arrLength = array.length,
	          length = nativeMin(indexes.length, arrLength),
	          oldArray = copyArray(array);
	
	      while (length--) {
	        var index = indexes[length];
	        array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
	      }
	      return array;
	    }
	
	    /**
	     * Sets metadata for `func`.
	     *
	     * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
	     * period of time, it will trip its breaker and transition to an identity function
	     * to avoid garbage collection pauses in V8. See [V8 issue 2070](https://code.google.com/p/v8/issues/detail?id=2070)
	     * for more details.
	     *
	     * @private
	     * @param {Function} func The function to associate metadata with.
	     * @param {*} data The metadata.
	     * @returns {Function} Returns `func`.
	     */
	    var setData = (function() {
	      var count = 0,
	          lastCalled = 0;
	
	      return function(key, value) {
	        var stamp = now(),
	            remaining = HOT_SPAN - (stamp - lastCalled);
	
	        lastCalled = stamp;
	        if (remaining > 0) {
	          if (++count >= HOT_COUNT) {
	            return key;
	          }
	        } else {
	          count = 0;
	        }
	        return baseSetData(key, value);
	      };
	    }());
	
	    /**
	     * Converts `string` to a property path array.
	     *
	     * @private
	     * @param {string} string The string to convert.
	     * @returns {Array} Returns the property path array.
	     */
	    function stringToPath(string) {
	      var result = [];
	      toString(string).replace(rePropName, function(match, number, quote, string) {
	        result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
	      });
	      return result;
	    }
	
	    /**
	     * Converts `value` to an array-like object if it's not one.
	     *
	     * @private
	     * @param {*} value The value to process.
	     * @returns {Array} Returns the array-like object.
	     */
	    function toArrayLikeObject(value) {
	      return isArrayLikeObject(value) ? value : [];
	    }
	
	    /**
	     * Converts `value` to a function if it's not one.
	     *
	     * @private
	     * @param {*} value The value to process.
	     * @returns {Function} Returns the function.
	     */
	    function toFunction(value) {
	      return typeof value == 'function' ? value : identity;
	    }
	
	    /**
	     * Creates a clone of `wrapper`.
	     *
	     * @private
	     * @param {Object} wrapper The wrapper to clone.
	     * @returns {Object} Returns the cloned wrapper.
	     */
	    function wrapperClone(wrapper) {
	      if (wrapper instanceof LazyWrapper) {
	        return wrapper.clone();
	      }
	      var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
	      result.__actions__ = copyArray(wrapper.__actions__);
	      result.__index__  = wrapper.__index__;
	      result.__values__ = wrapper.__values__;
	      return result;
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Creates an array of elements split into groups the length of `size`.
	     * If `array` can't be split evenly, the final chunk will be the remaining
	     * elements.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to process.
	     * @param {number} [size=0] The length of each chunk.
	     * @returns {Array} Returns the new array containing chunks.
	     * @example
	     *
	     * _.chunk(['a', 'b', 'c', 'd'], 2);
	     * // => [['a', 'b'], ['c', 'd']]
	     *
	     * _.chunk(['a', 'b', 'c', 'd'], 3);
	     * // => [['a', 'b', 'c'], ['d']]
	     */
	    function chunk(array, size) {
	      size = nativeMax(toInteger(size), 0);
	
	      var length = array ? array.length : 0;
	      if (!length || size < 1) {
	        return [];
	      }
	      var index = 0,
	          resIndex = -1,
	          result = Array(nativeCeil(length / size));
	
	      while (index < length) {
	        result[++resIndex] = baseSlice(array, index, (index += size));
	      }
	      return result;
	    }
	
	    /**
	     * Creates an array with all falsey values removed. The values `false`, `null`,
	     * `0`, `""`, `undefined`, and `NaN` are falsey.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to compact.
	     * @returns {Array} Returns the new array of filtered values.
	     * @example
	     *
	     * _.compact([0, 1, false, 2, '', 3]);
	     * // => [1, 2, 3]
	     */
	    function compact(array) {
	      var index = -1,
	          length = array ? array.length : 0,
	          resIndex = -1,
	          result = [];
	
	      while (++index < length) {
	        var value = array[index];
	        if (value) {
	          result[++resIndex] = value;
	        }
	      }
	      return result;
	    }
	
	    /**
	     * Creates a new array concatenating `array` with any additional arrays
	     * and/or values.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to concatenate.
	     * @param {...*} [values] The values to concatenate.
	     * @returns {Array} Returns the new concatenated array.
	     * @example
	     *
	     * var array = [1];
	     * var other = _.concat(array, 2, [3], [[4]]);
	     *
	     * console.log(other);
	     * // => [1, 2, 3, [4]]
	     *
	     * console.log(array);
	     * // => [1]
	     */
	    var concat = rest(function(array, values) {
	      if (!isArray(array)) {
	        array = array == null ? [] : [Object(array)];
	      }
	      values = baseFlatten(values);
	      return arrayConcat(array, values);
	    });
	
	    /**
	     * Creates an array of unique `array` values not included in the other
	     * provided arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	     * for equality comparisons.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to inspect.
	     * @param {...Array} [values] The values to exclude.
	     * @returns {Array} Returns the new array of filtered values.
	     * @example
	     *
	     * _.difference([3, 2, 1], [4, 2]);
	     * // => [3, 1]
	     */
	    var difference = rest(function(array, values) {
	      return isArrayLikeObject(array)
	        ? baseDifference(array, baseFlatten(values, false, true))
	        : [];
	    });
	
	    /**
	     * This method is like `_.difference` except that it accepts `iteratee` which
	     * is invoked for each element of `array` and `values` to generate the criterion
	     * by which uniqueness is computed. The iteratee is invoked with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to inspect.
	     * @param {...Array} [values] The values to exclude.
	     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
	     * @returns {Array} Returns the new array of filtered values.
	     * @example
	     *
	     * _.differenceBy([3.1, 2.2, 1.3], [4.4, 2.5], Math.floor);
	     * // => [3.1, 1.3]
	     *
	     * // using the `_.property` iteratee shorthand
	     * _.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x');
	     * // => [{ 'x': 2 }]
	     */
	    var differenceBy = rest(function(array, values) {
	      var iteratee = last(values);
	      if (isArrayLikeObject(iteratee)) {
	        iteratee = undefined;
	      }
	      return isArrayLikeObject(array)
	        ? baseDifference(array, baseFlatten(values, false, true), getIteratee(iteratee))
	        : [];
	    });
	
	    /**
	     * This method is like `_.difference` except that it accepts `comparator`
	     * which is invoked to compare elements of `array` to `values`. The comparator
	     * is invoked with two arguments: (arrVal, othVal).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to inspect.
	     * @param {...Array} [values] The values to exclude.
	     * @param {Function} [comparator] The comparator invoked per element.
	     * @returns {Array} Returns the new array of filtered values.
	     * @example
	     *
	     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
	     *
	     * _.differenceWith(objects, [{ 'x': 1, 'y': 2 }], _.isEqual);
	     * // => [{ 'x': 2, 'y': 1 }]
	     */
	    var differenceWith = rest(function(array, values) {
	      var comparator = last(values);
	      if (isArrayLikeObject(comparator)) {
	        comparator = undefined;
	      }
	      return isArrayLikeObject(array)
	        ? baseDifference(array, baseFlatten(values, false, true), undefined, comparator)
	        : [];
	    });
	
	    /**
	     * Creates a slice of `array` with `n` elements dropped from the beginning.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @param {number} [n=1] The number of elements to drop.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * _.drop([1, 2, 3]);
	     * // => [2, 3]
	     *
	     * _.drop([1, 2, 3], 2);
	     * // => [3]
	     *
	     * _.drop([1, 2, 3], 5);
	     * // => []
	     *
	     * _.drop([1, 2, 3], 0);
	     * // => [1, 2, 3]
	     */
	    function drop(array, n, guard) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return [];
	      }
	      n = (guard || n === undefined) ? 1 : toInteger(n);
	      return baseSlice(array, n < 0 ? 0 : n, length);
	    }
	
	    /**
	     * Creates a slice of `array` with `n` elements dropped from the end.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @param {number} [n=1] The number of elements to drop.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * _.dropRight([1, 2, 3]);
	     * // => [1, 2]
	     *
	     * _.dropRight([1, 2, 3], 2);
	     * // => [1]
	     *
	     * _.dropRight([1, 2, 3], 5);
	     * // => []
	     *
	     * _.dropRight([1, 2, 3], 0);
	     * // => [1, 2, 3]
	     */
	    function dropRight(array, n, guard) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return [];
	      }
	      n = (guard || n === undefined) ? 1 : toInteger(n);
	      n = length - n;
	      return baseSlice(array, 0, n < 0 ? 0 : n);
	    }
	
	    /**
	     * Creates a slice of `array` excluding elements dropped from the end.
	     * Elements are dropped until `predicate` returns falsey. The predicate is
	     * invoked with three arguments: (value, index, array).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney',  'active': true },
	     *   { 'user': 'fred',    'active': false },
	     *   { 'user': 'pebbles', 'active': false }
	     * ];
	     *
	     * _.dropRightWhile(users, function(o) { return !o.active; });
	     * // => objects for ['barney']
	     *
	     * // using the `_.matches` iteratee shorthand
	     * _.dropRightWhile(users, { 'user': 'pebbles', 'active': false });
	     * // => objects for ['barney', 'fred']
	     *
	     * // using the `_.matchesProperty` iteratee shorthand
	     * _.dropRightWhile(users, ['active', false]);
	     * // => objects for ['barney']
	     *
	     * // using the `_.property` iteratee shorthand
	     * _.dropRightWhile(users, 'active');
	     * // => objects for ['barney', 'fred', 'pebbles']
	     */
	    function dropRightWhile(array, predicate) {
	      return (array && array.length)
	        ? baseWhile(array, getIteratee(predicate, 3), true, true)
	        : [];
	    }
	
	    /**
	     * Creates a slice of `array` excluding elements dropped from the beginning.
	     * Elements are dropped until `predicate` returns falsey. The predicate is
	     * invoked with three arguments: (value, index, array).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney',  'active': false },
	     *   { 'user': 'fred',    'active': false },
	     *   { 'user': 'pebbles', 'active': true }
	     * ];
	     *
	     * _.dropWhile(users, function(o) { return !o.active; });
	     * // => objects for ['pebbles']
	     *
	     * // using the `_.matches` iteratee shorthand
	     * _.dropWhile(users, { 'user': 'barney', 'active': false });
	     * // => objects for ['fred', 'pebbles']
	     *
	     * // using the `_.matchesProperty` iteratee shorthand
	     * _.dropWhile(users, ['active', false]);
	     * // => objects for ['pebbles']
	     *
	     * // using the `_.property` iteratee shorthand
	     * _.dropWhile(users, 'active');
	     * // => objects for ['barney', 'fred', 'pebbles']
	     */
	    function dropWhile(array, predicate) {
	      return (array && array.length)
	        ? baseWhile(array, getIteratee(predicate, 3), true)
	        : [];
	    }
	
	    /**
	     * Fills elements of `array` with `value` from `start` up to, but not
	     * including, `end`.
	     *
	     * **Note:** This method mutates `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to fill.
	     * @param {*} value The value to fill `array` with.
	     * @param {number} [start=0] The start position.
	     * @param {number} [end=array.length] The end position.
	     * @returns {Array} Returns `array`.
	     * @example
	     *
	     * var array = [1, 2, 3];
	     *
	     * _.fill(array, 'a');
	     * console.log(array);
	     * // => ['a', 'a', 'a']
	     *
	     * _.fill(Array(3), 2);
	     * // => [2, 2, 2]
	     *
	     * _.fill([4, 6, 8, 10], '*', 1, 3);
	     * // => [4, '*', '*', 10]
	     */
	    function fill(array, value, start, end) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return [];
	      }
	      if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
	        start = 0;
	        end = length;
	      }
	      return baseFill(array, value, start, end);
	    }
	
	    /**
	     * This method is like `_.find` except that it returns the index of the first
	     * element `predicate` returns truthy for instead of the element itself.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to search.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	     * @returns {number} Returns the index of the found element, else `-1`.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney',  'active': false },
	     *   { 'user': 'fred',    'active': false },
	     *   { 'user': 'pebbles', 'active': true }
	     * ];
	     *
	     * _.findIndex(users, function(o) { return o.user == 'barney'; });
	     * // => 0
	     *
	     * // using the `_.matches` iteratee shorthand
	     * _.findIndex(users, { 'user': 'fred', 'active': false });
	     * // => 1
	     *
	     * // using the `_.matchesProperty` iteratee shorthand
	     * _.findIndex(users, ['active', false]);
	     * // => 0
	     *
	     * // using the `_.property` iteratee shorthand
	     * _.findIndex(users, 'active');
	     * // => 2
	     */
	    function findIndex(array, predicate) {
	      return (array && array.length)
	        ? baseFindIndex(array, getIteratee(predicate, 3))
	        : -1;
	    }
	
	    /**
	     * This method is like `_.findIndex` except that it iterates over elements
	     * of `collection` from right to left.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to search.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	     * @returns {number} Returns the index of the found element, else `-1`.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney',  'active': true },
	     *   { 'user': 'fred',    'active': false },
	     *   { 'user': 'pebbles', 'active': false }
	     * ];
	     *
	     * _.findLastIndex(users, function(o) { return o.user == 'pebbles'; });
	     * // => 2
	     *
	     * // using the `_.matches` iteratee shorthand
	     * _.findLastIndex(users, { 'user': 'barney', 'active': true });
	     * // => 0
	     *
	     * // using the `_.matchesProperty` iteratee shorthand
	     * _.findLastIndex(users, ['active', false]);
	     * // => 2
	     *
	     * // using the `_.property` iteratee shorthand
	     * _.findLastIndex(users, 'active');
	     * // => 0
	     */
	    function findLastIndex(array, predicate) {
	      return (array && array.length)
	        ? baseFindIndex(array, getIteratee(predicate, 3), true)
	        : -1;
	    }
	
	    /**
	     * Creates an array of flattened values by running each element in `array`
	     * through `iteratee` and concating its result to the other mapped values.
	     * The iteratee is invoked with three arguments: (value, index|key, array).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to iterate over.
	     * @param {Function|Object|string} [iteratee=_.identity] The function invoked per iteration.
	     * @returns {Array} Returns the new array.
	     * @example
	     *
	     * function duplicate(n) {
	     *   return [n, n];
	     * }
	     *
	     * _.flatMap([1, 2], duplicate);
	     * // => [1, 1, 2, 2]
	     */
	    function flatMap(array, iteratee) {
	      var length = array ? array.length : 0;
	      return length ? baseFlatten(arrayMap(array, getIteratee(iteratee, 3))) : [];
	    }
	
	    /**
	     * Flattens `array` a single level.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to flatten.
	     * @returns {Array} Returns the new flattened array.
	     * @example
	     *
	     * _.flatten([1, [2, 3, [4]]]);
	     * // => [1, 2, 3, [4]]
	     */
	    function flatten(array) {
	      var length = array ? array.length : 0;
	      return length ? baseFlatten(array) : [];
	    }
	
	    /**
	     * This method is like `_.flatten` except that it recursively flattens `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to recursively flatten.
	     * @returns {Array} Returns the new flattened array.
	     * @example
	     *
	     * _.flattenDeep([1, [2, 3, [4]]]);
	     * // => [1, 2, 3, 4]
	     */
	    function flattenDeep(array) {
	      var length = array ? array.length : 0;
	      return length ? baseFlatten(array, true) : [];
	    }
	
	    /**
	     * The inverse of `_.toPairs`; this method returns an object composed
	     * from key-value `pairs`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} pairs The key-value pairs.
	     * @returns {Object} Returns the new object.
	     * @example
	     *
	     * _.fromPairs([['fred', 30], ['barney', 40]]);
	     * // => { 'fred': 30, 'barney': 40 }
	     */
	    function fromPairs(pairs) {
	      var index = -1,
	          length = pairs ? pairs.length : 0,
	          result = {};
	
	      while (++index < length) {
	        var pair = pairs[index];
	        result[pair[0]] = pair[1];
	      }
	      return result;
	    }
	
	    /**
	     * Gets the first element of `array`.
	     *
	     * @static
	     * @memberOf _
	     * @alias first
	     * @category Array
	     * @param {Array} array The array to query.
	     * @returns {*} Returns the first element of `array`.
	     * @example
	     *
	     * _.head([1, 2, 3]);
	     * // => 1
	     *
	     * _.head([]);
	     * // => undefined
	     */
	    function head(array) {
	      return array ? array[0] : undefined;
	    }
	
	    /**
	     * Gets the index at which the first occurrence of `value` is found in `array`
	     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	     * for equality comparisons. If `fromIndex` is negative, it's used as the offset
	     * from the end of `array`. If `array` is sorted providing `true` for `fromIndex`
	     * performs a faster binary search.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to search.
	     * @param {*} value The value to search for.
	     * @param {number} [fromIndex=0] The index to search from.
	     * @returns {number} Returns the index of the matched value, else `-1`.
	     * @example
	     *
	     * _.indexOf([1, 2, 1, 2], 2);
	     * // => 1
	     *
	     * // using `fromIndex`
	     * _.indexOf([1, 2, 1, 2], 2, 2);
	     * // => 3
	     */
	    function indexOf(array, value, fromIndex) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return -1;
	      }
	      fromIndex = toInteger(fromIndex);
	      if (fromIndex < 0) {
	        fromIndex = nativeMax(length + fromIndex, 0);
	      }
	      return baseIndexOf(array, value, fromIndex);
	    }
	
	    /**
	     * Gets all but the last element of `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * _.initial([1, 2, 3]);
	     * // => [1, 2]
	     */
	    function initial(array) {
	      return dropRight(array, 1);
	    }
	
	    /**
	     * Creates an array of unique values that are included in all of the provided
	     * arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	     * for equality comparisons.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {...Array} [arrays] The arrays to inspect.
	     * @returns {Array} Returns the new array of shared values.
	     * @example
	     *
	     * _.intersection([2, 1], [4, 2], [1, 2]);
	     * // => [2]
	     */
	    var intersection = rest(function(arrays) {
	      var mapped = arrayMap(arrays, toArrayLikeObject);
	      return (mapped.length && mapped[0] === arrays[0])
	        ? baseIntersection(mapped)
	        : [];
	    });
	
	    /**
	     * This method is like `_.intersection` except that it accepts `iteratee`
	     * which is invoked for each element of each `arrays` to generate the criterion
	     * by which uniqueness is computed. The iteratee is invoked with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {...Array} [arrays] The arrays to inspect.
	     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
	     * @returns {Array} Returns the new array of shared values.
	     * @example
	     *
	     * _.intersectionBy([2.1, 1.2], [4.3, 2.4], Math.floor);
	     * // => [2.1]
	     *
	     * // using the `_.property` iteratee shorthand
	     * _.intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
	     * // => [{ 'x': 1 }]
	     */
	    var intersectionBy = rest(function(arrays) {
	      var iteratee = last(arrays),
	          mapped = arrayMap(arrays, toArrayLikeObject);
	
	      if (iteratee === last(mapped)) {
	        iteratee = undefined;
	      } else {
	        mapped.pop();
	      }
	      return (mapped.length && mapped[0] === arrays[0])
	        ? baseIntersection(mapped, getIteratee(iteratee))
	        : [];
	    });
	
	    /**
	     * This method is like `_.intersection` except that it accepts `comparator`
	     * which is invoked to compare elements of `arrays`. The comparator is invoked
	     * with two arguments: (arrVal, othVal).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {...Array} [arrays] The arrays to inspect.
	     * @param {Function} [comparator] The comparator invoked per element.
	     * @returns {Array} Returns the new array of shared values.
	     * @example
	     *
	     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
	     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
	     *
	     * _.intersectionWith(objects, others, _.isEqual);
	     * // => [{ 'x': 1, 'y': 2 }]
	     */
	    var intersectionWith = rest(function(arrays) {
	      var comparator = last(arrays),
	          mapped = arrayMap(arrays, toArrayLikeObject);
	
	      if (comparator === last(mapped)) {
	        comparator = undefined;
	      } else {
	        mapped.pop();
	      }
	      return (mapped.length && mapped[0] === arrays[0])
	        ? baseIntersection(mapped, undefined, comparator)
	        : [];
	    });
	
	    /**
	     * Converts all elements in `array` into a string separated by `separator`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to convert.
	     * @param {string} [separator=','] The element separator.
	     * @returns {string} Returns the joined string.
	     * @example
	     *
	     * _.join(['a', 'b', 'c'], '~');
	     * // => 'a~b~c'
	     */
	    function join(array, separator) {
	      return array ? nativeJoin.call(array, separator) : '';
	    }
	
	    /**
	     * Gets the last element of `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @returns {*} Returns the last element of `array`.
	     * @example
	     *
	     * _.last([1, 2, 3]);
	     * // => 3
	     */
	    function last(array) {
	      var length = array ? array.length : 0;
	      return length ? array[length - 1] : undefined;
	    }
	
	    /**
	     * This method is like `_.indexOf` except that it iterates over elements of
	     * `array` from right to left.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to search.
	     * @param {*} value The value to search for.
	     * @param {number} [fromIndex=array.length-1] The index to search from.
	     * @returns {number} Returns the index of the matched value, else `-1`.
	     * @example
	     *
	     * _.lastIndexOf([1, 2, 1, 2], 2);
	     * // => 3
	     *
	     * // using `fromIndex`
	     * _.lastIndexOf([1, 2, 1, 2], 2, 2);
	     * // => 1
	     */
	    function lastIndexOf(array, value, fromIndex) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return -1;
	      }
	      var index = length;
	      if (fromIndex !== undefined) {
	        index = toInteger(fromIndex);
	        index = (index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1)) + 1;
	      }
	      if (value !== value) {
	        return indexOfNaN(array, index, true);
	      }
	      while (index--) {
	        if (array[index] === value) {
	          return index;
	        }
	      }
	      return -1;
	    }
	
	    /**
	     * Removes all provided values from `array` using
	     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	     * for equality comparisons.
	     *
	     * **Note:** Unlike `_.without`, this method mutates `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to modify.
	     * @param {...*} [values] The values to remove.
	     * @returns {Array} Returns `array`.
	     * @example
	     *
	     * var array = [1, 2, 3, 1, 2, 3];
	     *
	     * _.pull(array, 2, 3);
	     * console.log(array);
	     * // => [1, 1]
	     */
	    var pull = rest(pullAll);
	
	    /**
	     * This method is like `_.pull` except that it accepts an array of values to remove.
	     *
	     * **Note:** Unlike `_.difference`, this method mutates `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to modify.
	     * @param {Array} values The values to remove.
	     * @returns {Array} Returns `array`.
	     * @example
	     *
	     * var array = [1, 2, 3, 1, 2, 3];
	     *
	     * _.pullAll(array, [2, 3]);
	     * console.log(array);
	     * // => [1, 1]
	     */
	    function pullAll(array, values) {
	      return (array && array.length && values && values.length)
	        ? basePullAll(array, values)
	        : array;
	    }
	
	    /**
	     * This method is like `_.pullAll` except that it accepts `iteratee` which is
	     * invoked for each element of `array` and `values` to to generate the criterion
	     * by which uniqueness is computed. The iteratee is invoked with one argument: (value).
	     *
	     * **Note:** Unlike `_.differenceBy`, this method mutates `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to modify.
	     * @param {Array} values The values to remove.
	     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
	     * @returns {Array} Returns `array`.
	     * @example
	     *
	     * var array = [{ 'x': 1 }, { 'x': 2 }, { 'x': 3 }, { 'x': 1 }];
	     *
	     * _.pullAllBy(array, [{ 'x': 1 }, { 'x': 3 }], 'x');
	     * console.log(array);
	     * // => [{ 'x': 2 }]
	     */
	    function pullAllBy(array, values, iteratee) {
	      return (array && array.length && values && values.length)
	        ? basePullAllBy(array, values, getIteratee(iteratee))
	        : array;
	    }
	
	    /**
	     * Removes elements from `array` corresponding to `indexes` and returns an
	     * array of removed elements.
	     *
	     * **Note:** Unlike `_.at`, this method mutates `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to modify.
	     * @param {...(number|number[])} [indexes] The indexes of elements to remove,
	     *  specified individually or in arrays.
	     * @returns {Array} Returns the new array of removed elements.
	     * @example
	     *
	     * var array = [5, 10, 15, 20];
	     * var evens = _.pullAt(array, 1, 3);
	     *
	     * console.log(array);
	     * // => [5, 15]
	     *
	     * console.log(evens);
	     * // => [10, 20]
	     */
	    var pullAt = rest(function(array, indexes) {
	      indexes = arrayMap(baseFlatten(indexes), String);
	
	      var result = baseAt(array, indexes);
	      basePullAt(array, indexes.sort(compareAscending));
	      return result;
	    });
	
	    /**
	     * Removes all elements from `array` that `predicate` returns truthy for
	     * and returns an array of the removed elements. The predicate is invoked with
	     * three arguments: (value, index, array).
	     *
	     * **Note:** Unlike `_.filter`, this method mutates `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to modify.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	     * @returns {Array} Returns the new array of removed elements.
	     * @example
	     *
	     * var array = [1, 2, 3, 4];
	     * var evens = _.remove(array, function(n) {
	     *   return n % 2 == 0;
	     * });
	     *
	     * console.log(array);
	     * // => [1, 3]
	     *
	     * console.log(evens);
	     * // => [2, 4]
	     */
	    function remove(array, predicate) {
	      var result = [];
	      if (!(array && array.length)) {
	        return result;
	      }
	      var index = -1,
	          indexes = [],
	          length = array.length;
	
	      predicate = getIteratee(predicate, 3);
	      while (++index < length) {
	        var value = array[index];
	        if (predicate(value, index, array)) {
	          result.push(value);
	          indexes.push(index);
	        }
	      }
	      basePullAt(array, indexes);
	      return result;
	    }
	
	    /**
	     * Reverses `array` so that the first element becomes the last, the second
	     * element becomes the second to last, and so on.
	     *
	     * **Note:** This method mutates `array` and is based on
	     * [`Array#reverse`](https://mdn.io/Array/reverse).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @returns {Array} Returns `array`.
	     * @example
	     *
	     * var array = [1, 2, 3];
	     *
	     * _.reverse(array);
	     * // => [3, 2, 1]
	     *
	     * console.log(array);
	     * // => [3, 2, 1]
	     */
	    function reverse(array) {
	      return array ? nativeReverse.call(array) : array;
	    }
	
	    /**
	     * Creates a slice of `array` from `start` up to, but not including, `end`.
	     *
	     * **Note:** This method is used instead of [`Array#slice`](https://mdn.io/Array/slice)
	     * to ensure dense arrays are returned.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to slice.
	     * @param {number} [start=0] The start position.
	     * @param {number} [end=array.length] The end position.
	     * @returns {Array} Returns the slice of `array`.
	     */
	    function slice(array, start, end) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return [];
	      }
	      if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
	        start = 0;
	        end = length;
	      }
	      else {
	        start = start == null ? 0 : toInteger(start);
	        end = end === undefined ? length : toInteger(end);
	      }
	      return baseSlice(array, start, end);
	    }
	
	    /**
	     * Uses a binary search to determine the lowest index at which `value` should
	     * be inserted into `array` in order to maintain its sort order.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The sorted array to inspect.
	     * @param {*} value The value to evaluate.
	     * @returns {number} Returns the index at which `value` should be inserted into `array`.
	     * @example
	     *
	     * _.sortedIndex([30, 50], 40);
	     * // => 1
	     *
	     * _.sortedIndex([4, 5], 4);
	     * // => 0
	     */
	    function sortedIndex(array, value) {
	      return baseSortedIndex(array, value);
	    }
	
	    /**
	     * This method is like `_.sortedIndex` except that it accepts `iteratee`
	     * which is invoked for `value` and each element of `array` to compute their
	     * sort ranking. The iteratee is invoked with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The sorted array to inspect.
	     * @param {*} value The value to evaluate.
	     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
	     * @returns {number} Returns the index at which `value` should be inserted into `array`.
	     * @example
	     *
	     * var dict = { 'thirty': 30, 'forty': 40, 'fifty': 50 };
	     *
	     * _.sortedIndexBy(['thirty', 'fifty'], 'forty', _.propertyOf(dict));
	     * // => 1
	     *
	     * // using the `_.property` iteratee shorthand
	     * _.sortedIndexBy([{ 'x': 4 }, { 'x': 5 }], { 'x': 4 }, 'x');
	     * // => 0
	     */
	    function sortedIndexBy(array, value, iteratee) {
	      return baseSortedIndexBy(array, value, getIteratee(iteratee));
	    }
	
	    /**
	     * This method is like `_.indexOf` except that it performs a binary
	     * search on a sorted `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to search.
	     * @param {*} value The value to search for.
	     * @returns {number} Returns the index of the matched value, else `-1`.
	     * @example
	     *
	     * _.sortedIndexOf([1, 1, 2, 2], 2);
	     * // => 2
	     */
	    function sortedIndexOf(array, value) {
	      var length = array ? array.length : 0;
	      if (length) {
	        var index = baseSortedIndex(array, value);
	        if (index < length && eq(array[index], value)) {
	          return index;
	        }
	      }
	      return -1;
	    }
	
	    /**
	     * This method is like `_.sortedIndex` except that it returns the highest
	     * index at which `value` should be inserted into `array` in order to
	     * maintain its sort order.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The sorted array to inspect.
	     * @param {*} value The value to evaluate.
	     * @returns {number} Returns the index at which `value` should be inserted into `array`.
	     * @example
	     *
	     * _.sortedLastIndex([4, 5], 4);
	     * // => 1
	     */
	    function sortedLastIndex(array, value) {
	      return baseSortedIndex(array, value, true);
	    }
	
	    /**
	     * This method is like `_.sortedLastIndex` except that it accepts `iteratee`
	     * which is invoked for `value` and each element of `array` to compute their
	     * sort ranking. The iteratee is invoked with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The sorted array to inspect.
	     * @param {*} value The value to evaluate.
	     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
	     * @returns {number} Returns the index at which `value` should be inserted into `array`.
	     * @example
	     *
	     * // using the `_.property` iteratee shorthand
	     * _.sortedLastIndexBy([{ 'x': 4 }, { 'x': 5 }], { 'x': 4 }, 'x');
	     * // => 1
	     */
	    function sortedLastIndexBy(array, value, iteratee) {
	      return baseSortedIndexBy(array, value, getIteratee(iteratee), true);
	    }
	
	    /**
	     * This method is like `_.lastIndexOf` except that it performs a binary
	     * search on a sorted `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to search.
	     * @param {*} value The value to search for.
	     * @returns {number} Returns the index of the matched value, else `-1`.
	     * @example
	     *
	     * _.sortedLastIndexOf([1, 1, 2, 2], 2);
	     * // => 3
	     */
	    function sortedLastIndexOf(array, value) {
	      var length = array ? array.length : 0;
	      if (length) {
	        var index = baseSortedIndex(array, value, true) - 1;
	        if (eq(array[index], value)) {
	          return index;
	        }
	      }
	      return -1;
	    }
	
	    /**
	     * This method is like `_.uniq` except that it's designed and optimized
	     * for sorted arrays.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to inspect.
	     * @returns {Array} Returns the new duplicate free array.
	     * @example
	     *
	     * _.sortedUniq([1, 1, 2]);
	     * // => [1, 2]
	     */
	    function sortedUniq(array) {
	      return (array && array.length)
	        ? baseSortedUniq(array)
	        : [];
	    }
	
	    /**
	     * This method is like `_.uniqBy` except that it's designed and optimized
	     * for sorted arrays.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to inspect.
	     * @param {Function} [iteratee] The iteratee invoked per element.
	     * @returns {Array} Returns the new duplicate free array.
	     * @example
	     *
	     * _.sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor);
	     * // => [1.1, 2.2]
	     */
	    function sortedUniqBy(array, iteratee) {
	      return (array && array.length)
	        ? baseSortedUniqBy(array, getIteratee(iteratee))
	        : [];
	    }
	
	    /**
	     * Gets all but the first element of `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * _.tail([1, 2, 3]);
	     * // => [2, 3]
	     */
	    function tail(array) {
	      return drop(array, 1);
	    }
	
	    /**
	     * Creates a slice of `array` with `n` elements taken from the beginning.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @param {number} [n=1] The number of elements to take.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * _.take([1, 2, 3]);
	     * // => [1]
	     *
	     * _.take([1, 2, 3], 2);
	     * // => [1, 2]
	     *
	     * _.take([1, 2, 3], 5);
	     * // => [1, 2, 3]
	     *
	     * _.take([1, 2, 3], 0);
	     * // => []
	     */
	    function take(array, n, guard) {
	      if (!(array && array.length)) {
	        return [];
	      }
	      n = (guard || n === undefined) ? 1 : toInteger(n);
	      return baseSlice(array, 0, n < 0 ? 0 : n);
	    }
	
	    /**
	     * Creates a slice of `array` with `n` elements taken from the end.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @param {number} [n=1] The number of elements to take.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * _.takeRight([1, 2, 3]);
	     * // => [3]
	     *
	     * _.takeRight([1, 2, 3], 2);
	     * // => [2, 3]
	     *
	     * _.takeRight([1, 2, 3], 5);
	     * // => [1, 2, 3]
	     *
	     * _.takeRight([1, 2, 3], 0);
	     * // => []
	     */
	    function takeRight(array, n, guard) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return [];
	      }
	      n = (guard || n === undefined) ? 1 : toInteger(n);
	      n = length - n;
	      return baseSlice(array, n < 0 ? 0 : n, length);
	    }
	
	    /**
	     * Creates a slice of `array` with elements taken from the end. Elements are
	     * taken until `predicate` returns falsey. The predicate is invoked with three
	     * arguments: (value, index, array).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney',  'active': true },
	     *   { 'user': 'fred',    'active': false },
	     *   { 'user': 'pebbles', 'active': false }
	     * ];
	     *
	     * _.takeRightWhile(users, function(o) { return !o.active; });
	     * // => objects for ['fred', 'pebbles']
	     *
	     * // using the `_.matches` iteratee shorthand
	     * _.takeRightWhile(users, { 'user': 'pebbles', 'active': false });
	     * // => objects for ['pebbles']
	     *
	     * // using the `_.matchesProperty` iteratee shorthand
	     * _.takeRightWhile(users, ['active', false]);
	     * // => objects for ['fred', 'pebbles']
	     *
	     * // using the `_.property` iteratee shorthand
	     * _.takeRightWhile(users, 'active');
	     * // => []
	     */
	    function takeRightWhile(array, predicate) {
	      return (array && array.length)
	        ? baseWhile(array, getIteratee(predicate, 3), false, true)
	        : [];
	    }
	
	    /**
	     * Creates a slice of `array` with elements taken from the beginning. Elements
	     * are taken until `predicate` returns falsey. The predicate is invoked with
	     * three arguments: (value, index, array).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney',  'active': false },
	     *   { 'user': 'fred',    'active': false},
	     *   { 'user': 'pebbles', 'active': true }
	     * ];
	     *
	     * _.takeWhile(users, function(o) { return !o.active; });
	     * // => objects for ['barney', 'fred']
	     *
	     * // using the `_.matches` iteratee shorthand
	     * _.takeWhile(users, { 'user': 'barney', 'active': false });
	     * // => objects for ['barney']
	     *
	     * // using the `_.matchesProperty` iteratee shorthand
	     * _.takeWhile(users, ['active', false]);
	     * // => objects for ['barney', 'fred']
	     *
	     * // using the `_.property` iteratee shorthand
	     * _.takeWhile(users, 'active');
	     * // => []
	     */
	    function takeWhile(array, predicate) {
	      return (array && array.length)
	        ? baseWhile(array, getIteratee(predicate, 3))
	        : [];
	    }
	
	    /**
	     * Creates an array of unique values, in order, from all of the provided arrays
	     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	     * for equality comparisons.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {...Array} [arrays] The arrays to inspect.
	     * @returns {Array} Returns the new array of combined values.
	     * @example
	     *
	     * _.union([2, 1], [4, 2], [1, 2]);
	     * // => [2, 1, 4]
	     */
	    var union = rest(function(arrays) {
	      return baseUniq(baseFlatten(arrays, false, true));
	    });
	
	    /**
	     * This method is like `_.union` except that it accepts `iteratee` which is
	     * invoked for each element of each `arrays` to generate the criterion by which
	     * uniqueness is computed. The iteratee is invoked with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {...Array} [arrays] The arrays to inspect.
	     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
	     * @returns {Array} Returns the new array of combined values.
	     * @example
	     *
	     * _.unionBy([2.1, 1.2], [4.3, 2.4], Math.floor);
	     * // => [2.1, 1.2, 4.3]
	     *
	     * // using the `_.property` iteratee shorthand
	     * _.unionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
	     * // => [{ 'x': 1 }, { 'x': 2 }]
	     */
	    var unionBy = rest(function(arrays) {
	      var iteratee = last(arrays);
	      if (isArrayLikeObject(iteratee)) {
	        iteratee = undefined;
	      }
	      return baseUniq(baseFlatten(arrays, false, true), getIteratee(iteratee));
	    });
	
	    /**
	     * This method is like `_.union` except that it accepts `comparator` which
	     * is invoked to compare elements of `arrays`. The comparator is invoked
	     * with two arguments: (arrVal, othVal).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {...Array} [arrays] The arrays to inspect.
	     * @param {Function} [comparator] The comparator invoked per element.
	     * @returns {Array} Returns the new array of combined values.
	     * @example
	     *
	     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
	     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
	     *
	     * _.unionWith(objects, others, _.isEqual);
	     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
	     */
	    var unionWith = rest(function(arrays) {
	      var comparator = last(arrays);
	      if (isArrayLikeObject(comparator)) {
	        comparator = undefined;
	      }
	      return baseUniq(baseFlatten(arrays, false, true), undefined, comparator);
	    });
	
	    /**
	     * Creates a duplicate-free version of an array, using
	     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	     * for equality comparisons, in which only the first occurrence of each element
	     * is kept.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to inspect.
	     * @returns {Array} Returns the new duplicate free array.
	     * @example
	     *
	     * _.uniq([2, 1, 2]);
	     * // => [2, 1]
	     */
	    function uniq(array) {
	      return (array && array.length)
	        ? baseUniq(array)
	        : [];
	    }
	
	    /**
	     * This method is like `_.uniq` except that it accepts `iteratee` which is
	     * invoked for each element in `array` to generate the criterion by which
	     * uniqueness is computed. The iteratee is invoked with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to inspect.
	     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
	     * @returns {Array} Returns the new duplicate free array.
	     * @example
	     *
	     * _.uniqBy([2.1, 1.2, 2.3], Math.floor);
	     * // => [2.1, 1.2]
	     *
	     * // using the `_.property` iteratee shorthand
	     * _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
	     * // => [{ 'x': 1 }, { 'x': 2 }]
	     */
	    function uniqBy(array, iteratee) {
	      return (array && array.length)
	        ? baseUniq(array, getIteratee(iteratee))
	        : [];
	    }
	
	    /**
	     * This method is like `_.uniq` except that it accepts `comparator` which
	     * is invoked to compare elements of `array`. The comparator is invoked with
	     * two arguments: (arrVal, othVal).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to inspect.
	     * @param {Function} [comparator] The comparator invoked per element.
	     * @returns {Array} Returns the new duplicate free array.
	     * @example
	     *
	     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 },  { 'x': 1, 'y': 2 }];
	     *
	     * _.uniqWith(objects, _.isEqual);
	     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
	     */
	    function uniqWith(array, comparator) {
	      return (array && array.length)
	        ? baseUniq(array, undefined, comparator)
	        : [];
	    }
	
	    /**
	     * This method is like `_.zip` except that it accepts an array of grouped
	     * elements and creates an array regrouping the elements to their pre-zip
	     * configuration.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array of grouped elements to process.
	     * @returns {Array} Returns the new array of regrouped elements.
	     * @example
	     *
	     * var zipped = _.zip(['fred', 'barney'], [30, 40], [true, false]);
	     * // => [['fred', 30, true], ['barney', 40, false]]
	     *
	     * _.unzip(zipped);
	     * // => [['fred', 'barney'], [30, 40], [true, false]]
	     */
	    function unzip(array) {
	      if (!(array && array.length)) {
	        return [];
	      }
	      var length = 0;
	      array = arrayFilter(array, function(group) {
	        if (isArrayLikeObject(group)) {
	          length = nativeMax(group.length, length);
	          return true;
	        }
	      });
	      return baseTimes(length, function(index) {
	        return arrayMap(array, baseProperty(index));
	      });
	    }
	
	    /**
	     * This method is like `_.unzip` except that it accepts `iteratee` to specify
	     * how regrouped values should be combined. The iteratee is invoked with the
	     * elements of each group: (...group).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array of grouped elements to process.
	     * @param {Function} [iteratee=_.identity] The function to combine regrouped values.
	     * @returns {Array} Returns the new array of regrouped elements.
	     * @example
	     *
	     * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
	     * // => [[1, 10, 100], [2, 20, 200]]
	     *
	     * _.unzipWith(zipped, _.add);
	     * // => [3, 30, 300]
	     */
	    function unzipWith(array, iteratee) {
	      if (!(array && array.length)) {
	        return [];
	      }
	      var result = unzip(array);
	      if (iteratee == null) {
	        return result;
	      }
	      return arrayMap(result, function(group) {
	        return apply(iteratee, undefined, group);
	      });
	    }
	
	    /**
	     * Creates an array excluding all provided values using
	     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	     * for equality comparisons.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to filter.
	     * @param {...*} [values] The values to exclude.
	     * @returns {Array} Returns the new array of filtered values.
	     * @example
	     *
	     * _.without([1, 2, 1, 3], 1, 2);
	     * // => [3]
	     */
	    var without = rest(function(array, values) {
	      return isArrayLikeObject(array)
	        ? baseDifference(array, values)
	        : [];
	    });
	
	    /**
	     * Creates an array of unique values that is the [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
	     * of the provided arrays.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {...Array} [arrays] The arrays to inspect.
	     * @returns {Array} Returns the new array of values.
	     * @example
	     *
	     * _.xor([2, 1], [4, 2]);
	     * // => [1, 4]
	     */
	    var xor = rest(function(arrays) {
	      return baseXor(arrayFilter(arrays, isArrayLikeObject));
	    });
	
	    /**
	     * This method is like `_.xor` except that it accepts `iteratee` which is
	     * invoked for each element of each `arrays` to generate the criterion by which
	     * uniqueness is computed. The iteratee is invoked with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {...Array} [arrays] The arrays to inspect.
	     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
	     * @returns {Array} Returns the new array of values.
	     * @example
	     *
	     * _.xorBy([2.1, 1.2], [4.3, 2.4], Math.floor);
	     * // => [1.2, 4.3]
	     *
	     * // using the `_.property` iteratee shorthand
	     * _.xorBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
	     * // => [{ 'x': 2 }]
	     */
	    var xorBy = rest(function(arrays) {
	      var iteratee = last(arrays);
	      if (isArrayLikeObject(iteratee)) {
	        iteratee = undefined;
	      }
	      return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee));
	    });
	
	    /**
	     * This method is like `_.xor` except that it accepts `comparator` which is
	     * invoked to compare elements of `arrays`. The comparator is invoked with
	     * two arguments: (arrVal, othVal).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {...Array} [arrays] The arrays to inspect.
	     * @param {Function} [comparator] The comparator invoked per element.
	     * @returns {Array} Returns the new array of values.
	     * @example
	     *
	     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
	     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
	     *
	     * _.xorWith(objects, others, _.isEqual);
	     * // => [{ 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
	     */
	    var xorWith = rest(function(arrays) {
	      var comparator = last(arrays);
	      if (isArrayLikeObject(comparator)) {
	        comparator = undefined;
	      }
	      return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined, comparator);
	    });
	
	    /**
	     * Creates an array of grouped elements, the first of which contains the first
	     * elements of the given arrays, the second of which contains the second elements
	     * of the given arrays, and so on.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {...Array} [arrays] The arrays to process.
	     * @returns {Array} Returns the new array of grouped elements.
	     * @example
	     *
	     * _.zip(['fred', 'barney'], [30, 40], [true, false]);
	     * // => [['fred', 30, true], ['barney', 40, false]]
	     */
	    var zip = rest(unzip);
	
	    /**
	     * This method is like `_.fromPairs` except that it accepts two arrays,
	     * one of property names and one of corresponding values.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} [props=[]] The property names.
	     * @param {Array} [values=[]] The property values.
	     * @returns {Object} Returns the new object.
	     * @example
	     *
	     * _.zipObject(['a', 'b'], [1, 2]);
	     * // => { 'a': 1, 'b': 2 }
	     */
	    function zipObject(props, values) {
	      return baseZipObject(props || [], values || [], assignValue);
	    }
	
	    /**
	     * This method is like `_.zipObject` except that it supports property paths.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} [props=[]] The property names.
	     * @param {Array} [values=[]] The property values.
	     * @returns {Object} Returns the new object.
	     * @example
	     *
	     * _.zipObjectDeep(['a.b[0].c', 'a.b[1].d'], [1, 2]);
	     * // => { 'a': { 'b': [{ 'c': 1 }, { 'd': 2 }] } }
	     */
	    function zipObjectDeep(props, values) {
	      return baseZipObject(props || [], values || [], baseSet);
	    }
	
	    /**
	     * This method is like `_.zip` except that it accepts `iteratee` to specify
	     * how grouped values should be combined. The iteratee is invoked with the
	     * elements of each group: (...group).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {...Array} [arrays] The arrays to process.
	     * @param {Function} [iteratee=_.identity] The function to combine grouped values.
	     * @returns {Array} Returns the new array of grouped elements.
	     * @example
	     *
	     * _.zipWith([1, 2], [10, 20], [100, 200], function(a, b, c) {
	     *   return a + b + c;
	     * });
	     * // => [111, 222]
	     */
	    var zipWith = rest(function(arrays) {
	      var length = arrays.length,
	          iteratee = length > 1 ? arrays[length - 1] : undefined;
	
	      iteratee = typeof iteratee == 'function' ? (arrays.pop(), iteratee) : undefined;
	      return unzipWith(arrays, iteratee);
	    });
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Creates a `lodash` object that wraps `value` with explicit method chaining enabled.
	     * The result of such method chaining must be unwrapped with `_#value`.
	     *
	     * @static
	     * @memberOf _
	     * @category Seq
	     * @param {*} value The value to wrap.
	     * @returns {Object} Returns the new `lodash` wrapper instance.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney',  'age': 36 },
	     *   { 'user': 'fred',    'age': 40 },
	     *   { 'user': 'pebbles', 'age': 1 }
	     * ];
	     *
	     * var youngest = _
	     *   .chain(users)
	     *   .sortBy('age')
	     *   .map(function(o) {
	     *     return o.user + ' is ' + o.age;
	     *   })
	     *   .head()
	     *   .value();
	     * // => 'pebbles is 1'
	     */
	    function chain(value) {
	      var result = lodash(value);
	      result.__chain__ = true;
	      return result;
	    }
	
	    /**
	     * This method invokes `interceptor` and returns `value`. The interceptor is
	     * invoked with one argument; (value). The purpose of this method is to "tap into"
	     * a method chain in order to perform operations on intermediate results within
	     * the chain.
	     *
	     * @static
	     * @memberOf _
	     * @category Seq
	     * @param {*} value The value to provide to `interceptor`.
	     * @param {Function} interceptor The function to invoke.
	     * @returns {*} Returns `value`.
	     * @example
	     *
	     * _([1, 2, 3])
	     *  .tap(function(array) {
	     *    array.pop();
	     *  })
	     *  .reverse()
	     *  .value();
	     * // => [2, 1]
	     */
	    function tap(value, interceptor) {
	      interceptor(value);
	      return value;
	    }
	
	    /**
	     * This method is like `_.tap` except that it returns the result of `interceptor`.
	     *
	     * @static
	     * @memberOf _
	     * @category Seq
	     * @param {*} value The value to provide to `interceptor`.
	     * @param {Function} interceptor The function to invoke.
	     * @returns {*} Returns the result of `interceptor`.
	     * @example
	     *
	     * _('  abc  ')
	     *  .chain()
	     *  .trim()
	     *  .thru(function(value) {
	     *    return [value];
	     *  })
	     *  .value();
	     * // => ['abc']
	     */
	    function thru(value, interceptor) {
	      return interceptor(value);
	    }
	
	    /**
	     * This method is the wrapper version of `_.at`.
	     *
	     * @name at
	     * @memberOf _
	     * @category Seq
	     * @param {...(string|string[])} [paths] The property paths of elements to pick,
	     *  specified individually or in arrays.
	     * @returns {Object} Returns the new `lodash` wrapper instance.
	     * @example
	     *
	     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
	     *
	     * _(object).at(['a[0].b.c', 'a[1]']).value();
	     * // => [3, 4]
	     *
	     * _(['a', 'b', 'c']).at(0, 2).value();
	     * // => ['a', 'c']
	     */
	    var wrapperAt = rest(function(paths) {
	      paths = baseFlatten(paths);
	      var length = paths.length,
	          start = length ? paths[0] : 0,
	          value = this.__wrapped__,
	          interceptor = function(object) { return baseAt(object, paths); };
	
	      if (length > 1 || this.__actions__.length || !(value instanceof LazyWrapper) || !isIndex(start)) {
	        return this.thru(interceptor);
	      }
	      value = value.slice(start, +start + (length ? 1 : 0));
	      value.__actions__.push({ 'func': thru, 'args': [interceptor], 'thisArg': undefined });
	      return new LodashWrapper(value, this.__chain__).thru(function(array) {
	        if (length && !array.length) {
	          array.push(undefined);
	        }
	        return array;
	      });
	    });
	
	    /**
	     * Enables explicit method chaining on the wrapper object.
	     *
	     * @name chain
	     * @memberOf _
	     * @category Seq
	     * @returns {Object} Returns the new `lodash` wrapper instance.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36 },
	     *   { 'user': 'fred',   'age': 40 }
	     * ];
	     *
	     * // without explicit chaining
	     * _(users).head();
	     * // => { 'user': 'barney', 'age': 36 }
	     *
	     * // with explicit chaining
	     * _(users)
	     *   .chain()
	     *   .head()
	     *   .pick('user')
	     *   .value();
	     * // => { 'user': 'barney' }
	     */
	    function wrapperChain() {
	      return chain(this);
	    }
	
	    /**
	     * Executes the chained sequence and returns the wrapped result.
	     *
	     * @name commit
	     * @memberOf _
	     * @category Seq
	     * @returns {Object} Returns the new `lodash` wrapper instance.
	     * @example
	     *
	     * var array = [1, 2];
	     * var wrapped = _(array).push(3);
	     *
	     * console.log(array);
	     * // => [1, 2]
	     *
	     * wrapped = wrapped.commit();
	     * console.log(array);
	     * // => [1, 2, 3]
	     *
	     * wrapped.last();
	     * // => 3
	     *
	     * console.log(array);
	     * // => [1, 2, 3]
	     */
	    function wrapperCommit() {
	      return new LodashWrapper(this.value(), this.__chain__);
	    }
	
	    /**
	     * This method is the wrapper version of `_.flatMap`.
	     *
	     * @name flatMap
	     * @memberOf _
	     * @category Seq
	     * @param {Function|Object|string} [iteratee=_.identity] The function invoked per iteration.
	     * @returns {Object} Returns the new `lodash` wrapper instance.
	     * @example
	     *
	     * function duplicate(n) {
	     *   return [n, n];
	     * }
	     *
	     * _([1, 2]).flatMap(duplicate).value();
	     * // => [1, 1, 2, 2]
	     */
	    function wrapperFlatMap(iteratee) {
	      return this.map(iteratee).flatten();
	    }
	
	    /**
	     * Gets the next value on a wrapped object following the
	     * [iterator protocol](https://mdn.io/iteration_protocols#iterator).
	     *
	     * @name next
	     * @memberOf _
	     * @category Seq
	     * @returns {Object} Returns the next iterator value.
	     * @example
	     *
	     * var wrapped = _([1, 2]);
	     *
	     * wrapped.next();
	     * // => { 'done': false, 'value': 1 }
	     *
	     * wrapped.next();
	     * // => { 'done': false, 'value': 2 }
	     *
	     * wrapped.next();
	     * // => { 'done': true, 'value': undefined }
	     */
	    function wrapperNext() {
	      if (this.__values__ === undefined) {
	        this.__values__ = toArray(this.value());
	      }
	      var done = this.__index__ >= this.__values__.length,
	          value = done ? undefined : this.__values__[this.__index__++];
	
	      return { 'done': done, 'value': value };
	    }
	
	    /**
	     * Enables the wrapper to be iterable.
	     *
	     * @name Symbol.iterator
	     * @memberOf _
	     * @category Seq
	     * @returns {Object} Returns the wrapper object.
	     * @example
	     *
	     * var wrapped = _([1, 2]);
	     *
	     * wrapped[Symbol.iterator]() === wrapped;
	     * // => true
	     *
	     * Array.from(wrapped);
	     * // => [1, 2]
	     */
	    function wrapperToIterator() {
	      return this;
	    }
	
	    /**
	     * Creates a clone of the chained sequence planting `value` as the wrapped value.
	     *
	     * @name plant
	     * @memberOf _
	     * @category Seq
	     * @param {*} value The value to plant.
	     * @returns {Object} Returns the new `lodash` wrapper instance.
	     * @example
	     *
	     * function square(n) {
	     *   return n * n;
	     * }
	     *
	     * var wrapped = _([1, 2]).map(square);
	     * var other = wrapped.plant([3, 4]);
	     *
	     * other.value();
	     * // => [9, 16]
	     *
	     * wrapped.value();
	     * // => [1, 4]
	     */
	    function wrapperPlant(value) {
	      var result,
	          parent = this;
	
	      while (parent instanceof baseLodash) {
	        var clone = wrapperClone(parent);
	        clone.__index__ = 0;
	        clone.__values__ = undefined;
	        if (result) {
	          previous.__wrapped__ = clone;
	        } else {
	          result = clone;
	        }
	        var previous = clone;
	        parent = parent.__wrapped__;
	      }
	      previous.__wrapped__ = value;
	      return result;
	    }
	
	    /**
	     * This method is the wrapper version of `_.reverse`.
	     *
	     * **Note:** This method mutates the wrapped array.
	     *
	     * @name reverse
	     * @memberOf _
	     * @category Seq
	     * @returns {Object} Returns the new `lodash` wrapper instance.
	     * @example
	     *
	     * var array = [1, 2, 3];
	     *
	     * _(array).reverse().value()
	     * // => [3, 2, 1]
	     *
	     * console.log(array);
	     * // => [3, 2, 1]
	     */
	    function wrapperReverse() {
	      var value = this.__wrapped__;
	      if (value instanceof LazyWrapper) {
	        var wrapped = value;
	        if (this.__actions__.length) {
	          wrapped = new LazyWrapper(this);
	        }
	        wrapped = wrapped.reverse();
	        wrapped.__actions__.push({ 'func': thru, 'args': [reverse], 'thisArg': undefined });
	        return new LodashWrapper(wrapped, this.__chain__);
	      }
	      return this.thru(reverse);
	    }
	
	    /**
	     * Executes the chained sequence to extract the unwrapped value.
	     *
	     * @name value
	     * @memberOf _
	     * @alias toJSON, valueOf
	     * @category Seq
	     * @returns {*} Returns the resolved unwrapped value.
	     * @example
	     *
	     * _([1, 2, 3]).value();
	     * // => [1, 2, 3]
	     */
	    function wrapperValue() {
	      return baseWrapperValue(this.__wrapped__, this.__actions__);
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Creates an object composed of keys generated from the results of running
	     * each element of `collection` through `iteratee`. The corresponding value
	     * of each key is the number of times the key was returned by `iteratee`.
	     * The iteratee is invoked with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function|Object|string} [iteratee=_.identity] The iteratee to transform keys.
	     * @returns {Object} Returns the composed aggregate object.
	     * @example
	     *
	     * _.countBy([6.1, 4.2, 6.3], Math.floor);
	     * // => { '4': 1, '6': 2 }
	     *
	     * _.countBy(['one', 'two', 'three'], 'length');
	     * // => { '3': 2, '5': 1 }
	     */
	    var countBy = createAggregator(function(result, value, key) {
	      hasOwnProperty.call(result, key) ? ++result[key] : (result[key] = 1);
	    });
	
	    /**
	     * Checks if `predicate` returns truthy for **all** elements of `collection`.
	     * Iteration is stopped once `predicate` returns falsey. The predicate is
	     * invoked with three arguments: (value, index|key, collection).
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
	     * @returns {boolean} Returns `true` if all elements pass the predicate check, else `false`.
	     * @example
	     *
	     * _.every([true, 1, null, 'yes'], Boolean);
	     * // => false
	     *
	     * var users = [
	     *   { 'user': 'barney', 'active': false },
	     *   { 'user': 'fred',   'active': false }
	     * ];
	     *
	     * // using the `_.matches` iteratee shorthand
	     * _.every(users, { 'user': 'barney', 'active': false });
	     * // => false
	     *
	     * // using the `_.matchesProperty` iteratee shorthand
	     * _.every(users, ['active', false]);
	     * // => true
	     *
	     * // using the `_.property` iteratee shorthand
	     * _.every(users, 'active');
	     * // => false
	     */
	    function every(collection, predicate, guard) {
	      var func = isArray(collection) ? arrayEvery : baseEvery;
	      if (guard && isIterateeCall(collection, predicate, guard)) {
	        predicate = undefined;
	      }
	      return func(collection, getIteratee(predicate, 3));
	    }
	
	    /**
	     * Iterates over elements of `collection`, returning an array of all elements
	     * `predicate` returns truthy for. The predicate is invoked with three arguments:
	     * (value, index|key, collection).
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	     * @returns {Array} Returns the new filtered array.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36, 'active': true },
	     *   { 'user': 'fred',   'age': 40, 'active': false }
	     * ];
	     *
	     * _.filter(users, function(o) { return !o.active; });
	     * // => objects for ['fred']
	     *
	     * // using the `_.matches` iteratee shorthand
	     * _.filter(users, { 'age': 36, 'active': true });
	     * // => objects for ['barney']
	     *
	     * // using the `_.matchesProperty` iteratee shorthand
	     * _.filter(users, ['active', false]);
	     * // => objects for ['fred']
	     *
	     * // using the `_.property` iteratee shorthand
	     * _.filter(users, 'active');
	     * // => objects for ['barney']
	     */
	    function filter(collection, predicate) {
	      var func = isArray(collection) ? arrayFilter : baseFilter;
	      return func(collection, getIteratee(predicate, 3));
	    }
	
	    /**
	     * Iterates over elements of `collection`, returning the first element
	     * `predicate` returns truthy for. The predicate is invoked with three arguments:
	     * (value, index|key, collection).
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to search.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	     * @returns {*} Returns the matched element, else `undefined`.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney',  'age': 36, 'active': true },
	     *   { 'user': 'fred',    'age': 40, 'active': false },
	     *   { 'user': 'pebbles', 'age': 1,  'active': true }
	     * ];
	     *
	     * _.find(users, function(o) { return o.age < 40; });
	     * // => object for 'barney'
	     *
	     * // using the `_.matches` iteratee shorthand
	     * _.find(users, { 'age': 1, 'active': true });
	     * // => object for 'pebbles'
	     *
	     * // using the `_.matchesProperty` iteratee shorthand
	     * _.find(users, ['active', false]);
	     * // => object for 'fred'
	     *
	     * // using the `_.property` iteratee shorthand
	     * _.find(users, 'active');
	     * // => object for 'barney'
	     */
	    function find(collection, predicate) {
	      predicate = getIteratee(predicate, 3);
	      if (isArray(collection)) {
	        var index = baseFindIndex(collection, predicate);
	        return index > -1 ? collection[index] : undefined;
	      }
	      return baseFind(collection, predicate, baseEach);
	    }
	
	    /**
	     * This method is like `_.find` except that it iterates over elements of
	     * `collection` from right to left.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to search.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	     * @returns {*} Returns the matched element, else `undefined`.
	     * @example
	     *
	     * _.findLast([1, 2, 3, 4], function(n) {
	     *   return n % 2 == 1;
	     * });
	     * // => 3
	     */
	    function findLast(collection, predicate) {
	      predicate = getIteratee(predicate, 3);
	      if (isArray(collection)) {
	        var index = baseFindIndex(collection, predicate, true);
	        return index > -1 ? collection[index] : undefined;
	      }
	      return baseFind(collection, predicate, baseEachRight);
	    }
	
	    /**
	     * Iterates over elements of `collection` invoking `iteratee` for each element.
	     * The iteratee is invoked with three arguments: (value, index|key, collection).
	     * Iteratee functions may exit iteration early by explicitly returning `false`.
	     *
	     * **Note:** As with other "Collections" methods, objects with a "length" property
	     * are iterated like arrays. To avoid this behavior use `_.forIn` or `_.forOwn`
	     * for object iteration.
	     *
	     * @static
	     * @memberOf _
	     * @alias each
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @returns {Array|Object} Returns `collection`.
	     * @example
	     *
	     * _([1, 2]).forEach(function(value) {
	     *   console.log(value);
	     * });
	     * // => logs `1` then `2`
	     *
	     * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
	     *   console.log(key);
	     * });
	     * // => logs 'a' then 'b' (iteration order is not guaranteed)
	     */
	    function forEach(collection, iteratee) {
	      return (typeof iteratee == 'function' && isArray(collection))
	        ? arrayEach(collection, iteratee)
	        : baseEach(collection, toFunction(iteratee));
	    }
	
	    /**
	     * This method is like `_.forEach` except that it iterates over elements of
	     * `collection` from right to left.
	     *
	     * @static
	     * @memberOf _
	     * @alias eachRight
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @returns {Array|Object} Returns `collection`.
	     * @example
	     *
	     * _.forEachRight([1, 2], function(value) {
	     *   console.log(value);
	     * });
	     * // => logs `2` then `1`
	     */
	    function forEachRight(collection, iteratee) {
	      return (typeof iteratee == 'function' && isArray(collection))
	        ? arrayEachRight(collection, iteratee)
	        : baseEachRight(collection, toFunction(iteratee));
	    }
	
	    /**
	     * Creates an object composed of keys generated from the results of running
	     * each element of `collection` through `iteratee`. The corresponding value
	     * of each key is an array of elements responsible for generating the key.
	     * The iteratee is invoked with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function|Object|string} [iteratee=_.identity] The iteratee to transform keys.
	     * @returns {Object} Returns the composed aggregate object.
	     * @example
	     *
	     * _.groupBy([6.1, 4.2, 6.3], Math.floor);
	     * // => { '4': [4.2], '6': [6.1, 6.3] }
	     *
	     * // using the `_.property` iteratee shorthand
	     * _.groupBy(['one', 'two', 'three'], 'length');
	     * // => { '3': ['one', 'two'], '5': ['three'] }
	     */
	    var groupBy = createAggregator(function(result, value, key) {
	      if (hasOwnProperty.call(result, key)) {
	        result[key].push(value);
	      } else {
	        result[key] = [value];
	      }
	    });
	
	    /**
	     * Checks if `value` is in `collection`. If `collection` is a string it's checked
	     * for a substring of `value`, otherwise [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	     * is used for equality comparisons. If `fromIndex` is negative, it's used as
	     * the offset from the end of `collection`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to search.
	     * @param {*} value The value to search for.
	     * @param {number} [fromIndex=0] The index to search from.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.reduce`.
	     * @returns {boolean} Returns `true` if `value` is found, else `false`.
	     * @example
	     *
	     * _.includes([1, 2, 3], 1);
	     * // => true
	     *
	     * _.includes([1, 2, 3], 1, 2);
	     * // => false
	     *
	     * _.includes({ 'user': 'fred', 'age': 40 }, 'fred');
	     * // => true
	     *
	     * _.includes('pebbles', 'eb');
	     * // => true
	     */
	    function includes(collection, value, fromIndex, guard) {
	      collection = isArrayLike(collection) ? collection : values(collection);
	      fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;
	
	      var length = collection.length;
	      if (fromIndex < 0) {
	        fromIndex = nativeMax(length + fromIndex, 0);
	      }
	      return isString(collection)
	        ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
	        : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
	    }
	
	    /**
	     * Invokes the method at `path` of each element in `collection`, returning
	     * an array of the results of each invoked method. Any additional arguments
	     * are provided to each invoked method. If `methodName` is a function it's
	     * invoked for, and `this` bound to, each element in `collection`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Array|Function|string} path The path of the method to invoke or
	     *  the function invoked per iteration.
	     * @param {...*} [args] The arguments to invoke each method with.
	     * @returns {Array} Returns the array of results.
	     * @example
	     *
	     * _.invokeMap([[5, 1, 7], [3, 2, 1]], 'sort');
	     * // => [[1, 5, 7], [1, 2, 3]]
	     *
	     * _.invokeMap([123, 456], String.prototype.split, '');
	     * // => [['1', '2', '3'], ['4', '5', '6']]
	     */
	    var invokeMap = rest(function(collection, path, args) {
	      var index = -1,
	          isFunc = typeof path == 'function',
	          isProp = isKey(path),
	          result = isArrayLike(collection) ? Array(collection.length) : [];
	
	      baseEach(collection, function(value) {
	        var func = isFunc ? path : ((isProp && value != null) ? value[path] : undefined);
	        result[++index] = func ? apply(func, value, args) : baseInvoke(value, path, args);
	      });
	      return result;
	    });
	
	    /**
	     * Creates an object composed of keys generated from the results of running
	     * each element of `collection` through `iteratee`. The corresponding value
	     * of each key is the last element responsible for generating the key. The
	     * iteratee is invoked with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function|Object|string} [iteratee=_.identity] The iteratee to transform keys.
	     * @returns {Object} Returns the composed aggregate object.
	     * @example
	     *
	     * var array = [
	     *   { 'dir': 'left', 'code': 97 },
	     *   { 'dir': 'right', 'code': 100 }
	     * ];
	     *
	     * _.keyBy(array, function(o) {
	     *   return String.fromCharCode(o.code);
	     * });
	     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
	     *
	     * _.keyBy(array, 'dir');
	     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
	     */
	    var keyBy = createAggregator(function(result, value, key) {
	      result[key] = value;
	    });
	
	    /**
	     * Creates an array of values by running each element in `collection` through
	     * `iteratee`. The iteratee is invoked with three arguments:
	     * (value, index|key, collection).
	     *
	     * Many lodash methods are guarded to work as iteratees for methods like
	     * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
	     *
	     * The guarded methods are:
	     * `ary`, `curry`, `curryRight`, `drop`, `dropRight`, `every`, `fill`,
	     * `invert`, `parseInt`, `random`, `range`, `rangeRight`, `slice`, `some`,
	     * `sortBy`, `take`, `takeRight`, `template`, `trim`, `trimEnd`, `trimStart`,
	     * and `words`
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function|Object|string} [iteratee=_.identity] The function invoked per iteration.
	     * @returns {Array} Returns the new mapped array.
	     * @example
	     *
	     * function square(n) {
	     *   return n * n;
	     * }
	     *
	     * _.map([4, 8], square);
	     * // => [16, 64]
	     *
	     * _.map({ 'a': 4, 'b': 8 }, square);
	     * // => [16, 64] (iteration order is not guaranteed)
	     *
	     * var users = [
	     *   { 'user': 'barney' },
	     *   { 'user': 'fred' }
	     * ];
	     *
	     * // using the `_.property` iteratee shorthand
	     * _.map(users, 'user');
	     * // => ['barney', 'fred']
	     */
	    function map(collection, iteratee) {
	      var func = isArray(collection) ? arrayMap : baseMap;
	      return func(collection, getIteratee(iteratee, 3));
	    }
	
	    /**
	     * This method is like `_.sortBy` except that it allows specifying the sort
	     * orders of the iteratees to sort by. If `orders` is unspecified, all values
	     * are sorted in ascending order. Otherwise, specify an order of "desc" for
	     * descending or "asc" for ascending sort order of corresponding values.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function[]|Object[]|string[]} [iteratees=[_.identity]] The iteratees to sort by.
	     * @param {string[]} [orders] The sort orders of `iteratees`.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.reduce`.
	     * @returns {Array} Returns the new sorted array.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'fred',   'age': 48 },
	     *   { 'user': 'barney', 'age': 34 },
	     *   { 'user': 'fred',   'age': 42 },
	     *   { 'user': 'barney', 'age': 36 }
	     * ];
	     *
	     * // sort by `user` in ascending order and by `age` in descending order
	     * _.orderBy(users, ['user', 'age'], ['asc', 'desc']);
	     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
	     */
	    function orderBy(collection, iteratees, orders, guard) {
	      if (collection == null) {
	        return [];
	      }
	      if (!isArray(iteratees)) {
	        iteratees = iteratees == null ? [] : [iteratees];
	      }
	      orders = guard ? undefined : orders;
	      if (!isArray(orders)) {
	        orders = orders == null ? [] : [orders];
	      }
	      return baseOrderBy(collection, iteratees, orders);
	    }
	
	    /**
	     * Creates an array of elements split into two groups, the first of which
	     * contains elements `predicate` returns truthy for, the second of which
	     * contains elements `predicate` returns falsey for. The predicate is
	     * invoked with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	     * @returns {Array} Returns the array of grouped elements.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney',  'age': 36, 'active': false },
	     *   { 'user': 'fred',    'age': 40, 'active': true },
	     *   { 'user': 'pebbles', 'age': 1,  'active': false }
	     * ];
	     *
	     * _.partition(users, function(o) { return o.active; });
	     * // => objects for [['fred'], ['barney', 'pebbles']]
	     *
	     * // using the `_.matches` iteratee shorthand
	     * _.partition(users, { 'age': 1, 'active': false });
	     * // => objects for [['pebbles'], ['barney', 'fred']]
	     *
	     * // using the `_.matchesProperty` iteratee shorthand
	     * _.partition(users, ['active', false]);
	     * // => objects for [['barney', 'pebbles'], ['fred']]
	     *
	     * // using the `_.property` iteratee shorthand
	     * _.partition(users, 'active');
	     * // => objects for [['fred'], ['barney', 'pebbles']]
	     */
	    var partition = createAggregator(function(result, value, key) {
	      result[key ? 0 : 1].push(value);
	    }, function() { return [[], []]; });
	
	    /**
	     * Reduces `collection` to a value which is the accumulated result of running
	     * each element in `collection` through `iteratee`, where each successive
	     * invocation is supplied the return value of the previous. If `accumulator`
	     * is not provided the first element of `collection` is used as the initial
	     * value. The iteratee is invoked with four arguments:
	     * (accumulator, value, index|key, collection).
	     *
	     * Many lodash methods are guarded to work as iteratees for methods like
	     * `_.reduce`, `_.reduceRight`, and `_.transform`.
	     *
	     * The guarded methods are:
	     * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
	     * and `sortBy`
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @param {*} [accumulator] The initial value.
	     * @returns {*} Returns the accumulated value.
	     * @example
	     *
	     * _.reduce([1, 2], function(sum, n) {
	     *   return sum + n;
	     * }, 0);
	     * // => 3
	     *
	     * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
	     *   (result[value] || (result[value] = [])).push(key);
	     *   return result;
	     * }, {});
	     * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
	     */
	    function reduce(collection, iteratee, accumulator) {
	      var func = isArray(collection) ? arrayReduce : baseReduce,
	          initAccum = arguments.length < 3;
	
	      return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEach);
	    }
	
	    /**
	     * This method is like `_.reduce` except that it iterates over elements of
	     * `collection` from right to left.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @param {*} [accumulator] The initial value.
	     * @returns {*} Returns the accumulated value.
	     * @example
	     *
	     * var array = [[0, 1], [2, 3], [4, 5]];
	     *
	     * _.reduceRight(array, function(flattened, other) {
	     *   return flattened.concat(other);
	     * }, []);
	     * // => [4, 5, 2, 3, 0, 1]
	     */
	    function reduceRight(collection, iteratee, accumulator) {
	      var func = isArray(collection) ? arrayReduceRight : baseReduce,
	          initAccum = arguments.length < 3;
	
	      return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEachRight);
	    }
	
	    /**
	     * The opposite of `_.filter`; this method returns the elements of `collection`
	     * that `predicate` does **not** return truthy for.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	     * @returns {Array} Returns the new filtered array.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36, 'active': false },
	     *   { 'user': 'fred',   'age': 40, 'active': true }
	     * ];
	     *
	     * _.reject(users, function(o) { return !o.active; });
	     * // => objects for ['fred']
	     *
	     * // using the `_.matches` iteratee shorthand
	     * _.reject(users, { 'age': 40, 'active': true });
	     * // => objects for ['barney']
	     *
	     * // using the `_.matchesProperty` iteratee shorthand
	     * _.reject(users, ['active', false]);
	     * // => objects for ['fred']
	     *
	     * // using the `_.property` iteratee shorthand
	     * _.reject(users, 'active');
	     * // => objects for ['barney']
	     */
	    function reject(collection, predicate) {
	      var func = isArray(collection) ? arrayFilter : baseFilter;
	      predicate = getIteratee(predicate, 3);
	      return func(collection, function(value, index, collection) {
	        return !predicate(value, index, collection);
	      });
	    }
	
	    /**
	     * Gets a random element from `collection`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to sample.
	     * @returns {*} Returns the random element.
	     * @example
	     *
	     * _.sample([1, 2, 3, 4]);
	     * // => 2
	     */
	    function sample(collection) {
	      var array = isArrayLike(collection) ? collection : values(collection),
	          length = array.length;
	
	      return length > 0 ? array[baseRandom(0, length - 1)] : undefined;
	    }
	
	    /**
	     * Gets `n` random elements at unique keys from `collection` up to the
	     * size of `collection`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to sample.
	     * @param {number} [n=0] The number of elements to sample.
	     * @returns {Array} Returns the random elements.
	     * @example
	     *
	     * _.sampleSize([1, 2, 3], 2);
	     * // => [3, 1]
	     *
	     * _.sampleSize([1, 2, 3], 4);
	     * // => [2, 3, 1]
	     */
	    function sampleSize(collection, n) {
	      var index = -1,
	          result = toArray(collection),
	          length = result.length,
	          lastIndex = length - 1;
	
	      n = baseClamp(toInteger(n), 0, length);
	      while (++index < n) {
	        var rand = baseRandom(index, lastIndex),
	            value = result[rand];
	
	        result[rand] = result[index];
	        result[index] = value;
	      }
	      result.length = n;
	      return result;
	    }
	
	    /**
	     * Creates an array of shuffled values, using a version of the
	     * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to shuffle.
	     * @returns {Array} Returns the new shuffled array.
	     * @example
	     *
	     * _.shuffle([1, 2, 3, 4]);
	     * // => [4, 1, 3, 2]
	     */
	    function shuffle(collection) {
	      return sampleSize(collection, MAX_ARRAY_LENGTH);
	    }
	
	    /**
	     * Gets the size of `collection` by returning its length for array-like
	     * values or the number of own enumerable properties for objects.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to inspect.
	     * @returns {number} Returns the collection size.
	     * @example
	     *
	     * _.size([1, 2, 3]);
	     * // => 3
	     *
	     * _.size({ 'a': 1, 'b': 2 });
	     * // => 2
	     *
	     * _.size('pebbles');
	     * // => 7
	     */
	    function size(collection) {
	      if (collection == null) {
	        return 0;
	      }
	      if (isArrayLike(collection)) {
	        var result = collection.length;
	        return (result && isString(collection)) ? stringSize(collection) : result;
	      }
	      return keys(collection).length;
	    }
	
	    /**
	     * Checks if `predicate` returns truthy for **any** element of `collection`.
	     * Iteration is stopped once `predicate` returns truthy. The predicate is
	     * invoked with three arguments: (value, index|key, collection).
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
	     * @returns {boolean} Returns `true` if any element passes the predicate check, else `false`.
	     * @example
	     *
	     * _.some([null, 0, 'yes', false], Boolean);
	     * // => true
	     *
	     * var users = [
	     *   { 'user': 'barney', 'active': true },
	     *   { 'user': 'fred',   'active': false }
	     * ];
	     *
	     * // using the `_.matches` iteratee shorthand
	     * _.some(users, { 'user': 'barney', 'active': false });
	     * // => false
	     *
	     * // using the `_.matchesProperty` iteratee shorthand
	     * _.some(users, ['active', false]);
	     * // => true
	     *
	     * // using the `_.property` iteratee shorthand
	     * _.some(users, 'active');
	     * // => true
	     */
	    function some(collection, predicate, guard) {
	      var func = isArray(collection) ? arraySome : baseSome;
	      if (guard && isIterateeCall(collection, predicate, guard)) {
	        predicate = undefined;
	      }
	      return func(collection, getIteratee(predicate, 3));
	    }
	
	    /**
	     * Creates an array of elements, sorted in ascending order by the results of
	     * running each element in a collection through each iteratee. This method
	     * performs a stable sort, that is, it preserves the original sort order of
	     * equal elements. The iteratees are invoked with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {...(Function|Function[]|Object|Object[]|string|string[])} [iteratees=[_.identity]]
	     *  The iteratees to sort by, specified individually or in arrays.
	     * @returns {Array} Returns the new sorted array.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'fred',   'age': 48 },
	     *   { 'user': 'barney', 'age': 36 },
	     *   { 'user': 'fred',   'age': 42 },
	     *   { 'user': 'barney', 'age': 34 }
	     * ];
	     *
	     * _.sortBy(users, function(o) { return o.user; });
	     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
	     *
	     * _.sortBy(users, ['user', 'age']);
	     * // => objects for [['barney', 34], ['barney', 36], ['fred', 42], ['fred', 48]]
	     *
	     * _.sortBy(users, 'user', function(o) {
	     *   return Math.floor(o.age / 10);
	     * });
	     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
	     */
	    var sortBy = rest(function(collection, iteratees) {
	      if (collection == null) {
	        return [];
	      }
	      var length = iteratees.length;
	      if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
	        iteratees = [];
	      } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
	        iteratees.length = 1;
	      }
	      return baseOrderBy(collection, baseFlatten(iteratees), []);
	    });
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Gets the timestamp of the number of milliseconds that have elapsed since
	     * the Unix epoch (1 January 1970 00:00:00 UTC).
	     *
	     * @static
	     * @memberOf _
	     * @type Function
	     * @category Date
	     * @returns {number} Returns the timestamp.
	     * @example
	     *
	     * _.defer(function(stamp) {
	     *   console.log(_.now() - stamp);
	     * }, _.now());
	     * // => logs the number of milliseconds it took for the deferred function to be invoked
	     */
	    var now = Date.now;
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * The opposite of `_.before`; this method creates a function that invokes
	     * `func` once it's called `n` or more times.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {number} n The number of calls before `func` is invoked.
	     * @param {Function} func The function to restrict.
	     * @returns {Function} Returns the new restricted function.
	     * @example
	     *
	     * var saves = ['profile', 'settings'];
	     *
	     * var done = _.after(saves.length, function() {
	     *   console.log('done saving!');
	     * });
	     *
	     * _.forEach(saves, function(type) {
	     *   asyncSave({ 'type': type, 'complete': done });
	     * });
	     * // => logs 'done saving!' after the two async saves have completed
	     */
	    function after(n, func) {
	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      n = toInteger(n);
	      return function() {
	        if (--n < 1) {
	          return func.apply(this, arguments);
	        }
	      };
	    }
	
	    /**
	     * Creates a function that accepts up to `n` arguments, ignoring any
	     * additional arguments.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to cap arguments for.
	     * @param {number} [n=func.length] The arity cap.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * _.map(['6', '8', '10'], _.ary(parseInt, 1));
	     * // => [6, 8, 10]
	     */
	    function ary(func, n, guard) {
	      n = guard ? undefined : n;
	      n = (func && n == null) ? func.length : n;
	      return createWrapper(func, ARY_FLAG, undefined, undefined, undefined, undefined, n);
	    }
	
	    /**
	     * Creates a function that invokes `func`, with the `this` binding and arguments
	     * of the created function, while it's called less than `n` times. Subsequent
	     * calls to the created function return the result of the last `func` invocation.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {number} n The number of calls at which `func` is no longer invoked.
	     * @param {Function} func The function to restrict.
	     * @returns {Function} Returns the new restricted function.
	     * @example
	     *
	     * jQuery(element).on('click', _.before(5, addContactToList));
	     * // => allows adding up to 4 contacts to the list
	     */
	    function before(n, func) {
	      var result;
	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      n = toInteger(n);
	      return function() {
	        if (--n > 0) {
	          result = func.apply(this, arguments);
	        }
	        if (n <= 1) {
	          func = undefined;
	        }
	        return result;
	      };
	    }
	
	    /**
	     * Creates a function that invokes `func` with the `this` binding of `thisArg`
	     * and prepends any additional `_.bind` arguments to those provided to the
	     * bound function.
	     *
	     * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
	     * may be used as a placeholder for partially applied arguments.
	     *
	     * **Note:** Unlike native `Function#bind` this method doesn't set the "length"
	     * property of bound functions.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to bind.
	     * @param {*} thisArg The `this` binding of `func`.
	     * @param {...*} [partials] The arguments to be partially applied.
	     * @returns {Function} Returns the new bound function.
	     * @example
	     *
	     * var greet = function(greeting, punctuation) {
	     *   return greeting + ' ' + this.user + punctuation;
	     * };
	     *
	     * var object = { 'user': 'fred' };
	     *
	     * var bound = _.bind(greet, object, 'hi');
	     * bound('!');
	     * // => 'hi fred!'
	     *
	     * // using placeholders
	     * var bound = _.bind(greet, object, _, '!');
	     * bound('hi');
	     * // => 'hi fred!'
	     */
	    var bind = rest(function(func, thisArg, partials) {
	      var bitmask = BIND_FLAG;
	      if (partials.length) {
	        var holders = replaceHolders(partials, bind.placeholder);
	        bitmask |= PARTIAL_FLAG;
	      }
	      return createWrapper(func, bitmask, thisArg, partials, holders);
	    });
	
	    /**
	     * Creates a function that invokes the method at `object[key]` and prepends
	     * any additional `_.bindKey` arguments to those provided to the bound function.
	     *
	     * This method differs from `_.bind` by allowing bound functions to reference
	     * methods that may be redefined or don't yet exist.
	     * See [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
	     * for more details.
	     *
	     * The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
	     * builds, may be used as a placeholder for partially applied arguments.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Object} object The object to invoke the method on.
	     * @param {string} key The key of the method.
	     * @param {...*} [partials] The arguments to be partially applied.
	     * @returns {Function} Returns the new bound function.
	     * @example
	     *
	     * var object = {
	     *   'user': 'fred',
	     *   'greet': function(greeting, punctuation) {
	     *     return greeting + ' ' + this.user + punctuation;
	     *   }
	     * };
	     *
	     * var bound = _.bindKey(object, 'greet', 'hi');
	     * bound('!');
	     * // => 'hi fred!'
	     *
	     * object.greet = function(greeting, punctuation) {
	     *   return greeting + 'ya ' + this.user + punctuation;
	     * };
	     *
	     * bound('!');
	     * // => 'hiya fred!'
	     *
	     * // using placeholders
	     * var bound = _.bindKey(object, 'greet', _, '!');
	     * bound('hi');
	     * // => 'hiya fred!'
	     */
	    var bindKey = rest(function(object, key, partials) {
	      var bitmask = BIND_FLAG | BIND_KEY_FLAG;
	      if (partials.length) {
	        var holders = replaceHolders(partials, bindKey.placeholder);
	        bitmask |= PARTIAL_FLAG;
	      }
	      return createWrapper(key, bitmask, object, partials, holders);
	    });
	
	    /**
	     * Creates a function that accepts arguments of `func` and either invokes
	     * `func` returning its result, if at least `arity` number of arguments have
	     * been provided, or returns a function that accepts the remaining `func`
	     * arguments, and so on. The arity of `func` may be specified if `func.length`
	     * is not sufficient.
	     *
	     * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
	     * may be used as a placeholder for provided arguments.
	     *
	     * **Note:** This method doesn't set the "length" property of curried functions.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to curry.
	     * @param {number} [arity=func.length] The arity of `func`.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
	     * @returns {Function} Returns the new curried function.
	     * @example
	     *
	     * var abc = function(a, b, c) {
	     *   return [a, b, c];
	     * };
	     *
	     * var curried = _.curry(abc);
	     *
	     * curried(1)(2)(3);
	     * // => [1, 2, 3]
	     *
	     * curried(1, 2)(3);
	     * // => [1, 2, 3]
	     *
	     * curried(1, 2, 3);
	     * // => [1, 2, 3]
	     *
	     * // using placeholders
	     * curried(1)(_, 3)(2);
	     * // => [1, 2, 3]
	     */
	    function curry(func, arity, guard) {
	      arity = guard ? undefined : arity;
	      var result = createWrapper(func, CURRY_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
	      result.placeholder = curry.placeholder;
	      return result;
	    }
	
	    /**
	     * This method is like `_.curry` except that arguments are applied to `func`
	     * in the manner of `_.partialRight` instead of `_.partial`.
	     *
	     * The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
	     * builds, may be used as a placeholder for provided arguments.
	     *
	     * **Note:** This method doesn't set the "length" property of curried functions.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to curry.
	     * @param {number} [arity=func.length] The arity of `func`.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
	     * @returns {Function} Returns the new curried function.
	     * @example
	     *
	     * var abc = function(a, b, c) {
	     *   return [a, b, c];
	     * };
	     *
	     * var curried = _.curryRight(abc);
	     *
	     * curried(3)(2)(1);
	     * // => [1, 2, 3]
	     *
	     * curried(2, 3)(1);
	     * // => [1, 2, 3]
	     *
	     * curried(1, 2, 3);
	     * // => [1, 2, 3]
	     *
	     * // using placeholders
	     * curried(3)(1, _)(2);
	     * // => [1, 2, 3]
	     */
	    function curryRight(func, arity, guard) {
	      arity = guard ? undefined : arity;
	      var result = createWrapper(func, CURRY_RIGHT_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
	      result.placeholder = curryRight.placeholder;
	      return result;
	    }
	
	    /**
	     * Creates a debounced function that delays invoking `func` until after `wait`
	     * milliseconds have elapsed since the last time the debounced function was
	     * invoked. The debounced function comes with a `cancel` method to cancel
	     * delayed `func` invocations and a `flush` method to immediately invoke them.
	     * Provide an options object to indicate whether `func` should be invoked on
	     * the leading and/or trailing edge of the `wait` timeout. The `func` is invoked
	     * with the last arguments provided to the debounced function. Subsequent calls
	     * to the debounced function return the result of the last `func` invocation.
	     *
	     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
	     * on the trailing edge of the timeout only if the the debounced function is
	     * invoked more than once during the `wait` timeout.
	     *
	     * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
	     * for details over the differences between `_.debounce` and `_.throttle`.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to debounce.
	     * @param {number} [wait=0] The number of milliseconds to delay.
	     * @param {Object} [options] The options object.
	     * @param {boolean} [options.leading=false] Specify invoking on the leading
	     *  edge of the timeout.
	     * @param {number} [options.maxWait] The maximum time `func` is allowed to be
	     *  delayed before it's invoked.
	     * @param {boolean} [options.trailing=true] Specify invoking on the trailing
	     *  edge of the timeout.
	     * @returns {Function} Returns the new debounced function.
	     * @example
	     *
	     * // avoid costly calculations while the window size is in flux
	     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
	     *
	     * // invoke `sendMail` when clicked, debouncing subsequent calls
	     * jQuery(element).on('click', _.debounce(sendMail, 300, {
	     *   'leading': true,
	     *   'trailing': false
	     * }));
	     *
	     * // ensure `batchLog` is invoked once after 1 second of debounced calls
	     * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
	     * var source = new EventSource('/stream');
	     * jQuery(source).on('message', debounced);
	     *
	     * // cancel a trailing debounced invocation
	     * jQuery(window).on('popstate', debounced.cancel);
	     */
	    function debounce(func, wait, options) {
	      var args,
	          maxTimeoutId,
	          result,
	          stamp,
	          thisArg,
	          timeoutId,
	          trailingCall,
	          lastCalled = 0,
	          leading = false,
	          maxWait = false,
	          trailing = true;
	
	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      wait = toNumber(wait) || 0;
	      if (isObject(options)) {
	        leading = !!options.leading;
	        maxWait = 'maxWait' in options && nativeMax(toNumber(options.maxWait) || 0, wait);
	        trailing = 'trailing' in options ? !!options.trailing : trailing;
	      }
	
	      function cancel() {
	        if (timeoutId) {
	          clearTimeout(timeoutId);
	        }
	        if (maxTimeoutId) {
	          clearTimeout(maxTimeoutId);
	        }
	        lastCalled = 0;
	        args = maxTimeoutId = thisArg = timeoutId = trailingCall = undefined;
	      }
	
	      function complete(isCalled, id) {
	        if (id) {
	          clearTimeout(id);
	        }
	        maxTimeoutId = timeoutId = trailingCall = undefined;
	        if (isCalled) {
	          lastCalled = now();
	          result = func.apply(thisArg, args);
	          if (!timeoutId && !maxTimeoutId) {
	            args = thisArg = undefined;
	          }
	        }
	      }
	
	      function delayed() {
	        var remaining = wait - (now() - stamp);
	        if (remaining <= 0 || remaining > wait) {
	          complete(trailingCall, maxTimeoutId);
	        } else {
	          timeoutId = setTimeout(delayed, remaining);
	        }
	      }
	
	      function flush() {
	        if ((timeoutId && trailingCall) || (maxTimeoutId && trailing)) {
	          result = func.apply(thisArg, args);
	        }
	        cancel();
	        return result;
	      }
	
	      function maxDelayed() {
	        complete(trailing, timeoutId);
	      }
	
	      function debounced() {
	        args = arguments;
	        stamp = now();
	        thisArg = this;
	        trailingCall = trailing && (timeoutId || !leading);
	
	        if (maxWait === false) {
	          var leadingCall = leading && !timeoutId;
	        } else {
	          if (!maxTimeoutId && !leading) {
	            lastCalled = stamp;
	          }
	          var remaining = maxWait - (stamp - lastCalled),
	              isCalled = remaining <= 0 || remaining > maxWait;
	
	          if (isCalled) {
	            if (maxTimeoutId) {
	              maxTimeoutId = clearTimeout(maxTimeoutId);
	            }
	            lastCalled = stamp;
	            result = func.apply(thisArg, args);
	          }
	          else if (!maxTimeoutId) {
	            maxTimeoutId = setTimeout(maxDelayed, remaining);
	          }
	        }
	        if (isCalled && timeoutId) {
	          timeoutId = clearTimeout(timeoutId);
	        }
	        else if (!timeoutId && wait !== maxWait) {
	          timeoutId = setTimeout(delayed, wait);
	        }
	        if (leadingCall) {
	          isCalled = true;
	          result = func.apply(thisArg, args);
	        }
	        if (isCalled && !timeoutId && !maxTimeoutId) {
	          args = thisArg = undefined;
	        }
	        return result;
	      }
	      debounced.cancel = cancel;
	      debounced.flush = flush;
	      return debounced;
	    }
	
	    /**
	     * Defers invoking the `func` until the current call stack has cleared. Any
	     * additional arguments are provided to `func` when it's invoked.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to defer.
	     * @param {...*} [args] The arguments to invoke `func` with.
	     * @returns {number} Returns the timer id.
	     * @example
	     *
	     * _.defer(function(text) {
	     *   console.log(text);
	     * }, 'deferred');
	     * // logs 'deferred' after one or more milliseconds
	     */
	    var defer = rest(function(func, args) {
	      return baseDelay(func, 1, args);
	    });
	
	    /**
	     * Invokes `func` after `wait` milliseconds. Any additional arguments are
	     * provided to `func` when it's invoked.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to delay.
	     * @param {number} wait The number of milliseconds to delay invocation.
	     * @param {...*} [args] The arguments to invoke `func` with.
	     * @returns {number} Returns the timer id.
	     * @example
	     *
	     * _.delay(function(text) {
	     *   console.log(text);
	     * }, 1000, 'later');
	     * // => logs 'later' after one second
	     */
	    var delay = rest(function(func, wait, args) {
	      return baseDelay(func, toNumber(wait) || 0, args);
	    });
	
	    /**
	     * Creates a function that invokes `func` with arguments reversed.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to flip arguments for.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var flipped = _.flip(function() {
	     *   return _.toArray(arguments);
	     * });
	     *
	     * flipped('a', 'b', 'c', 'd');
	     * // => ['d', 'c', 'b', 'a']
	     */
	    function flip(func) {
	      return createWrapper(func, FLIP_FLAG);
	    }
	
	    /**
	     * Creates a function that memoizes the result of `func`. If `resolver` is
	     * provided it determines the cache key for storing the result based on the
	     * arguments provided to the memoized function. By default, the first argument
	     * provided to the memoized function is used as the map cache key. The `func`
	     * is invoked with the `this` binding of the memoized function.
	     *
	     * **Note:** The cache is exposed as the `cache` property on the memoized
	     * function. Its creation may be customized by replacing the `_.memoize.Cache`
	     * constructor with one whose instances implement the [`Map`](http://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-map-prototype-object)
	     * method interface of `delete`, `get`, `has`, and `set`.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to have its output memoized.
	     * @param {Function} [resolver] The function to resolve the cache key.
	     * @returns {Function} Returns the new memoizing function.
	     * @example
	     *
	     * var object = { 'a': 1, 'b': 2 };
	     * var other = { 'c': 3, 'd': 4 };
	     *
	     * var values = _.memoize(_.values);
	     * values(object);
	     * // => [1, 2]
	     *
	     * values(other);
	     * // => [3, 4]
	     *
	     * object.a = 2;
	     * values(object);
	     * // => [1, 2]
	     *
	     * // modifying the result cache
	     * values.cache.set(object, ['a', 'b']);
	     * values(object);
	     * // => ['a', 'b']
	     *
	     * // replacing `_.memoize.Cache`
	     * _.memoize.Cache = WeakMap;
	     */
	    function memoize(func, resolver) {
	      if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      var memoized = function() {
	        var args = arguments,
	            key = resolver ? resolver.apply(this, args) : args[0],
	            cache = memoized.cache;
	
	        if (cache.has(key)) {
	          return cache.get(key);
	        }
	        var result = func.apply(this, args);
	        memoized.cache = cache.set(key, result);
	        return result;
	      };
	      memoized.cache = new memoize.Cache;
	      return memoized;
	    }
	
	    /**
	     * Creates a function that negates the result of the predicate `func`. The
	     * `func` predicate is invoked with the `this` binding and arguments of the
	     * created function.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} predicate The predicate to negate.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * function isEven(n) {
	     *   return n % 2 == 0;
	     * }
	     *
	     * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
	     * // => [1, 3, 5]
	     */
	    function negate(predicate) {
	      if (typeof predicate != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      return function() {
	        return !predicate.apply(this, arguments);
	      };
	    }
	
	    /**
	     * Creates a function that is restricted to invoking `func` once. Repeat calls
	     * to the function return the value of the first invocation. The `func` is
	     * invoked with the `this` binding and arguments of the created function.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to restrict.
	     * @returns {Function} Returns the new restricted function.
	     * @example
	     *
	     * var initialize = _.once(createApplication);
	     * initialize();
	     * initialize();
	     * // `initialize` invokes `createApplication` once
	     */
	    function once(func) {
	      return before(2, func);
	    }
	
	    /**
	     * Creates a function that invokes `func` with arguments transformed by
	     * corresponding `transforms`.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to wrap.
	     * @param {...(Function|Function[])} [transforms] The functions to transform
	     * arguments, specified individually or in arrays.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * function doubled(n) {
	     *   return n * 2;
	     * }
	     *
	     * function square(n) {
	     *   return n * n;
	     * }
	     *
	     * var func = _.overArgs(function(x, y) {
	     *   return [x, y];
	     * }, square, doubled);
	     *
	     * func(9, 3);
	     * // => [81, 6]
	     *
	     * func(10, 5);
	     * // => [100, 10]
	     */
	    var overArgs = rest(function(func, transforms) {
	      transforms = arrayMap(baseFlatten(transforms), getIteratee());
	
	      var funcsLength = transforms.length;
	      return rest(function(args) {
	        var index = -1,
	            length = nativeMin(args.length, funcsLength);
	
	        while (++index < length) {
	          args[index] = transforms[index].call(this, args[index]);
	        }
	        return apply(func, this, args);
	      });
	    });
	
	    /**
	     * Creates a function that invokes `func` with `partial` arguments prepended
	     * to those provided to the new function. This method is like `_.bind` except
	     * it does **not** alter the `this` binding.
	     *
	     * The `_.partial.placeholder` value, which defaults to `_` in monolithic
	     * builds, may be used as a placeholder for partially applied arguments.
	     *
	     * **Note:** This method doesn't set the "length" property of partially
	     * applied functions.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to partially apply arguments to.
	     * @param {...*} [partials] The arguments to be partially applied.
	     * @returns {Function} Returns the new partially applied function.
	     * @example
	     *
	     * var greet = function(greeting, name) {
	     *   return greeting + ' ' + name;
	     * };
	     *
	     * var sayHelloTo = _.partial(greet, 'hello');
	     * sayHelloTo('fred');
	     * // => 'hello fred'
	     *
	     * // using placeholders
	     * var greetFred = _.partial(greet, _, 'fred');
	     * greetFred('hi');
	     * // => 'hi fred'
	     */
	    var partial = rest(function(func, partials) {
	      var holders = replaceHolders(partials, partial.placeholder);
	      return createWrapper(func, PARTIAL_FLAG, undefined, partials, holders);
	    });
	
	    /**
	     * This method is like `_.partial` except that partially applied arguments
	     * are appended to those provided to the new function.
	     *
	     * The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
	     * builds, may be used as a placeholder for partially applied arguments.
	     *
	     * **Note:** This method doesn't set the "length" property of partially
	     * applied functions.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to partially apply arguments to.
	     * @param {...*} [partials] The arguments to be partially applied.
	     * @returns {Function} Returns the new partially applied function.
	     * @example
	     *
	     * var greet = function(greeting, name) {
	     *   return greeting + ' ' + name;
	     * };
	     *
	     * var greetFred = _.partialRight(greet, 'fred');
	     * greetFred('hi');
	     * // => 'hi fred'
	     *
	     * // using placeholders
	     * var sayHelloTo = _.partialRight(greet, 'hello', _);
	     * sayHelloTo('fred');
	     * // => 'hello fred'
	     */
	    var partialRight = rest(function(func, partials) {
	      var holders = replaceHolders(partials, partialRight.placeholder);
	      return createWrapper(func, PARTIAL_RIGHT_FLAG, undefined, partials, holders);
	    });
	
	    /**
	     * Creates a function that invokes `func` with arguments arranged according
	     * to the specified indexes where the argument value at the first index is
	     * provided as the first argument, the argument value at the second index is
	     * provided as the second argument, and so on.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to rearrange arguments for.
	     * @param {...(number|number[])} indexes The arranged argument indexes,
	     *  specified individually or in arrays.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var rearged = _.rearg(function(a, b, c) {
	     *   return [a, b, c];
	     * }, 2, 0, 1);
	     *
	     * rearged('b', 'c', 'a')
	     * // => ['a', 'b', 'c']
	     */
	    var rearg = rest(function(func, indexes) {
	      return createWrapper(func, REARG_FLAG, undefined, undefined, undefined, baseFlatten(indexes));
	    });
	
	    /**
	     * Creates a function that invokes `func` with the `this` binding of the
	     * created function and arguments from `start` and beyond provided as an array.
	     *
	     * **Note:** This method is based on the [rest parameter](https://mdn.io/rest_parameters).
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to apply a rest parameter to.
	     * @param {number} [start=func.length-1] The start position of the rest parameter.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var say = _.rest(function(what, names) {
	     *   return what + ' ' + _.initial(names).join(', ') +
	     *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
	     * });
	     *
	     * say('hello', 'fred', 'barney', 'pebbles');
	     * // => 'hello fred, barney, & pebbles'
	     */
	    function rest(func, start) {
	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      start = nativeMax(start === undefined ? (func.length - 1) : toInteger(start), 0);
	      return function() {
	        var args = arguments,
	            index = -1,
	            length = nativeMax(args.length - start, 0),
	            array = Array(length);
	
	        while (++index < length) {
	          array[index] = args[start + index];
	        }
	        switch (start) {
	          case 0: return func.call(this, array);
	          case 1: return func.call(this, args[0], array);
	          case 2: return func.call(this, args[0], args[1], array);
	        }
	        var otherArgs = Array(start + 1);
	        index = -1;
	        while (++index < start) {
	          otherArgs[index] = args[index];
	        }
	        otherArgs[start] = array;
	        return apply(func, this, otherArgs);
	      };
	    }
	
	    /**
	     * Creates a function that invokes `func` with the `this` binding of the created
	     * function and an array of arguments much like [`Function#apply`](https://es5.github.io/#x15.3.4.3).
	     *
	     * **Note:** This method is based on the [spread operator](https://mdn.io/spread_operator).
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to spread arguments over.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var say = _.spread(function(who, what) {
	     *   return who + ' says ' + what;
	     * });
	     *
	     * say(['fred', 'hello']);
	     * // => 'fred says hello'
	     *
	     * // with a Promise
	     * var numbers = Promise.all([
	     *   Promise.resolve(40),
	     *   Promise.resolve(36)
	     * ]);
	     *
	     * numbers.then(_.spread(function(x, y) {
	     *   return x + y;
	     * }));
	     * // => a Promise of 76
	     */
	    function spread(func) {
	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      return function(array) {
	        return apply(func, this, array);
	      };
	    }
	
	    /**
	     * Creates a throttled function that only invokes `func` at most once per
	     * every `wait` milliseconds. The throttled function comes with a `cancel`
	     * method to cancel delayed `func` invocations and a `flush` method to
	     * immediately invoke them. Provide an options object to indicate whether
	     * `func` should be invoked on the leading and/or trailing edge of the `wait`
	     * timeout. The `func` is invoked with the last arguments provided to the
	     * throttled function. Subsequent calls to the throttled function return the
	     * result of the last `func` invocation.
	     *
	     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
	     * on the trailing edge of the timeout only if the the throttled function is
	     * invoked more than once during the `wait` timeout.
	     *
	     * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
	     * for details over the differences between `_.throttle` and `_.debounce`.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to throttle.
	     * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
	     * @param {Object} [options] The options object.
	     * @param {boolean} [options.leading=true] Specify invoking on the leading
	     *  edge of the timeout.
	     * @param {boolean} [options.trailing=true] Specify invoking on the trailing
	     *  edge of the timeout.
	     * @returns {Function} Returns the new throttled function.
	     * @example
	     *
	     * // avoid excessively updating the position while scrolling
	     * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
	     *
	     * // invoke `renewToken` when the click event is fired, but not more than once every 5 minutes
	     * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
	     * jQuery(element).on('click', throttled);
	     *
	     * // cancel a trailing throttled invocation
	     * jQuery(window).on('popstate', throttled.cancel);
	     */
	    function throttle(func, wait, options) {
	      var leading = true,
	          trailing = true;
	
	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      if (isObject(options)) {
	        leading = 'leading' in options ? !!options.leading : leading;
	        trailing = 'trailing' in options ? !!options.trailing : trailing;
	      }
	      return debounce(func, wait, { 'leading': leading, 'maxWait': wait, 'trailing': trailing });
	    }
	
	    /**
	     * Creates a function that accepts up to one argument, ignoring any
	     * additional arguments.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to cap arguments for.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * _.map(['6', '8', '10'], _.unary(parseInt));
	     * // => [6, 8, 10]
	     */
	    function unary(func) {
	      return ary(func, 1);
	    }
	
	    /**
	     * Creates a function that provides `value` to the wrapper function as its
	     * first argument. Any additional arguments provided to the function are
	     * appended to those provided to the wrapper function. The wrapper is invoked
	     * with the `this` binding of the created function.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {*} value The value to wrap.
	     * @param {Function} wrapper The wrapper function.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var p = _.wrap(_.escape, function(func, text) {
	     *   return '<p>' + func(text) + '</p>';
	     * });
	     *
	     * p('fred, barney, & pebbles');
	     * // => '<p>fred, barney, &amp; pebbles</p>'
	     */
	    function wrap(value, wrapper) {
	      wrapper = wrapper == null ? identity : wrapper;
	      return partial(wrapper, value);
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Creates a shallow clone of `value`.
	     *
	     * **Note:** This method is loosely based on the
	     * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
	     * and supports cloning arrays, array buffers, booleans, date objects, maps,
	     * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
	     * arrays. The own enumerable properties of `arguments` objects are cloned
	     * as plain objects. An empty object is returned for uncloneable values such
	     * as error objects, functions, DOM nodes, and WeakMaps.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to clone.
	     * @returns {*} Returns the cloned value.
	     * @example
	     *
	     * var objects = [{ 'a': 1 }, { 'b': 2 }];
	     *
	     * var shallow = _.clone(objects);
	     * console.log(shallow[0] === objects[0]);
	     * // => true
	     */
	    function clone(value) {
	      return baseClone(value);
	    }
	
	    /**
	     * This method is like `_.clone` except that it accepts `customizer` which
	     * is invoked to produce the cloned value. If `customizer` returns `undefined`
	     * cloning is handled by the method instead. The `customizer` is invoked with
	     * up to four arguments; (value [, index|key, object, stack]).
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to clone.
	     * @param {Function} [customizer] The function to customize cloning.
	     * @returns {*} Returns the cloned value.
	     * @example
	     *
	     * function customizer(value) {
	     *   if (_.isElement(value)) {
	     *     return value.cloneNode(false);
	     *   }
	     * }
	     *
	     * var el = _.cloneWith(document.body, customizer);
	     *
	     * console.log(el === document.body);
	     * // => false
	     * console.log(el.nodeName);
	     * // => 'BODY'
	     * console.log(el.childNodes.length);
	     * // => 0
	     */
	    function cloneWith(value, customizer) {
	      return baseClone(value, false, customizer);
	    }
	
	    /**
	     * This method is like `_.clone` except that it recursively clones `value`.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to recursively clone.
	     * @returns {*} Returns the deep cloned value.
	     * @example
	     *
	     * var objects = [{ 'a': 1 }, { 'b': 2 }];
	     *
	     * var deep = _.cloneDeep(objects);
	     * console.log(deep[0] === objects[0]);
	     * // => false
	     */
	    function cloneDeep(value) {
	      return baseClone(value, true);
	    }
	
	    /**
	     * This method is like `_.cloneWith` except that it recursively clones `value`.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to recursively clone.
	     * @param {Function} [customizer] The function to customize cloning.
	     * @returns {*} Returns the deep cloned value.
	     * @example
	     *
	     * function customizer(value) {
	     *   if (_.isElement(value)) {
	     *     return value.cloneNode(true);
	     *   }
	     * }
	     *
	     * var el = _.cloneDeepWith(document.body, customizer);
	     *
	     * console.log(el === document.body);
	     * // => false
	     * console.log(el.nodeName);
	     * // => 'BODY'
	     * console.log(el.childNodes.length);
	     * // => 20
	     */
	    function cloneDeepWith(value, customizer) {
	      return baseClone(value, true, customizer);
	    }
	
	    /**
	     * Performs a [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	     * comparison between two values to determine if they are equivalent.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to compare.
	     * @param {*} other The other value to compare.
	     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	     * @example
	     *
	     * var object = { 'user': 'fred' };
	     * var other = { 'user': 'fred' };
	     *
	     * _.eq(object, object);
	     * // => true
	     *
	     * _.eq(object, other);
	     * // => false
	     *
	     * _.eq('a', 'a');
	     * // => true
	     *
	     * _.eq('a', Object('a'));
	     * // => false
	     *
	     * _.eq(NaN, NaN);
	     * // => true
	     */
	    function eq(value, other) {
	      return value === other || (value !== value && other !== other);
	    }
	
	    /**
	     * Checks if `value` is greater than `other`.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to compare.
	     * @param {*} other The other value to compare.
	     * @returns {boolean} Returns `true` if `value` is greater than `other`, else `false`.
	     * @example
	     *
	     * _.gt(3, 1);
	     * // => true
	     *
	     * _.gt(3, 3);
	     * // => false
	     *
	     * _.gt(1, 3);
	     * // => false
	     */
	    function gt(value, other) {
	      return value > other;
	    }
	
	    /**
	     * Checks if `value` is greater than or equal to `other`.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to compare.
	     * @param {*} other The other value to compare.
	     * @returns {boolean} Returns `true` if `value` is greater than or equal to `other`, else `false`.
	     * @example
	     *
	     * _.gte(3, 1);
	     * // => true
	     *
	     * _.gte(3, 3);
	     * // => true
	     *
	     * _.gte(1, 3);
	     * // => false
	     */
	    function gte(value, other) {
	      return value >= other;
	    }
	
	    /**
	     * Checks if `value` is likely an `arguments` object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isArguments(function() { return arguments; }());
	     * // => true
	     *
	     * _.isArguments([1, 2, 3]);
	     * // => false
	     */
	    function isArguments(value) {
	      // Safari 8.1 incorrectly makes `arguments.callee` enumerable in strict mode.
	      return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
	        (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
	    }
	
	    /**
	     * Checks if `value` is classified as an `Array` object.
	     *
	     * @static
	     * @memberOf _
	     * @type Function
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isArray([1, 2, 3]);
	     * // => true
	     *
	     * _.isArray(document.body.children);
	     * // => false
	     *
	     * _.isArray('abc');
	     * // => false
	     *
	     * _.isArray(_.noop);
	     * // => false
	     */
	    var isArray = Array.isArray;
	
	    /**
	     * Checks if `value` is array-like. A value is considered array-like if it's
	     * not a function and has a `value.length` that's an integer greater than or
	     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	     *
	     * @static
	     * @memberOf _
	     * @type Function
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	     * @example
	     *
	     * _.isArrayLike([1, 2, 3]);
	     * // => true
	     *
	     * _.isArrayLike(document.body.children);
	     * // => true
	     *
	     * _.isArrayLike('abc');
	     * // => true
	     *
	     * _.isArrayLike(_.noop);
	     * // => false
	     */
	    function isArrayLike(value) {
	      return value != null &&
	        !(typeof value == 'function' && isFunction(value)) && isLength(getLength(value));
	    }
	
	    /**
	     * This method is like `_.isArrayLike` except that it also checks if `value`
	     * is an object.
	     *
	     * @static
	     * @memberOf _
	     * @type Function
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is an array-like object, else `false`.
	     * @example
	     *
	     * _.isArrayLikeObject([1, 2, 3]);
	     * // => true
	     *
	     * _.isArrayLikeObject(document.body.children);
	     * // => true
	     *
	     * _.isArrayLikeObject('abc');
	     * // => false
	     *
	     * _.isArrayLikeObject(_.noop);
	     * // => false
	     */
	    function isArrayLikeObject(value) {
	      return isObjectLike(value) && isArrayLike(value);
	    }
	
	    /**
	     * Checks if `value` is classified as a boolean primitive or object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isBoolean(false);
	     * // => true
	     *
	     * _.isBoolean(null);
	     * // => false
	     */
	    function isBoolean(value) {
	      return value === true || value === false ||
	        (isObjectLike(value) && objectToString.call(value) == boolTag);
	    }
	
	    /**
	     * Checks if `value` is classified as a `Date` object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isDate(new Date);
	     * // => true
	     *
	     * _.isDate('Mon April 23 2012');
	     * // => false
	     */
	    function isDate(value) {
	      return isObjectLike(value) && objectToString.call(value) == dateTag;
	    }
	
	    /**
	     * Checks if `value` is likely a DOM element.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
	     * @example
	     *
	     * _.isElement(document.body);
	     * // => true
	     *
	     * _.isElement('<body>');
	     * // => false
	     */
	    function isElement(value) {
	      return !!value && value.nodeType === 1 && isObjectLike(value) && !isPlainObject(value);
	    }
	
	    /**
	     * Checks if `value` is empty. A value is considered empty unless it's an
	     * `arguments` object, array, string, or jQuery-like collection with a length
	     * greater than `0` or an object with own enumerable properties.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {Array|Object|string} value The value to inspect.
	     * @returns {boolean} Returns `true` if `value` is empty, else `false`.
	     * @example
	     *
	     * _.isEmpty(null);
	     * // => true
	     *
	     * _.isEmpty(true);
	     * // => true
	     *
	     * _.isEmpty(1);
	     * // => true
	     *
	     * _.isEmpty([1, 2, 3]);
	     * // => false
	     *
	     * _.isEmpty({ 'a': 1 });
	     * // => false
	     */
	    function isEmpty(value) {
	      if (isArrayLike(value) &&
	          (isArray(value) || isString(value) || isFunction(value.splice) || isArguments(value))) {
	        return !value.length;
	      }
	      for (var key in value) {
	        if (hasOwnProperty.call(value, key)) {
	          return false;
	        }
	      }
	      return true;
	    }
	
	    /**
	     * Performs a deep comparison between two values to determine if they are
	     * equivalent.
	     *
	     * **Note:** This method supports comparing arrays, array buffers, booleans,
	     * date objects, error objects, maps, numbers, `Object` objects, regexes,
	     * sets, strings, symbols, and typed arrays. `Object` objects are compared
	     * by their own, not inherited, enumerable properties. Functions and DOM
	     * nodes are **not** supported.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to compare.
	     * @param {*} other The other value to compare.
	     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	     * @example
	     *
	     * var object = { 'user': 'fred' };
	     * var other = { 'user': 'fred' };
	     *
	     * _.isEqual(object, other);
	     * // => true
	     *
	     * object === other;
	     * // => false
	     */
	    function isEqual(value, other) {
	      return baseIsEqual(value, other);
	    }
	
	    /**
	     * This method is like `_.isEqual` except that it accepts `customizer` which is
	     * invoked to compare values. If `customizer` returns `undefined` comparisons are
	     * handled by the method instead. The `customizer` is invoked with up to six arguments:
	     * (objValue, othValue [, index|key, object, other, stack]).
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to compare.
	     * @param {*} other The other value to compare.
	     * @param {Function} [customizer] The function to customize comparisons.
	     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	     * @example
	     *
	     * function isGreeting(value) {
	     *   return /^h(?:i|ello)$/.test(value);
	     * }
	     *
	     * function customizer(objValue, othValue) {
	     *   if (isGreeting(objValue) && isGreeting(othValue)) {
	     *     return true;
	     *   }
	     * }
	     *
	     * var array = ['hello', 'goodbye'];
	     * var other = ['hi', 'goodbye'];
	     *
	     * _.isEqualWith(array, other, customizer);
	     * // => true
	     */
	    function isEqualWith(value, other, customizer) {
	      customizer = typeof customizer == 'function' ? customizer : undefined;
	      var result = customizer ? customizer(value, other) : undefined;
	      return result === undefined ? baseIsEqual(value, other, customizer) : !!result;
	    }
	
	    /**
	     * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
	     * `SyntaxError`, `TypeError`, or `URIError` object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
	     * @example
	     *
	     * _.isError(new Error);
	     * // => true
	     *
	     * _.isError(Error);
	     * // => false
	     */
	    function isError(value) {
	      return isObjectLike(value) &&
	        typeof value.message == 'string' && objectToString.call(value) == errorTag;
	    }
	
	    /**
	     * Checks if `value` is a finite primitive number.
	     *
	     * **Note:** This method is based on [`Number.isFinite`](https://mdn.io/Number/isFinite).
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
	     * @example
	     *
	     * _.isFinite(3);
	     * // => true
	     *
	     * _.isFinite(Number.MAX_VALUE);
	     * // => true
	     *
	     * _.isFinite(3.14);
	     * // => true
	     *
	     * _.isFinite(Infinity);
	     * // => false
	     */
	    function isFinite(value) {
	      return typeof value == 'number' && nativeIsFinite(value);
	    }
	
	    /**
	     * Checks if `value` is classified as a `Function` object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isFunction(_);
	     * // => true
	     *
	     * _.isFunction(/abc/);
	     * // => false
	     */
	    function isFunction(value) {
	      // The use of `Object#toString` avoids issues with the `typeof` operator
	      // in Safari 8 which returns 'object' for typed array constructors, and
	      // PhantomJS 1.9 which returns 'function' for `NodeList` instances.
	      var tag = isObject(value) ? objectToString.call(value) : '';
	      return tag == funcTag || tag == genTag;
	    }
	
	    /**
	     * Checks if `value` is an integer.
	     *
	     * **Note:** This method is based on [`Number.isInteger`](https://mdn.io/Number/isInteger).
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is an integer, else `false`.
	     * @example
	     *
	     * _.isInteger(3);
	     * // => true
	     *
	     * _.isInteger(Number.MIN_VALUE);
	     * // => false
	     *
	     * _.isInteger(Infinity);
	     * // => false
	     *
	     * _.isInteger('3');
	     * // => false
	     */
	    function isInteger(value) {
	      return typeof value == 'number' && value == toInteger(value);
	    }
	
	    /**
	     * Checks if `value` is a valid array-like length.
	     *
	     * **Note:** This function is loosely based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	     * @example
	     *
	     * _.isLength(3);
	     * // => true
	     *
	     * _.isLength(Number.MIN_VALUE);
	     * // => false
	     *
	     * _.isLength(Infinity);
	     * // => false
	     *
	     * _.isLength('3');
	     * // => false
	     */
	    function isLength(value) {
	      return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	    }
	
	    /**
	     * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	     * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	     * @example
	     *
	     * _.isObject({});
	     * // => true
	     *
	     * _.isObject([1, 2, 3]);
	     * // => true
	     *
	     * _.isObject(_.noop);
	     * // => true
	     *
	     * _.isObject(null);
	     * // => false
	     */
	    function isObject(value) {
	      var type = typeof value;
	      return !!value && (type == 'object' || type == 'function');
	    }
	
	    /**
	     * Checks if `value` is object-like. A value is object-like if it's not `null`
	     * and has a `typeof` result of "object".
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	     * @example
	     *
	     * _.isObjectLike({});
	     * // => true
	     *
	     * _.isObjectLike([1, 2, 3]);
	     * // => true
	     *
	     * _.isObjectLike(_.noop);
	     * // => false
	     *
	     * _.isObjectLike(null);
	     * // => false
	     */
	    function isObjectLike(value) {
	      return !!value && typeof value == 'object';
	    }
	
	    /**
	     * Performs a deep comparison between `object` and `source` to determine if
	     * `object` contains equivalent property values.
	     *
	     * **Note:** This method supports comparing the same values as `_.isEqual`.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {Object} object The object to inspect.
	     * @param {Object} source The object of property values to match.
	     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
	     * @example
	     *
	     * var object = { 'user': 'fred', 'age': 40 };
	     *
	     * _.isMatch(object, { 'age': 40 });
	     * // => true
	     *
	     * _.isMatch(object, { 'age': 36 });
	     * // => false
	     */
	    function isMatch(object, source) {
	      return object === source || baseIsMatch(object, source, getMatchData(source));
	    }
	
	    /**
	     * This method is like `_.isMatch` except that it accepts `customizer` which
	     * is invoked to compare values. If `customizer` returns `undefined` comparisons
	     * are handled by the method instead. The `customizer` is invoked with five
	     * arguments: (objValue, srcValue, index|key, object, source).
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {Object} object The object to inspect.
	     * @param {Object} source The object of property values to match.
	     * @param {Function} [customizer] The function to customize comparisons.
	     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
	     * @example
	     *
	     * function isGreeting(value) {
	     *   return /^h(?:i|ello)$/.test(value);
	     * }
	     *
	     * function customizer(objValue, srcValue) {
	     *   if (isGreeting(objValue) && isGreeting(srcValue)) {
	     *     return true;
	     *   }
	     * }
	     *
	     * var object = { 'greeting': 'hello' };
	     * var source = { 'greeting': 'hi' };
	     *
	     * _.isMatchWith(object, source, customizer);
	     * // => true
	     */
	    function isMatchWith(object, source, customizer) {
	      customizer = typeof customizer == 'function' ? customizer : undefined;
	      return baseIsMatch(object, source, getMatchData(source), customizer);
	    }
	
	    /**
	     * Checks if `value` is `NaN`.
	     *
	     * **Note:** This method is not the same as [`isNaN`](https://es5.github.io/#x15.1.2.4)
	     * which returns `true` for `undefined` and other non-numeric values.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
	     * @example
	     *
	     * _.isNaN(NaN);
	     * // => true
	     *
	     * _.isNaN(new Number(NaN));
	     * // => true
	     *
	     * isNaN(undefined);
	     * // => true
	     *
	     * _.isNaN(undefined);
	     * // => false
	     */
	    function isNaN(value) {
	      // An `NaN` primitive is the only value that is not equal to itself.
	      // Perform the `toStringTag` check first to avoid errors with some ActiveX objects in IE.
	      return isNumber(value) && value != +value;
	    }
	
	    /**
	     * Checks if `value` is a native function.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	     * @example
	     *
	     * _.isNative(Array.prototype.push);
	     * // => true
	     *
	     * _.isNative(_);
	     * // => false
	     */
	    function isNative(value) {
	      if (value == null) {
	        return false;
	      }
	      if (isFunction(value)) {
	        return reIsNative.test(funcToString.call(value));
	      }
	      return isObjectLike(value) &&
	        (isHostObject(value) ? reIsNative : reIsHostCtor).test(value);
	    }
	
	    /**
	     * Checks if `value` is `null`.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
	     * @example
	     *
	     * _.isNull(null);
	     * // => true
	     *
	     * _.isNull(void 0);
	     * // => false
	     */
	    function isNull(value) {
	      return value === null;
	    }
	
	    /**
	     * Checks if `value` is `null` or `undefined`.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
	     * @example
	     *
	     * _.isNil(null);
	     * // => true
	     *
	     * _.isNil(void 0);
	     * // => true
	     *
	     * _.isNil(NaN);
	     * // => false
	     */
	    function isNil(value) {
	      return value == null;
	    }
	
	    /**
	     * Checks if `value` is classified as a `Number` primitive or object.
	     *
	     * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are classified
	     * as numbers, use the `_.isFinite` method.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isNumber(3);
	     * // => true
	     *
	     * _.isNumber(Number.MIN_VALUE);
	     * // => true
	     *
	     * _.isNumber(Infinity);
	     * // => true
	     *
	     * _.isNumber('3');
	     * // => false
	     */
	    function isNumber(value) {
	      return typeof value == 'number' ||
	        (isObjectLike(value) && objectToString.call(value) == numberTag);
	    }
	
	    /**
	     * Checks if `value` is a plain object, that is, an object created by the
	     * `Object` constructor or one with a `[[Prototype]]` of `null`.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     * }
	     *
	     * _.isPlainObject(new Foo);
	     * // => false
	     *
	     * _.isPlainObject([1, 2, 3]);
	     * // => false
	     *
	     * _.isPlainObject({ 'x': 0, 'y': 0 });
	     * // => true
	     *
	     * _.isPlainObject(Object.create(null));
	     * // => true
	     */
	    function isPlainObject(value) {
	      if (!isObjectLike(value) || objectToString.call(value) != objectTag || isHostObject(value)) {
	        return false;
	      }
	      var proto = objectProto;
	      if (typeof value.constructor == 'function') {
	        proto = getPrototypeOf(value);
	      }
	      if (proto === null) {
	        return true;
	      }
	      var Ctor = proto.constructor;
	      return (typeof Ctor == 'function' &&
	        Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
	    }
	
	    /**
	     * Checks if `value` is classified as a `RegExp` object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isRegExp(/abc/);
	     * // => true
	     *
	     * _.isRegExp('/abc/');
	     * // => false
	     */
	    function isRegExp(value) {
	      return isObject(value) && objectToString.call(value) == regexpTag;
	    }
	
	    /**
	     * Checks if `value` is a safe integer. An integer is safe if it's an IEEE-754
	     * double precision number which isn't the result of a rounded unsafe integer.
	     *
	     * **Note:** This method is based on [`Number.isSafeInteger`](https://mdn.io/Number/isSafeInteger).
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a safe integer, else `false`.
	     * @example
	     *
	     * _.isSafeInteger(3);
	     * // => true
	     *
	     * _.isSafeInteger(Number.MIN_VALUE);
	     * // => false
	     *
	     * _.isSafeInteger(Infinity);
	     * // => false
	     *
	     * _.isSafeInteger('3');
	     * // => false
	     */
	    function isSafeInteger(value) {
	      return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
	    }
	
	    /**
	     * Checks if `value` is classified as a `String` primitive or object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isString('abc');
	     * // => true
	     *
	     * _.isString(1);
	     * // => false
	     */
	    function isString(value) {
	      return typeof value == 'string' ||
	        (!isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag);
	    }
	
	    /**
	     * Checks if `value` is classified as a `Symbol` primitive or object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isSymbol(Symbol.iterator);
	     * // => true
	     *
	     * _.isSymbol('abc');
	     * // => false
	     */
	    function isSymbol(value) {
	      return typeof value == 'symbol' ||
	        (isObjectLike(value) && objectToString.call(value) == symbolTag);
	    }
	
	    /**
	     * Checks if `value` is classified as a typed array.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isTypedArray(new Uint8Array);
	     * // => true
	     *
	     * _.isTypedArray([]);
	     * // => false
	     */
	    function isTypedArray(value) {
	      return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
	    }
	
	    /**
	     * Checks if `value` is `undefined`.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
	     * @example
	     *
	     * _.isUndefined(void 0);
	     * // => true
	     *
	     * _.isUndefined(null);
	     * // => false
	     */
	    function isUndefined(value) {
	      return value === undefined;
	    }
	
	    /**
	     * Checks if `value` is less than `other`.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to compare.
	     * @param {*} other The other value to compare.
	     * @returns {boolean} Returns `true` if `value` is less than `other`, else `false`.
	     * @example
	     *
	     * _.lt(1, 3);
	     * // => true
	     *
	     * _.lt(3, 3);
	     * // => false
	     *
	     * _.lt(3, 1);
	     * // => false
	     */
	    function lt(value, other) {
	      return value < other;
	    }
	
	    /**
	     * Checks if `value` is less than or equal to `other`.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to compare.
	     * @param {*} other The other value to compare.
	     * @returns {boolean} Returns `true` if `value` is less than or equal to `other`, else `false`.
	     * @example
	     *
	     * _.lte(1, 3);
	     * // => true
	     *
	     * _.lte(3, 3);
	     * // => true
	     *
	     * _.lte(3, 1);
	     * // => false
	     */
	    function lte(value, other) {
	      return value <= other;
	    }
	
	    /**
	     * Converts `value` to an array.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to convert.
	     * @returns {Array} Returns the converted array.
	     * @example
	     *
	     * _.toArray({ 'a': 1, 'b': 2 });
	     * // => [1, 2]
	     *
	     * _.toArray('abc');
	     * // => ['a', 'b', 'c']
	     *
	     * _.toArray(1);
	     * // => []
	     *
	     * _.toArray(null);
	     * // => []
	     */
	    function toArray(value) {
	      if (!value) {
	        return [];
	      }
	      if (isArrayLike(value)) {
	        return isString(value) ? stringToArray(value) : copyArray(value);
	      }
	      if (iteratorSymbol && value[iteratorSymbol]) {
	        return iteratorToArray(value[iteratorSymbol]());
	      }
	      var tag = getTag(value),
	          func = tag == mapTag ? mapToArray : (tag == setTag ? setToArray : values);
	
	      return func(value);
	    }
	
	    /**
	     * Converts `value` to an integer.
	     *
	     * **Note:** This function is loosely based on [`ToInteger`](http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger).
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to convert.
	     * @returns {number} Returns the converted integer.
	     * @example
	     *
	     * _.toInteger(3);
	     * // => 3
	     *
	     * _.toInteger(Number.MIN_VALUE);
	     * // => 0
	     *
	     * _.toInteger(Infinity);
	     * // => 1.7976931348623157e+308
	     *
	     * _.toInteger('3');
	     * // => 3
	     */
	    function toInteger(value) {
	      if (!value) {
	        return value === 0 ? value : 0;
	      }
	      value = toNumber(value);
	      if (value === INFINITY || value === -INFINITY) {
	        var sign = (value < 0 ? -1 : 1);
	        return sign * MAX_INTEGER;
	      }
	      var remainder = value % 1;
	      return value === value ? (remainder ? value - remainder : value) : 0;
	    }
	
	    /**
	     * Converts `value` to an integer suitable for use as the length of an
	     * array-like object.
	     *
	     * **Note:** This method is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to convert.
	     * @returns {number} Returns the converted integer.
	     * @example
	     *
	     * _.toLength(3);
	     * // => 3
	     *
	     * _.toLength(Number.MIN_VALUE);
	     * // => 0
	     *
	     * _.toLength(Infinity);
	     * // => 4294967295
	     *
	     * _.toLength('3');
	     * // => 3
	     */
	    function toLength(value) {
	      return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
	    }
	
	    /**
	     * Converts `value` to a number.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to process.
	     * @returns {number} Returns the number.
	     * @example
	     *
	     * _.toNumber(3);
	     * // => 3
	     *
	     * _.toNumber(Number.MIN_VALUE);
	     * // => 5e-324
	     *
	     * _.toNumber(Infinity);
	     * // => Infinity
	     *
	     * _.toNumber('3');
	     * // => 3
	     */
	    function toNumber(value) {
	      if (isObject(value)) {
	        var other = isFunction(value.valueOf) ? value.valueOf() : value;
	        value = isObject(other) ? (other + '') : other;
	      }
	      if (typeof value != 'string') {
	        return value === 0 ? value : +value;
	      }
	      value = value.replace(reTrim, '');
	      var isBinary = reIsBinary.test(value);
	      return (isBinary || reIsOctal.test(value))
	        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
	        : (reIsBadHex.test(value) ? NAN : +value);
	    }
	
	    /**
	     * Converts `value` to a plain object flattening inherited enumerable
	     * properties of `value` to own properties of the plain object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to convert.
	     * @returns {Object} Returns the converted plain object.
	     * @example
	     *
	     * function Foo() {
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.assign({ 'a': 1 }, new Foo);
	     * // => { 'a': 1, 'b': 2 }
	     *
	     * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
	     * // => { 'a': 1, 'b': 2, 'c': 3 }
	     */
	    function toPlainObject(value) {
	      return copyObject(value, keysIn(value));
	    }
	
	    /**
	     * Converts `value` to a safe integer. A safe integer can be compared and
	     * represented correctly.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to convert.
	     * @returns {number} Returns the converted integer.
	     * @example
	     *
	     * _.toSafeInteger(3);
	     * // => 3
	     *
	     * _.toSafeInteger(Number.MIN_VALUE);
	     * // => 0
	     *
	     * _.toSafeInteger(Infinity);
	     * // => 9007199254740991
	     *
	     * _.toSafeInteger('3');
	     * // => 3
	     */
	    function toSafeInteger(value) {
	      return baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
	    }
	
	    /**
	     * Converts `value` to a string if it's not one. An empty string is returned
	     * for `null` and `undefined` values. The sign of `-0` is preserved.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to process.
	     * @returns {string} Returns the string.
	     * @example
	     *
	     * _.toString(null);
	     * // => ''
	     *
	     * _.toString(-0);
	     * // => '-0'
	     *
	     * _.toString([1, 2, 3]);
	     * // => '1,2,3'
	     */
	    function toString(value) {
	      // Exit early for strings to avoid a performance hit in some environments.
	      if (typeof value == 'string') {
	        return value;
	      }
	      if (value == null) {
	        return '';
	      }
	      if (isSymbol(value)) {
	        return Symbol ? symbolToString.call(value) : '';
	      }
	      var result = (value + '');
	      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Assigns own enumerable properties of source objects to the destination
	     * object. Source objects are applied from left to right. Subsequent sources
	     * overwrite property assignments of previous sources.
	     *
	     * **Note:** This method mutates `object` and is loosely based on
	     * [`Object.assign`](https://mdn.io/Object/assign).
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The destination object.
	     * @param {...Object} [sources] The source objects.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * function Foo() {
	     *   this.c = 3;
	     * }
	     *
	     * function Bar() {
	     *   this.e = 5;
	     * }
	     *
	     * Foo.prototype.d = 4;
	     * Bar.prototype.f = 6;
	     *
	     * _.assign({ 'a': 1 }, new Foo, new Bar);
	     * // => { 'a': 1, 'c': 3, 'e': 5 }
	     */
	    var assign = createAssigner(function(object, source) {
	      copyObject(source, keys(source), object);
	    });
	
	    /**
	     * This method is like `_.assign` except that it iterates over own and
	     * inherited source properties.
	     *
	     * **Note:** This method mutates `object`.
	     *
	     * @static
	     * @memberOf _
	     * @alias extend
	     * @category Object
	     * @param {Object} object The destination object.
	     * @param {...Object} [sources] The source objects.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * function Foo() {
	     *   this.b = 2;
	     * }
	     *
	     * function Bar() {
	     *   this.d = 4;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     * Bar.prototype.e = 5;
	     *
	     * _.assignIn({ 'a': 1 }, new Foo, new Bar);
	     * // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5 }
	     */
	    var assignIn = createAssigner(function(object, source) {
	      copyObject(source, keysIn(source), object);
	    });
	
	    /**
	     * This method is like `_.assignIn` except that it accepts `customizer` which
	     * is invoked to produce the assigned values. If `customizer` returns `undefined`
	     * assignment is handled by the method instead. The `customizer` is invoked
	     * with five arguments: (objValue, srcValue, key, object, source).
	     *
	     * **Note:** This method mutates `object`.
	     *
	     * @static
	     * @memberOf _
	     * @alias extendWith
	     * @category Object
	     * @param {Object} object The destination object.
	     * @param {...Object} sources The source objects.
	     * @param {Function} [customizer] The function to customize assigned values.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * function customizer(objValue, srcValue) {
	     *   return _.isUndefined(objValue) ? srcValue : objValue;
	     * }
	     *
	     * var defaults = _.partialRight(_.assignInWith, customizer);
	     *
	     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
	     * // => { 'a': 1, 'b': 2 }
	     */
	    var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
	      copyObjectWith(source, keysIn(source), object, customizer);
	    });
	
	    /**
	     * This method is like `_.assign` except that it accepts `customizer` which
	     * is invoked to produce the assigned values. If `customizer` returns `undefined`
	     * assignment is handled by the method instead. The `customizer` is invoked
	     * with five arguments: (objValue, srcValue, key, object, source).
	     *
	     * **Note:** This method mutates `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The destination object.
	     * @param {...Object} sources The source objects.
	     * @param {Function} [customizer] The function to customize assigned values.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * function customizer(objValue, srcValue) {
	     *   return _.isUndefined(objValue) ? srcValue : objValue;
	     * }
	     *
	     * var defaults = _.partialRight(_.assignWith, customizer);
	     *
	     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
	     * // => { 'a': 1, 'b': 2 }
	     */
	    var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
	      copyObjectWith(source, keys(source), object, customizer);
	    });
	
	    /**
	     * Creates an array of values corresponding to `paths` of `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to iterate over.
	     * @param {...(string|string[])} [paths] The property paths of elements to pick,
	     *  specified individually or in arrays.
	     * @returns {Array} Returns the new array of picked elements.
	     * @example
	     *
	     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
	     *
	     * _.at(object, ['a[0].b.c', 'a[1]']);
	     * // => [3, 4]
	     *
	     * _.at(['a', 'b', 'c'], 0, 2);
	     * // => ['a', 'c']
	     */
	    var at = rest(function(object, paths) {
	      return baseAt(object, baseFlatten(paths));
	    });
	
	    /**
	     * Creates an object that inherits from the `prototype` object. If a `properties`
	     * object is provided its own enumerable properties are assigned to the created object.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} prototype The object to inherit from.
	     * @param {Object} [properties] The properties to assign to the object.
	     * @returns {Object} Returns the new object.
	     * @example
	     *
	     * function Shape() {
	     *   this.x = 0;
	     *   this.y = 0;
	     * }
	     *
	     * function Circle() {
	     *   Shape.call(this);
	     * }
	     *
	     * Circle.prototype = _.create(Shape.prototype, {
	     *   'constructor': Circle
	     * });
	     *
	     * var circle = new Circle;
	     * circle instanceof Circle;
	     * // => true
	     *
	     * circle instanceof Shape;
	     * // => true
	     */
	    function create(prototype, properties) {
	      var result = baseCreate(prototype);
	      return properties ? baseAssign(result, properties) : result;
	    }
	
	    /**
	     * Assigns own and inherited enumerable properties of source objects to the
	     * destination object for all destination properties that resolve to `undefined`.
	     * Source objects are applied from left to right. Once a property is set,
	     * additional values of the same property are ignored.
	     *
	     * **Note:** This method mutates `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The destination object.
	     * @param {...Object} [sources] The source objects.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * _.defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
	     * // => { 'user': 'barney', 'age': 36 }
	     */
	    var defaults = rest(function(args) {
	      args.push(undefined, assignInDefaults);
	      return apply(assignInWith, undefined, args);
	    });
	
	    /**
	     * This method is like `_.defaults` except that it recursively assigns
	     * default properties.
	     *
	     * **Note:** This method mutates `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The destination object.
	     * @param {...Object} [sources] The source objects.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * _.defaultsDeep({ 'user': { 'name': 'barney' } }, { 'user': { 'name': 'fred', 'age': 36 } });
	     * // => { 'user': { 'name': 'barney', 'age': 36 } }
	     *
	     */
	    var defaultsDeep = rest(function(args) {
	      args.push(undefined, mergeDefaults);
	      return apply(mergeWith, undefined, args);
	    });
	
	    /**
	     * This method is like `_.find` except that it returns the key of the first
	     * element `predicate` returns truthy for instead of the element itself.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to search.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	     * @returns {string|undefined} Returns the key of the matched element, else `undefined`.
	     * @example
	     *
	     * var users = {
	     *   'barney':  { 'age': 36, 'active': true },
	     *   'fred':    { 'age': 40, 'active': false },
	     *   'pebbles': { 'age': 1,  'active': true }
	     * };
	     *
	     * _.findKey(users, function(o) { return o.age < 40; });
	     * // => 'barney' (iteration order is not guaranteed)
	     *
	     * // using the `_.matches` iteratee shorthand
	     * _.findKey(users, { 'age': 1, 'active': true });
	     * // => 'pebbles'
	     *
	     * // using the `_.matchesProperty` iteratee shorthand
	     * _.findKey(users, ['active', false]);
	     * // => 'fred'
	     *
	     * // using the `_.property` iteratee shorthand
	     * _.findKey(users, 'active');
	     * // => 'barney'
	     */
	    function findKey(object, predicate) {
	      return baseFind(object, getIteratee(predicate, 3), baseForOwn, true);
	    }
	
	    /**
	     * This method is like `_.findKey` except that it iterates over elements of
	     * a collection in the opposite order.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to search.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per iteration.
	     * @returns {string|undefined} Returns the key of the matched element, else `undefined`.
	     * @example
	     *
	     * var users = {
	     *   'barney':  { 'age': 36, 'active': true },
	     *   'fred':    { 'age': 40, 'active': false },
	     *   'pebbles': { 'age': 1,  'active': true }
	     * };
	     *
	     * _.findLastKey(users, function(o) { return o.age < 40; });
	     * // => returns 'pebbles' assuming `_.findKey` returns 'barney'
	     *
	     * // using the `_.matches` iteratee shorthand
	     * _.findLastKey(users, { 'age': 36, 'active': true });
	     * // => 'barney'
	     *
	     * // using the `_.matchesProperty` iteratee shorthand
	     * _.findLastKey(users, ['active', false]);
	     * // => 'fred'
	     *
	     * // using the `_.property` iteratee shorthand
	     * _.findLastKey(users, 'active');
	     * // => 'pebbles'
	     */
	    function findLastKey(object, predicate) {
	      return baseFind(object, getIteratee(predicate, 3), baseForOwnRight, true);
	    }
	
	    /**
	     * Iterates over own and inherited enumerable properties of an object invoking
	     * `iteratee` for each property. The iteratee is invoked with three arguments:
	     * (value, key, object). Iteratee functions may exit iteration early by explicitly
	     * returning `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.forIn(new Foo, function(value, key) {
	     *   console.log(key);
	     * });
	     * // => logs 'a', 'b', then 'c' (iteration order is not guaranteed)
	     */
	    function forIn(object, iteratee) {
	      return object == null ? object : baseFor(object, toFunction(iteratee), keysIn);
	    }
	
	    /**
	     * This method is like `_.forIn` except that it iterates over properties of
	     * `object` in the opposite order.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.forInRight(new Foo, function(value, key) {
	     *   console.log(key);
	     * });
	     * // => logs 'c', 'b', then 'a' assuming `_.forIn` logs 'a', 'b', then 'c'
	     */
	    function forInRight(object, iteratee) {
	      return object == null ? object : baseForRight(object, toFunction(iteratee), keysIn);
	    }
	
	    /**
	     * Iterates over own enumerable properties of an object invoking `iteratee`
	     * for each property. The iteratee is invoked with three arguments:
	     * (value, key, object). Iteratee functions may exit iteration early by
	     * explicitly returning `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.forOwn(new Foo, function(value, key) {
	     *   console.log(key);
	     * });
	     * // => logs 'a' then 'b' (iteration order is not guaranteed)
	     */
	    function forOwn(object, iteratee) {
	      return object && baseForOwn(object, toFunction(iteratee));
	    }
	
	    /**
	     * This method is like `_.forOwn` except that it iterates over properties of
	     * `object` in the opposite order.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.forOwnRight(new Foo, function(value, key) {
	     *   console.log(key);
	     * });
	     * // => logs 'b' then 'a' assuming `_.forOwn` logs 'a' then 'b'
	     */
	    function forOwnRight(object, iteratee) {
	      return object && baseForOwnRight(object, toFunction(iteratee));
	    }
	
	    /**
	     * Creates an array of function property names from own enumerable properties
	     * of `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to inspect.
	     * @returns {Array} Returns the new array of property names.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = _.constant('a');
	     *   this.b = _.constant('b');
	     * }
	     *
	     * Foo.prototype.c = _.constant('c');
	     *
	     * _.functions(new Foo);
	     * // => ['a', 'b']
	     */
	    function functions(object) {
	      return object == null ? [] : baseFunctions(object, keys(object));
	    }
	
	    /**
	     * Creates an array of function property names from own and inherited
	     * enumerable properties of `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to inspect.
	     * @returns {Array} Returns the new array of property names.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = _.constant('a');
	     *   this.b = _.constant('b');
	     * }
	     *
	     * Foo.prototype.c = _.constant('c');
	     *
	     * _.functionsIn(new Foo);
	     * // => ['a', 'b', 'c']
	     */
	    function functionsIn(object) {
	      return object == null ? [] : baseFunctions(object, keysIn(object));
	    }
	
	    /**
	     * Gets the value at `path` of `object`. If the resolved value is
	     * `undefined` the `defaultValue` is used in its place.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @param {Array|string} path The path of the property to get.
	     * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
	     * @returns {*} Returns the resolved value.
	     * @example
	     *
	     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
	     *
	     * _.get(object, 'a[0].b.c');
	     * // => 3
	     *
	     * _.get(object, ['a', '0', 'b', 'c']);
	     * // => 3
	     *
	     * _.get(object, 'a.b.c', 'default');
	     * // => 'default'
	     */
	    function get(object, path, defaultValue) {
	      var result = object == null ? undefined : baseGet(object, path);
	      return result === undefined ? defaultValue : result;
	    }
	
	    /**
	     * Checks if `path` is a direct property of `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @param {Array|string} path The path to check.
	     * @returns {boolean} Returns `true` if `path` exists, else `false`.
	     * @example
	     *
	     * var object = { 'a': { 'b': { 'c': 3 } } };
	     * var other = _.create({ 'a': _.create({ 'b': _.create({ 'c': 3 }) }) });
	     *
	     * _.has(object, 'a');
	     * // => true
	     *
	     * _.has(object, 'a.b.c');
	     * // => true
	     *
	     * _.has(object, ['a', 'b', 'c']);
	     * // => true
	     *
	     * _.has(other, 'a');
	     * // => false
	     */
	    function has(object, path) {
	      return hasPath(object, path, baseHas);
	    }
	
	    /**
	     * Checks if `path` is a direct or inherited property of `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @param {Array|string} path The path to check.
	     * @returns {boolean} Returns `true` if `path` exists, else `false`.
	     * @example
	     *
	     * var object = _.create({ 'a': _.create({ 'b': _.create({ 'c': 3 }) }) });
	     *
	     * _.hasIn(object, 'a');
	     * // => true
	     *
	     * _.hasIn(object, 'a.b.c');
	     * // => true
	     *
	     * _.hasIn(object, ['a', 'b', 'c']);
	     * // => true
	     *
	     * _.hasIn(object, 'b');
	     * // => false
	     */
	    function hasIn(object, path) {
	      return hasPath(object, path, baseHasIn);
	    }
	
	    /**
	     * Creates an object composed of the inverted keys and values of `object`.
	     * If `object` contains duplicate values, subsequent values overwrite property
	     * assignments of previous values.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to invert.
	     * @returns {Object} Returns the new inverted object.
	     * @example
	     *
	     * var object = { 'a': 1, 'b': 2, 'c': 1 };
	     *
	     * _.invert(object);
	     * // => { '1': 'c', '2': 'b' }
	     */
	    var invert = createInverter(function(result, value, key) {
	      result[value] = key;
	    }, constant(identity));
	
	    /**
	     * This method is like `_.invert` except that the inverted object is generated
	     * from the results of running each element of `object` through `iteratee`.
	     * The corresponding inverted value of each inverted key is an array of keys
	     * responsible for generating the inverted value. The iteratee is invoked
	     * with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to invert.
	     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
	     * @returns {Object} Returns the new inverted object.
	     * @example
	     *
	     * var object = { 'a': 1, 'b': 2, 'c': 1 };
	     *
	     * _.invertBy(object);
	     * // => { '1': ['a', 'c'], '2': ['b'] }
	     *
	     * _.invertBy(object, function(value) {
	     *   return 'group' + value;
	     * });
	     * // => { 'group1': ['a', 'c'], 'group2': ['b'] }
	     */
	    var invertBy = createInverter(function(result, value, key) {
	      if (hasOwnProperty.call(result, value)) {
	        result[value].push(key);
	      } else {
	        result[value] = [key];
	      }
	    }, getIteratee);
	
	    /**
	     * Invokes the method at `path` of `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @param {Array|string} path The path of the method to invoke.
	     * @param {...*} [args] The arguments to invoke the method with.
	     * @returns {*} Returns the result of the invoked method.
	     * @example
	     *
	     * var object = { 'a': [{ 'b': { 'c': [1, 2, 3, 4] } }] };
	     *
	     * _.invoke(object, 'a[0].b.c.slice', 1, 3);
	     * // => [2, 3]
	     */
	    var invoke = rest(baseInvoke);
	
	    /**
	     * Creates an array of the own enumerable property names of `object`.
	     *
	     * **Note:** Non-object values are coerced to objects. See the
	     * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
	     * for more details.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the array of property names.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.keys(new Foo);
	     * // => ['a', 'b'] (iteration order is not guaranteed)
	     *
	     * _.keys('hi');
	     * // => ['0', '1']
	     */
	    function keys(object) {
	      var isProto = isPrototype(object);
	      if (!(isProto || isArrayLike(object))) {
	        return baseKeys(object);
	      }
	      var indexes = indexKeys(object),
	          skipIndexes = !!indexes,
	          result = indexes || [],
	          length = result.length;
	
	      for (var key in object) {
	        if (baseHas(object, key) &&
	            !(skipIndexes && (key == 'length' || isIndex(key, length))) &&
	            !(isProto && key == 'constructor')) {
	          result.push(key);
	        }
	      }
	      return result;
	    }
	
	    /**
	     * Creates an array of the own and inherited enumerable property names of `object`.
	     *
	     * **Note:** Non-object values are coerced to objects.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the array of property names.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.keysIn(new Foo);
	     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	     */
	    function keysIn(object) {
	      var index = -1,
	          isProto = isPrototype(object),
	          props = baseKeysIn(object),
	          propsLength = props.length,
	          indexes = indexKeys(object),
	          skipIndexes = !!indexes,
	          result = indexes || [],
	          length = result.length;
	
	      while (++index < propsLength) {
	        var key = props[index];
	        if (!(skipIndexes && (key == 'length' || isIndex(key, length))) &&
	            !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
	          result.push(key);
	        }
	      }
	      return result;
	    }
	
	    /**
	     * The opposite of `_.mapValues`; this method creates an object with the
	     * same values as `object` and keys generated by running each own enumerable
	     * property of `object` through `iteratee`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to iterate over.
	     * @param {Function|Object|string} [iteratee=_.identity] The function invoked per iteration.
	     * @returns {Object} Returns the new mapped object.
	     * @example
	     *
	     * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
	     *   return key + value;
	     * });
	     * // => { 'a1': 1, 'b2': 2 }
	     */
	    function mapKeys(object, iteratee) {
	      var result = {};
	      iteratee = getIteratee(iteratee, 3);
	
	      baseForOwn(object, function(value, key, object) {
	        result[iteratee(value, key, object)] = value;
	      });
	      return result;
	    }
	
	    /**
	     * Creates an object with the same keys as `object` and values generated by
	     * running each own enumerable property of `object` through `iteratee`. The
	     * iteratee function is invoked with three arguments: (value, key, object).
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to iterate over.
	     * @param {Function|Object|string} [iteratee=_.identity] The function invoked per iteration.
	     * @returns {Object} Returns the new mapped object.
	     * @example
	     *
	     * var users = {
	     *   'fred':    { 'user': 'fred',    'age': 40 },
	     *   'pebbles': { 'user': 'pebbles', 'age': 1 }
	     * };
	     *
	     * _.mapValues(users, function(o) { return o.age; });
	     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
	     *
	     * // using the `_.property` iteratee shorthand
	     * _.mapValues(users, 'age');
	     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
	     */
	    function mapValues(object, iteratee) {
	      var result = {};
	      iteratee = getIteratee(iteratee, 3);
	
	      baseForOwn(object, function(value, key, object) {
	        result[key] = iteratee(value, key, object);
	      });
	      return result;
	    }
	
	    /**
	     * Recursively merges own and inherited enumerable properties of source
	     * objects into the destination object, skipping source properties that resolve
	     * to `undefined`. Array and plain object properties are merged recursively.
	     * Other objects and value types are overridden by assignment. Source objects
	     * are applied from left to right. Subsequent sources overwrite property
	     * assignments of previous sources.
	     *
	     * **Note:** This method mutates `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The destination object.
	     * @param {...Object} [sources] The source objects.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * var users = {
	     *   'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
	     * };
	     *
	     * var ages = {
	     *   'data': [{ 'age': 36 }, { 'age': 40 }]
	     * };
	     *
	     * _.merge(users, ages);
	     * // => { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }
	     */
	    var merge = createAssigner(function(object, source, srcIndex) {
	      baseMerge(object, source, srcIndex);
	    });
	
	    /**
	     * This method is like `_.merge` except that it accepts `customizer` which
	     * is invoked to produce the merged values of the destination and source
	     * properties. If `customizer` returns `undefined` merging is handled by the
	     * method instead. The `customizer` is invoked with seven arguments:
	     * (objValue, srcValue, key, object, source, stack).
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The destination object.
	     * @param {...Object} sources The source objects.
	     * @param {Function} customizer The function to customize assigned values.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * function customizer(objValue, srcValue) {
	     *   if (_.isArray(objValue)) {
	     *     return objValue.concat(srcValue);
	     *   }
	     * }
	     *
	     * var object = {
	     *   'fruits': ['apple'],
	     *   'vegetables': ['beet']
	     * };
	     *
	     * var other = {
	     *   'fruits': ['banana'],
	     *   'vegetables': ['carrot']
	     * };
	     *
	     * _.mergeWith(object, other, customizer);
	     * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot'] }
	     */
	    var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
	      baseMerge(object, source, srcIndex, customizer);
	    });
	
	    /**
	     * The opposite of `_.pick`; this method creates an object composed of the
	     * own and inherited enumerable properties of `object` that are not omitted.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The source object.
	     * @param {...(string|string[])} [props] The property names to omit, specified
	     *  individually or in arrays..
	     * @returns {Object} Returns the new object.
	     * @example
	     *
	     * var object = { 'a': 1, 'b': '2', 'c': 3 };
	     *
	     * _.omit(object, ['a', 'c']);
	     * // => { 'b': '2' }
	     */
	    var omit = rest(function(object, props) {
	      if (object == null) {
	        return {};
	      }
	      props = arrayMap(baseFlatten(props), String);
	      return basePick(object, baseDifference(keysIn(object), props));
	    });
	
	    /**
	     * The opposite of `_.pickBy`; this method creates an object composed of the
	     * own and inherited enumerable properties of `object` that `predicate`
	     * doesn't return truthy for.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The source object.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per property.
	     * @returns {Object} Returns the new object.
	     * @example
	     *
	     * var object = { 'a': 1, 'b': '2', 'c': 3 };
	     *
	     * _.omitBy(object, _.isNumber);
	     * // => { 'b': '2' }
	     */
	    function omitBy(object, predicate) {
	      predicate = getIteratee(predicate, 2);
	      return basePickBy(object, function(value, key) {
	        return !predicate(value, key);
	      });
	    }
	
	    /**
	     * Creates an object composed of the picked `object` properties.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The source object.
	     * @param {...(string|string[])} [props] The property names to pick, specified
	     *  individually or in arrays.
	     * @returns {Object} Returns the new object.
	     * @example
	     *
	     * var object = { 'a': 1, 'b': '2', 'c': 3 };
	     *
	     * _.pick(object, ['a', 'c']);
	     * // => { 'a': 1, 'c': 3 }
	     */
	    var pick = rest(function(object, props) {
	      return object == null ? {} : basePick(object, baseFlatten(props));
	    });
	
	    /**
	     * Creates an object composed of the `object` properties `predicate` returns
	     * truthy for. The predicate is invoked with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The source object.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked per property.
	     * @returns {Object} Returns the new object.
	     * @example
	     *
	     * var object = { 'a': 1, 'b': '2', 'c': 3 };
	     *
	     * _.pickBy(object, _.isNumber);
	     * // => { 'a': 1, 'c': 3 }
	     */
	    function pickBy(object, predicate) {
	      return object == null ? {} : basePickBy(object, getIteratee(predicate, 2));
	    }
	
	    /**
	     * This method is like `_.get` except that if the resolved value is a function
	     * it's invoked with the `this` binding of its parent object and its result
	     * is returned.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @param {Array|string} path The path of the property to resolve.
	     * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
	     * @returns {*} Returns the resolved value.
	     * @example
	     *
	     * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
	     *
	     * _.result(object, 'a[0].b.c1');
	     * // => 3
	     *
	     * _.result(object, 'a[0].b.c2');
	     * // => 4
	     *
	     * _.result(object, 'a[0].b.c3', 'default');
	     * // => 'default'
	     *
	     * _.result(object, 'a[0].b.c3', _.constant('default'));
	     * // => 'default'
	     */
	    function result(object, path, defaultValue) {
	      if (!isKey(path, object)) {
	        path = baseToPath(path);
	        var result = get(object, path);
	        object = parent(object, path);
	      } else {
	        result = object == null ? undefined : object[path];
	      }
	      if (result === undefined) {
	        result = defaultValue;
	      }
	      return isFunction(result) ? result.call(object) : result;
	    }
	
	    /**
	     * Sets the value at `path` of `object`. If a portion of `path` doesn't exist
	     * it's created. Arrays are created for missing index properties while objects
	     * are created for all other missing properties. Use `_.setWith` to customize
	     * `path` creation.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to modify.
	     * @param {Array|string} path The path of the property to set.
	     * @param {*} value The value to set.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
	     *
	     * _.set(object, 'a[0].b.c', 4);
	     * console.log(object.a[0].b.c);
	     * // => 4
	     *
	     * _.set(object, 'x[0].y.z', 5);
	     * console.log(object.x[0].y.z);
	     * // => 5
	     */
	    function set(object, path, value) {
	      return object == null ? object : baseSet(object, path, value);
	    }
	
	    /**
	     * This method is like `_.set` except that it accepts `customizer` which is
	     * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
	     * path creation is handled by the method instead. The `customizer` is invoked
	     * with three arguments: (nsValue, key, nsObject).
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to modify.
	     * @param {Array|string} path The path of the property to set.
	     * @param {*} value The value to set.
	     * @param {Function} [customizer] The function to customize assigned values.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * _.setWith({ '0': { 'length': 2 } }, '[0][1][2]', 3, Object);
	     * // => { '0': { '1': { '2': 3 }, 'length': 2 } }
	     */
	    function setWith(object, path, value, customizer) {
	      customizer = typeof customizer == 'function' ? customizer : undefined;
	      return object == null ? object : baseSet(object, path, value, customizer);
	    }
	
	    /**
	     * Creates an array of own enumerable key-value pairs for `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the new array of key-value pairs.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.toPairs(new Foo);
	     * // => [['a', 1], ['b', 2]] (iteration order is not guaranteed)
	     */
	    function toPairs(object) {
	      return baseToPairs(object, keys(object));
	    }
	
	    /**
	     * Creates an array of own and inherited enumerable key-value pairs for `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the new array of key-value pairs.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.toPairsIn(new Foo);
	     * // => [['a', 1], ['b', 2], ['c', 1]] (iteration order is not guaranteed)
	     */
	    function toPairsIn(object) {
	      return baseToPairs(object, keysIn(object));
	    }
	
	    /**
	     * An alternative to `_.reduce`; this method transforms `object` to a new
	     * `accumulator` object which is the result of running each of its own enumerable
	     * properties through `iteratee`, with each invocation potentially mutating
	     * the `accumulator` object. The iteratee is invoked with four arguments:
	     * (accumulator, value, key, object). Iteratee functions may exit iteration
	     * early by explicitly returning `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Array|Object} object The object to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @param {*} [accumulator] The custom accumulator value.
	     * @returns {*} Returns the accumulated value.
	     * @example
	     *
	     * _.transform([2, 3, 4], function(result, n) {
	     *   result.push(n *= n);
	     *   return n % 2 == 0;
	     * }, []);
	     * // => [4, 9]
	     *
	     * _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
	     *   (result[value] || (result[value] = [])).push(key);
	     * }, {});
	     * // => { '1': ['a', 'c'], '2': ['b'] }
	     */
	    function transform(object, iteratee, accumulator) {
	      var isArr = isArray(object) || isTypedArray(object);
	      iteratee = getIteratee(iteratee, 4);
	
	      if (accumulator == null) {
	        if (isArr || isObject(object)) {
	          var Ctor = object.constructor;
	          if (isArr) {
	            accumulator = isArray(object) ? new Ctor : [];
	          } else {
	            accumulator = baseCreate(isFunction(Ctor) ? Ctor.prototype : undefined);
	          }
	        } else {
	          accumulator = {};
	        }
	      }
	      (isArr ? arrayEach : baseForOwn)(object, function(value, index, object) {
	        return iteratee(accumulator, value, index, object);
	      });
	      return accumulator;
	    }
	
	    /**
	     * Removes the property at `path` of `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to modify.
	     * @param {Array|string} path The path of the property to unset.
	     * @returns {boolean} Returns `true` if the property is deleted, else `false`.
	     * @example
	     *
	     * var object = { 'a': [{ 'b': { 'c': 7 } }] };
	     * _.unset(object, 'a[0].b.c');
	     * // => true
	     *
	     * console.log(object);
	     * // => { 'a': [{ 'b': {} }] };
	     *
	     * _.unset(object, 'a[0].b.c');
	     * // => true
	     *
	     * console.log(object);
	     * // => { 'a': [{ 'b': {} }] };
	     */
	    function unset(object, path) {
	      return object == null ? true : baseUnset(object, path);
	    }
	
	    /**
	     * Creates an array of the own enumerable property values of `object`.
	     *
	     * **Note:** Non-object values are coerced to objects.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the array of property values.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.values(new Foo);
	     * // => [1, 2] (iteration order is not guaranteed)
	     *
	     * _.values('hi');
	     * // => ['h', 'i']
	     */
	    function values(object) {
	      return object ? baseValues(object, keys(object)) : [];
	    }
	
	    /**
	     * Creates an array of the own and inherited enumerable property values of `object`.
	     *
	     * **Note:** Non-object values are coerced to objects.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the array of property values.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.valuesIn(new Foo);
	     * // => [1, 2, 3] (iteration order is not guaranteed)
	     */
	    function valuesIn(object) {
	      return object == null ? baseValues(object, keysIn(object)) : [];
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Clamps `number` within the inclusive `lower` and `upper` bounds.
	     *
	     * @static
	     * @memberOf _
	     * @category Number
	     * @param {number} number The number to clamp.
	     * @param {number} [lower] The lower bound.
	     * @param {number} upper The upper bound.
	     * @returns {number} Returns the clamped number.
	     * @example
	     *
	     * _.clamp(-10, -5, 5);
	     * // => -5
	     *
	     * _.clamp(10, -5, 5);
	     * // => 5
	     */
	    function clamp(number, lower, upper) {
	      if (upper === undefined) {
	        upper = lower;
	        lower = undefined;
	      }
	      if (upper !== undefined) {
	        upper = toNumber(upper);
	        upper = upper === upper ? upper : 0;
	      }
	      if (lower !== undefined) {
	        lower = toNumber(lower);
	        lower = lower === lower ? lower : 0;
	      }
	      return baseClamp(toNumber(number), lower, upper);
	    }
	
	    /**
	     * Checks if `n` is between `start` and up to but not including, `end`. If
	     * `end` is not specified it's set to `start` with `start` then set to `0`.
	     * If `start` is greater than `end` the params are swapped to support
	     * negative ranges.
	     *
	     * @static
	     * @memberOf _
	     * @category Number
	     * @param {number} number The number to check.
	     * @param {number} [start=0] The start of the range.
	     * @param {number} end The end of the range.
	     * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
	     * @example
	     *
	     * _.inRange(3, 2, 4);
	     * // => true
	     *
	     * _.inRange(4, 8);
	     * // => true
	     *
	     * _.inRange(4, 2);
	     * // => false
	     *
	     * _.inRange(2, 2);
	     * // => false
	     *
	     * _.inRange(1.2, 2);
	     * // => true
	     *
	     * _.inRange(5.2, 4);
	     * // => false
	     *
	     * _.inRange(-3, -2, -6);
	     * // => true
	     */
	    function inRange(number, start, end) {
	      start = toNumber(start) || 0;
	      if (end === undefined) {
	        end = start;
	        start = 0;
	      } else {
	        end = toNumber(end) || 0;
	      }
	      number = toNumber(number);
	      return baseInRange(number, start, end);
	    }
	
	    /**
	     * Produces a random number between the inclusive `lower` and `upper` bounds.
	     * If only one argument is provided a number between `0` and the given number
	     * is returned. If `floating` is `true`, or either `lower` or `upper` are floats,
	     * a floating-point number is returned instead of an integer.
	     *
	     * **Note:** JavaScript follows the IEEE-754 standard for resolving
	     * floating-point values which can produce unexpected results.
	     *
	     * @static
	     * @memberOf _
	     * @category Number
	     * @param {number} [lower=0] The lower bound.
	     * @param {number} [upper=1] The upper bound.
	     * @param {boolean} [floating] Specify returning a floating-point number.
	     * @returns {number} Returns the random number.
	     * @example
	     *
	     * _.random(0, 5);
	     * // => an integer between 0 and 5
	     *
	     * _.random(5);
	     * // => also an integer between 0 and 5
	     *
	     * _.random(5, true);
	     * // => a floating-point number between 0 and 5
	     *
	     * _.random(1.2, 5.2);
	     * // => a floating-point number between 1.2 and 5.2
	     */
	    function random(lower, upper, floating) {
	      if (floating && typeof floating != 'boolean' && isIterateeCall(lower, upper, floating)) {
	        upper = floating = undefined;
	      }
	      if (floating === undefined) {
	        if (typeof upper == 'boolean') {
	          floating = upper;
	          upper = undefined;
	        }
	        else if (typeof lower == 'boolean') {
	          floating = lower;
	          lower = undefined;
	        }
	      }
	      if (lower === undefined && upper === undefined) {
	        lower = 0;
	        upper = 1;
	      }
	      else {
	        lower = toNumber(lower) || 0;
	        if (upper === undefined) {
	          upper = lower;
	          lower = 0;
	        } else {
	          upper = toNumber(upper) || 0;
	        }
	      }
	      if (lower > upper) {
	        var temp = lower;
	        lower = upper;
	        upper = temp;
	      }
	      if (floating || lower % 1 || upper % 1) {
	        var rand = nativeRandom();
	        return nativeMin(lower + (rand * (upper - lower + freeParseFloat('1e-' + ((rand + '').length - 1)))), upper);
	      }
	      return baseRandom(lower, upper);
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to convert.
	     * @returns {string} Returns the camel cased string.
	     * @example
	     *
	     * _.camelCase('Foo Bar');
	     * // => 'fooBar'
	     *
	     * _.camelCase('--foo-bar');
	     * // => 'fooBar'
	     *
	     * _.camelCase('__foo_bar__');
	     * // => 'fooBar'
	     */
	    var camelCase = createCompounder(function(result, word, index) {
	      word = word.toLowerCase();
	      return result + (index ? capitalize(word) : word);
	    });
	
	    /**
	     * Converts the first character of `string` to upper case and the remaining
	     * to lower case.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to capitalize.
	     * @returns {string} Returns the capitalized string.
	     * @example
	     *
	     * _.capitalize('FRED');
	     * // => 'Fred'
	     */
	    function capitalize(string) {
	      return upperFirst(toString(string).toLowerCase());
	    }
	
	    /**
	     * Deburrs `string` by converting [latin-1 supplementary letters](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
	     * to basic latin letters and removing [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to deburr.
	     * @returns {string} Returns the deburred string.
	     * @example
	     *
	     * _.deburr('déjà vu');
	     * // => 'deja vu'
	     */
	    function deburr(string) {
	      string = toString(string);
	      return string && string.replace(reLatin1, deburrLetter).replace(reComboMark, '');
	    }
	
	    /**
	     * Checks if `string` ends with the given target string.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to search.
	     * @param {string} [target] The string to search for.
	     * @param {number} [position=string.length] The position to search from.
	     * @returns {boolean} Returns `true` if `string` ends with `target`, else `false`.
	     * @example
	     *
	     * _.endsWith('abc', 'c');
	     * // => true
	     *
	     * _.endsWith('abc', 'b');
	     * // => false
	     *
	     * _.endsWith('abc', 'b', 2);
	     * // => true
	     */
	    function endsWith(string, target, position) {
	      string = toString(string);
	      target = typeof target == 'string' ? target : (target + '');
	
	      var length = string.length;
	      position = position === undefined
	        ? length
	        : baseClamp(toInteger(position), 0, length);
	
	      position -= target.length;
	      return position >= 0 && string.indexOf(target, position) == position;
	    }
	
	    /**
	     * Converts the characters "&", "<", ">", '"', "'", and "\`" in `string` to
	     * their corresponding HTML entities.
	     *
	     * **Note:** No other characters are escaped. To escape additional
	     * characters use a third-party library like [_he_](https://mths.be/he).
	     *
	     * Though the ">" character is escaped for symmetry, characters like
	     * ">" and "/" don't need escaping in HTML and have no special meaning
	     * unless they're part of a tag or unquoted attribute value.
	     * See [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
	     * (under "semi-related fun fact") for more details.
	     *
	     * Backticks are escaped because in IE < 9, they can break out of
	     * attribute values or HTML comments. See [#59](https://html5sec.org/#59),
	     * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), and
	     * [#133](https://html5sec.org/#133) of the [HTML5 Security Cheatsheet](https://html5sec.org/)
	     * for more details.
	     *
	     * When working with HTML you should always [quote attribute values](http://wonko.com/post/html-escaping)
	     * to reduce XSS vectors.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to escape.
	     * @returns {string} Returns the escaped string.
	     * @example
	     *
	     * _.escape('fred, barney, & pebbles');
	     * // => 'fred, barney, &amp; pebbles'
	     */
	    function escape(string) {
	      string = toString(string);
	      return (string && reHasUnescapedHtml.test(string))
	        ? string.replace(reUnescapedHtml, escapeHtmlChar)
	        : string;
	    }
	
	    /**
	     * Escapes the `RegExp` special characters "^", "$", "\", ".", "*", "+",
	     * "?", "(", ")", "[", "]", "{", "}", and "|" in `string`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to escape.
	     * @returns {string} Returns the escaped string.
	     * @example
	     *
	     * _.escapeRegExp('[lodash](https://lodash.com/)');
	     * // => '\[lodash\]\(https://lodash\.com/\)'
	     */
	    function escapeRegExp(string) {
	      string = toString(string);
	      return (string && reHasRegExpChar.test(string))
	        ? string.replace(reRegExpChar, '\\$&')
	        : string;
	    }
	
	    /**
	     * Converts `string` to [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to convert.
	     * @returns {string} Returns the kebab cased string.
	     * @example
	     *
	     * _.kebabCase('Foo Bar');
	     * // => 'foo-bar'
	     *
	     * _.kebabCase('fooBar');
	     * // => 'foo-bar'
	     *
	     * _.kebabCase('__foo_bar__');
	     * // => 'foo-bar'
	     */
	    var kebabCase = createCompounder(function(result, word, index) {
	      return result + (index ? '-' : '') + word.toLowerCase();
	    });
	
	    /**
	     * Converts `string`, as space separated words, to lower case.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to convert.
	     * @returns {string} Returns the lower cased string.
	     * @example
	     *
	     * _.lowerCase('--Foo-Bar');
	     * // => 'foo bar'
	     *
	     * _.lowerCase('fooBar');
	     * // => 'foo bar'
	     *
	     * _.lowerCase('__FOO_BAR__');
	     * // => 'foo bar'
	     */
	    var lowerCase = createCompounder(function(result, word, index) {
	      return result + (index ? ' ' : '') + word.toLowerCase();
	    });
	
	    /**
	     * Converts the first character of `string` to lower case.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to convert.
	     * @returns {string} Returns the converted string.
	     * @example
	     *
	     * _.lowerFirst('Fred');
	     * // => 'fred'
	     *
	     * _.lowerFirst('FRED');
	     * // => 'fRED'
	     */
	    var lowerFirst = createCaseFirst('toLowerCase');
	
	    /**
	     * Converts the first character of `string` to upper case.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to convert.
	     * @returns {string} Returns the converted string.
	     * @example
	     *
	     * _.upperFirst('fred');
	     * // => 'Fred'
	     *
	     * _.upperFirst('FRED');
	     * // => 'FRED'
	     */
	    var upperFirst = createCaseFirst('toUpperCase');
	
	    /**
	     * Pads `string` on the left and right sides if it's shorter than `length`.
	     * Padding characters are truncated if they can't be evenly divided by `length`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to pad.
	     * @param {number} [length=0] The padding length.
	     * @param {string} [chars=' '] The string used as padding.
	     * @returns {string} Returns the padded string.
	     * @example
	     *
	     * _.pad('abc', 8);
	     * // => '  abc   '
	     *
	     * _.pad('abc', 8, '_-');
	     * // => '_-abc_-_'
	     *
	     * _.pad('abc', 3);
	     * // => 'abc'
	     */
	    function pad(string, length, chars) {
	      string = toString(string);
	      length = toInteger(length);
	
	      var strLength = stringSize(string);
	      if (!length || strLength >= length) {
	        return string;
	      }
	      var mid = (length - strLength) / 2,
	          leftLength = nativeFloor(mid),
	          rightLength = nativeCeil(mid);
	
	      return createPadding('', leftLength, chars) + string + createPadding('', rightLength, chars);
	    }
	
	    /**
	     * Pads `string` on the right side if it's shorter than `length`. Padding
	     * characters are truncated if they exceed `length`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to pad.
	     * @param {number} [length=0] The padding length.
	     * @param {string} [chars=' '] The string used as padding.
	     * @returns {string} Returns the padded string.
	     * @example
	     *
	     * _.padEnd('abc', 6);
	     * // => 'abc   '
	     *
	     * _.padEnd('abc', 6, '_-');
	     * // => 'abc_-_'
	     *
	     * _.padEnd('abc', 3);
	     * // => 'abc'
	     */
	    function padEnd(string, length, chars) {
	      string = toString(string);
	      return string + createPadding(string, length, chars);
	    }
	
	    /**
	     * Pads `string` on the left side if it's shorter than `length`. Padding
	     * characters are truncated if they exceed `length`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to pad.
	     * @param {number} [length=0] The padding length.
	     * @param {string} [chars=' '] The string used as padding.
	     * @returns {string} Returns the padded string.
	     * @example
	     *
	     * _.padStart('abc', 6);
	     * // => '   abc'
	     *
	     * _.padStart('abc', 6, '_-');
	     * // => '_-_abc'
	     *
	     * _.padStart('abc', 3);
	     * // => 'abc'
	     */
	    function padStart(string, length, chars) {
	      string = toString(string);
	      return createPadding(string, length, chars) + string;
	    }
	
	    /**
	     * Converts `string` to an integer of the specified radix. If `radix` is
	     * `undefined` or `0`, a `radix` of `10` is used unless `value` is a hexadecimal,
	     * in which case a `radix` of `16` is used.
	     *
	     * **Note:** This method aligns with the [ES5 implementation](https://es5.github.io/#x15.1.2.2)
	     * of `parseInt`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} string The string to convert.
	     * @param {number} [radix] The radix to interpret `value` by.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
	     * @returns {number} Returns the converted integer.
	     * @example
	     *
	     * _.parseInt('08');
	     * // => 8
	     *
	     * _.map(['6', '08', '10'], _.parseInt);
	     * // => [6, 8, 10]
	     */
	    function parseInt(string, radix, guard) {
	      // Chrome fails to trim leading <BOM> whitespace characters.
	      // See https://code.google.com/p/v8/issues/detail?id=3109 for more details.
	      if (guard || radix == null) {
	        radix = 0;
	      } else if (radix) {
	        radix = +radix;
	      }
	      string = toString(string).replace(reTrim, '');
	      return nativeParseInt(string, radix || (reHasHexPrefix.test(string) ? 16 : 10));
	    }
	
	    /**
	     * Repeats the given string `n` times.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to repeat.
	     * @param {number} [n=0] The number of times to repeat the string.
	     * @returns {string} Returns the repeated string.
	     * @example
	     *
	     * _.repeat('*', 3);
	     * // => '***'
	     *
	     * _.repeat('abc', 2);
	     * // => 'abcabc'
	     *
	     * _.repeat('abc', 0);
	     * // => ''
	     */
	    function repeat(string, n) {
	      string = toString(string);
	      n = toInteger(n);
	
	      var result = '';
	      if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
	        return result;
	      }
	      // Leverage the exponentiation by squaring algorithm for a faster repeat.
	      // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
	      do {
	        if (n % 2) {
	          result += string;
	        }
	        n = nativeFloor(n / 2);
	        string += string;
	      } while (n);
	
	      return result;
	    }
	
	    /**
	     * Replaces matches for `pattern` in `string` with `replacement`.
	     *
	     * **Note:** This method is based on [`String#replace`](https://mdn.io/String/replace).
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to modify.
	     * @param {RegExp|string} pattern The pattern to replace.
	     * @param {Function|string} replacement The match replacement.
	     * @returns {string} Returns the modified string.
	     * @example
	     *
	     * _.replace('Hi Fred', 'Fred', 'Barney');
	     * // => 'Hi Barney'
	     */
	    function replace() {
	      var args = arguments,
	          string = toString(args[0]);
	
	      return args.length < 3 ? string : string.replace(args[1], args[2]);
	    }
	
	    /**
	     * Converts `string` to [snake case](https://en.wikipedia.org/wiki/Snake_case).
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to convert.
	     * @returns {string} Returns the snake cased string.
	     * @example
	     *
	     * _.snakeCase('Foo Bar');
	     * // => 'foo_bar'
	     *
	     * _.snakeCase('fooBar');
	     * // => 'foo_bar'
	     *
	     * _.snakeCase('--foo-bar');
	     * // => 'foo_bar'
	     */
	    var snakeCase = createCompounder(function(result, word, index) {
	      return result + (index ? '_' : '') + word.toLowerCase();
	    });
	
	    /**
	     * Splits `string` by `separator`.
	     *
	     * **Note:** This method is based on [`String#split`](https://mdn.io/String/split).
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to split.
	     * @param {RegExp|string} separator The separator pattern to split by.
	     * @param {number} [limit] The length to truncate results to.
	     * @returns {Array} Returns the new array of string segments.
	     * @example
	     *
	     * _.split('a-b-c', '-', 2);
	     * // => ['a', 'b']
	     */
	    function split(string, separator, limit) {
	      return toString(string).split(separator, limit);
	    }
	
	    /**
	     * Converts `string` to [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to convert.
	     * @returns {string} Returns the start cased string.
	     * @example
	     *
	     * _.startCase('--foo-bar');
	     * // => 'Foo Bar'
	     *
	     * _.startCase('fooBar');
	     * // => 'Foo Bar'
	     *
	     * _.startCase('__foo_bar__');
	     * // => 'Foo Bar'
	     */
	    var startCase = createCompounder(function(result, word, index) {
	      return result + (index ? ' ' : '') + capitalize(word);
	    });
	
	    /**
	     * Checks if `string` starts with the given target string.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to search.
	     * @param {string} [target] The string to search for.
	     * @param {number} [position=0] The position to search from.
	     * @returns {boolean} Returns `true` if `string` starts with `target`, else `false`.
	     * @example
	     *
	     * _.startsWith('abc', 'a');
	     * // => true
	     *
	     * _.startsWith('abc', 'b');
	     * // => false
	     *
	     * _.startsWith('abc', 'b', 1);
	     * // => true
	     */
	    function startsWith(string, target, position) {
	      string = toString(string);
	      position = baseClamp(toInteger(position), 0, string.length);
	      return string.lastIndexOf(target, position) == position;
	    }
	
	    /**
	     * Creates a compiled template function that can interpolate data properties
	     * in "interpolate" delimiters, HTML-escape interpolated data properties in
	     * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
	     * properties may be accessed as free variables in the template. If a setting
	     * object is provided it takes precedence over `_.templateSettings` values.
	     *
	     * **Note:** In the development build `_.template` utilizes
	     * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
	     * for easier debugging.
	     *
	     * For more information on precompiling templates see
	     * [lodash's custom builds documentation](https://lodash.com/custom-builds).
	     *
	     * For more information on Chrome extension sandboxes see
	     * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The template string.
	     * @param {Object} [options] The options object.
	     * @param {RegExp} [options.escape] The HTML "escape" delimiter.
	     * @param {RegExp} [options.evaluate] The "evaluate" delimiter.
	     * @param {Object} [options.imports] An object to import into the template as free variables.
	     * @param {RegExp} [options.interpolate] The "interpolate" delimiter.
	     * @param {string} [options.sourceURL] The sourceURL of the template's compiled source.
	     * @param {string} [options.variable] The data object variable name.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
	     * @returns {Function} Returns the compiled template function.
	     * @example
	     *
	     * // using the "interpolate" delimiter to create a compiled template
	     * var compiled = _.template('hello <%= user %>!');
	     * compiled({ 'user': 'fred' });
	     * // => 'hello fred!'
	     *
	     * // using the HTML "escape" delimiter to escape data property values
	     * var compiled = _.template('<b><%- value %></b>');
	     * compiled({ 'value': '<script>' });
	     * // => '<b>&lt;script&gt;</b>'
	     *
	     * // using the "evaluate" delimiter to execute JavaScript and generate HTML
	     * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
	     * compiled({ 'users': ['fred', 'barney'] });
	     * // => '<li>fred</li><li>barney</li>'
	     *
	     * // using the internal `print` function in "evaluate" delimiters
	     * var compiled = _.template('<% print("hello " + user); %>!');
	     * compiled({ 'user': 'barney' });
	     * // => 'hello barney!'
	     *
	     * // using the ES delimiter as an alternative to the default "interpolate" delimiter
	     * var compiled = _.template('hello ${ user }!');
	     * compiled({ 'user': 'pebbles' });
	     * // => 'hello pebbles!'
	     *
	     * // using custom template delimiters
	     * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
	     * var compiled = _.template('hello {{ user }}!');
	     * compiled({ 'user': 'mustache' });
	     * // => 'hello mustache!'
	     *
	     * // using backslashes to treat delimiters as plain text
	     * var compiled = _.template('<%= "\\<%- value %\\>" %>');
	     * compiled({ 'value': 'ignored' });
	     * // => '<%- value %>'
	     *
	     * // using the `imports` option to import `jQuery` as `jq`
	     * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
	     * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
	     * compiled({ 'users': ['fred', 'barney'] });
	     * // => '<li>fred</li><li>barney</li>'
	     *
	     * // using the `sourceURL` option to specify a custom sourceURL for the template
	     * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
	     * compiled(data);
	     * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
	     *
	     * // using the `variable` option to ensure a with-statement isn't used in the compiled template
	     * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
	     * compiled.source;
	     * // => function(data) {
	     * //   var __t, __p = '';
	     * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
	     * //   return __p;
	     * // }
	     *
	     * // using the `source` property to inline compiled templates for meaningful
	     * // line numbers in error messages and a stack trace
	     * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
	     *   var JST = {\
	     *     "main": ' + _.template(mainText).source + '\
	     *   };\
	     * ');
	     */
	    function template(string, options, guard) {
	      // Based on John Resig's `tmpl` implementation (http://ejohn.org/blog/javascript-micro-templating/)
	      // and Laura Doktorova's doT.js (https://github.com/olado/doT).
	      var settings = lodash.templateSettings;
	
	      if (guard && isIterateeCall(string, options, guard)) {
	        options = undefined;
	      }
	      string = toString(string);
	      options = assignInWith({}, options, settings, assignInDefaults);
	
	      var imports = assignInWith({}, options.imports, settings.imports, assignInDefaults),
	          importsKeys = keys(imports),
	          importsValues = baseValues(imports, importsKeys);
	
	      var isEscaping,
	          isEvaluating,
	          index = 0,
	          interpolate = options.interpolate || reNoMatch,
	          source = "__p += '";
	
	      // Compile the regexp to match each delimiter.
	      var reDelimiters = RegExp(
	        (options.escape || reNoMatch).source + '|' +
	        interpolate.source + '|' +
	        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
	        (options.evaluate || reNoMatch).source + '|$'
	      , 'g');
	
	      // Use a sourceURL for easier debugging.
	      var sourceURL = '//# sourceURL=' +
	        ('sourceURL' in options
	          ? options.sourceURL
	          : ('lodash.templateSources[' + (++templateCounter) + ']')
	        ) + '\n';
	
	      string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
	        interpolateValue || (interpolateValue = esTemplateValue);
	
	        // Escape characters that can't be included in string literals.
	        source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);
	
	        // Replace delimiters with snippets.
	        if (escapeValue) {
	          isEscaping = true;
	          source += "' +\n__e(" + escapeValue + ") +\n'";
	        }
	        if (evaluateValue) {
	          isEvaluating = true;
	          source += "';\n" + evaluateValue + ";\n__p += '";
	        }
	        if (interpolateValue) {
	          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
	        }
	        index = offset + match.length;
	
	        // The JS engine embedded in Adobe products needs `match` returned in
	        // order to produce the correct `offset` value.
	        return match;
	      });
	
	      source += "';\n";
	
	      // If `variable` is not specified wrap a with-statement around the generated
	      // code to add the data object to the top of the scope chain.
	      var variable = options.variable;
	      if (!variable) {
	        source = 'with (obj) {\n' + source + '\n}\n';
	      }
	      // Cleanup code by stripping empty strings.
	      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
	        .replace(reEmptyStringMiddle, '$1')
	        .replace(reEmptyStringTrailing, '$1;');
	
	      // Frame code as the function body.
	      source = 'function(' + (variable || 'obj') + ') {\n' +
	        (variable
	          ? ''
	          : 'obj || (obj = {});\n'
	        ) +
	        "var __t, __p = ''" +
	        (isEscaping
	           ? ', __e = _.escape'
	           : ''
	        ) +
	        (isEvaluating
	          ? ', __j = Array.prototype.join;\n' +
	            "function print() { __p += __j.call(arguments, '') }\n"
	          : ';\n'
	        ) +
	        source +
	        'return __p\n}';
	
	      var result = attempt(function() {
	        return Function(importsKeys, sourceURL + 'return ' + source).apply(undefined, importsValues);
	      });
	
	      // Provide the compiled function's source by its `toString` method or
	      // the `source` property as a convenience for inlining compiled templates.
	      result.source = source;
	      if (isError(result)) {
	        throw result;
	      }
	      return result;
	    }
	
	    /**
	     * Converts `string`, as a whole, to lower case.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to convert.
	     * @returns {string} Returns the lower cased string.
	     * @example
	     *
	     * _.toLower('--Foo-Bar');
	     * // => '--foo-bar'
	     *
	     * _.toLower('fooBar');
	     * // => 'foobar'
	     *
	     * _.toLower('__FOO_BAR__');
	     * // => '__foo_bar__'
	     */
	    function toLower(value) {
	      return toString(value).toLowerCase();
	    }
	
	    /**
	     * Converts `string`, as a whole, to upper case.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to convert.
	     * @returns {string} Returns the upper cased string.
	     * @example
	     *
	     * _.toUpper('--foo-bar');
	     * // => '--FOO-BAR'
	     *
	     * _.toUpper('fooBar');
	     * // => 'FOOBAR'
	     *
	     * _.toUpper('__foo_bar__');
	     * // => '__FOO_BAR__'
	     */
	    function toUpper(value) {
	      return toString(value).toUpperCase();
	    }
	
	    /**
	     * Removes leading and trailing whitespace or specified characters from `string`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to trim.
	     * @param {string} [chars=whitespace] The characters to trim.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
	     * @returns {string} Returns the trimmed string.
	     * @example
	     *
	     * _.trim('  abc  ');
	     * // => 'abc'
	     *
	     * _.trim('-_-abc-_-', '_-');
	     * // => 'abc'
	     *
	     * _.map(['  foo  ', '  bar  '], _.trim);
	     * // => ['foo', 'bar']
	     */
	    function trim(string, chars, guard) {
	      string = toString(string);
	      if (!string) {
	        return string;
	      }
	      if (guard || chars === undefined) {
	        return string.replace(reTrim, '');
	      }
	      chars = (chars + '');
	      if (!chars) {
	        return string;
	      }
	      var strSymbols = stringToArray(string),
	          chrSymbols = stringToArray(chars);
	
	      return strSymbols.slice(charsStartIndex(strSymbols, chrSymbols), charsEndIndex(strSymbols, chrSymbols) + 1).join('');
	    }
	
	    /**
	     * Removes trailing whitespace or specified characters from `string`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to trim.
	     * @param {string} [chars=whitespace] The characters to trim.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
	     * @returns {string} Returns the trimmed string.
	     * @example
	     *
	     * _.trimEnd('  abc  ');
	     * // => '  abc'
	     *
	     * _.trimEnd('-_-abc-_-', '_-');
	     * // => '-_-abc'
	     */
	    function trimEnd(string, chars, guard) {
	      string = toString(string);
	      if (!string) {
	        return string;
	      }
	      if (guard || chars === undefined) {
	        return string.replace(reTrimEnd, '');
	      }
	      chars = (chars + '');
	      if (!chars) {
	        return string;
	      }
	      var strSymbols = stringToArray(string);
	      return strSymbols.slice(0, charsEndIndex(strSymbols, stringToArray(chars)) + 1).join('');
	    }
	
	    /**
	     * Removes leading whitespace or specified characters from `string`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to trim.
	     * @param {string} [chars=whitespace] The characters to trim.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
	     * @returns {string} Returns the trimmed string.
	     * @example
	     *
	     * _.trimStart('  abc  ');
	     * // => 'abc  '
	     *
	     * _.trimStart('-_-abc-_-', '_-');
	     * // => 'abc-_-'
	     */
	    function trimStart(string, chars, guard) {
	      string = toString(string);
	      if (!string) {
	        return string;
	      }
	      if (guard || chars === undefined) {
	        return string.replace(reTrimStart, '');
	      }
	      chars = (chars + '');
	      if (!chars) {
	        return string;
	      }
	      var strSymbols = stringToArray(string);
	      return strSymbols.slice(charsStartIndex(strSymbols, stringToArray(chars))).join('');
	    }
	
	    /**
	     * Truncates `string` if it's longer than the given maximum string length.
	     * The last characters of the truncated string are replaced with the omission
	     * string which defaults to "...".
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to truncate.
	     * @param {Object} [options] The options object.
	     * @param {number} [options.length=30] The maximum string length.
	     * @param {string} [options.omission='...'] The string to indicate text is omitted.
	     * @param {RegExp|string} [options.separator] The separator pattern to truncate to.
	     * @returns {string} Returns the truncated string.
	     * @example
	     *
	     * _.truncate('hi-diddly-ho there, neighborino');
	     * // => 'hi-diddly-ho there, neighbo...'
	     *
	     * _.truncate('hi-diddly-ho there, neighborino', {
	     *   'length': 24,
	     *   'separator': ' '
	     * });
	     * // => 'hi-diddly-ho there,...'
	     *
	     * _.truncate('hi-diddly-ho there, neighborino', {
	     *   'length': 24,
	     *   'separator': /,? +/
	     * });
	     * // => 'hi-diddly-ho there...'
	     *
	     * _.truncate('hi-diddly-ho there, neighborino', {
	     *   'omission': ' [...]'
	     * });
	     * // => 'hi-diddly-ho there, neig [...]'
	     */
	    function truncate(string, options) {
	      var length = DEFAULT_TRUNC_LENGTH,
	          omission = DEFAULT_TRUNC_OMISSION;
	
	      if (isObject(options)) {
	        var separator = 'separator' in options ? options.separator : separator;
	        length = 'length' in options ? toInteger(options.length) : length;
	        omission = 'omission' in options ? toString(options.omission) : omission;
	      }
	      string = toString(string);
	
	      var strLength = string.length;
	      if (reHasComplexSymbol.test(string)) {
	        var strSymbols = stringToArray(string);
	        strLength = strSymbols.length;
	      }
	      if (length >= strLength) {
	        return string;
	      }
	      var end = length - stringSize(omission);
	      if (end < 1) {
	        return omission;
	      }
	      var result = strSymbols
	        ? strSymbols.slice(0, end).join('')
	        : string.slice(0, end);
	
	      if (separator === undefined) {
	        return result + omission;
	      }
	      if (strSymbols) {
	        end += (result.length - end);
	      }
	      if (isRegExp(separator)) {
	        if (string.slice(end).search(separator)) {
	          var match,
	              substring = result;
	
	          if (!separator.global) {
	            separator = RegExp(separator.source, toString(reFlags.exec(separator)) + 'g');
	          }
	          separator.lastIndex = 0;
	          while ((match = separator.exec(substring))) {
	            var newEnd = match.index;
	          }
	          result = result.slice(0, newEnd === undefined ? end : newEnd);
	        }
	      } else if (string.indexOf(separator, end) != end) {
	        var index = result.lastIndexOf(separator);
	        if (index > -1) {
	          result = result.slice(0, index);
	        }
	      }
	      return result + omission;
	    }
	
	    /**
	     * The inverse of `_.escape`; this method converts the HTML entities
	     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, and `&#96;` in `string` to their
	     * corresponding characters.
	     *
	     * **Note:** No other HTML entities are unescaped. To unescape additional HTML
	     * entities use a third-party library like [_he_](https://mths.be/he).
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to unescape.
	     * @returns {string} Returns the unescaped string.
	     * @example
	     *
	     * _.unescape('fred, barney, &amp; pebbles');
	     * // => 'fred, barney, & pebbles'
	     */
	    function unescape(string) {
	      string = toString(string);
	      return (string && reHasEscapedHtml.test(string))
	        ? string.replace(reEscapedHtml, unescapeHtmlChar)
	        : string;
	    }
	
	    /**
	     * Converts `string`, as space separated words, to upper case.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to convert.
	     * @returns {string} Returns the upper cased string.
	     * @example
	     *
	     * _.upperCase('--foo-bar');
	     * // => 'FOO BAR'
	     *
	     * _.upperCase('fooBar');
	     * // => 'FOO BAR'
	     *
	     * _.upperCase('__foo_bar__');
	     * // => 'FOO BAR'
	     */
	    var upperCase = createCompounder(function(result, word, index) {
	      return result + (index ? ' ' : '') + word.toUpperCase();
	    });
	
	    /**
	     * Splits `string` into an array of its words.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to inspect.
	     * @param {RegExp|string} [pattern] The pattern to match words.
	     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
	     * @returns {Array} Returns the words of `string`.
	     * @example
	     *
	     * _.words('fred, barney, & pebbles');
	     * // => ['fred', 'barney', 'pebbles']
	     *
	     * _.words('fred, barney, & pebbles', /[^, ]+/g);
	     * // => ['fred', 'barney', '&', 'pebbles']
	     */
	    function words(string, pattern, guard) {
	      string = toString(string);
	      pattern = guard ? undefined : pattern;
	
	      if (pattern === undefined) {
	        pattern = reHasComplexWord.test(string) ? reComplexWord : reBasicWord;
	      }
	      return string.match(pattern) || [];
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Attempts to invoke `func`, returning either the result or the caught error
	     * object. Any additional arguments are provided to `func` when it's invoked.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {Function} func The function to attempt.
	     * @returns {*} Returns the `func` result or error object.
	     * @example
	     *
	     * // avoid throwing errors for invalid selectors
	     * var elements = _.attempt(function(selector) {
	     *   return document.querySelectorAll(selector);
	     * }, '>_>');
	     *
	     * if (_.isError(elements)) {
	     *   elements = [];
	     * }
	     */
	    var attempt = rest(function(func, args) {
	      try {
	        return apply(func, undefined, args);
	      } catch (e) {
	        return isError(e) ? e : new Error(e);
	      }
	    });
	
	    /**
	     * Binds methods of an object to the object itself, overwriting the existing
	     * method.
	     *
	     * **Note:** This method doesn't set the "length" property of bound functions.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {Object} object The object to bind and assign the bound methods to.
	     * @param {...(string|string[])} methodNames The object method names to bind,
	     *  specified individually or in arrays.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * var view = {
	     *   'label': 'docs',
	     *   'onClick': function() {
	     *     console.log('clicked ' + this.label);
	     *   }
	     * };
	     *
	     * _.bindAll(view, 'onClick');
	     * jQuery(element).on('click', view.onClick);
	     * // => logs 'clicked docs' when clicked
	     */
	    var bindAll = rest(function(object, methodNames) {
	      arrayEach(baseFlatten(methodNames), function(key) {
	        object[key] = bind(object[key], object);
	      });
	      return object;
	    });
	
	    /**
	     * Creates a function that iterates over `pairs` invoking the corresponding
	     * function of the first predicate to return truthy. The predicate-function
	     * pairs are invoked with the `this` binding and arguments of the created
	     * function.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {Array} pairs The predicate-function pairs.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var func = _.cond([
	     *   [_.matches({ 'a': 1 }),           _.constant('matches A')],
	     *   [_.conforms({ 'b': _.isNumber }), _.constant('matches B')],
	     *   [_.constant(true),                _.constant('no match')]
	     * ]);
	     *
	     * func({ 'a': 1, 'b': 2 });
	     * // => 'matches A'
	     *
	     * func({ 'a': 0, 'b': 1 });
	     * // => 'matches B'
	     *
	     * func({ 'a': '1', 'b': '2' });
	     * // => 'no match'
	     */
	    function cond(pairs) {
	      var length = pairs ? pairs.length : 0,
	          toIteratee = getIteratee();
	
	      pairs = !length ? [] : arrayMap(pairs, function(pair) {
	        if (typeof pair[1] != 'function') {
	          throw new TypeError(FUNC_ERROR_TEXT);
	        }
	        return [toIteratee(pair[0]), pair[1]];
	      });
	
	      return rest(function(args) {
	        var index = -1;
	        while (++index < length) {
	          var pair = pairs[index];
	          if (apply(pair[0], this, args)) {
	            return apply(pair[1], this, args);
	          }
	        }
	      });
	    }
	
	    /**
	     * Creates a function that invokes the predicate properties of `source` with
	     * the corresponding property values of a given object, returning `true` if
	     * all predicates return truthy, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {Object} source The object of property predicates to conform to.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36 },
	     *   { 'user': 'fred',   'age': 40 }
	     * ];
	     *
	     * _.filter(users, _.conforms({ 'age': _.partial(_.gt, _, 38) }));
	     * // => [{ 'user': 'fred', 'age': 40 }]
	     */
	    function conforms(source) {
	      return baseConforms(baseClone(source, true));
	    }
	
	    /**
	     * Creates a function that returns `value`.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {*} value The value to return from the new function.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var object = { 'user': 'fred' };
	     * var getter = _.constant(object);
	     *
	     * getter() === object;
	     * // => true
	     */
	    function constant(value) {
	      return function() {
	        return value;
	      };
	    }
	
	    /**
	     * Creates a function that returns the result of invoking the provided
	     * functions with the `this` binding of the created function, where each
	     * successive invocation is supplied the return value of the previous.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {...(Function|Function[])} [funcs] Functions to invoke.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * function square(n) {
	     *   return n * n;
	     * }
	     *
	     * var addSquare = _.flow(_.add, square);
	     * addSquare(1, 2);
	     * // => 9
	     */
	    var flow = createFlow();
	
	    /**
	     * This method is like `_.flow` except that it creates a function that
	     * invokes the provided functions from right to left.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {...(Function|Function[])} [funcs] Functions to invoke.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * function square(n) {
	     *   return n * n;
	     * }
	     *
	     * var addSquare = _.flowRight(square, _.add);
	     * addSquare(1, 2);
	     * // => 9
	     */
	    var flowRight = createFlow(true);
	
	    /**
	     * This method returns the first argument provided to it.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {*} value Any value.
	     * @returns {*} Returns `value`.
	     * @example
	     *
	     * var object = { 'user': 'fred' };
	     *
	     * _.identity(object) === object;
	     * // => true
	     */
	    function identity(value) {
	      return value;
	    }
	
	    /**
	     * Creates a function that invokes `func` with the arguments of the created
	     * function. If `func` is a property name the created callback returns the
	     * property value for a given element. If `func` is an object the created
	     * callback returns `true` for elements that contain the equivalent object properties, otherwise it returns `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {*} [func=_.identity] The value to convert to a callback.
	     * @returns {Function} Returns the callback.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36 },
	     *   { 'user': 'fred',   'age': 40 }
	     * ];
	     *
	     * // create custom iteratee shorthands
	     * _.iteratee = _.wrap(_.iteratee, function(callback, func) {
	     *   var p = /^(\S+)\s*([<>])\s*(\S+)$/.exec(func);
	     *   return !p ? callback(func) : function(object) {
	     *     return (p[2] == '>' ? object[p[1]] > p[3] : object[p[1]] < p[3]);
	     *   };
	     * });
	     *
	     * _.filter(users, 'age > 36');
	     * // => [{ 'user': 'fred', 'age': 40 }]
	     */
	    function iteratee(func) {
	      return (isObjectLike(func) && !isArray(func))
	        ? matches(func)
	        : baseIteratee(func);
	    }
	
	    /**
	     * Creates a function that performs a deep partial comparison between a given
	     * object and `source`, returning `true` if the given object has equivalent
	     * property values, else `false`.
	     *
	     * **Note:** This method supports comparing the same values as `_.isEqual`.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {Object} source The object of property values to match.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36, 'active': true },
	     *   { 'user': 'fred',   'age': 40, 'active': false }
	     * ];
	     *
	     * _.filter(users, _.matches({ 'age': 40, 'active': false }));
	     * // => [{ 'user': 'fred', 'age': 40, 'active': false }]
	     */
	    function matches(source) {
	      return baseMatches(baseClone(source, true));
	    }
	
	    /**
	     * Creates a function that performs a deep partial comparison between the
	     * value at `path` of a given object to `srcValue`, returning `true` if the
	     * object value is equivalent, else `false`.
	     *
	     * **Note:** This method supports comparing the same values as `_.isEqual`.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {Array|string} path The path of the property to get.
	     * @param {*} srcValue The value to match.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney' },
	     *   { 'user': 'fred' }
	     * ];
	     *
	     * _.find(users, _.matchesProperty('user', 'fred'));
	     * // => { 'user': 'fred' }
	     */
	    function matchesProperty(path, srcValue) {
	      return baseMatchesProperty(path, baseClone(srcValue, true));
	    }
	
	    /**
	     * Creates a function that invokes the method at `path` of a given object.
	     * Any additional arguments are provided to the invoked method.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {Array|string} path The path of the method to invoke.
	     * @param {...*} [args] The arguments to invoke the method with.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var objects = [
	     *   { 'a': { 'b': { 'c': _.constant(2) } } },
	     *   { 'a': { 'b': { 'c': _.constant(1) } } }
	     * ];
	     *
	     * _.map(objects, _.method('a.b.c'));
	     * // => [2, 1]
	     *
	     * _.invokeMap(_.sortBy(objects, _.method(['a', 'b', 'c'])), 'a.b.c');
	     * // => [1, 2]
	     */
	    var method = rest(function(path, args) {
	      return function(object) {
	        return baseInvoke(object, path, args);
	      };
	    });
	
	    /**
	     * The opposite of `_.method`; this method creates a function that invokes
	     * the method at a given path of `object`. Any additional arguments are
	     * provided to the invoked method.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {Object} object The object to query.
	     * @param {...*} [args] The arguments to invoke the method with.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var array = _.times(3, _.constant),
	     *     object = { 'a': array, 'b': array, 'c': array };
	     *
	     * _.map(['a[2]', 'c[0]'], _.methodOf(object));
	     * // => [2, 0]
	     *
	     * _.map([['a', '2'], ['c', '0']], _.methodOf(object));
	     * // => [2, 0]
	     */
	    var methodOf = rest(function(object, args) {
	      return function(path) {
	        return baseInvoke(object, path, args);
	      };
	    });
	
	    /**
	     * Adds all own enumerable function properties of a source object to the
	     * destination object. If `object` is a function then methods are added to
	     * its prototype as well.
	     *
	     * **Note:** Use `_.runInContext` to create a pristine `lodash` function to
	     * avoid conflicts caused by modifying the original.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {Function|Object} [object=lodash] The destination object.
	     * @param {Object} source The object of functions to add.
	     * @param {Object} [options] The options object.
	     * @param {boolean} [options.chain=true] Specify whether the functions added
	     *  are chainable.
	     * @returns {Function|Object} Returns `object`.
	     * @example
	     *
	     * function vowels(string) {
	     *   return _.filter(string, function(v) {
	     *     return /[aeiou]/i.test(v);
	     *   });
	     * }
	     *
	     * _.mixin({ 'vowels': vowels });
	     * _.vowels('fred');
	     * // => ['e']
	     *
	     * _('fred').vowels().value();
	     * // => ['e']
	     *
	     * _.mixin({ 'vowels': vowels }, { 'chain': false });
	     * _('fred').vowels();
	     * // => ['e']
	     */
	    function mixin(object, source, options) {
	      var props = keys(source),
	          methodNames = baseFunctions(source, props);
	
	      if (options == null &&
	          !(isObject(source) && (methodNames.length || !props.length))) {
	        options = source;
	        source = object;
	        object = this;
	        methodNames = baseFunctions(source, keys(source));
	      }
	      var chain = (isObject(options) && 'chain' in options) ? options.chain : true,
	          isFunc = isFunction(object);
	
	      arrayEach(methodNames, function(methodName) {
	        var func = source[methodName];
	        object[methodName] = func;
	        if (isFunc) {
	          object.prototype[methodName] = function() {
	            var chainAll = this.__chain__;
	            if (chain || chainAll) {
	              var result = object(this.__wrapped__),
	                  actions = result.__actions__ = copyArray(this.__actions__);
	
	              actions.push({ 'func': func, 'args': arguments, 'thisArg': object });
	              result.__chain__ = chainAll;
	              return result;
	            }
	            return func.apply(object, arrayPush([this.value()], arguments));
	          };
	        }
	      });
	
	      return object;
	    }
	
	    /**
	     * Reverts the `_` variable to its previous value and returns a reference to
	     * the `lodash` function.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @returns {Function} Returns the `lodash` function.
	     * @example
	     *
	     * var lodash = _.noConflict();
	     */
	    function noConflict() {
	      if (root._ === this) {
	        root._ = oldDash;
	      }
	      return this;
	    }
	
	    /**
	     * A no-operation function that returns `undefined` regardless of the
	     * arguments it receives.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @example
	     *
	     * var object = { 'user': 'fred' };
	     *
	     * _.noop(object) === undefined;
	     * // => true
	     */
	    function noop() {
	      // No operation performed.
	    }
	
	    /**
	     * Creates a function that returns its nth argument.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {number} [n=0] The index of the argument to return.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var func = _.nthArg(1);
	     *
	     * func('a', 'b', 'c');
	     * // => 'b'
	     */
	    function nthArg(n) {
	      n = toInteger(n);
	      return function() {
	        return arguments[n];
	      };
	    }
	
	    /**
	     * Creates a function that invokes `iteratees` with the arguments provided
	     * to the created function and returns their results.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {...(Function|Function[])} iteratees The iteratees to invoke.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var func = _.over(Math.max, Math.min);
	     *
	     * func(1, 2, 3, 4);
	     * // => [4, 1]
	     */
	    var over = createOver(arrayMap);
	
	    /**
	     * Creates a function that checks if **all** of the `predicates` return
	     * truthy when invoked with the arguments provided to the created function.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {...(Function|Function[])} predicates The predicates to check.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var func = _.overEvery(Boolean, isFinite);
	     *
	     * func('1');
	     * // => true
	     *
	     * func(null);
	     * // => false
	     *
	     * func(NaN);
	     * // => false
	     */
	    var overEvery = createOver(arrayEvery);
	
	    /**
	     * Creates a function that checks if **any** of the `predicates` return
	     * truthy when invoked with the arguments provided to the created function.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {...(Function|Function[])} predicates The predicates to check.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var func = _.overSome(Boolean, isFinite);
	     *
	     * func('1');
	     * // => true
	     *
	     * func(null);
	     * // => true
	     *
	     * func(NaN);
	     * // => false
	     */
	    var overSome = createOver(arraySome);
	
	    /**
	     * Creates a function that returns the value at `path` of a given object.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {Array|string} path The path of the property to get.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var objects = [
	     *   { 'a': { 'b': { 'c': 2 } } },
	     *   { 'a': { 'b': { 'c': 1 } } }
	     * ];
	     *
	     * _.map(objects, _.property('a.b.c'));
	     * // => [2, 1]
	     *
	     * _.map(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
	     * // => [1, 2]
	     */
	    function property(path) {
	      return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
	    }
	
	    /**
	     * The opposite of `_.property`; this method creates a function that returns
	     * the value at a given path of `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {Object} object The object to query.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var array = [0, 1, 2],
	     *     object = { 'a': array, 'b': array, 'c': array };
	     *
	     * _.map(['a[2]', 'c[0]'], _.propertyOf(object));
	     * // => [2, 0]
	     *
	     * _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
	     * // => [2, 0]
	     */
	    function propertyOf(object) {
	      return function(path) {
	        return object == null ? undefined : baseGet(object, path);
	      };
	    }
	
	    /**
	     * Creates an array of numbers (positive and/or negative) progressing from
	     * `start` up to, but not including, `end`. A step of `-1` is used if a negative
	     * `start` is specified without an `end` or `step`. If `end` is not specified
	     * it's set to `start` with `start` then set to `0`.
	     *
	     * **Note:** JavaScript follows the IEEE-754 standard for resolving
	     * floating-point values which can produce unexpected results.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {number} [start=0] The start of the range.
	     * @param {number} end The end of the range.
	     * @param {number} [step=1] The value to increment or decrement by.
	     * @returns {Array} Returns the new array of numbers.
	     * @example
	     *
	     * _.range(4);
	     * // => [0, 1, 2, 3]
	     *
	     * _.range(-4);
	     * // => [0, -1, -2, -3]
	     *
	     * _.range(1, 5);
	     * // => [1, 2, 3, 4]
	     *
	     * _.range(0, 20, 5);
	     * // => [0, 5, 10, 15]
	     *
	     * _.range(0, -4, -1);
	     * // => [0, -1, -2, -3]
	     *
	     * _.range(1, 4, 0);
	     * // => [1, 1, 1]
	     *
	     * _.range(0);
	     * // => []
	     */
	    var range = createRange();
	
	    /**
	     * This method is like `_.range` except that it populates values in
	     * descending order.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {number} [start=0] The start of the range.
	     * @param {number} end The end of the range.
	     * @param {number} [step=1] The value to increment or decrement by.
	     * @returns {Array} Returns the new array of numbers.
	     * @example
	     *
	     * _.rangeRight(4);
	     * // => [3, 2, 1, 0]
	     *
	     * _.rangeRight(-4);
	     * // => [-3, -2, -1, 0]
	     *
	     * _.rangeRight(1, 5);
	     * // => [4, 3, 2, 1]
	     *
	     * _.rangeRight(0, 20, 5);
	     * // => [15, 10, 5, 0]
	     *
	     * _.rangeRight(0, -4, -1);
	     * // => [-3, -2, -1, 0]
	     *
	     * _.rangeRight(1, 4, 0);
	     * // => [1, 1, 1]
	     *
	     * _.rangeRight(0);
	     * // => []
	     */
	    var rangeRight = createRange(true);
	
	    /**
	     * Invokes the iteratee function `n` times, returning an array of the results
	     * of each invocation. The iteratee is invoked with one argument; (index).
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {number} n The number of times to invoke `iteratee`.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @returns {Array} Returns the array of results.
	     * @example
	     *
	     * _.times(3, String);
	     * // => ['0', '1', '2']
	     *
	     *  _.times(4, _.constant(true));
	     * // => [true, true, true, true]
	     */
	    function times(n, iteratee) {
	      n = toInteger(n);
	      if (n < 1 || n > MAX_SAFE_INTEGER) {
	        return [];
	      }
	      var index = MAX_ARRAY_LENGTH,
	          length = nativeMin(n, MAX_ARRAY_LENGTH);
	
	      iteratee = toFunction(iteratee);
	      n -= MAX_ARRAY_LENGTH;
	
	      var result = baseTimes(length, iteratee);
	      while (++index < n) {
	        iteratee(index);
	      }
	      return result;
	    }
	
	    /**
	     * Converts `value` to a property path array.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {*} value The value to convert.
	     * @returns {Array} Returns the new property path array.
	     * @example
	     *
	     * _.toPath('a.b.c');
	     * // => ['a', 'b', 'c']
	     *
	     * _.toPath('a[0].b.c');
	     * // => ['a', '0', 'b', 'c']
	     *
	     * var path = ['a', 'b', 'c'],
	     *     newPath = _.toPath(path);
	     *
	     * console.log(newPath);
	     * // => ['a', 'b', 'c']
	     *
	     * console.log(path === newPath);
	     * // => false
	     */
	    function toPath(value) {
	      return isArray(value) ? arrayMap(value, String) : stringToPath(value);
	    }
	
	    /**
	     * Generates a unique ID. If `prefix` is provided the ID is appended to it.
	     *
	     * @static
	     * @memberOf _
	     * @category Util
	     * @param {string} [prefix] The value to prefix the ID with.
	     * @returns {string} Returns the unique ID.
	     * @example
	     *
	     * _.uniqueId('contact_');
	     * // => 'contact_104'
	     *
	     * _.uniqueId();
	     * // => '105'
	     */
	    function uniqueId(prefix) {
	      var id = ++idCounter;
	      return toString(prefix) + id;
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Adds two numbers.
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {number} augend The first number in an addition.
	     * @param {number} addend The second number in an addition.
	     * @returns {number} Returns the total.
	     * @example
	     *
	     * _.add(6, 4);
	     * // => 10
	     */
	    function add(augend, addend) {
	      var result;
	      if (augend !== undefined) {
	        result = augend;
	      }
	      if (addend !== undefined) {
	        result = result === undefined ? addend : (result + addend);
	      }
	      return result;
	    }
	
	    /**
	     * Computes `number` rounded up to `precision`.
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {number} number The number to round up.
	     * @param {number} [precision=0] The precision to round up to.
	     * @returns {number} Returns the rounded up number.
	     * @example
	     *
	     * _.ceil(4.006);
	     * // => 5
	     *
	     * _.ceil(6.004, 2);
	     * // => 6.01
	     *
	     * _.ceil(6040, -2);
	     * // => 6100
	     */
	    var ceil = createRound('ceil');
	
	    /**
	     * Computes `number` rounded down to `precision`.
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {number} number The number to round down.
	     * @param {number} [precision=0] The precision to round down to.
	     * @returns {number} Returns the rounded down number.
	     * @example
	     *
	     * _.floor(4.006);
	     * // => 4
	     *
	     * _.floor(0.046, 2);
	     * // => 0.04
	     *
	     * _.floor(4060, -2);
	     * // => 4000
	     */
	    var floor = createRound('floor');
	
	    /**
	     * Computes the maximum value of `array`. If `array` is empty or falsey
	     * `undefined` is returned.
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {Array} array The array to iterate over.
	     * @returns {*} Returns the maximum value.
	     * @example
	     *
	     * _.max([4, 2, 8, 6]);
	     * // => 8
	     *
	     * _.max([]);
	     * // => undefined
	     */
	    function max(array) {
	      return (array && array.length)
	        ? baseExtremum(array, identity, gt)
	        : undefined;
	    }
	
	    /**
	     * This method is like `_.max` except that it accepts `iteratee` which is
	     * invoked for each element in `array` to generate the criterion by which
	     * the value is ranked. The iteratee is invoked with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {Array} array The array to iterate over.
	     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
	     * @returns {*} Returns the maximum value.
	     * @example
	     *
	     * var objects = [{ 'n': 1 }, { 'n': 2 }];
	     *
	     * _.maxBy(objects, function(o) { return o.n; });
	     * // => { 'n': 2 }
	     *
	     * // using the `_.property` iteratee shorthand
	     * _.maxBy(objects, 'n');
	     * // => { 'n': 2 }
	     */
	    function maxBy(array, iteratee) {
	      return (array && array.length)
	        ? baseExtremum(array, getIteratee(iteratee), gt)
	        : undefined;
	    }
	
	    /**
	     * Computes the mean of the values in `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {Array} array The array to iterate over.
	     * @returns {number} Returns the mean.
	     * @example
	     *
	     * _.mean([4, 2, 8, 6]);
	     * // => 5
	     */
	    function mean(array) {
	      return sum(array) / (array ? array.length : 0);
	    }
	
	    /**
	     * Computes the minimum value of `array`. If `array` is empty or falsey
	     * `undefined` is returned.
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {Array} array The array to iterate over.
	     * @returns {*} Returns the minimum value.
	     * @example
	     *
	     * _.min([4, 2, 8, 6]);
	     * // => 2
	     *
	     * _.min([]);
	     * // => undefined
	     */
	    function min(array) {
	      return (array && array.length)
	        ? baseExtremum(array, identity, lt)
	        : undefined;
	    }
	
	    /**
	     * This method is like `_.min` except that it accepts `iteratee` which is
	     * invoked for each element in `array` to generate the criterion by which
	     * the value is ranked. The iteratee is invoked with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {Array} array The array to iterate over.
	     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
	     * @returns {*} Returns the minimum value.
	     * @example
	     *
	     * var objects = [{ 'n': 1 }, { 'n': 2 }];
	     *
	     * _.minBy(objects, function(o) { return o.n; });
	     * // => { 'n': 1 }
	     *
	     * // using the `_.property` iteratee shorthand
	     * _.minBy(objects, 'n');
	     * // => { 'n': 1 }
	     */
	    function minBy(array, iteratee) {
	      return (array && array.length)
	        ? baseExtremum(array, getIteratee(iteratee), lt)
	        : undefined;
	    }
	
	    /**
	     * Computes `number` rounded to `precision`.
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {number} number The number to round.
	     * @param {number} [precision=0] The precision to round to.
	     * @returns {number} Returns the rounded number.
	     * @example
	     *
	     * _.round(4.006);
	     * // => 4
	     *
	     * _.round(4.006, 2);
	     * // => 4.01
	     *
	     * _.round(4060, -2);
	     * // => 4100
	     */
	    var round = createRound('round');
	
	    /**
	     * Subtract two numbers.
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {number} minuend The first number in a subtraction.
	     * @param {number} subtrahend The second number in a subtraction.
	     * @returns {number} Returns the difference.
	     * @example
	     *
	     * _.subtract(6, 4);
	     * // => 2
	     */
	    function subtract(minuend, subtrahend) {
	      var result;
	      if (minuend !== undefined) {
	        result = minuend;
	      }
	      if (subtrahend !== undefined) {
	        result = result === undefined ? subtrahend : (result - subtrahend);
	      }
	      return result;
	    }
	
	    /**
	     * Computes the sum of the values in `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {Array} array The array to iterate over.
	     * @returns {number} Returns the sum.
	     * @example
	     *
	     * _.sum([4, 2, 8, 6]);
	     * // => 20
	     */
	    function sum(array) {
	      return (array && array.length)
	        ? baseSum(array, identity)
	        : 0;
	    }
	
	    /**
	     * This method is like `_.sum` except that it accepts `iteratee` which is
	     * invoked for each element in `array` to generate the value to be summed.
	     * The iteratee is invoked with one argument: (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {Array} array The array to iterate over.
	     * @param {Function|Object|string} [iteratee=_.identity] The iteratee invoked per element.
	     * @returns {number} Returns the sum.
	     * @example
	     *
	     * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
	     *
	     * _.sumBy(objects, function(o) { return o.n; });
	     * // => 20
	     *
	     * // using the `_.property` iteratee shorthand
	     * _.sumBy(objects, 'n');
	     * // => 20
	     */
	    function sumBy(array, iteratee) {
	      return (array && array.length)
	        ? baseSum(array, getIteratee(iteratee))
	        : 0;
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    // Ensure wrappers are instances of `baseLodash`.
	    lodash.prototype = baseLodash.prototype;
	
	    LodashWrapper.prototype = baseCreate(baseLodash.prototype);
	    LodashWrapper.prototype.constructor = LodashWrapper;
	
	    LazyWrapper.prototype = baseCreate(baseLodash.prototype);
	    LazyWrapper.prototype.constructor = LazyWrapper;
	
	    // Avoid inheriting from `Object.prototype` when possible.
	    Hash.prototype = nativeCreate ? nativeCreate(null) : objectProto;
	
	    // Add functions to the `MapCache`.
	    MapCache.prototype.clear = mapClear;
	    MapCache.prototype['delete'] = mapDelete;
	    MapCache.prototype.get = mapGet;
	    MapCache.prototype.has = mapHas;
	    MapCache.prototype.set = mapSet;
	
	    // Add functions to the `SetCache`.
	    SetCache.prototype.push = cachePush;
	
	    // Add functions to the `Stack` cache.
	    Stack.prototype.clear = stackClear;
	    Stack.prototype['delete'] = stackDelete;
	    Stack.prototype.get = stackGet;
	    Stack.prototype.has = stackHas;
	    Stack.prototype.set = stackSet;
	
	    // Assign cache to `_.memoize`.
	    memoize.Cache = MapCache;
	
	    // Add functions that return wrapped values when chaining.
	    lodash.after = after;
	    lodash.ary = ary;
	    lodash.assign = assign;
	    lodash.assignIn = assignIn;
	    lodash.assignInWith = assignInWith;
	    lodash.assignWith = assignWith;
	    lodash.at = at;
	    lodash.before = before;
	    lodash.bind = bind;
	    lodash.bindAll = bindAll;
	    lodash.bindKey = bindKey;
	    lodash.chain = chain;
	    lodash.chunk = chunk;
	    lodash.compact = compact;
	    lodash.concat = concat;
	    lodash.cond = cond;
	    lodash.conforms = conforms;
	    lodash.constant = constant;
	    lodash.countBy = countBy;
	    lodash.create = create;
	    lodash.curry = curry;
	    lodash.curryRight = curryRight;
	    lodash.debounce = debounce;
	    lodash.defaults = defaults;
	    lodash.defaultsDeep = defaultsDeep;
	    lodash.defer = defer;
	    lodash.delay = delay;
	    lodash.difference = difference;
	    lodash.differenceBy = differenceBy;
	    lodash.differenceWith = differenceWith;
	    lodash.drop = drop;
	    lodash.dropRight = dropRight;
	    lodash.dropRightWhile = dropRightWhile;
	    lodash.dropWhile = dropWhile;
	    lodash.fill = fill;
	    lodash.filter = filter;
	    lodash.flatMap = flatMap;
	    lodash.flatten = flatten;
	    lodash.flattenDeep = flattenDeep;
	    lodash.flip = flip;
	    lodash.flow = flow;
	    lodash.flowRight = flowRight;
	    lodash.fromPairs = fromPairs;
	    lodash.functions = functions;
	    lodash.functionsIn = functionsIn;
	    lodash.groupBy = groupBy;
	    lodash.initial = initial;
	    lodash.intersection = intersection;
	    lodash.intersectionBy = intersectionBy;
	    lodash.intersectionWith = intersectionWith;
	    lodash.invert = invert;
	    lodash.invertBy = invertBy;
	    lodash.invokeMap = invokeMap;
	    lodash.iteratee = iteratee;
	    lodash.keyBy = keyBy;
	    lodash.keys = keys;
	    lodash.keysIn = keysIn;
	    lodash.map = map;
	    lodash.mapKeys = mapKeys;
	    lodash.mapValues = mapValues;
	    lodash.matches = matches;
	    lodash.matchesProperty = matchesProperty;
	    lodash.memoize = memoize;
	    lodash.merge = merge;
	    lodash.mergeWith = mergeWith;
	    lodash.method = method;
	    lodash.methodOf = methodOf;
	    lodash.mixin = mixin;
	    lodash.negate = negate;
	    lodash.nthArg = nthArg;
	    lodash.omit = omit;
	    lodash.omitBy = omitBy;
	    lodash.once = once;
	    lodash.orderBy = orderBy;
	    lodash.over = over;
	    lodash.overArgs = overArgs;
	    lodash.overEvery = overEvery;
	    lodash.overSome = overSome;
	    lodash.partial = partial;
	    lodash.partialRight = partialRight;
	    lodash.partition = partition;
	    lodash.pick = pick;
	    lodash.pickBy = pickBy;
	    lodash.property = property;
	    lodash.propertyOf = propertyOf;
	    lodash.pull = pull;
	    lodash.pullAll = pullAll;
	    lodash.pullAllBy = pullAllBy;
	    lodash.pullAt = pullAt;
	    lodash.range = range;
	    lodash.rangeRight = rangeRight;
	    lodash.rearg = rearg;
	    lodash.reject = reject;
	    lodash.remove = remove;
	    lodash.rest = rest;
	    lodash.reverse = reverse;
	    lodash.sampleSize = sampleSize;
	    lodash.set = set;
	    lodash.setWith = setWith;
	    lodash.shuffle = shuffle;
	    lodash.slice = slice;
	    lodash.sortBy = sortBy;
	    lodash.sortedUniq = sortedUniq;
	    lodash.sortedUniqBy = sortedUniqBy;
	    lodash.split = split;
	    lodash.spread = spread;
	    lodash.tail = tail;
	    lodash.take = take;
	    lodash.takeRight = takeRight;
	    lodash.takeRightWhile = takeRightWhile;
	    lodash.takeWhile = takeWhile;
	    lodash.tap = tap;
	    lodash.throttle = throttle;
	    lodash.thru = thru;
	    lodash.toArray = toArray;
	    lodash.toPairs = toPairs;
	    lodash.toPairsIn = toPairsIn;
	    lodash.toPath = toPath;
	    lodash.toPlainObject = toPlainObject;
	    lodash.transform = transform;
	    lodash.unary = unary;
	    lodash.union = union;
	    lodash.unionBy = unionBy;
	    lodash.unionWith = unionWith;
	    lodash.uniq = uniq;
	    lodash.uniqBy = uniqBy;
	    lodash.uniqWith = uniqWith;
	    lodash.unset = unset;
	    lodash.unzip = unzip;
	    lodash.unzipWith = unzipWith;
	    lodash.values = values;
	    lodash.valuesIn = valuesIn;
	    lodash.without = without;
	    lodash.words = words;
	    lodash.wrap = wrap;
	    lodash.xor = xor;
	    lodash.xorBy = xorBy;
	    lodash.xorWith = xorWith;
	    lodash.zip = zip;
	    lodash.zipObject = zipObject;
	    lodash.zipObjectDeep = zipObjectDeep;
	    lodash.zipWith = zipWith;
	
	    // Add aliases.
	    lodash.extend = assignIn;
	    lodash.extendWith = assignInWith;
	
	    // Add functions to `lodash.prototype`.
	    mixin(lodash, lodash);
	
	    /*------------------------------------------------------------------------*/
	
	    // Add functions that return unwrapped values when chaining.
	    lodash.add = add;
	    lodash.attempt = attempt;
	    lodash.camelCase = camelCase;
	    lodash.capitalize = capitalize;
	    lodash.ceil = ceil;
	    lodash.clamp = clamp;
	    lodash.clone = clone;
	    lodash.cloneDeep = cloneDeep;
	    lodash.cloneDeepWith = cloneDeepWith;
	    lodash.cloneWith = cloneWith;
	    lodash.deburr = deburr;
	    lodash.endsWith = endsWith;
	    lodash.eq = eq;
	    lodash.escape = escape;
	    lodash.escapeRegExp = escapeRegExp;
	    lodash.every = every;
	    lodash.find = find;
	    lodash.findIndex = findIndex;
	    lodash.findKey = findKey;
	    lodash.findLast = findLast;
	    lodash.findLastIndex = findLastIndex;
	    lodash.findLastKey = findLastKey;
	    lodash.floor = floor;
	    lodash.forEach = forEach;
	    lodash.forEachRight = forEachRight;
	    lodash.forIn = forIn;
	    lodash.forInRight = forInRight;
	    lodash.forOwn = forOwn;
	    lodash.forOwnRight = forOwnRight;
	    lodash.get = get;
	    lodash.gt = gt;
	    lodash.gte = gte;
	    lodash.has = has;
	    lodash.hasIn = hasIn;
	    lodash.head = head;
	    lodash.identity = identity;
	    lodash.includes = includes;
	    lodash.indexOf = indexOf;
	    lodash.inRange = inRange;
	    lodash.invoke = invoke;
	    lodash.isArguments = isArguments;
	    lodash.isArray = isArray;
	    lodash.isArrayLike = isArrayLike;
	    lodash.isArrayLikeObject = isArrayLikeObject;
	    lodash.isBoolean = isBoolean;
	    lodash.isDate = isDate;
	    lodash.isElement = isElement;
	    lodash.isEmpty = isEmpty;
	    lodash.isEqual = isEqual;
	    lodash.isEqualWith = isEqualWith;
	    lodash.isError = isError;
	    lodash.isFinite = isFinite;
	    lodash.isFunction = isFunction;
	    lodash.isInteger = isInteger;
	    lodash.isLength = isLength;
	    lodash.isMatch = isMatch;
	    lodash.isMatchWith = isMatchWith;
	    lodash.isNaN = isNaN;
	    lodash.isNative = isNative;
	    lodash.isNil = isNil;
	    lodash.isNull = isNull;
	    lodash.isNumber = isNumber;
	    lodash.isObject = isObject;
	    lodash.isObjectLike = isObjectLike;
	    lodash.isPlainObject = isPlainObject;
	    lodash.isRegExp = isRegExp;
	    lodash.isSafeInteger = isSafeInteger;
	    lodash.isString = isString;
	    lodash.isSymbol = isSymbol;
	    lodash.isTypedArray = isTypedArray;
	    lodash.isUndefined = isUndefined;
	    lodash.join = join;
	    lodash.kebabCase = kebabCase;
	    lodash.last = last;
	    lodash.lastIndexOf = lastIndexOf;
	    lodash.lowerCase = lowerCase;
	    lodash.lowerFirst = lowerFirst;
	    lodash.lt = lt;
	    lodash.lte = lte;
	    lodash.max = max;
	    lodash.maxBy = maxBy;
	    lodash.mean = mean;
	    lodash.min = min;
	    lodash.minBy = minBy;
	    lodash.noConflict = noConflict;
	    lodash.noop = noop;
	    lodash.now = now;
	    lodash.pad = pad;
	    lodash.padEnd = padEnd;
	    lodash.padStart = padStart;
	    lodash.parseInt = parseInt;
	    lodash.random = random;
	    lodash.reduce = reduce;
	    lodash.reduceRight = reduceRight;
	    lodash.repeat = repeat;
	    lodash.replace = replace;
	    lodash.result = result;
	    lodash.round = round;
	    lodash.runInContext = runInContext;
	    lodash.sample = sample;
	    lodash.size = size;
	    lodash.snakeCase = snakeCase;
	    lodash.some = some;
	    lodash.sortedIndex = sortedIndex;
	    lodash.sortedIndexBy = sortedIndexBy;
	    lodash.sortedIndexOf = sortedIndexOf;
	    lodash.sortedLastIndex = sortedLastIndex;
	    lodash.sortedLastIndexBy = sortedLastIndexBy;
	    lodash.sortedLastIndexOf = sortedLastIndexOf;
	    lodash.startCase = startCase;
	    lodash.startsWith = startsWith;
	    lodash.subtract = subtract;
	    lodash.sum = sum;
	    lodash.sumBy = sumBy;
	    lodash.template = template;
	    lodash.times = times;
	    lodash.toInteger = toInteger;
	    lodash.toLength = toLength;
	    lodash.toLower = toLower;
	    lodash.toNumber = toNumber;
	    lodash.toSafeInteger = toSafeInteger;
	    lodash.toString = toString;
	    lodash.toUpper = toUpper;
	    lodash.trim = trim;
	    lodash.trimEnd = trimEnd;
	    lodash.trimStart = trimStart;
	    lodash.truncate = truncate;
	    lodash.unescape = unescape;
	    lodash.uniqueId = uniqueId;
	    lodash.upperCase = upperCase;
	    lodash.upperFirst = upperFirst;
	
	    // Add aliases.
	    lodash.each = forEach;
	    lodash.eachRight = forEachRight;
	    lodash.first = head;
	
	    mixin(lodash, (function() {
	      var source = {};
	      baseForOwn(lodash, function(func, methodName) {
	        if (!hasOwnProperty.call(lodash.prototype, methodName)) {
	          source[methodName] = func;
	        }
	      });
	      return source;
	    }()), { 'chain': false });
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * The semantic version number.
	     *
	     * @static
	     * @memberOf _
	     * @type string
	     */
	    lodash.VERSION = VERSION;
	
	    // Assign default placeholders.
	    arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function(methodName) {
	      lodash[methodName].placeholder = lodash;
	    });
	
	    // Add `LazyWrapper` methods for `_.drop` and `_.take` variants.
	    arrayEach(['drop', 'take'], function(methodName, index) {
	      LazyWrapper.prototype[methodName] = function(n) {
	        var filtered = this.__filtered__;
	        if (filtered && !index) {
	          return new LazyWrapper(this);
	        }
	        n = n === undefined ? 1 : nativeMax(toInteger(n), 0);
	
	        var result = this.clone();
	        if (filtered) {
	          result.__takeCount__ = nativeMin(n, result.__takeCount__);
	        } else {
	          result.__views__.push({ 'size': nativeMin(n, MAX_ARRAY_LENGTH), 'type': methodName + (result.__dir__ < 0 ? 'Right' : '') });
	        }
	        return result;
	      };
	
	      LazyWrapper.prototype[methodName + 'Right'] = function(n) {
	        return this.reverse()[methodName](n).reverse();
	      };
	    });
	
	    // Add `LazyWrapper` methods that accept an `iteratee` value.
	    arrayEach(['filter', 'map', 'takeWhile'], function(methodName, index) {
	      var type = index + 1,
	          isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;
	
	      LazyWrapper.prototype[methodName] = function(iteratee) {
	        var result = this.clone();
	        result.__iteratees__.push({ 'iteratee': getIteratee(iteratee, 3), 'type': type });
	        result.__filtered__ = result.__filtered__ || isFilter;
	        return result;
	      };
	    });
	
	    // Add `LazyWrapper` methods for `_.head` and `_.last`.
	    arrayEach(['head', 'last'], function(methodName, index) {
	      var takeName = 'take' + (index ? 'Right' : '');
	
	      LazyWrapper.prototype[methodName] = function() {
	        return this[takeName](1).value()[0];
	      };
	    });
	
	    // Add `LazyWrapper` methods for `_.initial` and `_.tail`.
	    arrayEach(['initial', 'tail'], function(methodName, index) {
	      var dropName = 'drop' + (index ? '' : 'Right');
	
	      LazyWrapper.prototype[methodName] = function() {
	        return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
	      };
	    });
	
	    LazyWrapper.prototype.compact = function() {
	      return this.filter(identity);
	    };
	
	    LazyWrapper.prototype.find = function(predicate) {
	      return this.filter(predicate).head();
	    };
	
	    LazyWrapper.prototype.findLast = function(predicate) {
	      return this.reverse().find(predicate);
	    };
	
	    LazyWrapper.prototype.invokeMap = rest(function(path, args) {
	      if (typeof path == 'function') {
	        return new LazyWrapper(this);
	      }
	      return this.map(function(value) {
	        return baseInvoke(value, path, args);
	      });
	    });
	
	    LazyWrapper.prototype.reject = function(predicate) {
	      predicate = getIteratee(predicate, 3);
	      return this.filter(function(value) {
	        return !predicate(value);
	      });
	    };
	
	    LazyWrapper.prototype.slice = function(start, end) {
	      start = toInteger(start);
	
	      var result = this;
	      if (result.__filtered__ && (start > 0 || end < 0)) {
	        return new LazyWrapper(result);
	      }
	      if (start < 0) {
	        result = result.takeRight(-start);
	      } else if (start) {
	        result = result.drop(start);
	      }
	      if (end !== undefined) {
	        end = toInteger(end);
	        result = end < 0 ? result.dropRight(-end) : result.take(end - start);
	      }
	      return result;
	    };
	
	    LazyWrapper.prototype.takeRightWhile = function(predicate) {
	      return this.reverse().takeWhile(predicate).reverse();
	    };
	
	    LazyWrapper.prototype.toArray = function() {
	      return this.take(MAX_ARRAY_LENGTH);
	    };
	
	    // Add `LazyWrapper` methods to `lodash.prototype`.
	    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
	      var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName),
	          isTaker = /^(?:head|last)$/.test(methodName),
	          lodashFunc = lodash[isTaker ? ('take' + (methodName == 'last' ? 'Right' : '')) : methodName],
	          retUnwrapped = isTaker || /^find/.test(methodName);
	
	      if (!lodashFunc) {
	        return;
	      }
	      lodash.prototype[methodName] = function() {
	        var value = this.__wrapped__,
	            args = isTaker ? [1] : arguments,
	            isLazy = value instanceof LazyWrapper,
	            iteratee = args[0],
	            useLazy = isLazy || isArray(value);
	
	        var interceptor = function(value) {
	          var result = lodashFunc.apply(lodash, arrayPush([value], args));
	          return (isTaker && chainAll) ? result[0] : result;
	        };
	
	        if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {
	          // Avoid lazy use if the iteratee has a "length" value other than `1`.
	          isLazy = useLazy = false;
	        }
	        var chainAll = this.__chain__,
	            isHybrid = !!this.__actions__.length,
	            isUnwrapped = retUnwrapped && !chainAll,
	            onlyLazy = isLazy && !isHybrid;
	
	        if (!retUnwrapped && useLazy) {
	          value = onlyLazy ? value : new LazyWrapper(this);
	          var result = func.apply(value, args);
	          result.__actions__.push({ 'func': thru, 'args': [interceptor], 'thisArg': undefined });
	          return new LodashWrapper(result, chainAll);
	        }
	        if (isUnwrapped && onlyLazy) {
	          return func.apply(this, args);
	        }
	        result = this.thru(interceptor);
	        return isUnwrapped ? (isTaker ? result.value()[0] : result.value()) : result;
	      };
	    });
	
	    // Add `Array` and `String` methods to `lodash.prototype`.
	    arrayEach(['pop', 'push', 'shift', 'sort', 'splice', 'unshift'], function(methodName) {
	      var func = arrayProto[methodName],
	          chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
	          retUnwrapped = /^(?:pop|shift)$/.test(methodName);
	
	      lodash.prototype[methodName] = function() {
	        var args = arguments;
	        if (retUnwrapped && !this.__chain__) {
	          return func.apply(this.value(), args);
	        }
	        return this[chainName](function(value) {
	          return func.apply(value, args);
	        });
	      };
	    });
	
	    // Map minified function names to their real names.
	    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
	      var lodashFunc = lodash[methodName];
	      if (lodashFunc) {
	        var key = (lodashFunc.name + ''),
	            names = realNames[key] || (realNames[key] = []);
	
	        names.push({ 'name': methodName, 'func': lodashFunc });
	      }
	    });
	
	    realNames[createHybridWrapper(undefined, BIND_KEY_FLAG).name] = [{ 'name': 'wrapper', 'func': undefined }];
	
	    // Add functions to the lazy wrapper.
	    LazyWrapper.prototype.clone = lazyClone;
	    LazyWrapper.prototype.reverse = lazyReverse;
	    LazyWrapper.prototype.value = lazyValue;
	
	    // Add chaining functions to the `lodash` wrapper.
	    lodash.prototype.at = wrapperAt;
	    lodash.prototype.chain = wrapperChain;
	    lodash.prototype.commit = wrapperCommit;
	    lodash.prototype.flatMap = wrapperFlatMap;
	    lodash.prototype.next = wrapperNext;
	    lodash.prototype.plant = wrapperPlant;
	    lodash.prototype.reverse = wrapperReverse;
	    lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;
	
	    if (iteratorSymbol) {
	      lodash.prototype[iteratorSymbol] = wrapperToIterator;
	    }
	    return lodash;
	  }
	
	  /*--------------------------------------------------------------------------*/
	
	  // Export lodash.
	  var _ = runInContext();
	
	  // Expose lodash on the free variable `window` or `self` when available. This
	  // prevents errors in cases where lodash is loaded by a script tag in the presence
	  // of an AMD loader. See http://requirejs.org/docs/errors.html#mismatch for more details.
	  (freeWindow || freeSelf || {})._ = _;
	
	  // Some AMD build optimizers like r.js check for condition patterns like the following:
	  if (true) {
	    // Define as an anonymous module so, through path mapping, it can be
	    // referenced as the "underscore" module.
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return _;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
	  else if (freeExports && freeModule) {
	    // Export for Node.js.
	    if (moduleExports) {
	      (freeModule.exports = _)._ = _;
	    }
	    // Export for CommonJS support.
	    freeExports._ = _;
	  }
	  else {
	    // Export to the global object.
	    root._ = _;
	  }
	}.call(this));
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)(module), (function() { return this; }())))

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	let AntennaElm = __webpack_require__(17);
	let WireElm = __webpack_require__(20);
	let ResistorElm = __webpack_require__(22);
	let GroundElm = __webpack_require__(23);
	let VoltageElm = __webpack_require__(19);
	let DiodeElm = __webpack_require__(24);
	let OutputElm = __webpack_require__(25);
	let SwitchElm = __webpack_require__(26);
	let CapacitorElm = __webpack_require__(27);
	let InductorElm = __webpack_require__(28);
	let SparkGapElm = __webpack_require__(29);
	let CurrentElm = __webpack_require__(30);
	let RailElm = __webpack_require__(18);
	let MosfetElm = __webpack_require__(31);
	let JfetElm = __webpack_require__(32);
	let TransistorElm = __webpack_require__(33);
	let VarRailElm = __webpack_require__(34);
	let OpAmpElm = __webpack_require__(35);
	let ZenerElm = __webpack_require__(36);
	let Switch2Elm = __webpack_require__(37);
	let SweepElm = __webpack_require__(38);
	let TextElm = __webpack_require__(39);
	let ProbeElm = __webpack_require__(40);
	
	let AndGateElm = __webpack_require__(41);
	let NandGateElm = __webpack_require__(42);
	let OrGateElm = __webpack_require__(43);
	let NorGateElm = __webpack_require__(44);
	let XorGateElm = __webpack_require__(45);
	let InverterElm = __webpack_require__(46);
	
	let LogicInputElm = __webpack_require__(47);
	let LogicOutputElm = __webpack_require__(48);
	let AnalogSwitchElm = __webpack_require__(49);
	let AnalogSwitch2Elm = __webpack_require__(50);
	let MemristorElm = __webpack_require__(51);
	let RelayElm = __webpack_require__(52);
	let TunnelDiodeElm = __webpack_require__(53);
	
	let ScrElm = __webpack_require__(54);
	let TriodeElm = __webpack_require__(55);
	
	let DecadeElm = __webpack_require__(56);
	let LatchElm = __webpack_require__(58);
	let TimerElm = __webpack_require__(59);
	let JkFlipFlopElm = __webpack_require__(60);
	let DFlipFlopElm = __webpack_require__(61);
	let CounterElm = __webpack_require__(62);
	let DacElm = __webpack_require__(63);
	let AdcElm = __webpack_require__(64);
	let VcoElm = __webpack_require__(65);
	let PhaseCompElm = __webpack_require__(66);
	let SevenSegElm = __webpack_require__(67);
	let CC2Elm = __webpack_require__(68);
	
	let TransLineElm = __webpack_require__(69);
	
	let TransformerElm = __webpack_require__(70);
	let TappedTransformerElm = __webpack_require__(71);
	
	let LedElm = __webpack_require__(72);
	let PotElm = __webpack_require__(73);
	let ClockElm = __webpack_require__(74);
	
	let Scope = __webpack_require__(75);
	
	let SimulationParams = __webpack_require__(76);
	
	let Circuit = __webpack_require__(77);
	let Hint = __webpack_require__(89);
	let fs = __webpack_require__(88);
	
	let environment = __webpack_require__(10);
	
	class CircuitLoader {
	  static createEmptyCircuit() {
	    let circuit = new Circuit();
	
	    // Extract circuit simulation params
	    let circuitParams = jsonData.shift();
	    circuit.Params = new SimulationParams(circuitParams);
	    circuit.flags = parseInt(circuitParams['flags']);
	  }
	
	  static createCircuitFromJsonData(jsonData) {
	    // Create a defensive copy of jsonData
	    jsonData = JSON.parse(JSON.stringify(jsonData));
	
	    let circuit = new Circuit();
	
	    // Extract circuit simulation params
	    let circuitParams = jsonData.shift();
	    circuit.Params = new SimulationParams(circuitParams);
	    circuit.flags = parseInt(circuitParams['flags']);
	
	    // Load each component from JSON data:
	    for (let elementData of Array.from(jsonData)) {
	      let type = elementData['name'];
	      let ComponentClass = eval(type);
	
	      if (!ComponentClass)
	        circuit.error(`No matching component for ${type}`);
	
	      if (!type)
	        circuit.error(`Unrecognized Type ${type}`);
	
	      else if (type === "Hint")
	        circuit.setHint(elementData['hintType'], elementData['hintItem1'], elementData['hintItem2']);
	
	      else if (type === "Scope")
	        circuit.addScope(new Scope(elementData["pos"], elementData["params"]));
	
	      else {
	        let [x1, y1, x2, y2] = elementData['pos'];
	        let flags = parseInt(elementData['flags']) || 0;
	
	        circuit.solder(new ComponentClass(x1, y1, x2, y2, elementData['params'], parseInt(flags)));
	      }
	    }
	
	    if (circuit.getElements().length === 0)
	      console.error("No elements loaded. JSON most likely malformed");
	
	    return circuit;
	  }
	
	  /**
	    Constructs a circuit from a reference to a circuit JSON file.
	
	   Example: CircuitLoader.createCircuitFromJsonFile("opint.json", function(circuit) { console.log(circuit); })
	  */
	  static createCircuitFromJsonFile(circuitFileName, onComplete=null) {
	    if (environment.isBrowser) {
	      return $.getJSON(circuitFileName, function(jsonData) {
	        let circuit = CircuitLoader.createCircuitFromJsonData(jsonData);
	
	        onComplete && onComplete(circuit);
	      }).fail(function(e) {
	        console.log( "Load error", e );
	
	        let circuit = new Circuit();
	
	        onComplete && onComplete(circuit);
	      })
	    } else {
	     let jsonData = JSON.parse(fs.readFileSync(circuitFileName));
	     return CircuitLoader.createCircuitFromJsonData(jsonData)
	    }
	  }
	}
	
	module.exports = CircuitLoader;
	


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Settings = __webpack_require__(2);
	let Polygon = __webpack_require__(7);
	let Rectangle = __webpack_require__(3);
	let Point = __webpack_require__(4);
	let RailElm = __webpack_require__(18);
	
	class AntennaElm extends RailElm {
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	    this.waveform = RailElm.WF_DC;
	    this.fmphase = 0;
	  }
	
	  doStep(stamper) {
	    return stamper.updateVoltageSource(0, this.nodes[0], this.voltSource, this.getVoltage());
	  }
	
	  stamp(stamper) {
	    return stamper.stampVoltageSource(0, this.nodes[0], this.voltSource);
	  }
	
	
	  getVoltage() {
	    this.fmphase += 2 * Math.PI * (2200 + (Math.sin(2 * Math.PI * this.getParentCircuit().getTime() * 13) * 100)) * this.getParentCircuit().timeStep();
	
	    let fm = 3 * Math.sin(this.fmphase);
	
	    let pi = Math.PI;
	    let t = this.getParentCircuit().time;
	
	    let wave1 = Math.sin(2 * pi * t * 3000) * (1.3 + Math.sin(2 * pi * t * 12)) * 3;
	    let wave2 = Math.sin(2 * pi * t * 2710) * (1.3 + Math.sin(2 * pi * t * 13)) * 3;
	    let wave3 = (Math.sin(2 * pi * t * 2433) * (1.3 + Math.sin(2 * pi * t * 14)) * 3) + fm;
	
	    return wave1 + wave2 + wave3;
	  }
	
	  getName() {
	    return "Antenna Voltage Rail"
	  }
	}
	
	module.exports = AntennaElm;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Settings = __webpack_require__(2);
	let Polygon = __webpack_require__(7);
	let Rectangle = __webpack_require__(3);
	let Point = __webpack_require__(4);
	let Util = __webpack_require__(5);
	
	let VoltageElm = __webpack_require__(19);
	
	
	class RailElm extends VoltageElm {
	  static initClass() {
	    this.FLAG_CLOCK = 1;
	  }
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	  }
	
	  getPostCount() {
	    return 1;
	  }
	
	  getName() {
	    return "Voltage Rail"
	  }
	
	  draw(renderContext) {
	    this.lead1 = Util.interpolate(this.point1, this.point2, 1 - (VoltageElm.circleSize / this.dn()));
	
	    //this.setBboxPt(this.point1, this.point2, VoltageElm.circleSize);
	
	    //renderContext.drawLinePt(this.point2, this.lead1, Settings.STROKE_COLOR, Settings.LINE_WIDTH+1);
	
	    let pt1, pt2;
	    [pt1, pt2] = Util.interpolateSymmetrical(this.point2, this.lead1, 0, 8);
	
	    renderContext.drawLinePt(pt1, pt2, Settings.STROKE_COLOR, Settings.LINE_WIDTH);
	
	    renderContext.drawLinePt(this.point2, this.point1, Settings.STROKE_COLOR);
	
	    let color = renderContext.getVoltageColor(this.volts[0]);
	    renderContext.drawLinePt(this.point1, this.lead1, color);
	
	    let clock = (this.waveform === VoltageElm.WF_SQUARE) && ((this.flags & VoltageElm.FLAG_CLOCK) !== 0);
	
	    this.updateDots();
	
	    renderContext.drawDots(this.lead1, this.point1, this);
	    renderContext.drawPosts(this);
	
	    if ((this.waveform === VoltageElm.WF_DC) || (this.waveform === VoltageElm.WF_VAR) || clock) {
	      color = "#FFFFFF";  //((if @needsHighlight() then Settings.SELECT_COLOR else "#FFFFFF"))
	
	      //this.setPowerColor(g, false);
	
	      let v = this.getVoltage();
	
	      let s = Util.getUnitText(v, "V", 1);
	      if (Math.abs(v) < 1) { s = v + "V"; } //showFormat.format(v)
	      if (this.getVoltage() > 0) { s = `+${s}`; }
	
	      renderContext.fillText(s, this.point2.x+4, this.point2.y - 7, Settings.TEXT_COLOR, 1.3*Settings.TEXT_SIZE);
	
	      if (clock) { s = "CLK"; }
	
	    } else {
	      this.drawWaveform(this.point2, renderContext);
	    }
	
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      super.debugDraw(renderContext);
	    }
	  }
	
	  getVoltageDiff() {
	    return this.volts[0];
	  }
	
	  setPoints() {
	    super.setPoints(...arguments);
	
	    this.lead1 = Util.interpolate(this.point1, this.point2, 1 - (this.circleSize / this.dn()));
	  }
	
	  stamp(stamper) {
	    if (this.waveform === VoltageElm.WF_DC) {
	      return stamper.stampVoltageSource(0, this.nodes[0], this.voltSource, this.getVoltage());
	    } else {
	      return stamper.stampVoltageSource(0, this.nodes[0], this.voltSource);
	    }
	  }
	
	  doStep(stamper) {
	    if (this.waveform !== VoltageElm.WF_DC) {
	      return stamper.updateVoltageSource(0, this.nodes[0], this.voltSource, this.getVoltage());
	    }
	  }
	
	  hasGroundConnection(n1) {
	    return true;
	  }
	}
	RailElm.initClass();
	
	module.exports = RailElm;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Settings = __webpack_require__(2);
	let Util = __webpack_require__(5);
	
	class VoltageElm extends CircuitComponent {
	  static get Fields() {
	    return {
	      "waveform": {
	        name: "Waveform",
	        default_value: 0,
	        data_type: parseInt,
	        range: [0, 6],
	        field_type: "select",
	        select_values: {
	          "DC Source": VoltageElm.WF_DC,
	          "AC Source": VoltageElm.WF_AC,
	          "Square Wave": VoltageElm.WF_SQUARE,
	          "Triangle Wave": VoltageElm.WF_TRIANGLE,
	          "Sawtooth Wave": VoltageElm.WF_SAWTOOTH,
	          "Pulse Generator": VoltageElm.WF_PULSE,
	          "Variable": VoltageElm.WF_VAR
	        }
	      },
	      "frequency": {
	        name: "Frequency",
	        unit: "Hertz",
	        default_value: 40,
	        symbol: "Hz",
	        data_type: parseFloat
	      },
	      "maxVoltage": {
	        name: "Max Voltage",
	        unit: "Voltage",
	        symbol: "V",
	        default_value: 5,
	        data_type: parseFloat
	      },
	      "bias": {
	        name: "Voltage Bias",
	        unit: "Voltage",
	        symbol: "V",
	        default_value: 0,
	        data_type: parseFloat
	      },
	      "phaseShift": {
	        name: "Phase Shift",
	        unit: "degrees",
	        default_value: 0,
	        symbol: "deg",
	        data_type: parseFloat,
	        range: [-360, 360],
	        type: parseFloat,
	        field_type: "slider"
	      },
	      "dutyCycle": {
	        name: "Duty Cycle",
	        unit: "",
	        default_value: 0.5,
	        symbol: "%",
	        data_type: parseFloat,
	        range: [0, 100],
	        type: parseFloat,
	        field_type: "slider"
	      }
	    };
	  }
	
	  static initClass() {
	    this.FLAG_COS = 2;
	    this.WF_DC = 0;
	    this.WF_AC = 1;
	    this.WF_SQUARE = 2;
	    this.WF_TRIANGLE = 3;
	    this.WF_SAWTOOTH = 4;
	    this.WF_PULSE = 5;
	    this.WF_VAR = 6;
	
	    this.circleSize = 17;
	  }
	
	  constructor(xa, ya, xb, yb, params, f) {
	    let flags = f;
	
	    // Convert parameters to a maximum length of 7
	    // [val1, ..., val2, "Some", "strings"] -> [val1, ..., val2, "Some strings"]
	    if (params instanceof Array && (params.length > 6)) {
	      let labels = params.slice(6, params.length + 1 || undefined);
	
	      params = params.slice(0, 6);
	      params.push(labels.join(" "));
	    }
	
	    super(xa, ya, xb, yb, params, flags);
	
	    if (flags & VoltageElm.FLAG_COS) {
	      flags &= ~VoltageElm.FLAG_COS;
	      this.phaseShift = Math.PI / 2;
	    }
	
	    this.flags = flags;
	
	    this.freqTimeZero = 0;
	
	    this.reset();
	  }
	
	  reset() {
	    this.freqTimeZero = 0;
	    return this.curcount = 0;
	  }
	
	  triangleFunc(x) {
	    if (x < Math.PI) {
	      return (x * (2 / Math.PI)) - 1;
	    }
	
	    return 1 - ((x - Math.PI) * (2 / Math.PI));
	  }
	
	  stamp(stamper) {
	    if (this.waveform === VoltageElm.WF_DC) {
	      return stamper.stampVoltageSource(this.nodes[0], this.nodes[1], this.voltSource, this.getVoltage());
	    } else {
	      return stamper.stampVoltageSource(this.nodes[0], this.nodes[1], this.voltSource);
	    }
	  }
	
	  doStep(stamper) {
	    if (this.waveform !== VoltageElm.WF_DC) {
	      return stamper.updateVoltageSource(this.nodes[0], this.nodes[1], this.voltSource, this.getVoltage());
	    }
	  }
	
	  getVoltage() {
	    if (!this.Circuit) {
	      return 0;
	    }
	
	    let omega = (2 * Math.PI * (this.Circuit.time - this.freqTimeZero) * this.frequency) + this.phaseShift;
	
	    switch (this.waveform) {
	      case VoltageElm.WF_DC:
	        return this.maxVoltage + this.bias;
	      case VoltageElm.WF_AC:
	        return (Math.sin(omega) * this.maxVoltage) + this.bias;
	      case VoltageElm.WF_SQUARE:
	        return this.bias + (((omega % (2 * Math.PI)) > (2 * Math.PI * this.dutyCycle)) ? -this.maxVoltage : this.maxVoltage);
	      case VoltageElm.WF_TRIANGLE:
	        return this.bias + (this.triangleFunc(omega % (2 * Math.PI)) * this.maxVoltage);
	      case VoltageElm.WF_SAWTOOTH:
	        return (this.bias + ((omega % (2 * Math.PI)) * (this.maxVoltage / Math.PI))) - this.maxVoltage;
	      case VoltageElm.WF_PULSE:
	        if ((omega % (2 * Math.PI)) < 1) {
	          return this.maxVoltage + this.bias;
	        } else {
	          return this.bias;
	        }
	      default:
	        return 0;
	    }
	  }
	
	  setPoints() {
	    return super.setPoints(...arguments);
	  }
	
	  draw(renderContext) {
	    this.updateDots();
	
	    if ((this.waveform === VoltageElm.WF_DC) || (this.waveform === VoltageElm.WF_VAR)) {
	      this.calcLeads(8);
	    } else {
	      this.calcLeads(VoltageElm.circleSize * 2);
	    }
	
	    renderContext.drawLeads(this);
	
	    if (this.waveform === VoltageElm.WF_DC) {
	      renderContext.drawDots(this.point1, this.lead1, this);
	      renderContext.drawDots(this.lead2, this.point2, this);
	    } else {
	      renderContext.drawDots(this.point1, this.lead1, this);
	      renderContext.drawDots(this.lead2, this.point2, this);
	    }
	
	    if (this.waveform === VoltageElm.WF_DC) {
	      let [ptA, ptB] = Util.interpolateSymmetrical(this.lead1, this.lead2, 0, Settings.GRID_SIZE);
	      renderContext.drawLinePt(this.lead1, ptA, renderContext.getVoltageColor(this.volts[0]));
	
	      renderContext.drawLinePt(ptA, ptB, renderContext.getVoltageColor(this.volts[0]), Settings.LINE_WIDTH + 1);
	
	      // this.setBboxPt(this.point1, this.point2, Settings.GRID_SIZE);
	      [ptA, ptB] = Util.interpolateSymmetrical(this.lead1, this.lead2, 1, 2 * Settings.GRID_SIZE);
	      renderContext.drawLinePt(ptA, ptB, renderContext.getVoltageColor(this.volts[1]), Settings.LINE_WIDTH + 1);
	
	      renderContext.drawValue(-25, 0, this, Util.getUnitText(this.getVoltageDiff(), this.unitSymbol(), Settings.COMPONENT_DECIMAL_PLACES));
	    } else {
	      // this.setBboxPt(this.point1, this.point2, VoltageElm.circleSize);
	      let ps1 = Util.interpolate(this.lead1, this.lead2, 0.5);
	      this.drawWaveform(ps1, renderContext);
	    }
	
	    renderContext.drawPosts(this);
	
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      super.debugDraw(renderContext);
	    }
	  }
	
	  getName() {
	    return "Voltage Source"
	  }
	
	  drawWaveform(center, renderContext) {
	    let xc = center.x;
	    let yc = center.y;
	
	    renderContext.fillCircle(xc, yc, VoltageElm.circleSize, 2, Settings.FILL_COLOR);
	
	    let color = Settings.SECONDARY_COLOR;
	
	    let wl = 8;
	    let xl = 5;
	    this.setBbox(xc - VoltageElm.circleSize, yc - VoltageElm.circleSize, xc + VoltageElm.circleSize, yc + VoltageElm.circleSize);
	    let xc2 = undefined;
	
	    switch (this.waveform) {
	      case VoltageElm.WF_DC:
	        break;
	
	      case VoltageElm.WF_SQUARE:
	        xc2 = Math.floor(((wl * 2 * this.dutyCycle) - wl) + xc);
	        xc2 = Math.max((xc - wl) + 3, Math.min((xc + wl) - 3, xc2));
	
	        renderContext.drawLine(xc - wl, yc - wl, xc - wl, yc, color);
	        renderContext.drawLine(xc - wl, yc - wl, xc2, yc - wl, color);
	        renderContext.drawLine(xc2, yc - wl, xc2, yc + wl, color);
	        renderContext.drawLine(xc + wl, yc + wl, xc2, yc + wl, color);
	        renderContext.drawLine(xc + wl, yc, xc + wl, yc + wl, color);
	
	        let str = this.params.maxVoltage + "V @ " + this.params.frequency + "Hz";
	        renderContext.drawValue(35, 0, this, str);
	        renderContext.drawValue(45, 0, this, Util.floatToPercent(this.params.dutyCycle));
	
	        break;
	
	      case VoltageElm.WF_PULSE:
	        yc += wl / 2;
	
	        renderContext.beginPath();
	        renderContext.drawLine(xc - wl, yc - wl, xc - wl, yc, color);
	        renderContext.drawLine(xc - wl, yc - wl, xc - wl/2, yc - wl, color);
	        renderContext.drawLine(xc - wl/2, yc - wl, xc - wl/2, yc, color);
	        renderContext.drawLine(xc - wl/2, yc, xc + wl, yc, color);
	        renderContext.closePath();
	
	        renderContext.drawValue(25, 0, this, this.params.maxVoltage + "V @ " + this.params.frequency + "Hz");
	
	        yc -= wl / 2;
	
	        break;
	
	      case VoltageElm.WF_SAWTOOTH:
	        renderContext.drawLine(xc, yc - wl, xc - wl, yc, color);
	        renderContext.drawLine(xc, yc - wl, xc, yc + wl, color);
	        renderContext.drawLine(xc, yc + wl, xc + wl, yc, color);
	        renderContext.drawValue(35, 0, this, this.params.maxVoltage + "V @ " + this.params.frequency + "Hz");
	        break;
	
	      case VoltageElm.WF_TRIANGLE:
	
	        renderContext.drawLine(xc - (xl * 2), yc, xc - xl, yc - wl, color);
	        renderContext.drawLine(xc - xl, yc - wl, xc, yc, color);
	        renderContext.drawLine(xc, yc, xc + xl, yc + wl, color);
	        renderContext.drawLine(xc + xl, yc + wl, xc + (xl * 2), yc, color);
	        renderContext.drawValue(35, 0, this, this.params.maxVoltage + "V @ " + this.params.frequency + "Hz");
	        break;
	
	      case VoltageElm.WF_AC:
	        xl = 10;
	        let ox = -1;
	        let oy = -1;
	
	        let i = -xl;
	        while (i <= xl) {
	          let yy = yc + Math.floor(0.95 * Math.sin((i * Math.PI) / xl) * wl);
	          if (ox !== -1) {
	            renderContext.drawLine(ox, oy, xc + i, yy, color);
	          }
	          ox = xc + i;
	          oy = yy;
	          i++;
	        }
	
	        renderContext.drawValue(25, 0, this, this.params.maxVoltage + "V @ " + this.params.frequency + "Hz");
	        break;
	    }
	
	    renderContext.drawCircle(xc, yc, VoltageElm.circleSize, 2, "#000000");
	
	    if (Settings.SHOW_VALUES) {
	      let valueString;
	      return valueString = Util.getUnitText(this.frequency, "Hz");
	    }
	  }
	
	  getVoltageSourceCount() {
	    return 1;
	  }
	
	  getPower() {
	    return -this.getVoltageDiff() * this.current;
	  }
	
	  getVoltageDiff() {
	    return this.volts[1] - this.volts[0];
	  }
	
	  unitSymbol() {
	    return "V";
	  }
	
	  getInfo(arr) {
	    switch (this.waveform) {
	      case VoltageElm.WF_DC:
	      case VoltageElm.WF_VAR:
	        arr[0] = "Voltage source";
	        break;
	      case VoltageElm.WF_AC:
	        arr[0] = "A/C source";
	        break;
	      case VoltageElm.WF_SQUARE:
	        arr[0] = "Square wave gen";
	        break;
	      case VoltageElm.WF_PULSE:
	        arr[0] = "Pulse gen";
	        break;
	      case VoltageElm.WF_SAWTOOTH:
	        arr[0] = "Sawtooth gen";
	        break;
	      case VoltageElm.WF_TRIANGLE:
	        arr[0] = "Triangle gen";
	        break;
	    }
	
	    arr[1] = `I = ${Util.getUnitText(this.getCurrent(), "A")}`;
	//      arr[2] = ((if (this instanceof RailElm) then "V = " else "Vd = ")) + DrawHelper.getVoltageText(@getVoltageDiff())
	
	    if ((this.waveform !== VoltageElm.WF_DC) && (this.waveform !== VoltageElm.WF_VAR)) {
	      arr[3] = `f = ${Util.getUnitText(this.frequency, "Hz")}`;
	      arr[4] = `Vmax = ${Util.getUnitText(this.maxVoltage, "V")}`;
	      let i = 5;
	      if (this.bias !== 0) {
	        arr[i++] = `Voff = ${Util.getUnitText(this.bias, "V")}`;
	      } else if (this.frequency > 500) {
	        arr[i++] = `wavelength = ${Util.getUnitText(2.9979e8 / this.frequency, "m")}`;
	      }
	      return arr[i++] = `P = ${Util.getUnitText(this.getPower(), "W")}`;
	    }
	  }
	}
	VoltageElm.initClass();
	
	
	module.exports = VoltageElm;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Settings = __webpack_require__(2);
	let Polygon = __webpack_require__(7);
	let Rectangle = __webpack_require__(3);
	let Point = __webpack_require__(4);
	let Util = __webpack_require__(5);
	let GateElm = __webpack_require__(21);
	
	class WireElm extends CircuitComponent {
	  static initClass() {
	    this.FLAG_SHOWCURRENT = 1;
	    this.FLAG_SHOWVOLTAGE = 2;
	  }
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	  }
	
	  getName() {
	    return "Wire";
	  }
	
	  draw(renderContext) {
	    let s;
	    renderContext.drawLinePt(this.point1, this.point2, renderContext.getVoltageColor(this.volts[0]));
	    //  @setBboxPt @point1, @point2, 3
	
	    if (this.mustShowCurrent()) {
	      s = Util.getUnitText(Math.abs(this.getCurrent()), "A");
	    } else if (this.mustShowVoltage()) {
	      s = Util.getUnitText(this.volts[0], "V");
	    }
	
	    this.updateDots();
	    renderContext.drawDots(this.point1, this.point2, this);
	
	    if (Settings.WIRE_POSTS)
	      renderContext.drawPosts(this);
	
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      return super.debugDraw(renderContext);
	    }
	  }
	
	
	  stamp(stamper) {
	    return stamper.stampVoltageSource(this.nodes[0], this.nodes[1], this.voltSource, 0);
	  }
	
	  mustShowCurrent() {
	    return (this.flags & WireElm.FLAG_SHOWCURRENT) !== 0;
	  }
	
	  mustShowVoltage() {
	    return (this.flags & WireElm.FLAG_SHOWVOLTAGE) !== 0;
	  }
	
	  getVoltageSourceCount() {
	    return 1;
	  }
	
	  getPower() {
	    return 0;
	  }
	
	  getVoltageDiff() {
	    return this.volts[0];
	  }
	
	  isWire() {
	    return true;
	  }
	
	  needsShortcut() {
	    return true;
	  }
	}
	WireElm.initClass();
	
	module.exports = WireElm;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Util = __webpack_require__(5);
	let Settings = __webpack_require__(2);
	
	class GateElm extends CircuitComponent {
	  static initClass() {
	    this.FLAG_SMALL = 1;
	  }
	
	  static get Fields() {
	    return {
	      inputCount: {
	        name: "Input count",
	        data_type: parseInt,
	        default_value: 2,
	        field: "integer"
	      },
	      lastOutput: {
	        name: "Initial State",
	        data_type(x) {
	          return x > 2.5;
	        },
	        default_value: false
	      }
	    };
	  }
	
	  constructor(xa, ya, xb, yb, params, f) {
	    let size;
	    if (parseInt(f) & (GateElm.FLAG_SMALL !== 0)) {
	      size = 1;
	    } else {
	      size = 2;
	    }
	
	    super(xa, ya, xb, yb, params, f);
	
	    this.setSize(size);
	
	    this.noDiagonal = true;
	    this.linePoints = null;
	
	    this.place()
	  }
	
	  isInverting() {
	    return false;
	  }
	
	  setSize(s) {
	    this.gsize = s;
	    this.gwidth = 7 * s;
	    this.gwidth2 = 14 * s;
	    this.gheight = 8 * s;
	    if (s === 1) {
	      return this.flags = GateElm.FLAG_SMALL;
	    } else {
	      return this.flags = 0;
	    }
	  }
	
	  place() {
	    //super.setPoints(...arguments);
	
	//    if @dn() > 150
	//      @setSize(2)
	
	    let hs = this.gheight;
	    this.ww = Math.floor(this.gwidth2);
	
	    if (this.ww > (this.dn()/2)) {
	      this.ww = Math.floor(this.dn()/2);
	    }
	
	    if (this.isInverting() && ((this.ww + 8) > (this.dn()/2))) {
	      this.ww = Math.floor(this.dn() / 2) - 8;
	    }
	
	    this.calcLeads(this.ww*2);
	
	    this.inPosts = Util.newPointArray(this.inputCount);
	    this.inGates = Util.newPointArray(this.inputCount);
	
	    this.allocNodes();
	
	    let i0 = -Math.floor(this.inputCount / 2);
	
	    for (let i = 0; i<this.inputCount; ++i) {
	      if ((i0 === 0) && ((this.inputCount & 1) === 0)) {
	        i0 += 1;
	      }
	
	      this.inPosts[i] = Util.interpolate(this.point1, this.point2, 0, hs * i0);
	      this.inGates[i] = Util.interpolate(this.lead1, this.lead2, 0, hs * i0);
	
	      if (this.lastOutput ^ this.isInverting()) {
	        this.volts[i] = 5;
	      } else {
	        this.volts[i] = 0;
	      }
	
	      i0 += 1;
	    }
	
	    this.hs2 = this.gwidth * (Math.floor(this.inputCount / 2) + 1);
	    this.setBboxPt(this.lead1, this.lead2, 2 * this.hs2);
	  }
	
	
	  doStep(stamper) {
	    let res;
	    let f = this.calcFunction();
	
	    if (this.isInverting()) {
	      f = (f > 0) ? 0 : 1;
	    }
	
	    this.lastOutput = (f > 0);
	    this.params['lastOutput'] = (f > 0);
	
	    if (f) {
	      res = 5;
	    } else {
	      res = 0;
	    }
	
	    // console.log("V", this.volts, f, res);
	
	    // console.log("GATE " + this.getName() + "nodes: " + this.nodes[this.inputCount] + " vs: " +  this.voltSource + "res: " + res)
	
	    return stamper.updateVoltageSource(0, this.nodes[this.inputCount], this.voltSource, res);
	  }
	
	
	  draw(renderContext){
	    for (let i = 0; i < this.inputCount; i++) {
	      renderContext.drawLinePt(this.inPosts[i], this.inGates[i], renderContext.getVoltageColor(this.volts[i]));
	    }
	
	    //this.setBboxPt(this.point1, this.point2, this.hs2)
	
	    renderContext.drawLinePt(this.lead2, this.point2, renderContext.getVoltageColor(this.volts[this.inputCount]));
	
	    renderContext.drawThickPolygonP(this.gatePoly, Settings.STROKE_COLOR);
	    if (this.linePoints !== null) {
	      for (let i = 0; i< this.linePoints.length - 1; i++) {
	        renderContext.drawLinePt(this.linePoints[i], this.linePoints[i + 1]);
	      }
	    }
	
	    if (this.isInverting()) {
	      renderContext.fillCircle(this.pcircle.x, this.pcircle.y, Settings.POST_RADIUS + 2, 2, "#FFFFFF", Settings.STROKE_COLOR);
	    }
	
	    this.updateDots();
	    renderContext.drawDots(this.lead2, this.point2, this);
	
	    renderContext.drawPosts(this);
	    // renderContext.drawPosts(this);
	
	    for (let i = 0; i < this.getPostCount(); i++) {
	      let post = this.getPost(i);
	      renderContext.drawPost(post.x, post.y)
	    }
	
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      return super.debugDraw(renderContext);
	    }
	  }
	
	  getPostCount() {
	    return this.inputCount + 1;
	  }
	
	  getVoltageSourceCount() {
	    return 1;
	  }
	
	  getPost(n) {
	    if (n === this.inputCount) {
	      return this.point2;
	    }
	
	    return this.inPosts[n];
	  }
	
	  getInput(n){
	    //    console.log("INPUT #{n} is #{@volts[n]}")
	    return this.volts[n] > 2.5;
	  }
	
	  getConnection(n1, n2){
	    return false;
	  }
	
	  hasGroundConnection(n1) {
	    return n1 === this.inputCount;
	  }
	
	  stamp(stamper) {
	    return stamper.stampVoltageSource(0, this.nodes[this.inputCount], this.voltSource);
	  }
	}
	
	GateElm.initClass();
	
	module.exports = GateElm;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Settings = __webpack_require__(2);
	let Polygon = __webpack_require__(7);
	let Rectangle = __webpack_require__(3);
	let Point = __webpack_require__(4);
	let Util = __webpack_require__(5);
	//Maxwell = require('../../Maxwell.js')
	
	class ResistorElm extends CircuitComponent {
	  static get Fields() {
	    return {
	      "resistance": {
	        name: "Resistance",
	        description: "Amount of current per unit voltage applied to this resistor (ideal).",
	        unit: "Ohms",
	        default_value: 1000,
	        symbol: "Ω",
	        data_type: parseFloat,
	        range: [0, Infinity],
	        type: "physical"
	      }
	    };
	  }
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	  }
	
	  value() {
	    return this.resistance;
	  }
	
	  draw(renderContext) {
	    this.calcLeads(32);
	
	    let numSegments = 16;
	    let width = 5;
	
	//    @setBboxPt @point1, @point2, width
	
	    renderContext.drawLeads(this);
	
	    let parallelOffset = 1 / numSegments;
	
	    this.updateDots();
	
	    renderContext.drawDots(this.point1, this.lead1, this);
	    renderContext.drawDots(this.lead2, this.point2, this);
	
	    // Generate alternating sequence 0, 1, 0, -1, 0 ... to offset perpendicular to wire
	    let offsets = [0, 1, 0, -1];
	
	    let context = renderContext.context
	    context.save();
	    context.beginPath();
	
	    context.moveTo(this.lead1.x, this.lead1.y);
	    context.lineJoin = 'bevel';
	
	    let grad = context.createLinearGradient(this.lead1.x, this.lead1.y, this.lead2.x, this.lead2.y);
	    let volt0Color = renderContext.getVoltageColor(this.volts[0]);
	    let volt1Color = renderContext.getVoltageColor(this.volts[1]);
	
	    grad.addColorStop(0, volt0Color);
	    grad.addColorStop(1, volt1Color);
	
	    context.strokeStyle = grad;
	
	    // Draw resistor "zig-zags"
	    for (let n = 0; n < numSegments + 1; n++) {
	      if (renderContext.boldLines) {
	        context.lineWidth = Settings.BOLD_LINE_WIDTH;
	        context.strokeStyle = Settings.SELECT_COLOR;
	      } else {
	        context.lineWidth = Settings.LINE_WIDTH + 1;
	      }
	
	      let startPosition = Util.interpolate(this.lead1, this.lead2, n*parallelOffset, width*offsets[n % 4]);
	
	      context.lineTo(startPosition.x + renderContext.lineShift, startPosition.y + renderContext.lineShift);
	    }
	
	    context.stroke();
	
	    context.closePath();
	    context.restore();
	
	    renderContext.drawValue(10, 0, this, Util.getUnitText(this.resistance, this.unitSymbol(), Settings.COMPONENT_DECIMAL_PLACES));
	
	    renderContext.drawPosts(this);
	
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      super.debugDraw(renderContext);
	    }
	  }
	
	  unitSymbol() {
	    return "Ω";
	  }
	  
	  getName() {
	    return "Resistor"
	  }
	
	  needsShortcut() {
	    return true;
	  }
	
	  calculateCurrent() {
	    return this.current = (this.volts[0] - this.volts[1]) / this.resistance;
	  }
	
	  stamp(stamper) {
	    if (this.orphaned()) {
	      console.warn("attempting to stamp an orphaned resistor");
	    }
	
	    return stamper.stampResistor(this.nodes[0], this.nodes[1], this.resistance);
	  }
	}
	ResistorElm.initClass();
	
	module.exports = ResistorElm;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Settings = __webpack_require__(2);
	let Polygon = __webpack_require__(7);
	let Rectangle = __webpack_require__(3);
	let Point = __webpack_require__(4);
	let Util = __webpack_require__(5);
	
	class GroundElm extends CircuitComponent {
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	  }
	
	  getPostCount() {
	    return 1;
	  }
	
	  getName() {
	    return "Ground"
	  }
	
	  draw(renderContext) {
	    this.updateDots();
	
	    let color = renderContext.getVoltageColor(0);
	
	    renderContext.drawLinePt(this.point1, this.point2, color);
	
	    let pt2 = Util.interpolate(this.point1, this.point2, 1 + (11.0 / this.dn()));
	
	    renderContext.drawDots(this.point1, this.point2, this);
	    renderContext.drawPosts(this);
	
	    for (let row = 0; row < 3; row++) {
	      let pt1;
	      let startPt = 6 - (row * 2);
	      let endPt = row * 3;
	      [pt1, pt2] = Util.interpolateSymmetrical(this.point1, this.point2, 1 + (endPt / this.dn()), startPt);
	      renderContext.drawLinePt(pt1, pt2, color);
	    }
	
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      super.debugDraw(renderContext);
	    }
	  }
	
	  setCurrent(x, currentVal) {
	    return this.current = -currentVal;
	  }
	
	  stamp(stamper) {
	//    console.log("\n::Stamping GroundElm::")
	    return stamper.stampVoltageSource(0, this.nodes[0], this.voltSource, 0);
	  }
	
	  getVoltageDiff() {
	    return 0;
	  }
	
	  getVoltageSourceCount() {
	    return 1;
	  }
	
	  hasGroundConnection(n1) {
	    return true;
	  }
	
	  needsShortcut() {
	    return true;
	  }
	}
	
	module.exports = GroundElm;
	


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Settings = __webpack_require__(2);
	let Polygon = __webpack_require__(7);
	let Rectangle = __webpack_require__(3);
	let Point = __webpack_require__(4);
	let Util = __webpack_require__(5);
	
	class DiodeElm extends CircuitComponent {
	  static initClass() {
	  
	    this.FLAG_FWDROP = 1;
	    this.DEFAULT_DROP = 0.805904783;
	  }
	
	  static get Fields() {
	    return {
	      fwdrop: {
	        name: "Voltage Drop",
	        unit: "Voltage",
	        symbol: "V",
	        default_value: DiodeElm.DEFAULT_DROP,
	        data_type: parseFloat
	      }
	    }
	  }
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	
	    this.hs = 8;
	    this.poly;
	    this.cathode = [];
	
	//    @fwdrop = DiodeElm.DEFAULT_DROP
	    this.zvoltage = 0;
	
	    this.nodes = new Array(2);
	    this.vt = 0;
	    this.vdcoef = 0;
	    this.zvoltage = 0;
	    this.zoffset = 0;
	    this.lastvoltdiff = 0;
	    this.crit = 0;
	    this.leakage = 1e-14;
	
	    this.setBboxPt(this.point1, this.point2, this.hs);
	
	    this.setup();
	  }
	
	  nonLinear() {
	    return true;
	  }
	
	  setup() {
	    this.vdcoef = Math.log((1 / this.leakage) + 1) / this.fwdrop;
	    this.vt = 1 / this.vdcoef;
	
	    // critical voltage for limiting; current is vt/sqrt(2) at this voltage
	    this.vcrit = this.vt * Math.log(this.vt / (Math.sqrt(2) * this.leakage));
	
	    if (this.zvoltage === 0) {
	      return this.zoffset = 0;
	    } else {
	    // calculate offset which will give us 5mA at zvoltage
	      let i = -.005;
	      return this.zoffset = this.zvoltage - (Math.log(-(1 + (i / this.leakage))) / this.vdcoef);
	    }
	  }
	
	  draw(renderContext) {
	    this.calcLeads(16);
	
	    this.cathode = Util.newPointArray(2);
	    let [pa, pb] = Util.interpolateSymmetrical(this.lead1, this.lead2, 0, this.hs);
	    [this.cathode[0], this.cathode[1]] = Util.interpolateSymmetrical(this.lead1, this.lead2, 1, this.hs);
	    this.poly = Util.createPolygonFromArray([pa, pb, this.lead2]);
	
	    this.drawDiode(renderContext);
	
	    this.updateDots();
	    renderContext.drawDots(this.point1, this.point2, this);
	
	    renderContext.drawPosts(this);
	
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      return super.debugDraw(renderContext);
	    }
	  }
	
	  getName() {
	    return "Diode"
	  }
	
	  reset() {
	    this.lastvoltdiff = 0;
	    return this.volts[0] = this.volts[1] = this.curcount = 0;
	  }
	
	  drawDiode(renderContext) {
	
	    let v1 = this.volts[0];
	    let v2 = this.volts[1];
	
	    renderContext.drawLeads(this);
	
	    // TODO: RENDER DIODE
	
	    // draw arrow
	    //this.setPowerColor(true);
	    let color = renderContext.getVoltageColor(v1);
	    renderContext.drawThickPolygonP(this.poly, color);
	
	    //g.fillPolygon(poly);
	
	    // draw the diode plate
	    color = renderContext.getVoltageColor(v2);
	    return renderContext.drawLinePt(this.cathode[0], this.cathode[1], color);
	  }
	
	  stamp(stamper) {
	    stamper.stampNonLinear(this.nodes[0]);
	    return stamper.stampNonLinear(this.nodes[1]);
	  }
	
	  doStep(stamper) {
	    let geq, nc;
	    let voltdiff = this.volts[0] - this.volts[1];
	
	//    console.log("delta v: " + Math.abs(voltdiff - @lastvoltdiff));
	
	    // used to have .1 here, but needed .01 for peak detector
	    if (Math.abs(voltdiff - this.lastvoltdiff) > .01) {
	      //console.log("CONVERGE FAIL!")
	      this.Circuit.Solver.converged = false;
	    }
	
	    voltdiff = this.limitStep(voltdiff, this.lastvoltdiff);
	
	    this.lastvoltdiff = voltdiff;
	
	    if ((voltdiff >= 0) || (this.zvoltage === 0)) {
	      // regular diode or forward-biased zener
	      let eval_ = Math.exp(voltdiff * this.vdcoef);
	
	      // make diode linear with negative voltages; aids convergence
	      if (voltdiff < 0) { eval_ = 1; }
	      geq = this.vdcoef * this.leakage * eval_;
	      nc = ((eval_ - 1) * this.leakage) - (geq * voltdiff);
	
	      // console.log("DIODE", this.fwdrop, this.vdcoef, this.leakage)
	
	      stamper.stampConductance(this.nodes[0], this.nodes[1], geq);
	      return stamper.stampCurrentSource(this.nodes[0], this.nodes[1], nc);
	
	      //console.log("1 sim.stampConductance(" + @nodes[0] + ", " + @nodes[1] + ", " + geq + ", " + nc + " " + (eval_ - 1)  + " " + @leakage  + " " +  geq  + " " + voltdiff + " " + @vdcoef);
	    } else {
	      // Zener diode
	      //* I(Vd) = Is * (exp[Vd*C] - exp[(-Vd-Vz)*C] - 1 )
	      //*
	      //* geq is I'(Vd)
	      //* nc is I(Vd) + I'(Vd)*(-Vd)
	      geq = this.leakage * this.vdcoef * (Math.exp(voltdiff * this.vdcoef) + Math.exp((-voltdiff - this.zoffset) * this.vdcoef));
	      nc = (this.leakage * (Math.exp(voltdiff * this.vdcoef) - Math.exp((-voltdiff - this.zoffset) * this.vdcoef) - 1)) + (geq * (-voltdiff));
	
	      stamper.stampConductance(this.nodes[0], this.nodes[1], geq);
	      return stamper.stampCurrentSource(this.nodes[0], this.nodes[1], nc);
	    }
	  }
	
	      //console.log("2 sim.stampConductance(" + @nodes[0] + ", " + @nodes[1] + ", " + geq + ", " + nc);
	
	    //console.log("geq: ", geq)
	    //console.log("nc: ", nc)
	
	  calculateCurrent() {
	    let voltdiff = this.volts[0] - this.volts[1];
	
	    if ((voltdiff >= 0) || (this.zvoltage === 0)) {
	      return this.current = this.leakage * (Math.exp(voltdiff * this.vdcoef) - 1);
	    } else {
	      return this.current = this.leakage * (Math.exp(voltdiff * this.vdcoef) - Math.exp((-voltdiff - this.zoffset) * this.vdcoef) - 1);
	    }
	  }
	
	  // TODO: fix
	  needsShortcut() {
	    return true;
	  }
	
	  limitStep(vnew, vold) {
	    let v0;
	    let arg = undefined;
	    let oo = vnew;
	
	    // check new voltage; has current changed by factor of e^2?
	    if ((vnew > this.vcrit) && (Math.abs(vnew - vold) > (this.vt + this.vt))) {
	      if (vold > 0) {
	        arg = 1 + ((vnew - vold) / this.vt);
	        if (arg > 0) {
	          // adjust vnew so that the current is the same
	          // as in linearized model from previous iteration.
	          // current at vnew = old current * arg
	          vnew = vold + (this.vt * Math.log(arg));
	
	          // current at v0 = 1uA
	          v0 = Math.log(1e-6 / this.leakage) * this.vt;
	          vnew = Math.max(v0, vnew);
	        } else {
	          vnew = this.vcrit;
	        }
	      } else {
	        // adjust vnew so that the current is the same
	        // as in linearized model from previous iteration.
	        // (1/vt = slope of load line)
	        vnew = this.vt * Math.log(vnew / this.vt);
	      }
	
	//      console.log("CONVERGE: vnew > @vcrit and Math.abs(vnew - vold) > (@vt + @vt)")
	      this.Circuit.Solver.converged = false;
	
	    } else if ((vnew < 0) && (this.zoffset !== 0)) {
	      // for Zener breakdown, use the same logic but translate the values
	      vnew = -vnew - this.zoffset;
	      vold = -vold - this.zoffset;
	      if ((vnew > this.vcrit) && (Math.abs(vnew - vold) > (this.vt + this.vt))) {
	        if (vold > 0) {
	          arg = 1 + ((vnew - vold) / this.vt);
	          if (arg > 0) {
	            vnew = vold + (this.vt * Math.log(arg));
	            v0 = Math.log(1e-6 / this.leakage) * this.vt;
	            vnew = Math.max(v0, vnew);
	
	          } else {
	            vnew = this.vcrit;
	          }
	        } else {
	          vnew = this.vt * Math.log(vnew / this.vt);
	        }
	
	        this.Circuit.Solver.converged = false;
	      }
	      vnew = -(vnew + this.zoffset);
	    }
	    return vnew;
	  }
	}
	DiodeElm.initClass();
	
	
	module.exports = DiodeElm;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Settings = __webpack_require__(2);
	let Polygon = __webpack_require__(7);
	let Rectangle = __webpack_require__(3);
	let Point = __webpack_require__(4);
	let Util = __webpack_require__(5);
	
	class OutputElm extends CircuitComponent {
	  static initClass() {
	  
	    this.FLAG_VALUE = 1;
	  }
	
	  constructor(xa, ya, xb, yb, params, f) {
	    // st not used for OutputElm
	    super(xa, ya, xb, yb, params, f);
	
	    this.place()
	  }
	
	  getPostCount() {
	    return 1;
	  }
	
	  getName() {
	    return "Output"
	  }
	
	  place() {
	    this.s = ((this.flags & OutputElm.FLAG_VALUE) !== 0 ? Util.getUnitText(this.volts[0], "V") : "out");
	    this.lead1 = Util.interpolate(this.point1, this.point2, 1 - ((((3 * this.s.length) / 2) + 8) / this.dn()));
	
	    this.setBboxPt(this.lead1, this.point1, 8);
	  }
	
	  draw(renderContext) {
	    renderContext.drawValue(-13, 35, this, this.s, 1.5*Settings.TEXT_SIZE);
	
	    let color = renderContext.getVoltageColor(this.volts[0]);
	
	    renderContext.drawLinePt(this.point1, this.lead1, color);
	    renderContext.fillCircle(this.lead1.x, this.lead1.y, 2*Settings.POST_RADIUS, 1, Settings.FILL_COLOR, Settings.STROKE_COLOR);
	    renderContext.drawPosts(this);
	
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      return super.debugDraw(renderContext);
	    }
	  }
	
	  getVoltageDiff() {
	    return this.volts[0];
	  }
	
	  stamp(stamper) {}
	}
	OutputElm.initClass();
	
	module.exports = OutputElm;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Settings = __webpack_require__(2);
	let Polygon = __webpack_require__(7);
	let Rectangle = __webpack_require__(3);
	let Point = __webpack_require__(4);
	let Util = __webpack_require__(5);
	
	class SwitchElm extends CircuitComponent {
	  static get Fields() {
	  
	    return {
	      "position": {
	        name: "Position",
	        default_value: 0,
	        data_type(str){
	          str = str.toString();
	  
	          if (str === 'true') {
	            return 1;
	          } else if (str === 'false') {
	            return 0;
	          } else {
	            return parseInt(str);
	          }
	        },
	        field_type: "boolean"
	      },
	      "momentary": {
	        name: "Momentary",
	        default_value: false,
	        data_type(str) { return str.toString() === 'true'; },
	        field_type: "boolean"
	      }
	    };
	  }
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	    
	    this.momentary = false;
	    this.position = 0;
	    this.posCount = 2;
	
	    this.ps = new Point(0, 0);
	    this.ps2 = new Point(0, 0);
	
	    this.place()
	  }
	
	  place() {
	    //super.setPoints(...arguments);
	
	    this.calcLeads(32);
	    this.ps = new Point(0, 0);
	    this.ps2 = new Point(0, 0);
	
	    this.openhs = 16;
	    this.setBboxPt(this.point1, this.point2, this.openhs/2);
	  }
	
	  stamp(stamper) {
	//    console.log(@voltSource)
	    if (this.position === 0) {
	      return stamper.stampVoltageSource(this.nodes[0], this.nodes[1], this.voltSource, 0);
	    }
	  }
	
	  draw(renderContext) {
	    this.calcLeads(32);
	    //this.setBboxPt(this.point1, this.point2, this.openhs/2);
	
	    this.ps = new Point(0, 0);
	    this.ps2 = new Point(0, 0);
	
	    let hs1 = ((this.position === 1) ? 0 : 2);
	    let hs2 = ((this.position === 1) ? this.openhs : 2);
	
	    renderContext.drawLeads(this);
	
	    this.ps = Util.interpolate(this.lead1, this.lead2, -0.05, hs1);
	    this.ps2 = Util.interpolate(this.lead1, this.lead2, 1.05, hs2);
	
	    this.updateDots();
	    if (this.position === 0) {
	      renderContext.drawDots(this.point1, this.point2, this);
	    }
	
	    // Draw switch "Lever"
	    renderContext.drawLinePt(this.ps, this.ps2, Settings.SWITCH_COLOR, Settings.LINE_WIDTH + 1);
	
	    renderContext.fillCircle(this.lead1.x, this.lead1.y, Settings.POST_RADIUS, 1, Settings.FILL_COLOR, Settings.STROKE_COLOR);
	    renderContext.fillCircle(this.lead2.x, this.lead2.y, Settings.POST_RADIUS, 1, Settings.FILL_COLOR, Settings.STROKE_COLOR);
	
	    renderContext.drawPosts(this);
	
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      super.debugDraw(renderContext);
	    }
	  }
	
	  getName() {
	    return "Basic Switch";
	  }
	
	  calculateCurrent() {
	    if (this.position === 1) { return this.current = 0; }
	  }
	
	  getVoltageSourceCount() {
	    if (this.position === 1) { return 0; } else { return 1; }
	  }
	
	  mouseUp() {
	    if (this.momentary) { return this.toggle(); }
	  }
	
	  toggle() {
	    console.log(`Toggling...${this}`);
	
	    this.params['position']++;
	    this.position++;
	    if (this.position >= this.posCount) {
	      this.params['position'] = 0;
	      this.position = 0;
	    }
	    
	    this.Circuit.Solver.analyzeFlag = true;
	  }
	
	  getInfo(arr) {
	    arr[0] = ((this.momentary) ? "push switch (SPST)" : "switch (SPST)");
	    if (this.position === 1) {
	      arr[1] = "open";
	      return arr[2] = `Vd = ${Util.getUnitText(this.getVoltageDiff(), "V")}`;
	    } else {
	      arr[1] = "closed";
	      arr[2] = `V = ${Util.getUnitText(this.volts[0], "V")}`;
	      return arr[3] = `I = ${Util.getUnitText(this.getCurrent(), "A")}`;
	    }
	  }
	
	  getConnection(n1, n2) {
	    return this.position === 0;
	  }
	
	  onClick() {
	    return toggle();
	  }
	
	  isWire() {
	    return true;
	  }
	}
	
	module.exports = SwitchElm;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Settings = __webpack_require__(2);
	let Polygon = __webpack_require__(7);
	let Rectangle = __webpack_require__(3);
	let Point = __webpack_require__(4);
	let Util = __webpack_require__(5);
	
	class CapacitorElm extends CircuitComponent {
	  static initClass() {
	    this.FLAG_BACK_EULER = 2;
	  }
	
	  static get Fields() {
	    return {
	      "capacitance": {
	        name: "Capacitance",
	        unit: "Farads",
	        default_value: 5e-6,
	        symbol: "F",
	        data_type: parseFloat,
	        range: [0, Infinity]
	      },
	      "voltdiff": {
	        name: "Volts",
	        unit: "Volts",
	        default_value: 10,
	        symbol: "V",
	        data_type: parseFloat,
	        range: [-Infinity, Infinity]
	      }
	    };
	  }
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	
	    this.compResistance = 11;
	    this.plate1 = [];
	    this.plate2 = [];
	    this.curSourceValue = 0;
	
	    // console.log("ca", xa);
	    this.place()
	  }
	
	  isTrapezoidal() {
	    return true;
	  }
	//    (@flags & CapacitorElm.FLAG_BACK_EULER) is 0
	
	  nonLinear() {
	    return false;
	  }
	
	  setNodeVoltage(n, c) {
	    super.setNodeVoltage(n, c);
	    return this.voltdiff = this.volts[0] - this.volts[1];
	  }
	
	  reset() {
	    this.current = this.curcount = 0;
	
	    // put small charge on caps when reset to start oscillators
	    return this.voltdiff = 1e-3;
	  }
	
	  place() {
	    // console.log("capelm", arguments);
	//    super(arguments...)
	    //super.setPoints(...arguments);
	
	    let f = ((this.dn() / 2) - 4) / this.dn();
	
	    this.lead1 = Util.interpolate(this.point1, this.point2, f);
	    this.lead2 = Util.interpolate(this.point1, this.point2, 1 - f);
	
	    this.plate1 = [new Point(0, 0), new Point(0, 0)];
	    this.plate2 = [new Point(0, 0), new Point(0, 0)];
	
	    [this.plate1[0], this.plate1[1]] = Util.interpolateSymmetrical(this.point1, this.point2, f, 12);
	    [this.plate2[0], this.plate2[1]] = Util.interpolateSymmetrical(this.point1, this.point2, 1 - f, 12);
	  }
	
	  draw(renderContext) {
	    let hs = 12;
	//    @setBboxPt @point1, @point2, hs
	
	    // draw leads
	    renderContext.drawLinePt(this.point1, this.lead1, renderContext.getVoltageColor(this.volts[0]));
	    renderContext.drawLinePt(this.point2, this.lead2, renderContext.getVoltageColor(this.volts[1]));
	
	    this.updateDots();
	    renderContext.drawDots(this.point1, this.lead1, this);
	    renderContext.drawDots(this.lead2, this.point2, this);
	
	    // draw plates
	    renderContext.drawLinePt(this.plate1[0], this.plate1[1], renderContext.getVoltageColor(this.volts[0]), Settings.LINE_WIDTH+1);
	    renderContext.drawLinePt(this.plate2[0], this.plate2[1], renderContext.getVoltageColor(this.volts[1]), Settings.LINE_WIDTH+1);
	
	    renderContext.drawValue(17, 0, this, Util.getUnitText(this.capacitance, this.unitSymbol(), Settings.COMPONENT_DECIMAL_PLACES));
	
	    renderContext.drawPosts(this);
	
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      super.debugDraw(renderContext);
	    }
	  }
	
	  unitSymbol() {
	    return "F";
	  }
	
	  drawUnits() {
	    let s;
	    return s = Util.getUnitText(this.capacitance, "F");
	  }
	//    @drawValues s, hs
	
	  doStep(stamper) {
	    return stamper.stampCurrentSource(this.nodes[0], this.nodes[1], this.curSourceValue);
	  }
	
	  stamp(stamper) {
	    // capacitor companion model using trapezoidal approximation (Norton equivalent) consists of a current source in
	    // parallel with a resistor.  Trapezoidal is more accurate than Backward Euler but can cause oscillatory behavior
	    // if RC is small relative to the timestep.
	
	    if (this.isTrapezoidal()) {
	      this.compResistance = this.timeStep() / (2 * this.capacitance);
	    } else {
	      this.compResistance = this.timeStep() / this.capacitance;
	    }
	
	    stamper.stampResistor(this.nodes[0], this.nodes[1], this.compResistance);
	    stamper.stampRightSide(this.nodes[0]);
	    return stamper.stampRightSide(this.nodes[1]);
	  }
	
	  startIteration() {
	    if (this.isTrapezoidal()) {
	      return this.curSourceValue = (-this.voltdiff / this.compResistance) - this.current;
	    } else {
	      return this.curSourceValue = -this.voltdiff / this.compResistance;
	    }
	  }
	
	  calculateCurrent() {
	    let vdiff = this.volts[0] - this.volts[1];
	
	    // we check compResistance because this might get called before stamp(), which sets compResistance, causing
	    // infinite current
	    if (this.compResistance > 0) {
	      return this.current = (vdiff / this.compResistance) + this.curSourceValue;
	    }
	  }
	
	  needsShortcut() {
	    return true;
	  }
	
	  getName() {
	    return "Capacitor";
	  }
	}
	CapacitorElm.initClass();
	
	module.exports = CapacitorElm;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Settings = __webpack_require__(2);
	let Polygon = __webpack_require__(7);
	let Rectangle = __webpack_require__(3);
	let Point = __webpack_require__(4);
	let Util = __webpack_require__(5);
	
	class InductorElm extends CircuitComponent {
	  static initClass() {
	    this.FLAG_BACK_EULER = 2;
	  }
	
	  static get Fields() {
	    return {
	      "inductance": {
	        name: "inductance",
	        unit: "Henries",
	        symbol: "H",
	        default_value: 1e-3,
	        data_type: parseFloat
	      },
	      "current": {
	        name: "current",
	        unit: "Amperes",
	        symbol: "A",
	        default_value: 0,
	        data_type: parseFloat
	      }
	    };
	  }
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	
	    this.nodes = new Array(2);
	    this.compResistance = 0;  //1e-3
	    this.curSourceValue = 0;
	
	    this.place()
	  }
	
	  reset() {
	    this.current = 0;
	    this.volts[0] = 0;
	    this.volts[1] = 0;
	    return this.curcount = 0;
	  }
	
	  place() {
	    //super.setPoints(...arguments);
	    this.calcLeads(40);
	  }
	
	  stamp(stamper) {
	    // Inductor companion model using trapezoidal or backward euler
	    // approximations (Norton equivalent) consists of a current
	    // source in parallel with a resistor.  Trapezoidal is more
	    // accurate than backward euler but can cause oscillatory behavior.
	    // The oscillation is a real problem in circuits with switches.
	    let ts = this.getParentCircuit().timeStep();
	
	    if (this.isTrapezoidal()) {
	      this.compResistance = (2 * this.inductance) / ts;
	    } else {
	      this.compResistance = this.inductance / ts;
	    }
	
	    stamper.stampResistor(this.nodes[0], this.nodes[1], this.compResistance);
	    stamper.stampRightSide(this.nodes[0]);
	    return stamper.stampRightSide(this.nodes[1]);
	  }
	
	
	  doStep(stamper) {
	    return stamper.stampCurrentSource(this.nodes[0], this.nodes[1], this.curSourceValue);
	  }
	
	  draw(renderContext) {
	    this.updateDots();
	
	    let v1 = this.volts[0];
	    let v2 = this.volts[1];
	    let hs = 8;
	
	//    @setBboxPt @point1, @point2, hs
	    renderContext.drawLeads(this);
	
	    renderContext.drawValue(-14, 0, this, Util.getUnitText(this.inductance, "H", Settings.COMPONENT_DECIMAL_PLACES));
	
	//    renderContext.drawDots(@point1, @point2, this)
	    this.updateDots();
	    renderContext.drawDots(this.point1, this.lead1, this);
	    renderContext.drawDots(this.lead2, this.point2, this);
	
	    renderContext.drawCoil(this.lead1, this.lead2, v1, v2);
	
	    renderContext.drawPosts(this);
	
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      return super.debugDraw(renderContext);
	    }
	  }
	
	  startIteration() {
	    if (this.isTrapezoidal()) {
	      return this.curSourceValue = (this.getVoltageDiff() / this.compResistance) + this.current;
	    // backward euler
	    } else {
	      return this.curSourceValue = this.current;
	    }
	  }
	
	  nonLinear() {
	    return false;
	  }
	
	  isTrapezoidal() {
	    return true;
	  }
	
	  calculateCurrent() {
	    if (this.compResistance > 0) {
	      this.current = (this.getVoltageDiff() / this.compResistance) + this.curSourceValue;
	    }
	
	    return this.current;
	  }
	
	  getVoltageDiff() {
	    return this.volts[0] - this.volts[1];
	  }
	
	  getName() {
	    return "Inductor";
	  }
	}
	InductorElm.initClass();
	
	
	module.exports = InductorElm;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Settings = __webpack_require__(2);
	let Polygon = __webpack_require__(7);
	let Rectangle = __webpack_require__(3);
	let Point = __webpack_require__(4);
	let Util = __webpack_require__(5);
	
	class SparkGapElm extends CircuitComponent {
	  static get Fields() {
	    return {
	      "onresistance": {
	        name: "On Resistance",
	        unit: "Ohms",
	        default_value: 1e3,
	        symbol: "Ω",
	        data_type: parseFloat,
	        range: [0, Infinity],
	        type: "physical"
	      },
	      "offresistance": {
	        name: "Off Resistance",
	        unit: "Ohms",
	        default_value: 1e9,
	        symbol: "Ω",
	        data_type: parseFloat,
	        range: [0, Infinity],
	        type: "physical"
	      },
	      "breakdown": {
	        name: "Breakdown Voltage",
	        unit: "Voltage",
	        symbol: "V",
	        default_value: 1e3,
	        data_type: parseFloat,
	        range: [-Infinity, Infinity],
	        type: "physical"
	      },
	      "holdcurrent": {
	        unit: "Amperes",
	        name: "Hold Current",
	        symbol: "A",
	        default_value: 0.001,
	        data_type: parseFloat,
	        range: [-Infinity, Infinity],
	        type: "physical"
	      },
	    };
	  }
	
	  getName() {
	    return "Spark Gap"
	  }
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	
	    /*
	    this.resistance = 0;
	    this.offresistance = 1e9;
	    this.onresistance = 1e3;
	    this.breakdown = 1e3;
	    this.holdcurrent = 0.001;
	    */
	    this.state = false;
	
	    this.place()
	  }
	
	  place() {
	    //super.setPoints(...arguments);
	
	    let dist = 16;
	    let alen = 8;
	
	    this.calcLeads(dist + alen);
	
	    let p1 = Util.interpolate(this.point1, this.point2, (this.dn() - alen) / (2 * this.dn()));
	    this.arrow1 = Util.calcArrow(this.point1, p1, alen, alen);
	
	    p1 = Util.interpolate(this.point1, this.point2, (this.dn() + alen) / (2 * this.dn()));
	    this.arrow2 = Util.calcArrow(this.point2, p1, alen, alen);
	
	    this.setBboxPt(this.point1, this.point2, 8);
	  }
	
	  nonLinear() {
	    return true;
	  }
	
	  draw(renderContext) {
	    this.updateDots();
	
	    let dist = 16;
	    let alen = 8;
	    this.calcLeads(dist + alen);
	
	    let v1 = this.volts[0];
	    let v2 = this.volts[1];
	
	    renderContext.drawLeads(this);
	
	    let color = renderContext.getVoltageColor(this.volts[0]);
	    renderContext.drawThickPolygonP(this.arrow1, color, color);
	
	    color = renderContext.getVoltageColor(this.volts[1]);
	    renderContext.drawThickPolygonP(this.arrow2, color, color);
	
	    if (this.state) { renderContext.drawDots(this.point1, this.point2, this); }
	
	    renderContext.drawPosts(this);
	
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      super.debugDraw(renderContext);
	    }
	  }
	
	  calculateCurrent() {
	    this.current = (this.volts[0] - this.volts[1]) / this.resistance;
	  }
	
	  reset() {
	    super.reset();
	    this.state = false;
	  }
	
	  startIteration() {
	    if (Math.abs(this.current) < this.holdcurrent)
	      this.state = false;
	
	    let vd = this.volts[0] - this.volts[1];
	
	    if (Math.abs(vd) > this.breakdown) {
	      this.state = true;
	    }
	  }
	
	  doStep(stamper) {
	    if (this.state) {
	//      console.log("SPARK!")
	      this.resistance = this.onresistance;
	    } else {
	      this.resistance = this.offresistance;
	    }
	
	    stamper.stampResistor(this.nodes[0], this.nodes[1], this.resistance);
	  }
	
	  stamp(stamper) {
	    stamper.stampNonLinear(this.nodes[0]);
	    stamper.stampNonLinear(this.nodes[1]);
	  }
	
	  needsShortcut() {
	    return false;
	  }
	}
	SparkGapElm.initClass();
	
	module.exports = SparkGapElm;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Settings = __webpack_require__(2);
	let Polygon = __webpack_require__(7);
	let Rectangle = __webpack_require__(3);
	let Point = __webpack_require__(4);
	let Util = __webpack_require__(5);
	
	class CurrentElm extends CircuitComponent {
	  static get Fields() {
	    return {
	      "currentValue": {
	        unit: "Amperes",
	        name: "Current",
	        symbol: "A",
	        default_value: 0.01,
	        data_type: parseFloat,
	        range: [-Infinity, Infinity],
	        type: "physical"
	      }
	    };
	  }
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	  }
	
	  draw(renderContext) {
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      super.debugDraw(renderContext);
	    }
	
	    this.calcLeads(26);
	
	    this.ashaft1 = Util.interpolate(this.lead1, this.lead2, .25);
	    this.ashaft2 = Util.interpolate(this.lead1, this.lead2, .6);
	    this.center = Util.interpolate(this.lead1, this.lead2, .5);
	
	    let p2 = Util.interpolate(this.lead1, this.lead2, .75);
	
	    this.arrow = Util.calcArrow(this.center, p2, 4, 4);
	
	    this.updateDots();
	    renderContext.drawLeads(this);
	    renderContext.drawDots(this.point1, this.lead1, this);
	    renderContext.drawDots(this.lead2, this.point2, this);
	
	    let cr = 12;
	    let color = renderContext.getVoltageColor((this.volts[0] + this.volts[1]) / 2);
	//      @setPowerColor false
	    renderContext.drawCircle(this.center.x, this.center.y, cr);
	    renderContext.fillCircle(this.center.x, this.center.y, cr, Settings.LINE_WIDTH, Settings.FG_COLOR);
	    renderContext.drawLinePt(this.ashaft1, this.ashaft2);
	    renderContext.drawThickPolygonP(this.arrow, Settings.STROKE_COLOR, Settings.STROKE_COLOR);
	
	//      if Circuit.showValuesCheckItem
	//        s = DrawHelper.getShortUnitText(@currentValue, "A")
	//        @drawValues s, cr  if @dx() is 0 or @dy() is 0
	
	    renderContext.drawValue(20, 0, this, this.params.currentValue + "A");
	
	    return renderContext.drawPosts(this);
	  }
	
	  getName() {
	    return "Current Source"
	  }
	
	  stamp(stamper) {
	    this.current = this.currentValue;
	    return stamper.stampCurrentSource(this.nodes[0], this.nodes[1], this.current);
	  }
	
	  getVoltageDiff() {
	    return this.volts[1] - this.volts[0];
	  }
	}
	
	module.exports = CurrentElm;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Settings = __webpack_require__(2);
	let Polygon = __webpack_require__(7);
	let Rectangle = __webpack_require__(3);
	let Point = __webpack_require__(4);
	let Util = __webpack_require__(5);
	
	let { sprintf } = __webpack_require__(9);
	
	
	class MosfetElm extends CircuitComponent {
	  static get PNP() {
	    return 1
	  }
	
	  static get NPN() {
	    return  -1
	  }
	
	  // TODO: Replace PNP, NPN with P-Type/N-Type
	  static get Fields() {
	    return {
	      "vt": {
	        data_type: parseFloat,
	        name: "Threshold Voltage",
	        description: "Threshold voltage",
	        units: "Volts",
	        symbol: "V",
	        default_value: 1.5,
	        range: [-Infinity, Infinity],
	        type: sprintf
	      },
	      "pnp": {
	        name: "Polarity",
	        description: "Current multiplier",
	        default_value: 1,
	        data_type: Math.sign,
	        field_type: "select",
	        select_values: { "N-Channel": -1, "P-Channel": 1 }
	      }
	    };
	  }
	
	  static initClass() {
	    this.FLAG_PNP = 1;
	    this.FLAG_SHOWVT = 2;
	    this.FLAG_DIGITAL = 4;
	  }
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	
	    this.lastv1 = 0;
	    this.lastv2 = 0;
	    this.ids = 0;
	    this.mode = 0;
	    this.gm = 0;
	
	    this.vt = 1.5;
	    this.pcircler = 3;
	    this.src = []; // Array of points
	    this.drn = []; // Array of points
	    this.gate = [];
	    this.pcircle = [];
	
	    this.noDiagonal = true;
	    this.vt = this.getDefaultThreshold();
	
	    this.pnp = (parseInt(this.flags) & MosfetElm.FLAG_PNP) !== 0 ? -1 : 1;
	
	    this.params['pnp'] = this.pnp;
	
	    //this.setBboxPt(this.point1, this.point2, this.hs);
	
	    this.place()
	  }
	
	  getDefaultThreshold() {
	    return 1.5;
	  }
	
	  getBeta() {
	    return .02;
	  }
	
	  nonLinear() {
	    return true;
	  }
	
	  getName() {
	    return "Mosfet";
	  }
	
	//  drawDigital: ->
	//    (@flags & MosfetElm.FLAG_DIGITAL) isnt 0
	
	  reset() {
	    return this.lastv1 = this.lastv2 = this.volts[0] = this.volts[1] = this.volts[2] = this.curcount = 0;
	  }
	
	  draw(renderContext) {
	    //this.setBboxPt(this.point1, this.point2, this.hs);
	
	    let color = renderContext.getVoltageColor(this.volts[1]);
	    renderContext.drawLinePt(this.src[0], this.src[1], color);
	
	    color = renderContext.getVoltageColor(this.volts[2]);
	    renderContext.drawLinePt(this.drn[0], this.drn[1], color);
	
	    let segments = 6;
	//      @setPowerColor true
	    let segf = 1.0 / segments;
	    for (let i = 0, end = segments, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
	      let v = this.volts[1] + (((this.volts[2] - this.volts[1]) * i) / segments);
	      color = renderContext.getVoltageColor(v);
	      let ps1 = Util.interpolate(this.src[1], this.drn[1], i * segf);
	      let ps2 = Util.interpolate(this.src[1], this.drn[1], (i + 1) * segf);
	      renderContext.drawLinePt(ps1, ps2, color);
	    }
	
	    color = renderContext.getVoltageColor(this.volts[1]);
	    renderContext.drawLinePt(this.src[1], this.src[2], color);
	
	    color = renderContext.getVoltageColor(this.volts[2]);
	    renderContext.drawLinePt(this.drn[1], this.drn[2], color);
	
	    if (!this.drawDigital()) {
	      color = renderContext.getVoltageColor((this.pnp === 1 ? this.volts[1] : this.volts[2]));
	      renderContext.drawThickPolygonP(this.arrowPoly, color);
	    }
	
	    renderContext.drawThickPolygonP(this.arrowPoly);
	//      Circuit.powerCheckItem
	
	    //g.setColor(Color.gray);
	    color = renderContext.getVoltageColor(this.volts[0]);
	    renderContext.drawLinePt(this.point1, this.gate[1], color);
	    renderContext.drawLinePt(this.gate[0], this.gate[2], color);
	    this.drawDigital() && (this.pnp === -1);
	
	    //Main.getMainCanvas().drawThickCircle(pcircle.x, pcircle.y, pcircler, Settings.FG_COLOR);
	    //drawThickCircle(g, pcircle.x, pcircle.y, pcircler);
	//    unless (@flags & MosfetElm.FLAG_SHOWVT) is 0
	//      s = "" + (@vt * @pnp)
	
	      //g.setColor(whiteColor);
	      //g.setFont(unitsFont);
	//        @drawCenteredText s, @x2 + 2, @y2, false
	
	    //g.setColor(Color.white);
	    //g.setFont(unitsFont);
	//      ds = MathUtils.sign(@dx())  if (@needsHighlight() or Circuit.dragElm is this) and @dy() is 0
	
	    //        Main.getMainCanvas().drawString("G", gate[1].x - 10 * ds, gate[1].y - 5);
	    //        Main.getMainCanvas().drawString(pnp == -1 ? "D" : "S", src[0].x - 3 + 9 * ds, src[0].y + 4);
	    //        Main.getMainCanvas().drawString(pnp == -1 ? "S" : "D", drn[0].x - 3 + 9 * ds, drn[0].y + 4);
	    //
	    //        g.drawString("G", gate[1].x - 10 * ds, gate[1].y - 5);
	    //        g.drawString(pnp == -1 ? "D" : "S", src[0].x - 3 + 9 * ds, src[0].y + 4); // x+6 if ds=1, -12 if -1
	    //        g.drawString(pnp == -1 ? "S" : "D", drn[0].x - 3 + 9 * ds, drn[0].y + 4);
	//      @curcount = @updateDotCount(-@ids, @curcount)
	    renderContext.drawDots(this.src[0], this.src[1], this);
	    renderContext.drawDots(this.src[1], this.drn[1], this);
	    renderContext.drawDots(this.drn[1], this.drn[0], this);
	    renderContext.drawPosts(this);
	
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      return super.debugDraw(renderContext);
	    }
	  }
	
	  getPost(n) {
	    if (n === 0)
	      return this.point1
	    else if (n === 1)
	      return this.src[0]
	    else
	      return this.drn[0]
	  }
	
	  getCurrent() {
	    return this.ids;
	  }
	
	  getPower() {
	    return this.ids * (this.volts[2] - this.volts[1]);
	  }
	
	  getPostCount() {
	    return 3;
	  }
	
	  drawDigital() {
	    return true;
	  }
	
	  place() {
	    //super.setPoints(...arguments);
	    this.hs = 16;
	
	    // find the coordinates of the various points we need to draw the MOSFET.
	    let hs2 = this.hs * this.dsign();
	    this.src = Util.newPointArray(3);
	    this.drn = Util.newPointArray(3);
	
	    [this.src[0], this.drn[0]] = Util.interpolateSymmetrical(this.point1, this.point2, 1, -hs2);
	    [this.src[1], this.drn[1]] = Util.interpolateSymmetrical(this.point1, this.point2, 1 - (22 / this.dn()), -hs2);
	    [this.src[2], this.drn[2]] = Util.interpolateSymmetrical(this.point1, this.point2, 1 - (22 / this.dn()), (-hs2 * 4) / 3);
	
	    this.gate = Util.newPointArray(3);
	
	    [this.gate[0], this.gate[2]] = Util.interpolateSymmetrical(this.point1, this.point2, 1 - (28 / this.dn()), 3*hs2 / 4);  //,  # was 1-20/dn
	    this.gate[1] = Util.interpolate(this.gate[0], this.gate[2], .5);
	
	    if (this.pnp) {
	      this.arrowPoly = Util.calcArrow(this.src[1], this.src[0], 10, 4);
	    } else {
	      this.arrowPoly = Util.calcArrow(this.drn[0], this.drn[1], 12, 5);
	    }
	
	    this.setBboxPt(this.point1, this.point2, 2*this.hs);
	  }
	
	//    if @pnp is -1
	//      @gate[1] = Util.interpolate @point1, @point2, 1 - 36 / @dn()
	//      dist = (if (@dsign() < 0) then 32 else 31)
	//
	//      @pcircle = Util.interpolate(@point1, @point2, 1 - dist / @dn())
	//      @pcircler = 3
	
	  stamp(stamper) {
	    stamper.stampNonLinear(this.nodes[1]);
	    return stamper.stampNonLinear(this.nodes[2]);
	  }
	
	  doStep(stamper) {
	    let vs = new Array(3);
	
	    vs[0] = this.volts[0];
	    vs[1] = this.volts[1];
	    vs[2] = this.volts[2];
	
	    if (vs[1] > (this.lastv1 + .5)) { vs[1] = this.lastv1 + .5; }
	    if (vs[1] < (this.lastv1 - .5)) { vs[1] = this.lastv1 - .5; }
	    if (vs[2] > (this.lastv2 + .5)) { vs[2] = this.lastv2 + .5; }
	    if (vs[2] < (this.lastv2 - .5)) { vs[2] = this.lastv2 - .5; }
	
	    let source_node = 1;
	    let drain_node = 2;
	
	    if ((this.pnp * vs[1]) > (this.pnp * vs[2])) {
	      source_node = 2;
	      drain_node = 1;
	    }
	
	    let gate = 0;
	
	    let vgs = vs[gate] - vs[source_node];
	    let vds = vs[drain_node] - vs[source_node];
	
	    if ((Math.abs(this.lastv1 - vs[1]) > .01) || (Math.abs(this.lastv2 - vs[2]) > .01)) {
	      this.getParentCircuit().Solver.converged = false;
	    }
	
	    this.lastv1 = vs[1];
	    this.lastv2 = vs[2];
	
	    let realvgs = vgs;
	    let realvds = vds;
	
	    vgs *= this.pnp;
	    vds *= this.pnp;
	
	    this.ids = 0;
	    this.gm = 0;
	    let Gds = 0;
	    let beta = this.getBeta();
	
	//    if vgs > .5 and this instanceof JFetElm
	//      Circuit.halt "JFET is reverse biased!", this
	//      return
	
	    if (vgs < this.vt) {
	
	      // should be all zero, but that causes a singular matrix,
	      // so instead we treat it as a large resistor
	      Gds = 1e-8;
	      this.ids = vds * Gds;
	      this.mode = 0;
	    } else if (vds < (vgs - this.vt)) {
	
	      // linear
	      this.ids = beta * (((vgs - this.vt) * vds) - (vds * vds * .5));
	      this.gm = beta * vds;
	      Gds = beta * (vgs - vds - this.vt);
	      this.mode = 1;
	    } else {
	      // saturation; Gds = 0
	      this.gm = beta * (vgs - this.vt);
	
	      // use very small Gds to avoid nonconvergence
	      Gds = 1e-8;
	      this.ids = (.5 * beta * (vgs - this.vt) * (vgs - this.vt)) + ((vds - (vgs - this.vt)) * Gds);
	      this.mode = 2;
	    }
	
	    let rs = (-this.pnp * this.ids) + (Gds * realvds) + (this.gm * realvgs);
	
	    //console.log("M " + vds + " " + vgs + " " + ids + " " + gm + " "+ Gds + " " + volts[0] + " " + volts[1] + " " + volts[2] + " " + source + " " + rs + " " + this);
	    stamper.stampMatrix(this.nodes[drain_node], this.nodes[drain_node], Gds);
	    stamper.stampMatrix(this.nodes[drain_node], this.nodes[source_node], -Gds - this.gm);
	    stamper.stampMatrix(this.nodes[drain_node], this.nodes[gate], this.gm);
	    stamper.stampMatrix(this.nodes[source_node], this.nodes[drain_node], -Gds);
	    stamper.stampMatrix(this.nodes[source_node], this.nodes[source_node], Gds + this.gm);
	    stamper.stampMatrix(this.nodes[source_node], this.nodes[gate], -this.gm);
	    stamper.stampRightSide(this.nodes[drain_node], rs);
	    stamper.stampRightSide(this.nodes[source_node], -rs);
	
	    if (((source_node === 2) && (this.pnp === 1)) || ((source_node === 1) && (this.pnp === -1))) { return this.ids = -this.ids; }
	  }
	
	  canViewInScope() {
	    return true;
	  }
	
	  getVoltageDiff() {
	    return this.volts[2] - this.volts[1];
	  }
	
	  getConnection(n1, n2) {
	    return !((n1 === 0) || (n2 === 0));
	  }
	}
	MosfetElm.initClass();
	
	module.exports = MosfetElm;


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Settings = __webpack_require__(2);
	let Polygon = __webpack_require__(7);
	let Rectangle = __webpack_require__(3);
	let Point = __webpack_require__(4);
	let Util = __webpack_require__(5);
	
	let MosfetElm = __webpack_require__(31);
	
	class JfetElm extends MosfetElm {
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	    this.noDiagonal = true;
	
	    this.place()
	  }
	
	  getDefaultThreshold() {
	    return -4;
	  }
	
	  getBeta() {
	    return .00125;
	  }
	
	  getName() {
	    return "JFet"
	  }
	
	  place() {
	    super.place();
	
	    let hs2 = this.hs * this.dsign();
	
	    this.src = Util.newPointArray(3);
	    this.drn = Util.newPointArray(3);
	
	    [this.src[0], this.drn[0]] = Util.interpolateSymmetrical(this.point1, this.point2, 1, hs2);
	    [this.src[1], this.drn[1]] = Util.interpolateSymmetrical(this.point1, this.point2, 1, hs2 / 2);
	    [this.src[2], this.drn[2]] = Util.interpolateSymmetrical(this.point1, this.point2, 1 - (10 / this.dn()), hs2 / 2);
	
	    this.gatePt = Util.interpolate(this.point1, this.point2, 1 - (14/this.dn()));
	
	    let ra = Util.newPointArray(4);
	    [ra[0], ra[1]] = Util.interpolateSymmetrical(this.point1, this.point2, 1 - (13/this.dn()), this.hs);
	    [ra[2], ra[3]] = Util.interpolateSymmetrical(this.point1, this.point2, 1 - (10/this.dn()), this.hs);
	
	    this.gatePoly = Util.createPolygonFromArray([ra[0], ra[1], ra[3], ra[2]]);
	
	    if (this.pnp === -1) {
	      let x = Util.interpolate(this.gatePt, this.point1, 15/this.dn());
	      this.arrowPoly = Util.calcArrow(this.gatePt, x, 8, 3);
	    } else {
	      this.arrowPoly = Util.calcArrow(this.point1, this.gatePt, 8, 3);
	    }
	
	    this.setBboxPt(this.point1, this.point2, this.hs);
	  }
	
	  draw(renderContext) {
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      super.debugDraw(renderContext);
	    }
	
	    let color = renderContext.getVoltageColor(this.volts[1]);
	    renderContext.drawLinePt(this.src[0], this.src[1], color);
	    renderContext.drawLinePt(this.src[1], this.src[2], color);
	
	    color = renderContext.getVoltageColor(this.volts[2]);
	    renderContext.drawLinePt(this.drn[0], this.drn[1], color);
	    renderContext.drawLinePt(this.drn[1], this.drn[2], color);
	
	    color = renderContext.getVoltageColor(this.volts[0]);
	    renderContext.drawLinePt(this.point1, this.gatePt, color);
	
	    renderContext.drawThickPolygonP(this.arrowPoly);
	    renderContext.drawThickPolygonP(this.gatePoly);
	
	    if (this.curcount !== 0) {
	      renderContext.drawDots(this.src[0], this.src[1], this);
	      renderContext.drawDots(this.src[1], this.src[2], this);
	      renderContext.drawDots(this.drn[0], this.drn[1], this);
	      renderContext.drawDots(this.drn[1], this.drn[2], this);
	    }
	
	    return renderContext.drawPosts(this);
	  }
	}
	
	
	module.exports = JfetElm;
	


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Settings = __webpack_require__(2);
	let Polygon = __webpack_require__(7);
	let Rectangle = __webpack_require__(3);
	let Point = __webpack_require__(4);
	let Util = __webpack_require__(5);
	
	class TransistorElm extends CircuitComponent {
	  static get Fields() {
	    return {
	      "pnp": {
	        name: "Polarity",
	        description: "Current multiplier",
	        default_value: -1,
	        data_type: Math.sign,
	        field_type: "select",
	        select_values: {"NPN": -1, "PNP": 1}
	      },
	      "lastvbe": {
	        name: "Initial VBE",
	        unit: "Voltage",
	        symbol: "V",
	        default_value: 0,
	        data_type: parseFloat,
	        type: "physical"
	      },
	      "lastvbc": {
	        name: "Initial VBC",
	        unit: "Voltage",
	        symbol: "V",
	        default_value: 0,
	        data_type: parseFloat
	      },
	      "beta": {
	        name: "Beta",
	        description: "Current gain",
	        default_value: 100,
	        data_type: parseFloat,
	        range: [0, Infinity]
	      }
	    }
	  }
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	
	    this.rect = []; // Array of points
	    this.coll = []; // Array of points
	    this.emit = []; // Array of points
	    this.base = new Point(0, 0); // Single point
	    this.gmin = 0;
	    this.ie = 0;
	    this.ic = 0;
	    this.ib = 0;
	
	    // this.curcount_c = 0
	    // this.curcount_e = 0
	    // this.curcount_b = 0
	
	    this.rectPoly = 0;
	    this.arrowPoly = 0;
	    this.vt = .025;
	    this.vdcoef = 1 / this.vt;
	    this.rgain = .5;
	    // this.lastvbc = 0;
	    // this.lastvbe = 0;
	    this.leakage = 1e-13;
	
	    this.renderSize = 16;
	
	    this.volts[0] = 0;
	    this.volts[1] = -this.lastvbe;
	    this.volts[2] = -this.lastvbc;
	
	    this.setup();
	    this.place();
	  }
	
	  setup() {
	    this.vcrit = this.vt * Math.log(this.vt / (Math.sqrt(2) * this.leakage));
	    this.fgain = this.beta / (this.beta + 1);
	    return this.noDiagonal = true;
	  }
	
	  nonLinear() {
	    return true;
	  }
	
	  reset() {
	    this.volts[0] = this.volts[1] = this.volts[2] = 0;
	    return this.lastvbc = this.lastvbe = this.curcount_c = this.curcount_e = this.curcount_b = 0;
	  }
	
	  getName() {
	    let type = this.params.pnp == 1 ? "PNP" : "NPN";
	
	    return `Bipolar Junction Transistor`
	  }
	
	  draw(renderContext) {
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      super.debugDraw(renderContext);
	    }
	
	    //@dsign() = -@dsign()  unless (@flags & TransistorElm.FLAG_FLIP) is 0
	
	    let hs2 = this.renderSize * this.dsign() * this.pnp;
	
	    // calc collector, emitter posts
	    this.coll = Util.newPointArray(2);
	    this.emit = Util.newPointArray(2);
	
	    [this.coll[0], this.emit[0]] = Util.interpolateSymmetrical(this.point1, this.point2, 1, hs2);
	
	    // calc rectangle edges
	    this.rect = Util.newPointArray(4);
	    [this.rect[0], this.rect[1]] = Util.interpolateSymmetrical(this.point1, this.point2, 1 - (16 / this.dn()), this.renderSize);
	    [this.rect[2], this.rect[3]] = Util.interpolateSymmetrical(this.point1, this.point2, 1 - (13 / this.dn()), this.renderSize);
	
	    // calc points where collector/emitter leads contact rectangle
	    [this.coll[1], this.emit[1]] = Util.interpolateSymmetrical(this.point1, this.point2, 1 - (13 / this.dn()), 6 * this.dsign() * this.pnp);
	
	    // calc point where base lead contacts rectangle
	    this.base = Util.interpolate(this.point1, this.point2, 1 - (this.renderSize / this.dn()));
	
	    // rectangle
	    this.rectPoly = Util.createPolygon(this.rect[0], this.rect[2], this.rect[3], this.rect[1]);
	
	    // arrow
	    /*
	    if (this.pnp !== 1) {
	      let pt = Util.interpolateSymmetrical(this.point1, this.point2, 1 - (11 / this.dn()), -5 * this.dsign() * this.pnp);
	      this.arrowPoly = Util.calcArrow(this.emit[0], pt, 8, 4);
	
	      console.log("ARROW POLY", this.arrowPoly, this.point1, this.point2, this.dn(), this.dsign(), this.pnp, this.emit[0], pt, "\n")
	    }
	    */
	
	    // draw collector
	    let color = renderContext.getVoltageColor(this.volts[1]);
	    renderContext.drawLinePt(this.coll[0], this.coll[1], color);
	
	    // draw emitter
	    color = renderContext.getVoltageColor(this.volts[2]);
	    renderContext.drawLinePt(this.emit[0], this.emit[1], color);
	
	    // draw arrow
	    //g.setColor(lightGrayColor);
	
	    // TODO: add arrow poly
	    if(this.arrowPoly && this.arrowPoly.numPoints() > 0) {
	      try {
	        renderContext.drawThickPolygonP(this.arrowPoly, Settings.STROKE_COLOR);
	      } catch(e) {
	        console.log(this.pnp);
	        console.log(this.arrowPoly);
	      }
	    }
	
	    // draw base
	    color = renderContext.getVoltageColor(this.volts[0]);
	//      g.setColor Color.gray  if Circuit.powerCheckItem
	    renderContext.drawLinePt(this.point1, this.base, color);
	
	    // draw dots
	//      @curcount_b = @updateDotCount(-@ib, @curcount_b)
	//      @drawDots @base, @point1, @curcount_b
	//      @curcount_c = @updateDotCount(-@ic, @curcount_c)
	//      @drawDots @coll[1], @coll[0], @curcount_c
	//      @curcount_e = @updateDotCount(-@ie, @curcount_e)
	//      @drawDots @emit[1], @emit[0], @curcount_e
	
	    // draw dots
	    renderContext.drawDots(this.base, this.point1, this);
	    renderContext.drawDots(this.coll[1], this.coll[0], this);
	    renderContext.drawDots(this.emit[1], this.emit[0], this);
	
	    color = renderContext.getVoltageColor(this.volts[0]);
	//      @setPowerColor true
	
	    //g.fillPolygon(rectPoly);
	    renderContext.drawThickPolygonP(this.rectPoly, color);
	
	//      if (@needsHighlight() or Circuit.dragElm is this) and @dy() is 0
	//        g.setColor(Color.white);
	//        g.setFont(this.unitsFont);
	//        CircuitComponent.setColor Color.white
	//
	//        ds = MathUtils.sign(@dx())
	//        @drawCenteredText "B", @base.x1 - 10 * ds, @base.y - 5, Color.WHITE
	//        @drawCenteredText "C", @coll[0].x1 - 3 + 9 * ds, @coll[0].y + 4, Color.WHITE # x+6 if ds=1, -12 if -1
	//        @drawCenteredText "E", @emit[0].x1 - 3 + 9 * ds, @emit[0].y + 4, Color.WHITE
	
	    if (this.emit[0] && this.emit[1]) {
	      renderContext.fillCircle(this.emit[0].x, this.emit[0].y, 0, 0, "#F00", "#F00");
	      renderContext.fillCircle(this.emit[1].x, this.emit[1].y, 0, 0, "#0F0", "#0F0");
	    }
	
	    if (this.emit[2]) {
	      renderContext.fillCircle(this.emit[2].x, this.emit[2].y, 0, 0, "#00F", "#00F");
	    }
	
	    renderContext.drawPosts(this);
	  }
	
	  getPost(n) {
	    if (n === 0) {
	      return this.point1;
	    } else if (n === 1) {
	      return this.coll[0];
	    } else {
	      return this.emit[0];
	    }
	  }
	
	  getPostCount() {
	    return 3;
	  }
	
	  getPower() {
	    return ((this.volts[0] - this.volts[2]) * this.ib) + ((this.volts[1] - this.volts[2]) * this.ic);
	  }
	
	  place() {
	    // super.setPoints(...arguments);
	
	    this.renderSize = 16;
	
	    let hs = this.renderSize;
	
	    //    if @flags & TransistorElm.FLAG_FLIP != 0
	    //      @dsign() = -@dsign()
	
	    let hs2 = hs * this.dsign() * this.pnp;
	
	    this.coll = Util.newPointArray(2);
	    this.emit = Util.newPointArray(2);
	
	    [this.coll[0], this.emit[0]] = Util.interpolateSymmetrical(this.point1, this.point2, 1, hs2);
	
	    this.rect = Util.newPointArray(4);
	
	    [this.rect[0], this.rect[1]] = Util.interpolateSymmetrical(this.point1, this.point2, 1 - (16 / this.dn()), hs);
	    [this.rect[2], this.rect[3]] = Util.interpolateSymmetrical(this.point1, this.point2, 1 - (13 / this.dn()), hs);
	    [this.coll[1], this.emit[1]] = Util.interpolateSymmetrical(this.point1, this.point2, 1 - (13 / this.dn()), 6 * this.dsign() * this.pnp);
	
	    this.base = Util.interpolateSymmetrical(this.point1, this.point2, 1 - (16 / this.dn()));
	
	    this.rectPoly = Util.createPolygonFromArray(this.rect);
	
	    this.setBboxPt(this.point1, this.point2, this.renderSize);
	
	    if (this.pnp === 1) {
	      // console.log("PNP", "hs2", hs2, "Emit", this.emit[0], this.dsign(), this.dn(), this.pnp, this.point1, this.point2, "arrowPoly", Util.calcArrow(this.emit[1], this.emit[0], 8, 4))
	
	      this.arrowPoly = Util.calcArrow(this.emit[1], this.emit[0], 8, 4);
	    } else {
	      let pt = Util.interpolate(this.point1, this.point2, 1 - (11 / this.dn()), -5 * this.dsign() * this.pnp);
	
	      this.arrowPoly = Util.calcArrow(this.emit[0], pt, 8, 4);
	
	      // console.log("NPN", "hs2", hs2, "Emit", this.emit[0], this.dsign(), this.dn(), this.pnp, this.point1, this.point2, "pt", pt, "arrowPoly", this.arrowPoly)
	    }
	  }
	
	  // TODO: DI refactor by passing solver object
	  limitStep(vnew, vold) {
	    let arg = 0;  // TODO
	
	    if ((vnew > this.vcrit) && (Math.abs(vnew - vold) > (this.vt + this.vt))) {
	      if (vold > 0) {
	        arg = 1 + ((vnew - vold) / this.vt);
	        if (arg > 0) {
	          vnew = vold + (this.vt * Math.log(arg));
	        } else {
	          vnew = this.vcrit;
	        }
	      } else {
	        vnew = this.vt * Math.log(vnew / this.vt);
	      }
	      this.getParentCircuit().Solver.converged = false;
	    }
	
	    return vnew;
	  }
	
	  stamp(stamper) {
	    stamper.stampNonLinear(this.nodes[0]);
	    stamper.stampNonLinear(this.nodes[1]);
	    stamper.stampNonLinear(this.nodes[2]);
	  }
	
	  // TODO: DI refactor by passing solver object
	  doStep(stamper) {
	    let {subIterations} = this.getParentCircuit().Solver;
	
	    let vbc = this.volts[0] - this.volts[1]; // typically negative
	    let vbe = this.volts[0] - this.volts[2]; // typically positive
	
	    let convergenceEpsilon = 0.01;
	    if ((Math.abs(vbc - this.lastvbc) > convergenceEpsilon) || (Math.abs(vbe - this.lastvbe) > convergenceEpsilon)) {
	      this.getParentCircuit().Solver.converged = false;
	    }
	
	    this.gmin = 0;
	    if (subIterations > 100) {
	      // TODO: Check validity here
	      // if we have trouble converging, put a conductance in parallel with all P-N junctions.
	      // Gradually increase the conductance value for each iteration.
	      this.gmin = Math.exp(-9 * Math.log(10) * (1 - (subIterations / 3000.0)));
	      if (this.gmin > .1) {
	        this.gmin = .1;
	      }
	    }
	
	    vbc = this.pnp * this.limitStep(this.pnp * vbc, this.pnp * this.lastvbc);
	    vbe = this.pnp * this.limitStep(this.pnp * vbe, this.pnp * this.lastvbe);
	    this.lastvbc = vbc;
	    this.lastvbe = vbe;
	    let pcoef = this.vdcoef * this.pnp;
	    let expbc = Math.exp(vbc * pcoef);
	
	    //if (expbc > 1e13 || Double.isInfinite(expbc))
	    //     expbc = 1e13;
	    let expbe = Math.exp(vbe * pcoef);
	    if (expbe < 1) {
	      expbe = 1;
	    }
	
	    //if (expbe > 1e13 || Double.isInfinite(expbe))
	    //     expbe = 1e13;
	    this.ie = this.pnp * this.leakage * (-(expbe - 1) + (this.rgain * (expbc - 1)));
	    this.ic = this.pnp * this.leakage * ((this.fgain * (expbe - 1)) - (expbc - 1));
	    this.ib = -(this.ie + this.ic);
	
	    let gee = -this.leakage * this.vdcoef * expbe;
	    let gec = this.rgain * this.leakage * this.vdcoef * expbc;
	    let gce = -gee * this.fgain;
	    let gcc = -gec * (1 / this.rgain);
	
	    // stamps from page 302 of Pillage.  Node 0 is the base, node 1 the collector, node 2 the emitter.  Also stamp
	    // minimum conductance (gmin) between b,e and b,c
	
	    // Stamp BASE junction:
	    stamper.stampMatrix(this.nodes[0], this.nodes[0], (-gee - gec - gce - gcc) + (this.gmin * 2));
	    stamper.stampMatrix(this.nodes[0], this.nodes[1], (gec + gcc) - this.gmin);
	    stamper.stampMatrix(this.nodes[0], this.nodes[2], (gee + gce) - this.gmin);
	
	    // Stamp COLLECTOR junction:
	    stamper.stampMatrix(this.nodes[1], this.nodes[0], (gce + gcc) - this.gmin);
	    stamper.stampMatrix(this.nodes[1], this.nodes[1], -gcc + this.gmin);
	    stamper.stampMatrix(this.nodes[1], this.nodes[2], -gce);
	
	    // Stamp EMITTER junction:
	    stamper.stampMatrix(this.nodes[2], this.nodes[0], (gee + gec) - this.gmin);
	    stamper.stampMatrix(this.nodes[2], this.nodes[1], -gec);
	    stamper.stampMatrix(this.nodes[2], this.nodes[2], -gee + this.gmin);
	
	    // we are solving for v(k+1), not delta v, so we use formula
	    // 10.5.13, multiplying J by v(k)
	    stamper.stampRightSide(this.nodes[0], -this.ib - ((gec + gcc) * vbc) - ((gee + gce) * vbe));
	    stamper.stampRightSide(this.nodes[1], -this.ic + (gce * vbe) + (gcc * vbc));
	    return stamper.stampRightSide(this.nodes[2], -this.ie + (gee * vbe) + (gec * vbc));
	  }
	
	  getSummary() {
	    let arr = [];
	
	    arr[0] = `(${(this.pnp === -1) ? "PNP)" : "NPN)"}`;
	
	    let vbc = this.volts[0] - this.volts[1];
	    let vbe = this.volts[0] - this.volts[2];
	    let vce = this.volts[1] - this.volts[2];
	
	    if ((vbc * this.pnp) > .2) {
	      arr[1] = ((vbe * this.pnp) > .2 ? "Saturation" : "Reverse active");
	    } else {
	      arr[1] = ((vbe * this.pnp) > .2 ? "Fwd active" : "Cutoff");
	    }
	
	    arr[2] = `Ic = ${Util.getUnitText(this.ic, "A")}`;
	    arr[3] = `Ib = ${Util.getUnitText(this.ib, "A")}`;
	    arr[4] = `Vbe = ${Util.getUnitText(vbe, "V")}`;
	    arr[5] = `Vbc = ${Util.getUnitText(vbc, "V")}`;
	    arr[6] = `Vce = ${Util.getUnitText(vce, "V")}`;
	
	    return super.getSummary(arr);
	  }
	
	  getScopeValue(x) {
	    switch (x) {
	      case Oscilloscope.VAL_IB:
	        return this.ib;
	        break;
	      case Oscilloscope.VAL_IC:
	        return this.ic;
	        break;
	      case Oscilloscope.VAL_IE:
	        return this.ie;
	        break;
	      case Oscilloscope.VAL_VBE:
	        return this.volts[0] - this.volts[2];
	        break;
	      case Oscilloscope.VAL_VBC:
	        return this.volts[0] - this.volts[1];
	        break;
	      case Oscilloscope.VAL_VCE:
	        return this.volts[1] - this.volts[2];
	        break;
	    }
	    return 0;
	  }
	
	  getScopeUnits(x) {
	    switch (x) {
	      case Oscilloscope.VAL_IB:
	      case Oscilloscope.VAL_IC:
	      case Oscilloscope.VAL_IE:
	        return "A";
	      default:
	        return "V";
	    }
	  }
	
	  canViewInScope() {
	    return true;
	  }
	}
	TransistorElm.initClass();
	
	module.exports = TransistorElm;


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Settings = __webpack_require__(2);
	let Polygon = __webpack_require__(7);
	let Rectangle = __webpack_require__(3);
	let Point = __webpack_require__(4);
	let RailElm = __webpack_require__(18);
	let VoltageElm = __webpack_require__(19);
	
	let { sprintf } = __webpack_require__(9);
	let Util = __webpack_require__(5);
	
	class VarRailElm extends RailElm {
	  static get Fields() {
	    return Util.extend(RailElm.Fields, {
	      "sliderText": {
	        name: "sliderText",
	        unit: "",
	        default_value: "Voltage",
	        symbol: "%",
	        data_type(x) { return x; }
	      }
	    });
	  }
	
	  getName() {
	    return "Variable Voltage Rail"
	  }
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	
	    this.waveform = VoltageElm.WF_VAR;
	
	    this.sliderValue = Math.floor(((this.frequency - this.bias) * 100) / (this.maxVoltage - this.bias));
	  }
	
	  createSlider() {}
	
	  getSliderValue() {
	    return this.sliderValue;
	  }
	
	    // Todo: implement
	  getVoltage() {
	    this.frequency = ((this.getSliderValue() * (this.maxVoltage - this.bias)) / 100.0) + this.bias;
	
	    return this.frequency;
	  }
	}
	
	module.exports = VarRailElm;


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Settings = __webpack_require__(2);
	let Polygon = __webpack_require__(7);
	let Rectangle = __webpack_require__(3);
	let Point = __webpack_require__(4);
	let Util = __webpack_require__(5);
	
	class OpAmpElm extends CircuitComponent {
	  static initClass() {
	    this.FLAG_SWAP = 1;
	    this.FLAG_SMALL = 2;
	    this.FLAG_LOWGAIN = 4;
	  }
	
	  static get Fields() {
	    return {
	      "maxOut": {
	        name: "Voltage",
	        unit: "Voltage",
	        description: "Maximum allowable output voltage of the Op Amp",
	        symbol: "V",
	        default_value: 15,
	        data_type: parseFloat,
	        range: [-Infinity, Infinity],
	        type: "physical"
	      },
	      "minOut": {
	        name: "Voltage",
	        unit: "Voltage",
	        description: "Minimum allowable output voltage of the Op Amp",
	        symbol: "V",
	        default_value: -15,
	        data_type: parseFloat,
	        range: [-Infinity, Infinity],
	        type: "physical"
	      },
	      "gbw": {
	        name: "Gain",
	        unit: "",
	        description: "Gutput gain",
	        symbol: "",
	        default_value: 1e6,
	        data_type: parseFloat,
	        range: [-Infinity, Infinity],
	        type: "physical"
	      }
	    };
	  }
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	
	    this.opsize = 0;
	    this.opwidth = 0;
	    this.opaddtext = 0;
	    this.maxOut = this.params.maxOut;
	    this.minOut = this.params.minOut;
	
	    // this.nOut = 0
	    // this.lastvd = 0
	    this.gain = 1e6;
	    this.reset = false;
	    this.in1p = [];
	    this.in2p = [];
	    this.textp = [];
	
	    // GBW has no effect in this version of the simulator, but we retain it to keep the file format the same
	    this.gbw = this.params.gbw;
	
	    this.noDiagonal = true;
	
	    this.setSize((f & OpAmpElm.FLAG_SMALL) !== 0 ? 1 : 2);
	    this.setGain();
	
	    this.place();
	    this.allocNodes();
	  }
	
	  setGain() {
	    // gain of 100000 breaks e-amp-dfdx
	    // gain was 1000, but it broke amp-schmitt
	    return this.gain = (((this.flags & OpAmpElm.FLAG_LOWGAIN) !== 0) ? 1000 : 100000);
	  }
	
	  nonLinear() {
	    return true;
	  }
	
	  draw(renderContext) {
	    // this.setBbox(this.point1.x, this.in1p[0].y, this.point2.x, this.in2p[0].y);
	    //this.setBboxPt(this.point1, this.point2, Math.floor(this.opheight * this.dsign()));
	
	    // Terminal 1
	    let color = renderContext.getVoltageColor(this.volts[0]);
	    renderContext.drawLinePt(this.in1p[0], this.in1p[1], color);
	//    renderContext.drawValue(@in1p[1].x, )
	
	    // Terminal 2
	    color = renderContext.getVoltageColor(this.volts[1]);
	    renderContext.drawLinePt(this.in2p[0], this.in2p[1], color);
	
	
	    // Terminal 3
	    color = renderContext.getVoltageColor(this.volts[2]);
	    renderContext.drawLinePt(this.lead2, this.point2, color);
	
	    // Body
	    renderContext.drawThickPolygonP(this.triangle, Settings.STROKE_COLOR, Settings.FG_COLOR);
	
	    renderContext.fillText("+", this.in1p[1].x + 5, this.in1p[1].y + 5, Settings.LABEL_COLOR);
	    renderContext.fillText("-", this.in2p[1].x + 5, this.in2p[1].y + 5, Settings.LABEL_COLOR);
	
	    if (this.getParentCircuit() && this.getParentCircuit()) {
	      this.updateDots();
	      renderContext.drawDots(this.in1p[0], this.in1p[1], renderContext);
	      renderContext.drawDots(this.point2, this.lead2, this);
	
	      renderContext.drawPosts(this);
	    }
	
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      return super.debugDraw(renderContext);
	    }
	  }
	
	  getPower() {
	    return this.volts[2] * this.current;
	  }
	
	  setSize(s) {
	    this.opsize = s;
	    this.opheight = 8 * s;
	    return this.opwidth = 13 * s;
	  }
	
	  place() {
	    let ww;
	    //super.setPoints(...arguments);
	//    @setSize 2
	
	    if (ww > (this.dn() / 2)) {
	      ww = Math.floor(this.dn() / 2);
	    } else {
	      ww = Math.floor(this.opwidth);
	    }
	
	    this.calcLeads(ww * 2);
	    let hs = Math.floor(this.opheight * this.dsign());
	
	    this.in1p = Util.newPointArray(2);
	    this.in2p = Util.newPointArray(2);
	    this.textp = Util.newPointArray(2);
	
	    [this.in1p[0], this.in2p[0]] = Util.interpolateSymmetrical(this.point1, this.point2, 0, hs);
	    [this.in1p[1], this.in2p[1]] = Util.interpolateSymmetrical(this.lead1, this.lead2, 0, hs);
	    [this.textp[0], this.textp[1]] = Util.interpolateSymmetrical(this.lead1, this.lead2, .2, hs);
	
	    let tris = Util.newPointArray(2);
	    [tris[0], tris[1]] = Util.interpolateSymmetrical(this.lead1, this.lead2, 0, hs * 2);
	    this.triangle = Util.createPolygonFromArray([tris[0], tris[1], this.lead2]);
	
	    this.setBboxPt(this.lead1, this.lead2, 2*hs)
	  }
	
	  getName() {
	    return "OpAmp"
	  }
	
	  getPostCount() {
	    return 3;
	  }
	
	  getPost(n) {
	    return ((n === 0) ? this.in1p[0] : ((n === 1) ? this.in2p[0] : this.point2));
	  }
	
	  getVoltageSourceCount() {
	    return 1;
	  }
	
	  getInfo(arr) {
	    super.getInfo();
	    arr[0] = "op-amp";
	    arr[1] = `V+ = ${Util.getUnitText(this.volts[1], "V")}`;
	    arr[2] = `V- = ${Util.getUnitText(this.volts[0], "V")}`;
	
	    // sometimes the voltage goes slightly outside range, to make convergence easier.  so we hide that here.
	    let vo = Math.max(Math.min(this.volts[2], this.maxOut), this.minOut);
	    arr[3] = `Vout = ${Util.getUnitText(vo, "V")}`;
	    arr[4] = `Iout = ${Util.getUnitText(this.getCurrent(), "A")}`;
	    return arr[5] = `range = ${Util.getUnitText(this.minOut, "V")} to ${Util.getUnitText(this.maxOut, "V")}`;
	  }
	
	  stamp(stamper) {
	//      console.log("\nStamping OpAmpElm")
	    let vn = this.Circuit.numNodes() + this.voltSource;
	    stamper.stampNonLinear(vn);
	    return stamper.stampMatrix(this.nodes[2], vn, 1);
	  }
	
	  doStep(stamper) {
	    let vd = this.volts[1] - this.volts[0];
	
	    // TODO: Simplify conditional
	    if (Math.abs(this.lastvd - vd) > .1) {
	      this.Circuit.Solver.converged = false;
	    } else if ((this.volts[2] > (this.maxOut + .1)) || (this.volts[2] < (this.minOut - .1))) {
	      this.Circuit.Solver.converged = false;
	    }
	
	    let x = 0;
	    let vn = this.Circuit.numNodes() + this.voltSource;
	    let dx = 0;
	
	    if ((vd >= (this.maxOut / this.gain)) && ((this.lastvd >= 0) || (Util.getRand(4) === 1))) {
	      dx = 1e-4;
	      x = this.maxOut - ((dx * this.maxOut) / this.gain);
	    } else if ((vd <= (this.minOut / this.gain)) && ((this.lastvd <= 0) || (Util.getRand(4) === 1))) {
	      dx = 1e-4;
	      x = this.minOut - ((dx * this.minOut) / this.gain);
	    } else {
	      dx = this.gain;
	    }
	
	    //console.log("opamp " + vd + " " + volts[2] + " " + dx + " "  + x + " " + lastvd + " " + sim.converged);
	    // Newton's method:
	    stamper.stampMatrix(vn, this.nodes[0], dx);
	    stamper.stampMatrix(vn, this.nodes[1], -dx);
	    stamper.stampMatrix(vn, this.nodes[2], 1);
	    stamper.stampRightSide(vn, x);
	    return this.lastvd = vd;
	  }
	
	
	  //if (sim.converged)
	  //     console.log((volts[1]-volts[0]) + " " + volts[2] + " " + initvd);
	
	  // there is no current path through the op-amp inputs, but there is an indirect path through the output to ground.
	  getConnection(n1, n2) {
	    return false;
	  }
	
	  hasGroundConnection(n1) {
	    return n1 === 2;
	  }
	
	  getVoltageDiff() {
	    return this.volts[2] - this.volts[1];
	  }
	}
	OpAmpElm.initClass();
	
	module.exports = OpAmpElm;


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Settings = __webpack_require__(2);
	let Polygon = __webpack_require__(7);
	let Rectangle = __webpack_require__(3);
	let Point = __webpack_require__(4);
	let DiodeElm = __webpack_require__(24);
	let Util = __webpack_require__(5);
	
	class ZenerElm extends DiodeElm {
	  static get Fields() {
	    return Util.extend(DiodeElm.Fields, {
	      zvoltage: {
	        name: "Voltage",
	        unit: "Voltage",
	        symbol: "V",
	        default_value: DiodeElm.DEFAULT_DROP,
	        data_type: parseFloat
	      }
	    });
	  }
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	
	    this.setup();
	  }
	
	  draw(renderContext) {
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      super.debugDraw(renderContext);
	    }
	
	    this.updateDots();
	    this.calcLeads(16);
	    let pa = Util.newPointArray(2);
	    this.wing = Util.newPointArray(2);
	
	    [pa[0], pa[1]] = Util.interpolateSymmetrical(this.lead1, this.lead2, 0, this.hs);
	    [this.cathode[0], this.cathode[1]] = Util.interpolateSymmetrical(this.lead1, this.lead2, 1, this.hs);
	    this.wing[0] = Util.interpolate(this.cathode[0], this.cathode[1], -0.2, -this.hs);
	    this.wing[1] = Util.interpolate(this.cathode[1], this.cathode[0], -0.2, -this.hs);
	
	    this.poly = Util.createPolygonFromArray([pa[0], pa[1], this.lead2]);
	
	    let v1 = this.volts[0];
	    let v2 = this.volts[1];
	
	    renderContext.drawLeads(this);
	
	    // draw arrow vector
	    // setPowerColor(g, true)
	    let color = renderContext.getVoltageColor(v1);
	    renderContext.drawThickPolygonP(this.poly, color);
	
	    // PLATE:
	    // setVoltageColor(g, v2)
	    color = renderContext.getVoltageColor(v2);
	    renderContext.drawLinePt(this.cathode[0], this.cathode[1], color);
	
	    // Cathode "Wings"
	    renderContext.drawLinePt(this.wing[0], this.cathode[0], color);
	    renderContext.drawLinePt(this.wing[1], this.cathode[1], color);
	
	    renderContext.drawDots(this.point2, this.point1, this);
	    return renderContext.drawPosts(this);
	  }
	
	
	  nonlinear() {
	    return true;
	  }
	
	  getName() {
	    return "Zener Diode"
	  }
	
	  setup() {
	    this.leakage = 5e-6;
	    return super.setup();
	  }
	
	  needsShortcut() {
	    return false;
	  }
	}
	
	module.exports = ZenerElm;


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Settings = __webpack_require__(2);
	let Polygon = __webpack_require__(7);
	let Rectangle = __webpack_require__(3);
	let Point = __webpack_require__(4);
	let SwitchElm = __webpack_require__(26);
	let Util = __webpack_require__(5);
	
	let _ = __webpack_require__(14);
	
	
	// Broken
	class Switch2Elm extends SwitchElm {
	  static initClass() {
	
	    this.FLAG_CENTER_OFF = 1;
	  }
	
	  static get Fields() {
	    return Util.extend(SwitchElm.Fields, {
	      "link": {
	        name: "link",
	        unit: "",
	        default_value: 0,
	        data_type: parseInt,
	        range: [0, 2],
	        field_type: "integer"
	      }
	    });
	  }
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	
	    this.openhs = 16;
	    this.noDiagonal = true;
	
	    this.place()
	  }
	
	  getName() {
	    return "Two-way switch"
	  }
	
	  place() {
	    super.place();
	    //super.setPoints(...arguments);
	    // @calcLeads(32);
	
	    this.swposts = Util.newPointArray(2);
	    this.swpoles = Util.newPointArray(3);
	
	    [this.swpoles[0], this.swpoles[1]] = Util.interpolateSymmetrical(this.lead1, this.lead2, 1, this.openhs);
	    this.swpoles[2] = this.lead2;
	
	    [this.swposts[0], this.swposts[1]] = Util.interpolateSymmetrical(this.point1, this.point2, 1, this.openhs);
	
	    this.posCount = this.hasCenterOff() ? 3 : 2;
	
	    this.setBboxPt(this.point1, this.point2, 2*this.openhs);
	  }
	
	  draw(renderContext) {
	    this.calcLeads(32);
	
	    this.swpoles = Util.newPointArray(3);
	    this.swposts = Util.newPointArray(2);
	
	    [this.swpoles[0], this.swpoles[1]] = Util.interpolateSymmetrical(this.lead1, this.lead2, 1, this.openhs);
	    this.swpoles[2] = this.lead2;
	
	    [this.swposts[0], this.swposts[1]] = Util.interpolateSymmetrical(this.point1, this.point2, 1, this.openhs);
	    if (this.hasCenterOff()) {
	      this.posCount = 3;
	    } else {
	      this.posCount = 2;
	    }
	
	    //this.setBboxPt(this.point1, this.point2, this.openhs);
	
	    // draw first lead
	    let color = renderContext.getVoltageColor(this.volts[0]);
	    renderContext.drawLinePt(this.point1, this.lead1, color);
	
	    // draw second lead
	    color = renderContext.getVoltageColor(this.volts[1]);
	    renderContext.drawLinePt(this.swpoles[0], this.swposts[0], color);
	
	    // draw third lead
	    color = renderContext.getVoltageColor(this.volts[2]);
	    renderContext.drawLinePt(this.swpoles[1], this.swposts[1], color);
	
	    this.updateDots();
	    renderContext.drawDots(this.point1, this.lead1, this);
	
	    if (this.position !== 2) {
	      renderContext.drawDots(this.swpoles[this.position], this.swposts[this.position], this);
	    }
	
	    renderContext.drawPosts(this);
	
	    // Switch lever
	    renderContext.drawLinePt(this.lead1, this.swpoles[this.position], Settings.SWITCH_COLOR, Settings.LINE_WIDTH + 1);
	
	
	    renderContext.fillCircle(this.lead1.x, this.lead1.y, Settings.POST_RADIUS, 1, Settings.FILL_COLOR, Settings.STROKE_COLOR);
	
	    renderContext.fillCircle(this.swpoles[0].x, this.swpoles[0].y, Settings.POST_RADIUS, 1, Settings.FILL_COLOR, Settings.STROKE_COLOR);
	    renderContext.fillCircle(this.swpoles[2].x, this.swpoles[2].y, Settings.POST_RADIUS, 1, Settings.POST_COLOR);
	    renderContext.fillCircle(this.swpoles[1].x, this.swpoles[1].y, Settings.POST_RADIUS, 1, Settings.FILL_COLOR, Settings.STROKE_COLOR);
	
	
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      return super.debugDraw(renderContext);
	    }
	
	  }
	
	//    if this.Circuit && this.Circuit.debugModeEnabled()
	//      super(renderContext)
	
	  getPost(n) {
	    if (n === 0) {
	      return this.point1;
	    } else {
	      return this.swposts[n - 1];
	    }
	  }
	
	  getPostCount() {
	    return 3;
	  }
	
	  calculateCurrent() {
	    if (this.position === 2) { return this.current = 0; }
	  }
	
	  stamp(stamper) {
	    // in center?
	    if (this.position === 2) {
	      return;
	    }
	    return stamper.stampVoltageSource(this.nodes[0], this.nodes[this.position + 1], this.voltSource, 0);
	  }
	
	  getVoltageSourceCount() {
	    if (this.position === 2) { return 0; } else { return 1; }
	  }
	
	  toggle() {
	    super.toggle();
	
	    if (this.link !== 0) {
	      this.getParentCircuit().eachComponent(function(component) {
	        if (component instanceof Switch2Elm) {
	          let s2 = component;
	          if (s2.link === self.link) {
	            s2.position = self.position;
	          }
	        }
	      });
	    }
	  }
	
	  getConnection(n1, n2) {
	    if (this.position === 2) {
	      return false;
	    }
	    return Util.comparePair(n1, n2, 0, 1 + this.position);
	  }
	
	  hasCenterOff() {
	    return (this.flags & Switch2Elm.FLAG_CENTER_OFF) !== 0;
	  }
	}
	Switch2Elm.initClass();
	
	module.exports = Switch2Elm;


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Settings = __webpack_require__(2);
	let Polygon = __webpack_require__(7);
	let Rectangle = __webpack_require__(3);
	let Point = __webpack_require__(4);
	let Util = __webpack_require__(5);
	
	class SweepElm extends CircuitComponent {
	  static initClass() {
	    this.FLAG_LOG = 1;
	    this.FLAG_BIDIR = 2;
	    this.circleSize = 17;
	  }
	
	  static get Fields() {
	    return {
	      "minF": {
	        name: "Min. Frequency",
	        unit: "Hertz",
	        default_value: 20,
	        symbol: "Hz",
	        data_type: parseFloat
	      },
	      "maxF": {
	        name: "Min. Frequency",
	        unit: "Hertz",
	        default_value: 4e4,
	        symbol: "Hz",
	        data_type: parseFloat
	      },
	      "maxV": {
	        name: "Voltage",
	        unit: "Voltage",
	        symbol: "V",
	        default_value: 5,
	        data_type: parseFloat
	      },
	      "sweepTime": {
	        unit: "seconds",
	        name: "Time",
	        symbol: "s",
	        default_value: 0.1,
	        data_type: parseFloat,
	        range: [0, Infinity]
	      }
	    };
	  }
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	
	    this.dir = 1;
	  }
	
	  getName() {
	    return "Frequency Sweep"
	  }
	
	  onSolder(circuit) {
	    return this.reset();
	  }
	
	  getPostCount() {
	    return 1;
	  }
	
	  draw(renderContext) {
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      super.debugDraw(renderContext);
	    }
	
	    let color = renderContext.getVoltageColor(this.volts[0]);
	    this.lead1 = Util.interpolate(this.point1, this.point2, 1 - (SweepElm.circleSize / this.dn()));
	
	    renderContext.drawLinePt(this.point1, this.lead1, color);
	    this.updateDots();
	    renderContext.drawDots(this.point2, this.point1, this);
	
	//    @setVoltageColor (if @needsHighlight() then CircuitComponent.selectColor else Color.GREY)
	//    @setVoltageColor(Color.GREY)
	//    powerColor = @setPowerColor(false)
	
	    let xc = this.point2.x;
	    let yc = this.point2.y;
	
	    renderContext.fillCircle(xc, yc, SweepElm.circleSize, 2, Settings.FG_COLOR);
	    renderContext.drawCircle(xc, yc, SweepElm.circleSize, 2, "#000000");
	
	    let wl = 8;
	
	//    @adjustBbox xc - SweepElm.circleSize, yc - SweepElm.circleSize, xc + SweepElm.circleSize, yc + SweepElm.circleSize
	
	    let xl = 10;
	    let ox = -1;
	    let oy = -1;
	    let tm = (new Date()).getTime(); //System.currentTimeMillis()
	    //double w = (this == mouseElm ? 3 : 2)
	
	    tm %= 2000;
	    if (tm > 1000) {
	      tm = 2000 - tm;
	    }
	
	//    if Circuit.stoppedCheck
	//      w = 1 + tm * .002
	//    else
	    let w = 1 + ((2 * (this.frequency - this.minF)) / (this.maxF - this.minF));
	
	    let i = -xl;
	
	    while (i <= xl) {
	      let yy = yc + Math.floor(.95 * Math.sin((i * Math.PI * w) / xl) * wl);
	
	      if (ox !== -1) {
	        renderContext.drawLine(ox, oy, xc + i, yy);
	      }
	
	      ox = xc + i;
	      oy = yy;
	      i++;
	    }
	
	//    if Circuit.showValuesCheckItem
	//      s = renderContext.getShortUnitText(@frequency, "Hz")
	//      if @axisAligned()
	//        @drawValues s, @circleSize
	
	    return renderContext.drawPosts(this);
	  }
	
	  stamp(stamper) {
	    return stamper.stampVoltageSource(0, this.nodes[0], this.voltSource);
	  }
	
	  setPoints() {
	    super.setPoints(...arguments);
	    return Util.interpolate(this.point1, this.point2, 1 - (SweepElm.circleSize / this.dn()));
	  }
	
	  setParams() {
	    if ((this.frequency < this.minF) || (this.frequency > this.maxF)) {
	      this.frequency = this.minF;
	      this.freqTime = 0;
	      this.dir = 1;
	    }
	
	    if ((this.flags & SweepElm.FLAG_LOG) === 0) {
	      this.fadd = (this.dir * this.getParentCircuit().timeStep() * (this.maxF - this.minF)) / this.sweepTime;
	      this.fmul = 1;
	    } else {
	      this.fadd = 0;
	      this.fmul = Math.pow(this.maxF / this.minF, (this.dir * this.getParentCircuit().timeStep()) / this.sweepTime);
	    }
	
	    return this.savedTimeStep = this.getParentCircuit().timeStep();
	  }
	
	  reset() {
	    this.frequency = this.minF;
	    this.freqTime = 0;
	    this.dir = 1;
	    return this.setParams();
	  }
	
	  startIteration() {
	    // has timestep been changed?
	    if (this.getParentCircuit().timeStep() !== this.savedTimeStep) {
	      this.setParams();
	    }
	
	    this.v = Math.sin(this.freqTime) * this.maxV;
	
	    this.freqTime += this.frequency * 2 * Math.PI * this.getParentCircuit().timeStep();
	    this.frequency = (this.frequency * this.fmul) + this.fadd;
	    if ((this.frequency >= this.maxF) && (this.dir === 1)) {
	      if ((this.flags & SweepElm.FLAG_BIDIR) !== 0) {
	        this.fadd = -this.fadd;
	        this.fmul = 1 / this.fmul;
	        this.dir = -1;
	      } else {
	        this.frequency = this.minF;
	      }
	    }
	    if ((this.frequency <= this.minF) && (this.dir === -1)) {
	      this.fadd = -this.fadd;
	      this.fmul = 1 / this.fmul;
	      return this.dir = 1;
	    }
	  }
	
	  doStep(stamper) {
	    return stamper.updateVoltageSource(0, this.nodes[0], this.voltSource, this.v);
	  }
	
	  getVoltageDiff() {
	    return this.volts[0];
	  }
	
	  getVoltageSourceCount() {
	    return 1;
	  }
	
	  hasGroundConnection(n1) {
	    return true;
	  }
	
	  getInfo(arr) {
	    arr[0] = `sweep ${((this.flags & SweepElm.FLAG_LOG) === 0) ? "(linear)" : "(log)"}`;
	    arr[1] = `I = ${Util.getUnitText(this.getCurrent(), "A")}`;
	    arr[2] = `V = ${Util.getUnitText(this.volts[0], "V")}`;
	    arr[3] = `f = ${Util.getUnitText(this.frequency, "Hz")}`;
	    arr[4] = `range = ${Util.getUnitText(this.minF, "Hz")} .. ${Util.getUnitText(this.maxF, "Hz")}`;
	    return arr[5] = `time = ${Util.getUnitText(this.sweepTime, "s")}`;
	  }
	}
	SweepElm.initClass();
	
	module.exports = SweepElm;


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Settings = __webpack_require__(2);
	let Polygon = __webpack_require__(7);
	let Rectangle = __webpack_require__(3);
	let Point = __webpack_require__(4);
	
	class TextElm extends CircuitComponent {
	  static initClass() {
	    this.FLAG_CENTER = 1;
	    this.FLAG_BAR = 2;
	  }
	
	  static get Fields() {
	    return {
	      text: {
	        default_value: "<text>",
	        name: "Text value",
	        type: "attribute",
	        data_type(x) { return x; }
	      },
	      size: {
	        name: "Text Size",
	        unit: "pt",
	        symbol: "pt",
	        default_value: 24,
	        data_type: parseInt,
	        range: [0, 500],
	        type: "attribute"
	      }
	    };
	  }
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	
	    // this.text = params.text;
	
	    this.lines = new Array(); // new vector()
	    this.lines.push(this.text);
	    // this.size = ;
	
	    this.place();
	
	    //this.setBbox(this.point1.x, this.point1.y, this.point2.x, this.point2.y);
	  }
	
	  stamp() {}
	
	  split() {
	    return this.lines = this.text.split("\n");
	  }
	
	  drag(xx, yy) {
	    this.point1.x = xx;
	    this.point1.y = yy;
	    this.point2.x = xx + 16;
	    return this.point2.y = yy;
	  }
	
	  getName() {
	    return "Text Label"
	  }
	
	  place() {
	    //super.setPoints(x1, y1, x2 ,y2);
	
	    this.point2 =  new Point(this.point1.x + 5 * this.text.length, this.point1.y);
	
	    this.setBbox(this.point1.x, this.point1.y - this.size, this.point1.x + 5 * this.text.length, this.point1.y + this.size);
	  }
	
	  draw(renderContext) {
	    let color = Settings.LABEL_COLOR;
	    //this.setBbox(this.point1.x, this.point1.y, this.point2.x, this.point2.y);
	
	    let mt = renderContext.fillText(this.text, this.x1(), this.y1(), color, (2/3) * this.size);
	
	    this.point2.x = this.boundingBox.x1 + this.boundingBox.width;
	    this.point2.y = this.boundingBox.y1 + this.boundingBox.height;
	
	    //this.setBbox(this.x1(), this.y1() - this.size + 1, this.x1() + mt.width, this.y1());
	
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      return super.debugDraw(renderContext);
	    }
	  }
	
	  isCenteredText() {
	    return (this.flags & TextElm.FLAG_CENTER) !== 0;
	  }
	
	  getPostCount() {
	    return 0;
	  }
	}
	TextElm.initClass();
	
	
	module.exports = TextElm;


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Settings = __webpack_require__(2);
	let Polygon = __webpack_require__(7);
	let Rectangle = __webpack_require__(3);
	let Point = __webpack_require__(4);
	let Util = __webpack_require__(5);
	
	class ProbeElm extends CircuitComponent {
	  static initClass() {
	  
	    this.FLAG_SHOWVOLTAGE = 1;
	  }
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	  }
	
	  setPoints() {
	    super.setPoints(...arguments);
	
	    // swap points so that we subtract higher from lower
	    if (this.point2.y < this.point1.y) {
	      let x = this.point1;
	      this.point1 = this.point2;
	      this.point2 = x;
	    }
	
	    return this.center = this.getCenter();
	  }
	
	  getName() {
	    return "Scope Probe"
	  }
	
	  draw(renderContext) {
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      super.debugDraw(renderContext);
	    }
	
	    let hs = 8;
	    this.setBboxPt(this.point1, this.point2, hs);
	    //      selected = (@needsHighlight() or Circuit.plotYElm is this)
	
	    //      if selected or Circuit.dragElm is this
	    //        len = 16
	    //      else
	    let len = this.dn() - 32;
	
	    this.calcLeads(Math.floor(len));
	
	//    if @isSelected()
	//      color = Settings.SELECT_COLOR
	//    else
	    let color = renderContext.getVoltageColor(this.volts[0]);
	
	    renderContext.drawLinePt(this.point1, this.lead1, color);
	
	//    if @isSelected()
	//      color = Settings.SELECT_COLOR
	//    else
	    color = renderContext.getVoltageColor(this.volts[1]);
	
	    renderContext.drawLinePt(this.lead2, this.point2, color);
	
	    //      renderContext.setFont new Font("SansSerif", Font.BOLD, 14)
	
	    //      renderContext.drawCenteredText("X", @center.x1, @center.y, color) if this is Circuit.plotXElm
	    //      renderContext.drawCenteredText("Y", @center.x1, @center.y, color) if this is Circuit.plotYElm
	
	    if (this.mustShowVoltage()) {
	      let unit_text = Util.getUnitText(this.volts[0], "V");
	    }
	//      @drawValues unit_text, 4, renderContext
	
	    return renderContext.drawPosts(this);
	  }
	
	  mustShowVoltage() {
	    return (this.flags & ProbeElm.FLAG_SHOWVOLTAGE) !== 0;
	  }
	
	  stamp(stamper) {}
	
	  getConnection(n1, n2) {
	    return false;
	  }
	}
	ProbeElm.initClass();
	
	
	module.exports = ProbeElm;


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	let GateElm = __webpack_require__(21);
	let Util = __webpack_require__(5);
	let Point = __webpack_require__(4);
	
	class AndGateElm extends GateElm {
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	  }
	
	  place() {
	    super.place();
	
	    let triPoints = Util.newPointArray(23);
	
	    [triPoints[0], triPoints[22]] = Util.interpolateSymmetrical(this.lead1, this.lead2, 0, this.hs2);
	
	    for (let i = 0; i < 10; i++) {
	      let a = i * 0.1;
	      let b = Math.sqrt(1 - (a*a));
	
	      [triPoints[i + 1], triPoints[21 - i]] = Util.interpolateSymmetrical(this.lead1, this.lead2, 0.5 + (a / 2), b * this.hs2);
	    }
	
	    triPoints[11] = new Point(this.lead2.x, this.lead2.y);
	
	    if (this.isInverting()) {
	      this.pcircle = Util.interpolate(this.point1, this.point2, 0.5 + ((this.ww + 4) / this.dn()));
	      this.lead2 = Util.interpolate(this.point1, this.point2, 0.5 + ((this.ww + 8) / this.dn()));
	    }
	
	    return this.gatePoly = Util.createPolygonFromArray(triPoints);
	  }
	
	  getName() {
	    return "AND Gate";
	  }
	
	  calcFunction() {
	    let f = true;
	
	    for (let i = 0; i < this.inputCount; ++i) {
	      f = f & this.getInput(i);
	    }
	
	    // console.log(f)
	
	    return f;
	  }
	}
	
	module.exports = AndGateElm;


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	let Util = __webpack_require__(5);
	let AndGateElm = __webpack_require__(41);
	
	class NandGateElm extends AndGateElm {
	  constructor(xa, ya, xb, yb, params, f){
	    super(xa, ya, xb, yb, params, f);
	  }
	
	  isInverting() {
	    return true;
	  }
	
	  getName() {
	    return "NAND Gate";
	  }
	}
	
	module.exports = NandGateElm;


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	let GateElm = __webpack_require__(21);
	let Util = __webpack_require__(5);
	let Point = __webpack_require__(4);
	
	class OrGateElm extends GateElm {
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	  }
	
	  getName() {
	    return "OR Gate";
	  }
	
	  place() {
	    let a, b, i;
	    super.place();
	
	    let triPoints = Util.newPointArray(38);
	
	    for (i = 0; i < 16; i++) {
	      a = i / 16.0;
	      b = 1 - (a * a);
	
	      [triPoints[i], triPoints[32 - i]] = Util.interpolateSymmetrical(this.lead1, this.lead2, 0.5 + (a/2), b * this.hs2);
	    }
	
	    let ww2 = (this.ww === 0) ? this.dn() * 2 : this.ww * 2;
	
	    for (i = 0; i < 5; i++) {
	      a = (i - 2) / 2.0;
	      b = (4 * (1 - (a*a))) - 2;
	
	      triPoints[33 + i] = Util.interpolate(this.lead1, this.lead2, b / ww2, a * this.hs2);
	    }
	
	    triPoints[16] = new Point(this.lead2.x, this.lead2.y);
	
	    if (this.isInverting()) {
	      this.pcircle = Util.interpolate(this.point1, this.point2, 0.5 + ((this.ww + 4) / this.dn()));
	      this.lead2 = Util.interpolate(this.point1, this.point2, 0.5 + ((this.ww + 8) / this.dn()));
	    }
	
	    return this.gatePoly = Util.createPolygonFromArray(triPoints);
	  }
	
	  calcFunction() {
	    let f = false;
	
	    for (let i = 0; i < this.inputCount; i++) {
	      f = f | this.getInput(i);
	    }
	
	    return f;
	  }
	}
	
	module.exports = OrGateElm;


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	let OrGateElm = __webpack_require__(43);
	
	class NorGateElm extends OrGateElm {
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	  }
	
	  getName() {
	    return "NOR Gate";
	  }
	
	  isInverting() {
	    return true;
	  }
	}
	
	module.exports = NorGateElm;


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	let OrGateElm = __webpack_require__(43);
	let Util = __webpack_require__(5);
	
	class XorGateElm extends OrGateElm {
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	  }
	
	  place() {
	    let a, b;
	    super.place();
	
	    this.linePoints = Util.newPointArray(5);
	
	    let ww2 = (this.ww === 0) ? this.dn() * 2 : this.ww * 2;
	
	    return [0, 1, 2, 3, 4].map((i) =>
	      (a = (i - 2) / 2.0,
	      b = (4 * (1 - (a*a))) - 2,
	
	      this.linePoints[i] = Util.interpolate(this.lead1, this.lead2, (b - 5) / ww2, a * this.hs2)));
	  }
	
	  getName() {
	    return "XOR Gate";
	  }
	
	  calcFunction() {
	    let f = false;
	
	    for (let i = 0; i < this.inputCount; ++i) {
	      f = f ^ this.getInput(i);
	    }
	
	    return f;
	  }
	}
	
	module.exports = XorGateElm;


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Util = __webpack_require__(5);
	let Settings = __webpack_require__(2);
	
	class InverterElm extends CircuitComponent {
	  static get Fields() {
	    return {
	      slewRate: {
	        name: "Slew Rate",
	        data_type: parseFloat,
	        default_value: 0.5
	      }
	    };
	  }
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	
	    this.noDiagonal = true;
	
	    this.place()
	  }
	
	  getName() {
	    return "Inverter"
	  }
	
	  place() {
	    this.hs = 16;
	    let ww = 16;
	
	    if (ww > (this.dn() / 2)) {
	      ww = Math.floor(this.dn()/2);
	    }
	
	    this.lead1 = Util.interpolate(this.point1, this.point2, 0.5 - (ww / this.dn()));
	    this.lead2 = Util.interpolate(this.point1, this.point2, 0.5 + ((ww + 2) / this.dn()));
	
	    this.pcircle = Util.interpolate(this.point1, this.point2, 0.5 + ((ww - 2) / this.dn()));
	
	    let triPoints = Util.newPointArray(3);
	
	    [triPoints[0], triPoints[1]] = Util.interpolateSymmetrical(this.lead1, this.lead2, 0, this.hs);
	
	    triPoints[2] = Util.interpolate(this.point1, this.point2, 0.5 + ((ww - 5) / this.dn()));
	
	    this.gatePoly = Util.createPolygonFromArray(triPoints);
	
	    this.setBboxPt(this.lead1, this.lead2, 2*this.hs);
	  }
	
	  draw(renderContext) {
	    //this.setBboxPt(this.point1, this.point2, this.hs);
	
	    renderContext.drawLeads(this);
	
	    renderContext.drawThickPolygonP(this.gatePoly, Settings.STROKE_COLOR, Settings.FILL_COLOR);
	    renderContext.fillCircle(this.pcircle.x, this.pcircle.y, Settings.POST_RADIUS + 2, 2, "#FFFFFF", Settings.STROKE_COLOR);
	
	    this.updateDots();
	    renderContext.drawDots(this.point1, this.point2, this);
	
	    renderContext.drawPosts(this);
	
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      return super.debugDraw(renderContext);
	    }
	  }
	
	  getVoltageSourceCount() {
	    return 1;
	  }
	
	  stamp(stamper) {
	    return stamper.stampVoltageSource(0, this.nodes[1], this.voltSource);
	  }
	
	  doStep(stamper) {
	    let v0 = this.volts[1];
	    let out = this.volts[0] > 2.5 ? 0 : 5;
	
	    let maxStep = this.slewRate * this.getParentCircuit().timeStep() * 1e9;
	
	    out = Math.max(Math.min(v0 + maxStep, out), v0 - maxStep);
	
	    return stamper.updateVoltageSource(0, this.nodes[1], this.voltSource, out);
	  }
	
	  getVoltageDiff() {
	    return this.volts[0];
	  }
	
	  getConnection(n1, n2) {
	    return false;
	  }
	
	  hasGroundConnection(n1) {
	    return n1 === 1;
	  }
	}
	InverterElm.initClass();
	
	module.exports = InverterElm;
	


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let SwitchElm = __webpack_require__(26);
	let Util = __webpack_require__(5);
	let Settings = __webpack_require__(2);
	
	class LogicInputElm extends SwitchElm {
	  static initClass() {
	    this.prototype.FLAG_TERNARY = 1;
	    this.prototype.FLAG_NUMERIC = 2;
	  }
	
	  static get Fields() {
	  
	    return {
	      "position": {
	        name: "Position",
	        default_value: 0,
	        data_type(str){
	          str = str.toString();
	  
	          if (str === 'true') {
	            return 0;
	          } else if (str === 'false') {
	            return 1;
	          } else {
	            return parseInt(str);
	          }
	        },
	        field_type: "boolean"
	      },
	      "momentary": {
	        name: "Momentary",
	        default_value: 0,
	        data_type(str) { return str.toString() === 'true'; },
	        field_type: "boolean"
	      },
	      hiV: {
	        name: "Voltage High",
	        data_type: parseFloat,
	        default_value: 5
	      },
	      loV: {
	        name: "Voltage Low",
	        data_type: parseFloat,
	        default_value: 0
	      }
	    };
	  }
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	
	    if (this.isTernary()) {
	      this.posCount = 3;
	    }
	  }
	
	  draw(renderContext) {
	    let s = this.position === 0 ? "L" : "H";
	
	    if (this.isNumeric()) {
	      s = `${this.position}`;
	    }
	
	    renderContext.fillText(s, this.point2.x - 5, this.point2.y + 6, Settings.TEXT_COLOR, 1.5*Settings.TEXT_SIZE);
	
	    let color = renderContext.getVoltageColor(this.volts[0]);
	    renderContext.drawLinePt(this.point1, this.lead1, color);
	
	    this.updateDots();
	    renderContext.drawDots(this.point1, this.lead1, this);
	    renderContext.drawPosts(this);
	
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      return super.debugDraw(renderContext);
	    }
	  }
	
	  getName(){
	    return "Input Logic"
	  }
	
	  isTernary() {
	    return this.flags & (LogicInputElm.FLAG_TERNARY !== 0);
	  }
	
	  isNumeric() {
	    return this.flags & ((LogicInputElm.FLAG_TERNARY | LogicInputElm.FLAG_NUMERIC) !== 0);
	  }
	
	  getPostCount() {
	    return 1;
	  }
	
	  setPoints() {
	    super.setPoints(...arguments);
	
	    return this.lead1 = Util.interpolate(this.point1, this.point2, 1 - (12 / this.dn()));
	  }
	
	
	  setCurrent(vs, c) {
	    return this.current = -c;
	  }
	
	  stamp(stamper) {
	    let v = this.position === 0 ? this.loV : this.hiV;
	
	    if (this.isTernary()) {
	      v = this.position * 2.5;
	    }
	
	    return stamper.stampVoltageSource(0, this.nodes[0], this.voltSource, v);
	  }
	
	  getVoltageSourceCount() {
	    return 1;
	  }
	
	  getVoltageDiff() {
	    return this.volts[0];
	  }
	
	  hasGroundConnection(n1) {
	    return true;
	  }
	}
	LogicInputElm.initClass();
	
	module.exports = LogicInputElm;
	


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Settings = __webpack_require__(2);
	let Polygon = __webpack_require__(7);
	let Rectangle = __webpack_require__(3);
	let Point = __webpack_require__(4);
	let Util = __webpack_require__(5);
	
	class LogicOutputElm extends CircuitComponent {
	  static initClass() {
	    this.FLAG_TERNARY = 1;
	    this.FLAG_NUMERIC = 2;
	    this.FLAG_PULLDOWN = 4;
	  }
	
	  static get Fields() {
	    return {
	      threshold: {
	        name: "Threshold Voltage",
	        data_type: parseFloat,
	        default_value: 2.5
	      }
	    };
	  }
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	
	    this.place()
	  }
	
	
	  isTernary() {
	    return (this.flags & LogicOutputElm.FLAG_TERNARY) !== 0;
	  }
	
	  isNumeric() {
	    return (this.flags & (LogicOutputElm.FLAG_TERNARY | LogicOutputElm.FLAG_NUMERIC)) !== 0;
	  }
	
	  needsPullDown() {
	    return (this.flags & LogicOutputElm.FLAG_PULLDOWN) !== 0;
	  }
	
	  getPostCount() {
	    return 1;
	  }
	
	  getName() {
	    return "Logic Output"
	  }
	
	  draw(renderContext) {
	    let s = this.volts < this.threshold ? "L" : "H";
	
	    if (this.isTernary()) {
	      if (this.volts[0] > 3.75) {
	        s = "2";
	      } else if (this.volts[0] > 1.25) {
	        s = "1";
	      } else {
	        s = "0";
	      }
	    } else if (this.isNumeric()) {
	      s = (this.volts[0] < this.threshold) ? "0" : "1";
	    }
	
	    this.value = s;
	
	    renderContext.fillText(s, this.point2.x - 1, this.point2.y + 6, Settings.TEXT_COLOR, 1.5*Settings.TEXT_SIZE);
	
	    let color = renderContext.getVoltageColor(this.volts[0]);
	    renderContext.drawLinePt(this.point1, this.lead1, color);
	    renderContext.drawPosts(this);
	
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      return super.debugDraw(renderContext);
	    }
	  }
	
	  place() {
	    this.lead1 = Util.interpolate(this.point1, this.point2, 1 - (12 / this.dn()));
	  }
	
	
	  stamp(stamper) {
	    if (this.needsPullDown()) {
	      return stamper.stampResistor(this.nodes[0], 0, 1e6);
	    }
	  }
	
	  getVoltageDiff() {
	    return this.volts[0];
	  }
	}
	LogicOutputElm.initClass();
	
	
	
	module.exports = LogicOutputElm;


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Util = __webpack_require__(5);
	let Point = __webpack_require__(4);
	let Settings = __webpack_require__(2);
	
	class AnalogSwitchElm extends CircuitComponent {
	  static initClass() {
	    this.FLAG_INVERT = 1;
	  }
	
	  static get Fields() {
	    return {
	      r_on: {
	        name: "On Resistance",
	        data_type: parseFloat,
	        default_value: 20,
	        symbol: "Ω"
	      },
	      r_off: {
	        name: "Off Resistance",
	        data_type: parseFloat,
	        default_value: 1e10,
	        symbol: "Ω"
	      }
	    };
	  }
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	  }
	
	  setPoints() {
	    super.setPoints(...arguments);
	
	    this.calcLeads(32);
	    this.open = false;
	
	    this.ps = new Point(0, 0);
	    let openhs = 16;
	
	    this.point3 = Util.interpolate(this.point1, this.point2, 0.5, -openhs);
	    this.lead3 = Util.interpolate(this.point1, this.point2, 0.5, -openhs / 2);
	
	    this.setBboxPt(this.point1, this.point2, openhs);
	  }
	
	  draw(renderContext) {
	    let openhs = 16;
	
	    let hs = this.open ? openhs : 0;
	
	    renderContext.drawLeads(this)
	
	    this.ps = Util.interpolate(this.lead1, this.lead2, 1, hs);
	
	    // SWITCH LEVER
	    renderContext.drawLinePt(this.lead1, this.ps, Settings.SWITCH_COLOR, Settings.LINE_WIDTH + 1);
	
	    renderContext.drawLinePt(this.point3, this.lead3);
	
	    this.updateDots();
	    renderContext.drawDots(this.point1, this.point2, this);
	
	    renderContext.drawPosts(this);
	
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      return super.debugDraw(renderContext);
	    }
	  }
	
	  getName() {
	    return "Analog Switch"
	  }
	
	  calculateCurrent() {
	    return this.current = (this.volts[0] - this.volts[1]) / this.resistance;
	  }
	
	  nonLinear() {
	    return true;
	  }
	
	  stamp(stamper) {
	    stamper.stampNonLinear(this.nodes[0]);
	    return stamper.stampNonLinear(this.nodes[1]);
	  }
	
	  doStep(stamper) {
	    this.open = this.volts[2] < 2.5;
	
	    if ((this.flags & AnalogSwitchElm) !== 0) {
	      this.open = !this.open;
	    }
	
	    this.resistance = this.open ? this.r_off : this.r_on;
	
	    return stamper.stampResistor(this.nodes[0], this.nodes[1], this.resistance);
	  }
	
	  getPostCount() {
	    return 3;
	  }
	
	  getPost(n){
	    if (n === 0) {
	      return this.point1;
	    } else {
	      if (n === 1) {
	        return this.point2;
	      } else {
	        return this.point3;
	      }
	    }
	  }
	
	  getConnection(n1, n2) {
	    return !((n1 === 2) || (n2 === 2));
	  }
	}
	AnalogSwitchElm.initClass();
	
	
	
	
	
	module.exports = AnalogSwitchElm;


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let AnalogSwitchElm = __webpack_require__(49);
	let Util = __webpack_require__(5);
	let Point = __webpack_require__(4);
	let Settings = __webpack_require__(2);
	
	class AnalogSwitch2Elm extends AnalogSwitchElm {
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	    this.openhs = 16;
	  }
	
	  setPoints() {
	    super.setPoints(...arguments);
	
	    this.calcLeads(32);
	
	    this.swposts = Util.newPointArray(2);
	    this.swpoles = Util.newPointArray(2);
	
	    [this.swpoles[0], this.swpoles[1]] = Util.interpolateSymmetrical(this.lead1, this.lead2, 1, this.openhs);
	    [this.swposts[0], this.swposts[1]] = Util.interpolateSymmetrical(this.point1, this.point2, 1, this.openhs);
	
	    this.ctlPoint = Util.interpolate(this.point1, this.point2, 0.5, this.openhs);
	
	    this.setBboxPt(this.point1, this.point2, this.openhs);
	  }
	
	  getPostCount() {
	    return 4;
	  }
	
	  getPost(n) {
	    if (n===0) {
	      return this.point1;
	    } else {
	      if (n === 3) {
	        return this.ctlPoint;
	      } else {
	        return this.swposts[n - 1];
	      }
	    }
	  }
	
	  draw(renderContext) {
	    this.setBboxPt(this.point1, this.point2, this.openhs);
	
	    let color = renderContext.getVoltageColor(this.volts[0]);
	    renderContext.drawLinePt(this.point1, this.lead1, color);
	
	    // draw second lead
	    color = renderContext.getVoltageColor(this.volts[0]);
	    renderContext.drawLinePt(this.swpoles[0], this.swposts[0], color);
	
	    // draw third lead
	    color = renderContext.getVoltageColor(this.volts[2]);
	    renderContext.drawLinePt(this.swpoles[1], this.swposts[1], color);
	
	    let position = this.open ? 1 : 0;
	    // draw switch
	    renderContext.drawLinePt(this.lead1, this.swpoles[position], Settings.SWITCH_COLOR, Settings.LINE_WIDTH + 1);
	
	    this.updateDots();
	
	    renderContext.drawDots(this.point1, this.lead1, this);
	    renderContext.drawDots(this.swpoles[position], this.swposts[position], this);
	
	    renderContext.fillCircle(this.lead1.x, this.lead1.y, 3, 0, Settings.LIGHT_POST_COLOR);
	    renderContext.fillCircle(this.swpoles[1].x, this.swpoles[1].y, 3, 0, Settings.LIGHT_POST_COLOR);
	    renderContext.fillCircle(this.swpoles[0].x, this.swpoles[0].y, 3, 0, Settings.LIGHT_POST_COLOR);
	
	    renderContext.drawPosts(this);
	
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      return super.debugDraw(renderContext);
	    }
	  }
	
	  calculateCurrent() {
	    if (this.open) {
	      return this.current = (this.volts[0] - this.volts[2]) / this.r_on;
	    } else {
	      return this.current = (this.volts[0] - this.volts[1]) / this.r_on;
	    }
	  }
	
	  getName() {
	    return "Analog Switch (2-way)"
	  }
	
	  stamp(stamper) {
	    stamper.stampNonLinear(this.nodes[0]);
	    stamper.stampNonLinear(this.nodes[1]);
	    return stamper.stampNonLinear(this.nodes[2]);
	  }
	
	  doStep(stamper) {
	    this.open = this.volts[3] < 2.5;
	
	    if ((this.flags & AnalogSwitch2Elm.FLAG_INVERT) !== 0) {
	      this.open = !this.open;
	    }
	
	    if (this.open) {
	      stamper.stampResistor(this.nodes[0], this.nodes[2], this.r_on);
	      return stamper.stampResistor(this.nodes[0], this.nodes[1], this.r_off);
	    } else {
	      stamper.stampResistor(this.nodes[0], this.nodes[1], this.r_on);
	      return stamper.stampResistor(this.nodes[0], this.nodes[2], this.r_off);
	    }
	  }
	
	  getConnection(n1, n2) {
	    if ((n1 === 3) || (n2 === 3)) {
	      return false;
	    }
	    return true;
	  }
	}
	
	module.exports = AnalogSwitch2Elm;


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Util = __webpack_require__(5);
	let Point = __webpack_require__(4);
	
	class MemristorElm extends CircuitComponent {
	  static get Fields() {
	  
	    return {
	      r_on: {
	        name: "On resistance",
	        data_type: parseFloat,
	        default_value: 100,
	        symbol: "Ω"
	      },
	      r_off: {
	        name: "Off resistance",
	        data_type: parseFloat,
	        default_value: 160 * 100,
	        symbol: "Ω"
	      },
	      dopeWidth: {
	        name: "Doping Width",
	        data_type: parseFloat,
	        default_value: 0,
	        symbol: "m"
	      },
	      totalWidth: {
	        name: "Total Width",
	        data_type: parseFloat,
	        default_value: 10e-9,
	        symbol: "m"
	      },
	      mobility: {
	        name: "Majority carrier mobility",
	        data_type: parseFloat,
	        default_value: 1e-10,
	        symbol: "cm2/(V·s)"
	      },
	      resistance: {
	        name: "Overall resistance",
	        data_type: parseFloat,
	        default_value: 100,
	        symbol: "Ω"
	      }
	    };
	  }
	
	  constructor(xa, xb, ya, yb, params, f) {
	    super(xa, xb, ya, yb, params, f);
	  }
	
	  setPoints() {
	    super.setPoints(...arguments);
	    this.calcLeads(32);
	    this.ps3 = new Point(0, 0);
	    return this.ps4 = new Point(0, 0);
	  }
	
	  getName() {
	    return "Memristor"
	  }
	
	  reset() {
	    return this.dopeWidth = 0;
	  }
	
	  draw(renderContext) {
	    let segments = 6;
	    let ox = 0;
	    let v1 = this.volts[0];
	    let v2 = this.volts[1];
	    let hs = 2 + Math.floor(8 * (1 - this.dopeWidth / this.totalWidth));
	    this.setBboxPt(this.point1, this.point2, hs);
	    renderContext.drawLeads(this);
	
	    let segf = 1.0 / segments;
	
	    // draw zigzag
	    for (let i = 0; i <= segments; i++) {
	      let nx = (i & 1) == 0 ? 1 : -1;
	      if (i == segments)
	        nx = 0;
	
	      let v = v1 + (v2 - v1) * i / segments;
	
	      let color = renderContext.getVoltageColor(v);
	
	      let startPosition = Util.interpolate(this.lead1, this.lead2, i * segf, hs * ox);
	      let endPosition = Util.interpolate(this.lead1, this.lead2, i * segf, hs * nx);
	
	      renderContext.drawLinePt(startPosition, endPosition, color);
	
	      if (i == segments)
	        break;
	
	      startPosition = Util.interpolate(this.lead1, this.lead2, (i + 1) * segf, hs * nx);
	      renderContext.drawLinePt(startPosition, endPosition);
	
	      ox = nx;
	    }
	
	    renderContext.drawDots(this.point1, this.lead1, this);
	    renderContext.drawDots(this.lead2, this.point2, this);
	    renderContext.drawPosts(this);
	
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      return super.debugDraw(renderContext);
	    }
	  }
	
	  nonLinear() {
	    return true;
	  }
	
	  doStep(stamper) {
	    return stamper.stampResistor(this.nodes[0], this.nodes[1], this.resistance);
	  }
	
	  stamp(stamper) {
	    stamper.stampNonLinear(this.nodes[0]);
	    return stamper.stampNonLinear(this.nodes[1]);
	  }
	
	  calculateCurrent() {
	    return this.current = (this.volts[0] - this.volts[1]) / this.resistance;
	  }
	
	  startIteration() {
	    let wd = this.dopeWidth / this.totalWidth;
	    this.dopeWidth += (this.getParentCircuit().timeStep() * this.mobility * this.r_on * this.current) / this.totalWidth;
	
	    if (this.dopeWidth < 0) {
	      this.dopeWidth = 0;
	    }
	    if (this.dopeWidth > this.totalWidth) {
	      this.dopeWidth = this.totalWidth;
	    }
	
	    return this.resistance = (this.r_on * wd) + (this.r_off * (1 - wd));
	  }
	}
	MemristorElm.initClass();
	
	
	module.exports = MemristorElm;


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Util = __webpack_require__(5);
	let Point = __webpack_require__(4);
	let Settings = __webpack_require__(2);
	
	class RelayElm extends CircuitComponent {
	  static initClass() {
	    this.FLAG_SWAP_COIL = 1;
	    this.FLAG_BACK_EULER = 2;
	  }
	
	  static get Fields() {
	    return {
	      poleCount: {
	        data_type: parseInt,
	        default_value: 1
	      },
	      inductance: {
	        data_type: parseFloat,
	        default_value: 0.2
	      },
	      coilCurrent: {
	        data_type: parseFloat,
	        default_value: 0
	      },
	      r_on: {
	        data_type: parseFloat,
	        default_value: 0.05
	      },
	      r_off: {
	        data_type: parseFloat,
	        default_value: 1e6
	      },
	      onCurrent: {
	        data_type: parseFloat,
	        default_value: 0.02
	      },
	      coilR: {
	        data_type: parseFloat,
	        default_value: 20
	      }
	    };
	  }
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	
	    if (!this.poleCount) { this.poleCount = 2; } // Temporary
	
	    this.switchCurrent = [];
	
	    this.nSwitch0 = 0;
	    this.nSwitch1 = 1;
	    this.nSwitch2 = 2;
	
	//    ind.setup(@inductance, @coilCurrent, Inductor.FLAG_BACK_EULER)
	//    @flags = RelayElm.FLAG_BACK_EULER
	    this.tempCurrent = this.coilCurrent;
	    this.compResistance = 0;
	    this.curSourceValue = 0;
	
	    this.setupPoles();
	    this.place();
	
	    this.noDiagonal = true;
	  }
	
	  setupPoles() {
	    this.nCoil1 = 3 * this.poleCount;
	    this.nCoil2 = this.nCoil1 + 1;
	    this.nCoil3 = this.nCoil1 + 2;
	
	    if ((this.switchCurrent === null) || (this.switchCurrent == undefined) || (this.switchCurrent.length !== this.poleCount)) {
	      this.switchCurrent = new Array(this.poleCount);
	      this.switchCurCount = new Array(this.poleCount);
	    }
	  }
	
	  getName() {
	    return "Relay"
	  }
	
	  place() {
	    let i, j;
	    //super.setPoints(...arguments);
	    this.setupPoles();
	    this.allocNodes();
	    this.openhs = -this.dsign() * 16;
	
	    this.calcLeads(32);
	
	    this.swposts = ((() => {
	      let result = [];
	      for (j = 0, end = this.poleCount, asc = 0 <= end; asc ? j < end : j > end; asc ? j++ : j--) {
	        var asc, end;
	        result.push((() => {
	          let result1 = [];
	          for (i = 0; i < 3; i++) {
	            result1.push(new Point(0, 0));
	          }
	          return result1;
	        })());
	      }
	      return result;
	    })());
	
	    this.swpoles = ((() => {
	      let result2 = [];
	      for (j = 0, end1 = this.poleCount, asc1 = 0 <= end1; asc1 ? j < end1 : j > end1; asc1 ? j++ : j--) {
	        var asc1, end1;
	        result2.push((() => {
	          let result3 = [];
	          for (i = 0; i < 3; i++) {
	            result3.push(new Point(0, 0));
	          }
	          return result3;
	        })());
	      }
	      return result2;
	    })());
	
	    for (let i = 0; i < this.poleCount; ++i) {
	      for (j = 0; j < 3; j++) {
	        this.swposts[i][j] = new Point(0, 0);
	        this.swpoles[i][j] = new Point(0, 0);
	      }
	
	      this.swpoles[i][0] = Util.interpolate(this.lead1, this.lead2, 0, -this.openhs * 3 * i);
	      this.swpoles[i][1] = Util.interpolate(this.lead1, this.lead2, 1, (-this.openhs * 3 * i) - this.openhs);
	      this.swpoles[i][2] = Util.interpolate(this.lead1, this.lead2, 1, (-this.openhs * 3 * i) + this.openhs);
	      this.swposts[i][0] = Util.interpolate(this.point1, this.point2, 0, -this.openhs * 3 * i);
	      this.swposts[i][1] = Util.interpolate(this.point1, this.point2, 1, (-this.openhs * 3 * i) - this.openhs);
	      this.swposts[i][2] = Util.interpolate(this.point1, this.point2, 1, (-this.openhs * 3 * i) + this.openhs);
	    }
	
	    this.coilPosts = new Array(2);
	    this.coilLeads = new Array(2);
	    this.ptSwitch = new Array(this.poleCount);
	
	    let x = ((this.flags & RelayElm.FLAG_SWAP_COIL) !== 0) ? 1 : 0;
	
	    this.coilPosts[0] = Util.interpolate(this.point1, this.point2, x, this.openhs * 2);
	    this.coilPosts[1] = Util.interpolate(this.point1, this.point2, x, this.openhs * 3);
	    this.coilLeads[0] = Util.interpolate(this.point1, this.point2, 0.5, this.openhs * 2);
	    this.coilLeads[1] = Util.interpolate(this.point1, this.point2, 0.5, this.openhs * 3);
	
	    if (this.poleCount && this.poleCount > 0)
	      this.lines = new Array(this.poleCount * 2);
	  }
	
	  getPost(n) {
	    if (n < (3 * this.poleCount))
	      return this.swposts[Math.floor(n / 3)][n % 3];
	
	
	    return this.coilPosts[n - (3 * this.poleCount)];
	  }
	
	  getPostCount() {
	    return 2 + (3 * this.poleCount);
	  }
	
	  getInternalNodeCount() {
	    return 1;
	  }
	
	  isTrapezoidal() {
	    return (this.flags & RelayElm.FLAG_BACK_EULER) === 0;
	  }
	
	  reset() {
	    super.reset();
	
	    this.current = 0;
	    this.tempCurrent = 0;
	    this.coilCurrent = 0;
	    this.coilCurCount = 0;
	
	    __range__(0, this.poleCount, false).map((i) =>
	      this.switchCurrent[i] = this.switchCurCount[i] = 0);
	  }
	
	  stamp(stamper) {
	    if (this.isTrapezoidal()) {
	      this.compResistance = (2 * this.inductance) / this.getParentCircuit().timeStep();
	    // backward euler
	    } else {
	      this.compResistance = this.inductance / this.getParentCircuit().timeStep();
	    }
	
	    stamper.stampResistor(this.nodes[this.nCoil1], this.nodes[this.nCoil3], this.compResistance);
	    stamper.stampRightSide(this.nodes[this.nCoil1]);
	    stamper.stampRightSide(this.nodes[this.nCoil3]);
	
	    stamper.stampResistor(this.nodes[this.nCoil3], this.nodes[this.nCoil2], this.coilR);
	
	    __range__(0, (3 * this.poleCount), false).map((i) =>
	      //console.log("STAMP! #{@nodes[@nSwitch0 + i]} #{@nodes[@nCoil1]}, #{@nodes[@nCoil2]}, #{@nodes[@nCoil3]}, #{@coilR} -> #{@compResistance}")
	
	//      console.log(@nodes[@nSwitch0 + i])
	      stamper.stampNonLinear(this.nodes[this.nSwitch0 + i]));
	  }
	
	  startIteration() {
	    // ind.startIteration(@volts[@nCoil1] - @volts[@nCoil3])
	    let voltdiff = this.volts[this.nCoil1] - this.volts[this.nCoil3];
	
	    if (this.isTrapezoidal()) {
	      this.curSourceValue = (voltdiff / this.compResistance) + this.tempCurrent;
	    // backward euler
	    } else {
	      this.curSourceValue = this.tempCurrent;
	    }
	
	    let magic = 1.3;
	    let pmult = Math.sqrt(magic + 1);
	    let p = (this.coilCurrent * pmult) / this.onCurrent;
	
	    this.d_position = Math.abs(p * p) - 1.3;
	
	    if (this.d_position < 0) {
	      this.d_position = 0;
	    }
	    if (this.d_position > 1) {
	      this.d_position = 1;
	    }
	    if (this.d_position < 0.1) {
	      return this.i_position = 0;
	    } else if (this.d_position > 0.9) {
	      return this.i_position = 1;
	    } else {
	      return this.i_position = 2;
	    }
	  }
	
	  draw(renderContext) {
	    //this.setPoints();
	
	    let i;
	    for (i = 0; i < 2; i++) {
	      renderContext.getVoltageColor(this.volts[this.nCoil1 + i]);
	      renderContext.drawLinePt(this.coilLeads[i], this.coilPosts[i]);
	    }
	
	    renderContext.drawLeads(this);
	
	    let x = ((this.flags & RelayElm.FLAG_SWAP_COIL) !== 0) ? 1 : 0;
	
	    renderContext.drawCoil(this.coilLeads[x], this.coilLeads[1 - x], this.volts[this.nCoil1 + x], this.volts[this.nCoil2 - x], this.dsign() * 6);
	
	    // draw lines
	    for (let i = 0; i < this.poleCount; ++i) {
	      if (i === 0)
	        this.lines[i * 2] = Util.interpolate(this.point1, this.point2, .5, ((this.openhs * 2) + (5 * this.dsign())) - (i * this.openhs * 3));
	      else
	        this.lines[i * 2] = Util.interpolate(this.point1, this.point2, .5, Math.floor((this.openhs * ((((-i * 3) + 3) - 0.5) + this.d_position)) + (5 * this.dsign())));
	
	      this.lines[(i * 2) + 1] = Util.interpolate(this.point1, this.point2, .5, Math.floor((this.openhs * (((-i * 3) - .5) + this.d_position)) - (5 * this.dsign())));
	
	      renderContext.drawLine(this.lines[i * 2].x, this.lines[i * 2].y, this.lines[(i * 2) + 1].x, this.lines[(i * 2) + 1].y, "#AAA");
	    }
	
	    for (let p = 0; p < this.poleCount; ++p) {
	      let po = p * 3;
	
	      for (i = 0; i < 3; i++) {
	        // draw lead
	        renderContext.getVoltageColor(this.volts[this.nSwitch0 + po + i]);
	        renderContext.drawLinePt(this.swposts[p][i], this.swpoles[p][i]);
	      }
	
	      this.ptSwitch[p] = Util.interpolate(this.swpoles[p][1], this.swpoles[p][2], this.d_position);
	
	      renderContext.drawLinePt(this.swpoles[p][0], this.ptSwitch[p], Settings.LIGHT_POST_COLOR);
	      //      switchCurCount[p] = updateDotCount(@switchCurrent[p], @switchCurCount[p], this)
	
	      this.updateDots();
	      renderContext.drawDots(this.swposts[p][0], this.swpoles[p][0], this);
	    }
	
	      // TODO: Multi dots
	//      if (@i_position != 2)
	//        @drawDots(g, @swpoles[p][@i_position + 1], @swposts[p][@i_position + 1], @switchCurCount[p])
	
	//    coilCurCount = updateDotCount(coilCurrent, coilCurCount);
	
	//    drawDots(g, coilPosts[0], coilLeads[0], coilCurCount);
	//    drawDots(g, coilLeads[0], coilLeads[1], coilCurCount);
	//    drawDots(g, coilLeads[1], coilPosts[1], coilCurCount);
	
	    renderContext.drawPosts(this);
	
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      super.debugDraw(renderContext);
	    }
	  }
	
	    //    adjustBbox(swpoles[poleCount - 1][0], swposts[poleCount - 1][1]); // XXX
	
	  doStep(stamper) {
	    stamper.stampCurrentSource(this.nodes[this.nCoil1], this.nodes[this.nCoil3], this.curSourceValue);
	
	    let res0 = this.i_position === 0 ? this.r_on : this.r_off;
	    let res1 = this.i_position === 1 ? this.r_on : this.r_off;
	
	    let p = 0;
	    return (() => {
	      let result = [];
	      while (p < (3 * this.poleCount)) {
	        stamper.stampResistor(this.nodes[this.nSwitch0 + p], this.nodes[this.nSwitch1 + p], res0);
	        stamper.stampResistor(this.nodes[this.nSwitch0 + p], this.nodes[this.nSwitch2 + p], res1);
	
	        this.nSwitch0 + p;
	
	        result.push(p += 3);
	      }
	      return result;
	    })();
	  }
	
	  calculateCurrent() {
	    let voltdiff = this.volts[this.nCoil1 - this.volts[this.nCoil3]];
	
	    //  @coilCurrent = ind.calculateCurrent(voltdiff)
	
	    if (this.compResistance > 0) {
	      this.tempCurrent = (voltdiff / this.compResistance) + this.curSourceValue;
	    }
	
	    this.coilCurrent = this.tempCurrent;
	
	    return __range__(0, this.poleCount, false).map((p) =>
	      this.i_position === 2 ?
	        this.switchCurrent[p] = 0
	      :
	        this.switchCurrent[p] = (this.volts[this.nSwitch0 + (p * 3)] - this.volts[this.nSwitch1 + (p * 3) + this.i_position]) / this.r_on);
	  }
	
	
	  getConnection(n1, n2) {
	    return Math.floor(n1 / 3) === Math.floor(n2 / 3);
	  }
	
	  nonLinear() {
	    return true;
	  }
	}
	RelayElm.initClass();
	
	
	module.exports = RelayElm;
	
	function __range__(left, right, inclusive) {
	  let range = [];
	  let ascending = left < right;
	  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
	  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
	    range.push(i);
	  }
	  return range;
	}

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Util = __webpack_require__(5);
	
	class TunnelDiodeElm extends CircuitComponent {
	  constructor(xa, xb, ya, yb, params, f) {
	    super(xa, xb, ya, yb, params, f);
	
	    this.pvp = .1;
	    this.pip = 4.7e-3;
	    this.pvv = .37;
	    this.pvt = .026;
	    this.pvpp = .525;
	    this.piv = 370e-6;
	    this.hs = 8;
	    this.lastvoltdiff = 0;
	
	    this.setup();
	
	    this.setPoints(xa, xb, ya, yb)
	  }
	
	  reset() {
	    return this.lastvoltdiff = this.volts[0] = this.volts[1] = this.curcount = 0;
	  }
	
	  nonLinear() {
	    return true;
	  }
	
	  setup() {
	  }
	
	  getName() {
	    return "Tunnel Diode"
	  }
	
	  draw(renderContext) {
	    let v1 = this.volts[0];
	    let v2 = this.volts[1];
	
	    renderContext.drawLeads(this);
	
	    // draw arrow thingy
	    //setPowerColor(g, true);
	
	    this.updateDots();
	    renderContext.drawDots(this.point1, this.point2, this);
	
	    let color = renderContext.getVoltageColor(v1);
	
	    renderContext.drawThickPolygonP(this.poly);
	
	    // draw thing arrow is pointing to
	    color = renderContext.getVoltageColor(v2);
	
	    renderContext.drawLinePt(this.cathode[0], this.cathode[1], color);
	    renderContext.drawLinePt(this.cathode[2], this.cathode[0], color);
	    renderContext.drawLinePt(this.cathode[3], this.cathode[1], color);
	
	    renderContext.drawPosts(this);
	
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      super.debugDraw(renderContext);
	    }
	  }
	
	  setPoints(x1, y1, x2, y2) {
	    super.setPoints(x1, y1, x2, y2);
	
	    this.calcLeads(16);
	    this.cathode = new Array(4);
	    let pa = new Array(2);
	
	    [pa[0], pa[1]] = Util.interpolateSymmetrical(this.lead1, this.lead2, 0, this.hs);
	    [this.cathode[0], this.cathode[1]] = Util.interpolateSymmetrical(this.lead1, this.lead2, 1, this.hs);
	    [this.cathode[2], this.cathode[3]] = Util.interpolateSymmetrical(this.lead1, this.lead2, 0.8, this.hs);
	
	    this.poly = Util.createPolygon(pa[0], pa[1], this.lead2);
	  }
	
	  limitStep(vnew, vold) {
	    if (vnew > (vold + 1)) {
	      return vold + 1;
	    }
	
	    if (vnew < (vold - 1)) {
	      return vold - 1;
	    }
	
	    return vnew;
	  }
	
	  stamp(stamper) {
	    stamper.stampNonLinear(this.nodes[0]);
	    return stamper.stampNonLinear(this.nodes[1]);
	  }
	
	  calculateCurrent() {
	    let voltdiff = this.volts[0] - this.volts[1];
	
	    this.current = (this.pip * Math.exp(-this.pvpp / this.pvt) * (Math.exp(voltdiff / this.pvt) - 1)) +
	        (this.pip * (voltdiff / this.pvp) * Math.exp(1 - (voltdiff / this.pvp))) +
	        (this.piv * Math.exp(voltdiff - this.pvv));
	
	    //console.log("CUR: ", @current)
	
	    return this.current;
	  }
	
	  doStep(stamper) {
	    let voltdiff = this.volts[0] - this.volts[1];
	
	    if (Math.abs(voltdiff - this.lastvoltdiff) > 0.01) {
	      this.getParentCircuit().Solver.converged = false;
	    }
	
	    //console.log(voltdiff + " " + @lastvoltdiff + " " + Math.abs(voltdiff-@lastvoltdiff))
	    voltdiff = this.limitStep(voltdiff, this.lastvoltdiff);
	
	    this.lastvoltdiff = voltdiff;
	
	    let i = (this.pip * Math.exp(-this.pvpp / this.pvt) * (Math.exp(voltdiff / this.pvt) - 1)) +
	        (this.pip * (voltdiff / this.pvp) * Math.exp(1 - (voltdiff / this.pvp))) +
	        (this.piv * Math.exp(voltdiff - this.pvv));
	
	    let geq = ((this.pip * Math.exp(-this.pvpp / this.pvt) * Math.exp(voltdiff / this.pvt)) / this.pvt) +
	        ((this.pip * Math.exp(1 - (voltdiff / this.pvp))) / this.pvp);
	    ((-Math.exp(1 - (voltdiff / this.pvp)) * this.pip * voltdiff) / (this.pvp * this.pvp)) +
	    (Math.exp(voltdiff - this.pvv) * this.piv);
	
	    let nc = i - (geq * voltdiff);
	
	    //console.log("TD: " + geq + ", " + nc)
	    stamper.stampConductance(this.nodes[0], this.nodes[1], geq);
	    return stamper.stampCurrentSource(this.nodes[0], this.nodes[1], nc);
	  }
	}
	
	
	module.exports = TunnelDiodeElm;


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Settings = __webpack_require__(2);
	let Point = __webpack_require__(4);
	let Util = __webpack_require__(5);
	
	// TODO: Extend from Diode?
	class ScrElm extends CircuitComponent {
	  static get Fields() {
	  
	    return {
	      lastvac: {
	        data_type: parseFloat,
	        default_value: 0
	      },
	      lastvag: {
	        data_type: parseFloat,
	        default_value: 0
	      },
	      triggerI: {
	        data_type: parseFloat,
	        default_value: 0.01
	      },
	      holdingI: {
	        data_type: parseFloat,
	        default_value: 0.0082
	      },
	      cresistance: {
	        data_type: parseFloat,
	        default_value: 50
	      }
	    };
	  }
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	
	    this.anode = 0;
	    this.cnode = 1;
	    this.gnode = 2;
	    this.inode = 3;
	    this.hs = 8;
	
	    this.setDefaults();
	
	    this.vt = 0;
	    this.vdcoef = 0;
	    this.fwdrop = 0;
	    this.zvoltage = 0;
	    this.zoffset = 0;
	    this.lastvoltdiff = 0;
	    this.crit = 0;
	    this.leakage = 1e-14;
	
	    this.volts[this.anode] = 0;
	    this.volts[this.cnode] = -this.lastvac;
	    this.volts[this.gnode] = -this.lastvag;
	
	    this.curcount_a = 0;
	    this.curcount_c = 0;
	    this.curcount_g = 0;
	
	    // this.params['volts'] = this.volts;
	
	    // delete this.params['lastvac'];
	    // delete this.params['lastvag'];
	
	    this.setup();
	    //this.setPoints();
	    this.place()
	  }
	
	  place() {
	    let dir = 0;
	    if (Math.abs(this.dx()) > Math.abs(this.dy())) {
	      dir = -Math.sign(this.dx()) * Math.sign(this.dy());
	      this.point2.y = this.point1.y;
	    } else {
	      dir = Math.sign(this.dy()) * Math.sign(this.dx());
	      this.point2.x = this.point1.x;
	    }
	
	    if (dir === 0) {
	      dir = 1;
	    }
	    this.calcLeads(16);
	
	    this.cathode = new Array(2);
	    let pa = new Array(2);
	
	    [pa[0], pa[1]] = Util.interpolateSymmetrical(this.lead1, this.lead2, 0, this.hs);
	    [this.cathode[0], this.cathode[1]] = Util.interpolateSymmetrical(this.lead1, this.lead2, 1, this.hs);
	
	    this.poly = Util.createPolygon(pa[0], pa[1], this.lead2);
	
	    this.gate = new Array(2);
	    let leadlen = (this.dn() - 16) / 2;
	
	    let gatelen = 2*Settings.GRID_SIZE;
	    //gatelen = gatelen + (leadlen % 2*Settings.GRID_SIZE);
	
	    gatelen = 24;
	
	    if (leadlen < gatelen) {
	      this.point2.x = this.point1.x;
	      this.point2.y = this.point1.y;
	      return;
	    }
	
	    dir *= -1;
	    // leadlen /= 3;
	    // console.log("dn", this.dn());
	    // console.log("gatelen", gatelen);
	    // console.log("dir", dir);
	    // console.log("leadlen", leadlen);
	    // console.trace("leadlen");
	
	    this.gate[0] = Util.interpolate(this.lead2, this.point2, gatelen / leadlen, gatelen * dir);
	    this.gate[1] = Util.interpolate(this.lead2, this.point2, gatelen / leadlen, Settings.GRID_SIZE * 4 * dir);
	
	    this.setBboxPt(this.point1, this.point2, this.hs)
	
	
	    /*
	    let gatelen = Settings.GRID_SIZE;
	    gatelen = gatelen + (leadlen % 2*Settings.GRID_SIZE);
	
	    //gatelen = 24;
	
	    if (leadlen < gatelen) {
	      this.point2.x = this.point1.x;
	      this.point2.y = this.point1.y;
	      return;
	    }
	
	    //dir *= -1;
	    // leadlen /= 3;
	    console.log("dn", this.dn());
	    console.log("gatelen", gatelen);
	    console.log("dir", dir);
	    console.log("leadlen", leadlen);
	    console.trace("leadlen");
	
	    this.gate[0] = Util.interpolate(this.lead2, this.point2, 2 * gatelen / leadlen, 2 * gatelen * dir);
	    this.gate[1] = Util.interpolate(this.lead2, this.point2, 2 * gatelen / leadlen, Settings.GRID_SIZE * 4 * dir);
	    */
	
	    this.setBboxPt(this.point1, this.point2, this.hs)
	  }
	
	  nonLinear() {
	    return true;
	  }
	
	  draw(renderContext) {
	    //this.setPoints()
	    this.setBboxPt(this.point1, this.point2, this.hs)
	//    adjustBbox(@gate[0], @gate[1])
	
	    let v1 = this.volts[this.anode];
	    let v2 = this.volts[this.cnode];
	
	    renderContext.drawLeads(this);
	
	    let color = renderContext.getVoltageColor(v1);
	    renderContext.drawThickPolygonP(this.poly, color);
	
	    renderContext.fillCircle(this.gate[0].x, this.gate[0].y, 4, 2, "#00F");
	    renderContext.fillCircle(this.gate[1].x, this.gate[1].y, 4, 2, "#F00");
	    // renderContext.fillCircle(this.lead2.x, this.lead2.y, 4, 2, "#F0F");
	    // renderContext.fillCircle(this.point2.x, this.point2.y, 4, 2, "#FF0");
	
	    // draw thing arrow is pointing to
	    color = renderContext.getVoltageColor(v2);
	    renderContext.drawLinePt(this.cathode[0], this.cathode[1], color);
	
	    renderContext.drawLinePt(this.lead2, this.gate[0], color);
	    renderContext.drawLinePt(this.gate[0], this.gate[1], color);
	
	    this.curcount_a = this.updateDots(null, this.ia);
	    renderContext.drawDots(this.lead2, this.point1, this.curcount_a);
	
	    this.curcount_c = this.updateDots(null, this.ic);
	    renderContext.drawDots(this.point2, this.lead2, this.curcount_c);
	
	    //this.curcount_g = this.updateDots(null, this.ig);
	    // renderContext.drawDots(this.gate[1], this.gate[0], this.curcount_g);
	    // renderContext.drawDots(this.gate[0], this.lead2, this.curcount_g);
	
	
	    renderContext.drawPosts(this);
	
	//    renderContext.drawDots(@gate[0], @lead2, @curcount_g + distance(@gate[1], @gate[0]))
	
	
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      super.debugDraw(renderContext);
	    }
	  }
	
	  setDefaults() {
	    this.leakage = 1e-14;  // Paramter?
	
	    this.cresistance = 50;
	    this.holdingI = .0082;
	    return this.triggerI = .01;
	  }
	
	  getName() {
	    return "Silicon Controlled Rectifier";
	  }
	
	  setup() {
	    this.fwdrop = 0.8;   // Parameter?
	    this.zvoltage = 0;   // zvoltage parameter?
	
	    this.vdcoef = Math.log((1 / this.leakage) + 1) / this.fwdrop;
	
	    this.vt = 1 / this.vdcoef;
	
	    // critical voltage for limiting; current is vt/sqrt(2) at this voltage
	    this.vcrit = this.vt * Math.log(this.vt / (Math.sqrt(2) * this.leakage));
	
	    if (this.zvoltage === 0) {
	      return this.zoffset = 0;
	    } else {
	      // calculate offset which will give us 5mA at zvoltage
	      let i = -0.005;
	      return this.zoffset = this.zvoltage - (Math.log(-(1 + (i / this.leakage))) / this.vdcoef);
	    }
	  }
	
	  reset() {
	    this.volts[this.anode] = this.volts[this.cnode] = this.volts[this.gnode] = 0;
	    this.lastvoltdiff = 0;
	    return this.lastvag = this.lastvac = this.curcount_a = this.curcount_c = this.curcount_g = 0;
	  }
	
	  getPost(n){
	    if (n === 0) {
	      return this.point1;
	    } else {
	      if (n === 1) {
	        return this.point2;
	      } else {
	        return this.gate[1];
	      }
	    }
	  }
	
	  getPostCount() {
	    return 3;
	  }
	
	  getInternalNodeCount() {
	    return 1;
	  }
	
	  getPower() {
	    return ((this.volts[this.anode] - this.volts[this.gnode]) * this.ia) + ((this.volts[this.cnode] - this.volts[this.gnode]) * this.ic);
	  }
	
	  stamp(stamper) {
	    stamper.stampNonLinear(this.nodes[this.anode]);
	    stamper.stampNonLinear(this.nodes[this.cnode]);
	    stamper.stampNonLinear(this.nodes[this.gnode]);
	    stamper.stampNonLinear(this.nodes[this.inode]);
	    stamper.stampResistor(this.nodes[this.gnode], this.nodes[this.cnode], this.cresistance);
	
	//    @diode.stamp(@nodes[@inode], @nodes[@gnode])
	//    @nodes[0] = @nodes[@inode]
	//    @nodes[1] = @nodes[@gnode]
	    stamper.stampNonLinear(this.nodes[this.inode]);
	    return stamper.stampNonLinear(this.nodes[this.gnode]);
	  }
	
	  limitStep(vnew, vold) {
	    let v0;
	    let arg = undefined;
	    let oo = vnew;
	
	    // check new voltage; has current changed by factor of e^2?
	    if ((vnew > this.vcrit) && (Math.abs(vnew - vold) > (this.vt + this.vt))) {
	      if (vold > 0) {
	        arg = 1 + ((vnew - vold) / this.vt);
	        if (arg > 0) {
	          // adjust vnew so that the current is the same
	          // as in linearized model from previous iteration.
	          // current at vnew = old current * arg
	          vnew = vold + (this.vt * Math.log(arg));
	
	          // current at v0 = 1uA
	          v0 = Math.log(1e-6 / this.leakage) * this.vt;
	          vnew = Math.max(v0, vnew);
	        } else {
	          vnew = this.vcrit;
	        }
	      } else {
	        // adjust vnew so that the current is the same
	        // as in linearized model from previous iteration.
	        // (1/vt = slope of load line)
	        vnew = this.vt * Math.log(vnew / this.vt);
	      }
	      this.getParentCircuit().Solver.converged = false;
	
	    } else if ((vnew < 0) && (this.zoffset !== 0)) {
	      // for Zener breakdown, use the same logic but translate the values
	      vnew = -vnew - this.zoffset;
	      vold = -vold - this.zoffset;
	      if ((vnew > this.vcrit) && (Math.abs(vnew - vold) > (this.vt + this.vt))) {
	        if (vold > 0) {
	          arg = 1 + ((vnew - vold) / this.vt);
	          if (arg > 0) {
	            vnew = vold + (this.vt * Math.log(arg));
	            v0 = Math.log(1e-6 / this.leakage) * this.vt;
	            vnew = Math.max(v0, vnew);
	
	          } else {
	            vnew = this.vcrit;
	          }
	        } else {
	          vnew = this.vt * Math.log(vnew / this.vt);
	        }
	        this.getParentCircuit().Solver.converged = false;
	      }
	      vnew = -(vnew + this.zoffset);
	    }
	    return vnew;
	  }
	
	
	  doStep(stamper) {
	    let geq, nc;
	    this.vac = this.volts[this.anode] - this.volts[this.cnode];
	    this.vag = this.volts[this.anode] - this.volts[this.gnode];
	
	    if ((Math.abs(this.vac - this.lastvac) > .01) || (Math.abs(this.vag - this.lastvag) > 0.01)) {
	      this.getParentCircuit().converged = false;
	    }
	
	    this.lastvac = this.vac;
	    this.lastvag = this.vag;
	
	    // diode.doStep(@volts[@inode] - @volts[@gnode])
	
	    let voltdiff = this.volts[this.inode] - this.volts[this.gnode];
	
	    //# ------------------------------------------------------
	    // DIODE BEHAVIOR
	    // TODO: DRY WITH DIODE ELM
	    //# ------------------------------------------------------
	
	    if (Math.abs(voltdiff - this.lastvoltdiff) > .01) {
	      this.getParentCircuit().Solver.converged = false;
	    }
	
	    voltdiff = this.limitStep(voltdiff, this.lastvoltdiff);
	
	    this.lastvoltdiff = voltdiff;
	
	    if ((voltdiff >= 0) || (this.zvoltage === 0)) {
	      // regular diode or forward-biased zener
	      let eval_ = Math.exp(voltdiff * this.vdcoef);
	
	      // make diode linear with negative voltages; aids convergence
	      if (voltdiff < 0) { eval_ = 1; }
	      geq = this.vdcoef * this.leakage * eval_;
	      nc = ((eval_ - 1) * this.leakage) - (geq * voltdiff);
	
	      stamper.stampConductance(this.nodes[this.inode], this.nodes[this.gnode], geq);
	      stamper.stampCurrentSource(this.nodes[this.inode], this.nodes[this.gnode], nc);
	    } else {
	      let exp0 = Math.exp(voltdiff * this.vdcoef);
	      let exp1 = Math.exp((-voltdiff - this.zoffset) * this.vdcoef);
	
	      geq =  this.leakage * (exp0 + exp1) * this.vdcoef;
	      nc =   (this.leakage * (exp0 - exp1 - 1)) + (geq * -voltdiff);
	
	      stamper.stampConductance(this.nodes[this.inode], this.nodes[this.gnode], geq);
	      stamper.stampCurrentSource(this.nodes[this.inode], this.nodes[this.gnode], nc);
	    }
	
	    //# ------------------------------------------------------
	    // END DIODE BEHAVIOR
	    //# ------------------------------------------------------
	
	
	    let icmult = 1 / this.triggerI;
	    let iamult = (1 / this.holdingI) - icmult;
	
	    this.aresistance = (((-icmult * this.ic) + (this.ia * iamult)) > 1) ? 0.0105 : 10e5;
	
	    return stamper.stampResistor(this.nodes[this.anode], this.nodes[this.inode], this.aresistance);
	  }
	
	  calculateCurrent() {
	    this.ic = (this.volts[this.cnode] - this.volts[this.gnode]) / this.cresistance;
	    this.ia = (this.volts[this.anode] - this.volts[this.inode]) / this.aresistance;
	    this.ig = -this.ic - this.ia;
	  }
	}
	ScrElm.initClass();
	
	module.exports = ScrElm;

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Util = __webpack_require__(5);
	let Settings = __webpack_require__(2);
	
	class TriodeElm extends CircuitComponent {
	  static get Fields() {
	    return {
	      mu: {
	        name: "Mu",
	        data_type: parseFloat,
	        default_value: 93
	      },
	      kg1: {
	        name: "kg1",
	        data_type: parseFloat,
	        default_value: 680
	      }
	    };
	  }
	
	  constructor(xa, xb, ya, yb, params, f) {
	    super(xa, xb, ya, yb, params, f);
	
	    this.gridCurrentR = 6000;
	
	    this.setup();
	    this.place();
	  }
	
	  setup() {
	    return this.noDiagonal = true;
	  }
	
	  getName() {
	    return "Triode"
	  }
	
	  nonLinear() {
	    return true;
	  }
	
	  reset() {
	    this.volts[0] = 0;
	    this.volts[1] = 0;
	    this.volts[2] = 0;
	    return this.curcount = 0;
	  }
	
	  getPost(n) {
	    if (n === 0) {
	      return this.plate[0];
	    } else {
	      if (n === 1) {
	        return this.grid[0];
	      } else {
	        return this.cath[0];
	      }
	    }
	  }
	
	  draw(renderContext) {
	    //this.setBbox(this.point1, this.plate[0], 16);
	
	    renderContext.fillCircle(this.point2.x, this.point2.y, this.circler, Settings.LINE_WIDTH, Settings.FG_COLOR, Settings.STROKE_COLOR);
	
	    //this.setBbox(this.cath[0].x, this.cath[1].y, this.point2.x + this.circler, this.point2.y + this.circler);
	
	    //setPowerColor(g, true);
	    // draw plate
	
	    let color  = renderContext.getVoltageColor(this.volts[0]);
	
	    renderContext.drawLinePt(this.plate[0], this.plate[1], color);
	    renderContext.drawLinePt(this.plate[2], this.plate[3], color);
	
	    // draw grid
	    color = renderContext.getVoltageColor(this.volts[1]);
	
	    for (let i = 0; i != 8; i += 2) {
	      renderContext.drawLinePt(this.grid[i], this.grid[i + 1], color);
	    }
	    // draw cathode
	    color = renderContext.getVoltageColor(this.volts[2]);
	
	    for (let i = 0; i != 3; i++) {
	      renderContext.drawLinePt(this.cath[i], this.cath[i + 1], color);
	    }
	
	    // draw dots
	    /*
	    curcountp = updateDotCount(currentp, curcountp);
	    curcountc = updateDotCount(currentc, curcountc);
	    curcountg = updateDotCount(currentg, curcountg);
	    if (sim.dragElm != this) {
	      drawDots(g, plate[0], midgrid, curcountp);
	      drawDots(g, midgrid, midcath, curcountc);
	      drawDots(g, midcath, cath[1], curcountc + 8);
	      drawDots(g, cath[1], cath[0], curcountc + 8);
	      drawDots(g, point1, midgrid, curcountg);
	    }
	    */
	    renderContext.drawPosts(this);
	
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      super.debugDraw(renderContext);
	    }
	  }
	
	  getPostCount() {
	    return 3;
	  }
	
	  nonLinear() {
	    return true;
	  }
	
	  getPower() {
	    return (this.volts[0] - this.volts[2]) * this.current;
	  }
	
	  place() {
	    this.plate = new Array(4);
	    this.grid = new Array(8);
	    this.cath = new Array(4);
	
	    this.grid[0] = this.point1;
	
	    let nearw = 8;
	    let farw = 32;
	    let platew = 18;
	
	    this.plate[1] = Util.interpolate(this.point1, this.point2, 1, nearw);
	    this.plate[0] = Util.interpolate(this.point1, this.point2, 1, farw);
	    [this.plate[2], this.plate[3]] = Util.interpolateSymmetrical(this.point2, this.plate[1], 1, platew);
	
	    let circler = 24;
	    this.circler = circler;
	    this.grid[1] = Util.interpolate(this.point1, this.point2, (this.dn() - this.circler) / this.dn(), 0);
	
	    for (let i = 0; i < 3; i++) {
	      this.grid[2 + (i * 2)] = Util.interpolate(this.grid[1], this.point2, ((i * 3) + 1) / 4.5, 0);
	      this.grid[3 + (i * 2)] = Util.interpolate(this.grid[1], this.point2, ((i * 3) + 2) / 4.5, 0);
	    }
	
	    this.midgrid = this.point2;
	
	    let cathw = 16;
	    this.midcath = Util.interpolate(this.point1, this.point2, 1, -nearw);
	
	    [this.cath[1], this.cath[2]] = Util.interpolateSymmetrical(this.point2, this.plate[1], -1, cathw);
	    this.cath[3] = Util.interpolate(this.point2, this.plate[1], -1.2, -cathw);
	    this.cath[0] = Util.interpolate(this.point2, this.plate[1], Math.floor(-farw / nearw), cathw);
	
	    let yMin = this.plate[0].y;
	    let yMax = this.cath[0].y;
	    let xMin = this.grid[0].x;
	    let xMax = this.cath[0].x;
	    // this.setBbox(xMin, xMax, yMin, yMax);
	
	    // this.setBbox(this.point1.x, this.plate[0].y, this.point2.x + this.circler, this.point2.y + this.circler);
	    this.setBboxPt(this.point1, this.grid[this.grid.length - 1], 2*this.circler);
	    //this.setBbox(352, 232, 384, 248)
	  }
	
	  stamp(stamper) {
	    stamper.stampNonLinear(this.nodes[0]);
	    stamper.stampNonLinear(this.nodes[1]);
	    return stamper.stampNonLinear(this.nodes[2]);
	  }
	
	  getConnection(n1, n2) {
	    return !((n1 === 1) || (n2 === 1));
	  }
	
	  doStep(stamper) {
	    let vs = new Array(3);
	
	    vs[0] = this.volts[0];
	    vs[1] = this.volts[1];
	    vs[2] = this.volts[2];
	
	    if (vs[1] > (this.lastv1 + 0.5)) {
	      vs[1] = this.lastv1 + 0.5;
	    }
	    if (vs[1] < (this.lastv1 - 0.5)) {
	      vs[1] = this.lastv1 - 0.5;
	    }
	    if (vs[2] > (this.lastv2 + 0.5)) {
	      vs[2] = this.lastv2 + 0.5;
	    }
	    if (vs[2] < (this.lastv2 - 0.5)) {
	      vs[2] = this.lastv2 - 0.5;
	    }
	
	    let grid = 1;
	    let cath = 2;
	    let plate = 0;
	
	    let vgk = vs[grid] - vs[cath];
	    let vpk = vs[plate] - vs[cath];
	
	    if ((Math.abs(this.lastv0 - vs[0]) > .01) || (Math.abs(this.lastv1 - vs[1]) > .01) || (Math.abs(this.lastv2 - vs[2]) > .01)) {
	      this.getParentCircuit().Solver.converged = false;
	    }
	
	    this.lastv0 = vs[0];
	    this.lastv1 = vs[1];
	    this.lastv2 = vs[2];
	
	    let ids = 0;
	    let gm = 0;
	    let Gds = 0;
	    let ival = vgk + (vpk / this.mu);
	
	    this.currentg = 0;
	
	    if (vgk > .01) {
	      stamper.stampResistor(this.nodes[grid], this.nodes[cath], this.gridCurrentR);
	      this.currentg = vgk / this.gridCurrentR;
	    }
	
	    if (ival < 0) {
	      Gds = 1e-8;
	      ids = vpk * Gds;
	    } else {
	      ids = Math.pow(ival, 1.5) / this.kg1;
	      let q = (1.5 * Math.sqrt(ival)) / this.kg1;
	      // gm = dids/dgk
	      // Gds = dids/dpk
	      Gds = q;
	      gm = q / this.mu;
	    }
	
	    this.currentp = ids;
	    this.currentc = ids + this.currentg;
	    
	    let rs = -ids + (Gds * vpk) + (gm * vgk);
	    
	    stamper.stampMatrix(this.nodes[plate], this.nodes[plate], Gds);
	    stamper.stampMatrix(this.nodes[plate], this.nodes[cath], -Gds - gm);
	    stamper.stampMatrix(this.nodes[plate], this.nodes[grid], gm);
	
	    stamper.stampMatrix(this.nodes[cath], this.nodes[plate], -Gds);
	    stamper.stampMatrix(this.nodes[cath], this.nodes[cath], Gds + gm);
	    stamper.stampMatrix(this.nodes[cath], this.nodes[grid], -gm);
	
	    stamper.stampRightSide(this.nodes[plate], rs);
	    return stamper.stampRightSide(this.nodes[cath], -rs);
	  }
	}
	TriodeElm.initClass();
	
	module.exports = TriodeElm;


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	let ChipElm = __webpack_require__(57);
	
	class DecadeElm extends ChipElm {
	
	  constructor(xa, xb, ya, yb, params, f) {
	    params = params || {"bits": 2, "volts": [0, 0, 0, 0]};
	
	    super(xa, xb, ya, yb, params, f);
	  }
	
	  getName() {
	    return "Decade counter";
	  }
	
	  needsBits() {
	    return true;
	  }
	
	  getPostCount() {
	    return this.bits + 2;
	  }
	
	  getVoltageSourceCount() {
	    return this.bits;
	  }
	
	  setupPins() {
	    this.sizeX = this.bits > 2 ? this.bits : 2;
	    this.sizeY = 2;
	
	    this.pins = new Array(this.getPostCount());
	
	    this.pins[0] = new ChipElm.Pin(1, ChipElm.SIDE_W, "");
	    this.pins[0].clock = true;
	    this.pins[1] = new ChipElm.Pin(this.sizeX - 1, ChipElm.SIDE_S, "R");
	    this.pins[1].bubble = true;
	
	    for (let i = 0; i < this.bits; i++) {
	      let ii = i + 2;
	      this.pins[ii] = new ChipElm.Pin(i, ChipElm.SIDE_N, `Q${i}`);
	      this.pins[ii].output = this.pins[ii].state = true;
	    }
	
	    this.allocNodes();
	  }
	
	  execute() {
	    let i;
	    if (this.pins[0].value && !this.lastClock) {
	      for (i = 0, end = this.bits, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
	        var asc, end;
	        if (this.pins[i + 2].value) {
	          break;
	        }
	      }
	
	      if (i < this.bits) {
	        this.pins[i++ + 2].value = false;
	      }
	
	      i %= this.bits;
	
	      this.pins[i + 2].value = true;
	    }
	
	    if (!this.pins[1].value) {
	      for (i = 1, end1 = this.bits, asc1 = 1 <= end1; asc1 ? i < end1 : i > end1; asc1 ? i++ : i--) {
	        var asc1, end1;
	        this.pins[i + 2].value = false;
	      }
	
	      this.pins[2].value = true;
	    }
	
	    return this.lastClock = this.pins[0].value;
	  }
	}
	
	module.exports = DecadeElm;


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Util = __webpack_require__(5);
	let Point = __webpack_require__(4);
	let Settings = __webpack_require__(2);
	
	let self = undefined;
	let Pin = undefined;
	class ChipElm extends CircuitComponent {
	
	  static get Fields() {
	    return {
	      "bits": {
	        name: "Number of Bits",
	        default_value: 4,
	        data_type: (v) => {v},
	        range: [0, Infinity]
	      },
	      "volts": {
	        name: "Volts",
	        description: "Initial voltages on output",
	        unit: "Volts",
	        default_value: 0,
	        symbol: "V",
	        data_type: (v) => {v},
	        range: [0, Infinity]
	      }
	    };
	  }
	
	  static initClass() {
	    this.FLAG_SMALL = 1;
	    this.FLAG_FLIP_X = 1024;
	    this.FLAG_FLIP_Y = 2148;
	  
	    this.SIDE_N = 0;
	    this.SIDE_S = 1;
	    this.SIDE_W = 2;
	    this.SIDE_E = 3;
	
	    self = null;
	  
	    Pin = class Pin {
	      constructor(pos, side, text) {
	        this.pos = pos;
	        this.side = side;
	        this.text = text;
	        this.post = null;
	        this.stub = null;
	        this.textloc = null;
	        this.voltSource = 0;
	        this.bubbleX = 0;
	        this.bubbleY = 0;
	  
	        this.lineOver = false;
	        this.bubble = false;
	        this.clock = false;
	        this.output = false;
	        this.value = false;
	        this.state = false;
	  
	        this.curcount = 0;
	        this.current = 0;
	      }
	  
	      updateDots(currentMult=1, ds = Settings.CURRENT_SEGMENT_LENGTH) {
	        if (!this.curcount) { this.curcount = 0; }
	  
	        let currentIncrement = this.current * currentMult;
	  
	        this.curcount = (this.curcount + currentIncrement) % ds;
	        if (this.curcount < 0) { this.curcount += ds; }
	  
	        return this.curcount;
	      }
	  
	      getName() {
	        return self.getName();
	      }
	  
	      setPoint(px, py, dx, dy, dax, day, sx, sy) {
	        if ((self.flags & ChipElm.FLAG_FLIP_X) !== 0) {
	          dx = -dx;
	          dax = -dax;
	          px += self.cspc2 * (self.sizeX - 1);
	          sx = -sx;
	        }
	  
	        if ((self.flags & ChipElm.FLAG_FLIP_Y) !== 0) {
	          dy = -dy;
	          day = -day;
	          py += self.cspc2 * (self.sizeY - 1);
	          sy = -sy;
	        }
	  
	        let xa = Math.floor(px + (self.cspc2 * dx * this.pos) + sx);
	        let ya = Math.floor(py + (self.cspc2 * dy * this.pos) + sy);
	  
	        this.post = new Point(xa + (dax * self.cspc2), ya + (day * self.cspc2));
	        this.stub = new Point(xa + (dax * self.cspc), ya + (day * self.cspc));
	
	        this.textloc = new Point(xa, ya);
	  
	        if (this.bubble) {
	          this.bubbleX = xa + (dax * 10 * self.csize);
	          this.bubbleY = ya + (day * 10 * self.csize);
	        }
	  
	        if (this.clock) {
	          let clockPointsX = new Array(3);
	          let clockPointsY = new Array(3);
	  
	          clockPointsX[0] = (xa + (dax * self.cspc)) - ((dx * self.cspc) / 2);
	          clockPointsY[0] = (ya + (day * self.cspc)) - ((dy * self.cspc) / 2);
	          clockPointsX[1] = xa;
	          clockPointsY[1] = ya;
	          clockPointsX[2] = xa + (dax * self.cspc) + ((dx * self.cspc) / 2);
	          return clockPointsY[2] = ya + (day * self.cspc) + ((dy * self.cspc) / 2);
	        }
	      }
	  
	      toJson() {
	        return {
	          post: this.post,
	          stub: this.stub,
	          textloc: this.textloc,
	          pos: this.pos,
	          side: this.side,
	          voltSource: this.voltSource,
	          bubbleX: this.bubbleX,
	          bubbleY: this.bubbleY,
	          text: this.text,
	          lineOver: this.lineOver,
	          bubble: this.bubble,
	          clock: this.clock,
	          output: this.output,
	          value: this.value,
	          state: this.state
	        };
	      }
	
	      toString() {
	        return this.pos + " " + this.side + " " + this.text;
	      }
	    };
	
	    this.Pin = Pin;
	  }
	
	  getCenter() {
	    let minX = Math.min(...this.rectPointsX);
	    let maxX = Math.max(...this.rectPointsX);
	    let minY = Math.min(...this.rectPointsY);
	    let maxY = Math.max(...this.rectPointsY);
	
	    return new Point((maxX + minX) / 2.0, (maxY + minY) / 2.0);
	  }
	
	  constructor(xa, xb, ya, yb, params, f) {
	    params = params || {};
	    
	    super(xa, xb, ya, yb, {}, f);
	
	    this.flags = f;
	
	    this.setSize(((f & ChipElm.FLAG_SMALL) !== 0) ? 1 : 2);
	    
	    // TODO: Needs cleanup 
	    if (params['volts']) {
	      this.params.volts = params["volts"].slice();
	    }
	
	    if (this.needsBits()) {
	      this.bits = parseInt(params['bits']);
	      this.params['bits'] = this.bits;
	    }
	
	    self = this;
	    this.setupPins();
	    this._setPoints();
	
	    for (let i=0; i<this.getPostCount(); ++i) {
	      if (this.pins[i].state) {
	        this.volts[i] = parseFloat(params['volts'].shift());
	        this.pins[i].value = (this.volts[i] > 2.5);
	      }
	    }
	
	    this.noDiagonal = true;
	  }
	
	  setPoints(x1, y1, x2, y2) {
	    if (!x1 || !y1)
	      console.trace("No x1, y1 location for ", this.getName());
	
	    if (!x2 || !y2)
	      console.trace("No x2, y2 location for ", this.getName());
	
	    if (!this.point1)
	      this.point1 = new Point(x1, y1);
	
	    if (!this.point2)
	      this.point2 = new Point(x2, y2);
	  }
	
	  inspect() {
	    let paramValues = ((() => {
	      let result = [];
	      for (let key in this.params) {
	        let val = this.params[key];
	        result.push(val);
	      }
	      return result;
	    })());
	
	    return {
	      name: this.constructor.name,
	      x1: this.point1.x,
	      y1: this.point1.y,
	      x2: this.point2.x,
	      y2: this.point2.y,
	
	      csize: this.csize,
	      cspc: this.cspc,
	      cspc2: this.cspc2,
	      flags: this.flags,
	      pins: this.pins,
	      params: paramValues,
	      voltage: this.getVoltageDiff(),
	      current: this.getCurrent()
	    };
	  }
	
	  setupPins() {
	    return console.trace("setupPins() to be called from subclasses of ChipElm");
	  }
	
	  execute() {
	    // return console.trace("execute() to be called from subclasses of ChipElm");
	  }
	
	  getVoltageSourceCount() {
	    return console.warn("getVoltageSourceCount() to be called from subclasses of ChipElm");
	  }
	
	  getChipName() {
	    return console.trace("getChipName() to be called from subclasses of ChipElm");
	  }
	
	  getConnection(n1, n2) {
	    return false;
	  }
	
	  hasGroundConnection(n1) {
	    return this.pins[n1].output;
	  }
	
	  reset() {
	    for (let i = 0; i < this.getPostCount(); i++) {
	      this.pins[i].value = false;
	      this.pins[i].curcount = 0;
	      this.volts[i] = 0;
	    }
	
	    return this.lastClock = false;
	  }
	
	  needsBits() {
	    return false;
	  }
	
	  setSize(s) {
	    this.csize = s;
	    this.cspc = 8 * s;
	    this.cspc2 = this.cspc * 2;
	    this.flags = this.flags & ~ChipElm.FLAG_SMALL;
	    return this.flags = this.flags | ((s === 1) ? ChipElm.FLAG_SMALL : 0);
	  }
	
	  getPost(n) {
	    return this.pins[n].post;
	  }
	
	  setCurrent(x, c) {
	    for (let i = 0; i < this.getPostCount(); ++i) {
	      let pin = this.pins[i];
	
	      if (pin.output && (pin.voltSource === x)) {
	        pin.current = c;
	      }
	    }
	  }
	
	  setVoltageSource(j, vs) {
	    for (let i = 0; i < this.getPostCount(); ++i) {
	      let p = this.pins[i];
	      if ((p.output && j--) === 0) {
	        p.voltSource = vs;
	        return;
	      }
	    }
	
	    return console.log(`setVoltageSource failed for ${this}${`j=${j}, vs=${vs}   ${this.toJson()}`}`);
	  }
	
	  doStep(stamper) {
	    let i, p;
	    for (let i = 0; i < this.getPostCount(); ++i) {
	      p = this.pins[i];
	      if (!p.output) {
	        p.value = this.volts[i] > 2.5;
	      }
	    }
	
	    this.execute();
	
	    let result = [];
	    for (let i = 0; i < this.getPostCount(); ++i) {
	      p = this.pins[i];
	      if (p.output) {
	        stamper.updateVoltageSource(0, this.nodes[i], p.voltSource, p.value ? 5 : 0);
	      }
	    }
	  }
	
	  stamp(stamper) {
	    // this.setBbox(Math.min(...this.rectPointsX), Math.min(...this.rectPointsY), Math.max(...this.rectPointsX), Math.max(...this.rectPointsY));
	
	    for (let i = 0; i < this.getPostCount(); ++i) {
	      let p = this.pins[i];
	
	      if (p.output) {
	        stamper.stampVoltageSource(0, this.nodes[i], p.voltSource);
	      }
	    }
	  }
	
	  draw(renderContext) {
	    this.drawChip(renderContext);
	  }
	
	  drawChip(renderContext) {
	    //let i;
	    // this.setBbox(Math.min(...this.rectPointsX), Math.min(...this.rectPointsY), Math.max(...this.rectPointsX), Math.max(...this.rectPointsY));
	    renderContext.drawThickPolygon(this.rectPointsX, this.rectPointsY, Settings.STROKE_COLOR);
	
	    for (let i = 0; i < this.getPostCount(); i++) {
	
	      if (this.pins[i]) {
	        let p = this.pins[i];
	
	        let voltageColor = renderContext.getVoltageColor(this.volts[i]);
	
	        let a = p.post;
	        let b = p.stub;
	
	        renderContext.drawLinePt(a, b, voltageColor);
	
	        p.updateDots(this.Circuit.Params.getCurrentMult());
	
	        renderContext.drawDots(b, a, p);
	
	        if (p.bubble) {
	          renderContext.fillCircle(p.bubbleX, p.bubbleY, 1, Settings.FILL_COLOR);
	        }
	
	        let textSize = this.csize == 1 ? 6 : 8;
	
	        let mt = renderContext.context.measureText(p.text);
	        renderContext.fillText(p.text, p.textloc.x-mt.width/2, p.textloc.y+3, Settings.PIN_LABEL_COLOR, textSize);
	
	        if (p.lineOver) {
	          let ya = p.textloc.y - renderContext.context.measureText(p.text).height;
	          let textWidth = renderContext.context.measureText(p.text).width + 2;
	          renderContext.drawLine(p.textloc.x, ya, p.textloc.x + textWidth, ya);
	        }
	      }
	    }
	
	    if (this.clockPointsX && this.clockPointsY) {
	      renderContext.drawPolyline(this.clockPointsX, this.clockPointsY, 3);
	    }
	
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      return super.debugDraw(renderContext);
	    }
	
	
	    for (let i = 0; i < this.getPostCount(); ++i) {
	      renderContext.drawPost(this.pins[i].post.x, this.pins[i].post.y, this.nodes[i]);
	    }
	  }
	
	  recomputeBounds() {
	
	  }
	
	  _setPoints() {
	//    if @x2 - @x1 > @sizeX*@cspc2 # dragging
	//      @setSize(2)
	
	    // super.setPoints(...arguments);
	
	    let hs = this.cspc2;
	    let x0 = this.point1.x + this.cspc2;
	    let y0 = this.point1.y;
	
	    let xr = x0 - this.cspc;
	    let yr = y0 - this.cspc;
	    let xs = this.sizeX * this.cspc2;
	    let ys = this.sizeY * this.cspc2;
	
	    this.rectPointsX = [xr, xr + xs, xr + xs, xr];
	    this.rectPointsY = [yr, yr, yr + ys, yr + ys];
	
	    this.setBbox(xr, yr, this.rectPointsX[2], this.rectPointsY[2]);
	
	    for (let i = 0; i < this.getPostCount(); i++) {
	      let p = this.pins[i];
	
	      if (!p) {
	        console.error(`Cannot set pin at index ${i} because it is not defined (bits: ${this.bits})`);
	        return;
	      }
	
	      if (i >= this.pins.length) {
	        console.error(`Pin index out of bounds: ${i}. @pins is length ${this.pins.length} but there are ${this.getPostCount()} posts`);
	        return;
	      }
	
	      if (p.side === ChipElm.SIDE_N) {
	        p.setPoint(x0, y0, 1, 0, 0, -1, 0, 0);
	      } else if (p.side === ChipElm.SIDE_S) {
	        p.setPoint(x0, y0, 1, 0, 0, 1, 0, ys - this.cspc2);
	      } else if (p.side === ChipElm.SIDE_W) {
	        p.setPoint(x0, y0, 0, 1, -1, 0, 0, 0);
	      } else if (p.side === ChipElm.SIDE_E) {
	        p.setPoint(x0, y0, 0, 1, 1, 0, xs - this.cspc2, 0);
	      }
	    }
	
	    this.setBbox(Math.min(...this.rectPointsX), Math.min(...this.rectPointsY), Math.max(...this.rectPointsX), Math.max(...this.rectPointsY));
	  }
	
	  toJson() {
	    let baseJson = super.toJson();
	
	    baseJson['bits'] = this.bits;
	    baseJson['pins'] = this.pins.map(pin => pin.toJson());
	
	    return baseJson;
	  }
	}
	ChipElm.initClass();
	
	module.exports = ChipElm;


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let ChipElm = __webpack_require__(57);
	let Util = __webpack_require__(5);
	
	class LatchElm extends ChipElm {
	
	  constructor(xa, xb, ya, yb, params, f) {
	    params = params || {"bits": 2, "volts": [0, 0, 0, 0, 0]};
	
	    super(xa, xb, ya, yb, params, f);
	    
	    this.lastLoad = false;
	    this.loadPin = 0;
	  }
	
	  getName() {
	    return "Latch";
	  }
	
	  needsBits() {
	    return true;
	  }
	
	  getPostCount() {
	    return (this.bits * 2) + 1;
	  }
	
	  getVoltageSourceCount() {
	    return this.bits;
	  }
	
	  setupPins() {
	    let i;
	    this.sizeX = 2;
	    this.sizeY = this.bits + 1;
	    this.pins = new Array(this.getPostCount());
	
	    for (i = 0; i < this.bits; i++) {
	      this.pins[i] = new ChipElm.Pin(this.bits - 1 - i, ChipElm.SIDE_W, `I${i}`);
	    }
	
	    for (i = 0; i < this.bits; i++) {
	      this.pins[i + this.bits] = new ChipElm.Pin(this.bits - 1 - i, ChipElm.SIDE_E, "O");
	      this.pins[i + this.bits].output = true;
	    }
	
	    this.loadPin = this.bits * 2;
	    this.pins[this.loadPin] = new ChipElm.Pin(this.bits, ChipElm.SIDE_W, "Ld");
	
	    return this.allocNodes();
	  }
	
	  execute() {
	    if (this.pins[this.loadPin].value && !this.lastLoad) {
	      for (let i = 0; i < this.bits; i++) {
	        this.pins[i + this.bits].value = this.pins[i].value;
	      }
	    }
	
	    return this.lastLoad = this.pins[this.loadPin].value;
	  }
	}
	
	
	module.exports = LatchElm;


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let ChipElm = __webpack_require__(57);
	let Util = __webpack_require__(5);
	let Settings = __webpack_require__(2);
	
	class TimerElm extends ChipElm {
	  static initClass() {
	    this.FLAG_RESET = 2;
	    this.N_DIS = 0;
	    this.N_TRIG = 1;
	    this.N_THRES = 2;
	    this.N_VIN = 3;
	    this.N_CTL = 4;
	    this.N_OUT = 5;
	    this.N_RST = 6;
	  }
	
	  /*
	  static get Fields() {
	    return {
	      "volts": {
	        name: "Volts",
	        description: "Current multiplier",
	        default_value: -1,
	        data_type: Math.sign,
	
	        field_type: "select",
	        select_values: {"NPN": -1, "PNP": 1}
	      }
	    }
	  }
	  */
	
	  constructor(xa, xb, ya, yb, params = {volts: [0.0], bits: [0]}, f = "0") {
	    super(xa, xb, ya, yb, params, f);
	  }
	
	  getName() {
	    return "555 Timer";
	  }
	
	  getPostCount() {
	    if (this.hasReset()) {
	      return 7;
	    } else {
	      return 6;
	    }
	  }
	
	  getVoltageSourceCount() {
	    return 1;
	  }
	
	  nonLinear() {
	    return true;
	  }
	
	  hasReset() {
	    return (this.flags & TimerElm.FLAG_RESET) !== 0;
	  }
	
	  draw(renderContext) {
	    //this.setPoints();
	    this.drawChip(renderContext);
	
	    let textSize = this.csize == 1 ? 8 : 11;
	
	    renderContext.fillText("555", this.getCenter().x - 14, this.getCenter().y, Settings.LABEL_COLOR, textSize)
	  }
	
	  setupPins() {
	    this.sizeX = 3;
	    this.sizeY = 5;
	
	    this.pins = new Array(7);
	    this.pins[TimerElm.N_DIS] = new ChipElm.Pin(1, TimerElm.SIDE_W, "dis");
	    this.pins[TimerElm.N_TRIG] = new ChipElm.Pin(3, TimerElm.SIDE_W, "tr");
	    this.pins[TimerElm.N_TRIG].lineOver = true;
	    this.pins[TimerElm.N_THRES] = new ChipElm.Pin(4, TimerElm.SIDE_W, "th");
	    this.pins[TimerElm.N_VIN] = new ChipElm.Pin(1, TimerElm.SIDE_N, "Vin");
	    this.pins[TimerElm.N_CTL] = new ChipElm.Pin(1, TimerElm.SIDE_S, "ctl");
	    this.pins[TimerElm.N_OUT] = new ChipElm.Pin(2, TimerElm.SIDE_E, "out");
	    this.pins[TimerElm.N_OUT].output = this.pins[TimerElm.N_OUT].state = true;
	    return this.pins[TimerElm.N_RST] = new ChipElm.Pin(1, TimerElm.SIDE_E, "rst");
	  }
	
	  stamp(stamper) {
	    // stamp voltage divider to put ctl pin at 2/3 V
	    stamper.stampResistor(this.nodes[TimerElm.N_VIN], this.nodes[TimerElm.N_CTL], 5000);
	    stamper.stampResistor(this.nodes[TimerElm.N_CTL], 0, 10000);
	
	    // output pin
	    stamper.stampVoltageSource(0, this.nodes[TimerElm.N_OUT], this.pins[TimerElm.N_OUT].voltSource);
	
	    // discharge pin
	    return stamper.stampNonLinear(this.nodes[TimerElm.N_DIS]);
	  }
	
	  startIteration() {
	    this.out = this.volts[TimerElm.N_OUT] > (this.volts[TimerElm.N_VIN] / 2);
	
	    this.setOut = false;
	
	    if ((this.volts[TimerElm.N_CTL] / 2) > this.volts[TimerElm.N_TRIG]) {
	      this.setOut = this.out = true;
	    }
	
	    if ((this.volts[TimerElm.N_THRES] > this.volts[TimerElm.N_CTL]) || (this.hasReset() && (this.volts[TimerElm.N_RST] < 0.7))) {
	      return this.out = false;
	    }
	  }
	
	  doStep(stamper) {
	    let output = this.out ? this.volts[TimerElm.N_VIN] : 0;
	
	    if (!this.out && !this.setOut) {
	      stamper.stampResistor(this.nodes[TimerElm.N_DIS], 0, 10);
	    }
	
	    return stamper.updateVoltageSource(0, this.nodes[TimerElm.N_OUT], this.pins[TimerElm.N_OUT].voltSource, output);
	  }
	
	  calculateCurrent() {
	    this.pins[TimerElm.N_VIN].current = (this.volts[TimerElm.N_CTL] - this.volts[TimerElm.N_VIN]) / 5000;
	    this.pins[TimerElm.N_CTL].current = (-this.volts[TimerElm.N_CTL] / 10000) - this.pins[TimerElm.N_VIN].current;
	
	    let discharge_current = (!this.out && !this.setOut) ?
	      -this.volts[TimerElm.N_DIS] / 10
	    :
	      0;
	
	    return this.pins[TimerElm.N_DIS].current = discharge_current;
	  }
	}
	TimerElm.initClass();
	
	module.exports = TimerElm;


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let ChipElm = __webpack_require__(57);
	let Util = __webpack_require__(5);
	
	class JkFlipFlopElm extends ChipElm {
	
	  constructor(xa, xb, ya, yb, params, f) {
	    // Set [4] as default value for params['volts']
	    params = params || {};
	    params['volts'] = params['volts'] || [4];
	
	    super(xa, xb, ya, yb, params, f);
	
	    this.pins[4].value = !this.pins[3].value;
	  }
	
	  getName() {
	    return "JK flip-flop";
	  }
	
	  getPostCount() {
	    return 5;
	  }
	
	  getVoltageSourceCount() {
	    return 2;
	  }
	
	  setupPins() {
	    this.sizeX = 2;
	    this.sizeY = 3;
	
	    this.pins = new Array(5);
	    this.pins[0] = new ChipElm.Pin(0, ChipElm.SIDE_W, "J");
	    this.pins[1] = new ChipElm.Pin(1, ChipElm.SIDE_W, "");
	    this.pins[1].clock = true;
	    this.pins[1].bubble = true;
	    this.pins[2] = new ChipElm.Pin(2, ChipElm.SIDE_W, "K");
	    this.pins[3] = new ChipElm.Pin(0, ChipElm.SIDE_E, "Q");
	    this.pins[3].output = this.pins[3].state = true;
	    this.pins[4] = new ChipElm.Pin(2, ChipElm.SIDE_E, "Q");
	    this.pins[4].output = true;
	    return this.pins[4].lineOver = true;
	  }
	
	  execute() {
	    if (!this.pins[1].value && this.lastClock) {
	      let q = this.pins[3].value;
	
	      if (this.pins[0].value) {
	        if (this.pins[2].value) {
	          q = !q;
	        } else {
	          q = true;
	        }
	      } else if (this.pins[2].value) {
	        q = false;
	      }
	
	      this.pins[3].value = q;
	      this.pins[4].value = !q;
	    }
	
	    return this.lastClock = this.pins[1].value;
	  }
	}
	
	
	module.exports = JkFlipFlopElm;


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let ChipElm = __webpack_require__(57);
	let Util = __webpack_require__(5);
	
	class DFlipFlopElm extends ChipElm {
	  static initClass() {
	    this.FLAG_RESET = 2;
	  }
	
	  constructor(xa, xb, ya, yb, params, f) {
	
	    // Set [4] as default value for params['volts']
	    params = params || {};
	    params['volts'] = params['volts'] || [4];
	
	    super(xa, xb, ya, yb, params, f);
	
	    this.pins[2].value = !this.pins[1].value;
	  }
	
	  getPostCount() {
	    if (this.hasReset()) {
	      return 5;
	    } else {
	      return 4;
	    }
	  }
	
	  getName() {
	    return "D Flip-Flop"
	  }
	
	  getVoltageSourceCount() {
	    return 2;
	  }
	
	  hasReset() {
	    return (this.flags & DFlipFlopElm.FLAG_RESET) !== 0;
	  }
	
	  setupPins() {
	    this.sizeX = 2;
	    this.sizeY = 3;
	
	    this.pins = new Array(this.getPostCount());
	
	    this.pins[0] = new ChipElm.Pin(0, ChipElm.SIDE_W, "D");
	
	    this.pins[1] = new ChipElm.Pin(0, ChipElm.SIDE_E, "Q");
	    this.pins[1].output = this.pins[1].state = true;
	
	    this.pins[2] = new ChipElm.Pin(2, ChipElm.SIDE_E, "Q");
	    this.pins[2].output = true;
	    this.pins[2].lineOver = true;
	
	    this.pins[3] = new ChipElm.Pin(1, ChipElm.SIDE_W, "");
	    this.pins[3].clock = true;
	
	    if (this.hasReset()) {
	      return this.pins[4] = new ChipElm.Pin(2, ChipElm.SIDE_W, "R");
	    }
	  }
	
	  execute() {
	    if (this.pins[3].value && !this.lastClock) {
	      this.pins[1].value = this.pins[0].value;
	      this.pins[2].value = !this.pins[0].value;
	    }
	
	    if ((this.pins.length > 4) && this.pins[4].value) {
	      this.pins[1].value = false;
	      this.pins[2].value = true;
	    }
	
	    return this.lastClock = this.pins[3].value;
	  }
	}
	DFlipFlopElm.initClass();
	
	    //console.log("DFF #{@pins[1].value}")
	
	module.exports = DFlipFlopElm;


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let ChipElm = __webpack_require__(57);
	let Util = __webpack_require__(5);
	
	class CounterElm extends ChipElm {
	  static get FLAG_ENABLE() {
	    return 2;
	  }
	
	  constructor(xa, xb, ya, yb, params, f) {
	    // console.log("FLAG", f)
	
	    params = params || {"bits": 4, "volts": [0, 0, 0, 0]};
	
	    super(xa, xb, ya, yb, params, f);
	  }
	
	  needsBits() {
	    return true;
	  }
	
	  getName() {
	    return "Counter";
	  }
	
	  getPostCount() {
	    if (this.hasEnable()) {
	      return this.bits + 3;
	    }
	
	    return this.bits + 2;
	  }
	
	  hasEnable() {
	    return (this.flags & CounterElm.FLAG_ENABLE) != 0;
	  }
	
	  getVoltageSourceCount() {
	    return this.bits;
	  }
	
	  setupPins() {
	    this.sizeX = 2;
	    this.sizeY = (this.bits > 2) ? this.bits : 2;
	
	    this.pins = new Array(this.getPostCount());
	
	    this.pins[0] = new ChipElm.Pin(0, ChipElm.SIDE_W, "");
	    this.pins[0].clock = true;
	    this.pins[1] = new ChipElm.Pin(this.sizeY - 1, ChipElm.SIDE_W, "R");
	    this.pins[1].bubble = true;
	
	    for (let i = 0; i < this.bits; i++) {
	      let ii = i + 2;
	      this.pins[ii] = new ChipElm.Pin(i, ChipElm.SIDE_E, `Q${this.bits - i - 1}`);
	      this.pins[ii].output = this.pins[ii].state = true;
	    }
	
	    if (this.hasEnable()) {
	      this.pins[this.bits + 2] = new ChipElm.Pin(this.sizeY - 2, ChipElm.SIDE_W, "En");
	    }
	
	    this.allocNodes();
	  }
	
	  execute() {
	    let i;
	    let en = true;
	
	    if (this.hasEnable()) {
	      en = this.pins[this.bits + 2].value;
	    }
	
	    if (this.pins[0].value && !this.lastClock && en) {
	      for (start = this.bits - 1, i = start, asc = start <= 0; asc ? i <= 0 : i >= 0; asc ? i++ : i--) {
	        var asc, start;
	        let ii = i + 2;
	
	        if (!this.pins[ii].value) {
	          this.pins[ii].value = true;
	          break;
	        }
	
	        this.pins[ii].value = false;
	      }
	    }
	
	    if (!this.pins[1].value) {
	      for (i = 0, end = this.bits, asc1 = 0 <= end; asc1 ? i < end : i > end; asc1 ? i++ : i--) {
	        var asc1, end;
	        this.pins[i + 2].value = false;
	      }
	    }
	
	    return this.lastClock = this.pins[0].value;
	  }
	}
	CounterElm.initClass();
	
	module.exports = CounterElm;


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let ChipElm = __webpack_require__(57);
	let Util = __webpack_require__(5);
	
	class DacElm extends ChipElm {
	
	  constructor(xa, xb, ya, yb, params, f) {
	    params = params || {"bits": 2, "volts": [0, 0, 0, 0]};
	
	    super(xa, xb, ya, yb, params, f);
	  }
	
	  needsBits() {
	    return true;
	  }
	
	  getName() {
	    return "DAC";
	  }
	
	  getVoltageSourceCount() {
	    return 1;
	  }
	
	  getPostCount() {
	    return this.bits + 2;
	  }
	
	  setupPins() {
	    this.sizeX = 2;
	    this.sizeY = this.bits > 2 ? this.bits : 2;
	    this.pins = new Array(this.getPostCount());
	
	    for (let i = 0, end = this.bits, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
	      this.pins[i] = new ChipElm.Pin(this.bits - 1 - i, ChipElm.SIDE_W, `D${i}`);
	      this.pins[this.bits] = new ChipElm.Pin(0, ChipElm.SIDE_E, "O");
	      this.pins[this.bits].output = true;
	      this.pins[this.bits + 1] = new ChipElm.Pin(this.sizeY - 1, ChipElm.SIDE_E, "V+");
	    }
	
	    return this.allocNodes();
	  }
	
	  doStep(stamper) {
	    let ival = 0;
	
	    for (let i = 0, end = this.bits, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
	      if (this.volts[i] > 2.5) {
	        ival |= 1 << i;
	      }
	    }
	
	    let ivalmax = (1 << this.bits) - 1;
	    let v = (ival * this.volts[this.bits + 1]) / ivalmax;
	
	    return stamper.updateVoltageSource(0, this.nodes[this.bits], this.pins[this.bits].voltSource, v);
	  }
	}
	
	module.exports = DacElm;


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let ChipElm = __webpack_require__(57);
	let Util = __webpack_require__(5);
	
	class AdcElm extends ChipElm {
	
	  constructor(xa, xb, ya, yb, params, f) {
	    params = params || {"bits": 2, "volts": [0, 0, 0, 0]};
	
	    super(xa, xb, ya, yb, params, f);
	  }
	
	  getName() {
	    return "ADC";
	  }
	
	  getVoltageSourceCount() {
	    return this.bits;
	  }
	
	  getPostCount() {
	    return this.bits + 2;
	  }
	
	  needsBits() {
	    return true;
	  }
	
	  setupPins() {
	    this.sizeX = 2;
	    this.sizeY = (this.bits > 2) ? this.bits : 2;
	    this.pins = new Array(this.getPostCount());
	
	    for (let i = 0, end = this.bits, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
	      this.pins[i] = new ChipElm.Pin(this.bits - 1 - i, ChipElm.SIDE_E, `D${i}`);
	      this.pins[i].output = true;
	    }
	
	    this.pins[this.bits] = new ChipElm.Pin(0, ChipElm.SIDE_W, "In");
	    return this.pins[this.bits + 1] = new ChipElm.Pin(this.sizeY - 1, ChipElm.SIDE_W, "V+");
	  }
	
	  execute() {
	    let imax = (1 << this.bits) - 1;
	
	    let val = (imax * this.volts[this.bits]) / this.volts[this.bits + 1];
	
	    let ival = Math.floor(val);
	
	    ival = Math.min(imax, Math.max(0, ival));
	
	    return __range__(0, this.bits, false).map((i) =>
	      this.pins[i].value = ((ival & (1 << i)) !== 0));
	  }
	}
	
	module.exports = AdcElm;
	
	
	function __range__(left, right, inclusive) {
	  let range = [];
	  let ascending = left < right;
	  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
	  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
	    range.push(i);
	  }
	  return range;
	}

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let ChipElm = __webpack_require__(57);
	let Util = __webpack_require__(5);
	
	// TODO Fails on this line: stamper.updateVoltageSource(0, this.nodes[1], this.pins[1].voltSource, vo);
	class VcoElm extends ChipElm {
	  constructor(xa, xb, ya, yb, params, f) {
	    super(xa, xb, ya, yb, params, f);
	
	    // TODO: paramify
	    this.cResistance = 1e6;
	  }
	
	  getName() {
	    return "Voltage Controlled Oscillator";
	  }
	
	  nonLinear() {
	    return true;
	  }
	
	  getPostCount() {
	    return 6;
	  }
	
	  getVoltageSourceCount() {
	    return 3;
	  }
	
	  setupPins() {
	    this.sizeX = 2;
	    this.sizeY = 4;
	    this.pins = new Array(6);
	
	    this.pins[0] = new ChipElm.Pin(0, ChipElm.SIDE_W, "Vi");
	    this.pins[1] = new ChipElm.Pin(3, ChipElm.SIDE_W, "Vo");
	    this.pins[1].output = true;
	
	    this.pins[2] = new ChipElm.Pin(0, ChipElm.SIDE_E, "C");
	    this.pins[3] = new ChipElm.Pin(1, ChipElm.SIDE_E, "C");
	    this.pins[4] = new ChipElm.Pin(2, ChipElm.SIDE_E, "R1");
	    this.pins[4].output = true;
	
	    this.pins[5] = new ChipElm.Pin(3, ChipElm.SIDE_E, "R2");
	    this.pins[5].output = true;
	  }
	
	  computeCurrent() {
	    if (this.cResistance === 0) {
	      return;
	    }
	
	    let c = (this.cDir * (this.pins[4].current + this.pins[5].current)) + ((this.volts[3] - this.volts[2]) / this.cResistance);
	
	    this.pins[2].current = -c;
	    this.pins[3].current = c;
	    return this.pins[0].current = -this.pins[4].current;
	  }
	
	  stamp(stamper) {
	    stamper.stampVoltageSource(0, this.nodes[1], this.pins[1].voltSource);
	    stamper.stampVoltageSource(this.nodes[0], this.nodes[4], this.pins[4].voltSource, 0);
	    stamper.stampVoltageSource(0, this.nodes[5], this.pins[5].voltSource, 5);
	
	    stamper.stampResistor(this.nodes[2], this.nodes[3], this.cResistance);
	    stamper.stampNonLinear(this.nodes[2]);
	    return stamper.stampNonLinear(this.nodes[3]);
	  }
	
	  doStep(stamper) {
	    let vc = this.volts[3] - this.volts[2];
	    let vo = this.volts[1];
	
	    let dir = (vo < 2.5) ? 1 : -1;
	
	    if ((vo < 2.5) && (vc > 4.5)) {
	      vo = 5;
	      dir = -1;
	    }
	
	    if ((vo > 2.5) && (vc < 0.5)) {
	      vo = 0;
	      dir = 1;
	    }
	
	    stamper.updateVoltageSource(0, this.nodes[1], this.pins[1].voltSource, vo);
	
	    let cur1 = this.getParentCircuit().getNodes().length + this.pins[4].voltSource;
	    let cur2 = this.getParentCircuit().getNodes().length + this.pins[5].voltSource;
	
	    stamper.stampMatrix(this.nodes[2], cur1, dir);
	    stamper.stampMatrix(this.nodes[2], cur2, dir);
	    stamper.stampMatrix(this.nodes[3], cur1, -dir);
	    stamper.stampMatrix(this.nodes[3], cur2, -dir);
	
	    return this.cDir = dir;
	  }
	
	
	  draw(renderContext) {
	    this.computeCurrent();
	    return this.drawChip(renderContext);
	  }
	}
	
	
	module.exports = VcoElm;


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let ChipElm = __webpack_require__(57);
	let Util = __webpack_require__(5);
	
	class PhaseCompElm extends ChipElm {
	
	  constructor(xa, xb, ya, yb, params, f) {
	    super(xa, xb, ya, yb, params, f);
	    
	    this.ff1 = false;
	    this.ff2 = false;
	  }
	
	  getName() {
	    return "Phase Comparator";
	  }
	
	  setupPins() {
	    this.sizeX = 2;
	    this.sizeY = 2;
	    this.pins = new Array(3);
	
	    this.pins[0] = new ChipElm.Pin(0, ChipElm.SIDE_W, "I1");
	    this.pins[1] = new ChipElm.Pin(1, ChipElm.SIDE_W, "I2");
	    this.pins[2] = new ChipElm.Pin(0, ChipElm.SIDE_E, "O");
	
	    return this.pins[2].output = true;
	  }
	
	  getPostCount() {
	    return 3;
	  }
	
	  getVoltageSourceCount() {
	    return 1;
	  }
	
	  nonLinear() {
	    return true;
	  }
	
	  stamp(stamper) {
	    let vn = this.getParentCircuit().getNodes().length + this.pins[2].voltSource;
	
	    stamper.stampNonLinear(vn);
	    stamper.stampNonLinear(0);
	    return stamper.stampNonLinear(this.nodes[2]);
	  }
	
	  doStep(stamper) {
	    let out;
	    let v1 = this.volts[0] > 2.5;
	    let v2 = this.volts[1] > 2.5;
	
	    if (v1 && !this.pins[0].value) {
	      this.ff1 = true;
	    }
	    if (v2 && !this.pins[1].value) {
	      this.ff2 = true;
	    }
	    if (this.ff1 && this.ff2) {
	      this.ff1 = this.ff2 = false;
	    }
	
	    if (this.ff1) {
	      out = 5;
	    } else {
	      if (this.ff2) {
	        out = 0;
	      } else {
	        out = -1;
	      }
	    }
	
	    if (out !== -1) {
	      stamper.stampVoltageSource(0, this.nodes[2], this.pins[2].voltSource, out);
	    } else {
	      let vn = this.getParentCircuit().numNodes() + this.pins[2].voltSource;
	      stamper.stampMatrix(vn, vn, 1);
	    }
	
	    this.pins[0].value = v1;
	    return this.pins[1].value = v2;
	  }
	}
	
	module.exports = PhaseCompElm;


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Settings = __webpack_require__(2);
	let ChipElm = __webpack_require__(57);
	
	class SevenSegElm extends ChipElm {
	
	  constructor(xa, xb, ya, yb, params, f) {
	    super(xa, xb, ya, yb, params, f);
	  }
	
	  getPostCount() {
	    return 7;
	  }
	
	  getVoltageSourceCount() {
	    return 0;
	  }
	
	  getName() {
	    return "7 Segment Display";
	  }
	
	  setupPins() {
	    this.sizeX = 4;
	    this.sizeY = 4;
	
	    this.pins = new Array(7);
	
	    this.pins[0] = new ChipElm.Pin(0, ChipElm.SIDE_W, "a");
	    this.pins[1] = new ChipElm.Pin(1, ChipElm.SIDE_W, "b");
	    this.pins[2] = new ChipElm.Pin(2, ChipElm.SIDE_W, "c");
	    this.pins[3] = new ChipElm.Pin(3, ChipElm.SIDE_W, "d");
	    this.pins[4] = new ChipElm.Pin(1, ChipElm.SIDE_S, "e");
	    this.pins[5] = new ChipElm.Pin(2, ChipElm.SIDE_S, "f");
	    this.pins[6] = new ChipElm.Pin(3, ChipElm.SIDE_S, "g");
	  }
	
	  draw(renderContext) {
	    this.drawChip(renderContext);
	
	    let xl = this.point1.x + this.cspc * 5;
	    let yl = this.point1.y + this.cspc;
	    
	    let color = "#333";
	
	    // TOP
	    if (this.pins[0].value > 0)
	      renderContext.drawLine(xl, yl, xl + this.cspc, yl, 2*Settings.LINE_WIDTH);
	
	    // TOP-RIGHT
	    if (this.pins[1].value > 0)
	      renderContext.drawLine(xl + this.cspc, yl, xl + this.cspc, yl + this.cspc, 2*Settings.LINE_WIDTH);
	
	    // BOTTOM-RIGHT
	    if (this.pins[2].value > 0)
	      renderContext.drawLine(xl + this.cspc, yl + this.cspc, xl + this.cspc, yl + this.cspc2, 2*Settings.LINE_WIDTH);
	
	    // BOTTOM
	    if (this.pins[3].value > 0)
	      renderContext.drawLine(xl, yl + this.cspc2, xl + this.cspc, yl + this.cspc2, 2*Settings.LINE_WIDTH);
	
	    // BOTTOM-LEFT
	    if (this.pins[4].value > 0)
	      renderContext.drawLine(xl, yl + this.cspc, xl, yl + this.cspc2, 2*Settings.LINE_WIDTH);
	
	    // TOP-LEFT
	    if (this.pins[5].value > 0)
	      renderContext.drawLine(xl, yl, xl, yl + this.cspc, 2*Settings.LINE_WIDTH);
	
	    // MIDDLE
	    if (this.pins[6].value > 0)
	      renderContext.drawLine(xl, yl + this.cspc, xl + this.cspc, yl + this.cspc, 2*Settings.LINE_WIDTH);
	
	  }
	
	  getColor(p) {
	    return this.pins[p].value;
	  }
	}
	
	module.exports = SevenSegElm;


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let ChipElm = __webpack_require__(57);
	let Util = __webpack_require__(5);
	
	class CC2Elm extends ChipElm {
	//  @Fields = {
	//    gain: {
	//      name: "Gain"
	//      data_type: parseFloat
	//    }
	//  }
	
	  constructor(xa, xb, ya, yb, params, f) {
	    super(xa, xb, ya, yb, params, f);
	
	    if (params) {
	      if (params.constructor == Array) {
	        this.gain = parseFloat(params[params.length - 1]);
	      } else {
	        this.gain = params["gain"]
	      }
	    } else {
	      this.gain = 1;
	    }
	
	    // console.log("GAIN", this.gain)
	
	    this.params['gain'] = this.gain;
	  }
	
	  getName() {
	    return "CC2 Chip";
	  }
	
	  setupPins() {
	    this.sizeX = 2;
	    this.sizeY = 3;
	
	    this.pins = new Array(3);
	    this.pins[0] = new ChipElm.Pin(0, ChipElm.SIDE_W, "X");
	    this.pins[0].output = true;
	    this.pins[1] = new ChipElm.Pin(2, ChipElm.SIDE_W, "Y");
	    this.pins[2] = new ChipElm.Pin(1, ChipElm.SIDE_E, "Z");
	  }
	
	  stamp(stamper) {
	    stamper.stampVoltageSource(0, this.nodes[0], this.pins[0].voltSource);
	    stamper.stampVCVS(0, this.nodes[1], 1, this.pins[0].voltSource);
	
	    return stamper.stampCCCS(0, this.nodes[2], this.pins[0].voltSource, this.gain);
	  }
	
	  draw(renderContext) {
	    this.pins[2].current = this.pins[0].current * this.gain;
	    return this.drawChip(renderContext);
	  }
	
	  getPostCount() {
	    return 3;
	  }
	
	  getVoltageSourceCount() {
	    return 1;
	  }
	}
	
	module.exports = CC2Elm;


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Util = __webpack_require__(5);
	let Settings = __webpack_require__(2);
	
	class TransLineElm extends CircuitComponent {
	  static get Fields() {
	    return {
	      delay: {
	        name: "Delay",
	        data_type: parseFloat,
	        default_value: 1000 * 5e-12,
	        symbol: "s"
	      },
	      imped: {
	        name: "Impedance",
	        data_type: parseFloat,
	        default_value: 75
	      },
	      channelWidth: {
	        name: "Channel Width (m)",
	        data_type: parseFloat,
	        default_value: 20
	      },
	      resistance: {
	        name: "Resistance",
	        data_type: parseFloat,
	        default_value: 50
	      }
	    };
	  }
	
	  constructor(xa, xb, ya, yb, params, f) {
	    super(xa, xb, ya, yb, params, f);
	
	    this.noDiagonal = true;
	
	    // delete this.params['resistance'];
	
	    this.ptr = 0;
	
	    this.place()
	  }
	
	  getName() {
	    return "Transmission Line"
	  }
	
	  onSolder(circuit) {
	    super.onSolder();
	
	    // console.log(circuit.timeStep())
	
	    this.delay = this.delay || (1000 * circuit.timeStep());
	    this.params['delay'] = this.delay;
	
	    this.lenSteps = Math.floor(this.delay / circuit.timeStep());
	    // console.log("LEN STEPS", this.lenSteps, this.delay, circuit.timeStep())
	
	    if (this.lenSteps > 100000) {
	      this.voltageL = null;
	      this.voltageR = null;
	
	    } else {
	      this.voltageL = Util.zeroArray(this.lenSteps);
	      this.voltageR = Util.zeroArray(this.lenSteps);
	    }
	
	    this.ptr = 0;
	  }
	
	  place() {
	    let ds = (this.dy() === 0) ? Math.sign(this.dx()) : -Math.sign(this.dy());
	
	    let p3 = Util.interpolate(this.point1, this.point2, 0, -Math.floor(this.channelWidth * ds));
	    let p4 = Util.interpolate(this.point1, this.point2, 1, -Math.floor(this.channelWidth * ds));
	
	    let sep = Settings.GRID_SIZE / 2;
	    let p5 = Util.interpolate(this.point1, this.point2, 0, -Math.floor((this.channelWidth / 2) - sep) * ds);
	    let p6 = Util.interpolate(this.point1, this.point2, 1, -Math.floor((this.channelWidth / 2) - sep) * ds);
	    let p7 = Util.interpolate(this.point1, this.point2, 0, -Math.floor((this.channelWidth / 2) + sep) * ds);
	    let p8 = Util.interpolate(this.point1, this.point2, 1, -Math.floor((this.channelWidth / 2) + sep) * ds);
	
	    this.posts = [p3, p4, this.point1, this.point2];
	    this.inner = [p7, p8, p5, p6];
	
	    this.setBboxPt(this.posts[0], this.posts[3], 5);
	  }
	
	  getConnection(n1, n2) {
	    return false;
	  }
	
	  hasGroundConnection(n1) {
	    return false;
	  }
	
	  getVoltageSourceCount() {
	    return 2;
	  }
	
	  getInternalNodeCount() {
	    return 2;
	  }
	
	  getPost(n) {
	    return this.posts[n];
	  }
	
	  getPostCount() {
	    return 4;
	  }
	
	  setVoltageSource(n, v) {
	    if (n === 0) {
	      return this.voltSource1 = v;
	    } else {
	      return this.voltSource2 = v;
	    }
	  }
	
	  draw(renderContext) {
	    //this.setBboxPt(this.posts[0], this.posts[3], 5);
	    let segments = Math.floor(this.dn() / 2);
	
	    let ix0 = this.ptr - 1 + this.lenSteps;
	    let segf = 1. / segments;
	
	    //renderContext.setColor(Color.darkGray);
	    renderContext.drawRect(this.inner[2].x, this.inner[2].y, this.inner[1].x - this.inner[2].x, this.inner[1].y - this.inner[2].y + 1, Settings.GRAY);
	
	    for (let i = 0; i != 4; i++) {
	      let color = renderContext.getVoltageColor(this.volts[i]);
	      renderContext.drawLinePt(this.posts[i], this.inner[i], color);
	    }
	
	    if (this.voltageL != null) {
	      for (let i = 0; i < segments; i++) {
	        let ix1 = Math.floor((ix0 - this.lenSteps * i / segments) % this.lenSteps);
	        let ix2 = Math.floor((ix0 - this.lenSteps * (segments - 1 - i) / segments) % this.lenSteps);
	
	        let lhs = this.voltageL[ix1];
	        let rhs = this.voltageR[ix2];
	
	        let v = (lhs + rhs) / 2;
	
	        let color = renderContext.getVoltageColor(v);
	
	        let ps1 = Util.interpolate(this.inner[0], this.inner[1], i * segf);
	        let ps2 = Util.interpolate(this.inner[2], this.inner[3], i * segf);
	
	        renderContext.drawLine(ps1.x, ps1.y, ps2.x, ps2.y, color);
	
	        //g.drawLine(ps1.x, ps1.y, ps2.x, ps2.y);
	        // interpPoint(inner[2], inner[3], ps1, (i + 1) * segf);
	        ps1 = Util.interpolate(this.inner[2], this.inner[3], (i + 1) * segf);
	
	        renderContext.drawLinePt(ps1, ps2, color);
	      }
	    }
	
	    let color = renderContext.getVoltageColor(this.volts[0]);
	    //renderContext.drawLinePt(this.inner[0], this.inner[1], color);
	    renderContext.drawPosts(this);
	
	    /*
	     curCount1 = updateDotCount(-current1, curCount1);
	     curCount2 = updateDotCount(current2, curCount2);
	     if (sim.dragElm != this) {
	     drawDots(g, posts[0], inner[0], curCount1);
	     drawDots(g, posts[2], inner[2], -curCount1);
	     drawDots(g, posts[1], inner[1], -curCount2);
	     drawDots(g, posts[3], inner[3], curCount2);
	     }
	     */
	  }
	
	
	  setCurrent(v, c) {
	    if (v === this.voltSource1) {
	      return this.current1 = c;
	    } else {
	      return this.current2 = c;
	    }
	  }
	
	  stamp(stamper) {
	    stamper.stampVoltageSource(this.nodes[4], this.nodes[0], this.voltSource1);
	    stamper.stampVoltageSource(this.nodes[5], this.nodes[1], this.voltSource2);
	    stamper.stampResistor(this.nodes[2], this.nodes[4], this.imped);
	    return stamper.stampResistor(this.nodes[3], this.nodes[5], this.imped);
	  }
	
	
	  startIteration() {
	    if (!this.voltageL) {
	      console.error(`Start Iteration: Transmission line delay too large: ${this.params.delay}. Time Step is: ${this.Circuit.timeStep()}`);
	      return;
	    }
	
	
	    // console.log("START ITERATION PTR", this.ptr, this.volts, "LENSTEP",  this.lenSteps);
	
	    this.voltageL[this.ptr] = ((this.volts[2] - this.volts[0]) + this.volts[2]) - this.volts[4];
	    this.voltageR[this.ptr] = ((this.volts[3] - this.volts[1]) + this.volts[3]) - this.volts[5];
	
	    return this.ptr = (this.ptr + 1) % this.lenSteps;
	  }
	
	  doStep(stamper) {
	    if (!this.voltageL) {
	      console.error(`doStep: Transmission line delay too large: ${this.params.delay}. Time Step is: ${this.Circuit.timeStep()}`);
	      return;
	    }
	
	    stamper.updateVoltageSource(this.nodes[4], this.nodes[0], this.voltSource1, -this.voltageR[this.ptr]);
	    stamper.updateVoltageSource(this.nodes[5], this.nodes[1], this.voltSource2, -this.voltageL[this.ptr]);
	
	    if ((Math.abs(this.volts[0]) > 1e-5) || (Math.abs(this.volts[1]) > 1e-5)) {
	      return console.error("Transmission line not grounded!");
	    }
	  }
	}
	TransLineElm.initClass();
	
	
	module.exports = TransLineElm;


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Util = __webpack_require__(5);
	
	class TransformerElm extends CircuitComponent {
	  static initClass() {
	    this.FLAG_BACK_EULER = 2;
	  }
	
	  static get Fields() {
	    return {
	      inductance: {
	        name: "Inductance",
	        default_value: 1e-3,
	        data_type: parseFloat,
	        symbol: "H"
	      },
	      ratio: {
	        name: "Ratio",
	        default_value: 1,
	        data_type: parseFloat,
	        field_type: "integer"
	      },
	      // TODO: Name collision
	      current0: {
	        name: "Current L",
	        data_type: parseFloat,
	        default_value: 1e-3,
	        symbol: "A"
	      },
	      current1: {
	        name: "Current R",
	        data_type: parseFloat,
	        default_value: 1e-3,
	        symbol: "A"
	      },
	      couplingCoef: {
	        name: "Coupling Coefficient",
	        default_value: 0.999,
	        data_type: parseFloat
	      }
	    };
	  }
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	
	    // this.drawWidth = Math.max(32, Math.abs(yb - ya));
	    this.drawWidth = this.dn();//Math.max(32, this.dn());
	    this.curcount = 0;
	    this.current = [this.current0, this.current1];
	    this.noDiagonal = true;
	
	    this.place()
	  }
	
	  getName() {
	    return "Transformer"
	  }
	
	  isTrapezoidal() {
	    return (this.flags & TransformerElm.FLAG_BACK_EULER) === 0;
	  }
	
	  place() {
	    // super.setPoints(...arguments);
	
	    //this.point2.y = this.point1.y;
	
	    this.ptEnds = Util.newPointArray(4);
	    this.ptCoil = Util.newPointArray(4);
	    this.ptCore = Util.newPointArray(4);
	
	    this.ptEnds[0] = this.point1;
	    this.ptEnds[1] = this.point2;
	
	//    console.log("SP: ", @point1, @point2, 0, -@dsign(), @width)
	    let hs = this.drawWidth;
	    hs = 32;
	    
	    this.ptEnds[2] = Util.interpolate(this.point1, this.point2, 0, -hs);
	    this.ptEnds[3] = Util.interpolate(this.point1, this.point2, 1, -hs);
	
	    let ce = 0.5 - (12 / this.dn());
	    let cd = 0.5 - (2 / this.dn());
	
	    let i = 0;
	    while (i < 4) {
	      this.ptCoil[i]     = Util.interpolate(this.ptEnds[i], this.ptEnds[i + 1], ce);
	      this.ptCoil[i + 1] = Util.interpolate(this.ptEnds[i], this.ptEnds[i + 1], 1 - ce);
	      this.ptCore[i]     = Util.interpolate(this.ptEnds[i], this.ptEnds[i + 1], cd);
	      this.ptCore[i + 1] = Util.interpolate(this.ptEnds[i], this.ptEnds[i + 1], 1 - cd);
	
	      i+=2;
	    }
	
	    this.setBboxPt(this.point1, this.ptEnds[3]);
	  }
	
	  getPost(n) {
	    return this.ptEnds[n];
	  }
	
	  getPostCount() {
	    return 4;
	  }
	
	  reset() {
	    this.current[0] = 0;
	    this.current[1] = 0;
	
	    this.volts[0] = 0;
	    this.volts[1] = 0;
	    this.volts[2] = 0;
	    this.volts[3] = 0;
	
	    this.curcount[0] = 0;
	    this.curcount[1] = 0;
	  }
	
	  draw(renderContext) {
	    let i;
	    for (i = 0; i < 4; i++) {
	      let color = renderContext.getVoltageColor(this.volts[i]);
	
	      // console.log(@ptEnds[i], @ptCoil[i], color)
	      renderContext.drawLinePt(this.ptEnds[i], this.ptCoil[i], color);
	
	      renderContext.drawPost(this.ptEnds[i], this.ptCoil[i], "#33FFEE", "#33FFEE");
	    }
	
	    for (i = 0; i < 2; i++) {
	      renderContext.drawCoil(this.ptCoil[i], this.ptCoil[i + 2], this.volts[i], this.volts[i + 2], this.dsign() * ((i === 1) ? -6 : 6));
	    }
	
	    for (i = 0; i < 2; i++) {
	      renderContext.drawLinePt(this.ptCore[i], this.ptCore[i + 2]);
	
	      renderContext.drawPost(this.ptCore[i], this.ptCore[i + 2], "#FFEE33", "#FF33EE");
	    }
	      //      @curcount[i] = updateDot
	
	    renderContext.drawPosts(this);
	
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      return super.debugDraw(renderContext);
	    }
	  }
	
	
	  stamp(stamper) {
	//    double l1 = inductance;
	//    double l2 = inductance * ratio * ratio;
	//    double m = couplingCoef * Math.sqrt(l1 * l2);
	//    // build inverted matrix
	//    double deti = 1 / (l1 * l2 - m * m);
	//    double ts = isTrapezoidal() ? sim.timeStep / 2 : sim.timeStep;
	//    a1 = l2 * deti * ts; // we multiply dt/2 into a1..a4 here
	//    a2 = -m * deti * ts;
	//    a3 = -m * deti * ts;
	//    a4 = l1 * deti * ts;
	//    sim.stampConductance(nodes[0], nodes[2], a1);
	//    sim.stampVCCurrentSource(nodes[0], nodes[2], nodes[1], nodes[3], a2);
	//    sim.stampVCCurrentSource(nodes[1], nodes[3], nodes[0], nodes[2], a3);
	//    sim.stampConductance(nodes[1], nodes[3], a4);
	//    sim.stampRightSide(nodes[0]);
	//    sim.stampRightSide(nodes[1]);
	//    sim.stampRightSide(nodes[2]);
	//    sim.stampRightSide(nodes[3]);
	
	    let ts;
	    let l1 = this.inductance;
	    let l2 = this.inductance * this.ratio * this.ratio;
	
	    //    deti = 1 / (l1 * l2 - m * m);
	    let m = this.couplingCoef  * Math.sqrt(l1 * l2);
	
	    let deti = 1.0 / ((l1 * l2) - (m * m));
	
	    if (this.isTrapezoidal()) {
	      ts = this.getParentCircuit().timeStep() / 2;
	    } else {
	      ts = this.getParentCircuit().timeStep();
	    }
	
	    //console.log("STAMP li: #{l1} l2: #{l2} deti #{deti} ts: #{ts} ratio: #{@ratio} m: #{m}")
	    this.a1 = l2 * deti * ts;
	    this.a2 = -m * deti * ts;
	    this.a3 = -m * deti * ts;
	    this.a4 = l1 * deti * ts;
	//    console.log("STAMP", @a1, @a2, @a3, @a4)
	
	    stamper.stampConductance(this.nodes[0], this.nodes[2], this.a1);
	    stamper.stampVCCurrentSource(this.nodes[0], this.nodes[2], this.nodes[1], this.nodes[3], this.a2);
	    stamper.stampVCCurrentSource(this.nodes[1], this.nodes[3], this.nodes[0], this.nodes[2], this.a3);
	    stamper.stampConductance(this.nodes[1], this.nodes[3], this.a4);
	
	//    console.log(@nodes)
	    stamper.stampRightSide(this.nodes[0]);
	    stamper.stampRightSide(this.nodes[1]);
	    stamper.stampRightSide(this.nodes[2]);
	    stamper.stampRightSide(this.nodes[3]);
	  }
	
	  calculateCurrent() {
	//    console.log("CALC CURRENT (volts): #{@volts} #{@curSourceValue1} #{@curSourceValue2}")
	
	    let voltdiff1 = this.volts[0] - this.volts[2];
	    let voltdiff2 = this.volts[1] - this.volts[3];
	    this.current[0] = (voltdiff1 * this.a1) + (voltdiff2 * this.a2) + this.curSourceValue1;
	    this.current[1] = (voltdiff1 * this.a3) + (voltdiff2 * this.a4) + this.curSourceValue2;
	  }
	
	//  setNode: (j, k) ->
	//    super()
	//    if j==3
	//      console.log("K = #{k}")
	//      console.trace()
	
	  doStep(stamper) {
	//    console.log("DO STEP", @curSourceValue1, @curSourceValue2, @isTrapezoidal())
	//    console.log(@nodes)
	    stamper.stampCurrentSource(this.nodes[0], this.nodes[2], this.curSourceValue1);
	    stamper.stampCurrentSource(this.nodes[1], this.nodes[3], this.curSourceValue2);
	  }
	
	//    console.log(@Circuit.Solver.circuitRightSide)
	
	  startIteration() {
	
	    //    double voltdiff1 = volts[0] - volts[2];
	    //    double voltdiff2 = volts[1] - volts[3];
	    //    if (isTrapezoidal()) {
	    //    curSourceValue1 = voltdiff1 * a1 + voltdiff2 * a2 + current[0];
	    //      curSourceValue2 = voltdiff1 * a3 + voltdiff2 * a4 + current[1];
	    //    } else {
	    //  curSourceValue1 = current[0];
	    //    curSourceValue2 = current[1];
	    //    }
	
	    let voltdiff1 = this.volts[0] - this.volts[2];
	    let voltdiff2 = this.volts[1] - this.volts[3];
	
	    if (this.isTrapezoidal()) {
	      this.curSourceValue1 = (voltdiff1 * this.a1) + (voltdiff2 * this.a2) + this.current[0];
	      this.curSourceValue2 = (voltdiff1 * this.a3) + (voltdiff2 * this.a4) + this.current[1];
	    } else {
	      this.curSourceValue1 = this.current[0];
	      this.curSourceValue2 = this.current[1];
	    }
	  }
	
	//    console.log("START ITERATION ", voltdiff1, voltdiff2, @curSourceValue1, @curSourceValue2)
	
	  getConnection(n1, n2) {
	    if (Util.comparePair(n1, n2, 0, 2)) {
	      return true;
	    }
	
	    if (Util.comparePair(n1, n2, 1, 3)) {
	      return true;
	    }
	
	    return false;
	  }
	}
	TransformerElm.initClass();
	
	
	module.exports = TransformerElm;


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Util = __webpack_require__(5);
	
	class TappedTransformerElm extends CircuitComponent {
	  static get Fields() {
	    return {
	      inductance: {
	        name: "Inductance",
	        data_type: parseFloat,
	        default_value: 4,
	        symbol: "H"
	      },
	      ratio: {
	        name: "Ratio",
	        data_type: parseFloat,
	        default_value: 1
	      },
	      current0: {
	        name: "Current0",
	        data_type: parseFloat,
	        default_value: 0,
	        symbol: "A"
	      },
	      current1: {
	        name: "Current1",
	        data_type: parseFloat,
	        default_value: 1,
	        symbol: "A"
	      },
	      current2: {
	        name: "Current2",
	        data_type: parseFloat,
	        default_value: 0,
	        symbol: "A"
	      }
	    };
	  }
	
	  constructor(xa, xb, ya, yb, params, f) {
	    super(xa, xb, ya, yb, params, f);
	
	    this.current = [this.current0, this.current1, this.current2, 0];
	    // this.params['current'] = this.current;
	
	    // delete this.params['current0'];
	    // delete this.params['current1'];
	    // delete this.params['current2'];
	
	    this.noDiagonal = true;
	    this.place()
	  }
	
	  draw(renderContext) {
	    super.debugDraw(renderContext);
	
	    this.current[3] = this.current[1] - this.current[2];
	
	    let color;
	
	    for (let i = 0; i != 5; i++) {
	      color = renderContext.getVoltageColor(this.volts[i]);
	      renderContext.drawLinePt(this.ptEnds[i], this.ptCoil[i], color);
	    }
	    for (let i = 0; i != 4; i++) {
	      if (i == 1)
	        continue;
	
	      // setPowerColor(g, current[i] * (volts[i] - volts[i + 1]));
	      renderContext.drawCoil(this.ptCoil[i], this.ptCoil[i + 1], this.volts[i], this.volts[i + 1], i > 1 ? -6 : 6);
	    }
	
	    //renderContext.getVoltageColor(needsHighlight() ? selectColor : lightGrayColor);
	
	    for (let i = 0; i != 4; i += 2) {
	      renderContext.drawLinePt(this.ptCore[i], this.ptCore[i + 1]);
	    }
	
	    /*
	    // calc current of tap wire
	    this.current[3] = this.current[1] - this.current[2];
	    for (i = 0; i != 4; i++)
	      curcount[i] = updateDotCount(current[i], curcount[i]);
	
	
	    // primary dots
	    drawDots(g, ptEnds[0], ptCoil[0], curcount[0]);
	    drawDots(g, ptCoil[0], ptCoil[1], curcount[0]);
	    drawDots(g, ptCoil[1], ptEnds[1], curcount[0]);
	
	    // secondary dots
	    drawDots(g, ptEnds[2], ptCoil[2], curcount[1]);
	    drawDots(g, ptCoil[2], ptCoil[3], curcount[1]);
	    drawDots(g, ptCoil[3], ptEnds[3], curcount[3]);
	    drawDots(g, ptCoil[3], ptCoil[4], curcount[2]);
	    drawDots(g, ptCoil[4], ptEnds[4], curcount[2]);
	    */
	
	    renderContext.drawPosts(this);
	    
	  }
	
	  getName() {
	    return "Tapped Transformer"
	  }
	
	  place() {
	    let b;
	    //super.setPoints(...arguments);
	
	    let hs = 32;
	
	    this.ptEnds = new Array(5);
	    this.ptCoil = new Array(5);
	    this.ptCore = new Array(4);
	
	    this.ptEnds[0] = this.point1;
	    this.ptEnds[2] = this.point2;
	
	    this.ptEnds[1] = Util.interpolate(this.point1, this.point2, 0, -hs * 2);
	    this.ptEnds[3] = Util.interpolate(this.point1, this.point2, 1, -hs);
	    this.ptEnds[4] = Util.interpolate(this.point1, this.point2, 1, -hs * 2);
	
	    let ce = 0.5 - (12 / this.dn());
	    let cd = 0.5 - (2 / this.dn());
	
	    this.ptCoil[0] = Util.interpolate(this.ptEnds[0], this.ptEnds[2], ce);
	    this.ptCoil[1] = Util.interpolate(this.ptEnds[0], this.ptEnds[2], ce, -hs * 2);
	    this.ptCoil[2] = Util.interpolate(this.ptEnds[0], this.ptEnds[2], 1 - ce);
	    this.ptCoil[3] = Util.interpolate(this.ptEnds[0], this.ptEnds[2], 1 - ce, -hs);
	    this.ptCoil[4] = Util.interpolate(this.ptEnds[0], this.ptEnds[2], 1 - ce, -hs * 2);
	
	    this.setBboxPt(this.ptEnds[0], this.ptEnds[4], 0);
	    
	    [0, 1].map((i) =>
	      (b = -hs * i * 2,
	      this.ptCore[i] = Util.interpolate(this.ptEnds[0], this.ptEnds[2], cd, b),
	      this.ptCore[i + 2] = Util.interpolate(this.ptEnds[0], this.ptEnds[2], 1 - cd, b)));
	  }
	
	  getPost(n) {
	    return this.ptEnds[n];
	  }
	
	  getPostCount() {
	    return 5;
	  }
	
	  setNodeVoltage(node_idx, voltage) {
	//    console.log("TRANS", voltage)
	    return super.setNodeVoltage();
	  }
	
	  reset() {
	    this.current[0] = 0;
	    this.current[1] = 0;
	
	    this.volts[0] = 0;
	    this.volts[1] = 0;
	    this.volts[2] = 0;
	    this.volts[3] = 0;
	
	    this.curcount[0] = 0;
	    return this.curcount[1] = 0;
	  }
	
	  stamp(stamper) {
	    let l1 = this.inductance;
	    let l2 = (this.inductance * this.ratio * this.ratio) / 4;
	    let cc = 0.99;
	
	    this.a = new Array(9);
	
	    this.a[0] = (1 + cc) / (l1 * ((1 + cc) - (2 * cc * cc)));
	    this.a[1] = this.a[2] = this.a[3] = this.a[6] = (2 * cc) / (((2 * cc * cc) - cc - 1) * this.inductance * this.ratio);
	    this.a[4] = this.a[8] = (-4 * (1 + cc)) / (((2 * cc * cc) - cc - 1) * l1 * this.ratio * this.ratio);
	    this.a[5] = this.a[7] = (4 * cc) / (((2 * cc * cc) - cc - 1) * l1 * this.ratio * this.ratio);
	
	    return [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) =>
	      (this.a[i] *= this.getParentCircuit().timeStep() / 2,
	
	      stamper.stampConductance(this.nodes[0], this.nodes[1], this.a[0]),
	      stamper.stampVCCurrentSource(this.nodes[0], this.nodes[1], this.nodes[2], this.nodes[3], this.a[1]),
	      stamper.stampVCCurrentSource(this.nodes[0], this.nodes[1], this.nodes[3], this.nodes[4], this.a[2]),
	  
	      stamper.stampVCCurrentSource(this.nodes[2], this.nodes[3], this.nodes[0], this.nodes[1], this.a[3]),
	      stamper.stampConductance(this.nodes[2], this.nodes[3], this.a[4]),
	      stamper.stampVCCurrentSource(this.nodes[2], this.nodes[3], this.nodes[3], this.nodes[4], this.a[5]),
	  
	      stamper.stampVCCurrentSource(this.nodes[3], this.nodes[4], this.nodes[0], this.nodes[1], this.a[6]),
	      stamper.stampVCCurrentSource(this.nodes[3], this.nodes[4], this.nodes[2], this.nodes[3], this.a[7]),
	      stamper.stampConductance(this.nodes[3], this.nodes[4], this.a[8]),
	  
	      (() => {
	        let result = [];
	        for (i = 0; i < 5; i++) {
	          result.push(stamper.stampRightSide(this.nodes[i]));
	        }
	        return result;
	      })(),
	
	      this.voltdiff = new Array(3),
	      this.curSourceValue = new Array(3)));
	  }
	
	  doStep(stamper) {
	    stamper.stampCurrentSource(this.nodes[0], this.nodes[1], this.curSourceValue[0]);
	    stamper.stampCurrentSource(this.nodes[2], this.nodes[3], this.curSourceValue[1]);
	    return stamper.stampCurrentSource(this.nodes[3], this.nodes[4], this.curSourceValue[2]);
	  }
	
	  startIteration() {
	    this.voltdiff[0] = this.volts[0] - this.volts[1];
	    this.voltdiff[1] = this.volts[2] - this.volts[3];
	    this.voltdiff[2] = this.volts[3] - this.volts[4];
	
	    [0, 1, 2].map((i) =>
	      (this.curSourceValue[i] = this.current[i],
	      [0, 1, 2].map((j) =>
	        this.curSourceValue[i] = this.a[(i*3) + j] * this.voltdiff[j])));
	  }
	
	  calculateCurrent() {
	    this.voltdiff[0] = this.volts[0] - this.volts[1];
	    this.voltdiff[1] = this.volts[2] - this.volts[3];
	    this.voltdiff[2] = this.volts[3] - this.volts[4];
	
	    return [0, 1, 2].map((i) =>
	      (this.current[i] = this.curSourceValue[i],
	      [0, 1, 2].map((j) =>
	        this.current[i] += this.a[(i * 3) + j] * this.voltdiff[j])));
	  }
	
	  getConnection(n1, n2) {
	    if (Util.comparePair(n1, n2, 0, 1)) {
	      return true;
	    }
	    if (Util.comparePair(n1, n2, 2, 3)) {
	      return true;
	    }
	    if (Util.comparePair(n1, n2, 3, 4)) {
	      return true;
	    }
	    if (Util.comparePair(n1, n2, 2, 4)) {
	      return true;
	    }
	
	    return false;
	  }
	}
	TappedTransformerElm.initClass();
	
	module.exports = TappedTransformerElm;


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let DiodeElm = __webpack_require__(24);
	let Util = __webpack_require__(5);
	let Settings = __webpack_require__(2);
	
	class LedElm extends DiodeElm {
	  static get Fields() {
	    return {
	      colorR: {
	        name: "Red Intensity",
	        data_type: parseFloat,
	        default_value: 0
	      },
	      colorG: {
	        name: "Green Intensity",
	        data_type: parseFloat,
	        default_value: 0
	      },
	      colorB: {
	        name: "Blue Intensity",
	        data_type: parseFloat,
	        default_value: 0
	      }
	      //    fwdrop: {
	      //      name: "Voltage drop"
	      //      data_type: parseFloat
	      //      default_value: DiodeElm.DEFAULT_DROP
	      //    }
	    };
	  }
	
	
	  constructor(xa, xb, ya, yb, params, f) {
	    let fwdrop = 2.1024259;
	
	    if (f) {
	      if (params.constructor == Array && params.length > 3) {
	        fwdrop = params.shift();
	      } else {
	        fwdrop = params["fwdrop"] || fwdrop;
	      }
	    }
	
	    super(xa, xb, ya, yb, params, f);
	    // TODO: CHECK!
	    // this.params = {};
	
	    //    if (f & DiodeElm.FLAG_FWDROP) == 0
	    //      @fwdrop = 2.1024259
	    this.fwdrop = fwdrop;
	
	    /*
	    if ((f & DiodeElm.FLAG_FWDROP) === 0) {
	      this.fwdrop = 2.1024259;  //DiodeElm.DEFAULT_DROP
	      this.params['fwdrop'] = 0.805904783;
	    } else {
	      this.fwdrop = parseFloat(params.shift());
	      this.params['fwdrop'] = this.fwdrop;
	    }
	    */
	
	    this.setup();
	
	    this.place();
	  }
	
	  getName() {
	    return "Light Emitting Diode";
	  }
	
	  place() {
	    let cr = 12;
	    this.ledLead1 = Util.interpolate(this.point1, this.point2, 0.5 - (cr / this.dn()));
	    this.ledLead2 = Util.interpolate(this.point1, this.point2, 0.5 + (cr / this.dn()));
	    this.ledCenter = Util.interpolate(this.point1, this.point2, 0.5);
	
	    this.setBboxPt(this.point1, this.point2, cr);
	  }
	
	  needsShortcut() {
	    return false;
	  }
	
	  draw(renderContext) {
	    let cr = 12;
	    
	    this.setBboxPt(this.point1, this.point2, cr);
	
	    let voltageColor = renderContext.getVoltageColor(this.volts[0]);
	    renderContext.drawLinePt(this.point1, this.ledLead1, voltageColor);
	
	    voltageColor = renderContext.getVoltageColor(this.volts[0]);
	    renderContext.drawLinePt(this.ledLead2, this.point2, voltageColor);
	
	    renderContext.drawCircle(this.ledCenter.x, this.ledCenter.y, cr, 2, Settings.PostColor);
	
	    cr -= 4;
	
	    let w = Math.min((255 * this.current) / .01, 255);
	
	//    g.fillOval(ledCenter.x - cr, ledCenter.y - cr, cr * 2, cr * 2);
	    //console.log(@current, w)
	    //console.log("RBG: #{w * @colorR} #{w * @colorG} #{w * @colorB}")
	    let hexcolor = Util.rgb2hex(w * this.colorR, w * this.colorG, w * this.colorB);
	
	    renderContext.fillCircle(this.ledCenter.x, this.ledCenter.y, cr, 2, hexcolor);
	
	    this.updateDots();
	    renderContext.drawDots(this.point1, this.ledLead1, this.curcount);
	    renderContext.drawDots(this.point2, this.ledLead2, -this.curcount);
	
	    renderContext.drawPosts(this);
	
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      super.debugDraw(renderContext);
	    }
	  }
	}
	LedElm.initClass();
	
	
	module.exports = LedElm;


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	let Util = __webpack_require__(5);
	let Settings = __webpack_require__(2);
	
	let Point = __webpack_require__(4);
	
	class PotElm extends CircuitComponent {
	  static get Fields() {
	    return {
	      "maxResistance": {
	        name: "Max Resistance",
	        default_value: 1e4,
	        data_type: parseFloat,
	        range: [0, Infinity],
	        symbol: "Ω"
	      },
	      "position": {
	        name: "Position",
	        default_value: 0.5,
	        range: [0, 1e5],
	        data_type: parseFloat
	      },
	      "sliderText": {
	        name: "Slider Text",
	        default_value: "",
	        data_type(x) {
	          return x;
	        }
	      }
	    };
	  }
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xb, yb, params, f);
	
	    // this.sliderValue = this.position * 100;
	
	    this.setPoints(xa, ya, xb, yb)
	  }
	
	//  draw: (renderContext) ->
	//    super()
	//
	//    @getParentCircuit.halt("Draw not yet implemented for #{this}")
	
	  draw(renderContext) {
	    this.calcLeads(32);
	
	    let numSegments = 16;
	    let width = 5;
	
	//    @setBboxPt @point1, @point2, width
	
	    renderContext.drawLeads(this);
	
	    let parallelOffset = 1 / numSegments;
	
	    // this.updateDots();
	    // renderContext.drawDots(this.point1, this.lead1, this);
	    // renderContext.drawDots(this.lead2, this.point2, this);
	
	    // Generate alternating sequence 0, 1, 0, -1, 0 ... to offset perpendicular to wire
	    let offsets = [0, 1, 0, -1];
	
	    // Draw resistor "zig-zags"
	    for (let n = 0; n < numSegments; n++) {
	      let resistorSegmentVoltage = this.volts[0] + ((this.volts[1]-this.volts[0]) * (n / numSegments));
	
	      let startPosition = Util.interpolate(this.lead1, this.lead2, n*parallelOffset, width*offsets[n % 4]);
	      let endPosition = Util.interpolate(this.lead1, this.lead2, (n+1)*parallelOffset, width*offsets[(n+1) % 4]);
	
	      renderContext.drawLinePt(startPosition, endPosition, renderContext.getVoltageColor(resistorSegmentVoltage), Settings.LINE_WIDTH);
	    }
	
	    let voltColor = renderContext.getVoltageColor(this.volts[2]);
	    // console.log("POSTS", this.post3, this.corner2, this.arrowPoint, this.arrow1, this.arrow2, this.midpoint);
	
	    renderContext.drawCircle(this.post3, this.corner2, voltColor);
	    renderContext.drawLinePt(this.post3, this.corner2, voltColor);
	    renderContext.drawLinePt(this.corner2, this.arrowPoint, voltColor);
	    renderContext.drawLinePt(this.arrow1, this.arrowPoint, voltColor);
	    renderContext.drawLinePt(this.arrow2, this.arrowPoint, voltColor);
	    // drawThickLine(g, corner2, arrowPoint);
	    // drawThickLine(g, arrow1, arrowPoint);
	    // drawThickLine(g, arrow2, arrowPoint);
	
	    // renderContext.drawDots(this.point1, this.lead1, this);
	    // renderContext.drawDots(this.lead2, this.point2, this);
	
	
	    this.curcount_1 = this.updateDots(null, this.current1);
	    renderContext.drawDots(this.point1, this.lead1, this.curcount_1);
	
	    renderContext.drawValue(-this.dir*18, 0, this, Util.getUnitText(this.resistance1, this.unitSymbol()));
	
	    renderContext.drawPosts(this);
	
	    if (this.Circuit && this.Circuit.debugModeEnabled()) {
	      return super.debugDraw(renderContext);
	    }
	  }
	
	  onToggle() {
	    /*
	    console.log(this.post3);
	    console.log(this.corner2);
	    console.log(this.arrowPoint);
	    console.log(this.arrow1);
	    console.log(this.arrow2);
	    */
	  }
	
	  unitSymbol() {
	    return "Ω";
	  }
	
	  adjustmentValueChanged() {
	    this.getParentCircuit().Solver.analyzeFlag = true;
	    this.setPoints();
	  }
	
	  getPostCount() {
	    return 3;
	  }
	
	  getName() {
	    return "Potentiometer"
	  }
	
	  sliderValue() {
	    // return this.position * 100;
	    return 50;
	  }
	
	  setPoints(x1, y1, x2, y2) {
	    let dx;
	    let dy;
	    super.setPoints(x1, y1, x2, y2);
	
	    let offset = 0;
	    this.dir = 0;
	
	    // TODO: Check
	    if (Math.abs(this.dx()) > Math.abs(this.dy())) {   // Horizontal
	      //dx = Util.snapGrid(this.dx() / 2) * 2;
	
	      offset = (this.dx() < 0) ? this.dx() : -this.dx();
	
	      this.dir = Math.sign(this.dx());
	
	      //this.point2.y = this.point1.y;
	
	      offset = Util.snapGrid(-offset/2 + 2*Settings.GRID_SIZE*this.dir);
	    } else {
	      //dy = Util.snapGrid(this.dy() / 2) * 2;
	      // this.point2.y = this.point1.y + dy;
	      offset = (this.dy() > 0) ? this.dy() : -this.dy();
	
	      this.dir = Math.sign(this.dy());
	
	      offset = Util.snapGrid(8*Settings.GRID_SIZE);
	      //this.point2.x = this.point1.x;
	    }
	
	    //offset = this.dn();
	    //console.log(this.point1, this.point2, this.dx(), this.dy());
	
	    if (offset === 0) {
	      offset = 2 * Settings.GRID_SIZE;
	    }
	
	    let dn = this.dn(); //Math.sqrt(Math.pow(this.point1.x - this.point2.x, 2), Math.pow(this.point1.y - this.point2.y, 2));
	
	    let bodyLen = 32;
	
	    this.calcLeads(bodyLen);
	    this.position = this.sliderValue() * 0.0099 + 0.005;
	    let soff = Math.floor((this.position - 0.5) * bodyLen);
	
	    this.post3 = Util.interpolate(this.point1, this.point2, 0.5, offset);
	    this.corner2 = Util.interpolate(this.point1, this.point2, (soff / dn) + 0.5, offset);
	    this.arrowPoint = Util.interpolate(this.point1, this.point2, (soff / dn) + 0.5, 8 * Math.sign(offset));
	    this.midpoint = Util.interpolate(this.point1, this.point2, (soff / dn) + 0.5);
	
	    let clen = Math.abs(offset) - 8;
	
	    [this.arrow1, this.arrow2] = Util.interpolateSymmetrical(this.corner2, this.arrowPoint, (clen - 8) / clen, 8);
	
	    this.ps3 = new Point(0, 0);
	    this.ps4 = new Point(0, 0);
	
	    //console.log("POSTS", this.dir, "offset", offset, "dn", dn, clen, this.position, "post3", this.post3, "corner2", this.corner2, "arrowPoint", this.arrowPoint, this.arrow1, this.arrow2, this.midpoint, "p1", this.point1, "p2", this.p2);
	  }
	
	  getPost(n) {
	    if (n === 0) {
	      return this.point1;
	    } else if (n === 1) {
	      return this.point2;
	    } else {
	      return this.post3;
	    }
	  }
	
	  calculateCurrent() {
	    this.current1 = (this.volts[0] - this.volts[2]) / this.resistance1;
	    this.current2 = (this.volts[1] - this.volts[2]) / this.resistance2;
	    this.current3 = -this.current1 - this.current2;
	  }
	
	  stamp(stamper) {
	    this.resistance1 = this.maxResistance * this.position;
	    this.resistance2 = this.maxResistance * (1 - this.position);
	    stamper.stampResistor(this.nodes[0], this.nodes[2], this.resistance1);
	    return stamper.stampResistor(this.nodes[2], this.nodes[1], this.resistance2);
	  }
	}
	PotElm.initClass();
	
	
	module.exports = PotElm;


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	let RailElm = __webpack_require__(18);
	let VoltageElm = __webpack_require__(19);
	
	class ClockElm extends RailElm {
	  // TODO: Needs params!!
	
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xa, ya, params, f);
	
	    this.waveform = VoltageElm.WF_SQUARE;
	
	    if (!this.maxVoltage) { this.maxVoltage = 2.5; }
	    if (!this.bias) { this.bias = 2.5; }
	    if (!this.frequency) { this.frequency = 100; }
	
	    this.flags |= RailElm.FLAG_CLOCK;
	  }
	
	  getName() {
	    return "Clock Voltage Source"
	  }
	}
	
	module.exports = ClockElm;


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	let Rectangle = __webpack_require__(3);
	let Util = __webpack_require__(5);
	
	class Scope {
	  static initClass() {
	    this.VAL_POWER = 1;
	    this.VAL_IB = 1;
	    this.VAL_IC = 2;
	    this.VAL_IE = 3;
	    this.VAL_VBE = 4;
	    this.VAL_VBC = 5;
	    this.VAL_VCE = 6;
	    this.VAL_R = 2;
	  }
	
	  // Position is a vector of [x1, y1, x2, y2] where x1, y1 is the upper-left corner and x2, y2 is the lower-right corner
	  constructor(position, params) {
	    this.params = params;
	
	    this.elm = parseInt(params['elm']);
	    this.speed = parseFloat(params['speed']);
	    this.value = parseFloat(params['value']);
	    this.options = params['options'];
	    this.voltageRange = parseFloat(params["voltageRange"]);
	    this.currentRange = parseFloat(params["currentRange"]);
	
	    this.pos = parseInt(params['pos']) || 0;
	    this.ye = parseInt(params['ye']) || 0;
	    this.label = params['label'] || "";
	
	    this.context = null;
	
	    if (!position) {
	      // console.log(position, this.pos)
	      // Bounding Box?
	      this.boundingBox = new Rectangle(this.pos * 100, 100, this.pos * 100 + 300, 100);
	    } else {
	      this.boundingBox = new Rectangle(position[0], position[1], position[2] - position[0], position[3] - position[1]);
	    }
	  }
	
	  setCanvas(scopeCanvas) {
	    this.scopeCanvas = scopeCanvas;
	  }
	
	  getCanvas(scopeCanvas) {
	    return this.scopeCanvas;
	  }
	
	  setCircuit(circuit) {
	    this.circuitElm = circuit.getElmByIdx(this.elm);
	    this.circuit = circuit;
	  }
	
	  setContext(context) {
	
	  }
	
	  reset() {
	    let lockScale, showMax, showMin, showV;
	    this.minMaxV = 5;
	    this.minMaxI = 0.1;
	    this.speed = 64;
	    this.showI = showV = showMax = true;
	    this.showFreq = lockScale = showMin = false;
	    this.plot2d = false;
	
	    // no showI for Output
	    if ((elm !== null) && (this.elm instanceof OutputElm || this.elm instanceof LogicOutputElm || this.elm instanceof ProbeElm)) {
	      this.showI = false;
	    }
	
	    this.value = this.ivalue = 0;
	
	    if (this.elm instanceof TransistorElm) {
	      return this.value = VAL_VCE;
	    }
	  }
	
	  getName() {
	    return "Scope Output"
	  }
	
	  resetGraph() {
	    this.scopePointCount = 1;
	
	    while (this.scopePointCount <= this.boundingBox.width) {
	      this.scopePointCount *= 2;
	    }
	
	    this.minV = Util.zeroArray(this.scopePointCount);
	    this.maxV = Util.zeroArray(this.scopePointCount);
	    this.minI = Util.zeroArray(this.scopePointCount);
	    this.maxI = Util.zeroArray(this.scopePointCount);
	
	    return this.ptr = this.ctr = 0;
	  }
	
	  draw(renderContext) {
	    return renderContext.drawLinePt(this.boundingBox.x, this.boundingBox.y, this.boundingBox.x + this.boundingBox.width, this.boundingBox.y + this.boundingBox.height);
	  }
	
	  setElm(ce){
	    return this.elm = ce;
	  }
	
	  serialize() {
	    let pos = [
	      this.boundingBox.x,
	      this.boundingBox.y,
	      this.boundingBox.x + this.boundingBox.width,
	      this.boundingBox.y + this.boundingBox.height
	    ];
	
	    return {
	      name: "Scope",
	      pos: pos,
	      params: {
	        elm: this.elm,
	        speed: this.speed,
	        value: this.value,
	        voltageRange: this.voltageRange,
	        currentRange: this.currentRange,
	        options: this.options,
	        pos: this.pos,
	        ye: this.ye
	      }
	    }
	  }
	
	  sampleVoltage(time, voltage) {
	    if (this.scopeCanvas) {
	      this.scopeCanvas.addVoltage(time, voltage);
	    }
	  }
	
	  redraw() {
	    if (this.scopeCanvas) {
	      this.scopeCanvas.redraw();
	    }
	  }
	
	  sampleCurrent(time, voltage) {
	    if (this.scopeCanvas) {
	      this.scopeCanvas.addCurrent(time, voltage);
	    }
	  }
	
	  static tokenize(inputStr) {
	    // inputStr = "1 64 0 34 12.0 1.220703125E-5 0 -1";
	
	    let tokens = inputStr.split(" ");
	
	    tokens.shift();
	    let elm = parseInt(tokens[0]);
	    let speed = parseFloat(tokens[1]);
	    let value = parseFloat(tokens[2]);
	    let options = parseInt(tokens[3]);
	
	    let voltageRange
	    if (tokens.length > 4)
	      voltageRange = parseFloat(tokens[4]);
	
	    let currentRange
	    if (tokens.length > 5)
	      currentRange = parseFloat(tokens[5]);
	
	    let pos;
	    if (tokens.length > 6)
	      pos = parseInt(tokens[6]);
	
	    let ye;
	    if (tokens.length > 7)
	      ye = parseFloat(tokens[7]);
	
	    let label;
	    if (tokens.length > 8)
	      label = tokens[8];
	
	    return {
	      elm,
	      speed,
	      value,
	      options,
	      voltageRange,
	      currentRange,
	      pos,
	      ye,
	      label
	    }
	  }
	
	}
	Scope.initClass();
	
	
	module.exports = Scope;


/***/ },
/* 76 */
/***/ function(module, exports) {

	class SimulationParams {
	  //  TODO: Deprecate
	  constructor(params = {}) {
	    this.completionStatus = params['completion_status'] || "in development";
	    this.createdAt = params['created_at'] || "?";
	    this.currentSpeed = parseFloat(params['currentSpeed'] || 63);
	    this.updatedAt = params['updated_at'] || "?";
	    this.description = params['description'] || "";
	    this.flags = parseInt(params['flags'] || 1);
	    this.id = params['id'] || null;
	    this.powerRange = parseFloat(params['powerRange'] || 62.0);
	    this.voltageRange = parseFloat(params['voltageRange'] || 10.0);
	    this.simSpeed = parseFloat(params['simSpeed'] || 10);
	    this.timeStep = parseFloat(params['timeStep'] || 5.0e-06);
	    this.title = params['title'] || "Default";
	    this.topic = params['topic'] || null;
	    this.debug = params['debug'] || null;
	  }
	  
	  toJson() {
	    return {
	      completion_status: this.completionStatus,
	      created_at: this.createdAt,
	      current_speed: this.currentSpeed,
	      updated_at: this.updatedAt,
	      description: this.description,
	      flags: this.flags,
	      id: this.id,
	      power_range: this.powerRange,
	      voltage_range: this.voltageRange,
	      simSpeed: this.simSpeed,
	      timeStep: this.timeStep,
	      title: this.title,
	      topic: this.topic,
	      debug: this.debug
	    };
	  }
	
	  toString() {
	    return [
	      `\tFlags:       ${this.flags}`,
	      `\tTimeStep:    ${this.timeStep.toFixed(7)}`,
	      `\tSim Speed:   ${this.simSpeed}`,
	      `\tCur Speed:   ${this.currentSpeed}`,
	      `\tVolt. Range: ${this.voltageRange.toFixed(2)}`,
	      `\tPwr Range:   ${this.powerRange}`,
	      ""
	    ].join("\n");
	  }
	
	  setCurrentMult(mult) {
	    return this.currentMult = mult;
	  }
	
	  getCurrentMult() {
	    return this.currentMult;
	  }
	}
	
	module.exports = SimulationParams;
	


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	//###################################################################################################################
	
	// Circuit:
	//     Top-level class for defining a Circuit. An array of components, and nodes are managed by a central
	//     solver that updates and recalculates the conductance matrix every frame.
	//
	// @author Anthony Erlinger
	// @date 2011-2013
	//
	// Uses the Observer Design Pattern:
	//   Observes: <none>
	//   Observed By: Solver, Render
	//
	//
	// Event Message Passing interface:
	//   ON_UPDATE
	//   ON_PAUSE
	//   ON_RESUME
	//
	//   ON_ADD_COMPONENT
	//   ON_REMOVE_COMPONENT
	//
	//###################################################################################################################
	
	let Oscilloscope = __webpack_require__(78);
	let Logger = __webpack_require__(79);
	let SimulationParams = __webpack_require__(76);
	let SimulationFrame = __webpack_require__(80);
	let CircuitSolver = __webpack_require__(81);
	let Observer = __webpack_require__(87);
	let Rectangle = __webpack_require__(3);
	let Util = __webpack_require__(5);
	let environment = __webpack_require__(10);
	
	fs = __webpack_require__(88);
	
	
	class Circuit extends Observer {
	  static initClass() {
	    this.DEBUG = false;
	
	    this.components = [
	      // Working
	      "WireElm",
	      "ResistorElm",
	      "GroundElm",
	      "InductorElm",
	      "CapacitorElm",
	      "VoltageElm",
	      "DiodeElm",
	      "SwitchElm",
	      "SparkGapElm",
	      "OpAmpElm",
	      "MosfetElm",
	
	      // Testing
	      "RailElm",
	      "VarRailElm",
	      "ZenerElm",
	      "CurrentElm",
	      "TransistorElm",
	
	      // In progress:
	      "Switch2Elm",  // Needs interaction
	      "TextElm",
	      "ProbeElm",
	      "OutputElm"
	    ];
	
	    // Messages Dispatched to listeners:
	    //###################################################################################################################
	
	    this.ON_START_UPDATE = "ON_START_UPDATE";
	    this.ON_COMPLETE_UPDATE = "ON_END_UPDATE";
	
	    this.ON_RESET = "ON_RESET";
	
	    this.ON_SOLDER = "ON_SOLDER";
	    this.ON_DESOLDER = "ON_DESOLDER";
	
	    this.ON_ADD_COMPONENT = "ON_ADD_COMPONENT";
	    this.ON_REMOVE_COMPONENT = "ON_MOVE_COMPONENT";
	    this.ON_MOVE_COMPONENT = "ON_MOVE_COMPONENT";
	
	    this.ON_ERROR = "ON_ERROR";
	    this.ON_WARNING = "ON_WARNING";
	
	    this.hintMap = {
	      1: "HINT_LC",
	      2: "HINT_RC",
	      3: "HINT_3DB_C",
	      4: "HINT_TWINT",
	      5: "HINT_3DB_L"
	    }
	  }
	
	
	  constructor(name) {
	    super();
	
	    if (name == null) {
	      name = "untitled";
	    }
	    this.name = name;
	    this.Params = new SimulationParams();
	
	    this.hintType = null;
	    this.hintItem1 = null;
	    this.hintItem2 = null;
	
	    this.flags = 0;
	    this.isStopped = false;
	
	    this.clearAndReset();
	  }
	
	  /**
	   * Removes all circuit elements and scopes from the workspace and resets time to zero.
	   *
	   * Called on initialization and reset.
	   */
	  clearAndReset() {
	    for (let element of Array.from((this.elementList != null))) {
	      element.destroy();
	    }
	
	    this.Solver = new CircuitSolver(this);
	    this.boundingBox = null;
	
	    this.nodeList = [];
	    this.elementList = [];
	    this.voltageSources = [];
	
	    this.scopes = [];
	
	    this.time = 0;
	    this.iterations = 0;
	    this.lastFrameTime = 0;
	
	    this.clearErrors();
	    return this.notifyObservers(this.ON_RESET);
	  }
	
	
	  /**
	   * "Solders" a new element to this circuit (adds it to the element list array).
	   */
	  solder(newElement) {
	    if (Array.from(this.elementList).includes(newElement)) {
	      this.halt(`Circuit component ${newElement} is already in element list`);
	    }
	
	    this.notifyObservers(this.ON_SOLDER);
	
	    newElement.Circuit = this;
	    // newElement.setPoints(newElement.x1, newElement.y1, newElement.x2, newElement.y2);
	    //newElement.recomputeBounds();
	
	    this.elementList.push(newElement);
	
	    newElement.onSolder(this);
	
	    this.invalidate();
	    this.recomputeBounds();
	  }
	
	  /**
	   * "Desolders" an existing element to this circuit (removes it to the element list array).
	   */
	  desolder(component) {
	    this.notifyObservers(this.ON_DESOLDER);
	
	    component.Circuit = null;
	    Util.removeFromArray(this.elementList, component);
	
	    // TODO: REMOVE NODES
	
	    for (let nodeIdx of component.nodes) {
	      let node = this.getNode(nodeIdx);
	
	      console.log("DE", node.getNeighboringElements());
	
	      if (node.getNeighboringElements() == [this]) {
	        console.log("Orphaned node: ", nodeIdx)
	      }
	    }
	
	    this.invalidate();
	    this.recomputeBounds();
	  }
	
	  debugModeEnabled() {
	    return Circuit.DEBUG || this.Params.debug;
	  }
	
	  toString() {
	    return this.Params;
	  }
	
	  inspect() {
	    return this.elementList.map(elm => elm.inspect());
	  }
	
	  invalidate() {
	    return this.Solver.analyzeFlag = true;
	  }
	
	  dump() {
	    let out = "";
	
	    for (let elm of Array.from(this.getElements())) {
	      out += elm.dump() + "\n";
	    }
	
	    return out;
	  }
	
	  getVoltageForNode(nodeIdx) {
	    if (this.nodeList[nodeIdx].links[0]) {
	      return this.nodeList[nodeIdx].links[0].elm.getVoltageForNode(nodeIdx);
	    }
	  }
	
	  //###################################################################################################################
	  /* Simulation Frame Computation
	   *///################################################################################################################
	
	  /*
	   UpdateCircuit: Updates the circuit each frame.
	   1. ) Reconstruct Circuit:
	   Rebuilds a data representation of the circuit (only applied when circuit changes)
	   2. ) Solve Circuit build matrix representation of the circuit solve for the voltage and current for each component.
	   Solving is performed via LU factorization.
	   */
	  updateCircuit() {
	
	    if (this.isStopped) {
	      this.Solver.lastTime = 0;
	    } else {
	      this.frameStartTime = Date.now();
	
	      this.notifyObservers(this.ON_START_UPDATE);
	      this.Solver.reconstruct();
	      this.Solver.solveCircuit();
	      this.notifyObservers(this.ON_COMPLETE_UPDATE);
	
	      for (let scope of this.scopes) {
	        if (scope.circuitElm) {
	          // console.log(scope.circuitElm.getVoltageDiff());
	          // scope.sampleVoltage(this.time, scope.circuitElm.getVoltageDiff());
	          // scope.sampleCurrent(this.time, scope.circuitElm.getCurrent());
	          scope.redraw()
	        }
	      }
	
	      this.frameEndTime = Date.now();
	
	      this.lastFrameTime = this.frameEndTime - this.frameStartTime;
	
	      // console.log(this.Solver.circuitMatrix);
	      // console.log(this.Solver.circuitRightSide);
	      // console.log(this.Solver.circuitRowInfo);
	    }
	
	//    @write(@Solver.dumpFrame() + "\n")
	//    @write(@dump() + "\n")
	  }
	
	  setSelected(component) {
	    return (() => {
	      let result = [];
	      for (let elm of Array.from(this.elementList)) {
	        let item;
	        if (elm === component) {
	          this.selectedElm = component;
	          item = component.setSelected(true);
	        }
	        result.push(item);
	      }
	      return result;
	    })();
	  }
	
	  warn(message) {
	    Logger.warn(message);
	    return this.warnMessage = message;
	  }
	
	  halt(message) {
	    let e = new Error(message);
	
	    console.warn(e.stack);
	    Logger.error(message);
	
	    return this.stopMessage = message;
	  }
	
	  clearErrors() {
	    this.stopMessage = null;
	    return this.stopElm = null;
	  }
	
	
	  //#####################################################N##############################################################
	  /* Circuit Element Accessors:
	   *///################################################################################################################
	
	  getIterationCount() {
	    return this.Solver.iterations;
	  }
	
	  getScopes() {
	    return this.scopes;
	  }
	
	  findElm(searchElm) {
	    for (let circuitElm of Array.from(this.elementList)) {
	      if (searchElm === circuitElm) {
	        return circuitElm;
	      }
	    }
	    return false;
	  }
	
	  //TODO: It may be worthwhile to return a defensive copy here
	  getElements() {
	    return this.elementList;
	  }
	
	  getElmByIdx(elmIdx) {
	    return this.elementList[elmIdx];
	  }
	
	  numElements() {
	    return this.elementList.length;
	  }
	
	  //TODO: It may be worthwhile to return a defensive copy here
	  getVoltageSources() {
	    return this.voltageSources;
	  }
	
	  recomputeBounds() {
	    let minX = 10000000000;
	    let minY = 10000000000;
	    let maxX = -10000000000;
	    let maxY = -10000000000;
	
	    this.eachComponent(function (component) {
	      let componentBounds = component.boundingBox;
	
	      let componentMinX = componentBounds.x;
	      let componentMinY = componentBounds.y;
	      let componentMaxX = componentBounds.x + componentBounds.width;
	      let componentMaxY = componentBounds.y + componentBounds.height;
	
	      if (componentMinX < minX) {
	        minX = componentMinX;
	      }
	
	      if (componentMinY < minY) {
	        minY = componentMinY;
	      }
	
	      if (componentMaxX > maxX) {
	        maxX = componentMaxX;
	      }
	
	      if (componentMaxY > maxY) {
	        maxY = componentMaxY;
	      }
	    });
	
	    return this.boundingBox = new Rectangle(minX, minY, maxX - minX, maxY - minY);
	  }
	
	
	  getBoundingBox() {
	    return this.boundingBox;
	  }
	
	  //###################################################################################################################
	  /* Nodes
	   *///################################################################################################################
	
	  resetNodes() {
	    return this.nodeList = [];
	  }
	
	  addScope(scope) {
	    scope.setCircuit(this);
	
	    this.scopes.push(scope);
	  }
	
	  addCircuitNode(circuitNode) {
	    return this.nodeList.push(circuitNode);
	  }
	
	  getNode(idx) {
	    return this.nodeList[idx];
	  }
	
	  getNodeAtCoordinates(x, y) {
	    for (let node of Array.from(this.nodeList)) {
	      if ((node.x === x) && (node.y === y)) {
	        return node;
	      }
	    }
	  }
	
	  getNodes() {
	    return this.nodeList;
	  }
	
	  getRowInfo() {
	    return this.Solver.circuitRowInfo;
	  }
	
	  numNodes() {
	    return this.nodeList.length;
	  }
	
	  findBadNodes() {
	    this.badNodes = [];
	
	    for (let circuitNode of Array.from(this.nodeList)) {
	      if (!circuitNode.intern && (circuitNode.links.length === 1)) {
	        let numBadPoints = 0;
	        let firstCircuitNode = circuitNode.links[0];
	        for (let circuitElm of Array.from(this.elementList)) {
	          // If firstCircuitNode isn't the same as the second
	          if ((firstCircuitNode.elm.equalTo(circuitElm) === false) && circuitElm.boundingBox.contains(circuitNode.x,
	                  circuitNode.y)) {
	            numBadPoints++;
	          }
	        }
	        if (numBadPoints > 0) {
	          // Todo: outline bad nodes here
	          this.badNodes.push(circuitNode);
	        }
	      }
	    }
	
	    return this.badNodes;
	  }
	
	  destroy(components) {
	    for (let component of components) {
	      for (let circuitComponent of Array.from(this.getElements())) {
	        if (circuitComponent.equalTo(component))
	          this.desolder(circuitComponent, true);
	      }
	    }
	  }
	
	
	  pause() {
	    this.isStopped = true;
	  }
	
	  resume() {
	    this.isStopped = false;
	  }
	
	
	  //###################################################################################################################
	  /* Simulation Accessor Methods
	   *///################################################################################################################
	
	  subIterations() {
	    return this.Solver.subIterations;
	  }
	
	  eachComponent(callback) {
	    return Array.from(this.elementList).map((component) =>
	        callback(component));
	  }
	
	  timeStep() {
	    return this.Params.timeStep;
	  }
	
	  getTime() {
	    return this.time;
	  }
	
	  voltageRange() {
	    return this.Params.voltageRange;
	  }
	
	  powerRange() {
	    return this.Params.powerRange;
	  }
	
	  currentSpeed() {
	    return this.Params.currentSpeed;
	  }
	
	  simSpeed() {
	    return this.Params.simSpeed;
	  }
	
	  getState() {
	    return this.state;
	  }
	
	  getStamper() {
	    return this.Solver.getStamper();
	  }
	
	  setHint(type, item1, item2) {
	
	    if (typeof type == "string") {
	      if (parseInt(type)) {
	        this.hintType = Circuit.hintMap[parseInt(type)];
	      } else {
	        this.hintType = type;
	      }
	    } else {
	      this.hintType = Circuit.hintMap[parseInt(type)];
	    }
	    this.hintItem1 = parseInt(item1);
	    this.hintItem2 = parseInt(item2);
	  }
	
	  serialize() {
	    let hint;
	
	    if (this.hintType) {
	      hint = {
	        name: "Hint",
	        hintType: this.hintType,
	        hintItem1: this.hintItem1,
	        hintItem2: this.hintItem2
	      }
	    }
	
	    let circuitObj = [{
	          type: this.Params.name,
	          timeStep: this.timeStep(),
	          simSpeed: this.simSpeed(),
	          currentSpeed: this.currentSpeed(),
	          voltageRange: this.voltageRange(),
	          powerRange: this.powerRange(),
	          flags: this.flags
	        }]
	            .concat(this.elementList.map(element => element.serialize()))
	            .concat(this.scopes.map(scope => scope.serialize()))
	        ;
	
	    if (hint)
	      circuitObj.push(hint);
	
	    return circuitObj
	  }
	
	  toJson() {
	    return {
	      startCircuit: this.Params.name,
	      timeStep: this.timeStep(),
	      flags: this.flags,
	      circuitNonLinear: this.Solver.circuitNonLinear,
	      voltageSourceCount: this.voltageSourceCount,
	      circuitMatrixSize: this.Solver.circuitMatrixSize,
	      circuitMatrixFullSize: this.Solver.circuitMatrixFullSize,
	      circuitPermute: this.Solver.circuitPermute,
	      voltageSources: this.getVoltageSources().map(elm => elm.toJson()),
	      circuitRowInfo: this.Solver.circuitRowInfo.map(rowInfo => rowInfo.toJson()),
	      elmList: this.elementList.map(element => element.toJson()),
	      nodeList: this.nodeList.map(node => node.toJson())
	    };
	  }
	
	  frameJson() {
	    return {
	      nFrames: this.iterations,
	      t: this.time,
	      circuitMatrix: this.Solver.circuitMatrix,
	      circuitRightSide: this.Solver.circuitRightSide,
	      simulationFrames: this.Solver.simulationFrames.map(element => element.toJson())
	    };
	  }
	
	  dumpFrameJson(filename) {
	    let circuitFramsJson;
	    if (filename == null) {
	      filename = `./dump/${this.Params.name}_FRAMES.json`;
	    }
	    circuitFramsJson = JSON.stringify(this.frameJson(), null, 2);
	
	    return fs.writeFileSync(filename, circuitFramsJson)
	  }
	
	  dumpAnalysisJson() {
	    let circuitAnalysisJson = JSON.stringify(this.toJson(), null, 2);
	
	    return fs.writeFileSync("./dump/#{@Params.name}_ANALYSIS.json", circuitAnalysisJson)
	  }
	}
	
	Circuit.initClass();
	
	
	module.exports = Circuit;


/***/ },
/* 78 */
/***/ function(module, exports) {

	class Oscilloscope {
	  constructor() {
	    this.voltageBuffer = [];
	    this.currentBuffer = [];
	    this.onUpdate = null;
	  }
	
	  setOutputNode(n) {
	    return this.nodeOutput = n;
	  }
	
	  setReferenceNode(n) {
	    return this.nodeRef = n;
	  }
	
	  setComponent(component) {
	    return this.component = component;
	  }
	
	  sampleVoltage() {
	    if (!this.nodeOutput || !this.nodeRef) {
	      console.error("Node output and reference not set for oscilloscope!");
	    }
	
	    return voltageBuffer.add();
	  }
	
	  sampleCurrent() {
	    return currentBuffer.add();
	  }
	}
	
	
	
	
	
	module.exports = Oscilloscope;


/***/ },
/* 79 */
/***/ function(module, exports) {

	let errorStack = undefined;
	let warningStack = undefined;
	class Logger {
	  static initClass() {
	  
	    errorStack = new Array();
	    warningStack = new Array();
	  }
	
	  static error(msg) {
	    console.error(`Error: ${msg}`);
	    return errorStack.push(msg);
	  }
	
	  static warn(msg) {
	    console.error(`Warning: ${msg}`);
	    return warningStack.push(msg);
	  }
	}
	Logger.initClass();
	
	
	module.exports = Logger;


/***/ },
/* 80 */
/***/ function(module, exports) {

	class SimulationFrame {
	
	  constructor(circuit) {
	    let solver = circuit.Solver;
	
	    this.frameNumber = circuit.iterations;
	    this.time = circuit.time;
	
	    this.circuitMatrix = solver.circuitMatrix;
	    this.circuitRightSide = solver.circuitRightSide;
	
	    this.elementStates = (Array.from(circuit.getElements()).map((elm) => ({
	      volts: elm.volts,
	      current: elm.current,
	      curcount: elm.curcount || 0
	    })));
	  }
	
	  toJson() {
	    return {
	      frameNumber: this.frameNumber,
	      time: this.time,
	      circuitMatrix: this.circuitMatrix,
	      circuitRightSide: this.circuitRightSide,
	      elementStates: this.elementStates
	    };
	  }
	}
	
	module.exports = SimulationFrame;


/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	var CapacitorElm, CircuitNode, CircuitNodeLink, CircuitSolver, CurrentElm, GroundElm, InductorElm, MatrixStamper, Pathfinder, RailElm, RowInfo, Setting, SimulationFrame, Util, VoltageElm, WireElm, sprintf;
	
	MatrixStamper = __webpack_require__(82);
	
	Pathfinder = __webpack_require__(84);
	
	CircuitNode = __webpack_require__(85);
	
	CircuitNodeLink = __webpack_require__(86);
	
	RowInfo = __webpack_require__(83);
	
	Setting = __webpack_require__(2);
	
	Util = __webpack_require__(5);
	
	SimulationFrame = __webpack_require__(80);
	
	GroundElm = __webpack_require__(23);
	
	RailElm = __webpack_require__(18);
	
	VoltageElm = __webpack_require__(19);
	
	WireElm = __webpack_require__(20);
	
	CapacitorElm = __webpack_require__(27);
	
	InductorElm = __webpack_require__(28);
	
	CurrentElm = __webpack_require__(30);
	
	sprintf = __webpack_require__(9).sprintf;
	
	CircuitSolver = (function() {
	  CircuitSolver.SIZE_LIMIT = 100;
	
	  CircuitSolver.MAXIMUM_SUBITERATIONS = 5000;
	
	  function CircuitSolver(Circuit) {
	    this.Circuit = Circuit;
	    this.scaleFactors = Util.zeroArray(400);
	    this.reset();
	    this.Stamper = new MatrixStamper(this.Circuit);
	  }
	
	  CircuitSolver.prototype.reset = function() {
	    this.Circuit.time = 0;
	    this.iterations = 0;
	    this.converged = true;
	    this.subIterations = 5000;
	    this.circuitMatrix = [];
	    this.circuitRightSide = [];
	    this.origMatrix = [];
	    this.origRightSide = [];
	    this.circuitRowInfo = [];
	    this.circuitPermute = [];
	    this.circuitNonLinear = false;
	    this.lastTime = 0;
	    this.secTime = 0;
	    this.lastFrameTime = 0;
	    this.lastIterTime = 0;
	    this.analyzeFlag = true;
	    return this.simulationFrames = [];
	  };
	
	  CircuitSolver.prototype.reconstruct = function() {
	    if (!this.analyzeFlag || (this.Circuit.numElements() === 0)) {
	      return;
	    }
	    this.Circuit.clearErrors();
	    this.Circuit.resetNodes();
	    this.discoverGroundReference();
	    this.constructCircuitGraph();
	    this.constructMatrixEquations();
	    this.checkConnectivity();
	    this.findInvalidPaths();
	    this.optimize();
	    if (this.circuitLinear()) {
	      return this.luFactor(this.circuitMatrix, this.circuitMatrixSize, this.circuitPermute);
	    }
	  };
	
	  CircuitSolver.prototype.solveCircuit = function() {
	    var circuitElm, iter, j, lit, res, scope, stepRate, subiter, tm, _i, _j, _k, _l, _len, _len1, _len2, _m, _ref, _ref1, _ref2, _ref3, _ref4;
	    if ((this.circuitMatrix == null) || this.Circuit.numElements() === 0) {
	      this.circuitMatrix = null;
	      return;
	    }
	    this.sysTime = (new Date()).getTime();
	    stepRate = Math.floor(160 * this.getIterCount());
	    tm = (new Date()).getTime();
	    lit = this.lastIterTime;
	    iter = 1;
	    while (true) {
	      ++this.steps;
	      _ref = this.Circuit.getElements();
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        circuitElm = _ref[_i];
	        circuitElm.startIteration();
	      }
	      for (subiter = _j = 0, _ref1 = CircuitSolver.MAXIMUM_SUBITERATIONS; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; subiter = 0 <= _ref1 ? ++_j : --_j) {
	        this.converged = true;
	        this.subIterations = subiter;
	        this.restoreOriginalMatrixState();
	        _ref2 = this.Circuit.getElements();
	        for (_k = 0, _len1 = _ref2.length; _k < _len1; _k++) {
	          circuitElm = _ref2[_k];
	          circuitElm.doStep(this.Stamper);
	        }
	        if (this.circuitNonLinear) {
	          if (this.converged && subiter > 0) {
	            break;
	          }
	          this.luFactor(this.circuitMatrix, this.circuitMatrixSize, this.circuitPermute);
	        }
	        this.luSolve(this.circuitMatrix, this.circuitMatrixSize, this.circuitPermute, this.circuitRightSide);
	        for (j = _l = 0, _ref3 = this.circuitMatrixFullSize; 0 <= _ref3 ? _l < _ref3 : _l > _ref3; j = 0 <= _ref3 ? ++_l : --_l) {
	          res = this.getValueFromNode(j);
	          if (!this.updateComponent(j, res)) {
	            break;
	          }
	        }
	        if (this.circuitLinear()) {
	          break;
	        }
	      }
	      if (subiter >= CircuitSolver.MAXIMUM_SUBITERATIONS) {
	        this.halt("Convergence failed: " + subiter, null);
	        break;
	      }
	      this.Circuit.time += this.Circuit.timeStep();
	      if ((iter + 20) % 21 === 0) {
	        _ref4 = this.Circuit.scopes;
	        for (_m = 0, _len2 = _ref4.length; _m < _len2; _m++) {
	          scope = _ref4[_m];
	          if (scope.circuitElm) {
	            scope.sampleVoltage(this.Circuit.time, scope.circuitElm.getVoltageDiff());
	            scope.sampleCurrent(this.Circuit.time, scope.circuitElm.getCurrent());
	          }
	        }
	      }
	      tm = (new Date()).getTime();
	      lit = tm;
	      if ((tm - this.lastFrameTime) > 300) {
	        break;
	      }
	      if (iter * 1000 >= stepRate * (tm - this.lastIterTime)) {
	        break;
	      }
	      ++iter;
	    }
	    this.frames++;
	    this.Circuit.iterations++;
	    this.simulationFrames.push(new SimulationFrame(this.Circuit));
	    return this._updateTimings(lit);
	  };
	
	  CircuitSolver.prototype.circuitLinear = function() {
	    return !this.circuitNonLinear;
	  };
	
	  CircuitSolver.prototype._updateTimings = function(lastIterationTime) {
	    var currentSpeed, inc, sysTime;
	    this.lastIterTime = lastIterationTime;
	    sysTime = (new Date()).getTime();
	    if (this.lastTime !== 0) {
	      inc = Math.floor(sysTime - this.lastTime);
	      currentSpeed = Math.exp(this.Circuit.currentSpeed() / 3.5 - 14.2);
	      this.Circuit.Params.setCurrentMult(1.7 * inc * currentSpeed);
	    }
	    if ((sysTime - this.secTime) >= 1000) {
	      this.frames = 0;
	      this.steps = 0;
	      this.secTime = sysTime;
	    }
	    this.lastTime = sysTime;
	    this.lastFrameTime = this.lastTime;
	    return this.iterations++;
	  };
	
	  CircuitSolver.prototype.getStamper = function() {
	    return this.Stamper;
	  };
	
	  CircuitSolver.prototype.getIterCount = function() {
	    var sim_speed;
	    sim_speed = this.Circuit.simSpeed();
	    return 0.1 * Math.exp((sim_speed - 61.0) / 24.0);
	  };
	
	  CircuitSolver.prototype.discoverGroundReference = function() {
	    var ce, circuitNode, gotGround, gotRail, pt, volt, _i, _len, _ref;
	    gotGround = false;
	    gotRail = false;
	    volt = null;
	    _ref = this.Circuit.getElements();
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      ce = _ref[_i];
	      if (ce instanceof GroundElm) {
	        gotGround = true;
	        break;
	      }
	      if (Util.typeOf(ce, RailElm)) {
	        gotRail = true;
	      }
	      if ((volt == null) && Util.typeOf(ce, VoltageElm)) {
	        volt = ce;
	      }
	    }
	    circuitNode = new CircuitNode(this);
	    circuitNode.x = circuitNode.y = -1;
	    if (!gotGround && !gotRail && (volt != null)) {
	      pt = volt.getPost(0);
	      circuitNode.x = pt.x;
	      circuitNode.y = pt.y;
	    }
	    return this.Circuit.addCircuitNode(circuitNode);
	  };
	
	  CircuitSolver.prototype.buildComponentNodes = function() {
	    var circuitElm, circuitNode, internalLink, internalNode, internalNodeCount, internalNodeIdx, internalVSCount, nodeIdx, nodeLink, postCount, postIdx, postPt, voltageSourceCount, _i, _j, _k, _l, _len, _ref, _ref1, _results;
	    voltageSourceCount = 0;
	    _ref = this.Circuit.getElements();
	    _results = [];
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      circuitElm = _ref[_i];
	      internalNodeCount = circuitElm.getInternalNodeCount();
	      internalVSCount = circuitElm.getVoltageSourceCount();
	      postCount = circuitElm.getPostCount();
	      for (postIdx = _j = 0; 0 <= postCount ? _j < postCount : _j > postCount; postIdx = 0 <= postCount ? ++_j : --_j) {
	        postPt = circuitElm.getPost(postIdx);
	        for (nodeIdx = _k = 0, _ref1 = this.Circuit.numNodes(); 0 <= _ref1 ? _k < _ref1 : _k > _ref1; nodeIdx = 0 <= _ref1 ? ++_k : --_k) {
	          circuitNode = this.Circuit.getNode(nodeIdx);
	          if (Util.overlappingPoints(postPt, circuitNode)) {
	            break;
	          }
	        }
	        nodeLink = new CircuitNodeLink();
	        nodeLink.num = postIdx;
	        nodeLink.elm = circuitElm;
	        if (nodeIdx === this.Circuit.numNodes()) {
	          circuitNode = new CircuitNode(this, postPt.x, postPt.y);
	          circuitNode.links.push(nodeLink);
	          circuitElm.setNode(postIdx, this.Circuit.numNodes());
	          this.Circuit.addCircuitNode(circuitNode);
	        } else {
	          this.Circuit.getNode(nodeIdx).links.push(nodeLink);
	          circuitElm.setNode(postIdx, nodeIdx);
	          if (nodeIdx === 0) {
	            circuitElm.setNodeVoltage(postIdx, 0);
	          }
	        }
	      }
	      for (internalNodeIdx = _l = 0; 0 <= internalNodeCount ? _l < internalNodeCount : _l > internalNodeCount; internalNodeIdx = 0 <= internalNodeCount ? ++_l : --_l) {
	        internalLink = new CircuitNodeLink();
	        internalLink.num = internalNodeIdx + postCount;
	        internalLink.elm = circuitElm;
	        internalNode = new CircuitNode(this, -1, -1, true);
	        internalNode.links.push(internalLink);
	        circuitElm.setNode(internalLink.num, this.Circuit.numNodes());
	        this.Circuit.addCircuitNode(internalNode);
	      }
	      _results.push(voltageSourceCount += internalVSCount);
	    }
	    return _results;
	  };
	
	  CircuitSolver.prototype.constructCircuitGraph = function() {
	    var circuitElement, voltSourceIdx, voltageSourceCount, _i, _j, _len, _ref, _ref1;
	    this.buildComponentNodes();
	    this.Circuit.voltageSources = new Array(voltageSourceCount);
	    voltageSourceCount = 0;
	    this.circuitNonLinear = false;
	    _ref = this.Circuit.getElements();
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      circuitElement = _ref[_i];
	      if (circuitElement.nonLinear()) {
	        this.circuitNonLinear = true;
	      }
	      for (voltSourceIdx = _j = 0, _ref1 = circuitElement.getVoltageSourceCount(); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; voltSourceIdx = 0 <= _ref1 ? ++_j : --_j) {
	        this.Circuit.voltageSources[voltageSourceCount] = circuitElement;
	        circuitElement.setVoltageSource(voltSourceIdx, voltageSourceCount++);
	      }
	    }
	    this.Circuit.voltageSourceCount = voltageSourceCount;
	    return this.matrixSize = this.Circuit.numNodes() + voltageSourceCount - 1;
	  };
	
	  CircuitSolver.prototype.constructMatrixEquations = function() {
	    var circuitElm, rowIdx, _i, _j, _len, _ref, _ref1, _results;
	    this.circuitMatrixSize = this.circuitMatrixFullSize = this.matrixSize;
	    this.circuitMatrix = Util.zeroArray2(this.matrixSize, this.matrixSize);
	    this.origMatrix = Util.zeroArray2(this.matrixSize, this.matrixSize);
	    this.circuitRightSide = Util.zeroArray(this.matrixSize);
	    this.origRightSide = Util.zeroArray(this.matrixSize);
	    this.circuitRowInfo = Util.zeroArray(this.matrixSize);
	    this.circuitPermute = Util.zeroArray(this.matrixSize);
	    for (rowIdx = _i = 0, _ref = this.matrixSize; 0 <= _ref ? _i < _ref : _i > _ref; rowIdx = 0 <= _ref ? ++_i : --_i) {
	      this.circuitRowInfo[rowIdx] = new RowInfo();
	    }
	    this.circuitNeedsMap = false;
	    _ref1 = this.Circuit.getElements();
	    _results = [];
	    for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
	      circuitElm = _ref1[_j];
	      _results.push(circuitElm.stamp(this.Stamper));
	    }
	    return _results;
	  };
	
	  CircuitSolver.prototype.checkConnectivity = function() {
	    var changed, circuitElm, closure, nodeIdx, postIdx, siblingNode, siblingPostIdx, _i, _j, _k, _len, _ref, _ref1, _ref2, _results;
	    closure = new Array(this.Circuit.numNodes());
	    closure[0] = true;
	    changed = true;
	    _results = [];
	    while (changed) {
	      changed = false;
	      _ref = this.Circuit.getElements();
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        circuitElm = _ref[_i];
	        for (postIdx = _j = 0, _ref1 = circuitElm.getPostCount(); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; postIdx = 0 <= _ref1 ? ++_j : --_j) {
	          if (!closure[circuitElm.getNode(postIdx)]) {
	            if (circuitElm.hasGroundConnection(postIdx)) {
	              changed = true;
	              closure[circuitElm.getNode(postIdx)] = true;
	            }
	            continue;
	          }
	          for (siblingPostIdx = _k = 0, _ref2 = circuitElm.getPostCount(); 0 <= _ref2 ? _k < _ref2 : _k > _ref2; siblingPostIdx = 0 <= _ref2 ? ++_k : --_k) {
	            if (postIdx === siblingPostIdx) {
	              continue;
	            }
	            siblingNode = circuitElm.getNode(siblingPostIdx);
	            if (circuitElm.getConnection(postIdx, siblingPostIdx) && !closure[siblingNode]) {
	              closure[siblingNode] = true;
	              changed = true;
	            }
	          }
	        }
	      }
	      if (changed) {
	        continue;
	      }
	      _results.push((function() {
	        var _l, _ref3, _results1;
	        _results1 = [];
	        for (nodeIdx = _l = 0, _ref3 = this.Circuit.numNodes(); 0 <= _ref3 ? _l < _ref3 : _l > _ref3; nodeIdx = 0 <= _ref3 ? ++_l : --_l) {
	          if (!closure[nodeIdx] && !this.Circuit.nodeList[nodeIdx].intern) {
	            console.warn("Node " + nodeIdx + " unconnected! -> " + (this.Circuit.nodeList[nodeIdx].toString()));
	            this.Stamper.stampResistor(0, nodeIdx, 1e8);
	            closure[nodeIdx] = true;
	            changed = true;
	            break;
	          } else {
	            _results1.push(void 0);
	          }
	        }
	        return _results1;
	      }).call(this));
	    }
	    return _results;
	  };
	
	  CircuitSolver.prototype.findInvalidPaths = function() {
	    var ce, fpi, pathfinder, _i, _len, _ref;
	    _ref = this.Circuit.getElements();
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      ce = _ref[_i];
	      if (ce instanceof InductorElm) {
	        fpi = new Pathfinder(Pathfinder.INDUCT, ce, ce.getNode(1), this.Circuit.getElements(), this.Circuit.numNodes());
	        if (!fpi.findPath(ce.getNode(0), 5) && !fpi.findPath(ce.getNode(0))) {
	          ce.reset();
	        }
	      }
	      if (ce instanceof CurrentElm) {
	        fpi = new Pathfinder(Pathfinder.INDUCT, ce, ce.getNode(1), this.Circuit.getElements(), this.Circuit.numNodes());
	        if (!fpi.findPath(ce.getNode(0))) {
	          this.Circuit.halt("No path for current source!", ce);
	          return;
	        }
	      }
	      if ((Util.typeOf(ce, VoltageElm) && ce.getPostCount() === 2) || ce instanceof WireElm) {
	        pathfinder = new Pathfinder(Pathfinder.VOLTAGE, ce, ce.getNode(1), this.Circuit.getElements(), this.Circuit.numNodes());
	        if (pathfinder.findPath(ce.getNode(0))) {
	          this.Circuit.halt("Voltage source/wire loop with no resistance!", ce);
	        }
	      }
	      if (ce instanceof CapacitorElm) {
	        fpi = new Pathfinder(Pathfinder.SHORT, ce, ce.getNode(1), this.Circuit.getElements(), this.Circuit.numNodes());
	        if (fpi.findPath(ce.getNode(0))) {
	          ce.reset();
	        } else {
	          fpi = new Pathfinder(Pathfinder.CAP_V, ce, ce.getNode(1), this.Circuit.getElements(), this.Circuit.numNodes());
	          if (fpi.findPath(ce.getNode(0))) {
	            this.Circuit.halt("Capacitor loop with no resistance!", ce);
	            return;
	          }
	        }
	      }
	    }
	  };
	
	  CircuitSolver.prototype.optimize = function() {
	    var circuitRowInfo, col, elt, j, k, lastVal, newIdx, newMatDim, newMatx, newRS, newSize, qm, qp, qq, re, row, rowInfo, rowNodeEq, rsadd, _i, _j, _k, _l, _m, _n, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
	    row = -1;
	    while (row < this.matrixSize - 1) {
	      row += 1;
	      re = this.circuitRowInfo[row];
	      if (re.lsChanges || re.dropRow || re.rsChanges) {
	        continue;
	      }
	      rsadd = 0;
	      qm = -1;
	      qp = -1;
	      lastVal = 0;
	      for (col = _i = 0, _ref = this.matrixSize; 0 <= _ref ? _i < _ref : _i > _ref; col = 0 <= _ref ? ++_i : --_i) {
	        if (this.circuitRowInfo[col].type === RowInfo.ROW_CONST) {
	          rsadd -= this.circuitRowInfo[col].value * this.circuitMatrix[row][col];
	        } else if (this.circuitMatrix[row][col] === 0) {
	
	        } else if (qp === -1) {
	          qp = col;
	          lastVal = this.circuitMatrix[row][col];
	        } else if (qm === -1 && (this.circuitMatrix[row][col] === -lastVal)) {
	          qm = col;
	        } else {
	          break;
	        }
	      }
	      if (col === this.matrixSize) {
	        if (qp === -1) {
	          this.Circuit.halt("Matrix error qp (row with all zeros) (rsadd = " + rsadd + ")", null);
	          return;
	        }
	        elt = this.circuitRowInfo[qp];
	        if (qm === -1) {
	          k = 0;
	          while (elt.type === RowInfo.ROW_EQUAL && k < CircuitSolver.SIZE_LIMIT) {
	            qp = elt.nodeEq;
	            elt = this.circuitRowInfo[qp];
	            ++k;
	          }
	          if (elt.type === RowInfo.ROW_EQUAL) {
	            elt.type = RowInfo.ROW_NORMAL;
	          } else if (elt.type !== RowInfo.ROW_NORMAL) {
	
	          } else {
	            elt.type = RowInfo.ROW_CONST;
	            elt.value = (this.circuitRightSide[row] + rsadd) / lastVal;
	            this.circuitRowInfo[row].dropRow = true;
	            row = -1;
	          }
	        } else if ((this.circuitRightSide[row] + rsadd) === 0) {
	          if (elt.type !== RowInfo.ROW_NORMAL) {
	            qq = qm;
	            qm = qp;
	            qp = qq;
	            elt = this.circuitRowInfo[qp];
	            if (elt.type !== RowInfo.ROW_NORMAL) {
	              continue;
	            }
	          }
	          elt.type = RowInfo.ROW_EQUAL;
	          elt.nodeEq = qm;
	          this.circuitRowInfo[row].dropRow = true;
	        }
	      }
	    }
	    newMatDim = 0;
	    for (row = _j = 0, _ref1 = this.matrixSize; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; row = 0 <= _ref1 ? ++_j : --_j) {
	      rowInfo = this.circuitRowInfo[row];
	      if (rowInfo.type === RowInfo.ROW_NORMAL) {
	        rowInfo.mapCol = newMatDim++;
	      } else {
	        if (rowInfo.type === RowInfo.ROW_EQUAL) {
	          for (j = _k = 0, _ref2 = CircuitSolver.SIZE_LIMIT; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; j = 0 <= _ref2 ? ++_k : --_k) {
	            rowNodeEq = this.circuitRowInfo[rowInfo.nodeEq];
	            if ((rowNodeEq.type !== RowInfo.ROW_EQUAL) || (row === rowNodeEq.nodeEq)) {
	              break;
	            }
	            rowInfo.nodeEq = rowNodeEq.nodeEq;
	          }
	        }
	        if (rowInfo.type === RowInfo.ROW_CONST) {
	          rowInfo.mapCol = -1;
	        }
	      }
	    }
	    for (row = _l = 0, _ref3 = this.matrixSize; 0 <= _ref3 ? _l < _ref3 : _l > _ref3; row = 0 <= _ref3 ? ++_l : --_l) {
	      rowInfo = this.circuitRowInfo[row];
	      if (rowInfo.type === RowInfo.ROW_EQUAL) {
	        rowNodeEq = this.circuitRowInfo[rowInfo.nodeEq];
	        if (rowNodeEq.type === RowInfo.ROW_CONST) {
	          rowInfo.type = rowNodeEq.type;
	          rowInfo.value = rowNodeEq.value;
	          rowInfo.mapCol = -1;
	        } else {
	          rowInfo.mapCol = rowNodeEq.mapCol;
	        }
	      }
	    }
	    newSize = newMatDim;
	    newMatx = Util.zeroArray2(newSize, newSize);
	    newRS = new Array(newSize);
	    Util.zeroArray(newRS);
	    newIdx = 0;
	    for (row = _m = 0, _ref4 = this.matrixSize; 0 <= _ref4 ? _m < _ref4 : _m > _ref4; row = 0 <= _ref4 ? ++_m : --_m) {
	      circuitRowInfo = this.circuitRowInfo[row];
	      if (circuitRowInfo.dropRow) {
	        circuitRowInfo.mapRow = -1;
	      } else {
	        newRS[newIdx] = this.circuitRightSide[row];
	        circuitRowInfo.mapRow = newIdx;
	        for (col = _n = 0, _ref5 = this.matrixSize; 0 <= _ref5 ? _n < _ref5 : _n > _ref5; col = 0 <= _ref5 ? ++_n : --_n) {
	          rowInfo = this.circuitRowInfo[col];
	          if (rowInfo.type === RowInfo.ROW_CONST) {
	            newRS[newIdx] -= rowInfo.value * this.circuitMatrix[row][col];
	          } else {
	            newMatx[newIdx][rowInfo.mapCol] += this.circuitMatrix[row][col];
	          }
	        }
	        newIdx++;
	      }
	    }
	    this.circuitMatrix = newMatx;
	    this.circuitRightSide = newRS;
	    this.matrixSize = this.circuitMatrixSize = newSize;
	    this.saveOriginalMatrixState();
	    this.circuitNeedsMap = true;
	    return this.analyzeFlag = false;
	  };
	
	  CircuitSolver.prototype.saveOriginalMatrixState = function() {
	    var col, row, _i, _j, _ref, _ref1, _results;
	    for (row = _i = 0, _ref = this.matrixSize; 0 <= _ref ? _i < _ref : _i > _ref; row = 0 <= _ref ? ++_i : --_i) {
	      this.origRightSide[row] = this.circuitRightSide[row];
	    }
	    if (this.circuitNonLinear) {
	      _results = [];
	      for (row = _j = 0, _ref1 = this.matrixSize; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; row = 0 <= _ref1 ? ++_j : --_j) {
	        _results.push((function() {
	          var _k, _ref2, _results1;
	          _results1 = [];
	          for (col = _k = 0, _ref2 = this.matrixSize; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; col = 0 <= _ref2 ? ++_k : --_k) {
	            _results1.push(this.origMatrix[row][col] = this.circuitMatrix[row][col]);
	          }
	          return _results1;
	        }).call(this));
	      }
	      return _results;
	    }
	  };
	
	  CircuitSolver.prototype.restoreOriginalMatrixState = function() {
	    var col, row, _i, _j, _ref, _ref1, _results;
	    for (row = _i = 0, _ref = this.circuitMatrixSize; 0 <= _ref ? _i < _ref : _i > _ref; row = 0 <= _ref ? ++_i : --_i) {
	      this.circuitRightSide[row] = this.origRightSide[row];
	    }
	    if (this.circuitNonLinear) {
	      _results = [];
	      for (row = _j = 0, _ref1 = this.circuitMatrixSize; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; row = 0 <= _ref1 ? ++_j : --_j) {
	        _results.push((function() {
	          var _k, _ref2, _results1;
	          _results1 = [];
	          for (col = _k = 0, _ref2 = this.circuitMatrixSize; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; col = 0 <= _ref2 ? ++_k : --_k) {
	            _results1.push(this.circuitMatrix[row][col] = this.origMatrix[row][col]);
	          }
	          return _results1;
	        }).call(this));
	      }
	      return _results;
	    }
	  };
	
	  CircuitSolver.prototype.getValueFromNode = function(idx) {
	    var rowInfo;
	    rowInfo = this.circuitRowInfo[idx];
	    if (rowInfo.type === RowInfo.ROW_CONST) {
	      return rowInfo.value;
	    } else {
	      return this.circuitRightSide[rowInfo.mapCol];
	    }
	  };
	
	  CircuitSolver.prototype.updateComponent = function(nodeIdx, value) {
	    var circuitNode, circuitNodeLink, ji, _i, _len, _ref;
	    if (isNaN(value)) {
	      this.converged = false;
	      return false;
	    }
	    if (nodeIdx < (this.Circuit.numNodes() - 1)) {
	      circuitNode = this.Circuit.nodeList[nodeIdx + 1];
	      _ref = circuitNode.links;
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        circuitNodeLink = _ref[_i];
	        circuitNodeLink.elm.setNodeVoltage(circuitNodeLink.num, value);
	      }
	    } else {
	      ji = nodeIdx - (this.Circuit.numNodes() - 1);
	      this.Circuit.voltageSources[ji].setCurrent(ji, value);
	    }
	    return true;
	  };
	
	
	  /*
	    luFactor: finds a solution to a factored matrix through LU (Lower-Upper) factorization
	  
	    Called once each frame for resistive circuits, otherwise called many times each frame
	  
	    returns a falsy value if the provided circuitMatrix can't be factored
	  
	    @param (input/output) circuitMatrix 2D matrix to be solved
	    @param (input) matrixSize number or rows/columns in the matrix
	    @param (output) pivotArray pivot index
	   */
	
	  CircuitSolver.prototype.luFactor = function(circuitMatrix, matrixSize, pivotArray) {
	    var i, j, k, largest, largestRow, matrix_ij, mult, x;
	    i = 0;
	    while (i < matrixSize) {
	      largest = 0;
	      j = 0;
	      while (j < matrixSize) {
	        x = Math.abs(circuitMatrix[i][j]);
	        if (x > largest) {
	          largest = x;
	        }
	        ++j;
	      }
	      this.scaleFactors[i] = 1.0 / largest;
	      ++i;
	    }
	    j = 0;
	    while (j < matrixSize) {
	      i = 0;
	      while (i < j) {
	        matrix_ij = circuitMatrix[i][j];
	        k = 0;
	        while (k !== i) {
	          matrix_ij -= circuitMatrix[i][k] * circuitMatrix[k][j];
	          ++k;
	        }
	        circuitMatrix[i][j] = matrix_ij;
	        ++i;
	      }
	      largest = 0;
	      largestRow = -1;
	      i = j;
	      while (i < matrixSize) {
	        matrix_ij = circuitMatrix[i][j];
	        k = 0;
	        while (k < j) {
	          matrix_ij -= circuitMatrix[i][k] * circuitMatrix[k][j];
	          ++k;
	        }
	        circuitMatrix[i][j] = matrix_ij;
	        x = Math.abs(matrix_ij);
	        if (x >= largest) {
	          largest = x;
	          largestRow = i;
	        }
	        ++i;
	      }
	      if (j !== largestRow) {
	        k = 0;
	        while (k < matrixSize) {
	          x = circuitMatrix[largestRow][k];
	          circuitMatrix[largestRow][k] = circuitMatrix[j][k];
	          circuitMatrix[j][k] = x;
	          ++k;
	        }
	        this.scaleFactors[largestRow] = this.scaleFactors[j];
	      }
	      pivotArray[j] = largestRow;
	      if (circuitMatrix[j][j] === 0) {
	        circuitMatrix[j][j] = 1e-18;
	      }
	      if (j !== matrixSize - 1) {
	        mult = 1 / circuitMatrix[j][j];
	        i = j + 1;
	        while (i !== matrixSize) {
	          circuitMatrix[i][j] *= mult;
	          ++i;
	        }
	      }
	      ++j;
	    }
	    return true;
	  };
	
	
	  /*
	    Step 2: `lu_solve`: (Called by lu_factor)
	    finds a solution to a factored matrix through LU (Lower-Upper) factorization
	  
	    Called once each frame for resistive circuits, otherwise called many times each frame
	  
	    @param circuitMatrix matrix to be solved
	    @param numRows dimension
	    @param pivotVector pivot index
	    @param circuitRightSide Right-side (dependent) matrix
	   */
	
	  CircuitSolver.prototype.luSolve = function(circuitMatrix, numRows, pivotVector, circuitRightSide) {
	    var bi, i, j, row, swap, tot, total, _results;
	    i = 0;
	    while (i < numRows) {
	      row = pivotVector[i];
	      swap = circuitRightSide[row];
	      circuitRightSide[row] = circuitRightSide[i];
	      circuitRightSide[i] = swap;
	      if (swap !== 0) {
	        break;
	      }
	      ++i;
	    }
	    bi = i++;
	    while (i < numRows) {
	      row = pivotVector[i];
	      tot = circuitRightSide[row];
	      circuitRightSide[row] = circuitRightSide[i];
	      j = bi;
	      while (j < i) {
	        tot -= circuitMatrix[i][j] * circuitRightSide[j];
	        ++j;
	      }
	      circuitRightSide[i] = tot;
	      ++i;
	    }
	    i = numRows - 1;
	    _results = [];
	    while (i >= 0) {
	      total = circuitRightSide[i];
	      j = i + 1;
	      while (j !== numRows) {
	        total -= circuitMatrix[i][j] * circuitRightSide[j];
	        ++j;
	      }
	      circuitRightSide[i] = total / circuitMatrix[i][i];
	      _results.push(i--);
	    }
	    return _results;
	  };
	
	  CircuitSolver.prototype.dump = function() {
	    var out, rowInfo, _i, _len, _ref;
	    out = "";
	    out += this.Circuit.Params.toString() + "\n";
	    _ref = this.circuitRowInfo;
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      rowInfo = _ref[_i];
	      out += rowInfo.toString() + "\n";
	    }
	    out += "\nCircuit permute: " + Util.printArray(this.circuitPermute);
	    return out + "\n";
	  };
	
	  CircuitSolver.prototype.dumpOrigFrame = function() {
	    var circuitMatrixDump, circuitRightSideDump, i, j, matrixRowCount, out, _i, _j;
	    matrixRowCount = this.origRightSide.length;
	    circuitMatrixDump = "";
	    circuitRightSideDump = "  RS: [";
	    for (i = _i = 0; 0 <= matrixRowCount ? _i < matrixRowCount : _i > matrixRowCount; i = 0 <= matrixRowCount ? ++_i : --_i) {
	      circuitRightSideDump += Util.tidyFloat(this.origRightSide[i]);
	      circuitMatrixDump += "  [";
	      for (j = _j = 0; 0 <= matrixRowCount ? _j < matrixRowCount : _j > matrixRowCount; j = 0 <= matrixRowCount ? ++_j : --_j) {
	        circuitMatrixDump += Util.tidyFloat(this.origMatrix[i][j]);
	        if (j !== matrixRowCount - 1) {
	          circuitMatrixDump += ", ";
	        }
	      }
	      circuitMatrixDump += "]\n";
	      if (i !== matrixRowCount - 1) {
	        circuitRightSideDump += ", ";
	      }
	    }
	    out = "";
	    out += circuitMatrixDump + "\n";
	    out += circuitRightSideDump + "]";
	    return out;
	  };
	
	  CircuitSolver.prototype.dumpFrame = function() {
	    var circuitMatrixDump, circuitRightSideDump, i, j, matrixRowCount, out, _i, _j;
	    matrixRowCount = this.circuitRightSide.length;
	    if (!this.circuitMatrix || !!this.circuitMatrix[0]) {
	      return "";
	    }
	    circuitMatrixDump = "";
	    circuitRightSideDump = "  RS: [";
	    for (i = _i = 0; 0 <= matrixRowCount ? _i < matrixRowCount : _i > matrixRowCount; i = 0 <= matrixRowCount ? ++_i : --_i) {
	      circuitRightSideDump += Util.tidyFloat(this.circuitRightSide[i]);
	      circuitMatrixDump += "  [";
	      for (j = _j = 0; 0 <= matrixRowCount ? _j < matrixRowCount : _j > matrixRowCount; j = 0 <= matrixRowCount ? ++_j : --_j) {
	        circuitMatrixDump += Util.tidyFloat(this.circuitMatrix[i][j]);
	        if (j !== matrixRowCount - 1) {
	          circuitMatrixDump += ", ";
	        }
	      }
	      circuitMatrixDump += "]\n";
	      if (i !== matrixRowCount - 1) {
	        circuitRightSideDump += ", ";
	      }
	    }
	    out = "";
	    out += sprintf("  iter: %d, time: %.7f, subiter: %d rows: %d\n", this.Circuit.iterations, this.Circuit.time, this.subIterations, matrixRowCount);
	    out += circuitMatrixDump + "\n";
	    out += circuitRightSideDump + "]";
	    return out;
	  };
	
	  return CircuitSolver;
	
	})();
	
	module.exports = CircuitSolver;


/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	let RowInfo = __webpack_require__(83);
	let Util = __webpack_require__(5);
	
	class MatrixStamper {
	
	  constructor(Circuit) {
	    this.Circuit = Circuit;
	  }
	
	  /**
	  control voltage source vs with voltage from n1 to n2 (must also call stampVoltageSource())
	  */
	  stampVCVS(n1, n2, coef, vs) {
	    if (isNaN(vs) || isNaN(coef)) {
	      console.warn("NaN in stampVCVS");
	    }
	
	    let vn = this.Circuit.numNodes() + vs;
	
	    this.stampMatrix(vn, n1, coef);
	    return this.stampMatrix(vn, n2, -coef);
	  }
	
	
	  // stamp independent voltage source #vs, from n1 to n2, amount v
	  stampVoltageSource(n1, n2, vs, v) {
	    if (v == null) { v = null; }
	    let vn = this.Circuit.numNodes() + vs;
	
	    this.stampMatrix(vn, n1, -1);
	    this.stampMatrix(vn, n2, 1);
	    this.stampRightSide(vn, v);
	    this.stampMatrix(n1, vn, 1);
	    return this.stampMatrix(n2, vn, -1);
	  }
	
	
	  updateVoltageSource(n1, n2, vs, voltage) {
	    if (isNaN(voltage) || Util.isInfinite(voltage)) {
	      this.Circuit.halt(`updateVoltageSource: bad voltage ${voltage} at ${n1} ${n2} ${vs}`);
	    }
	
	    let vn = this.Circuit.numNodes() + vs;
	    return this.stampRightSide(vn, voltage);
	  }
	
	
	  stampResistor(n1, n2, r) {
	    return this.stampConductance(n1, n2, 1 / r);
	  }
	
	
	  stampConductance(n1, n2, g) {
	    if (isNaN(g) || Util.isInfinite(g)) {
	      this.Circuit.halt(`bad conductance at ${n1} ${n2}`);
	    }
	
	    this.stampMatrix(n1, n1, g);
	    this.stampMatrix(n2, n2, g);
	    this.stampMatrix(n1, n2, -g);
	    return this.stampMatrix(n2, n1, -g);
	  }
	
	
	  /**
	  current from cn1 to cn2 is equal to voltage from vn1 to 2, divided by g
	  */
	  stampVCCurrentSource(cn1, cn2, vn1, vn2, value) {
	    if (isNaN(value) || Util.isInfinite(value)) {
	      this.Circuit.halt(`Invalid gain ${value} on voltage controlled current source`);
	    }
	
	    this.stampMatrix(cn1, vn1, value);
	    this.stampMatrix(cn2, vn2, value);
	    this.stampMatrix(cn1, vn2, -value);
	
	    return this.stampMatrix(cn2, vn1, -value);
	  }
	
	
	  stampCurrentSource(n1, n2, value) {
	    this.stampRightSide(n1, -value);
	    return this.stampRightSide(n2, value);
	  }
	
	
	  /**
	  stamp a current source from n1 to n2 depending on current through vs
	  */
	  stampCCCS(n1, n2, vs, gain) {
	    if (isNaN(gain) || Util.isInfinite(gain)) {
	      this.Circuit.halt(`Invalid gain on current source: (was ${gain})`);
	    }
	
	    let vn = this.Circuit.numNodes() + vs;
	    this.stampMatrix(n1, vn, gain);
	    return this.stampMatrix(n2, vn, -gain);
	  }
	
	
	  /**
	  stamp value x in row i, column j, meaning that a voltage change
	  of dv in node j will increase the current into node i by x dv.
	  (Unless i or j is a voltage source node.)
	  */
	  stampMatrix(row, col, value) {
	    if (isNaN(value) || Util.isInfinite(value) || value == null || value == undefined) {
	      this.Circuit.halt(`attempted to stamp Matrix with invalid value (${value}) at ${row} ${col}`);
	    }
	
	    if ((row > 0) && (col > 0)) {
	      if (this.Circuit.Solver.circuitNeedsMap) {
	        row = this.Circuit.Solver.circuitRowInfo[row - 1].mapRow;
	        let rowInfo = this.Circuit.Solver.circuitRowInfo[col - 1];
	        if (rowInfo.type === RowInfo.ROW_CONST) {
	          this.Circuit.Solver.circuitRightSide[row] -= value * rowInfo.value;
	          return;
	        }
	        col = rowInfo.mapCol;
	      } else {
	        row--;
	        col--;
	      }
	
	      return this.Circuit.Solver.circuitMatrix[row][col] += value;
	    }
	  }
	
	
	  /**
	  Stamp value x on the right side of row i, representing an
	  independent current source flowing into node i
	  */
	  stampRightSide(row, value) {
	    if (isNaN(value) || (value === null)) {
	      if (row > 0) {
	        return this.Circuit.Solver.circuitRowInfo[row - 1].rsChanges = true;
	      }
	    } else {
	      if (row > 0) {
	        if (this.Circuit.Solver.circuitNeedsMap) {
	          row = this.Circuit.Solver.circuitRowInfo[row - 1].mapRow;
	        } else {
	          row--;
	        }
	
	        return this.Circuit.Solver.circuitRightSide[row] += value;
	      }
	    }
	  }
	
	
	  /**
	  Indicate that the values on the left side of row i change in doStep()
	  */
	  stampNonLinear(row) {
	    if (isNaN(row) || (row === null)) {
	      console.error("null/NaN in stampNonlinear");
	    }
	    if (row > 0) { return this.Circuit.Solver.circuitRowInfo[row - 1].lsChanges = true; }
	  }
	}
	
	
	module.exports = MatrixStamper;


/***/ },
/* 83 */
/***/ function(module, exports) {

	class RowInfo {
	  static initClass() {
	    this.ROW_NORMAL = 0;
	    this.ROW_CONST = 1;
	    this.ROW_EQUAL = 2;
	  }
	
	  constructor() {
	    this.type = RowInfo.ROW_NORMAL;
	
	    this.nodeEq = 0;
	    this.mapCol = 0;
	    this.mapRow = 0;
	
	    this.value = 0;
	    this.rsChanges = false;
	    this.lsChanges = false;
	    this.dropRow = false;
	  }
	
	  toJson() {
	    return {
	      nodeEq: this.nodeEq,
	      mapCol: this.mapCol,
	      mapRow: this.mapRow,
	      value: this.value,
	      rsChanges: this.rsChanges,
	      lsChanges: this.lsChanges,
	      dropRow: this.dropRow,
	      type: this.type
	    };
	  }
	
	  typeToStr(type) {
	    if (type == 0)
	      return "NORMAL";
	
	    if (type == 1)
	      return "CONST";
	
	    if (type == 2)
	      return "EQ";
	  }
	
	  toString() {
	    return `RowInfo: ${this.typeToStr(this.type)}, nodeEq: ${this.nodeEq}, mapCol: ${this.mapCol}, mapRow: ${this.mapRow}, value: ${this.value}, rsChanges: ${this.rsChanges}, lsChanges: ${this.lsChanges}, dropRow: ${this.dropRow}`;
	  }
	}
	RowInfo.initClass();
	
	module.exports = RowInfo;


/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	let VoltageElm = __webpack_require__(19);
	let CurrentElm = __webpack_require__(30);
	let ResistorElm = __webpack_require__(22);
	let InductorElm = __webpack_require__(28);
	let CapacitorElm = __webpack_require__(27);
	let Util = __webpack_require__(5);
	
	class Pathfinder {
	  static initClass() {
	    this.INDUCT = 1;
	    this.VOLTAGE = 2;
	    this.SHORT = 3;
	    this.CAP_V = 4;
	  }
	
	  constructor(type, firstElm, dest, elementList, numNodes) {
	    this.type = type;
	    this.firstElm = firstElm;
	    this.dest = dest;
	    this.elementList = elementList;
	    this.used = new Array(numNodes);
	  }
	
	  validElm(ce) {
	    return (ce === this.firstElm) ||
	    ((ce instanceof CurrentElm) && (this.type === Pathfinder.INDUCT)) ||
	    ((this.type === Pathfinder.VOLTAGE) && !(ce.isWire() || Util.typeOf(ce, VoltageElm))) ||
	    ((this.type === Pathfinder.SHORT) && !ce.isWire()) ||
	    ((this.type === Pathfinder.CAP_V) && !(ce.isWire() || ce instanceof CapacitorElm || Util.typeOf(ce, VoltageElm)));
	  }
	
	  findPath(n1, depth) {
	    if (n1 === this.dest) {
	//      console.log("n1 is @dest")
	      return true;
	    }
	    if (depth-- === 0) {
	      return false;
	    }
	
	    if (this.used[n1]) {
	//      console.log("used " + n1)
	      return false;
	    }
	
	    this.used[n1] = true;
	
	    for (let ce of Array.from(this.elementList)) {
	      var j;
	      if (this.validElm(ce)) { continue; }
	
	      if (n1 === 0) {
	        // Look for posts which have a ground connection. Our path can go through ground!
	        for (j = 0, end = ce.getPostCount(), asc = 0 <= end; asc ? j < end : j > end; asc ? j++ : j--) {
	          var asc, end;
	          if (ce.hasGroundConnection(j) && this.findPath(ce.getNode(j), depth)) {
	//            console.log(ce + " has ground (n1 is 0)")
	            this.used[0] = false;
	            return true;
	          }
	        }
	      }
	
	      for (j = 0, end1 = ce.getPostCount(), asc1 = 0 <= end1; asc1 ? j < end1 : j > end1; asc1 ? j++ : j--) {
	//        console.log("get post " + ce.dump() + " " + ce.getNode(j))
	        var asc1, end1;
	        if (ce.getNode(j) === n1) {
	          break;
	        }
	      }
	
	      // TODO: ENSURE EQUALITY HERE
	      if (j === ce.getPostCount()) {
	        continue;
	      }
	
	      if (ce.hasGroundConnection(j) && this.findPath(0, depth)) {
	//        console.log(ce + " has ground")
	        this.used[n1] = false;
	        return true;
	      }
	
	      if ((this.type === Pathfinder.INDUCT) && ce instanceof InductorElm) {
	        let current = ce.getCurrent();
	        if (j === 0) {
	          current = -current;
	        }
	
	//        console.log(ce + " > " + @firstElm + " >> matching " + ce + " to " + @firstElm.getCurrent())
	        if (Math.abs(current - this.firstElm.getCurrent()) > 1e-10) {
	          continue;
	        }
	      }
	
	      for (let k = 0, end2 = ce.getPostCount(), asc2 = 0 <= end2; asc2 ? k < end2 : k > end2; asc2 ? k++ : k--) {
	        if (j === k) { continue; }
	
	//        console.log(ce + " " + ce.getNode(j) + " - " + ce.getNode(k))
	        if (ce.getConnection(j, k) && this.findPath(ce.getNode(k), depth)) {
	//          console.log("got findpath #{n1}")
	          //            console.log("got findpath j: #{ce.getNode(j).toString()}, k: #{ce.getNode(k).toString()} on element " + ce)
	          this.used[n1] = false;
	          return true;
	        }
	      }
	    }
	
	    //      console.log(n1 + " failed")
	    this.used[n1] = false;
	    return false;
	  }
	}
	Pathfinder.initClass();
	
	module.exports = Pathfinder;


/***/ },
/* 85 */
/***/ function(module, exports) {

	class CircuitNode {
	  constructor(solver, x = 0, y = 0, intern = false, links = []) {
	    this.solver = solver;
	    this.x = x;
	    this.y = y;
	    this.intern = intern;
	    this.links = links;
	  }
	
	  toJson() {
	    return {
	      x: this.x,
	      y: this.y,
	      internal: this.intern,
	      links: this.links.map(link => link.toJson())
	    };
	  }
	
	  toString() {
	    return `Node: ${this.x} ${this.y} [${this.links}]`;
	  }
	
	  getVoltage() {
	    return this.links.map(link => link.elm.nodes);
	  }
	      
	  getNeighboringElements() {
	    return this.links.map(link => link.elm);
	  }
	}
	
	module.exports = CircuitNode;


/***/ },
/* 86 */
/***/ function(module, exports) {

	class CircuitNodeLink {
	  constructor(num = 0, elm = null) {
	    this.num = num;
	    this.elm = elm;
	  }
	
	  toJson() {
	    return {
	      num: this.num,
	      elm: this.elm.toJson()
	    };
	  }
	
	  toString() {
	    return `${this.num} ${this.elm}`;
	  }
	}
	
	module.exports = CircuitNodeLink;


/***/ },
/* 87 */
/***/ function(module, exports) {

	class Observer {
	
	  addObserver(event, fn) {
	    if (!this._events) { this._events = {}; }
	    if (!this._events[event]) { this._events[event] = []; }
	    return this._events[event].push(fn);
	  }
	
	  removeObserver(event, fn) {
	    if (!this._events) { this._events = {}; }
	
	    if (this._events[event]) {
	      return this._events[event].splice(this._events[event].indexOf(fn), 1);
	    }
	  }
	
	  notifyObservers(event, ...args) {
	    if (!this._events) { this._events = {}; }
	
	    if (this._events[event]) {
	      return Array.from(this._events[event]).map((callback) =>
	        callback.apply(this, args));
	    }
	  }
	
	  getObservers() {
	    return this._events;
	  }
	}
	
	module.exports = Observer;


/***/ },
/* 88 */
/***/ function(module, exports) {



/***/ },
/* 89 */
/***/ function(module, exports) {

	class Hint {
	  static initClass() {
	  
	    this.HINT_LC = "@HINT_LC";
	    this.HINT_RC = "@HINT_RC";
	    this.HINT_3DB_C = "@HINT_3DB_C";
	    this.HINT_TWINT = "@HINT_TWINT";
	    this.HINT_3DB_L = "@HINT_3DB_L";
	  
	    this.hintType = -1;
	    this.hintItem1 = -1;
	    this.hintItem2 = -1;
	  }
	
	
	  constructor(Circuit) {
	    this.Circuit = Circuit;
	  }
	
	
	  readHint(st) {
	    if (typeof st === 'string') {
	      st = st.split(' ');
	    }
	
	    this.hintType = st[0];
	    this.hintItem1 = st[1];
	    return this.hintItem2 = st[2];
	  }
	
	
	  getHint() {
	    let ce, ie, re;
	    let c1 = this.Circuit.getElmByIdx(this.hintItem1);
	    let c2 = this.Circuit.getElmByIdx(this.hintItem2);
	
	    if ((c1 == null) || (c2 == null)) { return null; }
	
	    if (this.hintType === this.HINT_LC) {
	      if (!(c1 instanceof InductorElm)) { return null; }
	      if (!(c2 instanceof CapacitorElm)) { return null; }
	
	      ie = c1;   // as InductorElm
	      ce = c2;   // as CapacitorElm
	
	      return `res.f = ${getUnitText(1 / (2 * Math.PI * Math.sqrt(ie.inductance * ce.capacitance)), "Hz")}`;
	    }
	
	    if (this.hintType === this.HINT_RC) {
	      if (!(c1 instanceof ResistorElm)) { return null; }
	      if (!(c2 instanceof CapacitorElm)) { return null; }
	
	      re = c1;   // as ResistorElm
	      ce = c2;   // as CapacitorElm
	
	      return `RC = ${getUnitText(re.resistance * ce.capacitance, "s")}`;
	    }
	
	    if (this.hintType === this.HINT_3DB_C) {
	      if (!(c1 instanceof ResistorElm)) { return null; }
	      if (!(c2 instanceof CapacitorElm)) { return null; }
	
	      re = c1;   // as ResistorElm
	      ce = c2;   // as CapacitorElm
	
	      return `f.3db = ${getUnitText(1 / (2 * Math.PI * re.resistance * ce.capacitance), "Hz")}`;
	    }
	
	    if (this.hintType === this.HINT_3DB_L) {
	      if (!(c1 instanceof ResistorElm)) { return null; }
	      if (!(c2 instanceof InductorElm)) { return null; }
	
	      re = c1;   // as ResistorElm
	      ie = c2;   // as InductorElm
	
	      return `f.3db = ${getUnitText(re.resistance / (2 * Math.PI * ie.inductance), "Hz")}`;
	    }
	
	    if (this.hintType === this.HINT_TWINT) {
	      if (!(c1 instanceof ResistorElm)) { return null; }
	      if (!(c2 instanceof CapacitorElm)) { return null; }
	
	      re = c1;   // as ResistorElm
	      ce = c2;   // as CapacitorElm
	
	      return `fc = ${getUnitText(1 / (2 * Math.PI * re.resistance * ce.capacitance), "Hz")}`;
	    }
	
	    return null;
	  }
	}
	Hint.initClass();
	
	module.exports = Hint;


/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	let CircuitComponent = __webpack_require__(1);
	
	let AntennaElm = __webpack_require__(17);
	let WireElm = __webpack_require__(20);
	let ResistorElm = __webpack_require__(22);
	let GroundElm = __webpack_require__(23);
	let VoltageElm = __webpack_require__(19);
	let DiodeElm = __webpack_require__(24);
	let OutputElm = __webpack_require__(25);
	let SwitchElm = __webpack_require__(26);
	let CapacitorElm = __webpack_require__(27);
	let InductorElm = __webpack_require__(28);
	let SparkGapElm = __webpack_require__(29);
	let CurrentElm = __webpack_require__(30);
	let RailElm = __webpack_require__(18);
	let MosfetElm = __webpack_require__(31);
	let JfetElm = __webpack_require__(32);
	let TransistorElm = __webpack_require__(33);
	let VarRailElm = __webpack_require__(34);
	let OpAmpElm = __webpack_require__(35);
	let ZenerElm = __webpack_require__(36);
	let Switch2Elm = __webpack_require__(37);
	let SweepElm = __webpack_require__(38);
	let TextElm = __webpack_require__(39);
	let ProbeElm = __webpack_require__(40);
	
	let AndGateElm = __webpack_require__(41);
	let NandGateElm = __webpack_require__(42);
	let OrGateElm = __webpack_require__(43);
	let NorGateElm = __webpack_require__(44);
	let XorGateElm = __webpack_require__(45);
	let InverterElm = __webpack_require__(46);
	
	let LogicInputElm = __webpack_require__(47);
	let LogicOutputElm = __webpack_require__(48);
	let AnalogSwitchElm = __webpack_require__(49);
	let AnalogSwitch2Elm = __webpack_require__(50);
	let MemristorElm = __webpack_require__(51);
	let RelayElm = __webpack_require__(52);
	let TunnelDiodeElm = __webpack_require__(53);
	
	let ScrElm = __webpack_require__(54);
	let TriodeElm = __webpack_require__(55);
	
	let DecadeElm = __webpack_require__(56);
	let LatchElm = __webpack_require__(58);
	let TimerElm = __webpack_require__(59);
	let JKFlipFlopElm = __webpack_require__(60);
	let DFlipFlopElm = __webpack_require__(61);
	let CounterElm = __webpack_require__(62);
	let DacElm = __webpack_require__(63);
	let AdcElm = __webpack_require__(64);
	let VcoElm = __webpack_require__(65);
	let PhaseCompElm = __webpack_require__(66);
	let SevenSegElm = __webpack_require__(67);
	let CC2Elm = __webpack_require__(68);
	
	let TransLineElm = __webpack_require__(69);
	
	let TransformerElm = __webpack_require__(70);
	let TappedTransformerElm = __webpack_require__(71);
	
	let LedElm = __webpack_require__(72);
	let PotElm = __webpack_require__(73);
	let ClockElm = __webpack_require__(74);
	
	let Scope = __webpack_require__(75);
	
	//#
	// ElementMap
	//
	//   A Hash Map of circuit components within Maxwell
	//
	//   Each hash element is a key-value pair of the format {"ElementName": "ElementDescription"}
	//
	//   Elements that are tested working are prefixed with a '+'
	//   Elements that are implemented but not tested have their names (key) prefixed with a '#'
	//   Elements that are not yet implemented have their names (key) prefixed with a '-'
	class ComponentRegistry {
	  static initClass() {
	    this.ComponentDefs = {
	    // Working
	      'w': WireElm,
	      'r': ResistorElm,
	      'g': GroundElm,
	      'l': InductorElm,
	      'c': CapacitorElm,
	      'v': VoltageElm,
	      'd': DiodeElm,
	      's': SwitchElm,
	      '187': SparkGapElm,
	      'a': OpAmpElm,
	      'f': MosfetElm,
	  
	    // Testing
	      'A': AntennaElm,
	      'R': RailElm,
	      '170': SweepElm,
	      '172': VarRailElm,
	      'z': ZenerElm,
	      'i': CurrentElm,
	      't': TransistorElm,
	      '174': PotElm,
	  
	      '150': AndGateElm,
	      '151': NandGateElm,
	      '152': OrGateElm,
	      '153': NorGateElm,
	      '154': XorGateElm,
	  
	      'I': InverterElm,
	      'L': LogicInputElm,
	      'M': LogicOutputElm,
	  
	      '159': AnalogSwitchElm,
	      '160': AnalogSwitch2Elm,
	  
	    // In progress:
	      'S': Switch2Elm,  // Needs interaction
	      'x': TextElm,
	      'p': ProbeElm,
	      'O': OutputElm,
	      'T': TransformerElm,
	  
	      // 'o': Scope,
	  //    'h': Scope
	  //     '$': Scope,
	  //     '%': Scope,
	  //     '?': Scope,
	  //     'B': Scope,
	  
	      // Incomplete
	  
	      '150': AndGateElm,
	      '151': NandGateElm,
	      '152': OrGateElm,
	      '153': NorGateElm,
	      '154': XorGateElm,
	      '155': DFlipFlopElm,
	      '156': JKFlipFlopElm,
	      '157': SevenSegElm,
	      '158': VcoElm,
	      '159': AnalogSwitchElm,
	      '160': AnalogSwitch2Elm,
	      '161': PhaseCompElm,
	      '162': LedElm,
	      '163': DecadeElm,
	      '164': CounterElm,
	      '165': TimerElm,
	      '166': DacElm,
	      '167': AdcElm,
	      '168': LatchElm,
	      '169': TappedTransformerElm,
	      '170': SweepElm,
	      '171': TransLineElm,
	      '172': VarRailElm,
	      '173': TriodeElm,
	      '174': PotElm,
	      '175': TunnelDiodeElm,
	      '177': ScrElm,
	      '178': RelayElm,
	      '179': CC2Elm,
	  //    '181': LampElm
	      '187': SparkGapElm,
	      'A': AntennaElm,
	      'I': InverterElm,
	      'L': LogicInputElm,
	      'M': LogicOutputElm,
	      'O': OutputElm,
	      'R': RailElm,
	      'S': Switch2Elm,
	      'a': OpAmpElm,
	      'c': CapacitorElm,
	      'd': DiodeElm,
	  //    'f': NMosfetElm
	      'g': GroundElm,
	      'i': CurrentElm,
	      'j': JfetElm,
	      'l': InductorElm,
	      'm': MemristorElm,
	      'p': ProbeElm,
	      'r': ResistorElm,
	      's': SwitchElm,
	  //    't': NTransistorElm
	  //    'v': DCVoltageElm
	      'w': WireElm,
	      'x': TextElm,
	      'z': ZenerElm
	  };
	  
	  
	    this.InverseComponentDefs = {
	      WireElm: 'w',
	      ResistorElm: 'r',
	      GroundElm: 'g',
	      InductorElm: 'l',
	      CapacitorElm: 'c',
	      VoltageElm: 'v',
	      DiodeElm: 'd',
	      SwitchElm: 's',
	      SparkGapElm: '187',
	      OpAmpElm: 'a',
	      MosfetElm: 'f',
	      PotElm: '174',
	  
	      RailElm: 'R',
	      VarRailElm: '17',
	      ZenerElm: 'z',
	      CurrentElm: 'i',
	      TransistorElm: 't',
	      JfetElm: 'j',
	  
	      Switch2Elm: 'S',
	      SweepElm: '170',
	      TextElm: 'x',
	      ProbeElm: 'p',
	      Scope: 'o',
	      OutputElm: 'O',
	      AntennaElm: 'A',
	  
	      AndGateElm: '150',
	      NandGateElm: '151',
	      OrGateElm: '152',
	      NorGateElm: '153',
	      XorGateElm: '154',
	  
	      InverterElm: 'I',
	      LogicInputElm: 'L',
	      LogicOutputElm: 'M',
	  
	      JkFlipFlopElm: '156',
	      LatchElm: '168',
	      TimerElm: '165',
	  
	      TransformerElm: 'T',
	  
	      AnalogSwitchElm: '159',
	      AnalogSwitch2Elm: '160',
	      MemristorElm: 'm'
	    };
	}
	
	  static enumerate() {
	    let elms = {};
	
	    for (let _ in this.ComponentDefs) {
	        let Component = this.ComponentDefs[_];
	      elms[Component] = Component.Fields;
	    }
	
	    return elms;
	}
	}
	ComponentRegistry.initClass();
	
	
	
	
	module.exports = ComponentRegistry;


/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	let Rectangle = __webpack_require__(3);
	let CircuitCanvas = __webpack_require__(92);
	let Observer = __webpack_require__(87);
	let Util = __webpack_require__(5);
	
	let AntennaElm = __webpack_require__(17);
	let WireElm = __webpack_require__(20);
	let ResistorElm = __webpack_require__(22);
	let GroundElm = __webpack_require__(23);
	let VoltageElm = __webpack_require__(19);
	let DiodeElm = __webpack_require__(24);
	let OutputElm = __webpack_require__(25);
	let SwitchElm = __webpack_require__(26);
	let CapacitorElm = __webpack_require__(27);
	let InductorElm = __webpack_require__(28);
	let SparkGapElm = __webpack_require__(29);
	let CurrentElm = __webpack_require__(30);
	let RailElm = __webpack_require__(18);
	let MosfetElm = __webpack_require__(31);
	let JfetElm = __webpack_require__(32);
	let TransistorElm = __webpack_require__(33);
	let VarRailElm = __webpack_require__(34);
	let OpAmpElm = __webpack_require__(35);
	let ZenerElm = __webpack_require__(36);
	let Switch2Elm = __webpack_require__(37);
	let SweepElm = __webpack_require__(38);
	let TextElm = __webpack_require__(39);
	let ProbeElm = __webpack_require__(40);
	
	let AndGateElm = __webpack_require__(41);
	let NandGateElm = __webpack_require__(42);
	let OrGateElm = __webpack_require__(43);
	let NorGateElm = __webpack_require__(44);
	let XorGateElm = __webpack_require__(45);
	let InverterElm = __webpack_require__(46);
	
	let LogicInputElm = __webpack_require__(47);
	let LogicOutputElm = __webpack_require__(48);
	let AnalogSwitchElm = __webpack_require__(49);
	let AnalogSwitch2Elm = __webpack_require__(50);
	let MemristorElm = __webpack_require__(51);
	let RelayElm = __webpack_require__(52);
	let TunnelDiodeElm = __webpack_require__(53);
	
	let ScrElm = __webpack_require__(54);
	let TriodeElm = __webpack_require__(55);
	
	let DecadeElm = __webpack_require__(56);
	let LatchElm = __webpack_require__(58);
	let TimerElm = __webpack_require__(59);
	let JkFlipFlopElm = __webpack_require__(60);
	let DFlipFlopElm = __webpack_require__(61);
	let CounterElm = __webpack_require__(62);
	let DacElm = __webpack_require__(63);
	let AdcElm = __webpack_require__(64);
	let VcoElm = __webpack_require__(65);
	let PhaseCompElm = __webpack_require__(66);
	let SevenSegElm = __webpack_require__(67);
	let CC2Elm = __webpack_require__(68);
	
	let TransLineElm = __webpack_require__(69);
	
	let TransformerElm = __webpack_require__(70);
	let TappedTransformerElm = __webpack_require__(71);
	
	let LedElm = __webpack_require__(72);
	let PotElm = __webpack_require__(73);
	let ClockElm = __webpack_require__(74);
	
	let Scope = __webpack_require__(75);
	
	class SelectionMarquee extends Rectangle {
	  constructor(x1, y1) {
	    super();
	
	    this.x1 = x1;
	    this.y1 = y1;
	  }
	
	  toString() {
	    return `${this.x} ${this.y} ${this.x2} ${this.y2}`;
	  }
	
	  reposition(x, y) {
	    let _x1 = Math.min(x, this.x1);
	    let _x2 = Math.max(x, this.x1);
	    let _y1 = Math.min(y, this.y1);
	    let _y2 = Math.max(y, this.y1);
	
	    this.x2 = _x2;
	    this.y2 = _y2;
	
	    this.x = this.x1 = _x1;
	    this.y = this.y1 = _y1;
	
	    this.width = _x2 - _x1;
	    this.height = _y2 - _y1;
	  }
	
	  draw(renderContext) {
	    renderContext.lineWidth = 0.1;
	
	    let lineShift = 0.5;
	
	    if ((this.x1 != null) && (this.x2 != null) && (this.y1 != null) && (this.y2 != null)) {
	      renderContext.drawLine(this.x1 + lineShift, this.y1 + lineShift, this.x2 + lineShift, this.y1 + lineShift, "#FFFF00", 0);
	      renderContext.drawLine(this.x1 + lineShift, this.y2 + lineShift, this.x2 + lineShift, this.y2 + lineShift, "#FFFF00", 1);
	
	      renderContext.drawLine(this.x1 + lineShift, this.y1 + lineShift, this.x1 + lineShift, this.y2 + lineShift, "#FFFF00", 1);
	      renderContext.drawLine(this.x2 + lineShift, this.y1 + lineShift, this.x2 + lineShift, this.y2 + lineShift, "#FFFF00", 1);
	    }
	  }
	}
	
	class CircuitUI extends Observer {
	  static initClass() {
	    this.ON_COMPONENT_HOVER = "ON_COMPONENT_HOVER";
	    this.ON_COMPONENT_CLICKED = "ON_COMPONENT_CLICKED";
	    this.ON_COMPONENTS_SELECTED = "ON_COMPONENTS_SELECTED";
	    this.ON_COMPONENTS_DESELECTED = "ON_COMPONENTS_DESELECTED";
	    this.ON_COMPONENTS_MOVED = "ON_COMPONENTS_MOVED";
	
	    this.MOUSEDOWN = 1;
	  }
	
	  constructor(Circuit, Canvas) {
	    super();
	
	    this.Circuit = Circuit;
	    this.Canvas = Canvas;
	
	    // TODO: Extract to param
	    this.xMargin = 200;
	    this.yMargin = 56;
	
	    this.mousemove = this.mousemove.bind(this);
	    this.mousedown = this.mousedown.bind(this);
	    this.mouseup = this.mouseup.bind(this);
	    this.highlightedComponent = null;
	    this.selectedNode = null;
	    this.selectedComponents = [];
	
	    // TODO: Width and height are currently undefined
	    this.width = this.Canvas.width;
	    this.height = this.Canvas.height;
	
	    this.previouslySelectedComponents = [];
	
	    this.placeX = null;
	    this.placeY = null;
	
	    this.config = {
	      keyboard: true
	    };
	
	    this.CircuitCanvas = new CircuitCanvas(Circuit, this);
	
	    this.context = this.CircuitCanvas.context;
	    this.isDragging = false;
	
	    this.Canvas.addEventListener('mousemove', this.mousemove);
	    this.Canvas.addEventListener('mousedown', this.mousedown);
	    this.Canvas.addEventListener('mouseup', this.mouseup);
	
	    // Callbacks
	    this.onSelectionChanged = this.noop;
	    this.onComponentClick = this.noop;
	    this.onComponentHover = this.noop;
	    this.onNodeHover = this.noop;
	    this.onNodeClick = this.noop;
	    this.onUpdateComplete = this.noop;
	  }
	
	  noop() {
	  }
	
	  mousemove(event) {
	    let component;
	    let x = event.offsetX - this.xMargin;
	    let y = event.offsetY - this.yMargin;
	
	    this.newlyHighlightedComponent = null;
	
	    this.lastX = this.snapX;
	    this.lastY = this.snapY;
	
	    this.snapX = Util.snapGrid(x);
	    this.snapY = Util.snapGrid(y);
	
	    // TODO: WIP for interactive element placing
	    if (this.placeComponent) {
	      this.placeComponent.setPoints();
	
	      if (this.placeX && this.placeY) {
	        this.placeComponent.point1.x = this.placeX;
	        this.placeComponent.point1.y = this.placeY;
	
	        this.placeComponent.point2.x = this.snapX;
	        this.placeComponent.point2.y = this.snapY;
	
	        this.placeComponent.place();
	      }
	    } else {
	
	      // Update marquee
	      if (this.marquee) {
	        this.marquee.reposition(x, y);
	        this.allSelectedComponents = [];
	
	        //this.selectedComponents = [];
	
	        for (let component of this.Circuit.getElements()) {
	          if (this.marquee.collidesWithComponent(component)) {
	            this.allSelectedComponents.push(component);
	
	            /*
	            if (this.selectedComponents.indexOf(component) < 0) {
	              this.selectedComponents.push(component);
	              this.onSelectionChanged(this.selectedComponents);
	            }
	            */
	          }
	        }
	
	        // UPDATE MARQUEE SELECTION
	        // TODO OPTIMIZE
	        if (this.allSelectedComponents.length != this.previouslySelectedComponents.length) {
	          let newlySelectedComponents = [];
	          let newlyUnselectedComponents = [];
	
	          for (let currentlySelectedComponent of this.allSelectedComponents)
	            if (this.previouslySelectedComponents.indexOf(currentlySelectedComponent) < 0)
	              newlySelectedComponents.push(currentlySelectedComponent);
	
	          for (let previouslySelectedComponent of this.previouslySelectedComponents)
	            if (this.allSelectedComponents.indexOf(previouslySelectedComponent) < 0)
	              newlyUnselectedComponents.push(previouslySelectedComponent);
	
	
	          if (newlySelectedComponents.length > 0 || newlyUnselectedComponents.length > 0) {
	            this.onSelectionChanged({
	              selection: this.allSelectedComponents,
	              added: newlySelectedComponents,
	              removed: newlyUnselectedComponents
	            })
	          }
	        }
	
	        this.selectedComponents = this.allSelectedComponents;
	        this.previouslySelectedComponents = this.allSelectedComponents;
	
	
	        // Update highlighted node
	      } else {
	        this.previouslyHighlightedNode = this.highlightedNode;
	        this.highlightedNode = this.Circuit.getNodeAtCoordinates(this.snapX, this.snapY);
	
	        if (this.highlightedNode) {
	
	          if (!this.selectedNode && this.previouslyHighlightedNode != this.highlightedNode)
	            this.onNodeHover(this.highlightedNode);
	
	        } else {
	
	          for (let component of this.Circuit.getElements()) {
	            if (component.getBoundingBox().contains(x, y)) {
	              this.newlyHighlightedComponent = component;
	            }
	          }
	        }
	
	        if (!this.selectedNode && this.previouslyHighlightedNode && !this.highlightedNode && this.onNodeUnhover)
	          this.onNodeUnhover(this.previouslyHighlightedNode);
	
	        if (this.selectedNode) {
	          for (let element of this.selectedNode.getNeighboringElements()) {
	            if (element) {
	              // console.log(element);
	              let post = element.getPostAt(this.selectedNode.x, this.selectedNode.y);
	              if (post) {
	                post.x = this.snapX;
	                post.y = this.snapY;
	
	                element.place()
	              } else {
	                console.warn("No post at", this.selectedNode.x, this.selectedNode.y);
	              }
	
	              element.recomputeBounds();
	            }
	          }
	
	          this.lastNodeX = this.selectedNode.x;
	          this.lastNodeY = this.selectedNode.y;
	
	          this.selectedNode.x = this.snapX;
	          this.selectedNode.y = this.snapY;
	
	          if (this.onNodeDrag && ((this.lastNodeX != this.selectedNode.x) || (this.lastNodeY != this.selectedNode.y))) {
	            this.onNodeDrag(this.selectedNode);
	
	            this.lastNodeX = this.selectedNode.x;
	            this.lastNodeY = this.selectedNode.y;
	          }
	        } else {
	
	          // COMPONENT HOVER/UNHOVER EVENT
	          if (this.newlyHighlightedComponent) {
	            if (this.newlyHighlightedComponent !== this.highlightedComponent) {
	              this.highlightedComponent = this.newlyHighlightedComponent;
	
	              if (this.onComponentHover && !this.isDragging)
	                this.onComponentHover(this.highlightedComponent);
	
	              this.notifyObservers(CircuitUI.ON_COMPONENT_HOVER, this.highlightedComponent);
	            }
	
	          } else {
	            if (this.highlightedComponent && this.onComponentUnhover && !this.isDragging)
	              this.onComponentUnhover(this.highlightedComponent);
	
	            this.highlightedComponent = null;
	          }
	        }
	      }
	    }
	
	    // Move components
	    if (!this.marquee && !this.isPlacingComponent() && !this.selectedNode && (this.selectedComponents && this.selectedComponents.length > 0) && (event.which === CircuitUI.MOUSEDOWN) && ((this.lastX !== this.snapX) || (this.lastY !== this.snapY))) {
	      this.isDragging = true;
	      if (this.onComponentsDrag)
	        this.onComponentsDrag(this.selectedComponents);
	
	      for (let component of Array.from(this.selectedComponents)) {
	        component.move(this.snapX - this.lastX, this.snapY - this.lastY);
	      }
	    }
	  }
	
	  mousedown(event) {
	    let x = event.offsetX - this.xMargin;
	    let y = event.offsetY - this.yMargin;
	
	    if (this.placeComponent) {
	      if (!this.placeX && !this.placeY) {
	
	        // Place the first post
	        this.placeX = this.snapX;
	        this.placeY = this.snapY;
	      } else {
	
	        // Place the component
	        this.Circuit.solder(this.placeComponent);
	
	        this.placeComponent.place();
	        this.placeComponent = null;
	        this.placeX = null;
	        this.placeY = null;
	      }
	    } else {
	
	      if (!this.highlightedComponent && !this.placeComponent && !this.highlightedNode) {
	        this.marquee = new SelectionMarquee(x, y);
	      }
	
	      this.selectedNode = this.Circuit.getNodeAtCoordinates(this.snapX, this.snapY);
	
	      if (this.selectedNode && this.onNodeClick)
	        this.onNodeClick(this.selectedNode);
	
	      for (let component of this.Circuit.getElements()) {
	        if (component.getBoundingBox().contains(x, y)) {
	          this.notifyObservers(CircuitUI.ON_COMPONENT_CLICKED, component);
	
	          if (this.onComponentClick)
	            this.onComponentClick(component);
	
	          if (component.toggle)
	            component.toggle();
	
	          if (component.onclick)
	            component.onclick();
	
	          if (component.onComponentClick)
	            component.onComponentClick();
	        }
	      }
	    }
	  }
	
	  mouseup(event) {
	    this.marquee = null;
	    this.selectedNode = null;
	
	    if (this.highlightedComponent && !this.selectedNode && !this.isDragging) {
	      if (this.selectedComponents.length > 1 || this.selectedComponents.indexOf(this.highlightedComponent) < 0) {
	        let added = (this.selectedComponents.indexOf(this.highlightedComponent) < 0) ? [this.highlightedComponent] : [];
	        let removed = (this.selectedComponents.indexOf(this.highlightedComponent) < 0) ? [] : [this.highlightedComponent];
	
	        this.onSelectionChanged({
	          selection: [this.highlightedComponent],
	          added: added,
	          removed: removed
	        });
	
	        this.selectedComponents = [this.highlightedComponent];
	      }
	    }
	
	    this.isDragging = false;
	
	    if (this.selectedComponents && this.selectedComponents.length > 0) {
	      this.notifyObservers(CircuitUI.ON_COMPONENTS_DESELECTED, this.selectedComponents);
	    }
	  }
	
	  togglePause() {
	    if (this.Circuit.isStopped)
	      this.Circuit.resume();
	    else
	      this.Circuit.pause();
	  }
	
	  pause() {
	  }
	
	  play() {
	  }
	
	  restart() {
	  }
	
	  isSelecting() {
	    return !!this.marquee;
	  }
	
	  isPlacingComponent() {
	    return !!this.placeComponent;
	  }
	
	  getMode() {
	    let mode = "";
	
	    if (this.isDragging)
	      mode = "DRAGGING";
	    else if(this.isPlacingComponent())
	      mode = "PLACING";
	    else if(this.isSelecting())
	      mode = "SELECTING";
	    else
	      mode = "IDLE";
	
	    return mode
	  }
	
	  clearPlaceComponent() {
	    this.placeX = null;
	    this.placeY = null;
	    this.placeComponent = null;
	  }
	
	  resetSelection() {
	    if (this.selectedComponents && (this.selectedComponents.length > 0))
	      this.onSelectionChanged({
	        selection: [],
	        added:[],
	        removed: this.selectedComponents
	      });
	
	    this.selectedComponents = [];
	  }
	
	  getSelectedComponents() {
	    return this.selectedComponents;
	  }
	
	  setPlaceComponent(componentName) {
	    let klass = eval(componentName);
	
	    this.placeComponent = new klass();
	
	    this.resetSelection();
	
	    return this.placeComponent;
	  }
	
	  remove(components) {
	    console.log("components", components);
	    return this.Circuit.destroy(components);
	  }
	}
	
	CircuitUI.initClass();
	module.exports = CircuitUI;


/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	let Observer = __webpack_require__(87);
	let Util = __webpack_require__(5);
	let Point = __webpack_require__(4);
	let Settings = __webpack_require__(2);
	let Color = __webpack_require__(8);
	
	let CircuitComponent = __webpack_require__(1);
	let environment = __webpack_require__(10);
	
	class CircuitCanvas extends Observer {
	
	  constructor(Circuit, circuitUI) {
	    super();
	
	    this.circuitUI = circuitUI;
	    this.Circuit = Circuit;
	    this.Canvas = this.circuitUI.Canvas;
	
	    // TODO: Extract to param
	    this.xMargin = circuitUI.xMargin;
	    this.yMargin = circuitUI.yMargin;
	
	    this.lineShift = 0;
	
	    this.draw = this.draw.bind(this);
	    this.drawDots = this.drawDots.bind(this);
	
	    if (environment.isBrowser) {
	      this.context = Sketch.augment(this.Canvas.getContext("2d", {alpha: false}), {
	        autoclear: false,
	        draw: this.draw
	        //mousemove: this.mousemove,
	        //mousedown: this.mousedown,
	        //mouseup: this.mouseup
	        //fullscreen: false,
	        //width: this.width,
	        //height: this.height
	      });
	
	      this.setupScopes();
	      this.renderPerformance();
	
	    } else {
	      this.context = this.Canvas.getContext("2d");
	    }
	  }
	
	  setupScopes(){
	    for (let scopeElm of this.Circuit.getScopes()) {
	
	      let scElm = this.renderScopeCanvas(scopeElm.circuitElm.getName());
	      $(scElm).draggable();
	      $(scElm).resizable();
	
	      this.Canvas.parentNode.append(scElm);
	
	      let sc = new Maxwell.ScopeCanvas(this, scElm);
	      scopeElm.setCanvas(sc);
	
	      $(scElm).on("resize", function (evt) {
	        let innerElm = $(scElm).find(".plot-context");
	
	        sc.resize(innerElm.width(), innerElm.height() - 5);
	      });
	
	      // this.scopeCanvases.push(sc);
	    }
	  }
	
	  renderPerformance() {
	    this.performanceMeter = new TimeSeries();
	
	    let chart = new SmoothieChart({
	      millisPerPixel: 35,
	      grid: {fillStyle: 'transparent', strokeStyle: 'transparent'},
	      labels: {fillStyle: '#000000', precision: 0}
	    });
	
	    chart.addTimeSeries(this.performanceMeter, {strokeStyle: 'rgba(255, 0, 200, 1)', lineWidth: 1});
	    chart.streamTo(document.getElementById("performance_sparkline"), 500);
	  }
	
	  draw() {
	    if (this.context) {
	      if (this.context.clear) {
	        this.context.clear();
	      }
	      // this.drawGrid();
	
	      this.context.save();
	      this.context.translate(this.xMargin, this.yMargin);
	
	      this.fillText("Time elapsed: " + Util.getUnitText(this.Circuit.time, "s"), 10, 5, Settings.TEXT_COLOR, 1.2*Settings.TEXT_SIZE);
	      this.fillText("Frame Time: " + Math.floor(this.Circuit.lastFrameTime) + "ms", 785, 15, Settings.TEXT_COLOR, 1.2*Settings.TEXT_SIZE);
	
	      if (this.performanceMeter) {
	        this.performanceMeter.append(new Date().getTime(), this.Circuit.lastFrameTime);
	      }
	    }
	
	    /*
	    if ((this.circuitUI.snapX != null) && (this.circuitUI.snapY != null)) {
	      this.drawCircle(this.circuitUI.snapX, this.circuitUI.snapY, 1, "#F00");
	      this.fillText(`${this.circuitUI.snapX}, ${this.circuitUI.snapY}`, this.circuitUI.snapX + 10, this.circuitUI.snapY - 10);
	    }
	    */
	
	    this.drawInfoText();
	
	    if (this.circuitUI.marquee) {
	      this.circuitUI.marquee.draw(this)
	    }
	
	    // UPDATE FRAME ----------------------------------------------------------------
	    this.Circuit.updateCircuit();
	
	    if (this.circuitUI.onUpdateComplete) {
	      this.circuitUI.onUpdateComplete();
	    }
	    // -----------------------------------------------------------------------------
	
	    this.drawScopes();
	    this.drawComponents();
	
	    if (this.context) {
	      if (this.circuitUI.highlightedNode)
	        this.drawCircle(this.circuitUI.highlightedNode.x + 0.5, this.circuitUI.highlightedNode.y + 0.5, 7, 3, "#0F0");
	
	      if (this.circuitUI.selectedNode)
	        this.drawRect(this.circuitUI.selectedNode.x - 10 + 0.5, this.circuitUI.selectedNode.y - 10 + 0.5, 21, 21, 1, "#0FF");
	
	      if (this.circuitUI.placeComponent) {
	        this.context.fillText(`Placing ${this.circuitUI.placeComponent.constructor.name}`, this.circuitUI.snapX + 10, this.circuitUI.snapY + 10);
	
	        if (this.circuitUI.placeY && this.circuitUI.placeX && this.circuitUI.placeComponent.x2() && this.circuitUI.placeComponent.y2()) {
	          this.drawComponent(this.circuitUI.placeComponent);
	        }
	      }
	
	      if (this.circuitUI.highlightedComponent) {
	        this.circuitUI.highlightedComponent.draw(this);
	
	        this.context.save();
	        this.context.fillStyle = Settings.POST_COLOR;
	        this.context.fillRect(this.circuitUI.highlightedComponent.x1()-2*Settings.POST_RADIUS, this.circuitUI.highlightedComponent.y1()-2*Settings.POST_RADIUS, 4*Settings.POST_RADIUS, 4*Settings.POST_RADIUS);
	
	        if (this.circuitUI.highlightedComponent.x2())
	          this.context.fillRect(this.circuitUI.highlightedComponent.x2()-2*Settings.POST_RADIUS, this.circuitUI.highlightedComponent.y2()-2*Settings.POST_RADIUS, 4*Settings.POST_RADIUS, 4*Settings.POST_RADIUS);
	        this.context.restore();
	        // this.drawRect(this.circuitUI.highlightedComponent.x2(), this.circuitUI.highlightedComponent.y2(), Settings.POST_RADIUS + 2, Settings.POST_RADIUS + 2, 2, Settings.HIGHLIGHT_COLOR);
	      }
	    }
	
	    if (this.context) {
	      if (this.Circuit && this.Circuit.debugModeEnabled()) {
	        this.drawDebugInfo();
	        this.drawDebugOverlay();
	      }
	
	      this.context.restore()
	    }
	  }
	
	  withSelection(func) {
	
	
	    func(this)
	  }
	
	  renderScopeCanvas(elementName) {
	    let scopeWrapper = document.createElement("div");
	    scopeWrapper.className = "plot-pane";
	
	    let leftAxis = document.createElement("div");
	    leftAxis.className = "left-axis";
	
	    let scopeCanvas = document.createElement("div");
	    scopeCanvas.className = "plot-context";
	
	    if (elementName) {
	      let label = document.createElement("div");
	      label.className = "plot-label";
	      label.innerText = elementName;
	
	      scopeWrapper.append(label);
	    }
	
	    scopeWrapper.append(leftAxis);
	    scopeWrapper.append(scopeCanvas);
	
	    return scopeWrapper;
	  }
	
	  drawInfoText() {
	    if (this.circuitUI.highlightedComponent != null) {
	      let summaryArr = this.circuitUI.highlightedComponent.getSummary();
	
	      if (summaryArr) {
	        for (let idx = 0; idx < summaryArr.length; ++idx) {
	          this.fillText(summaryArr[idx], 500, (idx * 11) + 5, "#1b4e24");
	        }
	      }
	    }
	  }
	
	  beginPath() {
	    this.pathMode = true;
	    this.context.beginPath();
	  }
	
	  closePath() {
	    this.pathMode = false;
	    this.context.closePath();
	  }
	
	  getVoltageColor(volts) {
	    let fullScaleVRange = this.Circuit.Params.voltageRange;
	
	    let scale = Color.Gradients.voltage_default;
	
	    let numColors = scale.length - 1;
	
	    let value = Math.floor(((volts + fullScaleVRange) * numColors) / (2 * fullScaleVRange));
	    if (value < 0) {
	      value = 0;
	    } else if (value >= numColors) {
	      value = numColors - 1;
	    }
	
	    return scale[value];
	  }
	
	  drawCoil(point1, point2, vStart, vEnd, hs) {
	    let color, cx, hsx, voltageLevel;
	    hs = hs || 8;
	
	    let segments = 40;
	
	    let ps1 = new Point(0, 0);
	    let ps2 = new Point(0, 0);
	
	    ps1.x = point1.x;
	    ps1.y = point1.y;
	
	    this.context.save();
	
	    this.context.beginPath();
	    this.context.lineJoin = 'bevel';
	
	    this.context.moveTo(ps1.x + this.lineShift, ps1.y + this.lineShift);
	
	    let grad = this.context.createLinearGradient(point1.x, point1.y, point2.x, point2.y);
	
	    grad.addColorStop(0, this.getVoltageColor(vStart));
	    grad.addColorStop(1, this.getVoltageColor(vEnd));
	
	    this.context.strokeStyle = grad;
	
	    for (let i = 0; i < segments; ++i) {
	      cx = (((i + 1) * 8 / segments) % 2) - 1;
	      hsx = Math.sqrt(1 - cx * cx);
	      ps2 = Util.interpolate(point1, point2, i / segments, hsx * hs);
	      voltageLevel = vStart + (vEnd - vStart) * i / segments;
	      color = this.getVoltageColor(voltageLevel);
	
	      if (this.boldLines) {
	        this.context.lineWidth = Settings.BOLD_LINE_WIDTH;
	        this.context.strokeStyle = Settings.SELECT_COLOR;
	      } else {
	        this.context.lineWidth = Settings.LINE_WIDTH + 1;
	        //this.context.strokeStyle = color;
	      }
	
	      this.context.lineTo(ps2.x + this.lineShift, ps2.y + this.lineShift);
	
	      ps1.x = ps2.x;
	      ps1.y = ps2.y;
	    }
	
	    this.context.stroke();
	
	    this.context.closePath();
	    this.context.restore()
	  }
	
	  drawScopes() {
	    if (this.context) {
	      for (let scopeElm of this.Circuit.getScopes()) {
	        let scopeCanvas = scopeElm.getCanvas();
	
	        if (scopeCanvas) {
	
	
	          var center = scopeElm.circuitElm.getCenter();
	          this.context.save();
	
	          this.context.setLineDash([5, 5]);
	          this.context.strokeStyle = "#FFA500";
	          this.context.lineWidth = 1;
	          this.context.moveTo(center.x, center.y);
	          this.context.lineTo(scopeCanvas.x(), scopeCanvas.y() + scopeCanvas.height() / 2);
	
	          this.context.stroke();
	
	          this.context.restore();
	        }
	      }
	    }
	  }
	
	  drawComponents() {
	    if (this.context) {
	      for (var component of Array.from(this.Circuit.getElements()))
	        this.drawComponent(component);
	
	      if (this.Circuit && this.Circuit.debugModeEnabled()) {
	        for (let nodeIdx = 0; nodeIdx < this.Circuit.numNodes(); ++nodeIdx) {
	          let voltage = Util.singleFloat(this.Circuit.getVoltageForNode(nodeIdx));
	          let node = this.Circuit.getNode(nodeIdx);
	
	          this.context.fillText(`${nodeIdx}:${voltage}`, node.x + 10, node.y - 10, "#FF8C00");
	        }
	      }
	    }
	  }
	
	  drawComponent(component) {
	    if (component && Array.from(this.circuitUI.selectedComponents).includes(component)) {
	      this.drawBoldLines();
	      component.draw(this);
	      /*
	       for (let i = 0; i < component.getPostCount(); ++i) {
	       let post = component.getPost(i);
	       this.drawCircle(post.x, post.y, Settings.POST_RADIUS + 2, 2, Settings.SELECT_COLOR);
	       }
	       */
	    }
	
	    this.drawDefaultLines();
	
	    // Main entry point to draw component
	    component.draw(this);
	  }
	
	  // TODO: Move to CircuitComponent
	  drawDots(ptA, ptB, component) {
	    /**
	     * Previous behavior was for current to not display when paused
	     if (this.Circuit && this.Circuit.isStopped) {
	      return
	    }
	     */
	
	    this.context.save();
	
	    let ds = Settings.CURRENT_SEGMENT_LENGTH;
	
	    let dx = ptB.x - ptA.x;
	    let dy = ptB.y - ptA.y;
	    let dn = Math.sqrt((dx * dx) + (dy * dy));
	
	    let newPos;
	    if (typeof(component) == "number") {
	      newPos = component
	    } else {
	      if (!component)
	        return;
	      newPos = component.curcount;
	    }
	
	    while (newPos < dn) {
	      let xOffset = ptA.x + ((newPos * dx) / dn);
	      let yOffset = ptA.y + ((newPos * dy) / dn);
	
	      if (Settings.CURRENT_DISPLAY_TYPE === Settings.CURENT_TYPE_DOTS) {
	        this.fillCircle(xOffset, yOffset, Settings.CURRENT_RADIUS, 1, Settings.CURRENT_COLOR);
	      } else {
	        let xOffset0 = xOffset - ((3 * dx) / dn);
	        let yOffset0 = yOffset - ((3 * dy) / dn);
	
	        let xOffset1 = xOffset + ((3 * dx) / dn);
	        let yOffset1 = yOffset + ((3 * dy) / dn);
	
	        //this.context.save();
	        this.context.strokeStyle = Settings.CURRENT_COLOR;
	        this.context.lineWidth = Settings.CURRENT_RADIUS;
	        this.context.beginPath();
	        this.context.moveTo(xOffset0, yOffset0);
	        this.context.lineTo(xOffset1, yOffset1);
	        this.context.stroke();
	        this.context.closePath();
	        //this.context.restore();
	      }
	
	      newPos += ds
	    }
	
	    this.context.restore();
	  }
	
	  drawDebugOverlay() {
	    if (!this.Circuit || !this.context) {
	      return;
	    }
	
	    this.context.save();
	
	    // Nodes
	    let nodeIdx = 0;
	    for (let node of this.Circuit.getNodes()) {
	
	      this.context.beginPath();
	      this.context.arc(node.x, node.y, 1, 0, 2 * Math.PI, true);
	      this.context.strokeStyle = "#ff00ab";
	      this.context.stroke();
	      this.context.fillText(nodeIdx, node.x + 5, node.y + 20);
	
	      let yOffset = 30;
	      for (let link of node.links) {
	        //this.context.fillText(link.elm.getName(), node.x + 5, node.y + yOffset);
	
	        yOffset += 10;
	      }
	
	      nodeIdx++;
	    }
	    this.context.restore();
	
	    // Nodes
	  }
	
	  drawDebugInfo(x = 1100, y = 50) {
	    if (!this.Circuit || !this.context) {
	      return;
	    }
	
	    let str = `UI: ${this.circuitUI.width}x${this.circuitUI.height}\n`;
	    str += this.circuitUI.getMode() + "\n";
	
	    str += "Highlighted Node: :" + this.circuitUI.highlightedNode + "\n";
	    str += "Selected Node: :" + this.circuitUI.selectedNode + "\n";
	    str += "Highlighted Component: " + this.circuitUI.highlightedComponent + "\n";
	    str += `Selection [${this.circuitUI.marquee || ""}]\n  - `;
	    str += this.circuitUI.selectedComponents.join("\n  - ") + "\n";
	
	
	    str += "\nCircuit:\n";
	
	    // Name
	    str += `Name: ${this.Circuit.name}\n`;
	
	    // Linear
	    str += `Linear: ${!this.Circuit.Solver.circuitNonLinear}\n`;
	
	    // Linear
	    str += `VS Count: ${this.Circuit.voltageSourceCount}\n`;
	
	    // Param
	    str += `Params:\n ${this.Circuit.Params}\n`;
	
	    // Iterations
	    str += `Frame #: ${this.Circuit.getIterationCount()}\n`;
	
	    // Elements
	    str += `Elements: (${this.Circuit.getElements().length})\n `;
	    for (let element of this.Circuit.getElements()) {
	      str += "  " + element + "\n";
	    }
	
	    str += `Nodes: (${this.Circuit.numNodes()})\n`;
	    for (let node of this.Circuit.getNodes()) {
	      str += "  " + node + "\n";
	    }
	
	    // RowInfo
	    str += `RowInfo: (${this.Circuit.getRowInfo().length})\n`;
	    for (let rowInfo of this.Circuit.getRowInfo()) {
	      str += "  " + rowInfo + "\n";
	    }
	
	    str += "Circuit Matrix:\n";
	    str += this.Circuit.Solver.dumpFrame() + "\n";
	
	    str += "Orig Matrix:\n";
	    str += this.Circuit.Solver.dumpOrigFrame() + "\n";
	
	    // CircuitRightSide
	    // CircuitLeftSide
	
	    let lineHeight = 10;
	    let nLines = 0;
	    for (let line of str.split("\n")) {
	      this.context.fillText(line, x, y + nLines * lineHeight);
	
	      nLines++;
	    }
	  }
	
	  // TODO: Move to CircuitComponent
	  drawLeads(component) {
	    if ((component.point1 != null) && (component.lead1 != null)) {
	      this.drawLinePt(component.point1, component.lead1, this.getVoltageColor(component.volts[0]));
	    }
	    if ((component.point2 != null) && (component.lead2 != null)) {
	      return this.drawLinePt(component.lead2, component.point2, this.getVoltageColor(component.volts[1]));
	    }
	  }
	
	  // TODO: Move to CircuitComponent
	  drawPosts(component, color = Settings.POST_COLOR) {
	    let post;
	
	    for (let i = 0; i < component.getPostCount(); ++i) {
	      post = component.getPost(i);
	      this.drawPost(post.x, post.y, color);
	    }
	  }
	
	  drawPost(x0, y0, fillColor = Settings.POST_COLOR, strokeColor = Settings.POST_OUTLINE_COLOR) {
	    let oulineWidth = Settings.POST_OUTLINE_SIZE;
	
	    if (this.boldLines) {
	      strokeColor = Settings.POST_SELECT_OUTLINE_COLOR;
	      fillColor = Settings.POST_SELECT_COLOR;
	      oulineWidth += 3;
	    }
	
	    this.fillCircle(x0, y0, Settings.POST_RADIUS, oulineWidth, fillColor, strokeColor);
	  }
	
	  drawBoldLines() {
	    return this.boldLines = true;
	  }
	
	  drawDefaultLines() {
	    return this.boldLines = false;
	  }
	
	  // Draw Primitives
	
	  fillText(text, x, y, fillColor = Settings.TEXT_COLOR, size = Settings.TEXT_SIZE, strokeColor = 'rgba(255, 255, 255, 0.3)') {
	    this.context.save();
	
	    this.context.fillStyle = fillColor;
	    this.context.strokeStyle = strokeColor;
	    this.context.font = `${Settings.TEXT_STYLE} ${size}pt ${Settings.FONT}`;
	    this.context.fillText(text, x, y);
	
	    this.context.lineWidth = 0;
	    this.context.strokeText(text, x, y);
	
	    let textMetrics = this.context.measureText(text);
	
	    this.context.restore();
	
	    return textMetrics;
	  }
	
	  fillCircle(x, y, radius, lineWidth = Settings.LINE_WIDTH, fillColor = '#FFFF00', lineColor = null) {
	    this.context.save();
	
	    this.context.beginPath();
	    this.context.arc(x, y, radius, 0, 2 * Math.PI);
	
	    if (lineColor && lineWidth > 0) {
	      this.context.lineWidth = lineWidth;
	      this.context.strokeStyle = lineColor;
	      this.context.stroke();
	    }
	
	    this.context.fillStyle = fillColor;
	    this.context.fill();
	
	    this.context.closePath();
	
	    this.context.restore();
	  }
	
	  drawCircle(x, y, radius, lineWidth = Settings.LINE_WIDTH, lineColor = "#000000") {
	    this.context.save();
	
	    this.context.strokeStyle = lineColor;
	    this.context.lineWidth = lineWidth;
	
	    this.context.beginPath();
	    this.context.arc(x, y, radius, 0, 2 * Math.PI, true);
	    this.context.stroke();
	    this.context.closePath();
	
	    this.context.restore();
	  }
	
	  drawRect(x, y, width, height, lineWidth = Settings.LINE_WIDTH, lineColor = Settings.STROKE_COLOR) {
	    this.context.save();
	
	    this.context.strokeStyle = lineColor;
	    this.context.lineJoin = 'miter';
	    this.context.lineWidth = lineWidth;
	    this.context.strokeRect(x + this.lineShift, y + this.lineShift, width, height);
	    this.context.stroke();
	
	    this.context.restore();
	  }
	
	  drawLinePt(pa, pb, color = Settings.STROKE_COLOR, lineWidth = Settings.LINE_WIDTH) {
	    this.drawLine(pa.x, pa.y, pb.x, pb.y, color, lineWidth);
	  }
	
	  drawValue(perpindicularOffset, parallelOffset, component, text = null, text_size = Settings.TEXT_SIZE) {
	    let x, y;
	
	    this.context.save();
	    this.context.textAlign = "center";
	
	    this.context.font = "bold 7pt Courier";
	
	    let theta = Math.atan(component.dy()/component.dx());
	
	    let stringWidth = this.context.measureText(text).width;
	    let stringHeight = this.context.measureText(text).actualBoundingBoxAscent || 0;
	
	    this.context.fillStyle = Settings.TEXT_COLOR;
	    // if (component.isVertical()) {
	
	      ({x} = component.getCenter()); //+ perpindicularOffset
	      ({y} = component.getCenter()); //+ parallelOffset - stringHeight / 2.0
	
	      this.context.translate(x, y);
	      this.context.rotate(theta);
	      this.fillText(text, parallelOffset, -perpindicularOffset, Settings.TEXT_COLOR, text_size);
	      /*
	    } else {
	      x = component.getCenter().x + parallelOffset;
	      y = component.getCenter().y + perpindicularOffset;
	
	      this.context.translate(x, y);
	
	      this.context.save();
	      this.context.rotate(theta);
	      this.context.restore();
	
	      this.fillText(text, x, y, Settings.TEXT_COLOR, text_size);
	    }
	    */
	
	    this.context.restore();
	  }
	
	
	
	  drawLine(x, y, x2, y2, color = Settings.STROKE_COLOR, lineWidth = Settings.LINE_WIDTH) {
	    this.context.save();
	
	    if (!this.pathMode)
	      this.context.beginPath();
	
	    if (this.boldLines) {
	      this.context.lineWidth = Settings.BOLD_LINE_WIDTH;
	      this.context.strokeStyle = Settings.SELECT_COLOR;
	    } else {
	      this.context.lineWidth = lineWidth;
	      this.context.strokeStyle = color;
	    }
	
	    if (!this.pathMode)
	      this.context.moveTo(x + this.lineShift, y + this.lineShift);
	    this.context.lineTo(x2 + this.lineShift, y2 + this.lineShift);
	    this.context.stroke();
	
	    if (!this.pathMode)
	      this.context.closePath();
	
	    this.context.restore();
	  }
	
	  drawThickPolygon(xlist, ylist, color = Settings.STROKE_COLOR, fill = Settings.FILL_COLOR) {
	    this.context.save();
	
	    this.context.fillStyle = fill;
	    this.context.strokeStyle = color;
	    this.context.beginPath();
	
	    this.context.moveTo(xlist[0], ylist[0]);
	    for (let i = 0; i < xlist.length; ++i) {
	      this.context.lineTo(xlist[i], ylist[i]);
	    }
	
	    this.context.closePath();
	    this.context.stroke();
	    if (color) {
	      this.context.fill();
	    }
	
	    this.context.restore();
	  }
	
	  drawThickPolygonP(polygon, color = Settings.STROKE_COLOR, fill = Settings.FILL_COLOR) {
	    let numVertices = polygon.numPoints();
	
	    this.context.save();
	
	    this.context.fillStyle = fill;
	    this.context.strokeStyle = color;
	    this.context.beginPath();
	
	    this.context.moveTo(polygon.getX(0), polygon.getY(0));
	    for (let i = 0; i < numVertices; ++i) {
	      this.context.lineTo(polygon.getX(i), polygon.getY(i));
	    }
	
	    this.context.closePath();
	    this.context.fill();
	    this.context.stroke();
	
	    this.context.restore();
	  }
	
	}
	
	module.exports = CircuitCanvas;


/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	let ScopeCanvas = __webpack_require__(94);
	let Util = __webpack_require__(5);
	
	class RickshawScopeCanvas extends ScopeCanvas {
	  constructor(parentUI, scopeDiv, x=800, y=700) {
	    super(parentUI, scopeDiv, x, y);
	
	    var plotContext = scopeDiv.getElementsByClassName("plot-context")[0];
	    var leftAxisDiv = scopeDiv.getElementsByClassName("left-axis")[0];
	
	    this.graph = new Rickshaw.Graph({
	      element: plotContext,
	      width: plotContext.offsetWidth ,
	      height: plotContext.offsetHeight,
	      interpolation: 'linear',
	      renderer: 'line',
	      stroke: false,
	      strokeWidth: 1,
	      min: 'auto',
	      padding: {
	        top: 0.08,
	        botom: 0.09,
	      },
	      series: [
	        {
	          color: "#F00",
	          data: [],
	          name: 'Voltage'
	        },
	        {
	          color: "#00F",
	          data: [],
	          name: 'Current'
	        }
	      ]
	    });
	
	    var ticksTreatment = 'glow';
	
	    this.xAxis = new Rickshaw.Graph.Axis.X({
	      graph: this.graph,
	      //element: leftAxisDiv,
	      ticksTreatment: ticksTreatment,
	      timeFixture: new Rickshaw.Fixtures.Time.Local(),
	      tickFormat: function(d) { return Util.getUnitText(d, "s", 0) }
	    });
	
	    //this.xAxis.render();
	    new Rickshaw.Graph.Axis.Y({
	      graph: this.graph,
	      tickFormat: function(d) { return Util.getUnitText(d, "V", 0) },
	      pixelsPerTick: 30,
	      tickSize: 4,
	      tickTransformation: function(svg) {
	        svg.style("text-anchor", "end").attr("dx", "-0.8em").attr("dy", "-0.3em").attr("transform", 'rotate(-90)');
	      }
	    });
	
	    new Rickshaw.Graph.Axis.Y({
	      graph: this.graph,
	      tickFormat: function(d) { return Util.getUnitText(d, "V", 0) },
	      pixelsPerTick: 30,
	      tickSize: 4,
	      tickTransformation: function(svg) {
	        svg.style("text-anchor", "end").attr("dx", "-0.8em").attr("dy", "-0.3em").attr("transform", 'rotate(-90)');
	      }
	    });
	
	    this.highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
	      graph: this.graph,
	      // legend: legend
	    });
	
	    new Rickshaw.Graph.HoverDetail({
	      graph: this.graph,
	      xFormatter: function (x) {
	        return x + "s";
	      }
	    });
	
	    this.resize(plotContext.offsetWidth, plotContext.offsetHeight - 5);
	  }
	
	  resize(width, height) {
	    this.graph.configure({
	      width: width,
	      height: height
	
	
	    });
	
	    this.graph.render();
	  }
	
	  addVoltage(time, value) {
	    this.graph.series[0].data.push({x: time, y: value});
	
	    if (this.graph.series[0].data.length > this.dataPoints) {
	      this.graph.series[0].data.shift();
	    }
	
	    // this.graph.update();
	  };
	
	  addCurrent(time, value) {
	    this.graph.series[1].data.push({x: time, y: value});
	
	    if (this.graph.series[1].data.length > this.dataPoints) {
	      this.graph.series[1].data.shift();
	    }
	
	    //this.graph.update();
	  };
	
	  redraw() {
	    this.graph.update();
	  }
	}
	
	module.exports = RickshawScopeCanvas;


/***/ },
/* 94 */
/***/ function(module, exports) {

	class ScopeCanvas {
	  constructor(parentUI, scopeDiv, x=800, y=700) {
	    this.dataPoints = 800;
	
	    this.parentUI = parentUI;
	    this.scopeDiv = scopeDiv;
	  }
	
	  x() {
	    return this.scopeDiv.offsetLeft - this.parentUI.xMargin;
	  }
	
	  y() {
	    return this.scopeDiv.offsetTop - this.parentUI.yMargin;
	  }
	
	  height() {
	    return this.scopeDiv.offsetHeight;
	  }
	
	  width() {
	    return this.scopeDiv.offsetWidth;
	  }
	
	  resize(width, height) {
	  }
	
	  addVoltage(value) {
	  };
	
	  addCurrent(value) {
	  };
	}
	
	module.exports = ScopeCanvas;


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	let RailElm = __webpack_require__(18);
	let VoltageElm = __webpack_require__(19);
	
	class ACRailElm extends RailElm {
	  constructor(xa, ya, xb, yb, params, f) {
	    super(xa, ya, xa, ya, params, f);
	
	    this.waveform = VoltageElm.WF_AC;
	  }
	
	  getName() {
	    return "AC Voltage Rail"
	  }
	}
	
	module.exports = ACRailElm;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map