CircuitComponent = require('./circuitComponent')

AntennaElm = require('./components/AntennaElm')
WireElm = require('./components/WireElm')
ResistorElm = require('./components/ResistorElm')
GroundElm = require('./components/GroundElm')
VoltageElm = require('./components/VoltageElm')
DiodeElm = require('./components/DiodeElm')
OutputElm = require('./components/OutputElm')
SwitchElm = require('./components/SwitchElm')
CapacitorElm = require('./components/CapacitorElm')
InductorElm = require('./components/InductorElm')
SparkGapElm = require('./components/SparkGapElm')
CurrentElm = require('./components/CurrentElm')
RailElm = require('./components/RailElm')
MosfetElm = require('./components/MosfetElm')
JFetElm = require('./components/JFetElm')
TransistorElm = require('./components/TransistorElm')
VarRailElm = require('./components/VarRailElm')
OpAmpElm = require('./components/OpAmpElm')
ZenerElm = require('./components/ZenerElm')
Switch2Elm = require('./components/Switch2Elm')
SweepElm = require('./components/SweepElm')
TextElm = require('./components/TextElm')
ProbeElm = require('./components/ProbeElm')

AndGateElm = require('./components/AndGateElm')
NandGateElm = require('./components/NandGateElm')
OrGateElm = require('./components/OrGateElm')
NorGateElm = require('./components/NorGateElm')
XorGateElm = require('./components/XorGateElm')
InverterElm = require('./components/InverterElm')

LogicInputElm = require('./components/LogicInputElm')
LogicOutputElm = require('./components/LogicOutputElm')

AnalogSwitchElm = require('./components/AnalogSwitchElm')
AnalogSwitch2Elm = require('./components/AnalogSwitch2Elm')

TransformerElm = require('./components/TransormerElm')

PotElm = require('./components/PotElm')
ClockElm = require('./components/ClockElm')

Scope = require('./components/Scope')

##
# ElementMap
#
#   A Hash Map of circuit components within Maxwell
#
#   Each hash element is a key-value pair of the format {"ElementName": "ElementDescription"}
#
#   Elements that are tested working are prefixed with a '+'
#   Elements that are implemented but not tested have their names (key) prefixed with a '#'
#   Elements that are not yet implemented have their names (key) prefixed with a '-'
class ComponentRegistry
  @ComponentDefs:
  # Working
    'w': WireElm
    'r': ResistorElm
    'g': GroundElm
    'l': InductorElm
    'c': CapacitorElm
    'v': VoltageElm
    'd': DiodeElm
    's': SwitchElm
    '187': SparkGapElm
    'a': OpAmpElm
    'f': MosfetElm

  # Testing
    'A': AntennaElm
    'R': RailElm
    '170': SweepElm
    '172': VarRailElm
    'z': ZenerElm
    'i': CurrentElm
    't': TransistorElm
    '174': PotElm

    '150': AndGateElm
    '151': NandGateElm
    '152': OrGateElm
    '153': NorGateElm
    '154': XorGateElm

    'I': InverterElm
    'L': LogicInputElm
    'M': LogicOutputElm

    '159': AnalogSwitchElm
    '160': AnalogSwitch2Elm

  # In progress:
    'S': Switch2Elm  # Needs interaction
    'x': TextElm
    'p': ProbeElm
    'O': OutputElm
    'T': TransformerElm

    'o': Scope
#    'h': Scope
    '$': Scope
    '%': Scope
    '?': Scope
    'B': Scope

#    'L': LogicInput
#    'M': LogicOutput
#   'I': Inverter
#  151: NandGate
#  151: AndGate
#  171: TransmissionLine
#  178: RelayElm

  @InverseComponentDefs: {
    WireElm: 'w'
    ResistorElm: 'r'
    GroundElm: 'g'
    InductorElm: 'l'
    CapacitorElm: 'c'
    VoltageElm: 'v'
    DiodeElm: 'd'
    SwitchElm: 's'
    SparkGapElm: '187'
    OpAmpElm: 'a'
    MosfetElm: 'f'
    PotElm: '174'

    RailElm: 'R'
    VarRailElm: '17'
    ZenerElm: 'z'
    CurrentElm: 'i'
    TransistorElm: 't'

    Switch2Elm: 'S'
    SweepElm: '170'
    TextElm: 'x'
    ProbeElm: 'p'
    Scope: 'o'
    OutputElm: 'O'
    AntennaElm: 'A'

    AndGateElm: '150'
    NandGateElm: '151'
    OrGateElm: '152'
    NorGateElm: '153'
    XorGateElm: '154'

    InverterElm: 'I'
    LogicInputElm: 'L'
    LogicOutputElm: 'M'

    TransformerElm: 'T'

    AnalogSwitchElm: '159'
    AnalogSwitch2Elm: '160'
  }

module.exports = ComponentRegistry
