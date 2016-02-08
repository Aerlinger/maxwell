TransistorElm = require('../../src/circuit/components/TransistorElm')
Circuit = require("../../src/circuit/Circuit.coffee")

Renderer = require("../../src/render/renderer.coffee")
fs = require('fs')
Canvas = require('canvas')

describe "TransistorElm", ->
  before ->
    @transistorElm = new TransistorElm(50, 50, 50, 150, ["1", "-4.295", "0.705", "100.0"])

    @Circuit = new Circuit("Basic BJT")

    @transistorElm.setPoints()
    @transistorElm.setup()
    @Circuit.solder(@transistorElm)


  it "is pnp", ->
    expect(@transistorElm.pnp).to.equal(1)

  it "has correct vbe", ->
    expect(@transistorElm.lastvbe).to.equal(-4.295)

  it "has correct vbc", ->
    expect(@transistorElm.lastvbc).to.equal(0.705)

  it "has correct beta", ->
    expect(@transistorElm.beta).to.equal(100.0)

  it "can stamp", ->
    @transistorElm.stamp(@Circuit.Solver.Stamper)

  describe "Loading list of parameters", ->
    before ->
      @transistorElm = new TransistorElm(100, 200, 100, 300, ["-1", "-4.295", "0.705", "100.0"])

    it "is pnp", ->
      expect(@transistorElm.pnp).to.equal(-1)


  describe "Rendering", ->
    before (done) ->
      Canvas = require('canvas')
      @canvas = new Canvas(100, 200)
      ctx = @canvas.getContext('2d')

      @Circuit.clearAndReset()
      @Circuit.solder(@transistorElm)

      @renderer = new Renderer(@Circuit, @canvas)
      @renderer.context = ctx
      done()

    it "renders initial circuit", ->
      @renderer.drawComponents()

      fs.writeFileSync("test/fixtures/componentRenders/#{@Circuit.name}_init.png", @canvas.toBuffer())
