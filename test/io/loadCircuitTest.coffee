CircuitLoader = require "../../src/io/circuitLoader"
Circuit = require "../../src/core/circuit"

describe "CircuitLoader", ->
  before () ->
    @circuit = new Circuit()


  describe "should read ohms.json", ->
    before () ->
      CircuitLoader.readCircuitFromFile @circuit, "./circuits/ohms.json", () =>

    it "should have 9 elements", ->
      @circuit.numElements().should.equal 9

    it "should have valid matrices", ->
      console.log @circuit.Solver.circuitMatrix
      console.log @circuit.Solver.circuitRightSide

    it "should have 0 bad nodes", ->
      console.log @circuit.numNodes()

    it "should have 8 nodes", ->
      @circuit.Solver.analyzeCircuit()
      @circuit.findBadNodes().length.should.equal 8

    it "should update", ->
      @circuit.Solver.analyzeCircuit()
#      @circuit.updateCircuit()
