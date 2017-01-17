describe "Polygon", ->

  it "can create a triangle with 3 pairs of vertices", ->
    poly = new Polygon([0, 0, 1, 1, 2, 3])
    expect(poly.numPoints()).to.equal 3
    expect(poly.getX(0)).to.equal 0
    expect(poly.getY(0)).to.equal 0
    expect(poly.getX(2)).to.equal 2
    expect(poly.getY(2)).to.equal 3

    poly.addVertex(3, 4)
    expect(poly.numPoints()).to.equal 4
    expect(poly.getX(3)).to.equal 3
    expect(poly.getY(3)).to.equal 4


describe "Point", ->

  it "defaults to (undefined, undefined) when no parameters are entered", ->
    point = new Point()
    expect(point.x).to.equal undefined
    expect(point.y).to.equal undefined

  it "properly defines x and y values", ->
    point = new Point(10, 15)
    expect(point.x).to.equal 10
    expect(point.y).to.equal 15

  describe "Class methods", ->
    it "is able to instantiate an array of points at (0, 0)", ->
      p1 = new Point(0, 0)
      expect(Point.toArray(2).toString()).to.equal [p1, p1].toString()

    it "two points at the same coordinates should be equal", ->
      point1 = new Point(3, 5)
      point2 = new Point(3, 5)

      expect(point1.equals(point2)).to.equal true


describe "Rectangle", ->
  beforeEach ->
    @rect = new Rectangle(5, 6, 100, 150)

  it "properly instantiates a rectangle", ->
    expect(@rect.x).to.equal 5
    expect(@rect.y).to.equal 6
    expect(@rect.width).to.equal 100
    expect(@rect.height).to.equal 150

  it "equals a rectangle of the same dimension", ->
    congruentRect = new Rectangle(5, 6, 100, 150)
    expect(@rect.equals(congruentRect)).to.equal true

  it "is not equal a rectangle of different dimension", ->
    congruentRect = new Rectangle(5, 6, 100, 151)
    expect(@rect.equals(congruentRect)).to.equal false

  it "is not be able to detect points on its border", ->
    expect(@rect.contains(5, 6)).to.equal true
    expect(@rect.contains(106, 156)).to.equal false
    expect(@rect.contains(6, 6)).to.equal true

  it "is able to detect points within its border", ->
    expect(@rect.contains(100, 151)).to.equal true
    expect(@rect.contains(75, 75)).to.equal true
    expect(@rect.contains(4, 6)).to.equal false

  it "is not detect intersections with other rectangles with non-intersecting borders", ->
    inside_intersect = new Rectangle(40, 40, 20, 20)
    tl_intersect = new Rectangle(0, 0, 4, 5)
    tr_intersect = new Rectangle(106, 4, 100, 100)
    bl_intersect = new Rectangle(0, 157, 5, 5)
    br_intersect = new Rectangle(106, 150, 4, 5)

    expect(@rect.intersects(inside_intersect)).to.equal true
    expect(@rect.intersects(tl_intersect)).to.equal false
    expect(@rect.intersects(tr_intersect)).to.equal false
    expect(@rect.intersects(br_intersect)).to.equal false
    expect(@rect.intersects(bl_intersect)).to.equal false

  xit "detects intersections with other rectangles with intersecting borders", ->
    inside_intersect = new Rectangle(40, 40, 20, 20)
    tl_intersect = new Rectangle(0, 0, 6, 7)
    tr_intersect = new Rectangle(104, 7, 100, 100)
    br_intersect = new Rectangle(104, 154, 5, 5)
    bl_intersect = new Rectangle(0, 155, 7, 6)

    expect(@rect.intersects(inside_intersect)).to.equal true
    expect(@rect.intersects(tl_intersect)).to.equal true
    expect(@rect.intersects(tr_intersect)).to.equal true
    expect(@rect.intersects(br_intersect)).to.equal true
    expect(@rect.intersects(bl_intersect)).to.equal true
