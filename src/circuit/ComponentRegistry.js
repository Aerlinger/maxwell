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
