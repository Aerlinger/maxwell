# ElementMap
#
#   A Hash Map of circuit components within Maxwell
#
#   Each hash element is a key-value pair of the format {"ElementName": "ElementDescription"}
#
#   Elements that are tested working are prefixed with a '+'
#   Elements that are implemented but not tested have their names (key) prefixed with a '#'
#   Elements that are not yet implemented have their names (key) prefixed with a '-'

ComponentDefs =

  # Tested, working:
  "WireElm" : "+Wire"
  "ResistorElm" : "+Resistor"
  "CapacitorElm" : "+Capacitor"
  "InductorElm" : "+Inductor"
  "SwitchElm" : "+Switch"
  "GroundElm" : "+Ground"
  "VoltageElm" : "+Voltage Source"

  # Implemented, not tested
  "DiodeElm" : "#Diode"

  # Not yet implemented:
  "ACRailElm" : "-AC Rail"
  "ACVoltageElm" : "-AC Voltage"
  "ADCElm" : "-A/D Converter"
  "AnalogSwitchElm" : "-Analog Switch"
  "AnalogSwitch2Elm" : "-Analog Switch2"
  "AndGateElm" : "-AndGateElm"
  "AntennaElm" : "-Antenna"
  "CC2Elm" : "-CC2"
  "CC2NegElm" : "-CC2 Negative"
  "ClockElm" : "-Clock Generator"
  "CounterElm" : "-Counter"
  "CurrentElm" : "-Current Source"
  "DACElm" : "-D/A Converter"
  "DCVoltageElm" : "-DC Voltage Src"
  "DecadeElm" : "-Decade Counter"
  "DFlipFlopElm" : "-D Flip Flop"
  "DiacElm" : "-Diac"
  "InverterElm" : "-InverterElm"
  "JfetElm" : "-JFET"
  "JKFlipFlopElm" : "-JK Flip Flop"
  "LampElm" : "-LampElm"
  "LatchElm" : "-Latch"
  "LEDElm" : "-LED"
  "LogicInputElm" : "-Logic Input"
  "LogicOutputElm" : "-Logic Output"
  "MemristorElm" : "-Memristor"
  "MosfetElm" : "-MOSFET"
  "NandGageElm" : "-NAND Gate"
  "NJfetElm" : "-N-type JFET"
  "PJfetElm" : "-P-type JFET"
  "NMosfetElm" : "-N-type FET"
  "PMosfetElm" : "-P-type FET"
  "PotElm" : "-Potentiometer"
  "ProbeElm" : "-Probe"
  "PTransistorElm" : "-P Transistor"
  "NTransistorElm" : "-N Transistor"
  "PushSwitchElm" : "-PushSwitch"
  "RailElm" : "-Voltage Rail"
  "RelayElm" : "-Relay"
  "SCRElm" : "-SCR Element"
  "SevenSegElm" : "-7-Segment LCD"
  "SparkGapElm" : "-Spark Gap"
  "SquareRailElm" : "-SquareRail"
  "SweepElm" : "-Freq. Sweep"
  "Switch2Elm" : "-Switch 2"
  "TappedTransformerElm" : "-Tapped Transformer"
  "TextElm" : "-Text"
  "ThermistorElm" : "-Thermistor"
  "TimerElm" : "-Timer"
  "TransformerElm" : "-Transformer"
  "TransistorElm" : "-Transistor"
  "TransmissionElm" : "-Xmission Line"
  "TriacElm" : "-Triac"
  "TriodeElm" : "-Triode"
  "TunnelDiodeElm" : "-TunnelDiode"
  "VarRailElm" : "-Variable Rail"
  "VCOElm" : "-Volt. Cont. Osc."
  "XORGateElm" : "-XOR Gate"
  "ZenerElm" : "-Zener Diode"

module.exports = ComponentDefs