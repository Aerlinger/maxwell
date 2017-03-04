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

global.Circuit = require('../src/circuit/Circuit');

global.Hint = require('../src/engine/Hint');
global.CircuitNode = require('../src/engine/CircuitNode');
global.CircuitNodeLink = require('../src/engine/CircuitNodeLink');
global.SimulationParams = require('../src/circuit/SimulationParams');
global.MatrixStamper = require('../src/engine/MatrixStamper');

global.Components = require('../src/components');
global.CircuitLoader = require("../src/io/CircuitLoader");

// Renderer = require("../src/render/renderer.js");
// CircuitUI = require("../src/CircuitUI.js");
global.CircuitApplication = require("../src/CircuitApplication");

global.CircuitComponent = require('../src/components/CircuitComponent');
global.CircuitSolver = require('../src/engine/CircuitSolver');

global.ACRailElm = require('../src/components/ACRailElm');
global.ADCElm = require('../src/components/ADCElm');
global.AntennaElm = require('../src/components/AntennaElm');
global.CapacitorElm = require('../src/components/CapacitorElm');
global.CC2Elm = require('../src/components/CC2Elm');
global.ChipElm = require('../src/components/ChipElm');
global.ClockElm = require('../src/components/ClockElm');
global.CounterElm = require('../src/components/CounterElm');
global.CurrentElm = require('../src/components/CurrentElm');
global.DecadeElm = require('../src/components/DecadeElm');
global.DFlipFlopElm = require('../src/components/DFlipFlopElm');
global.DiodeElm = require('../src/components/DiodeElm');
global.GroundElm = require('../src/components/GroundElm');
global.JFetElm = require('../src/components/JFetElm');
global.MosfetElm = require('../src/components/MosfetElm');
global.PotElm = require('../src/components/PotElm');
global.InductorElm = require('../src/components/InductorElm');
global.OpAmpElm = require('../src/components/OpAmpElm');
global.OutputElm = require('../src/components/OutputElm');
// global.PhotoResistorElm = require('../src/circuit/components/Ph');
global.ProbeElm = require('../src/components/ProbeElm');
global.PushSwitchElm = require('../src/components/PushSwitchElm');
global.RailElm = require('../src/components/RailElm');
global.ResistorElm = require('../src/components/ResistorElm');
global.SparkGapElm = require('../src/components/SparkGapElm');
global.SwitchElm = require('../src/components/SwitchElm');
global.Switch2Elm = require('../src/components/Switch2Elm');
global.SweepElm = require('../src/components/SweepElm');
global.TextElm = require('../src/components/TextElm');
global.TappedTransformerElm = require('../src/components/TappedTransformerElm');
global.TransformerElm = require('../src/components/TransformerElm');
global.TransistorElm = require('../src/components/TransistorElm');
global.TransLineElm = require('../src/components/TransLineElm');
global.TunnelDiodeElm = require('../src/components/TunnelDiodeElm');
global.WireElm = require('../src/components/WireElm');
global.VarRailElm = require('../src/components/VarRailElm');
global.VoltageElm = require('../src/components/VoltageElm');
global.ZenerElm = require('../src/components/ZenerElm');

global.AndGateElm = require('../src/components/AndGateElm');
global.NandGateElm = require('../src/components/NandGateElm');
global.OrGateElm = require('../src/components/OrGateElm');
global.NorGateElm = require('../src/components/NorGateElm');
global.XorGateElm = require('../src/components/XorGateElm');
global.InverterElm = require('../src/components/InverterElm');

global.LogicInputElm = require('../src/components/LogicInputElm');
global.LogicOutputElm = require('../src/components/LogicOutputElm');
global.AnalogSwitchElm = require('../src/components/AnalogSwitchElm');
global.AnalogSwitch2Elm = require('../src/components/AnalogSwitch2Elm');

global.Util = require('../src/util/Util');

global.Scope = require('../src/circuit/Scope');
global.Point = require('../src/geom/Point');
global.Polygon = require('../src/geom/Polygon');
global.Rectangle = require('../src/geom/Rectangle');

global.Maxwell = require("../src/Maxwell.js");

// require('coffee-script/register');

if (!fs.existsSync("test/fixtures/componentRenders/"))
  fs.mkdirSync("test/fixtures/componentRenders/");

