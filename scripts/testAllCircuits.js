var chai = require('chai');

require('coffee-script/register');

var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
var sinon = require('sinon');

diff = require('deep-diff').diff;

approx_diff = function(lhs, rhs) {
  epsilon = 2e-2;

  deltas = diff(lhs, rhs) || [];
  true_deltas = [];

  for (var i = 0; i < deltas.length; ++i) {
    var delta = deltas[i];

    if (delta.kind == 'E' && (delta.lhs - delta.rhs) <= epsilon)
      continue;

    true_deltas.push(delta)
  }

  return true_deltas;
};

var Renderer = require("../src/render/renderer.js");
var MatrixStamper = require('../src/engine/MatrixStamper.js');
var CircuitComponent = require('../src/components/CircuitComponent.js');
var CircuitSolver = require('../src/engine/CircuitSolver.js');
var ACRailElm = require('./ACRailElm.js');
var AntennaElm = require('./AntennaElm.js');
var WireElm = require('./WireElm.js');
var ResistorElm = require('./ResistorElm.js');
var GroundElm = require('./GroundElm.js');
var VoltageElm = require('./VoltageElm.js');
var DiodeElm = require('./DiodeElm.js');
var OutputElm = require('./OutputElm.js');
var SwitchElm = require('./SwitchElm.js');
var CapacitorElm = require('./CapacitorElm.js');
var InductorElm = require('./InductorElm.js');
var SparkGapElm = require('./SparkGapElm.js');
var CurrentElm = require('./CurrentElm.js');
var RailElm = require('./RailElm.js');
var MosfetElm = require('./MosfetElm.js');
var JFetElm = require('./JFetElm.js');
var TransistorElm = require('./TransistorElm.js');
var VarRailElm = require('./VarRailElm.js');
var OpAmpElm = require('./OpAmpElm.js');
var ZenerElm = require('./ZenerElm.js');
var Switch2Elm = require('./Switch2Elm.js');
var SweepElm = require('./SweepElm.js');
var TextElm = require('./TextElm.js');
var ProbeElm = require('./ProbeElm.js');
var AndGateElm = require('./AndGateElm.js');
var NandGateElm = require('./NandGateElm.js');
var OrGateElm = require('./OrGateElm.js');
var NorGateElm = require('./NorGateElm.js');
var XorGateElm = require('./XorGateElm.js');
var InverterElm = require('./InverterElm.js');
var LogicInputElm = require('./LogicInputElm.js');
var LogicOutputElm = require('./LogicOutputElm.js');
var AnalogSwitchElm = require('./AnalogSwitchElm.js');
var AnalogSwitch2Elm = require('./AnalogSwitch2Elm.js');
var TransformerElm = require('./TransformerElm.js');
var PotElm = require('./PotElm.js');
var ClockElm = require('./ClockElm.js');
var Scope = require('./Scope.js');

var _ = require('lodash');
var fs = require('fs');
var Canvas = require('canvas');
var Circuit = require('../src/circuit/Circuit.js');

Mocha = require("mocha");

var mocha = new Mocha({});

mocha.addFile("./test/integration/circuitsTest.js");
//mocha.addFile("./test/circuit/simpleResistorTest.js");

var static_failures = [];
var static_successes = [];

var frame_failures = [];
var frame_successes = [];

mocha.run().on('pass', function(test) {
  console.log('Test passed');
  keywords = test.title.split(" ");

  simulation_type = keywords[0];
  title = keywords[1];

  if (simulation_type.toLowerCase() == "static") {
    static_successes.push(title);
  } else {
    frame_successes.push(title);
  }
})

.on('fail', function(test, err) {
  keywords = test.title.split(" ");

  simulation_type = keywords[0];
  title = keywords[1];

  if (simulation_type.toLowerCase() == "static") {
    static_failures.push(title);
  } else {
    frame_failures.push(title);
  }
})

.on('end', function() {
  console.log("ONLY SUCCESSFUL ON STATIC: ");
  console.log(_.difference(static_successes, frame_successes));
  console.log("ONLY SUCCESSFUL ON FRAME: ");
  console.log(_.difference(frame_successes, static_successes));

  console.log("---------------------------------------------------------\n");
  console.log("STATIC FAILURE:");
  console.log("---------------------------------------------------------\n");
  console.log(static_failures);

  console.log("FRAME FAILURE:");
  console.log("---------------------------------------------------------\n");
  console.log(frame_failures);

  failures = _.union(static_failures, frame_failures);
  successes = _.intersection(static_successes, frame_successes);

  component_failures = [];
  component_successes = [];

  for (var i=0; i<failures.length; ++i) {
    failed_circuit = failures[i];

    var circuit_json = JSON.parse(fs.readFileSync("./circuits/" + failed_circuit + ".json"));
    circuit_json.shift();

    uniq_components = _.uniq(circuit_json.map(function(elm) { return elm['sym']; }));

    component_failures = _.concat(uniq_components, component_failures);
  }

  failures_map = _.groupBy(component_failures);

  for (var i=0; i<successes.length; ++i) {
    successful_circuit = successes[i];

    circuit_json = JSON.parse(fs.readFileSync("./circuits/" + successful_circuit + ".json"));
    circuit_json.shift();

    uniq_components = _.uniq(circuit_json.map(function(elm) { return elm['sym']; }));

    component_successes = _.concat(uniq_components, component_successes);
  }

  successes_map = _.groupBy(component_successes);

  failure_percentages = {};
  failure_counts = {};

  for (var i=0; i<component_failures.length; ++i) {
    var fail_sym = component_failures[i];

    all_failures = failures_map[fail_sym];
    all_successes = successes_map[fail_sym] || [];

    failure_percentages[fail_sym] = all_failures.length/(all_failures.length + all_successes.length);
    failure_counts[fail_sym] = all_failures.length
  }

  fs.writeFileSync("./doc/FAILURE_PERCENT_BY_COMPONENT.txt", JSON.stringify(failure_percentages, null, 2));
  fs.writeFileSync("./doc/FAILURE_COUNT_BY_COMPONENT.txt", JSON.stringify(failure_counts, null, 2));

  fs.writeFileSync("./doc/FAILED_CIRCUITS.txt", failures.join("\n"));
  fs.writeFileSync("./doc/SUCCESSFUL_CIRCUITS.txt", successes.join("\n"));
});

