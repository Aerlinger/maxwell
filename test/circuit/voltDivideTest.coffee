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

describe "Voltage Divider", ->
  before (done) ->
    voltdivide = JSON.parse(fs.readFileSync("./circuits/v3/ohms.json"))
    @circuit = CircuitLoader.createCircuitFromJsonData(voltdivide)

    done()

    @circuit.updateCircuit()

  it "has correct values", ->
    expect(@circuit.inspect()).to.deep.equal(
      [
        {
          "current": 0.05
          "name": "Resistor"
          "params": [
            100
          ]
          "pos": [
            256
            176
            256
            304
          ]
          "voltage": 5
        }
        {
          "current": 0.055
          "name": "VarRailElm"
          "params": [
            6
            5
            5
            0
            0
            0.5
            "Voltage"
          ]
          "pos": [
            304
            176
            304
            128
          ]
          "voltage": 5
        }
        {
          "current": 0.05
          "name": "GroundElm"
          "params": []
          "pos": [
            256
            336
            256
            352
          ]
          "voltage": 0
        }
        {
          "current": 0.05
          "name": "Wire"
          "params": []
          "pos": [
            256
            304
            256
            336
          ]
          "voltage": -0
        }
        {
          "current": 0.005
          "name": "Resistor"
          "params": [
            1000
          ]
          "pos": [
            352
            176
            352
            304
          ]
          "voltage": 5
        }
        {
          "current": 0.005
          "name": "Wire"
          "params": []
          "pos": [
            352
            304
            352
            336
          ]
          "voltage": 0
        }
        {
          "current": 0.005
          "name": "GroundElm"
          "params": []
          "pos": [
            352
            336
            352
            352
          ]
          "voltage": 0
        }
        {
          "current": 0.005
          "name": "Wire"
          "params": []
          "pos": [
            304
            176
            352
            176
          ]
          "voltage": 5
        }
        {
          "current": -0.05
          "name": "Wire"
          "params": []
          "pos": [
            256
            176
            304
            176
          ]
          "voltage": 5
        }
      ]
    )

  describe "Running updateCircuit", ->
    before ->
      @circuit.updateCircuit()

