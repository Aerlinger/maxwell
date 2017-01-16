ComponentRegistry = require('../../src/circuit/ComponentRegistry.js')
CircuitComponent = require('../../src/circuit/circuitComponent.js')
Circuit = require('../../src/circuit/circuit.js')
CircuitNode = require('../../src/engine/circuitNode.js')
CircuitLoader = require('../../src/io/circuitLoader.js')
Util = require('../../src/util/util.js')
SimulationParams = require('../../src/core/SimulationParams.js')
Hint = require('../../src/engine/Hint.js')
Oscilloscope = require('../../src/scope/Oscilloscope.js')

fs = require 'fs'
_ = require('lodash')


describe "Simple Voltage Divider", ->
  before (done) ->
    voltdividesimple = JSON.parse(fs.readFileSync("./circuits/v3/voltdividesimple.json"))
    @circuit = CircuitLoader.createCircuitFromJsonData(voltdividesimple)

    #    CircuitLoader.createCircuitFromJsonFile "../../circuits/voltdividesimple.json", (circuit) =>
    #      @circuit = circuit
    done()

  describe "Analyzing voltdividesimple.json", ->
    before (done) ->
      @circuit.Solver.reconstruct()
      @rowInfo = @circuit.Solver.circuitRowInfo
      done()

    it "7 elements", ->
      @circuit.numElements().should.equal 7

    it "has valid origMatrix", ->
      @circuit.Solver.origMatrix.should.eql Util.zeroArray2(10, 10)

    it "has valid origRightSide", ->
      @circuit.Solver.origRightSide.should.eql Util.zeroArray(10)

    it "has valid circuitPermute", ->
      @circuit.Solver.circuitPermute.should.eql Util.zeroArray(10)

    it "has valid circuitMatrix", ->
      @circuit.Solver.circuitMatrix.should.eql []

    it "has valid right side", ->
      @circuit.Solver.circuitRightSide.should.eql []

    it "Circuit Solver needs map", ->
      @circuit.Solver.circuitNeedsMap.should.equal true

    it "has correct voltage sources", ->
      voltageSources = "VoltageElm,WireElm@[112 48 240 48],WireElm@[112 368 240 368],WireElm@[240 48 432 48],WireElm@[240 368 432 368]"
      @circuit.getVoltageSources().toString().should.equal voltageSources

    describe "current rowInfos", ->
      it "index: 0", ->
        expect(@rowInfo[0].toString()).to.equal "RowInfo: type: 1, nodeEq: 0, mapCol: -1, mapRow: -1, value: 10, rsChanges: false, lsChanges: false, dropRow: true"

      it "index: 1", ->
        @rowInfo[1].toString().should.equal "RowInfo: type: 1, nodeEq: 0, mapCol: -1, mapRow: -1, value: 10, rsChanges: false, lsChanges: false, dropRow: true"

      it "index: 2", ->
        @rowInfo[2].toString().should.equal "RowInfo: type: 1, nodeEq: 0, mapCol: -1, mapRow: -1, value: 0, rsChanges: false, lsChanges: false, dropRow: true"

      it "index: 3", ->
        @rowInfo[3].toString().should.equal "RowInfo: type: 1, nodeEq: 0, mapCol: -1, mapRow: -1, value: 10, rsChanges: false, lsChanges: false, dropRow: true"

      it "index 4", ->
        @rowInfo[4].toString().should.equal "RowInfo: type: 1, nodeEq: 0, mapCol: -1, mapRow: -1, value: 0, rsChanges: false, lsChanges: false, dropRow: true"
    #        @rowInfo[5].toString().should.equal "RowInfo: type: 1, nodeEq: 6, mapCol: -1, mapRow: -1, value: 0.0015, false false true"
    #        @rowInfo[6].toString().should.equal "RowInfo: type: 1, nodeEq: 0, mapCol: -1, mapRow: -1, value: 0.0015, false false true"
    #        @rowInfo[7].toString().should.equal "RowInfo: type: 1, nodeEq: 0, mapCol: -1, mapRow: -1, value: -0.0015, false false true"
    #        @rowInfo[8].toString().should.equal "RowInfo: type: 1, nodeEq: 0, mapCol: -1, mapRow: -1, value: 0.0005, rsChanges: false, lsChanges: false, dropRow: true"
    #        @rowInfo[9].toString().should.equal "RowInfo: type: 1, nodeEq: 0, mapCol: -1, mapRow: -1, value: -0.0005, rsChanges: false, lsChanges: false, dropRow: true"

    it "10 elements in circuitRowInfo", ->
      @circuit.Solver.circuitRowInfo.length.should.equal 10

    it "has correct nodes", ->
      expect(@circuit.getNode(0).toString()).to.equal "CircuitNode: 112 368 false [0 VoltageElm,0 WireElm@[112 368 240 368]]"
      expect(@circuit.getNode(1).toString()).to.equal """CircuitNode: 112 48 false [1 VoltageElm,0 WireElm@[112 48 240 48]]"""
      expect(@circuit.getNode(2).toString()).to.equal """CircuitNode: 240 48 false [1 WireElm@[112 48 240 48],0 ResistorElm@[240 48 240 368]: {"resistance":10000},0 WireElm@[240 48 432 48]]"""
      expect(@circuit.getNode(3).toString()).to.equal """CircuitNode: 240 368 false [1 ResistorElm@[240 48 240 368]: {"resistance":10000},1 WireElm@[112 368 240 368],0 WireElm@[240 368 432 368]]"""
      expect(@circuit.getNode(4).toString()).to.equal """CircuitNode: 432 48 false [1 WireElm@[240 48 432 48],0 ResistorElm@[432 48 432 368]: {"resistance":20000}]"""
      expect(@circuit.getNode(5).toString()).to.equal """CircuitNode: 432 368 false [1 WireElm@[240 368 432 368],1 ResistorElm@[432 48 432 368]: {"resistance":20000}]"""

    it "has 6 nodes", ->
      @circuit.numNodes().should.equal 6

    it "is linear", ->
      @circuit.Solver.circuitNonLinear.should.equal false


    describe "runCircuit()", ->
      before ->
        @circuit.Solver.solveCircuit()
        @voltageCompnt = @circuit.getElmByIdx(0)
        @resistor10k = @circuit.getElmByIdx(2)
        @resistor20k = @circuit.getElmByIdx(6)

      it "has correct params", ->
        @circuit.inspect().should.eql([
          {
            "current": 0.0015
            "name": "VoltageElm"
            "params": [
              0
              40
              10
              0
              0
              0.5
            ]
            "pos": [
              112
              368
              112
              48
            ]
            "voltage": 10
          }
          {
            "current": 0.0015
            "name": "Wire"
            "params": []
            "pos": [
              112
              48
              240
              48
            ]
            "voltage": 10
          }
          {
            "current": 0.001
            "name": "Resistor"
            "params": [
              10000
            ]
            "pos": [
              240
              48
              240
              368
            ]
            "voltage": 10
          }
          {
            "current": -0.0015
            "name": "Wire"
            "params": []
            "pos": [
              112
              368
              240
              368
            ]
            "voltage": 0
          }
          {
            "current": 0.0005
            "name": "Wire"
            "params": []
            "pos": [
              240
              48
              432
              48
            ]
            "voltage": 10
          }
          {
            "current": -0.0005
            "name": "Wire"
            "params": []
            "pos": [
              240
              368
              432
              368
            ]
            "voltage": 0
          }
          {
            "current": 0.0005
            "name": "Resistor"
            "params": [
              20000
            ]
            "pos": [
              432
              48
              432
              368
            ]
            "voltage": 10
          }
        ])

      describe "components have correct values", ->
        specify "Voltage Source has correct voltage", ->
          @voltageCompnt.volts.should.eql [0, 10]

        specify "Voltage Source has correct current", ->
          @voltageCompnt.current.should.eql 0.0015

        specify "10k Resistor has correct voltage", ->
          @resistor10k.volts.should.eql [10, 0]

        specify "10k Resistor has correct current", ->
          @resistor10k.current.should.equal 0.001

        specify "20k Resistor has correct voltage", ->
          @resistor20k.volts.should.eql [10, 0]

        specify "20k Resistor has correct current", ->
          @resistor20k.current.should.equal 0.0005

        it "0 bad nodes", ->
          @circuit.findBadNodes().length.should.equal 0


  describe "Running updateCircuit", ->
    before ->
      @circuit.updateCircuit()

    it.skip "has correct voltage", ->
      expect(@circuit.Solver.dump()).to.eql("")

