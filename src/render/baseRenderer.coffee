Observer = require('../util/observer.coffee')
Settings = require('../settings/settings.coffee')
FormatUtils = require('../util/formatUtils.coffee')
Point = require('../geom/point.coffee')

class BaseRenderer extends Observer
  drawInfo: ->
    # TODO: Find where to show data; below circuit, not too high unless we need it
#    bottomTextOffset = 100
#    ybase = @getCircuitBottom() - (1 * 15) - bottomTextOffset
    @context.fillText("t = #{FormatUtils.longFormat(@Circuit.time)} s", 10, 10)
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

  fillText: (text, x, y) ->
    @context.fillText(text, x, y)

  fillCircle: (x, y, radius, lineWidth = Settings.LINE_WIDTH, fillColor = '#FF0000', lineColor = "#000000") ->
    origLineWidth = @context.lineWidth
    origStrokeStyle = @context.strokeStyle

    @context.fillStyle = fillColor
#    @context.strokeStyle = lineColor
    @context.beginPath()
    @context.lineWidth = lineWidth
    @context.arc x, y, radius, 0, 2 * Math.PI, true
#    @context.stroke()
    @context.fill()
    @context.closePath()

    @context.strokeStyle = origStrokeStyle
    @context.lineWidth = origLineWidth

  drawCircle: (x, y, radius, lineWidth = Settings.LINE_WIDTH, lineColor = "#000000") ->
    origLineWidth = @context.lineWidth
    origStrokeStyle = @context.strokeStyle

    @context.strokeStyle = lineColor
    @context.beginPath()
    @context.lineWidth = lineWidth
    @context.arc x, y, radius, 0, 2 * Math.PI, true
    @context.stroke()
    @context.closePath()

    @context.lineWidth = origLineWidth
    @context.strokeStyle = origStrokeStyle

  drawLinePt: (pa, pb, color) ->
    @drawLine pa.x, pa.y, pb.x, pb.y, color

  drawLine: (x, y, x2, y2, color = Settings.FG_COLOR, lineWidth = Settings.LINE_WIDTH) ->
    origLineWidth = Settings.LINE_WIDTH
    origStrokeStyle = @context.strokeStyle

    @context.lineJoin = 'miter'

    @context.strokeStyle = color
    @context.lineWidth = lineWidth
    @context.beginPath()
    @context.moveTo x, y
    @context.lineTo x2, y2
    @context.stroke()
    @context.closePath()

    @context.lineWidth = origLineWidth
    @context.strokeStyle = origStrokeStyle

  drawThickPolygon: (xlist, ylist, color) ->
    for i in [0...(xlist.length - 1)]
      @drawLine xlist[i], ylist[i], xlist[i + 1], ylist[i + 1], color
    @drawLine xlist[i], ylist[i], xlist[0], ylist[0], color

  drawThickPolygonP: (polygon, color) ->
    numVertices = polygon.numPoints()
    for i in [0...(numVertices - 1)]
      @drawLine polygon.getX(i), polygon.getY(i), polygon.getX(i + 1), polygon.getY(i + 1), color
    @drawLine polygon.getX(i), polygon.getY(i), polygon.getX(0), polygon.getY(0), color

  drawCoil: (point1, point2, vStart, vEnd, renderContext) ->
    hs = 8
    segments = 40

    ps1 = new Point(0, 0)
    ps2 = new Point(0, 0)

    ps1.x = point1.x
    ps1.y = point1.y

    for i in [0...segments]
      cx = (((i + 1) * 8 / segments) % 2) - 1
      hsx = Math.sqrt(1 - cx * cx)
      ps2 = renderContext.interpolate(point1, point2, i / segments, hsx * hs)

      voltageLevel = vStart + (vEnd - vStart) * i / segments
      color = renderContext.getVoltageColor(voltageLevel)
      renderContext.drawLinePt ps1, ps2, color

      ps1.x = ps2.x
      ps1.y = ps2.y

module.exports = BaseRenderer
