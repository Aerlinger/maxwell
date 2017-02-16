let glob = require('glob');
let path = require("path");
let fs = require("fs");

let CircuitLoader = require("../src/io/CircuitLoader");
let Scope = require("../src/circuit/Scope");


let circuit_names = glob.sync(__dirname + "/../circuits/*.txt");

for (circuit_name of circuit_names) {
  let basename = path.basename(circuit_name, '.txt');
  let outputPath = __dirname + "/../circuits/v4/";

  console.log("PROCESSING", basename);

  let circuitData = fs.readFileSync(circuit_name);
  let circuitJson = fs.readFileSync(__dirname + "/../circuits/v3/" + basename + ".json");

  let jsonData = JSON.parse(circuitJson);

  let circuit = CircuitLoader.createCircuitFromJsonData(jsonData);

  let inputData = circuitData.toString().split("\n");

  for (line of inputData) {

    if (line[0] == "o") {
      let scope = new Scope(null, Scope.tokenize(line));
      circuit.addScope(scope);
    }

    if (line[0] == "h") {
      hintTokens = line.split(" ");
      hintTokens.shift();

      circuit.setHint(hintTokens[0], hintTokens[1], hintTokens[2]);
    }

    let reconstructedCircuitJson = circuit.serialize();

    fs.writeFileSync(outputPath + basename + ".json", JSON.stringify(reconstructedCircuitJson));
  }
}
