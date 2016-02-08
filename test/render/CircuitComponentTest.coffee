CircuitComponent = require("../../src/circuit/circuitComponent.coffee")
Circuit = require("../../src/circuit/circuit.coffee")
ResistorElm = require("../../src/circuit/components/ResistorElm.coffee")

Renderer = require("../../src/render/renderer.coffee")

fs = require('fs')
Canvas = require('canvas')

describe "Rendering a default component", ->
  before ->
    Canvas = require('canvas')
    canvas = new Canvas(100, 200)
    ctx = canvas.getContext('2d')

    circuit = new Circuit("No voltage")
    resistorElm = new ResistorElm(50, 50, 50, 150, ["500"], 0)

    circuit.solder(resistorElm)

    @renderer = new Renderer(circuit, canvas)
    @renderer.context = ctx

    @renderer.draw()

    out = fs.createWriteStream("test/fixtures/componentRenders/#{circuit.name}.png")

    stream = canvas.createPNGStream()
    stream.on 'data', (chunk) ->
      out.write(chunk)

  it "renders", ->
    true
