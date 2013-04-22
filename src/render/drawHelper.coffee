# <DEFINE>
define [
  'cs!Settings',
  'cs!Polygon',
  'cs!Rectangle',
  'cs!Point'
], (
  Settings,
  Polygon,
  Rectangle,
  Point
) ->
# </DEFINE>


  class DrawHelper
    @ps1: new Point(0, 0)
    @ps2: new Point(0, 0)

    @colorScaleCount = 32
    @colorScale = []

    # Creates the color scale
    @initializeColorScale: ->
      @colorScale = new Array(@colorScaleCount)

      for i in [0...@colorScaleCount]
        voltage = i * 2 / @colorScaleCount - 1
        if voltage < 0
          n1 = Math.floor (128 * -voltage) + 127
          n2 = Math.floor 127 * (1 + voltage)

          # Color red for a negative voltage:
          @colorScale[i] = new Color(n1, n2, n2)
        else
          n1 = Math.floor (128 * voltage) + 127
          n2 = Math.floor 127 * (1 - voltage)

          # Color green for a positive voltage
          @colorScale[i] = new Color(n2, n1, n2)

    @scale =
      [ "#ff0000", "#f70707", "#ef0f0f", "#e71717", "#df1f1f", "#d72727", "#cf2f2f", "#c73737",
        "#bf3f3f", "#b74747", "#af4f4f", "#a75757", "#9f5f5f", "#976767", "#8f6f6f", "#877777",
        "#7f7f7f", "#778777", "#6f8f6f", "#679767", "#5f9f5f", "#57a757", "#4faf4f", "#47b747",
        "#3fbf3f", "#37c737", "#2fcf2f", "#27d727", "#1fdf1f", "#17e717", "#0fef0f", "#07f707", "#00ff00" ]

    @unitsFont: "Arial, Helvetica, sans-serif"

    # TODO: BUGGY
    @interpPoint: (ptA, ptB, f, g = 0, ptOut1 = null, ptOut2 = null) ->
      gx = ptB.y - ptA.y
      gy = ptA.x - ptB.x
      g /= Math.sqrt gx*gx + gy*gy

      if !ptOut1
        ptOut1 = new Point()

      ptOut1.x = Math.floor (1 - f) * ptA.x + (f * ptB.x) + (g * gx) + 0.48
      ptOut1.y = Math.floor (1 - f) * ptA.y + (f * ptB.y) + (g * gy) + 0.48

      if ptOut2
        ptOut2.x = ptOut1.x
        ptOut2.y = ptOut1.y

      return ptOut1

#    @interpPointPt: (pt1, pt2, f, g) ->
#      newPoint = new Point(0, 0)
#      @interpPoint pt1, pt2, newPoint, f, g
#      return newPoint
#
#    @interpPoint: (ptA, ptB, ptOut, f, g) ->
#      if g
#        gx = ptB.y - ptA.y
#        gy = ptA.x - ptB.x
#        g /= Math.sqrt(gx * gx + gy * gy)
#      else
#        gx = 0
#        gy = 0
#        g = 0
#      ptOut.x = Math.floor ptA.x * (1 - f) + ptB.x * f + g * gx + 0.48
#      ptOut.y = Math.floor ptA.y * (1 - f) + ptB.y * f + g * gy + 0.48
#      return ptB
#
#    @interpPoint2: (ptA, ptB, ptOut1, ptOut2, f, g) ->
#      if g is not 0
#        gx = ptB.y - ptA.y
#        gy = ptA.x - ptB.x
#        g /= Math.sqrt(gx*gx + gy*gy)
#
#      ptOut2.x = ptOut1.x  = (1 - f) * Math.floor ptA.x + (f * ptB.x) + (g * gx) + 0.48
#      ptOut2.y = ptOut1.y  = (1 - f) * Math.floor ptA.y + (f * ptB.y) + (g * gy) + 0.48


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

    @createPolygon: (pt1, pt2, pt3, pt4) ->
      newPoly = new Polygon()
      newPoly.addVertex pt1.x, pt1.y
      newPoly.addVertex pt2.x, pt2.y
      newPoly.addVertex pt3.x, pt3.y
      newPoly.addVertex pt4.x, pt4.y if pt4
      return newPoly

    @createPolygonFromArray: (vertexArray) ->
      newPoly = new Polygon()
      for vertex in vertexArray
        newPoly.addVertex vertex.x, vertex.y

      return newPoly

    @drawCoil: (hs, point1, point2, vStart, vEnd) ->
      segments = 40
      @ps1.x = point1.x
      @ps1.y = point1.y

      for i in [0...segments]
        cx = (((i + 1) * 8 / segments) % 2) - 1
        hsx = Math.sqrt(1 - cx * cx)
        @.interpPoint point1, point2, @ps2, i / segments, hsx * hs
        voltageLevel = vStart + (vEnd - vStart) * i / segments
        color = @setVoltageColor(voltageLevel)
        @.drawThickLinePt @ps1, @ps2, color
        @ps1.x = @ps2.x
        @ps1.y = @ps2.y


    @getVoltageDText: (v) ->
      getUnitText Math.abs(v), "V"

    @getVoltageText: (v) ->
      getUnitText v, "V"

    @getCurrentText: (value) ->
      getUnitText value, "A"

    @getCurrentDText: (value) ->
      getUnitText Math.abs(value), "A"

    @getVoltageColor: (volts, fullScaleVRange=10) ->
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



  return DrawHelper