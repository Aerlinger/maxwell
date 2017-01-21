Maxwell = require('../../src/Maxwell.js')

fs = require("fs")


describe "JSON output", ->
  before (done) ->
    @circuit = Maxwell.loadCircuitFromFile("./circuits/v4/ohms.json")
    @circuit.updateCircuit()

    @circuit.updateCircuit()
    @circuit.updateCircuit()
    @circuit.updateCircuit()

    done()

  it.skip "matches truth", ->
    ohms = require("../../dump/ohms.txt_ANALYSIS.json")

    expect(@circuit.toJson()).to.equal(ohms)

  describe "has correct JSON structure", ->
    before (done) ->
      @analysisJson = @circuit.toJson()
      @frameJson = @circuit.frameJson()
      done()

    it "persists circuit analysis to JSON format", ->
      analysisJsonKeys = [
        'startCircuit',
        'timeStep',
        'flags',
        'circuitNonLinear',
        'voltageSourceCount',
        'circuitMatrixSize',
        'circuitMatrixFullSize',
        'circuitPermute',
        'voltageSources',
        'circuitRowInfo',
        'elmList',
        'nodeList'
      ]

      expect(@analysisJson).to.have.all.keys analysisJsonKeys


    it "persists frames to JSON format", ->
      frameJsonKeys = [
        'nFrames',
        't',
        'circuitMatrix',
        'circuitRightSide',
        'simulationFrames'
      ]

      expect(@frameJson).to.have.all.keys frameJsonKeys


    describe "saving to file", ->
      before (done) ->
        @circuit.dumpFrameJson("./test/fixtures/data/ohms_frames.json")

        done()

      it.skip "dumps frame JSON", ->
        fileJson = JSON.parse(fs.readFileSync("./test/fixtures/data/ohms_frames.json"))

        expect(fileJson).to.eql(@circuit.frameJson())
