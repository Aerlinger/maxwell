GroundElm = require("../../../src/component/components/GroundElm")
Circuit = require('../../../src/core/circuit')

describe "GroundElm", ->
  beforeEach () ->
    @Circuit = new Circuit()
    @groundElm = new GroundElm(100, 100, 100, 200, 0, [])


  it "should have correct defaults", ->
    @groundElm.x1 == 100
    @groundElm.y1 == 100
    @groundElm.x2 == 100
    @groundElm.y2 == 200
    @groundElm.flags = 0

  it "should have correct number of posts", ->
    @groundElm.getPostCount().should.equal 1
    @groundElm.getInternalNodeCount().should.equal 0

  it "should not have any internal voltage sources", ->
    @groundElm.getVoltageSourceCount().should.equal 1

  it "should have correct dump type", ->
    @groundElm.getDumpType().should.equal "g"

  it "should have correct toString()", ->
    @groundElm.toString().should.equal "GroundElm"

  it "should be orphaned", ->
    @groundElm.orphaned().should.equal true

  describe "after soldering to circuit", ->
    beforeEach () ->
      @Circuit.solder(@groundElm)

    it "should not be orphaned", ->
      @groundElm.orphaned().should.equal false

    it "should be stampable", ->
      @groundElm.stamp()

    it "should be steppable", ->
      @groundElm.doStep()

    it "should be drawable", ->
      #@groundElm.draw()

    it "should setPoints", ->
      @groundElm.setPoints()