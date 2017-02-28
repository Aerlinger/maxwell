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
    expect(@voltageElm.waveform).to.equal VoltageElm.WF_DC
    expect(@voltageElm.frequency).to.equal 80
    expect(@voltageElm.maxVoltage).to.equal 6
    expect(@voltageElm.bias).to.equal 2
    expect(@voltageElm.phaseShift).to.equal 45
    expect(@voltageElm.dutyCycle).to.equal 0.75

  it "has correct number of posts", ->
    expect(@voltageElm.numPosts()).to.equal 2
    expect(@voltageElm.numInternalNodes()).to.equal 0

  it "is not have any internal voltage sources", ->
    expect(@voltageElm.numVoltageSources()).to.equal 1

  it "has correct toString()", ->
    expect(@voltageElm.toString()).to.include "Voltage"

  it "is orphaned", ->
    expect(@voltageElm.orphaned()).to.equal true

  describe "after soldering to circuit", ->
    beforeEach ->
      @Circuit.solder(@voltageElm)

    it "can getVoltage correctly", ->
      expect(@voltageElm.getVoltage()).to.equal 6 + 2

    it "is not be orphaned", ->
      expect(@voltageElm.orphaned()).to.equal false

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

      @renderer = new CircuitApplication(@Circuit, @canvas)
      @renderer.context = ctx
      done()

    it "renders initial circuit", ->
      @renderer.drawComponents()

      fs.writeFileSync("test/fixtures/componentRenders/#{@Circuit.name}_init.png", @canvas.toBuffer())
