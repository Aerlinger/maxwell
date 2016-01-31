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


describe "Ohms", ->
  before (done) ->
    voltdividesimple = JSON.parse(fs.readFileSync("./circuits/ohmsTest.json"))
    @circuit = CircuitLoader.createCircuitFromJsonData(voltdividesimple)

    done()

  describe "Running updateCircuit", ->
    before ->
      @circuit.updateCircuit()
      done()

    it "has correct voltage", ->
      @circuit.Solver.dump().should.eql ""

