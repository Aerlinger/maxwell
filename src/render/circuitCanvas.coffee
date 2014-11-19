# #######################################################################
# CircuitCanvas:
#     Top-level class specification for a circuit
#
# @author Anthony Erlinger
# @year 2012
#
# Observes: Circuit, MouseHandler
# Observed By: CircuitComponent, Circuit, MouseHandler
#
# #######################################################################

# <DEFINE>
define [
    'cs!Observer',
    'cs!Circuit',
    'cs!KeyHandler',
    'cs!MouseHandler',
    'cs!FormatUtils',
    'cs!Settings'
  ],
(
  Observer,
  Circuit,
  KeyHandler,
  MouseHandler,
  FormatUtils,
  Settings
) ->
# </DEFINE>

  class CircuitCanvas extends Observer

    constructor: (@Circuit, @Canvas) ->
      @width = @Canvas.width
      @height = @Canvas.height
      @context = @Canvas.getContext("2d")
#      @Context = new CanvasContext(@Canvas.getContext("2d"), @Canvas.width, @Canvas.height)

      @Circuit.addObserver Circuit.ON_START_UPDATE, @clear
      @Circuit.addObserver Circuit.ON_RESET, @clear
      @Circuit.addObserver Circuit.ON_END_UPDATE, @repaint

#      @KeyHandler = new KeyHandler(@Circuit)
#      @MouseHandler = new MouseHandler(@Context, @Circuit)

      #      @Canvas.mousedown @onMouseDown
      #@Canvas.mouseup @onMouseUp
      #      @Canvas.click @onMouseClick
      #@Canvas.mousemove @onMouseMove

    drawComponents: ->
      @clear()
      if @context
        for component in @Circuit.getElements()
          @drawComponent(component)

    drawComponent: (component) ->
      if component.isSelected()
        @context.strokeStyle = "#FF0"
      component.draw(this)

    drawInfo: ->
      # TODO: Find where to show data; below circuit, not too high unless we need it
      bottomTextOffset = 100
      ybase = @Circuit.getCircuitBottom - (1 * 15) - bottomTextOffset
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
      @context.strokeStyle = lineColor
      @context.beginPath()
      @context.lineWidth = lineWidth
      @context.arc x, y, radius, 0, 2 * Math.PI, true
      @context.stroke()
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

    drawThickLinePt: (pa, pb, color) ->
      @drawThickLine pa.x, pa.y, pb.x, pb.y, color

    drawThickLine: (x, y, x2, y2, color = Settings.FG_COLOR) ->
      origLineWidth = @context.lineWidth
      origStrokeStyle = @context.strokeStyle

      @context.strokeStyle = color
      @context.beginPath()
      @context.moveTo x, y
      @context.lineTo x2, y2
      @context.stroke()
      @context.closePath()

      @context.lineWidth = origLineWidth
      @context.strokeStyle = origStrokeStyle

    drawThickPolygon: (xlist, ylist, color) ->
      for i in [0...(xlist.length - 1)]
        @drawThickLine xlist[i], ylist[i], xlist[i + 1], ylist[i + 1], color
      @drawThickLine xlist[i], ylist[i], xlist[0], ylist[0], color

    drawThickPolygonP: (polygon, color) ->
      numVertices = polygon.numPoints()
      for i in [0...(numVertices - 1)]
        @drawThickLine polygon.getX(i), polygon.getY(i), polygon.getX(i + 1), polygon.getY(i + 1), color
      @drawThickLine polygon.getX(i), polygon.getY(i), polygon.getX(0), polygon.getY(0), color

    clear: ->
      return if !@context
      @context.clearRect(0, 0, @width, @height)

    # Called on Circuit update:
    repaint: (Circuit) =>
      @drawComponents()
      @drawInfo()

  return CircuitCanvas