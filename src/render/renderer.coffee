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

BaseRenderer = require('./BaseRenderer.coffee')
Circuit = require('../circuit/circuit.coffee')
CircuitComponent = require('../circuit/circuitComponent.coffee')
Settings = require('../settings/settings.coffee')
Rectangle = require('../geom/rectangle.coffee')
Point = require('../geom/point.coffee')


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


class Renderer extends BaseRenderer
  @ON_COMPONENT_HOVER = "ON_COMPONENT_HOVER"
  @ON_COMPONENT_CLICKED = "ON_COMPONENT_CLICKED"
  @ON_COMPONENTS_SELECTED = "ON_COMPONENTS_SELECTED"
  @ON_COMPONENTS_DESELECTED = "ON_COMPONENTS_DESELECTED"
  @ON_COMPONENTS_MOVED = "ON_COMPONENTS_MOVED"

  MOUSEDOWN = 1

  constructor: (@Circuit, @Canvas) ->
    super()

    @highlightedComponent = null
    @selectedComponents = []

    # TODO: Width and height are currently undefined
    @width = @Canvas.width
    @height = @Canvas.height

    @context = Sketch.augment @Canvas.getContext("2d"), {
      draw: @draw
      mousemove: @mousemove
      mousedown: @mousedown
      mouseup: @mouseup
      # setup
      # update
      # touchstart
      # touchmove
      # touchend
      # mouseover
      # mouseout
      # click
      # keydown
      # keyup
      # resize
    }

    #    @Circuit.addObserver Circuit.ON_START_UPDATE, @clear
    #    @Circuit.addObserver Circuit.ON_RESET, @clear
    #    @Circuit.addObserver Circuit.ON_END_UPDATE, @clear

  mousemove: (event) =>
    x = event.offsetX
    y = event.offsetY

    @highlightedComponent = null

    @lastX = @snapX
    @lastY = @snapY

    @snapX = @snapGrid(x)
    @snapY = @snapGrid(y)

    if @marquee?
      @marquee?.reposition(x, y)
      @selectedComponents = []

      for component in @Circuit.getElements()
        if @marquee?.collidesWithComponent(component)
          @selectedComponents.push(component)
    else
      for component in @Circuit.getElements()
        if component.getBoundingBox().contains(x, y)
          @highlightedComponent = component
          @notifyObservers(Renderer.ON_COMPONENT_HOVER, component)

    if @marquee is null and @selectedComponents?.length > 0 and event.which == MOUSEDOWN and (@lastX != @snapX or @lastY != @snapY)
      for component in @selectedComponents
        component.move(@snapX - @lastX, @snapY - @lastY)


  mousedown: (event) =>
    x = event.offsetX
    y = event.offsetY

    if @highlightedComponent == null
      @selectedComponents = []
      @marquee = new SelectionMarquee(x, y)

    for component in @Circuit.getElements()
      if component.getBoundingBox().contains(x, y)
        @notifyObservers(Renderer.ON_COMPONENT_CLICKED, component)

        if @selectedComponents?.length == 0
          @selectedComponents = [component]

        component.toggle?()


  mouseup: (event) =>
    @marquee = null

    if @selectedComponents?.length > 0
      @notifyObservers(Renderer.ON_COMPONENTS_DESELECTED, @selectedComponents)


  draw: =>
    if @snapX? && @snapY?
      @drawCircle(@snapX, @snapY, 3, "#F00")

    @drawInfoText()
    @marquee?.draw(this)
    @Circuit.updateCircuit()
    @drawComponents()


  drawComponents: ->
    if @context
      for component in @Circuit.getElements()
        if @marquee?.collidesWithComponent(component)
          console.log("MARQUEE COLLIDE: " + component)
        @drawComponent(component)


  drawComponent: (component) ->
    if component in @selectedComponents
      @context.strokeStyle = "#FF0"
    component.draw(this)


  drawInfoText: ->
    if @highlightedComponent?
      arr = []
      @highlightedComponent.getInfo(arr)

      for idx in [0...arr.length]
        @context.fillText(arr[idx], 500, idx * 10 + 15)


  snapGrid: (x) ->
    (x + (Settings.GRID_SIZE / 2 - 1)) & ~(Settings.GRID_SIZE - 1)



module.exports = Renderer
