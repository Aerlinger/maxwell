describe "Clock Test", ->
  before ->
    @clockElm = new ClockElm(100, 200)

  it "has correct position", ->
    expect(@clockElm.x1()).to.equal(100)
    expect(@clockElm.y1()).to.equal(200)
    expect(@clockElm.x2()).to.equal(100)
    expect(@clockElm.y2()).to.equal(200)

  it "has correct voltage, bias, and frequency", ->
    expect(@clockElm.maxVoltage).to.equal(5)
    expect(@clockElm.bias).to.equal(2.5)
    expect(@clockElm.frequency).to.equal(40)
    expect(@clockElm.waveform).to.equal(ClockElm.WF_SQUARE)

  it "has correct params", ->
    expect(@clockElm.params).to.eql(
      {
        "bias": 0
        "dutyCycle": 0.5
        "frequency": 40
        "maxVoltage": 5
        "phaseShift": 0
        "waveform": 0
      }
    )


describe "with explicit values", ->
  before ->
    @clockElm = new ClockElm(50, 50, 50, 150, {maxVoltage: 10, bias: 2, frequency: 100})

  it "has correct values", ->
    expect(@clockElm.maxVoltage).to.equal(10)
    expect(@clockElm.bias).to.equal(2)
    expect(@clockElm.frequency).to.equal(100)
    expect(@clockElm.waveform).to.equal(ClockElm.WF_SQUARE)


  describe "Rendering", ->
    before (done) ->
      @canvas = new Canvas(100, 200)
      ctx = @canvas.getContext('2d')

      @Circuit = new Circuit("BasicClockElm")
      @Circuit.clearAndReset()
      @Circuit.solder(@clockElm)

      @renderer = new CircuitApplication(@Circuit, @canvas)
      @renderer.context = ctx
      done()

    it "renders initial circuit", ->
      @renderer.draw()

      fs.writeFileSync("test/fixtures/componentRenders/#{@Circuit.name}_init.png", @canvas.toBuffer())
