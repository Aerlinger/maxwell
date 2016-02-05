ClockElm = require('../../src/circuit/components/ClockElm.coffee')

describe "ClockElmTest", ->
  before ->
    @clockElm = new ClockElm(100, 200)

  it "has correct position", ->
    expect(@clockElm.x1).to.equal(100)
    expect(@clockElm.y1).to.equal(200)
    expect(@clockElm.x2).to.equal(100)
    expect(@clockElm.y2).to.equal(200)

  it "has correct voltage, bias, and frequency", ->
    expect(@clockElm.maxVoltage).to.equal(2.5)
    expect(@clockElm.bias).to.equal(2.5)
    expect(@clockElm.frequency).to.equal(100)
    expect(@clockElm.waveform).to.equal(ClockElm.WF_SQUARE)


describe "with explicit values", ->
  before ->
    @clockElm = new ClockElm(100, 200, 100, 200, {maxVoltage: 10, bias: 2, frequency: 100})

  it "has correct values", ->
    expect(@clockElm.maxVoltage).to.equal(10)
    expect(@clockElm.bias).to.equal(2)
    expect(@clockElm.frequency).to.equal(100)
    expect(@clockElm.waveform).to.equal(ClockElm.WF_SQUARE)
