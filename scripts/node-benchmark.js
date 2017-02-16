require("coffee-script");
require('coffee-script/register');

let path = require("path");

let Circuit = require("../src/circuit/Circuit");
let CircuitLoader = require("../src/io/CircuitLoader");

let now = require("performance-now");


let circuits = [
  "opint-current",
  "deltasigma",
  "grid2",
  "counter8",
  "flashadc",
  "leadingedge",
  "traffic"
];

let nFrames = 500;

let _now = function () {
  return +new Date()
};

require('child_process').exec('git rev-parse HEAD', function (err, stdout) {
  let datetime = (new Date()).toISOString();
  let commit = stdout.slice(0, 6);

  let benchmarkInfo = {
    commit,
    datetime,
    nFrames
  };

  for (circuitName of circuits) {
    let circuitPath = __dirname + "/../circuits/v5/" + circuitName + ".json";

    console.log("Loading:", circuitPath);

    jsonData = JSON.parse(fs.readFileSync(circuitPath));

    circuit = CircuitLoader.createCircuitFromJsonData(jsonData);

    let maxTime = Number.MIN_SAFE_INTEGER;

    let frameTimes = [];

    let start = _now();
    for (let i = 0; i < nFrames; ++i) {
      let frameStart = _now();

      // Simulate a single frame
      circuit.updateCircuit();

      let frameTime = _now() - frameStart;

      maxTime = Math.max(maxTime, frameTime);

      frameTimes.push(frameTime)
    }
    let end = _now();

    let totalDurationMs = end - start;

    // console.log(frameTimes);

    benchmarkInfo[circuitName] = {
      maxTime,
      totalDurationMs,
      avgDurationMs: totalDurationMs / nFrames
    };
  }

  let benchmarkJson = JSON.stringify(benchmarkInfo, null, 2);

  console.log(benchmarkJson);

  let filename = __dirname + "/../benchmark_reports/" + `${datetime}_${stdout.slice(0, 6)}.json`;

  fs.writeFileSync(filename, benchmarkJson);
});


