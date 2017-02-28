describe "Ground Component", ->
  beforeEach ->
    @Circuit = new Circuit("BasicGround")
    @groundElm = new GroundElm(50, 50, 50, 150)

  it "has correct defaults", ->
    @groundElm.x1() == 50
    @groundElm.y1() == 50
    @groundElm.x2() == 50
    @groundElm.y2() == 150
    @groundElm.flags = 0

  it "has correct number of posts", ->
    @groundElm.numPosts().should.equal 1
    @groundElm.numInternalNodes().should.equal 0

  it "is not have any internal voltage sources", ->
    @groundElm.numVoltageSources().should.equal 1

  it "has correct toString()", ->
    @groundElm.toString().should.equal "Ground@[50 50 50 150] {}"

  it "is orphaned", ->
    @groundElm.orphaned().should.equal true

  describe "after soldering to circuit", ->
    beforeEach ->
      @Circuit.solder(@groundElm)

    it "is not be orphaned", ->
      @groundElm.orphaned().should.equal false

    it "is stampable", ->
      @groundElm.stamp(@Circuit.Solver.Stamper)

    it "is steppable", ->
      @groundElm.doStep()

    it "is drawable", ->
      #@groundElm.draw()

    it "can setPoints", ->
      @groundElm.setPoints()

  describe "Rendering", ->
    before (done) ->
      @canvas = new Canvas(100, 200)
      ctx = @canvas.getContext('2d')

      @Circuit.clearAndReset()
      @Circuit.solder(@groundElm)

      @renderer = new CircuitApplication(@Circuit, @canvas)
      @renderer.context = ctx
      done()

    it "renders initial circuit", ->
      @renderer.draw()

      fs.writeFileSync("test/fixtures/componentRenders/#{@Circuit.name}_init.png", @canvas.toBuffer())
