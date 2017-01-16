fs = require('fs')
Canvas = require('canvas')

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
    @voltageElm.getPostCount().should.equal 2
    @voltageElm.getInternalNodeCount().should.equal 0

  it "is not have any internal voltage sources", ->
    @voltageElm.getVoltageSourceCount().should.equal 1

  it "has correct toString()", ->
    @voltageElm.toString().should.equal "VoltageElm"

  it "should be orphaned", ->
    @voltageElm.orphaned().should.equal true

  describe "after soldering to circuit", ->
    beforeEach ->
      @Circuit.solder(@voltageElm)

    it "should get voltage correctly", ->
      @voltageElm.getVoltage().should.equal 6 + 2

    it "is not be orphaned", ->
      @voltageElm.orphaned().should.equal false

    it "should be stampable", ->
      @voltageElm.stamp(@Stamper)

    it "should be steppable", ->
      @voltageElm.doStep()

    it "should be drawable", ->
      #@voltageElm.draw()

    it "should setPoints", ->
      @voltageElm.setPoints()

  describe "Rendering", ->
    before (done) ->
      Canvas = require('canvas')
      @canvas = new Canvas(100, 200)
      ctx = @canvas.getContext('2d')

      @Circuit.clearAndReset()
      @Circuit.solder(@voltageElm)

      @renderer = new Renderer(@Circuit, @canvas)
      @renderer.context = ctx
      done()

    it "renders initial circuit", ->
      @renderer.drawComponents()

      fs.writeFileSync("test/fixtures/componentRenders/#{@Circuit.name}_init.png", @canvas.toBuffer())
