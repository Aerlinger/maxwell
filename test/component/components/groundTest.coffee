Circuit = require('../../../src/circuit/circuit.coffee')
GroundElm = require('../../../src/circuit/components/GroundElm.coffee')

describe "Ground Component", ->
  beforeEach ->
    @Circuit = new Circuit()
    @groundElm = new GroundElm(100, 100, 100, 200)


  it "has correct defaults", ->
    @groundElm.x1 == 100
    @groundElm.y1 == 100
    @groundElm.x2 == 100
    @groundElm.y2 == 200
    @groundElm.flags = 0

  it "has correct number of posts", ->
    @groundElm.getPostCount().should.equal 1
    @groundElm.getInternalNodeCount().should.equal 0

  it "is not have any internal voltage sources", ->
    @groundElm.getVoltageSourceCount().should.equal 1

  it "has correct dump type", ->
    @groundElm.getDumpType().should.equal "g"

  it "has correct toString()", ->
    @groundElm.toString().should.equal "GroundElm"

  it "should be orphaned", ->
    @groundElm.orphaned().should.equal true

  describe "after soldering to circuit", ->
    beforeEach ->
      @Circuit.solder(@groundElm)

    it "is not be orphaned", ->
      @groundElm.orphaned().should.equal false

    it "should be stampable", ->
      @groundElm.stamp(@Circuit.Solver.Stamper)

    it "should be steppable", ->
      @groundElm.doStep()

    it "should be drawable", ->
      #@groundElm.draw()

    it "should setPoints", ->
      @groundElm.setPoints()
