class Geom

  @distanceSq: (x1, y1, x2, y2) ->
    x2 -= x1
    y2 -= y1
    x2 * x2 + y2 * y2


class Point
  constructor: (@x = 0, @y = 0) ->

  @toArray: (num) ->
    Point(0, 0) for i in [1..num]


class Rectangle
  constructor: (@x = 0, @y = 0, @width = 0, @height = 0) ->

  contains: (x, y) ->
    if (x > @x && x < (@x + @width) && y > @y && (y < @y + @height))
      true
    else
      false
      
  equals: (otherRect) ->
    if otherRect?
      if( otherRect.x == @x && otherRect.y == @y &&otherRect.width == @width && otherRect.height == @height )
        return true

    return false


  intersects: (otherRect) ->
    topLeftIntersects = @.contains(otherRect.x, otherRect.y)
    topRightIntersects = @.contains(otherRect.x+otherRect.width, otherRect.y)
    bottomRightIntersects = @.contains(otherRect.x + otherRect.width, otherRect.y+otherRect.height)
    bottomLeftIntersects = @.contains(otherRect.x, otherRect.y+otherRect.height);

    return (topLeftIntersects or topRightIntersects or bottomRightIntersects or bottomLeftIntersects)


class Polygon

  constructor: (@vertices) ->

    if @vertices and @vertices.length % 2 is 0
      i = 0

      while i < vertices.length
        @addVertex vertices[i], vertices[i + 1]
        i += 2

  addVertex: (x, y) ->
    @vertices.push new Point(x, y)

  getX: (n) ->
    @vertices[n].x1

  getY: (n) ->
    @vertices[n].y

  numPoints: ->
    @vertices.length


# Footer to allow this class to be exported via node.js. This allows this class to be required by Mocha for testing
# This should be present at the bottom of every file in order to be read through Mocha.
root = exports ? window
root.Polygon    = Polygon
root.Rectangle  = Rectangle
root.Point      = Point
root.Geom       = Geom