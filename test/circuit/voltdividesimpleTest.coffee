Oscilloscope = require('../../src/scope/Oscilloscope.js')

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
      expect(@circuit.numElements()).to.equal 7

    it "has valid origMatrix", ->
      expect(@circuit.Solver.origMatrix).to.eql Util.zeroArray2(10, 10)

    it "has valid origRightSide", ->
      expect(@circuit.Solver.origRightSide).to.eql Util.zeroArray(10)

    it "has valid circuitPermute", ->
      expect(@circuit.Solver.circuitPermute).to.eql Util.zeroArray(10)

    it "has valid circuitMatrix", ->
      expect(@circuit.Solver.circuitMatrix).to.eql []

    it "has valid right side", ->
      expect(@circuit.Solver.circuitRightSide).to.eql []

    it "Circuit Solver needs map", ->
      expect(@circuit.Solver.circuitNeedsMap).to.equal true

    it "has correct voltage sources", ->
      voltageSources = "VoltageElm,WireElm@[112 48 240 48],WireElm@[112 368 240 368],WireElm@[240 48 432 48],WireElm@[240 368 432 368]"
      expect(@circuit.getVoltageSources().toString()).to.equal voltageSources

    describe "current rowInfos", ->
      it "index: 0", ->
        expect(@rowInfo[0].toString()).to.equal "RowInfo: type: 1, nodeEq: 0, mapCol: -1, mapRow: -1, value: 10, rsChanges: false, lsChanges: false, dropRow: true"

      it "index: 1", ->
        expect(@rowInfo[1].toString()).to.equal "RowInfo: type: 1, nodeEq: 0, mapCol: -1, mapRow: -1, value: 10, rsChanges: false, lsChanges: false, dropRow: true"

      it "index: 2", ->
        expect(@rowInfo[2].toString()).to.equal "RowInfo: type: 1, nodeEq: 0, mapCol: -1, mapRow: -1, value: 0, rsChanges: false, lsChanges: false, dropRow: true"

      it "index: 3", ->
        expect(@rowInfo[3].toString()).to.equal "RowInfo: type: 1, nodeEq: 0, mapCol: -1, mapRow: -1, value: 10, rsChanges: false, lsChanges: false, dropRow: true"

      it "index 4", ->
        expect(@rowInfo[4].toString()).to.equal "RowInfo: type: 1, nodeEq: 0, mapCol: -1, mapRow: -1, value: 0, rsChanges: false, lsChanges: false, dropRow: true"
    #        @rowInfo[5].toString()).to.equal "RowInfo: type: 1, nodeEq: 6, mapCol: -1, mapRow: -1, value: 0.0015, false false true"
    #        @rowInfo[6].toString()).to.equal "RowInfo: type: 1, nodeEq: 0, mapCol: -1, mapRow: -1, value: 0.0015, false false true"
    #        @rowInfo[7].toString()).to.equal "RowInfo: type: 1, nodeEq: 0, mapCol: -1, mapRow: -1, value: -0.0015, false false true"
    #        @rowInfo[8].toString()).to.equal "RowInfo: type: 1, nodeEq: 0, mapCol: -1, mapRow: -1, value: 0.0005, rsChanges: false, lsChanges: false, dropRow: true"
    #        @rowInfo[9].toString()).to.equal "RowInfo: type: 1, nodeEq: 0, mapCol: -1, mapRow: -1, value: -0.0005, rsChanges: false, lsChanges: false, dropRow: true"

    it "10 elements in circuitRowInfo", ->
      expect(@circuit.Solver.circuitRowInfo.length).to.equal 10

    it "has correct nodes", ->
      expect(@circuit.getNode(0).toString()).to.equal "CircuitNode: 112 368 false [0 VoltageElm,0 WireElm@[112 368 240 368]]"
      expect(@circuit.getNode(1).toString()).to.equal """CircuitNode: 112 48 false [1 VoltageElm,0 WireElm@[112 48 240 48]]"""
      expect(@circuit.getNode(2).toString()).to.equal """CircuitNode: 240 48 false [1 WireElm@[112 48 240 48],0 ResistorElm@[240 48 240 368]: {"resistance":10000},0 WireElm@[240 48 432 48]]"""
      expect(@circuit.getNode(3).toString()).to.equal """CircuitNode: 240 368 false [1 ResistorElm@[240 48 240 368]: {"resistance":10000},1 WireElm@[112 368 240 368],0 WireElm@[240 368 432 368]]"""
      expect(@circuit.getNode(4).toString()).to.equal """CircuitNode: 432 48 false [1 WireElm@[240 48 432 48],0 ResistorElm@[432 48 432 368]: {"resistance":20000}]"""
      expect(@circuit.getNode(5).toString()).to.equal """CircuitNode: 432 368 false [1 WireElm@[240 368 432 368],1 ResistorElm@[432 48 432 368]: {"resistance":20000}]"""

    it "has 6 nodes", ->
      expect(@circuit.numNodes()).to.equal 6

    it "is linear", ->
      expect(@circuit.Solver.circuitNonLinear).to.equal false


    describe "runCircuit()", ->
      before ->
        @circuit.Solver.solveCircuit()
        @voltageCompnt = @circuit.getElmByIdx(0)
        @resistor10k = @circuit.getElmByIdx(2)
        @resistor20k = @circuit.getElmByIdx(6)

      it "has correct params", ->
        expect(@circuit.inspect()).to.eql([
          {
            "current": 0.0015
            "name": "Voltage Source"
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
          expect(@voltageCompnt.volts).to.eql [0, 10]

        specify "Voltage Source has correct current", ->
          expect(@voltageCompnt.current).to.eql 0.0015

        specify "10k Resistor has correct voltage", ->
          expect(@resistor10k.volts).to.eql [10, 0]

        specify "10k Resistor has correct current", ->
          expect(@resistor10k.current).to.equal 0.001

        specify "20k Resistor has correct voltage", ->
          expect(@resistor20k.volts).to.eql [10, 0]

        specify "20k Resistor has correct current", ->
          expect(@resistor20k.current).to.equal 0.0005

        it "0 bad nodes", ->
          expect(@circuit.findBadNodes().length).to.equal 0


  describe "Running updateCircuit", ->
    before ->
      @circuit.updateCircuit()

    it.skip "has correct voltage", ->
      expect(@circuit.Solver.dump()).to.eql("")

