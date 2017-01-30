describe "Wire Component", ->
  beforeEach ->
    @Circuit = new Circuit("BasicWire")
    @Stamper = new MatrixStamper(@Circuit)
    @wireElm = new WireElm(100, 100, 100, 200, {})

  it "has correct defaults", ->
    @wireElm.x1() == 100
    @wireElm.y1() == 100
    @wireElm.x2() == 100
    @wireElm.y2() == 200
    @wireElm.flags = 0

  it "has correct number of posts", ->
    expect(@wireElm.numPosts()).to.equal 2
    expect(@wireElm.numInternalNodes()).to.equal 0

  it "is not have any internal voltage sources", ->
    expect(@wireElm.numVoltageSources()).to.equal 1

  it "has correct toString()", ->
    expect(@wireElm.toString()).to.equal "Wire@[100 100 100 200]"

  it "is orphaned", ->
    expect(@wireElm.orphaned()).to.equal true

  describe "after soldering to circuit", ->
    beforeEach ->
      @Circuit.solder(@wireElm)

    it "is not be orphaned", ->
      expect(@wireElm.orphaned()).to.equal false

    it "is stampable", ->
      @wireElm.stamp(@Stamper)

    it "is steppable", ->
      @wireElm.doStep()

    it "is drawable", ->
      #@wireElm.draw()

    it "correctly setPoints", ->
      @wireElm.setPoints()

  describe "Rendering", ->
    before (done) ->
      @canvas = new Canvas(100, 200)
      ctx = @canvas.getContext('2d')

      @Circuit.clearAndReset()
      @Circuit.solder(@wireElm)

      @renderer = new CircuitUI(@Circuit, @canvas)
      @renderer.context = ctx
      done()

    it "renders initial circuit", ->
      @renderer.CircuitCanvas.draw()

      fs.writeFileSync("test/fixtures/componentRenders/#{@Circuit.name}_init.png", @canvas.toBuffer())




