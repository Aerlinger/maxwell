Maxwell = require('../../../src/Maxwell.coffee')

describe "Instantiating Maxwell", ->
  before ->
    @primary_circuit = Maxwell.createCircuit("test_circuit")

  it "can be instantiated independently of the DOM", ->
    expect(@primary_circuit).to.be.ok()

  it "accesses circuit by name", ->
    expect(Maxwell.findCircuitByName("test_circuit")).to.eq(@primary_circuit)

  it "binds to a canvas element for rendering", ->
    circuitboardCanvas = document.getElementById('circuitboard')

    render_options = {
      toolbar: true,
      mouseEditor: true,
      mouseInfo: true,
      keyboardListener: true,
      infoOnHover: true,
      controlBar: true,
      theme: "default",
      fpsLimit: 30,
      retina: false,
      autoupdate: true,
      autopause: true,
      interval: 1
    }

    Maxwell.bindCircuitToCanvas(@primary)

    circuitRenderer = Maxwell.Renderer(circuitboardCanvas, @primary_circuit, render_options)


