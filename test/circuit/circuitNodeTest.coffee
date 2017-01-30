CircuitNode = require('../../src/engine/CircuitNode.js')

describe "Circuit Node", ->
  beforeEach ->
    @CircuitNode1 = new CircuitNode()
    @CircuitNode = new CircuitNode(4, 5, false, [@CircuitNode1])

  it "has position, links and an internal flag.", ->
    @CircuitNode.x.should == 4
    @CircuitNode.y.should == 5
    @CircuitNode.intern.should == false
    @CircuitNode.links.should == [@CircuitNode1]

  it "outputs to string", ->
    console.log @CircuitNode.toString()

