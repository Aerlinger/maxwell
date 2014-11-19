# <DEFINE>
define [
    'cs!Settings',
    'jquery'
  ],
  (Settings,
   $) ->
# </DEFINE>

    ##
    # Encapsulates behavior specific to rendering primitive elements on the canvas such as circles, lines, polygons, and rect.
    # Really, this class just wraps a native canvas object with the defaults specified in the Settings object.
    #
    class CanvasContext
      constructor: (@context, @width = 600, @height = 400) ->
        #        @context = @CanvasContext.getContext?('2d')

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

      getContext: ->
        return @context

      getCanvas: ->
        return @Canvas

      toBuffer: ->
        return @Canvas?.toBuffer


    return CanvasContext
