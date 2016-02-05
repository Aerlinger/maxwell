ACRailElm = require('../../src/circuit/components/ACRailElm.coffee')

describe.only "ACRailElmTest", ->
  before ->
    @acRailElm = new ACRailElm(100, 200)

  it "has correct position", ->
    expect(@acRailElm.x1).to.equal(100)
    expect(@acRailElm.y1).to.equal(200)
    expect(@acRailElm.x2).to.equal(100)
    expect(@acRailElm.y2).to.equal(200)
    expect(@acRailElm.waveform).to.equal(ACRailElm.WF_AC)

