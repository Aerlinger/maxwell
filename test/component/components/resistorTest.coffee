ResistorElm = require("../../../src/component/components/ResistorElm")
Circuit = require('../../../src/core/circuit')

describe "Resistor", ->
  beforeEach () ->
    @Circuit = new Circuit()
    @resistor = new ResistorElm(100, 100, 100, 200, 0, [50])

  it "should have correct resistance", ->
    @resistor.resistance.should.equal 50

  it "should not have any internal voltage sources", ->
    @resistor.getVoltageSourceCount().should.equal 0

  it "should calculate current when voltage is applied", ->
    @resistor.getPostCount().should.equal 2
    @resistor.getInternalNodeCount().should.equal 0

  it "should have correct dump type", ->
    @resistor.getDumpType().should.equal "r"

  it "should be orphaned", ->
    @resistor.orphaned().should.equal true

  describe "after soldering to circuit", ->

    beforeEach () ->
      @Circuit.solder(@resistor)

    it "should not be orphaned", ->
      @resistor.orphaned().should.equal false

    it "should be stampable", ->
      @resistor.stamp()