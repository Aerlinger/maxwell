CircuitComponent = require('./circuitComponent.coffee')

AntennaElm = require('./components/AntennaElm.coffee')
WireElm = require('./components/WireElm.coffee')
ResistorElm = require('./components/ResistorElm.coffee')
GroundElm = require('./components/GroundElm.coffee')
VoltageElm = require('./components/VoltageElm.coffee')
DiodeElm = require('./components/DiodeElm.coffee')
OutputElm = require('./components/OutputElm.coffee')
SwitchElm = require('./components/SwitchElm.coffee')
CapacitorElm = require('./components/CapacitorElm.coffee')
InductorElm = require('./components/InductorElm.coffee')
SparkGapElm = require('./components/SparkGapElm.coffee')
CurrentElm = require('./components/CurrentElm.coffee')
RailElm = require('./components/RailElm.coffee')
MosfetElm = require('./components/MosfetElm.coffee')
JFetElm = require('./components/JFetElm.coffee')
TransistorElm = require('./components/TransistorElm.coffee')
VarRailElm = require('./components/VarRailElm.coffee')
OpAmpElm = require('./components/OpAmpElm.coffee')
ZenerElm = require('./components/ZenerElm.coffee')
Switch2Elm = require('./components/Switch2Elm.coffee')
SweepElm = require('./components/SweepElm.coffee')
TextElm = require('./components/TextElm.coffee')
ProbeElm = require('./components/ProbeElm.coffee')

AndGateElm = require('./components/AndGateElm.coffee')
NandGateElm = require('./components/NandGateElm.coffee')
OrGateElm = require('./components/OrGateElm.coffee')
NorGateElm = require('./components/NorGateElm.coffee')
XorGateElm = require('./components/XorGateElm.coffee')
InverterElm = require('./components/InverterElm.coffee')

LogicInputElm = require('./components/LogicInputElm.coffee')
LogicOutputElm = require('./components/LogicOutputElm.coffee')
AnalogSwitchElm = require('./components/AnalogSwitchElm.coffee')
AnalogSwitch2Elm = require('./components/AnalogSwitch2Elm.coffee')

TransformerElm = require('./components/TransformerElm.coffee')

PotElm = require('./components/PotElm.coffee')
ClockElm = require('./components/ClockElm.coffee')

Scope = require('./components/Scope.coffee')

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
