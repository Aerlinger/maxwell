Circuit = require('../../../src/circuit/circuit.coffee')
WireElm = require('../../../src/circuit/components/WireElm.coffee')
MatrixStamper = require('../../../src/engine/matrixStamper.coffee')

describe "Wire Component", ->
  beforeEach ->
    @Circuit = new Circuit()
    @Stamper = new MatrixStamper(@Circuit)
    @wireElm = new WireElm(100, 100, 100, 200, 0, {})

  it "has correct defaults", ->
    @wireElm.x1 == 100
    @wireElm.y1 == 100
    @wireElm.x2 == 100
    @wireElm.y2 == 200
    @wireElm.flags = 0

  it "has correct number of posts", ->
    @wireElm.getPostCount().should.equal 2
    @wireElm.getInternalNodeCount().should.equal 0

  it "is not have any internal voltage sources", ->
    @wireElm.getVoltageSourceCount().should.equal 1

  it "has correct dump type", ->
    @wireElm.getDumpType().should.equal "w"

  it "has correct toString()", ->
    @wireElm.toString().should.equal "WireElm"

  it "should be orphaned", ->
    @wireElm.orphaned().should.equal true

  describe "after soldering to circuit", ->
    beforeEach ->
      @Circuit.solder(@wireElm)

    it "is not be orphaned", ->
      @wireElm.orphaned().should.equal false

    it "should be stampable", ->
      @wireElm.stamp(@Stamper)

    it "is steppable", ->
      @wireElm.doStep()

    it "is drawable", ->
      #@wireElm.draw()

    it "correctly setPoints", ->
      @wireElm.setPoints()
