Polygon = require("../../src/geom/polygon.coffee")
Rectangle = require("../../src/geom/rectangle.coffee")
Point = require("../../src/geom/point.coffee")
CircuitComponent = require("../../src/circuit/circuitComponent.coffee")
Circuit = require("../../src/circuit/circuit.coffee")

Circuit = require('../../src/circuit/circuit.coffee')

describe "Base Circuit Component", ->
  beforeEach ->
    @Circuit = new Circuit()
    @circuitElement = new CircuitComponent(10, 10, 13, 14)

  specify "class methods", ->
    CircuitComponent.getScopeUnits(1).should.equal "W"
    CircuitComponent.getScopeUnits().should.equal "V"

  describe "after instantiating a new Circuit Component", ->
    it "has correct initial position", ->
      @circuitElement.x1.should.equal 10
      @circuitElement.y1.should.equal 10
      @circuitElement.x2.should.equal 13
      @circuitElement.y2.should.equal 14

    it "has correct dx and dy", ->
      @circuitElement.dx.should.eq 3
      @circuitElement.dy.should.eq 4
      @circuitElement.dn.should.eq 5

    it "had default flag", ->
      @circuitElement.flags.should.equal 0

    it "has flag passed as an argument", ->
      circuitElm = new CircuitComponent(0, 3, 0, 4, 0)
      circuitElm.flags.should.equal 0

    it "has component_id", ->
      @circuitElement.component_id > 0

    it "should equal itself", ->
      @circuitElement.equal_to(@circuitElement).should.equal true


    it "is not equal another component", ->
      @circuitElement.equal_to(new CircuitComponent()).should.equal false

    it "creates default parameters", ->
      @circuitElement.current.should.equal 0
      @circuitElement.getCurrent().should.equal 0
      @circuitElement.noDiagonal.should.equal false
      @circuitElement.selected.should.equal false

    it "default method return values", ->
      @circuitElement.getPostCount().should.equal 2
      @circuitElement.isSelected().should.equal false
      @circuitElement.isWire().should.equal false
      @circuitElement.hasGroundConnection().should.equal false
      @circuitElement.needsHighlight().should.equal false
      @circuitElement.needsShortcut().should.equal false
      @circuitElement.canViewInScope().should.equal true

    it "should allocate nodes", ->
      @circuitElement.nodes.toString().should.equal [0, 0].toString()
      @circuitElement.volts.toString().should.equal [0, 0].toString()

    it "should set points", ->
      x1 = @circuitElement.x1
      y1 = @circuitElement.y1
      x2 = @circuitElement.x2
      y2 = @circuitElement.y2

      @circuitElement.setPoints()
      @circuitElement.dx.should.equal 3
      @circuitElement.dy.should.equal 4
      @circuitElement.dn.should.equal 5

      @circuitElement.dpx1.should.equal (4/5)
      @circuitElement.dpy1.should.equal -(3/5)
      @circuitElement.dsign.should.equal 1

      @circuitElement.point1.equals( new Point(x1, y1) ).should.equal true
      @circuitElement.point2.equals( new Point(x2, y2) ).should.equal true

    it "should set bounding box", ->
      bBox = @circuitElement.boundingBox
      bBox.x.should.equal 10
      bBox.y.should.equal 10
      bBox.width.should.equal 4
      bBox.height.should.equal 5

    it "Has 0 current at its terminals", ->
      @circuitElement.getCurrent().should.equal 0

    it "Has 0 power", ->
      @circuitElement.getPower().should.equal 0

    it "Has the correct number of posts", ->
      @circuitElement.getPostCount().should.equal 2

    it "Has no internal nodes", ->
      @circuitElement.getInternalNodeCount().should.equal 0

    it "has correct dump type", ->
      @circuitElement.dump().should.equal '0 10 10 13 14 0'

    specify "base elements should be linear by default", ->
      @circuitElement.nonLinear().should.equal false

    describe "after soldering to circuit", ->
      beforeEach ->
        @Circuit.solder(@circuitElement)

      it "is not be orphaned", ->
        @circuitElement.orphaned().should.equal false

      it "is stampable", ->
#          try {
#            @circuitElement.stamp(@Circuit.Solver.Stamper)
#          } catch() {}

      it "belongs to @Circuit", ->
        @Circuit.getElmByIdx(0) == @circuitElement

      it "belongs to @Circuit", ->
        @Circuit.numElements() == 1

      describe "then destroying the component", ->
        beforeEach ->
          @circuitElement.destroy()

        it "is orphaned", ->
          @circuitElement.orphaned().should.equal true

        it "no longer belongs to @Circuit", ->
          @Circuit.getElmByIdx(0) == null

        it "belongs to @Circuit", ->
          @Circuit.numElements().should.equal 0

      describe "then desoldering the component", ->
        beforeEach ->
          @Circuit.desolder(@circuitElement)

        it "is orphaned", ->
          @circuitElement.orphaned().should.equal true

        it "no longer belongs to @Circuit", ->
          @Circuit.getElmByIdx(0) == null

        it "belongs to @Circuit", ->
          @Circuit.numElements().should.equal 0


  describe "Should listen for", ->
    specify "onDraw(Context)", ->
