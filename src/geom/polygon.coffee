# <DEFINE>
define ['cs!geom/Point'], (Point) ->
# </DEFINE>

  class Polygon
    constructor: (vertices) ->
      @vertices = []
      if vertices and vertices.length % 2 is 0
        i = 0
        while i < vertices.length
          @addVertex vertices[i], vertices[i + 1]
          i += 2

    addVertex: (x, y) ->
      @vertices.push new Point(x, y)

    getX: (n) ->
      @vertices[n].x

    getY: (n) ->
      @vertices[n].y

    numPoints: ->
      @vertices.length


  return Polygon