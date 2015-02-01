class Rectangle
  constructor: (@x, @y, @width, @height) ->

  contains: (x, y) ->
    return (x >= @x && x <= (@x + @width) && y >= @y && (y <= @y + @height))

  equals: (otherRect) ->
    if otherRect?
      if( otherRect.x == @x && otherRect.y == @y && otherRect.width == @width && otherRect.height == @height )
        return true
    return false

  intersects: (otherRect) ->
    @x2 = @x + @width
    @y2 = @y + @height

    otherX = otherRect.x
    otherY = otherRect.y
    otherX2 = otherRect.x + otherRect.width
    otherY2 = otherRect.y + otherRect.height

    @x < otherX2 && @x2 > otherX && @y < otherY2 && @y2 > otherY

  collidesWithComponent: (circuitComponent) ->
    @intersects(circuitComponent.getBoundingBox())

  toString: ->
    "(#{@x}, #{@y}) [w: #{@width}, h: #{@height}]"

module.exports = Rectangle
