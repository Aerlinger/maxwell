describe "Ground Component", ->
  beforeEach ->
    @Circuit = new Circuit("BasicGround")
    @groundElm = new GroundElm(50, 50, 50, 150)

  it "has correct defaults", ->
    @groundElm.x1 == 50
    @groundElm.y1 == 50
    @groundElm.x2 == 50
    @groundElm.y2 == 150
    @groundElm.flags = 0

  it "has correct number of posts", ->
    @groundElm.getPostCount().should.equal 1
    @groundElm.getInternalNodeCount().should.equal 0

  it "is not have any internal voltage sources", ->
    @groundElm.getVoltageSourceCount().should.equal 1

  it "has correct dump type", ->
    @groundElm.getDumpType().should.equal "g"

  it "has correct toString()", ->
    @groundElm.toString().should.equal "GroundElm"

  it "should be orphaned", ->
    @groundElm.orphaned().should.equal true

  describe "after soldering to circuit", ->
    beforeEach ->
      @Circuit.solder(@groundElm)

    it "is not be orphaned", ->
      @groundElm.orphaned().should.equal false

    it "should be stampable", ->
      @groundElm.stamp(@Circuit.Solver.Stamper)

    it "should be steppable", ->
      @groundElm.doStep()

    it "should be drawable", ->
      #@groundElm.draw()

    it "should setPoints", ->
      @groundElm.setPoints()

  describe "Rendering", ->
    before (done) ->
      Canvas = require('canvas')
      @canvas = new Canvas(100, 200)
      ctx = @canvas.getContext('2d')

      @Circuit.clearAndReset()
      @Circuit.solder(@groundElm)

      @renderer = new Renderer(@Circuit, @canvas)
      @renderer.context = ctx
      done()

    it "renders initial circuit", ->
      @renderer.drawComponents()

      fs.writeFileSync("test/fixtures/componentRenders/#{@Circuit.name}_init.png", @canvas.toBuffer())
