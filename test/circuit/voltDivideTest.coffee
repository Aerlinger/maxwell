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
    expect(@circuit.inspect()).to.deep.equal([
      {
        "type": "voltdivide.txt",
        "timeStep": 0.000005,
        "simSpeed": 172,
        "currentSpeed": 63,
        "voltageRange": 10,
        "powerRange": 62,
        "flags": 1
      },
      {
        "name": "VoltageElm",
        "pos": [112, 368, 112, 48],
        "flags": 0,
        "params": {
          "waveform": 0,
          "frequency": 40,
          "maxVoltage": 10,
          "bias": 0,
          "phaseShift": 0,
          "dutyCycle": 0.5
        }
      },
      {
        "name": "WireElm",
        "pos": [112, 48, 240, 48],
        "flags": 0,
        "params": {}
      },
      {
        "name": "ResistorElm",
        "pos": [240, 48, 240, 208],
        "flags": 0,
        "params": {
          "resistance": 10000
        }
      },
      {
        "name": "ResistorElm",
        "pos": [240, 208, 240, 368],
        "flags": 0,
        "params": {
          "resistance": 10000
        }
      },
      {
        "name": "WireElm",
        "pos": [112, 368, 240, 368],
        "flags": 0,
        "params": {}
      },
      {
        "name": "WireElm",
        "pos": [240, 48, 432, 48],
        "flags": 0,
        "params": {}
      },
      {
        "name": "WireElm",
        "pos": [240, 368, 432, 368],
        "flags": 0,
        "params": {}
      },
      {
        "name": "ResistorElm",
        "pos": [432, 48, 432, 128],
        "flags": 0,
        "params": {
          "resistance": 10000
        }
      },
      {
        "name": "ResistorElm",
        "pos": [432, 128, 432, 208],
        "flags": 0,
        "params": {
          "resistance": 10000
        }
      },
      {
        "name": "ResistorElm",
        "pos": [432, 208, 432, 288],
        "flags": 0,
        "params": {
          "resistance": 10000
        }
      },
      {
        "name": "ResistorElm",
        "pos": [432, 288, 432, 368],
        "flags": 0,
        "params": {
          "resistance": 10000
        }
      }
    ])

  describe "Running updateCircuit", ->
    before ->
      @circuit.updateCircuit()

