# <DEFINE>
define [], () ->
# </DEFINE>


  class Point
    constructor: (@x = 0, @y = 0) ->

    equals: (otherPoint) ->
      (@x is otherPoint.x and @y is otherPoint.y)

    @toArray: (num) ->
      (new Point(0, 0) for i in Array(num))

    @comparePair: (x1, x2, y1, y2) ->
      (x1 is y1 and x2 is y2) or (x1 is y2 and x2 is y1)

    @distanceSq: (x1, y1, x2, y2) ->
      x2 -= x1
      y2 -= y1
      x2 * x2 + y2 * y2

  return Point