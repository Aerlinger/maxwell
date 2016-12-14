Observer = require('../util/observer.coffee')
Settings = require('../settings/settings.coffee')
Util = require('../util/util.coffee')
Point = require('../geom/point.coffee')

class BaseRenderer extends Observer
  drawInfo: ->
    # TODO: Find where to show data; below circuit, not too high unless we need it
#    bottomTextOffset = 100
#    ybase = @getCircuitBottom() - (1 * 15) - bottomTextOffset
    @context.fillText("t = #{Util.longFormat(@Circuit.time)} s", 10, 10)
    @context.fillText("F.T. = #{@Circuit.frames}", 10, 20)

  drawWarning: (context) ->
    msg = ""
    for warning in warningStack
      msg += warning + "\n"
    console.error "Simulation Warning: " + msg

  drawError: (context) ->
    msg = ""
    for error in errorStack
      msg += error + "\n"
    console.error "Simulation Error: " + msg

  fillText: (text, x, y, fillColor="#FF8C00") ->
    @context?.save()
    origFillStyle = @context?.fillStyle
    @context?.fillStyle = fillColor
    @context?.fillText(text, x, y)
    @context?.fillStyle = origFillStyle
    @context?.restore()

  fillCircle: (x, y, radius, lineWidth = Settings.LINE_WIDTH, fillColor = '#FFFF00', lineColor = null) ->
    @context.save()


    @context.beginPath()
    @context.arc x, y, radius, 0, 2 * Math.PI, true

    if lineColor
      @context.lineWidth = lineWidth
      @context.strokeStyle = lineColor
      @context.stroke()

    @context.fillStyle = fillColor
    @context.fill()

    @context.closePath()

    @context.restore()


  drawCircle: (x, y, radius, lineWidth = Settings.LINE_WIDTH, lineColor = "#000000") ->
    @context.save()

    @context.strokeStyle = lineColor
    @context.lineWidth = lineWidth

    @context.beginPath()
    @context.arc x, y, radius, 0, 2 * Math.PI, true
    @context.stroke()
    @context.closePath()

    @context.restore()

  drawRect: (x, y, width, height, lineWidth = Settings.LINE_WIDTH, lineColor = "#000000") ->
    @context.strokeStyle = lineColor
    @context.lineJoin = 'miter'
    @context.lineWidth = 0
    @context.strokeRect(x, y, width, height)
    @context.stroke()

  drawLinePt: (pa, pb, color = Settings.STROKE_COLOR) ->
    @drawLine pa.x, pa.y, pb.x, pb.y, color

  drawLine: (x, y, x2, y2, color = Settings.STROKE_COLOR, lineWidth = Settings.LINE_WIDTH) ->
    @context.save()
    @context.beginPath()

    if @boldLines
      @context.lineWidth = Settings.BOLD_LINE_WIDTH
      @context.strokeStyle = Settings.SELECT_COLOR
      @context.moveTo x, y
      @context.lineTo x2, y2
      @context.stroke()

    else
      @context.strokeStyle = color
      @context.lineWidth = lineWidth
      @context.moveTo x, y
      @context.lineTo x2, y2
      @context.stroke()

    @context.closePath()

    @context.restore()

  drawThickPolygon: (xlist, ylist, color=Settings.STROKE_COLOR, fill=Settings.FILL_COLOR) ->
    @context.save()

    @context.fillStyle = fill
    @context.strokeStyle = color
    @context.beginPath()

    @context.moveTo(xlist[0], ylist[0])
    for i in [1...xlist.length]
      @context.lineTo(xlist[i], ylist[i])

    @context.closePath()
    @context.stroke()
    if color
      @context.fill()

    @context.restore()

  drawThickPolygonP: (polygon, color = Settings.STROKE_COLOR, fill = Settings.FILL_COLOR) ->
    numVertices = polygon.numPoints()

    @context.save()

    @context.fillStyle = fill
    @context.strokeStyle = color
    @context.beginPath()

    @context.moveTo(polygon.getX(0), polygon.getY(0))
    for i in [0...numVertices]
      @context.lineTo(polygon.getX(i), polygon.getY(i))

    @context.closePath()
    @context.fill()
    @context.stroke()
    @context.restore()

  drawPolyLine: (xList, yList, lineWidth=Settings.LINE_WIDTH, color = Settings.STROKE_COLOR) ->
    @context.save()

    @context.beginPath()

    @context.moveTo(xlist[0], ylist[0])
    for i in [1...xlist.length]
      @context.lineTo(xlist[i], ylist[i])

    @context.restore()


  drawValue: (x1, y1, circuitElm, str) ->

  drawCoil: (point1, point2, vStart, vEnd, hs = null) ->
    hs = hs || 8
    segments = 40

    ps1 = new Point(0, 0)
    ps2 = new Point(0, 0)

    ps1.x = point1.x
    ps1.y = point1.y

    for i in [0...segments]
      cx = (((i + 1) * 8 / segments) % 2) - 1
      hsx = Math.sqrt(1 - cx * cx)
      ps2 = Util.interpolate(point1, point2, i / segments, hsx * hs)

      voltageLevel = vStart + (vEnd - vStart) * i / segments
      color = Util.getVoltageColor(voltageLevel)
      @drawLinePt ps1, ps2, color

      ps1.x = ps2.x
      ps1.y = ps2.y

module.exports = BaseRenderer
