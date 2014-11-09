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

    it "should have correct defaults", ->
      @capacitor.capacitance.should.equal 1e-9
      @capacitor.voltdiff.should.equal 1.1

    it "should have correct number of posts", ->
      @capacitor.getPostCount().should.equal 2
      @capacitor.getInternalNodeCount().should.equal 0

    it "should not have any internal voltage sources", ->
      @capacitor.getVoltageSourceCount().should.equal 0

    it "should have correct dump type", ->
      @capacitor.getDumpType().should.equal "c"

    it "should have correct toString()", ->
      @capacitor.toString().should.equal "Capacitor"

    it "should be orphaned", ->
      @capacitor.orphaned().should.equal true

    describe "after soldering to circuit", ->

      beforeEach () ->
        @Circuit.solder(@capacitor)

      it "should get voltage correctly", ->
        @capacitor.getVoltageDiff().should.equal 0

      it "should not be orphaned", ->
        @capacitor.orphaned().should.equal false

      it "should be stampable", ->
        @capacitor.stamp(@Circuit.Solver.Stamper)

      it "should be steppable", ->
        @capacitor.doStep()

      it "should be drawable", ->
        #@capacitor.draw()

      it "should setPoints", ->
        @capacitor.setPoints()