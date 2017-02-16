glob = require('glob')
path = require("path")

describe.skip "CircuitUI", ->
  it "renders all circuits", () ->
    this.timeout(1000000)

    circuit_names = glob.sync(__dirname + "/../../circuits/v5/*.json")

    for circuit_name in circuit_names
      basename = path.basename(circuit_name, '.json')
      console.log("RENDERING", basename)

      @canvas = new Canvas(600, 500)
      outpath = "test/fixtures/circuitRenders/" + basename + ".png"

      if basename != "__index__" and basename != "all-components" and basename != "index"
        try
          jsonData = JSON.parse(fs.readFileSync(circuit_name))

          @circuit = CircuitLoader.createCircuitFromJsonData(jsonData)
          @circuit.updateCircuit()

          @renderer = new CircuitUI(@circuit, @canvas)

          ctx = @canvas.getContext('2d')
          @renderer.context = ctx
          @renderer.CircuitCanvas.drawComponents()

          origfont = ctx.font
          ctx.font = "16px serif"
          ctx.fillText(basename, 5, 20)
          ctx.font = origfont

          fs.writeFileSync(outpath, @canvas.toBuffer())

        catch e
          console.log("ERR:", e.message)
          console.log(e.stack)
