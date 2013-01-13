# <DEFINE>
define([
], (
) ->
# </DEFINE>


class Context
  constructor: (width, height) ->

  fillCircle: (x, y, radius, lineWidth=1, fillColor='#FFFFFF', lineColor="#000000") ->
    throw("Can't call fillCircle on Context, it is an abstract class.")

  drawThickLine: (x, y, x2, y2, color) ->
    throw("Can't call drawThickline on Context, it is an abstract class.")

  drawThickLinePt: (pa, pb, color) ->
    @drawThickLine pa.x, pa.y, pb.x, pb.y, color

  drawThickPolygon: (xlist, ylist, c, color) ->
    i = 0
    while i < (c.length - 1)
      @drawThickLine xlist[i], ylist[i], xlist[i + 1], ylist[i + 1], color
      ++i
    @drawThickLine xlist[i], ylist[i], xlist[0], ylist[0], color

  drawThickPolygonP: (polygon, color) ->
    numVertices = polygon.numPoints()
    i = 0
    while i < (numVertices - 1)
      @drawThickLine polygon.getX(i), polygon.getY(i), polygon.getX(i + 1), polygon.getY(i + 1), color
      ++i
    @drawThickLine polygon.getX(i), polygon.getY(i), polygon.getX(0), polygon.getY(0), color


module.exports = Context
