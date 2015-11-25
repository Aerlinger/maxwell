ComponentRegistry = require('../../src/circuit/ComponentRegistry.coffee')
CircuitComponent = require('../../src/circuit/circuitComponent.coffee')
Circuit = require('../../src/circuit/circuit.coffee')
CircuitNode = require('../../src/engine/circuitNode.coffee')
CircuitLoader = require('../../src/io/circuitLoader.coffee')
ArrayUtils = require('../../src/util/arrayUtils.coffee')
SimulationParams = require('../../src/core/SimulationParams.coffee')
Hint = require('../../src/engine/Hint.coffee')
Oscilloscope = require('../../src/scope/Oscilloscope.coffee')

fs = require 'fs'
_ = require('lodash')


describe "Simple Voltage Divider", ->
  before (done) ->
    voltdividesimple = JSON.parse(fs.readFileSync("./circuits/voltdividesimple.json"))
#    @circuit = CircuitLoader.createCircuitFromJsonData(voltdividesimple)

    @circuit = new Circuit()

    # Valid class identifier name
    validName = /^[$A-Z_][0-9A-Z_$]*$/i

    # Circuit Parameters are stored at the header of the .json file (index 0)
    circuitParams = voltdividesimple.shift()
    #    circuit.Params = new SimulationParams(circuitParams)
    @circuit.Params = SimulationParams.deserialize(circuitParams)

    console.log(@circuit.Params.toString())

    # Load each Circuit component from JSON data:
    elms = []

    for elementData in voltdividesimple
      type = elementData['sym']

#      if type in Circuit.components
#        console.log("Found #{type}...")

      sym = ComponentRegistry.ComponentDefs[type]
      x1 = parseInt elementData['x1']
      y1 = parseInt elementData['y1']
      x2 = parseInt elementData['x2']
      y2 = parseInt elementData['y2']

      flags = parseInt elementData['flags']

      params = elementData['params']

      console.log(sym)

      if !sym
        @circuit.warn "No matching component for #{type}: #{sym}"
#        circuit.halt "Element: #{JSON.stringify(elementData)} is null"
      else if type is Hint
        console.log "Hint found in file!"
      else if type is Oscilloscope
        console.log "Scope found in file!"
      else if !type
        @circuit.warn "Unrecognized Type"
#      if _.isEmpty(sym)
#        circuit.warn "Component could not be added to circuit. Unrecognized component symbol: #{type}."
      else
#        console.log(sym.toString())
        newCircuitElm = new sym(x1, y1, x2, y2, params)

        elms.push(newCircuitElm)

        @circuit.solder newCircuitElm

    if elms.length == 0
      console.error "No elements loaded. JSON most likely malformed"

#    CircuitLoader.createCircuitFromJsonFile "../../circuits/voltdividesimple.json", (circuit) =>
#      @circuit = circuit
    done()

  describe "should Analyze voltdividesimple.json and have", ->
    before (done) ->
      @circuit.Solver.reconstruct()
      @rowInfo = @circuit.Solver.circuitRowInfo
      done()

    it "7 elements", ->
      @circuit.numElements().should.equal 7

    it "valid origMatrix", ->
      @circuit.Solver.origMatrix.should.eql ArrayUtils.zeroArray2(10, 10)

    it "valid origRightSide", ->
      @circuit.Solver.origRightSide.should.eql ArrayUtils.zeroArray(10)

    it "valid circuitPermute", ->
      @circuit.Solver.circuitPermute.should.eql ArrayUtils.zeroArray(10)

    it "valid circuitMatrix", ->
      @circuit.Solver.circuitMatrix.should.eql []

    it "valid right side", ->
      @circuit.Solver.circuitRightSide.should.eql []

    it "Circuit Solver should need map", ->
      @circuit.Solver.circuitNeedsMap.should.equal true

    it "has correct voltage sources", ->
      voltageSources = "VoltageElm,WireElm,WireElm,WireElm,WireElm"
      @circuit.getVoltageSources().toString().should.equal voltageSources

    describe "current rowInfos", ->

      it "index: 0", ->
        @rowInfo[0].toString().should.equal "RowInfo: type: 1, nodeEq: 0, mapCol: -1, mapRow: -1, value: 10, rsChanges: false, lsChanges: false, dropRow: true"

      it "index: 1", ->
        @rowInfo[1].toString().should.equal 'RowInfo: type: 1, nodeEq: 0, mapCol: -1, mapRow: 0, value: 10, rsChanges: false, lsChanges: false, dropRow: false'

      it "index: 2", ->
        @rowInfo[2].toString().should.equal "RowInfo: type: 1, nodeEq: 0, mapCol: -1, mapRow: -1, value: 0, rsChanges: false, lsChanges: false, dropRow: true"

      it "index: 3", ->
        @rowInfo[3].toString().should.equal "RowInfo: type: 1, nodeEq: 0, mapCol: -1, mapRow: -1, value: 10, false false true"

      it "index 4", ->
        @rowInfo[4].toString().should.equal "RowInfo: type: 1, nodeEq: 0, mapCol: -1, mapRow: -1, value: 0, false false true"
#        @rowInfo[5].toString().should.equal "RowInfo: type: 1, nodeEq: 6, mapCol: -1, mapRow: -1, value: 0.0015, false false true"
#        @rowInfo[6].toString().should.equal "RowInfo: type: 1, nodeEq: 0, mapCol: -1, mapRow: -1, value: 0.0015, false false true"
#        @rowInfo[7].toString().should.equal "RowInfo: type: 1, nodeEq: 0, mapCol: -1, mapRow: -1, value: -0.0015, false false true"
#        @rowInfo[8].toString().should.equal "RowInfo: type: 1, nodeEq: 0, mapCol: -1, mapRow: -1, value: 0.0005, rsChanges: false, lsChanges: false, dropRow: true"
#        @rowInfo[9].toString().should.equal "RowInfo: type: 1, nodeEq: 0, mapCol: -1, mapRow: -1, value: -0.0005, rsChanges: false, lsChanges: false, dropRow: true"

    it "10 elements in circuitRowInfo", ->
      @circuit.Solver.circuitRowInfo.length.should.equal 10

    it "has correct nodes", ->
      @circuit.getNode(0).toString().should.equal "CircuitNode: 112 368 false [0 VoltageElm,0 WireElm]"
      @circuit.getNode(1).toString().should.equal "CircuitNode: 112 48 false [1 VoltageElm,0 WireElm]"
      @circuit.getNode(2).toString().should.equal "CircuitNode: 240 48 false [1 WireElm,0 ResistorElm,0 WireElm]"
      @circuit.getNode(3).toString().should.equal "CircuitNode: 240 368 false [1 ResistorElm,1 WireElm,0 WireElm]"
      @circuit.getNode(4).toString().should.equal "CircuitNode: 432 48 false [1 WireElm,0 ResistorElm]"
      @circuit.getNode(5).toString().should.equal "CircuitNode: 432 368 false [1 WireElm,1 ResistorElm]"

    it "has 6 nodes", ->
      @circuit.numNodes().should.equal 6

    it "should be linear", ->
      @circuit.Solver.circuitNonLinear.should.equal false


    describe "should runCircuit()", ->
      before ->
        @circuit.Solver.solveCircuit()
        @voltageCompnt = @circuit.getElmByIdx(0)
        @resistor10k = @circuit.getElmByIdx(2)
        @resistor20k = @circuit.getElmByIdx(6)

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
