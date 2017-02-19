let Maxwell = require("../src/Maxwell.js");

let VoltageElm = require('../src/components/VoltageElm');
let RailElm = require('../src/components/RailElm');
let VarRailElm = require('../src/components/VarRailElm');
let ClockElm = require('../src/components/ClockElm');

/**
 * A simple script to generate and test various voltage sources
 */
function genVoltageSources() {
  let waveforms = [0, 1, 2, 3, 4, 5, 6];
  let voltageElms = [VoltageElm, RailElm, VarRailElm, ClockElm];

  let circuit = Maxwell.createCircuit("VoltageSources");

  let x = 50;
  let y = 50;

  for (let voltageElm of voltageElms) {
    for (let waveform of waveforms) {
      let a = new voltageElm(x, y, x+75, y, {waveform: waveform}, 0);
      let b = new voltageElm(x, y + 50, x, y + 100, {waveform}, 0);

      circuit.solder(a);
      circuit.solder(b);

      y = (y + 100) % 600;
    }

    x = (x + 100) % 500;
  }

  console.log(circuit.serialize());
}

genVoltageSources();
