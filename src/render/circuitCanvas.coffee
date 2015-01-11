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
    'cs!CircuitComponent',
    'cs!FormatUtils',
    'cs!Settings',
    'cs!Rectangle'
  ],
(
  Observer,
  Circuit,
  CircuitComponent,
  FormatUtils,
  Settings,
  Rectangle
) ->
# </DEFINE>


  # X components
  # Y nodes
  # Z Active Components
  # Timestep:
  # Frametime:
  # Active power consumption:
  # Nonlinear circuit (2nd order)
  # DE Solver: Symplectic Euler
  # Matrix Solver: LU Factorization/Crout
  # Converged in X subiterations using Newton's method
  # Residual: 0
  # Norm(Q):
  # Stability margin:

  # Traversal depth:


  class SelectionMarquee extends Rectangle
    constructor: (@x1, @y1) ->

    reposition: (x, y) ->
      _x1 = Math.min(x, @x1)
      _x2 = Math.max(x, @x1)
      _y1 = Math.min(y, @y1)
      _y2 = Math.max(y, @y1)

      @x2 = _x2
      @y2 = _y2

      @x = @x1 = _x1
      @y = @y1 = _y1

      @width = _x2 - _x1
      @height = _y2 - _y1



    draw: (renderContext) ->
      renderContext.lineWidth = 0.1
      if @x1? && @x2? && @y1? && @y2?
        renderContext.drawThickLine @x1, @y1, @x2, @y1
        renderContext.drawThickLine @x1, @y2, @x2, @y2

        renderContext.drawThickLine @x1, @y1, @x1, @y2
        renderContext.drawThickLine @x2, @y1, @x2, @y2


  class CircuitCanvas extends Observer

    constructor: (@Circuit, @Canvas) ->
      @focusedComponent = null
      @dragComponent = null

      # TODO: Width and height are undefined
      @width = @Canvas.width
      @height = @Canvas.height
      @context = Sketch.augment @Canvas.getContext("2d"), {
        # setup
        # update
        draw: @draw
        # touchstart
        # touchmove
        # touchend
        # mouseover
        # mouseout
        # click
        # keydown
        # keyup
        # resize
        mousemove: @mousemove
        mousedown: @mousedown
        mouseup: @mouseup
      }

#      @Circuit.addObserver Circuit.ON_START_UPDATE, @clear
#      @Circuit.addObserver Circuit.ON_RESET, @clear
      @Circuit.addObserver Circuit.ON_END_UPDATE, @clear


    mousemove: (event) =>
      x = event.offsetX
      y = event.offsetY

      @snapX = @snapGrid(x)
      @snapY = @snapGrid(y)

      if @marquee?
        @marquee?.reposition(x, y)
      else
        for component in @Circuit.getElements()
          if component.getBoundingBox().contains(x, y)
            @focusedComponent = component
            @focusedComponent.focused = true


    mousedown: (event) =>
      x = event.offsetX
      y = event.offsetY
      @marquee = new SelectionMarquee(x, y)

      for component in @Circuit.getElements()
        if component.getBoundingBox().contains(x, y)
          @dragComponent = component
          component.beingDragged(true)

          @focusedComponent = component
          @focusedComponent.focused = true

          if @dragComponent.toggle?
            @dragComponent.toggle()


    mouseup: (event) =>
      @dragComponent?.beingDragged false
      @dragComponent = null
      @marquee = null

    draw: =>
      if @snapX? && @snapY?
        @drawCircle(@snapX, @snapY, 3, "#F00")

      @infoText()
      @marquee?.draw(this)
      @Circuit.updateCircuit()
      @drawComponents()

    infoText: ->
      if @focusedComponent?
        arr = []
        @focusedComponent.getInfo(arr)

        for idx in [0...arr.length]
          @context.fillText(arr[idx], 500, idx*10 + 15)

    drawComponents: ->
      @clear()
      if @context
        for component in @Circuit.getElements()
          if @marquee?.collidesWithComponent(component)
            component.focused = true
            console.log("COLLIDE: " + component.dump())
          @drawComponent(component)

    snapGrid: (x) ->
      (x + (Settings.GRID_SIZE/2-1)) & ~(Settings.GRID_SIZE-1)

    drawComponent: (component) ->
      if component.isSelected()
        @context.strokeStyle = "#FF0"
      component.draw(this)

    # Returns the y position of the bottom of the circuit
    # TODO: Deprecate
    getCircuitBottom: ->
      circuitBottom = -100000000

      @Circuit.eachComponent (component) ->
        rect = component.boundingBox
        bottom = rect.height + rect.y
        circuitBottom = bottom if (bottom > circuitBottom)

      return circuitBottom

    drawInfo: ->
      # TODO: Find where to show data; below circuit, not too high unless we need it
      bottomTextOffset = 100
      ybase = @getCircuitBottom() - (1*15) - bottomTextOffset
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
#      if @Circuit?
#        @Circuit.eachComponent (component) ->
#          component.focused = false


  return CircuitCanvas