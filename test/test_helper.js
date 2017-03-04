global.chai = require('chai');

global.assert = chai.assert;
global.expect = chai.expect;
should = chai.should();
global.sinon = require('sinon');

global._ = require('lodash');
global.fs = require('fs');
global.path = require("path");

global.Canvas = require('canvas');
global.gm = require("gm");
global.resemble = require("node-resemble-js");
global.jsondiffpatch = require('jsondiffpatch').create({});
global.diff = require('deep-diff').diff;

global.approx_diff = function(lhs, rhs) {
  let epsilon = 2e-2;

  let deltas = diff(lhs, rhs) || [];
  let true_deltas = [];

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

global.Circuit = require('../src/circuit/Circuit.js');

global.Hint = require('../src/engine/Hint.js');
global.CircuitNode = require('../src/engine/CircuitNode');
global.CircuitNodeLink = require('../src/engine/CircuitNodeLink');
global.SimulationParams = require('../src/circuit/SimulationParams.js');
global.MatrixStamper = require('../src/engine/MatrixStamper.js');

global.Components = require('../src/components');
global.CircuitLoader = require("../src/io/CircuitLoader");

// Renderer = require("../src/render/renderer.js");
// CircuitUI = require("../src/CircuitUI.js");
global.CircuitApplication = require("../src/CircuitApplication");

global.CircuitComponent = require('../src/components/CircuitComponent.js');
global.CircuitSolver = require('../src/engine/CircuitSolver.js');

global.ACRailElm = require('../src/components/ACRailElm.js');
global.ADCElm = require('../src/components/ADCElm.js');
global.AntennaElm = require('../src/components/AntennaElm.js');
global.CapacitorElm = require('../src/components/CapacitorElm.js');
global.CC2Elm = require('../src/components/CC2Elm.js');
global.ChipElm = require('../src/components/ChipElm.js');
global.ClockElm = require('../src/components/ClockElm.js');
global.CounterElm = require('../src/components/CounterElm.js');
global.CurrentElm = require('../src/components/CurrentElm.js');
global.DecadeElm = require('../src/components/DecadeElm.js');
global.DFlipFlopElm = require('../src/components/DFlipFlopElm.js');
global.DiodeElm = require('../src/components/DiodeElm.js');
global.GroundElm = require('../src/components/GroundElm.js');
global.JFetElm = require('../src/components/JFetElm.js');
global.MosfetElm = require('../src/components/MosfetElm.js');
global.PotElm = require('../src/components/PotElm.js');
global.InductorElm = require('../src/components/InductorElm.js');
global.OpAmpElm = require('../src/components/OpAmpElm.js');
global.OutputElm = require('../src/components/OutputElm.js');
// global.PhotoResistorElm = require('../src/circuit/components/Ph.js');
global.ProbeElm = require('../src/components/ProbeElm.js');
global.PushSwitchElm = require('../src/components/PushSwitchElm.js');
global.RailElm = require('../src/components/RailElm.js');
global.ResistorElm = require('../src/components/ResistorElm.js');
global.SparkGapElm = require('../src/components/SparkGapElm.js');
global.SwitchElm = require('../src/components/SwitchElm.js');
global.Switch2Elm = require('../src/components/Switch2Elm.js');
global.SweepElm = require('../src/components/SweepElm.js');
global.TextElm = require('../src/components/TextElm.js');
global.TappedTransformerElm = require('../src/components/TappedTransformerElm.js');
global.TransformerElm = require('../src/components/TransformerElm.js');
global.TransistorElm = require('../src/components/TransistorElm.js');
global.TransLineElm = require('../src/components/TransLineElm.js');
global.TunnelDiodeElm = require('../src/components/TunnelDiodeElm.js');
global.WireElm = require('../src/components/WireElm.js');
global.VarRailElm = require('../src/components/VarRailElm.js');
global.VoltageElm = require('../src/components/VoltageElm.js');
global.ZenerElm = require('../src/components/ZenerElm.js');

global.AndGateElm = require('../src/components/AndGateElm.js');
global.NandGateElm = require('../src/components/NandGateElm.js');
global.OrGateElm = require('../src/components/OrGateElm.js');
global.NorGateElm = require('../src/components/NorGateElm.js');
global.XorGateElm = require('../src/components/XorGateElm.js');
global.InverterElm = require('../src/components/InverterElm.js');

global.LogicInputElm = require('../src/components/LogicInputElm.js');
global.LogicOutputElm = require('../src/components/LogicOutputElm.js');
global.AnalogSwitchElm = require('../src/components/AnalogSwitchElm.js');
global.AnalogSwitch2Elm = require('../src/components/AnalogSwitch2Elm.js');

global.Util = require('../src/util/Util');

global.Scope = require('../src/circuit/Scope.js');
global.Point = require('../src/geom/Point.js');
global.Polygon = require('../src/geom/Polygon.js');
global.Rectangle = require('../src/geom/Rectangle.js');

global.Maxwell = require("../src/Maxwell.js");

// require('coffee-script/register');

if (!fs.existsSync("test/fixtures/componentRenders/"))
  fs.mkdirSync("test/fixtures/componentRenders/");

