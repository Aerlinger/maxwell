CircuitLoader = require "../../src/io/circuitLoader"
Circuit = require "../../src/core/circuit"
CircuitNode = require("../../src/core/nodeGraph/circuitNode").CircuitNode

describe "Circuit", ->
  before (done) ->
    @circuit = new Circuit()
    CircuitLoader.readCircuitFromFile @circuit, "./circuits/voltdividesimple.json"
    done()

  describe "should Analyze voltdividesimple.json and have", ->
    before (done) ->
      @circuit.Solver.analyzeCircuit()
      done()

    it "7 elements", ->
      @circuit.numElements().should.equal 7

    it "valid origMatrix", ->
      @circuit.Solver.origMatrix.should.eql zeroArray2(10, 10)

    it "valid origRightSide", ->
      @circuit.Solver.origRightSide.should.eql zeroArray(10)

    it "valid circuitPermute", ->
      @circuit.Solver.circuitPermute.should.eql zeroArray(10)

    it "valid circuitMatrix", ->
      @circuit.Solver.circuitMatrix.should.eql []

    it "valid right side", ->
      @circuit.Solver.circuitRightSide.should.eql []

    it "should need map", ->
      @circuit.Solver.circuitNeedsMap.should.equal true

    it "correct voltage sources", ->
      voltageSources = "VoltageElm,WireElm,WireElm,WireElm,WireElm"
      @circuit.getVoltageSources().toString().should.equal voltageSources

    it "current rowInfos", ->
      rowInfo = @circuit.Solver.circuitRowInfo
      rowInfo[0].toString().should.equal "RowInfo: 1 0 -1 -1 10 false false true"
      rowInfo[1].toString().should.equal "RowInfo: 1 0 -1 -1 10 false false true"
      rowInfo[2].toString().should.equal "RowInfo: 1 0 -1 -1 0 false false true"
      rowInfo[3].toString().should.equal "RowInfo: 1 0 -1 -1 10 false false true"
      rowInfo[4].toString().should.equal "RowInfo: 1 0 -1 -1 0 false false true"
      rowInfo[5].toString().should.equal "RowInfo: 1 6 -1 -1 0.0015 false false true"
      rowInfo[6].toString().should.equal "RowInfo: 1 0 -1 -1 0.0015 false false true"
      rowInfo[7].toString().should.equal "RowInfo: 1 0 -1 -1 -0.0015 false false true"
      rowInfo[8].toString().should.equal "RowInfo: 1 0 -1 -1 0.0005 false false true"
      rowInfo[9].toString().should.equal "RowInfo: 1 0 -1 -1 -0.0005 false false true"

    it "10 elements in circuitRowInfo", ->
      @circuit.Solver.circuitRowInfo.length.should.equal 10

    it "correct nodes", ->
      @circuit.getNode(0).toString().should.equal "CircuitNode: 112 368 false [0 VoltageElm,0 WireElm]"
      @circuit.getNode(1).toString().should.equal "CircuitNode: 112 48 false [1 VoltageElm,0 WireElm]"
      @circuit.getNode(2).toString().should.equal "CircuitNode: 240 48 false [1 WireElm,0 ResistorElm,0 WireElm]"
      @circuit.getNode(3).toString().should.equal "CircuitNode: 240 368 false [1 ResistorElm,1 WireElm,0 WireElm]"
      @circuit.getNode(4).toString().should.equal "CircuitNode: 432 48 false [1 WireElm,0 ResistorElm]"
      @circuit.getNode(5).toString().should.equal "CircuitNode: 432 368 false [1 WireElm,1 ResistorElm]"

    it "6 nodes", ->
      @circuit.numNodes().should.equal 6

    it "should be linear", ->
      @circuit.Solver.circuitNonLinear.should.equal false


    describe "should runCircuit()", ->
      before () ->
        @circuit.Solver.runCircuit()
        @voltageCompnt = @circuit.getElmByIdx(0)
        @resistor10k = @circuit.getElmByIdx(2)
        @resistor20k = @circuit.getElmByIdx(6)

      describe "components should have correct values", ->

        specify "Voltage Source should have correct voltage", ->
          @voltageCompnt.volts.should.eql [0, 10]

        specify "Voltage Source should have correct current", ->
          @voltageCompnt.current.should.eql 0.0015

        specify "10k Resistor should have correct voltage", ->
          @resistor10k.volts.should.eql [10, 0]

        specify "10k Resistor should have correct current", ->
          @resistor10k.current.should.equal 0.001

        specify "20k Resistor should have correct voltage", ->
          @resistor20k.volts.should.eql [10, 0]

        specify "20k Resistor should have correct current", ->
          @resistor20k.current.should.equal 0.0005

        it "0 bad nodes", ->
          @circuit.findBadNodes().length.should.equal 0


  describe "should updateCircuit", ->
    before () ->
      @circuit.updateCircuit()

    it "should update scopes", ->