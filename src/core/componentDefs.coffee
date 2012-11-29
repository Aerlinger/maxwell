# ElementMap
#
#   A Hash Map of circuit components within Maxwell
#
#   Each hash element is a key-value pair of the format {"ElementName": "ElementDescription"}
#
#   Elements that are tested working are prefixed with a '+'
#   Elements that are implemented but not tested have their names (key) prefixed with a '#'
#   Elements that are not yet implemented have their names (key) prefixed with a '-'

Scope = require('../scope/scope')

DumpTypes =
  "o" : Scope::
  "h" : Scope::
  "$" : Scope::
  "%" : Scope::
  "?" : Scope::
  "B" : Scope::

ComponentDefs = [

  # Tested, working:
  WireElm,
  ResistorElm,
  CapacitorElm,
  InductorElm,
  SwitchElm,
  GroundElm,
  VoltageElm,

  # Implemented, not tested
  DiodeElm,

  # Not yet implemented:
  ACRailElm,
  ACVoltageElm,
  ADCElm,
  AnalogSwitchElm,
  AnalogSwitch2Elm,
  AndGateElm,
  AntennaElm,
  CC2Elm,
  CC2NegElm,
  ClockElm,
  CounterElm,
  CurrentElm,
  DACElm,
  DCVoltageElm,
  DecadeElm,
  DFlipFlopElm,
  DiacElm,
  InverterElm,
  JfetElm,
  JKFlipFlopElm,
  LampElm,
  LatchElm,
  LEDElm,
  LogicInputElm,
  LogicOutputElm,
  MemristorElm,
  MosfetElm,
  NandGageElm,
  NJfetElm,
  PJfetElm,
  NMosfetElm,
  PMosfetElm,
  PotElm,
  ProbeElm,
  PTransistorElm,
  NTransistorElm,
  PushSwitchElm,
  RailElm,
  RelayElm,
  SCRElm,
  SevenSegElm,
  SparkGapElm,
  SquareRailElm,
  SweepElm,
  Switch2Elm,
  TappedTransformerElm,
  TextElm,
  ThermistorElm,
  TimerElm,
  TransformerElm,
  TransistorElm,
  TransmissionElm,
  TriacElm,
  TriodeElm,
  TunnelDiodeElm,
  VarRailElm,
  VCOElm,
  XORGateElm,
  ZenerElm
]

module.exports = ComponentDefs