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

Circuit = require('../src/circuit/Circuit.js');

CircuitNode = require('../src/engine/CircuitNode');
Hint = require('../src/engine/Hint.js');
CircuitNodeLink = require('../src/engine/CircuitNodeLink');
SimulationParams = require('../src/circuit/SimulationParams.js');
MatrixStamper = require('../src/engine/MatrixStamper.js');

Components = require('../src/components');
CircuitLoader = require("../src/io/CircuitLoader");

// Renderer = require("../src/render/renderer.js");
CircuitUI = require("../src/CircuitUI.js");
CircuitCanvas = require("../src/CircuitCanvas.js");
MatrixStamper = require('../src/engine/MatrixStamper.js');

CircuitComponent = require('../src/components/CircuitComponent.js');
CircuitSolver = require('../src/engine/CircuitSolver.js');
MatrixStamper = require('../src/engine/MatrixStamper.js');

ACRailElm = require('../src/components/ACRailElm.js');
ADCElm = require('../src/components/ADCElm.js');
AntennaElm = require('../src/components/AntennaElm.js');
CapacitorElm = require('../src/components/CapacitorElm.js');
CC2Elm = require('../src/components/CC2Elm.js');
ChipElm = require('../src/components/ChipElm.js');
ClockElm = require('../src/components/ClockElm.js');
CounterElm = require('../src/components/CounterElm.js');
CurrentElm = require('../src/components/CurrentElm.js');
DecadeElm = require('../src/components/DecadeElm.js');
DFlipFlopElm = require('../src/components/DFlipFlopElm.js');
DiodeElm = require('../src/components/DiodeElm.js');
GroundElm = require('../src/components/GroundElm.js');
JFetElm = require('../src/components/JFetElm.js');
MosfetElm = require('../src/components/MosfetElm.js');
PotElm = require('../src/components/PotElm.js');
InductorElm = require('../src/components/InductorElm.js');
OpAmpElm = require('../src/components/OpAmpElm.js');
OutputElm = require('../src/components/OutputElm.js');
// PhotoResistorElm = require('../src/circuit/components/Ph.js');
ProbeElm = require('../src/components/ProbeElm.js');
PushSwitchElm = require('../src/components/PushSwitchElm.js');
RailElm = require('../src/components/RailElm.js');
ResistorElm = require('../src/components/ResistorElm.js');
SparkGapElm = require('../src/components/SparkGapElm.js');
SwitchElm = require('../src/components/SwitchElm.js');
Switch2Elm = require('../src/components/Switch2Elm.js');
SweepElm = require('../src/components/SweepElm.js');
TextElm = require('../src/components/TextElm.js');
TappedTransformerElm = require('../src/components/TappedTransformerElm.js');
TransformerElm = require('../src/components/TransformerElm.js');
TransistorElm = require('../src/components/TransistorElm.js');
TransLineElm = require('../src/components/TransLineElm.js');
TunnelDiodeElm = require('../src/components/TunnelDiodeElm.js');
WireElm = require('../src/components/WireElm.js');
VarRailElm = require('../src/components/VarRailElm.js');
VoltageElm = require('../src/components/VoltageElm.js');
ZenerElm = require('../src/components/ZenerElm.js');

AndGateElm = require('../src/components/AndGateElm.js');
NandGateElm = require('../src/components/NandGateElm.js');
OrGateElm = require('../src/components/OrGateElm.js');
NorGateElm = require('../src/components/NorGateElm.js');
XorGateElm = require('../src/components/XorGateElm.js');
InverterElm = require('../src/components/InverterElm.js');

LogicInputElm = require('../src/components/LogicInputElm.js');
LogicOutputElm = require('../src/components/LogicOutputElm.js');
AnalogSwitchElm = require('../src/components/AnalogSwitchElm.js');
AnalogSwitch2Elm = require('../src/components/AnalogSwitch2Elm.js');

Util = require('../src/util/Util');

Scope = require('../src/circuit/Scope.js');
Point = require('../src/geom/Point.js');
Polygon = require('../src/geom/Polygon.js');
Rectangle = require('../src/geom/Rectangle.js');

require('coffee-script/register');

if (!fs.existsSync("test/fixtures/componentRenders/"))
  fs.mkdirSync("test/fixtures/componentRenders/");
