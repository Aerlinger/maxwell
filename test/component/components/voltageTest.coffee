# <DEFINE>
define [
  'cs!VoltageElm',
  'cs!Circuit',
], (
  VoltageElm,
  Circuit,
) ->
# </DEFINE>



  describe "Voltage Component", ->
    beforeEach () ->
      @Circuit = new Circuit()
      @voltageElm = new VoltageElm(100, 100, 100, 200, 0, [0, 40, 5, 1, 90, .45])


    it "should have correct defaults", ->
      @voltageElm.waveform.should.equal VoltageElm.WF_DC
      @voltageElm.frequency.should.equal 40
      @voltageElm.maxVoltage.should.equal 5
      @voltageElm.bias.should.equal 1
      @voltageElm.phaseShift.should.equal 90
      @voltageElm.dutyCycle.should.equal 0.45

    it "should have correct number of posts", ->
      @voltageElm.getPostCount().should.equal 2
      @voltageElm.getInternalNodeCount().should.equal 0

    it "should not have any internal voltage sources", ->
      @voltageElm.getVoltageSourceCount().should.equal 1

    it "should have correct dump type", ->
      @voltageElm.getDumpType().should.equal "v"

    it "should have correct toString()", ->
      @voltageElm.toString().should.equal "VoltageElm"

    it "should be orphaned", ->
      @voltageElm.orphaned().should.equal true

    describe "after soldering to circuit", ->

      beforeEach () ->
        @Circuit.solder(@voltageElm)

      it "should get voltage correctly", ->
        @voltageElm.getVoltage().should.equal 6

      it "should not be orphaned", ->
        @voltageElm.orphaned().should.equal false

      it "should be stampable", ->
        @voltageElm.stamp()

      it "should be steppable", ->
        @voltageElm.doStep()

      it "should be drawable", ->
        #@voltageElm.draw()

      it "should setPoints", ->
        @voltageElm.setPoints()
