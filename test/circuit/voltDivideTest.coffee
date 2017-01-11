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
    voltdivide = JSON.parse(fs.readFileSync("./circuits/ohms.json"))
    @circuit = CircuitLoader.createCircuitFromJsonData(voltdivide)

    done()

    @circuit.updateCircuit()

  it "has correct values", ->
    expect(@circuit.inspect()).to.deep.equal([
      {
        "current": 0.05
        "params": [
          100
        ]
        "sym": "r"
        "voltage": 5
        "x1": 256
        "x2": 256
        "xy": 304
        "y1": 176
      }
      {
        "current": 0.055
        "params": [
          6
          5
          5
          0
          0
          0.5
          "Voltage"
        ]
        "sym": 172
        "voltage": 5
        "x1": 304
        "x2": 304
        "xy": 128
        "y1": 176
      }
      {
        "current": 0.05
        "params": []
        "sym": "g"
        "voltage": 0
        "x1": 256
        "x2": 256
        "xy": 352
        "y1": 336
      }
      {
        "current": 0.05
        "params": []
        "sym": "w"
        "voltage": -0
        "x1": 256
        "x2": 256
        "xy": 336
        "y1": 304
      }
      {
        "current": 0.005
        "params": [
          1000
        ]
        "sym": "r"
        "voltage": 5
        "x1": 352
        "x2": 352
        "xy": 304
        "y1": 176
      }
      {
        "current": 0.005
        "params": []
        "sym": "w"
        "voltage": 0
        "x1": 352
        "x2": 352
        "xy": 336
        "y1": 304
      }
      {
        "current": 0.005
        "params": []
        "sym": "g"
        "voltage": 0
        "x1": 352
        "x2": 352
        "xy": 352
        "y1": 336
      }
      {
        "current": 0.005
        "params": []
        "sym": "w"
        "voltage": 5
        "x1": 304
        "x2": 352
        "xy": 176
        "y1": 176
      }
      {
        "current": -0.05
        "params": []
        "sym": "w"
        "voltage": 5
        "x1": 256
        "x2": 304
        "xy": 176
        "y1": 176
      }

    ])

  describe "Running updateCircuit", ->
    before ->
      @circuit.updateCircuit()

