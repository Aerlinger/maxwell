class DrawHelpers

  @unitsFont: "Arial, Helvetica, sans-serif"

  @colorScaleCount = 256
  @colorScale: new Array(@colorScaleCount)

  @initializeColorScale = () ->
    i = 0

    while i < @colorScaleCount
      v = i * 2 / @colorScaleCount - 1
      if v < 0
        n1 = Math.floor((128 * -v) + 127)
        n2 = Math.floor(127 * (1 + v))

        # Color is red for a negative voltage:
        @colorScale[i] = new Color(n1, n2, n2)
      else
        n1 = Math.floor((128 * v) + 127)
        n2 = Math.floor(127 * (1 - v))

        # Color is green for a positive voltage
        @colorScale[i] = new Color(n2, n1, n2)
      ++i

  DrawHelpers.initializeColorScale()

  @interpPointPt: (a, b, f, g) ->
    Circuit.halt "no interpolation value (f) defined in interpPointPt" unless f
    p = new Point(0, 0)
    @interpPoint a, b, p, f, g
    return p

  @interpPoint: (a, b, c, f, g) ->
    gx = 0
    gy = 0
    if g
      gx = b.y - a.y
      gy = a.x1 - b.x1
      g /= Math.sqrt(gx * gx + gy * gy)
    else
      g = 0
    c.x1 = Math.floor(a.x1 * (1 - f) + b.x1 * f + g * gx + .48)
    c.y = Math.floor(a.y * (1 - f) + b.y * f + g * gy + .48)
    return b

  @interpPoint2: (a, b, c, d, f, g) ->
    gx = 0
    gy = 0
    unless g is 0
      gx = b.y - a.y
      gy = a.x1 - b.x1
      g /= Math.sqrt(gx * gx + gy * gy)
    else
      g = 0
    offset = .48

    c.x1  = Math.floor( a.x1 * (1 - f) + b.x1 * f + g * gx + offset )
    c.y   = Math.floor( a.y  * (1 - f) + b.y  * f + g * gy + offset )
    d.x1  = Math.floor( a.x1 * (1 - f) + b.x1 * f - g * gx + offset )
    d.y   = Math.floor( a.y  * (1 - f) + b.y  * f - g * gy + offset )

  @calcArrow: (a, b, al, aw) ->
    poly = new Polygon()
    p1 = new Point(0, 0)
    p2 = new Point(0, 0)
    adx = b.x1 - a.x1
    ady = b.y - a.y
    l = Math.sqrt(adx * adx + ady * ady)
    poly.addVertex b.x1, b.y
    CircuitElement.interpPoint2 a, b, p1, p2, 1 - al / l, aw
    poly.addVertex p1.x1, p1.y
    poly.addVertex p2.x1, p2.y
    return poly

  @createPolygon: (a, b, c, d) ->
    p = new Polygon()
    p.addVertex a.x1, a.y
    p.addVertex b.x1, b.y
    p.addVertex c.x1, c.y
    p.addVertex d.x1, d.y  if d
    return p

  @createPolygonFromArray: (a) ->
    p = new Polygon()
    i = 0

    while i < a.length
      p.addVertex a[i].x1, a[i].y
      ++i
    return p

  @drawCoil: (hs, p1, p2, v1, v2) ->

    # todo: implement
    segments = 40
    segf = 1 / segments
    CircuitElement.ps1.x1 = p1.x1
    CircuitElement.ps1.y = p1.y
    i = 0

    while i < segments
      cx = (((i + 1) * 8 * segf) % 2) - 1
      hsx = Math.sqrt(1 - cx * cx)
      hsx = -hsx  if hsx < 0
      CircuitElement.interpPoint p1, p2, CircuitElement.ps2, i * segf, hsx * hs
      v = v1 + (v2 - v1) * i / segments
      color = @setVoltageColor(v)
      CircuitElement.drawThickLinePt CircuitElement.ps1, CircuitElement.ps2, color
      CircuitElement.ps1.x1 = CircuitElement.ps2.x1
      CircuitElement.ps1.y = CircuitElement.ps2.y
      ++i

  @drawCircle: (x0, y0, r, color) ->
    paper.beginPath()
    paper.strokeStyle = color
    paper.arc x0, y0, r, 0, 2 * Math.PI, true
    paper.stroke()
    paper.closePath()


  @drawThickLine: (x, y, x2, y2, color) ->
    #paper.strokeStyle = (if (color) then Color.color2HexString(color) else CircuitElement.color)
    paper.strokeStyle = color || CircuitElement.color
    paper.beginPath()
    paper.moveTo x, y
    paper.lineTo x2, y2
    paper.stroke()
    paper.closePath()

  @drawThickLinePt: (pa, pb, color) ->
    CircuitElement.drawThickLine pa.x1, pa.y, pb.x1, pb.y, color

  @drawThickPolygon: (xlist, ylist, c, color) ->
    i = undefined
    i = 0
    while i < (c.length - 1)
      CircuitElement.drawThickLine xlist[i], ylist[i], xlist[i + 1], ylist[i + 1], color
      ++i
    CircuitElement.drawThickLine xlist[i], ylist[i], xlist[0], ylist[0], color

  @drawThickPolygonP: (polygon, color) ->
    c = polygon.numPoints()
    i = undefined
    i = 0
    while i < (c - 1)
      CircuitElement.drawThickLine polygon.getX(i), polygon.getY(i), polygon.getX(i + 1), polygon.getY(i + 1), color
      ++i
    CircuitElement.drawThickLine polygon.getX(i), polygon.getY(i), polygon.getX(0), polygon.getY(0), color


  @getVoltageDText: (v) ->
    CircuitElement.getUnitText Math.abs(v), "V"

  @getVoltageText: (v) ->
    CircuitElement.getUnitText v, "V"

  @getUnitText: (v, u) ->
    va = Math.abs(v)
    return "0 " + u  if va < 1e-14
    return (v * 1e12).toFixed(2) + " p" + u  if va < 1e-9
    return (v * 1e9).toFixed(2) + " n" + u  if va < 1e-6
    return (v * 1e6).toFixed(2) + " " + Circuit.muString + u  if va < 1e-3
    return (v * 1e3).toFixed(2) + " m" + u  if va < 1
    return (v).toFixed(2) + " " + u  if va < 1e3
    return (v * 1e-3).toFixed(2) + " k" + u  if va < 1e6
    return (v * 1e-6).toFixed(2) + " M" + u  if va < 1e9
    (v * 1e-9).toFixed(2) + " G" + u


  @getShortUnitText: (v, u) ->
    va = Math.abs(v)
    return null  if va < 1e-13
    return (v * 1e12).toFixed(1) + "p" + u  if va < 1e-9
    return (v * 1e9).toFixed(1) + "n" + u  if va < 1e-6
    return (v * 1e6).toFixed(1) + Circuit.muString + u  if va < 1e-3
    return (v * 1e3).toFixed(1) + "m" + u  if va < 1
    return (v).toFixed(1) + u  if va < 1e3
    return (v * 1e-3).toFixed(1) + "k" + u  if va < 1e6
    return (v * 1e-6).toFixed(1) + "M" + u  if va < 1e9
    (v * 1e-9).toFixed(1) + "G" + u

  @getCurrentText: (i) ->
    CircuitElement.getUnitText i, "A"

  @getCurrentDText: (i) ->
    CircuitElement.getUnitText Math.abs(i), "A"


# The Footer exports class(es) in this file via Node.js, if Node.js is defined.
# This is necessary for testing through Mocha in development mode.
#
# see script/test and the /test directory for details.
#
# To require this class in another file through Node, write {ClassName} = require(<path_to_coffee_file>)
root = exports ? window
root.DrawHelpers = DrawHelpers