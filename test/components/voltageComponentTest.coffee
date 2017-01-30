describe "Voltage Component", ->
  beforeEach ->
    @Circuit = new Circuit("BasicVoltage")
    @Stamper = new MatrixStamper(@Circuit)
    @voltageElm = new VoltageElm(50, 50, 50, 150, {
      waveform: VoltageElm.WF_DC,
      frequency: 80,
      maxVoltage: 6,
      bias: 2,
      phaseShift: 45,
      dutyCycle: .75
    })

  it "has correct defaults", ->
    @voltageElm.waveform.should.equal VoltageElm.WF_DC
    @voltageElm.frequency.should.equal 80
    @voltageElm.maxVoltage.should.equal 6
    @voltageElm.bias.should.equal 2
    @voltageElm.phaseShift.should.equal 45
    @voltageElm.dutyCycle.should.equal 0.75

  it "has correct number of posts", ->
    @voltageElm.numPosts().should.equal 2
    @voltageElm.numInternalNodes().should.equal 0

  it "is not have any internal voltage sources", ->
    @voltageElm.numVoltageSources().should.equal 1

  it "has correct toString()", ->
    @voltageElm.toString().should.equal "VoltageElm"

  it "is orphaned", ->
    @voltageElm.orphaned().should.equal true

  describe "after soldering to circuit", ->
    beforeEach ->
      @Circuit.solder(@voltageElm)

    it "can getVoltage correctly", ->
      @voltageElm.getVoltage().should.equal 6 + 2

    it "is not be orphaned", ->
      @voltageElm.orphaned().should.equal false

    it "is stampable", ->
      @voltageElm.stamp(@Stamper)

    it "is steppable", ->
      @voltageElm.doStep()

    it "is drawable", ->
      #@voltageElm.draw()

    it "can setPoints(", ->
      @voltageElm.setPoints()

  describe "Rendering", ->
    before (done) ->
      @canvas = new Canvas(100, 200)
      ctx = @canvas.getContext('2d')

      @Circuit.clearAndReset()
      @Circuit.solder(@voltageElm)

      @renderer = new CircuitUI(@Circuit, @canvas)
      @renderer.context = ctx
      done()

    it "renders initial circuit", ->
      @renderer.CircuitCanvas.drawComponents()

      fs.writeFileSync("test/fixtures/componentRenders/#{@Circuit.name}_init.png", @canvas.toBuffer())
