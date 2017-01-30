let CircuitComponent = require('./../components/CircuitComponent.js');

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
let JKFlipFlopElm = require('../components/JkFlipFlopElm.js');
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

let Scope = require('./Scope.js');

let environment = require("../Environment.js");

let ComponentDefs = {
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
}

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

      let sym = ComponentDefs[type];
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
