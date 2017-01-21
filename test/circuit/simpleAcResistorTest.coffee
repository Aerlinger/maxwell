describe "Simple 5Vp-p AC Voltage source connected to a 500ohm resistor", ->
  before (done) ->
    ac_ohm = JSON.parse(fs.readFileSync("./circuits/v4/ac-resistor.json"))


    @circuit = CircuitLoader.createCircuitFromJsonData(ac_ohm)

    #    CircuitLoader.createCircuitFromJsonFile "../../circuits/voltdividesimple.json", (circuit) =>
    #      @circuit = circuit
    done()

  describe "Single frame", ->
    before (done) ->
      @circuit.updateCircuit()

      done()

    it.only "generates circuit matrices", ->
      console.log(@circuit.Solver.circuitMatrix)
      console.log(@circuit.Solver.circuitRightSide)

    it.only "generates circuit matrices", ->
      @circuit.updateCircuit()
      console.log(@circuit.Solver.circuitMatrix)
      console.log(@circuit.Solver.circuitRightSide)

    it.only "generates circuit matrices", ->
      @circuit.updateCircuit()
      @circuit.updateCircuit()
      console.log(@circuit.Solver.circuitMatrix)
      console.log(@circuit.Solver.circuitRightSide)


      for i in [0...@circuit.numNodes()]
        console.log(@circuit.Solver.getValueFromNode(i))
