PotElm = require("../../src/circuit/components/PotElm.coffee")

describe "Potentiometer", ->
  before ->
    @potElm = new PotElm(100, 100, 100, 300, { maxResistance: 1e6, position: 50, sliderText: "silly" })

  it "has correct position", ->
    expect(@potElm.x1).to.equal(100)
    expect(@potElm.y1).to.equal(100)
    expect(@potElm.x2).to.equal(100)
    expect(@potElm.y2).to.equal(292)

  it "has correct parameters", ->
    expect(@potElm.maxResistance).to.equal(1e6)
    expect(@potElm.position).to.equal(50)
    expect(@potElm.sliderText).to.equal("silly")
    expect(@potElm.getSliderValue()).to.equal(5000)
