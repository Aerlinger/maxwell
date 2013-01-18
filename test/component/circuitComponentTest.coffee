# <DEFINE>
define [
  'cs!Polygon',
  'cs!Rectangle',
  'cs!Point',
  'cs!CircuitElement',
], (
  Polygon,
  Rectangle,
  Point,
  CircuitElement,
) ->
# </DEFINE>



  describe "Base Circuit Element", ->

    specify "class methods", ->
      CircuitElement.getScopeUnits(1).should.equal "W"
      CircuitElement.getScopeUnits().should.equal "V"


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
        circuitElm = new CircuitElement(0, 3, 0, 4, 5)
        circuitElm.flags.should.equal 5

      specify "should create default parameters", ->
        @circuitElement.current.should.equal 0
        @circuitElement.getCurrent().should.equal 0
        @circuitElement.curcount.should.equal 0
        @circuitElement.noDiagonal.should.equal false
        @circuitElement.selected.should.equal false

      specify "default method return values", ->
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

      it "should have correct dump type", ->
        @circuitElement.dump().should.equal '0 10 10 13 14 0'

      specify "base elements should be linear by default", ->
        @circuitElement.nonLinear().should.equal false
