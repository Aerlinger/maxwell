{Polygon, Rectangle, Point} = require('shapePrimitives.coffee')

class DrawHelpers

  @ps1: new Point(0, 0)
  @ps2: new Point(0, 0)

  @unitsFont: "Arial, Helvetica, sans-serif"

  @interpPointPt: (a, b, f, g) ->
    printStackTrace() unless f
    newPoint = new Point(0, 0)
    @interpPoint a, b, newPoint, f, g
    return newPoint

  @interpPoint: (a, b, c, f, g) ->
    gx = 0
    gy = 0
    if g
      gx = b.y - a.y
      gy = a.x - b.x
      g /= Math.sqrt(gx * gx + gy * gy)
    else
      g = 0
    c.x = Math.floor a.x * (1 - f) + b.x * f + g * gx + 0.48
    c.y = Math.floor a.y * (1 - f) + b.y * f + g * gy + 0.48
    return b

  @interpPoint2: (a, b, c, d, f, g) ->
    gx = 0
    gy = 0
    unless g is 0
      gx = b.y - a.y
      gy = a.x - b.x
      g /= Math.sqrt(gx * gx + gy * gy)
    else
      g = 0
    offset = 0.48

    c.x  = Math.floor a.x * (1 - f) + b.x * f + g * gx + offset
    c.y   = Math.floor a.y  * (1 - f) + b.y  * f + g * gy + offset
    d.x  = Math.floor a.x * (1 - f) + b.x * f - g * gx + offset
    d.y   = Math.floor a.y  * (1 - f) + b.y  * f - g * gy + offset

  @calcArrow: (a, b, al, aw) ->
    poly = new Polygon()
    p1 = new Point(0, 0)
    p2 = new Point(0, 0)
    adx = b.x - a.x
    ady = b.y - a.y
    l = Math.sqrt(adx * adx + ady * ady)
    poly.addVertex b.x, b.y
    @.interpPoint2 a, b, p1, p2, 1 - al / l, aw
    poly.addVertex p1.x, p1.y
    poly.addVertex p2.x, p2.y
    return poly

  @createPolygon: (a, b, c, d) ->
    newPoly = new Polygon()
    newPoly.addVertex a.x, a.y
    newPoly.addVertex b.x, b.y
    newPoly.addVertex c.x, c.y
    newPoly.addVertex d.x, d.y  if d
    return newPoly

  @createPolygonFromArray: (vertexArray) ->
    newPoly = new Polygon()
    for vertex in vertexArray
      newPoly.addVertex vertex.x, vertex.y

    return newPoly

  @drawCoil: (hs, p1, p2, v1, v2) ->

    # todo: implement
    segments = 40
    segf = 1 / segments
    @ps1.x = p1.x
    @ps1.y = p1.y

    i = 0
    while i < segments
      cx = (((i + 1) * 8 * segf) % 2) - 1
      hsx = Math.sqrt(1 - cx * cx)
      hsx = -hsx  if hsx < 0
      @.interpPoint p1, p2, @ps2, i * segf, hsx * hs
      v = v1 + (v2 - v1) * i / segments
      color = @setVoltageColor(v)
      @.drawThickLinePt @ps1, @ps2, color
      @ps1.x = @ps2.x
      @ps1.y = @ps2.y
      ++i

  @drawCircle: (x0, y0, r, color) ->
    paper.beginPath()
    paper.strokeStyle = color
    paper.arc x0, y0, r, 0, 2 * Math.PI, true
    paper.stroke()
    paper.closePath()


  @drawThickLine: (x, y, x2, y2, color) ->
    #paper.strokeStyle = (if (color) then Color.color2HexString(color) else CircuitElement.color)
#    paper.strokeStyle = color || Settings.color
#    paper.beginPath()
#    paper.moveTo x, y
#    paper.lineTo x2, y2
#    paper.stroke()
#    paper.closePath()

  @drawThickLinePt: (pa, pb, color) ->
    @.drawThickLine pa.x, pa.y, pb.x, pb.y, color

  @drawThickPolygon: (xlist, ylist, c, color) ->
    i = 0
    while i < (c.length - 1)
      @.drawThickLine xlist[i], ylist[i], xlist[i + 1], ylist[i + 1], color
      ++i
    @.drawThickLine xlist[i], ylist[i], xlist[0], ylist[0], color

  @drawThickPolygonP: (polygon, color) ->
    numVertices = polygon.numPoints()

    i = 0
    while i < (numVertices - 1)
      @.drawThickLine polygon.getX(i), polygon.getY(i), polygon.getX(i + 1), polygon.getY(i + 1), color
      ++i
    @.drawThickLine polygon.getX(i), polygon.getY(i), polygon.getX(0), polygon.getY(0), color


  @getVoltageDText: (v) ->
    getUnitText Math.abs(v), "V"

  @getVoltageText: (v) ->
    getUnitText v, "V"

  @getCurrentText: (i) ->
    getUnitText i, "A"

  @getCurrentDText: (i) ->
    getUnitText Math.abs(i), "A"


# The Footer exports class(es) in this file via Node.js, if Node.js is defined.
# This is necessary for testing through Mocha in development mode.
#
# see script/test and the /test directory for details.
#
# To require this class in another file through Node, write {ClassName} = require(<path_to_coffee_file>)
root = module.exports ? window
module.exports = DrawHelpers