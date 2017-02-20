describe "Capacitor Component", ->
  beforeEach ->
    @capacitor = new CapacitorElm(100, 100, 100, 200, { capacitance: 1e-9, voltdiff: 1.1})

  it "has correct defaults", ->
    @capacitor.capacitance.should.equal 1e-9
    @capacitor.voltdiff.should.equal 1.1

  it "has correct number of posts", ->
    @capacitor.numPosts().should.equal 2
    @capacitor.numInternalNodes().should.equal 0

  it "is not have any internal voltage sources", ->
    @capacitor.numVoltageSources().should.equal 0

  it "has correct toString()", ->
    expect(@capacitor.toString()).to.equal """Capacitor@[100 100 100 200] {capacitance: 1.0 nF, voltdiff: 1.1 V}"""

  it "is orphaned", ->
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

    it "can getVoltage() correctly", ->
      @capacitor.getVoltageDiff().should.equal 0

    it "is not be orphaned", ->
      @capacitor.orphaned().should.equal false

    it "is stampable", ->
      @capacitor.stamp(@Circuit.Solver.getStamper())

    it "is steppable", ->
      @capacitor.doStep(@Circuit.getStamper())

    it "is drawable", ->
      #@capacitor.draw()

    it "can setPoints()", ->
      @capacitor.setPoints()

  describe "Rendering", ->
    before (done) ->
      @Circuit = new Circuit("BasicPotentiometer")

      @canvas = new Canvas(200, 200)
      ctx = @canvas.getContext('2d')

      @Circuit.clearAndReset()
      @Circuit.solder(@capacitor)

      @renderer = new CircuitApplication(@Circuit, @canvas)
      @renderer.context = ctx
      done()

    it "renders initial circuit", ->
      @renderer.draw()

      fs.writeFileSync("test/fixtures/componentRenders/#{@Circuit.name}_init.png", @canvas.toBuffer())


