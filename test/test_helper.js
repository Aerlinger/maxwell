chai = require('chai');

require('dotenv').config();

assert = chai.assert;
expect = chai.expect;
should = chai.should();
sinon = require('sinon');

diff = require('deep-diff').diff;
_ = require('lodash');
fs = require('fs');
Canvas = require('canvas');
resemble = require("node-resemble-js");

approx_diff = function(lhs, rhs) {
  epsilon = 2e-2;

  deltas = diff(lhs, rhs) || [];
  true_deltas = [];

  for (var i=0; i<deltas.length; ++i) {
    var delta = deltas[i];

    if (delta.kind == 'E' && (delta.lhs - delta.rhs) <= epsilon)
      continue;

    true_deltas.push(delta)
  }

  return true_deltas
};

Canvas.prototype.addEventListener = function() {

};

Circuit = require('../src/circuit/circuit.js');

CircuitNode = require('../src/engine/circuitNode');
Hint = require('../src/engine/Hint.js');
CircuitNodeLink = require('../src/engine/circuitNodeLink');
SimulationParams = require('../src/circuit/simulationParams.js');
MatrixStamper = require('../src/engine/matrixStamper.js');

ComponentRegistry = require('../src/circuit/ComponentRegistry.js');
CircuitLoader = require("../src/io/circuitLoader");

// Renderer = require("../src/render/renderer.js");
CircuitUI = require("../src/CircuitUI.js");
CircuitCanvas = require("../src/CircuitCanvas.js");
MatrixStamper = require('../src/engine/matrixStamper.js');

CircuitComponent = require('../src/circuit/circuitComponent.js');
CircuitSolver = require('../src/engine/circuitSolver.coffee');
MatrixStamper = require('../src/engine/matrixStamper.js');

ACRailElm = require('../src/circuit/components/ACRailElm.js');
ADCElm = require('../src/circuit/components/ADCElm.js');
AntennaElm = require('../src/circuit/components/AntennaElm.js');
CapacitorElm = require('../src/circuit/components/CapacitorElm.js');
CC2Elm = require('../src/circuit/components/CC2Elm.js');
ChipElm = require('../src/circuit/components/ChipElm.js');
ClockElm = require('../src/circuit/components/ClockElm.js');
CounterElm = require('../src/circuit/components/CounterElm.js');
CurrentElm = require('../src/circuit/components/CurrentElm.js');
DecadeElm = require('../src/circuit/components/DecadeElm.js');
DFlipFlopElm = require('../src/circuit/components/DFlipFlopElm.js');
DiodeElm = require('../src/circuit/components/DiodeElm.js');
GroundElm = require('../src/circuit/components/GroundElm.js');
JFetElm = require('../src/circuit/components/JFetElm.js');
MosfetElm = require('../src/circuit/components/MosfetElm.js');
PotElm = require('../src/circuit/components/PotElm.js');
InductorElm = require('../src/circuit/components/InductorElm.js');
OpAmpElm = require('../src/circuit/components/OpAmpElm.js');
OutputElm = require('../src/circuit/components/OutputElm.js');
// PhotoResistorElm = require('../src/circuit/components/Ph.js');
ProbeElm = require('../src/circuit/components/ProbeElm.js');
PushSwitchElm = require('../src/circuit/components/PushSwitchElm.js');
RailElm = require('../src/circuit/components/RailElm.js');
ResistorElm = require('../src/circuit/components/ResistorElm.js');
SparkGapElm = require('../src/circuit/components/SparkGapElm.js');
SwitchElm = require('../src/circuit/components/SwitchElm.js');
Switch2Elm = require('../src/circuit/components/Switch2Elm.js');
SweepElm = require('../src/circuit/components/SweepElm.js');
TextElm = require('../src/circuit/components/TextElm.js');
TappedTransformerElm = require('../src/circuit/components/TappedTransformerElm.js');
TransformerElm = require('../src/circuit/components/TransformerElm.js');
TransistorElm = require('../src/circuit/components/TransistorElm.js');
TransLineElm = require('../src/circuit/components/TransLineElm.js');
TunnelDiodeElm = require('../src/circuit/components/TunnelDiodeElm.js');
WireElm = require('../src/circuit/components/WireElm.js');
VarRailElm = require('../src/circuit/components/VarRailElm.js');
VoltageElm = require('../src/circuit/components/VoltageElm.js');
ZenerElm = require('../src/circuit/components/ZenerElm.js');

AndGateElm = require('../src/circuit/components/AndGateElm.js');
NandGateElm = require('../src/circuit/components/NandGateElm.js');
OrGateElm = require('../src/circuit/components/OrGateElm.js');
NorGateElm = require('../src/circuit/components/NorGateElm.js');
XorGateElm = require('../src/circuit/components/XorGateElm.js');
InverterElm = require('../src/circuit/components/InverterElm.js');

LogicInputElm = require('../src/circuit/components/LogicInputElm.js');
LogicOutputElm = require('../src/circuit/components/LogicOutputElm.js');
AnalogSwitchElm = require('../src/circuit/components/AnalogSwitchElm.js');
AnalogSwitch2Elm = require('../src/circuit/components/AnalogSwitch2Elm.js');

Util = require('../src/util/util');

Scope = require('../src/circuit/Scope.js');
Point = require('../src/geom/point.js');
Polygon = require('../src/geom/polygon.js');
Rectangle = require('../src/geom/rectangle.js');

require('coffee-script/register');

if (!fs.existsSync("test/fixtures/componentRenders/"))
  fs.mkdirSync("test/fixtures/componentRenders/");
