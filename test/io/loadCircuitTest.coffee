CircuitLoader = require "../../src/io/circuitLoader"
Circuit = require "../../src/core/circuit"
CircuitNode = require("../../src/core/nodeGraph/circuitNode").CircuitNode

describe "CircuitLoader", ->
  before () ->
    @circuit = new Circuit()


  describe "should read voltdividesimple.json and have", ->
    before (done) ->
      CircuitLoader.readCircuitFromFile @circuit, "./circuits/voltdividesimple.json", () =>
        @circuit.Solver.analyzeCircuit()
        done()

    it "7 elements", ->
      @circuit.numElements().should.equal 7

    it "valid origMatrix", ->
      @circuit.Solver.origMatrix.should.eql zeroArray2(10, 10)

    it "valid origRightSide", ->
      @circuit.Solver.origMatrix.should.eql zeroArray(10)

    it "valid circuitPermute", ->
      @circuit.Solver.circuitPermute.should.eql zeroArray(10)

    it "correct rowInfo", ->
      @circuit.Solver.circuitRowInfo.length.should.equal 10

    it "valid circuitMatrix", ->
      @circuit.Solver.circuitMatrix.should.eql []

    it "valid right side", ->
      @circuit.Solver.circuitRightSide.should.eql []

    it "should need map", ->
      @circuit.Solver.circuitNeedsMap.should.equal true

    it "correct voltage sources", ->
      voltageSources = "VoltageElm,WireElm,WireElm,WireElm,WireElm"
      @circuit.getVoltageSources().toString().should.equal voltageSources

    it "correct nodes", ->
      @circuit.getNode(0).toString()


    it "0 bad nodes", ->
      @circuit.findBadNodes().length.should.equal 0

    it "6 nodes", ->
      @circuit.numNodes().should.equal 6


    it "should update", ->
      #@circuit.Solver.analyzeCircuit()
      #@circuit.updateCircuit()
