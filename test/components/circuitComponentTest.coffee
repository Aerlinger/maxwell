Polygon = require("../../src/geom/polygon.js")
Rectangle = require("../../src/geom/rectangle.js")
Point = require("../../src/geom/point.js")
CircuitComponent = require("../../src/circuit/circuitComponent.js")

Circuit = require('../../src/circuit/circuit.js')

Renderer = require("../../src/render/renderer.js")
fs = require('fs')
Canvas = require('canvas')

describe "Base Circuit Component", ->
  beforeEach ->
    @Circuit = new Circuit()
    @circuitElement = new CircuitComponent(10, 10, 13, 14)

  describe "after instantiating a new Circuit Component", ->
    it "has correct initial position", ->
      @circuitElement.x1().should.equal 10
      @circuitElement.y1().should.equal 10
      @circuitElement.x2().should.equal 13
      @circuitElement.y2().should.equal 14

    it "has correct dx and dy", ->
      @circuitElement.dx().should.eq 3
      @circuitElement.dy().should.eq 4
      @circuitElement.dn().should.eq 5

    it "has component_id", ->
      @circuitElement.component_id > 0

    it "equals itself", ->
      @circuitElement.equalTo(@circuitElement).should.equal true

    it "is not equal another component", ->
      @circuitElement.equalTo(new CircuitComponent()).should.equal false

    it "creates default parameters", ->
      @circuitElement.current.should.equal 0
      @circuitElement.getCurrent().should.equal 0
      @circuitElement.noDiagonal.should.equal false

    it "default method return values", ->
      @circuitElement.getPostCount().should.equal 2
      @circuitElement.isWire().should.equal false
      @circuitElement.hasGroundConnection().should.equal false
      @circuitElement.needsShortcut().should.equal false
      @circuitElement.canViewInScope().should.equal true

    it "allocates nodes", ->
      @circuitElement.nodes.toString().should.equal [0, 0].toString()
      @circuitElement.volts.toString().should.equal [0, 0].toString()

    it "sets points", ->
      x1 = @circuitElement.x1()
      y1 = @circuitElement.y1()
      x2 = @circuitElement.x2()
      y2 = @circuitElement.y2()

      @circuitElement.setPoints()
      @circuitElement.dx().should.equal 3
      @circuitElement.dy().should.equal 4
      @circuitElement.dn().should.equal 5

      @circuitElement.dpx1().should.equal (4/5)
      @circuitElement.dpy1().should.equal -(3/5)
      @circuitElement.dsign().should.equal 1

      @circuitElement.point1.equals( new Point(x1, y1) ).should.equal true
      @circuitElement.point2.equals( new Point(x2, y2) ).should.equal true

    it "sets bounding box", ->
      bBox = @circuitElement.boundingBox
      bBox.x.should.equal 10
      bBox.y.should.equal 10
      bBox.width.should.equal 3
      bBox.height.should.equal 4

    it "Has 0 current at its terminals", ->
      @circuitElement.getCurrent().should.equal 0

    it "Has 0 power", ->
      @circuitElement.getPower().should.equal 0

    it "Has the correct number of posts", ->
      @circuitElement.getPostCount().should.equal 2

    it "Has no internal nodes", ->
      expect(@circuitElement.getInternalNodeCount()).to.equal 0

#    it "has correct dump type", ->
#      @circuitElement.dump().should.equal '0 10 10 13 14 0'

    specify "base elements should be linear by default", ->
      @circuitElement.nonLinear().should.equal false

    describe "after soldering to circuit", ->
      beforeEach ->
        @Circuit.solder(@circuitElement)

      it "is not be orphaned", ->
        @circuitElement.orphaned().should.equal false

      it "belongs to @Circuit", ->
        @Circuit.getElmByIdx(0) == @circuitElement

      it "belongs to @Circuit", ->
        @Circuit.numElements() == 1

      describe "then destroying the component", ->
        beforeEach ->
          @circuitElement.destroy()

        it.skip "is orphaned", ->
          @circuitElement.orphaned().should.equal true

        it "no longer belongs to @Circuit", ->
          @Circuit.getElmByIdx(0) == null

        it.skip "belongs to @Circuit", ->
          @Circuit.numElements().should.equal 0

      describe "then desoldering the component", ->
        beforeEach ->
          @Circuit.desolder(@circuitElement)

        it.skip "is orphaned", ->
          @circuitElement.orphaned().should.equal true

        it "no longer belongs to @Circuit", ->
          @Circuit.getElmByIdx(0) == null

        it.skip "belongs to @Circuit", ->
          @Circuit.numElements().should.equal 0


  describe "Rendering", ->
    before (done) ->
      @Circuit = new Circuit("BasicComponent")
      @circuitElement = new CircuitComponent(50, 50, 50, 150)

      Canvas = require('canvas')
      @canvas = new Canvas(200, 200)
      ctx = @canvas.getContext('2d')

      @Circuit.clearAndReset()
      @Circuit.solder(@circuitElement)

      @renderer = new Renderer(@Circuit, @canvas)
      @renderer.context = ctx
      done()

