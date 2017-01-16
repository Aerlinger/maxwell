CapacitorElm = require('../../src/circuit/components/CapacitorElm.js')

describe "Capacitor Component", ->
  beforeEach ->
    @capacitor = new CapacitorElm(100, 100, 100, 200, { capacitance: 1e-9, voltdiff: 1.1})

  it "has correct defaults", ->
    @capacitor.capacitance.should.equal 1e-9
    @capacitor.voltdiff.should.equal 1.1

  it "has correct number of posts", ->
    @capacitor.getPostCount().should.equal 2
    @capacitor.getInternalNodeCount().should.equal 0

  it "is not have any internal voltage sources", ->
    @capacitor.getVoltageSourceCount().should.equal 0

  it "has correct toString()", ->
    expect(@capacitor.toString()).to.equal """CapacitorElm@[100 100 100 200]: {"capacitance":1e-9,"voltdiff":1.1}"""

  it "should be orphaned", ->
    @capacitor.orphaned().should.equal true

  it "has correct position", ->
    expect(@capacitor.point1.x).to.equal(100)
    expect(@capacitor.x1()).to.equal(100)

  it "serializes to JSON", ->
    expect(@capacitor.toJson()).to.eql({
      x: 100
      y: 100
      x2: 100
      y2: 200
      flags: 0
      nodes: [0, 0]
      params: { capacitance: 1e-9, voltdiff: 1.1 }
      selected: false
      voltSource: 0
      needsShortcut: true
      name: "CapacitorElm"
      postCount: 2
      nonLinear: false
    })

  describe "after soldering to circuit", ->
    beforeEach ->
      @Circuit = new Circuit()
      @Circuit.solder(@capacitor)

    it "should get voltage correctly", ->
      @capacitor.getVoltageDiff().should.equal 0

    it "is not be orphaned", ->
      @capacitor.orphaned().should.equal false

    it "should be stampable", ->
      @capacitor.stamp(@Circuit.Solver.getStamper())

    it "should be steppable", ->
      @capacitor.doStep(@Circuit.getStamper())

    it "should be drawable", ->
      #@capacitor.draw()

    it "should setPoints", ->
      @capacitor.setPoints()

  describe "Rendering", ->
    before (done) ->
      @Circuit = new Circuit("BasicPotentiometer")

      Canvas = require('canvas')
      @canvas = new Canvas(200, 200)
      ctx = @canvas.getContext('2d')

      @Circuit.clearAndReset()
      @Circuit.solder(@capacitor)

      @renderer = new Renderer(@Circuit, @canvas)
      @renderer.context = ctx
      done()

    it "renders initial circuit", ->
      @renderer.draw()

      fs.writeFileSync("test/fixtures/componentRenders/#{@Circuit.name}_init.png", @canvas.toBuffer())


