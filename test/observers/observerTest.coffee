Circuit = require('../../src/core/circuit.coffee')
CircuitCanvas = require('../../src/render/circuitCanvas.coffee')

describe "Render should receive a notification when a Circuit updates", ->

  beforeEach ->
    @Circuit = new Circuit()
    @Renderer = new CircuitCanvas(@Circuit)

  it "Calling update() should also call @Renderer.clear()", ->
    @Circuit.updateCircuit()
    @Circuit.updateCircuit()
    @Circuit.updateCircuit()
    @Circuit.updateCircuit()
    @Circuit.updateCircuit()
