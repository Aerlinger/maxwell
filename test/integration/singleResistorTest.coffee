# <DEFINE>
define [
  'cs!ResistorElm',
  'cs!GroundElm',
  'cs!WireElm',
  'cs!VoltageElm',
  'cs!Circuit',
], (
  ResistorElm,
  GroundElm,
  WireElm,
  VoltageElm,
  Circuit,
) ->
# </DEFINE>


  describe "1V grounded DC Source with 1 ohm grounded resistor", ->
  
    beforeEach () ->
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
        @Circuit.updateCircuit()
        done()

      it "is not need remap", ->
        @Circuit.Solver.analyzeFlag.should.equal false

      it "has 4 nodes", ->
        @Circuit.numNodes().should.equal 4

      it "should be linear", ->
        @Circuit.Solver.circuitNonLinear.should.equal false

      it "has correct elements", ->
        @Circuit.getElements().toString()


    describe "after updating circuit", ->
      beforeEach () ->
        @Circuit.updateCircuit()

      it "has 5 nodes", ->
        @Circuit.numNodes().should.equal 7

      it "is not have any bad nodes", ->
        @Circuit.findBadNodes().length.should.equal 0
