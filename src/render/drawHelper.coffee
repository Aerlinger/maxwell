# <DEFINE>
define [
  'cs!settings/Settings',
  'cs!geom/Polygon',
  'cs!geom/Rectangle',
  'cs!geom/Point'
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

    @muString: "u"
    @ohmString: "ohm"

    EPSILON = 0.48

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

    @interpPoint: (ptA, ptB, f, g = 0) ->
      gx = ptB.y - ptA.y
      gy = ptA.x - ptB.x
      g /= Math.sqrt gx*gx + gy*gy

      ptOut = new Point()
      ptOut.x = Math.floor((1-f)*ptA.x + (f*ptB.x) + g*gx + EPSILON)
      ptOut.y = Math.floor((1-f)*ptA.y + (f*ptB.y) + g*gy + EPSILON)

#      console.log("ptOut: #{ptOut}")

      return ptOut

    @interpPoint2: (ptA, ptB, f, g) ->
      gx = ptB.y - ptA.y
      gy = ptA.x - ptB.x
      g /= Math.sqrt gx*gx + gy*gy

      ptOut1 = new Point()
      ptOut2 = new Point()
      ptOut1.x = Math.floor((1-f)*ptA.x + (f*ptB.x) + g*gx + EPSILON)
      ptOut1.y = Math.floor((1-f)*ptA.y + (f*ptB.y) + g*gy + EPSILON)
      ptOut2.x = Math.floor((1-f)*ptA.x + (f*ptB.x) - g*gx + EPSILON)
      ptOut2.y = Math.floor((1-f)*ptA.y + (f*ptB.y) - g*gy + EPSILON)

      return [ptOut1, ptOut2]

    @calcArrow: (point1, point2, al, aw) ->
      poly = new Polygon()

      dx = point2.x - point1.x
      dy = point2.y - point1.y
      dist = Math.sqrt(dx * dx + dy * dy)

      poly.addVertex point2.x, point2.y

      [p1, p2] = @.interpPoint2 point1, point2, 1 - al / dist, aw

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

    @drawCoil: (hs, point1, point2, vStart, vEnd, renderContext) ->
      segments = 40
      @ps1.x = point1.x
      @ps1.y = point1.y

      for i in [0...segments]
        cx = (((i + 1) * 8 / segments) % 2) - 1
        hsx = Math.sqrt(1 - cx * cx)
        @ps2 = @.interpPoint point1, point2, i / segments, hsx * hs
        voltageLevel = vStart + (vEnd - vStart) * i / segments
        color = @.getVoltageColor(voltageLevel)
        renderContext.drawThickLinePt @ps1, @ps2, color
        @ps1.x = @ps2.x
        @ps1.y = @ps2.y

    @getShortUnitText: (value, unit) ->
      @getUnitText value, unit, 1

    @getUnitText: (value, unit, decimalPoints = 2) ->
      absValue = Math.abs(value)
      return "0 " + unit  if absValue < 1e-18
      return (value * 1e15).toFixed(decimalPoints) + " f" + unit  if absValue < 1e-12
      return (value * 1e12).toFixed(decimalPoints) + " p" + unit  if absValue < 1e-9
      return (value * 1e9).toFixed(decimalPoints) + " n" + unit  if absValue < 1e-6
      return (value * 1e6).toFixed(decimalPoints) + " " + @muString + unit  if absValue < 1e-3
      return (value * 1e3).toFixed(decimalPoints) + " m" + unit  if absValue < 1
      return (value).toFixed(decimalPoints) + " " + unit  if absValue < 1e3
      return (value * 1e-3).toFixed(decimalPoints) + " k" + unit  if absValue < 1e6
      return (value * 1e-6).toFixed(decimalPoints) + " M" + unit  if absValue < 1e9
      (value * 1e-9).toFixed(decimalPoints) + " G" + unit

    @getVoltageDText: (v) ->
      @getUnitText Math.abs(v), "V"

    @getVoltageText: (v) ->
      @getUnitText v, "V"

    @getCurrentText: (value) ->
      @getUnitText value, "A"

    @getCurrentDText: (value) ->
      @getUnitText Math.abs(value), "A"

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
