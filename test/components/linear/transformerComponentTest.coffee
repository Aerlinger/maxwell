describe "Transformer Component", ->
  beforeEach ->
    @transformer = new TransformerElm(50, 50, 50, 150, ["1e-4", "5", "1e-2", 0.998])

  it "has correct attributes", ->
    expect(@transformer.inductance).to.equal(1e-4)
    expect(@transformer.ratio).to.equal(5)
    expect(@transformer.current).to.equal(1e-2)
    expect(@transformer.couplingCoef).to.equal(0.998)

  describe "Rendering", ->
    before (done) ->
      @Circuit = new Circuit("Basic Transformer")

      Canvas = require('canvas')
      @canvas = new Canvas(200, 200)
      ctx = @canvas.getContext('2d')

      @Circuit.clearAndReset()
      @Circuit.solder(@transformer)

      @renderer = new Renderer(@Circuit, @canvas)
      @renderer.context = ctx
      done()

    it "renders initial circuit", ->
      @renderer.drawComponents()

      fs.writeFileSync("test/fixtures/componentRenders/#{@Circuit.name}_init.png", @canvas.toBuffer())


