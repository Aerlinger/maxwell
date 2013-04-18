# <DEFINE>
define [], () ->
# </DEFINE>

  class Rectangle
    constructor: (@x = 0, @y = 0, @width = 0, @height = 0) ->

    contains: (x, y) ->
      return (x > @x && x < (@x + @width) && y > @y && (y < @y + @height))

    equals: (otherRect) ->
      if otherRect?
        if( otherRect.x == @x && otherRect.y == @y &&otherRect.width == @width && otherRect.height == @height )
          return true
      return false

    intersects: (otherRect) ->
      topLeftIntersects = @.contains(otherRect.x, otherRect.y)
      topRightIntersects = @.contains(otherRect.x + otherRect.width, otherRect.y)
      bottomRightIntersects = @.contains(otherRect.x + otherRect.width, otherRect.y + otherRect.height)
      bottomLeftIntersects = @.contains(otherRect.x, otherRect.y + otherRect.height);

      return (topLeftIntersects or topRightIntersects or bottomRightIntersects or bottomLeftIntersects)

  return Rectangle