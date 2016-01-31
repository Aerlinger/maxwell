CircuitComponent = require('./circuitComponent.coffee')

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
TransistorElm = require('./components/TransistorElm.coffee')
VarRailElm = require('./components/VarRailElm.coffee')
OpAmpElm = require('./components/OpAmpElm.coffee')
ZenerElm = require('./components/ZenerElm.coffee')
Switch2Elm = require('./components/Switch2Elm.coffee')
TextElm = require('./components/TextElm.coffee')
ProbeElm = require('./components/ProbeElm.coffee')

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
    'R': RailElm
    '172': VarRailElm
    'z': ZenerElm
    'i': CurrentElm
    't': TransistorElm

  # In progress:
    'S': Switch2Elm  # Needs interaction
    'x': TextElm
    'p': ProbeElm
    'O': OutputElm
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

    RailElm: 'R'
    VarRailElm: '17'
    ZenerElm: 'z'
    CurrentElm: 'i'
    TransistorElm: 't'

    Switch2Elm: 'S'
    TextElm: 'x'
    ProbeElm: 'o'
    OutputElm: 'O'
  }

module.exports = ComponentRegistry
