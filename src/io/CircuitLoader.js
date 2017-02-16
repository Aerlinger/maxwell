let AntennaElm = require('../components/AntennaElm.js');
let WireElm = require('../components/WireElm.js');
let ResistorElm = require('../components/ResistorElm.js');
let GroundElm = require('../components/GroundElm.js');
let VoltageElm = require('../components/VoltageElm.js');
let DiodeElm = require('../components/DiodeElm.js');
let OutputElm = require('../components/OutputElm.js');
let SwitchElm = require('../components/SwitchElm.js');
let CapacitorElm = require('../components/CapacitorElm.js');
let InductorElm = require('../components/InductorElm.js');
let SparkGapElm = require('../components/SparkGapElm.js');
let CurrentElm = require('../components/CurrentElm.js');
let RailElm = require('../components/RailElm.js');
let MosfetElm = require('../components/MosfetElm.js');
let JfetElm = require('../components/JFetElm.js');
let TransistorElm = require('../components/TransistorElm.js');
let VarRailElm = require('../components/VarRailElm.js');
let OpAmpElm = require('../components/OpAmpElm.js');
let ZenerElm = require('../components/ZenerElm.js');
let Switch2Elm = require('../components/Switch2Elm.js');
let SweepElm = require('../components/SweepElm.js');
let TextElm = require('../components/TextElm.js');
let ProbeElm = require('../components/ProbeElm.js');

let AndGateElm = require('../components/AndGateElm.js');
let NandGateElm = require('../components/NandGateElm.js');
let OrGateElm = require('../components/OrGateElm.js');
let NorGateElm = require('../components/NorGateElm.js');
let XorGateElm = require('../components/XorGateElm.js');
let InverterElm = require('../components/InverterElm.js');

let LogicInputElm = require('../components/LogicInputElm.js');
let LogicOutputElm = require('../components/LogicOutputElm.js');
let AnalogSwitchElm = require('../components/AnalogSwitchElm.js');
let AnalogSwitch2Elm = require('../components/AnalogSwitch2Elm.js');
let MemristorElm = require('../components/MemristorElm.js');
let RelayElm = require('../components/RelayElm.js');
let TunnelDiodeElm = require('../components/TunnelDiodeElm.js');

let ScrElm = require('../components/SCRElm.js');
let TriodeElm = require('../components/TriodeElm.js');

let DecadeElm = require('../components/DecadeElm.js');
let LatchElm = require('../components/LatchElm.js');
let TimerElm = require('../components/TimerElm.js');
let JkFlipFlopElm = require('../components/JkFlipFlopElm.js');
let DFlipFlopElm = require('../components/DFlipFlopElm.js');
let CounterElm = require('../components/CounterElm.js');
let DacElm = require('../components/DacElm.js');
let AdcElm = require('../components/AdcElm.js');
let VcoElm = require('../components/VcoElm.js');
let PhaseCompElm = require('../components/PhaseCompElm.js');
let SevenSegElm = require('../components/SevenSegElm.js');
let CC2Elm = require('../components/CC2Elm.js');

let TransLineElm = require('../components/TransLineElm.js');

let TransformerElm = require('../components/TransformerElm.js');
let TappedTransformerElm = require('../components/TappedTransformerElm.js');

let LedElm = require('../components/LedElm.js');
let PotElm = require('../components/PotElm.js');
let ClockElm = require('../components/ClockElm.js');

let Scope = require('../circuit/Scope.js');

let SimulationParams = require('../circuit/SimulationParams.js');

let Circuit = require('../circuit/Circuit.js');
let Hint = require('../engine/Hint.js');

let environment = require("../Environment.js");

class CircuitLoader {
  static createCircuitFromJsonData(jsonData) {

    // Create a defensive copy of jsonData
    jsonData = JSON.parse(JSON.stringify(jsonData));

    let circuit = new Circuit();

    // Extract circuit simulation params
    let circuitParams = jsonData.params;

    circuit.Params = new SimulationParams(circuitParams);
    circuit.flags = parseInt(circuitParams['flags']);

    let circuitComponents = jsonData.components;

    if (!circuitParams || !circuitComponents) {
      console.warn("Circuit data malformed (Either circuit params or components are missing)")
      return
    }

    // Load each component from JSON data:
    for (let elementData of Array.from(circuitComponents)) {
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

    if (environment.isBrowser)
      console.log(circuit, circuitParams);

    if (circuit.getElements().length === 0)
      console.error("No elements loaded. JSON most likely malformed");

    return circuit;
  }
}

module.exports = CircuitLoader;

