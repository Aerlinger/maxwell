Circuit = require('../../src/circuit/circuit.js')
GroundElm = require('../../src/circuit/components/GroundElm.js')
WireElm = require('../../src/circuit/components/WireElm.js')
VoltageElm = require('../../src/circuit/components/VoltageElm.js')
ResistorElm = require('../../src/circuit/components/ResistorElm.js')

describe "1V grounded DC Source with 1 ohm grounded resistor", ->
  beforeEach ->
    @Circuit = new Circuit()
    @resistor       = new ResistorElm(300, 100, 300, 200, [50])
    @voltageSource  = new VoltageElm(100, 100, 100, 200, [50])
    @wire           = new WireElm(100, 100, 300, 100)
    @voltageGround  = new GroundElm(100, 200, 100, 250)
    @resGround      = new GroundElm(300, 200, 300, 250)

  it "has correct resistance", ->
    @resistor.resistance.should.equal 50

  it "calculates current when voltage is applied", ->
    @resistor.getPostCount().should.equal 2
    @resistor.getInternalNodeCount().should.equal 0

  it "has correct dump type", ->
    @resistor.getDumpType().should.equal "r"

  it "needs a remap", ->
    @Circuit.Solver.analyzeFlag.should.equal true

  it "has all orphaned components", ->
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
        @Circuit.Solver.reconstruct()
        done()

      it "does not need remap", ->
        @Circuit.Solver.analyzeFlag.should.equal false

      it "has 4 nodes", ->
        @Circuit.numNodes().should.equal 5

      it "is linear", ->
        @Circuit.Solver.circuitNonLinear.should.equal false

      it "has correct elements", ->
        @Circuit.getElements().toString()


    describe "after updating circuit", ->
      beforeEach ->
        @Circuit.updateCircuit()

      it "has 5 nodes", ->
        @Circuit.numNodes().should.equal 5

      it "is not have any bad nodes", ->
        @Circuit.findBadNodes().length.should.equal 0
