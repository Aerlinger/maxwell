# <DEFINE>
define [
  'cs!CapacitorElm',
  'cs!Circuit',
], (
  CapacitorElm,
  Circuit,
) ->
  # </DEFINE>

  describe "Capacitor Component", ->
    beforeEach () ->
      @Circuit = new Circuit()
      @capacitor = new CapacitorElm(100, 100, 100, 200, 0.1, [1e-9, 1.1])

    it "has correct defaults", ->
      @capacitor.capacitance.should.equal 1e-9
      @capacitor.voltDiff.should.equal 1.1

    it "has correct number of posts", ->
      @capacitor.getPostCount().should.equal 2
      @capacitor.getInternalNodeCount().should.equal 0

    it "is not have any internal voltage sources", ->
      @capacitor.getVoltageSourceCount().should.equal 0

    it "has correct dump type", ->
      @capacitor.getDumpType().should.equal "c"

    it "has correct toString()", ->
      @capacitor.toString().should.equal "CapacitorElm"

    it "should be orphaned", ->
      @capacitor.orphaned().should.equal true

    describe "after soldering to circuit", ->

      beforeEach () ->
        @Circuit.solder(@capacitor)

      it "should get voltage correctly", ->
        @capacitor.getVoltageDiff().should.equal 0

      it "is not be orphaned", ->
        @capacitor.orphaned().should.equal false

      it "should be stampable", ->
        @capacitor.stamp(@Circuit.Solver.getStamper())

      it "should be steppable", ->
        @capacitor.doStep(@Circuit.getStamper())

      it "should be drawable", ->
        #@capacitor.draw()

      it "should setPoints", ->
        @capacitor.setPoints()