let glob = require('glob');
let path = require("path");
let fs = require("fs");

let CircuitLoader = require("../src/io/CircuitLoader");

let input_circuits = glob.sync(__dirname + "/../circuits/v4/*.json");

for (circuit_name of input_circuits) {
  let basename = path.basename(circuit_name, '.json');

  let outputPath = __dirname + "/../circuits/v5/";

  console.log("PROCESSING", circuit_name);

  // let circuitJson = fs.readFileSync(__dirname + "/../circuits/v4/" + basename + ".json");
  let circuitJson = JSON.parse(fs.readFileSync(circuit_name));

  let params = circuitJson[0];

  if (!params) {
    console.warn(`Couldn't parse ${basename} because the format was invalid`);
    continue;
  }

  let components = circuitJson.slice(1, circuitJson.length);

  let newSchema = {
    params,
    components
  };

  fs.writeFileSync(outputPath + basename + ".json", JSON.stringify(newSchema));

  // console.log(circuitJson.toString());

  // let jsonData = JSON.parse(circuitJson);
  //
  // let circuit = CircuitLoader.createCircuitFromJsonData(jsonData);
  //
  // let inputData = circuitData.toString().split("\n");
  //
  // for (line of inputData) {
  //
  //   if (line[0] == "o") {
  //     let scope = new Scope(null, Scope.tokenize(line));
  //     circuit.addScope(scope);
  //   }
  //
  //   if (line[0] == "h") {
  //     hintTokens = line.split(" ");
  //     hintTokens.shift();
  //
  //     circuit.setHint(hintTokens[0], hintTokens[1], hintTokens[2]);
  //   }
  //
  //   let reconstructedCircuitJson = circuit.serialize();
  //
  //   fs.writeFileSync(outputPath + basename + ".json", JSON.stringify(reconstructedCircuitJson));
  // }
}
