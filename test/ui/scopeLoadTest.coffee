describe.skip "Loading Scope from Legacy", ->
  this.timeout(1000000)

  it "processes scope inputs", ->
    circuit_names = glob.sync(__dirname + "/../../circuits/*.txt")

    for circuit_name in circuit_names
      basename = path.basename(circuit_name, '.txt')

      circuitData = fs.readFileSync(circuit_name)
      circuitJson = fs.readFileSync(__dirname + "/../../circuits/v5/" + basename + ".json")

      jsonData = JSON.parse(circuitJson);

      @circuit = CircuitLoader.createCircuitFromJsonData(jsonData)

      inputData = circuitData.toString().split("\n")
      for line in inputData

        if line[0] == "o"
          scope = new Scope(null, Scope.tokenize(line))

          @circuit.addScope(scope)

        if line[0] == "h"
          hintTokens = line.split(" ")
          hintTokens.shift()

          @circuit.setHint(hintTokens[0], hintTokens[1], hintTokens[2])

        reconstructedCircuitJson = @circuit.serialize()

        @newCircuit = CircuitLoader.createCircuitFromJsonData(reconstructedCircuitJson)

        expect(@newCircuit.serialize()).to.eql(reconstructedCircuitJson)


