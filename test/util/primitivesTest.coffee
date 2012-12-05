{Polygon, Rectangle, Point} = require('../../src/util/shapePrimitives')


describe "Polygon", ->

  it "should create a triangle with 3 pairs of vertices", ->
    poly = new Polygon([0, 0, 1, 1, 2, 3])
    poly.numPoints().should.equal 3
    poly.getX(0).should.equal 0
    poly.getY(0).should.equal 0
    poly.getX(2).should.equal 2
    poly.getY(2).should.equal 3

    poly.addVertex(3, 4)
    poly.numPoints().should.equal 4
    poly.getX(3).should.equal 3
    poly.getY(3).should.equal 4


describe "Point", ->

  it "should default to (0, 0) when no parameters are entered", ->
    point = new Point()
    point.x.should.equal 0
    point.y.should.equal 0

  it "should properly define x and y values", ->
    point = new Point(10, 15)
    point.x.should.equal 10
    point.y.should.equal 15

  describe "Class methods", ->
    it "should be able to instantiate an array of points at (0, 0)", ->
      p1 = new Point()
      Point.toArray(2).toString().should.equal [p1, p1].toString()

    it "should compare two points correctly", ->
      Point.comparePair(3, 5, 3, 5).should.equal true
      Point.comparePair(5, 3, 5, 3).should.equal true

    it "two points at the same coordinates should be equal", ->
      point1 = new Point(3, 5)
      point2 = new Point(3, 5)

      point1.equals(point2).should.equal true


describe "Rectangle", ->

  beforeEach () ->
    @rect = new Rectangle(5, 6, 100, 150)

  it "should properly instantiate a rectangle", ->
    @rect.x.should.equal 5
    @rect.y.should.equal 6
    @rect.width.should.equal 100
    @rect.height.should.equal 150

  it "should equal a rectangle of the same dimension", ->
    congruentRect = new Rectangle(5, 6, 100, 150)
    @rect.equals(congruentRect).should.equal true

  it "should not equal a rectangle of different dimension", ->
    congruentRect = new Rectangle(5, 6, 100, 151)
    @rect.equals(congruentRect).should.equal false

  it "should not be able to detect points on its border", ->
    @rect.contains(5, 6).should.equal false
    @rect.contains(106, 156).should.equal false
    @rect.contains(6, 6).should.equal false

  it "should be able to detect points within its border", ->
    @rect.contains(100, 151).should.equal true
    @rect.contains(75, 75).should.equal true
    @rect.contains(4, 6).should.equal false

  it "should not detect intersections with other rectangles with non-intersecting borders", ->
    inside_intersect = new Rectangle(40, 40, 20, 20)
    tl_intersect = new Rectangle(0, 0, 4, 5)
    tr_intersect = new Rectangle(106, 4, 100, 100)
    bl_intersect = new Rectangle(0, 157, 5, 5)
    br_intersect = new Rectangle(106, 150, 4, 5)

    @rect.intersects(inside_intersect).should.equal true
    @rect.intersects(tl_intersect).should.equal false
    @rect.intersects(tr_intersect).should.equal false
    @rect.intersects(br_intersect).should.equal false
    @rect.intersects(bl_intersect).should.equal false

  it "should detect intersections with other rectangles with intersecting borders", ->
    inside_intersect = new Rectangle(40, 40, 20, 20)
    tl_intersect = new Rectangle(0, 0, 6, 7)
    tr_intersect = new Rectangle(104, 7, 100, 100)
    br_intersect = new Rectangle(104, 154, 5, 5)
    bl_intersect = new Rectangle(0, 155, 7, 6)

    @rect.intersects(inside_intersect).should.equal true
    @rect.intersects(tl_intersect).should.equal true
    @rect.intersects(tr_intersect).should.equal true
    @rect.intersects(br_intersect).should.equal true
    @rect.intersects(bl_intersect).should.equal true