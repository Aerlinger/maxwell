# <DEFINE>
define [
  'cs!WireElm',
  'cs!Circuit',
], (
  WireElm,
  Circuit,
) ->
# </DEFINE>



  describe "WireElm", ->
    beforeEach () ->
      @Circuit = new Circuit()
      @wireElm = new WireElm(100, 100, 100, 200, 0, [])


    it "should have correct defaults", ->
      @wireElm.x1 == 100
      @wireElm.y1 == 100
      @wireElm.x2 == 100
      @wireElm.y2 == 200
      @wireElm.flags = 0

    it "should have correct number of posts", ->
      @wireElm.getPostCount().should.equal 2
      @wireElm.getInternalNodeCount().should.equal 0

    it "should not have any internal voltage sources", ->
      @wireElm.getVoltageSourceCount().should.equal 1

    it "should have correct dump type", ->
      @wireElm.getDumpType().should.equal "w"

    it "should have correct toString()", ->
      @wireElm.toString().should.equal "WireElm"

    it "should be orphaned", ->
      @wireElm.orphaned().should.equal true

    describe "after soldering to circuit", ->
      beforeEach () ->
        @Circuit.solder(@wireElm)

      it "should not be orphaned", ->
        @wireElm.orphaned().should.equal false

      it "should be stampable", ->
        @wireElm.stamp()

      it "should be steppable", ->
        @wireElm.doStep()

      it "should be drawable", ->
        #@wireElm.draw()

      it "should setPoints", ->
        @wireElm.setPoints()
