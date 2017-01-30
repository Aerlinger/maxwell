Maxwell = require("../../src/Maxwell.js");
Library = Maxwell.ComponentLibrary;

describe "VoltageSources", ->
  it "renders", ->
    waveforms = [0, 1, 2, 3, 4, 5, 6];
    voltageElms = [Library.VoltageElm, Library.RailElm, Library.VarRailElm, Library.ClockElm]

    circuit = new Circuit("VoltageSources");

    x = 50;
    y = 50;

    for voltageElm in voltageElms
      for waveform in waveforms
        a = new voltageElm(x, y, x+100, y, {waveform}, 0)
        b = new voltageElm(x + 50, y + 50, x + 50, y + 100, {waveform}, 0)

        circuit.solder(a);
        circuit.solder(b);

        y = (y + 200) % 1600;

      x = (x + 150) % 1000;

    console.log(JSON.stringify(circuit.serialize()))

