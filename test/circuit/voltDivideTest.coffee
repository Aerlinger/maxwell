ComponentRegistry = require('../../src/circuit/ComponentRegistry.coffee')
CircuitComponent = require('../../src/circuit/circuitComponent.coffee')
Circuit = require('../../src/circuit/circuit.coffee')
CircuitNode = require('../../src/engine/circuitNode.coffee')
CircuitLoader = require('../../src/io/circuitLoader.coffee')
Util = require('../../src/util/util.coffee')
SimulationParams = require('../../src/core/SimulationParams.coffee')
Hint = require('../../src/engine/Hint.coffee')
Oscilloscope = require('../../src/scope/Oscilloscope.coffee')

fs = require 'fs'
_ = require('lodash')

describe "Voltage Divider", ->
  before (done) ->
    voltdivide = JSON.parse(fs.readFileSync("./circuits/ohms.json"))
    @circuit = CircuitLoader.createCircuitFromJsonData(voltdivide)

    done()

    @circuit.updateCircuit()

  it "has correct values", ->
    @circuit.inspect().should.eql([])

  describe "Running updateCircuit", ->
    before ->
      @circuit.updateCircuit()

    it "has correct voltage", ->
      @circuit.Solver.dump().should.eql ""
