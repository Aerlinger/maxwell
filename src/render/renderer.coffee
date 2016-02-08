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
Polygon = require('../geom/Polygon.coffee')
Point = require('../geom/point.coffee')
DrawUtil = require('../util/DrawUtil.coffee')


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
      renderContext.drawLine @x1, @y1, @x2, @y1
      renderContext.drawLine @x1, @y2, @x2, @y2

      renderContext.drawLine @x1, @y1, @x1, @y2
      renderContext.drawLine @x2, @y1, @x2, @y2


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

    @context.lineJoin = 'miter'

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

  drawValue: (perpindicularOffset, parallelOffset, component, text = null) ->
    stringWidth = @context.measureText(text).width
    stringHeight = @context.measureText(text).actualBoundingBoxAscent || 0

    if component.isVertical()
      x = component.getCenter().x + perpindicularOffset
      y = component.getCenter().y + parallelOffset - stringHeight / 2.0
    else
      x = component.getCenter().x + parallelOffset  - stringWidth / 2.0
      y = component.getCenter().y - perpindicularOffset - stringHeight / 2.0


    @context.fillStyle = Settings.TEXT_COLOR
    @fillText text, x, y


  drawDots: (ptA, ptB, component) =>
    return if @Circuit?.isStopped()

    ds = Settings.CURRENT_SEGMENT_LENGTH

    dx = ptB.x - ptA.x
    dy = ptB.y - ptA.y
    dn = Math.sqrt dx * dx + dy * dy

    newPos = component.curcount

    while newPos < dn
      xOffset = ptA.x + newPos * dx / dn
      yOffset = ptA.y + newPos * dy / dn

      @fillCircle(xOffset, yOffset, Settings.CURRENT_RADIUS)
      newPos += ds

  drawLeads: (component) ->
    if component.point1? and component.lead1?
      @drawLinePt component.point1, component.lead1, @getVoltageColor(component.volts[0])
    if component.point2? and component.lead2?
      @drawLinePt component.lead2, component.point2, @getVoltageColor(component.volts[1])

  drawPosts: (component) ->
    for i in [0...component.getPostCount()]
      post = component.getPost(i)
      @drawPost post.x, post.y

  drawPost: (x0, y0) ->
    fillColor = Settings.POST_COLOR
    strokeColor = Settings.POST_COLOR

    @fillCircle x0, y0, Settings.POST_RADIUS, 1, fillColor, strokeColor

  ##
  # From a vector between points AB, calculate a new point in space relative to some multiple of the parallel (u)
  # and perpindicular (v) components of the the original AB vector.
  #
  interpolate: (ptA, ptB, u, v = 0) ->
    dx = ptB.y - ptA.y
    dy = ptA.x - ptB.x
    v /= Math.sqrt dx*dx + dy*dy

    interpX = Math.round((1-u)*ptA.x + (u*ptB.x) + v*dx)
    interpY = Math.round((1-u)*ptA.y + (u*ptB.y) + v*dy)

    new Point(interpX, interpY)

  # Deprecate this shit
  interpolateSymmetrical: (ptA, ptB, u, v) ->
    dx = ptB.y - ptA.y
    dy = ptA.x - ptB.x
    v /= Math.sqrt dx*dx + dy*dy

    interpX = Math.round((1-u)*ptA.x + (u*ptB.x) + v*dx)
    interpY = Math.round((1-u)*ptA.y + (u*ptB.y) + v*dy)

    interpXReflection = Math.round((1-u)*ptA.x + (u*ptB.x) - v*dx)
    interpYReflection = Math.round((1-u)*ptA.y + (u*ptB.y) - v*dy)

    [new Point(interpX, interpY), new Point(interpXReflection, interpYReflection)]

  getVoltageColor: (volts, fullScaleVRange=10) ->
    RedGreen =
      [ "#ff0000", "#f70707", "#ef0f0f", "#e71717", "#df1f1f", "#d72727", "#cf2f2f", "#c73737",
        "#bf3f3f", "#b74747", "#af4f4f", "#a75757", "#9f5f5f", "#976767", "#8f6f6f", "#877777",
        "#7f7f7f", "#778777", "#6f8f6f", "#679767", "#5f9f5f", "#57a757", "#4faf4f", "#47b747",
        "#3fbf3f", "#37c737", "#2fcf2f", "#27d727", "#1fdf1f", "#17e717", "#0fef0f", "#07f707", "#00ff00" ]

    scale =
      ["#B81B00", "#B21F00", "#AC2301", "#A72801", "#A12C02", "#9C3002", "#963503", "#913903",
       "#8B3E04", "#854205", "#804605", "#7A4B06", "#754F06", "#6F5307", "#6A5807", "#645C08",
       "#5F6109", "#596509", "#53690A", "#4E6E0A", "#48720B", "#43760B", "#3D7B0C", "#387F0C",
       "#32840D", "#2C880E", "#278C0E", "#21910F", "#1C950F", "#169910", "#119E10", "#0BA211", "#06A712"]

    blueScale =
      ["#EB1416", "#E91330", "#E7134A", "#E51363", "#E3137C", "#E11394", "#E013AC", "#DE13C3",
       "#DC13DA", "#C312DA", "#AA12D8", "#9012D7", "#7712D5", "#5F12D3", "#4612D1", "#2F12CF",
       "#1712CE", "#1123CC", "#1139CA", "#114FC8", "#1164C6", "#1179C4", "#118EC3", "#11A2C1",
       "#11B6BF", "#10BDB1", "#10BB9B", "#10BA84", "#10B86F", "#10B659", "#10B444", "#10B230", "#10B11C"]

    numColors = scale.length - 1

    value = Math.floor (volts + fullScaleVRange) * numColors / (2 * fullScaleVRange)
    if value < 0
      value = 0
    else if value >= numColors
      value = numColors - 1

    return scale[value]

  calcArrow: (point1, point2, al, aw) ->
    poly = new Polygon()

    dx = point2.x - point1.x
    dy = point2.y - point1.y
    dist = Math.sqrt(dx * dx + dy * dy)

    poly.addVertex point2.x, point2.y

    [p1, p2] = DrawUtil.interpolateSymmetrical point1, point2, 1 - al / dist, aw

    poly.addVertex p1.x, p1.y
    poly.addVertex p2.x, p2.y

    return poly

  createPolygon: (pt1, pt2, pt3, pt4) ->
    newPoly = new Polygon()
    newPoly.addVertex pt1.x, pt1.y
    newPoly.addVertex pt2.x, pt2.y
    newPoly.addVertex pt3.x, pt3.y
    newPoly.addVertex pt4.x, pt4.y if pt4

    return newPoly

  createPolygonFromArray: (vertexArray) ->
    newPoly = new Polygon()
    for vertex in vertexArray
      newPoly.addVertex vertex.x, vertex.y

    return newPoly

module.exports = Renderer
