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

#describe "Voltage Divider", ->
#  before (done) ->
    #