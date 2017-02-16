circuit_names = glob.sync(__dirname + "/../circuits/v3/*.json");

for (let circuit_name of circuit_names) {
  basename = path.basename(circuit_name, '.json');
  console.log("WRITING", basename);

  jsonPath = "circuits/v3/";

  if (basename != "__index__") {
    try {
      jsonData = JSON.parse(fs.readFileSync(circuit_name));

      circuit = CircuitLoader.createCircuitFromJsonData(jsonData);

      fs.writeFileSync(jsonPath + basename + ".json", JSON.stringify(circuit.serialize()))
    } catch (e) {
      console.log("ERR:", e.message)
      console.log(e.stack)
    }
  }
}
