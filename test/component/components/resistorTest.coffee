Circuit = require('../../../src/circuit/circuit.coffee')
ResistorElm = require('../../../src/circuit/components/ResistorElm.coffee')

describe "Resistor", ->
  beforeEach ->
    @Circuit = new Circuit()
    @resistor = new ResistorElm(100, 300, 100, 200, 0, [50])

  it "has correct resistance", ->
    @resistor.resistance.should.equal 50

  it "is not have any internal voltage sources", ->
    @resistor.getVoltageSourceCount().should.equal 0

  it "calculates current when voltage is applied", ->
    @resistor.getPostCount().should.equal 2
    @resistor.getInternalNodeCount().should.equal 0

  it "has correct dump type", ->
    @resistor.getDumpType().should.equal "r"

  it "is orphaned", ->
    @resistor.orphaned().should.equal true

  it "has correct initial position", ->
    @resistor.point1.x.should.eq 100
    @resistor.point1.y.should.eq 300
    @resistor.point2.x.should.eq 100
    @resistor.point2.y.should.eq 200

  it "has correct initial values", ->
    @resistor.current.should.eq 0
#      @resistor.curcount.should.eq 5
    @resistor.noDiagonal = false
    @resistor.dragging = false
    @resistor.parentCircuit = null

  it "has correct sign (orientation)", ->
    @resistor.dsign.should.eq -1

  it "has correct dx and dy", ->
    @resistor.dx.should.eq 0
    @resistor.dy.should.eq -100
    @resistor.dn.should.eq 100

  it "has correct bounding box", ->
    @resistor.boundingBox.x.should.equal 100
    @resistor.boundingBox.y.should.equal 200
    @resistor.boundingBox.width.should.equal 1
    @resistor.boundingBox.height.should.equal 101

  it "has correct initial position", ->
    @resistor.flags.should.equal 0

  it "Has 0 voltage at its terminals", ->
    @resistor.getPostVoltage(0).should.equal 0
    @resistor.getPostVoltage(1).should.equal 0
    @resistor.getVoltageDiff().should.equal 0

  it "Has 0 current at its terminals", ->
    @resistor.getCurrent().should.equal 0

  it "Has 0 power", ->
    @resistor.getPower().should.equal 0

  it "Has the correct number of posts", ->
    @resistor.getPostCount().should.equal 2

  it "Has no internal nodes", ->
    @resistor.getInternalNodeCount().should.equal 0


  describe "after soldering to circuit", ->
    beforeEach ->
      @Circuit.solder(@resistor)

    it "is not be orphaned", ->
      @resistor.orphaned().should.equal false

    it "should be stampable", ->
      @resistor.stamp(@Circuit.Solver.Stamper)

    it "belongs to @Circuit", ->
      @Circuit.getElmByIdx(0) == @resistor

    it "belongs to @Circuit", ->
      @Circuit.numElements() == 1

    it "has two unconnected nodes", ->
      @Circuit.updateCircuit()
      @Circuit.findBadNodes().should == []

    it "has two unconnected nodes", ->
      @Circuit.updateCircuit()
      @Circuit.numNodes().should == 2

    describe "then destroying the resistor", ->
      beforeEach ->
        @resistor.destroy()

      it "is orphaned", ->
        @resistor.orphaned().should.equal true

      it "no longer belongs to @Circuit", ->
        @Circuit.getElmByIdx(0) == null

      it "belongs to @Circuit", ->
        @Circuit.numElements().should.equal 0

    describe "then desoldering the resistor", ->
      beforeEach ->
        @Circuit.desolder(@resistor)

      it "is orphaned", ->
        @resistor.orphaned().should.equal true

      it "no longer belongs to @Circuit", ->
        @Circuit.getElmByIdx(0) == null

      it "belongs to @Circuit", ->
        @Circuit.numElements().should.equal 0
