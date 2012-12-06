{Polygon, Rectangle, Point} = require('./../util/shapePrimitives')
Settings = require('../settings/settings')

class DrawHelper

  @ps1: new Point(0, 0)
  @ps2: new Point(0, 0)

  @colorScaleCount = 32
  @colorScale = []

  # Creates the color scale
  @initializeColorScale: ->
    @colorScale = new Array(@colorScaleCount)

    for i in [0...@colorScaleCount]
      v = i * 2 / @colorScaleCount - 1
      if v < 0
        n1 = Math.floor (128 * -v) + 127
        n2 = Math.floor 127 * (1 + v)

        # Color is red for a negative voltage:
        @colorScale[i] = new Color(n1, n2, n2)
      else
        n1 = Math.floor (128 * v) + 127
        n2 = Math.floor 127 * (1 - v)

        # Color is green for a positive voltage
        @colorScale[i] = new Color(n2, n1, n2)

  @scale: ->
    [ "#ff0000", "#f70707", "#ef0f0f", "#e71717", "#df1f1f", "#d72727", "#cf2f2f", "#c73737",
      "#bf3f3f", "#b74747", "#af4f4f", "#a75757", "#9f5f5f", "#976767", "#8f6f6f", "#877777",
      "#7f7f7f", "#778777", "#6f8f6f", "#679767", "#5f9f5f", "#57a757", "#4faf4f", "#47b747",
      "#3fbf3f", "#37c737", "#2fcf2f", "#27d727", "#1fdf1f", "#17e717", "#0fef0f", "#07f707", "#00ff00" ]

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

    segments = 40
    segf = 1 / segments
    @ps1.x = p1.x
    @ps1.y = p1.y

    i = 0
    while i < segments
      cx = (((i + 1) * 8 * segf) % 2) - 1
      hsx = Math.sqrt(1 - cx * cx)
      hsx = -hsx if hsx < 0
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


  @getVoltageDText: (v) ->
    getUnitText Math.abs(v), "V"

  @getVoltageText: (v) ->
    getUnitText v, "V"

  @getCurrentText: (i) ->
    getUnitText i, "A"

  @getCurrentDText: (i) ->
    getUnitText Math.abs(i), "A"

  @getVoltageColor: (volts, fullScaleVRange) ->
    value = Math.floor (volts + fullScaleVRange) * (@colorScaleCount - 1) / (2 * fullScaleVRange)
    if value < 0
      value = 0
    else if value >= @colorScaleCount
      value = @colorScaleCount - 1

    return @scale[value]

  @getPowerColor: (power, scaleFactor=1) ->
    return unless Settings.powerCheckItem

    powerLevel = power * scaleFactor
    power = Math.abs(powerLevel)
    power = 1 if power > 1
    rg = 128 + Math.floor power * 127
    b = Math.floor 128 * (1 - power)


# The Footer exports class(es) in this file via Node.js, if Node.js is defined.
# This is necessary for testing through Mocha in development mode.
#
# see script/test and the /test directory for details.
#
# To require this class in another file through Node, write {ClassName} = require(<path_to_coffee_file>)
root = module.exports ? window
module.exports = DrawHelper