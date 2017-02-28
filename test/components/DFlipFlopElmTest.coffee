describe "DFlipFlop Component", ->
  beforeEach ->
    @dff = new DFlipFlopElm(50, 50, 50, 150, volts: [0])

  it "is valid", ->
    expect(@dff.numPosts()).to.eql(4)

  it "can be initialized without voltage", ->
    
