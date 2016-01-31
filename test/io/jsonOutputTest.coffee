Circuit = require('../../src/circuit/circuit.coffee')
Maxwell = require('../../src/Maxwell.coffee')
GroundElm = require('../../src/circuit/components/GroundElm.coffee')
WireElm = require('../../src/circuit/components/WireElm.coffee')
VoltageElm = require('../../src/circuit/components/VoltageElm.coffee')
ResistorElm = require('../../src/circuit/components/ResistorElm.coffee')

describe.only "JSON output", ->
  before (done) ->
    @circuit = Maxwell.loadCircuitFromFile("./circuits/ohms.json")
    @circuit.updateCircuit()
    done()

  it "matches truth", ->
    ohms = require("../../dump/ohms.txt_ANALYSIS.json")

    expect(@circuit.toJson()).to.equal(ohms)

  it "Stringifies", ->
    expect(JSON.stringify(@circuit.toJson())).to.equal()
