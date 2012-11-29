CircuitElement = require('../../src/component/circuitElement')
{Polygon, Rectangle, Point} = require('../../src/util/shapePrimitives')

describe "Base Circuit Element", ->

  beforeEach () ->
    @circuitElement = new CircuitElement(10, 10, 13, 14)

  describe "can instantiate a new Circuit Element", ->

    specify "with correct position", ->
      @circuitElement.x1.should.equal 10
      @circuitElement.y1.should.equal 10
      @circuitElement.x2.should.equal 13
      @circuitElement.y2.should.equal 14

    specify "without flags passed as an argument", ->
      @circuitElement.flags.should.equal 0

    specify "without flags passed as an argument", ->
      circuitElm = new CircuitElement(0, 0, 0, 0, 5)
      circuitElm.flags.should.equal 5

    specify "should create default parameters", ->
      @circuitElement.point1.equals(new Point(50, 100)).should.equal true
      @circuitElement.point2.equals(new Point(50, 150)).should.equal true
      @circuitElement.lead1.equals(new Point(0, 100)).should.equal true
      @circuitElement.lead2.equals(new Point(0, 150)).should.equal true

      @circuitElement.getPostCount().should.equal 2

      #@circuitElement.volts.toString().should.equal [0, 0].toString()

      @circuitElement.current.should.equal 0
      @circuitElement.getCurrent().should.equal 0
      @circuitElement.curcount.should.equal 0
      @circuitElement.noDiagonal.should.equal false
      @circuitElement.selected.should.equal false

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

    it "should have correct dump type", ->
      @circuitElement.dump().should.equal '0 10 10 13 14 0'

    specify "base elements should be linear by default", ->
      @circuitElement.nonlinear().should.equal false
