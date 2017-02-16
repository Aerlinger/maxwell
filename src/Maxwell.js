let CircuitComponent = require('./components/CircuitComponent.js');
let CircuitLoader = require('./io/CircuitLoader.js');

let Circuit = require('./circuit/Circuit.js');
let CircuitUI = require('./CircuitUI.js');

let RickshawScopeCanvas = require("./render/RickshawScopeCanvas");

let Components = require("./components");

let AcRailElm = require('./components/ACRailElm.js');
let AntennaElm = require('./components/AntennaElm.js');
let WireElm = require('./components/WireElm.js');
let ResistorElm = require('./components/ResistorElm.js');
let GroundElm = require('./components/GroundElm.js');
let VoltageElm = require('./components/VoltageElm.js');
let DiodeElm = require('./components/DiodeElm.js');
let OutputElm = require('./components/OutputElm.js');
let SwitchElm = require('./components/SwitchElm.js');
let CapacitorElm = require('./components/CapacitorElm.js');
let InductorElm = require('./components/InductorElm.js');
let SparkGapElm = require('./components/SparkGapElm.js');
let CurrentElm = require('./components/CurrentElm.js');
let RailElm = require('./components/RailElm.js');
let MosfetElm = require('./components/MosfetElm.js');
let JfetElm = require('./components/JFetElm.js');
let TransistorElm = require('./components/TransistorElm.js');
let VarRailElm = require('./components/VarRailElm.js');
let OpAmpElm = require('./components/OpAmpElm.js');
let ZenerElm = require('./components/ZenerElm.js');
let Switch2Elm = require('./components/Switch2Elm.js');
let SweepElm = require('./components/SweepElm.js');
let TextElm = require('./components/TextElm.js');
let ProbeElm = require('./components/ProbeElm.js');

let AndGateElm = require('./components/AndGateElm.js');
let NandGateElm = require('./components/NandGateElm.js');
let OrGateElm = require('./components/OrGateElm.js');
let NorGateElm = require('./components/NorGateElm.js');
let XorGateElm = require('./components/XorGateElm.js');
let InverterElm = require('./components/InverterElm.js');

let LogicInputElm = require('./components/LogicInputElm.js');
let LogicOutputElm = require('./components/LogicOutputElm.js');
let AnalogSwitchElm = require('./components/AnalogSwitchElm.js');
let AnalogSwitch2Elm = require('./components/AnalogSwitch2Elm.js');
let MemristorElm = require('./components/MemristorElm.js');
let RelayElm = require('./components/RelayElm.js');
let TunnelDiodeElm = require('./components/TunnelDiodeElm.js');

let ScrElm = require('./components/SCRElm.js');
let TriodeElm = require('./components/TriodeElm.js');

let DecadeElm = require('./components/DecadeElm.js');
let LatchElm = require('./components/LatchElm.js');
let TimerElm = require('./components/TimerElm.js');
let JkFlipFlopElm = require('./components/JkFlipFlopElm.js');
let DFlipFlopElm = require('./components/DFlipFlopElm.js');
let CounterElm = require('./components/CounterElm.js');
let DacElm = require('./components/DacElm.js');
let AdcElm = require('./components/AdcElm.js');
let VcoElm = require('./components/VcoElm.js');
let PhaseCompElm = require('./components/PhaseCompElm.js');
let SevenSegElm = require('./components/SevenSegElm.js');
let CC2Elm = require('./components/CC2Elm.js');

let TransLineElm = require('./components/TransLineElm.js');

let TransformerElm = require('./components/TransformerElm.js');
let TappedTransformerElm = require('./components/TappedTransformerElm.js');

let LedElm = require('./components/LedElm.js');
let PotElm = require('./components/PotElm.js');
let ClockElm = require('./components/ClockElm.js');

let environment = require("./Environment.js");

class Maxwell {
  static createContext(circuitName, circuitData, context, onComplete) {
    let circuit = null;

    if (circuitName) {
      if (typeof circuitData === "string") {
        circuit = Maxwell.loadCircuitFromFile(circuitData, circuit => onComplete(new CircuitUI(circuit, context)));

      } else if ((typeof circuitData === "object") || (typeof circuitData == "Array")) {
        circuit = CircuitLoader.createCircuitFromJsonData(circuitData);
        this.Circuits[circuitName] = circuit;

        onComplete(new CircuitUI(circuit, context))
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
  }
}

Maxwell.Renderer = CircuitUI;
Maxwell.ScopeCanvas = RickshawScopeCanvas;
Maxwell.Circuits = {};
Maxwell.version = "0.0.0";
Maxwell.Components = Components;

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


