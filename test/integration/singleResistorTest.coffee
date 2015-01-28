Circuit = require('../../src/core/circuit.coffee')
GroundElm = require('../../src/component/components/GroundElm.coffee')
WireElm = require('../../src/component/components/WireElm.coffee')
VoltageElm = require('../../src/component/components/VoltageElm.coffee')
ResistorElm = require('../../src/component/components/ResistorElm.coffee')

describe "1V grounded DC Source with 1 ohm grounded resistor", ->
  beforeEach ->
    @Circuit = new Circuit()
    @resistor       = new ResistorElm(300, 100, 300, 200, 0, [50])
    @voltageSource  = new VoltageElm(100, 100, 100, 200, 0, [50])
    @wire           = new WireElm(100, 100, 300, 100, 0)
    @voltageGround  = new GroundElm(100, 200, 100, 250, 0)
    @resGround      = new GroundElm(300, 200, 300, 250, 0)

  it "has correct resistance", ->
    @resistor.resistance.should.equal 50

  it "should calculate current when voltage is applied", ->
    @resistor.getPostCount().should.equal 2
    @resistor.getInternalNodeCount().should.equal 0

  it "has correct dump type", ->
    @resistor.getDumpType().should.equal "r"

  it "should need a remap", ->
    @Circuit.Solver.needsRemap().should.equal true

  it "should all be orphaned", ->
    @wire.orphaned().should.equal true
    @resGround.orphaned().should.equal true
    @voltageGround.orphaned().should.equal true
    @voltageSource.orphaned().should.equal true
    @resistor.orphaned().should.equal true


  describe "after soldering to circuit", ->
    beforeEach ->
      @Circuit.solder(@resistor)
      @Circuit.solder(@voltageSource)
      @Circuit.solder(@wire)
      @Circuit.solder(@voltageGround)
      @Circuit.solder(@resGround)

    it "has 5 elements", ->
      @Circuit.numElements().should.equal 5

    it "has correct elements", ->
      @Circuit.getElements().should.eql [@resistor, @voltageSource, @wire, @voltageGround, @resGround]

    it "is not be orphaned", ->
      @wire.orphaned().should.equal false
      @resGround.orphaned().should.equal false
      @voltageGround.orphaned().should.equal false
      @voltageSource.orphaned().should.equal false
      @resistor.orphaned().should.equal false


    describe "after analyzing circuit", ->
      beforeEach (done) ->
        #@Circuit.Solver.analyzeCircuit()
        done()

      it "is not need remap", ->
        #@Circuit.Solver.needsRemap().should.equal false

      it "has 4 nodes", ->
        #@Circuit.numNodes().should.equal 4

      it "should be linear", ->
        #@Circuit.Solver.circuitNonLinear.should.equal false

      it "has correct elements", ->
        #@Circuit.getElements().toString()


    describe "after updating circuit", ->
      beforeEach ->
        #@Circuit.updateCircuit()

      it "has 5 nodes", ->
        #@Circuit.numNodes().should.equal 7

      it "is not have any bad nodes", ->
        #@Circuit.findBadNodes().length.should.equal 0
