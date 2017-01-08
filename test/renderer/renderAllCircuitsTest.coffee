glob = require('glob')

Circuit = require("../../src/circuit/circuit")
Renderer = require("../../src/render/renderer")

CircuitLoader = require("../../src/io/circuitLoader")

fs = require("fs")
Canvas = require('canvas')
path = require("path")

describe "Renderer", ->
  it.skip "renders all circuits", () ->
    this.timeout(100000)

    circuit_names = glob.sync(__dirname + "/../../circuits/*.json")

    for circuit_name in circuit_names
      basename = path.basename(circuit_name, '.json')
      console.log("RENDERING", basename)

      @canvas = new Canvas(600, 500)
      outpath = "test/fixtures/circuitRenders/" + basename + ".png"

      if basename != "__index__"
        try
          jsonData = JSON.parse(fs.readFileSync(circuit_name))

          @circuit = CircuitLoader.createCircuitFromJsonData(jsonData)
          @circuit.updateCircuit()

          @renderer = new Renderer(@circuit, @canvas)

          ctx = @canvas.getContext('2d')
          @renderer.context = ctx
          @renderer.drawComponents()

          origfont = ctx.font
          ctx.font = "16px serif"
          ctx.fillText(basename, 5, 20)
          ctx.font = origfont

          fs.writeFileSync(outpath, @canvas.toBuffer())

        catch e
          console.log("ERR:", e.message)
