describe "Transformer Component", ->
  before (done)->
#    @transformer = new TransformerElm(50, 50, 50, 150, ["1e-4", "5", "1e-2", "1e-1", 0.998])

    @transformer = new TransformerElm(50, 50, 50, 150, {
      inductance: 1e-4,
      ratio: 5,
      current0: 1e-2,
      current1: 1e-3,
      couplingCoef: 0.990
    })
    done()

  it "has correct attributes", ->
    expect(@transformer.inductance).to.equal(1e-4)
    expect(@transformer.ratio).to.equal(5)
    expect(@transformer.params.current0).to.deep.equal(1e-2)
    expect(@transformer.params.current1).to.deep.equal(1e-3)
    expect(@transformer.couplingCoef).to.equal(0.990)

  describe "Rendering", ->
    before (done) ->
      @Circuit = new Circuit("Basic Transformer")

      @canvas = new Canvas(200, 200)
      ctx = @canvas.getContext('2d')

      @Circuit.clearAndReset()
      @Circuit.solder(@transformer)

      @transformer.Circuit = @Circuit

      @renderer = new Renderer(@Circuit, @canvas)
      @renderer.context = ctx

      done()

    it "renders initial circuit", ->
      @renderer.drawComponents()
      fs.writeFileSync("test/fixtures/componentRenders/#{@Circuit.name}_init.png", @canvas.toBuffer())

    it "stamps the circuit", ->
      stamper = new MatrixStamper()

      stamper_stub = sinon.stub(stamper)
      @transformer.stamp(stamper_stub)
