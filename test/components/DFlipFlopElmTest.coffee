describe "DFlipFlow Component", ->
  beforeEach ->
    @dff = new DFlipFlopElm(50, 50, 50, 150, volts: [0])

  it "is valid", ->
    expect(@dff.getPostCount()).to.eql(4)

  it "has Fields", ->
    expect(DFlipFlopElm.Fields).to.eql({
      volts: {
        name: "Volts",
        dataType: "Array"
      },
      bits: {
        name: "Bits",
        dataType: "Array"
      }
    })


  it "can be initialized without voltage", ->
    
