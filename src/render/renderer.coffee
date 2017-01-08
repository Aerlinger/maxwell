BaseRenderer = require('./BaseRenderer.coffee')
Circuit = require('../circuit/circuit.coffee')
CircuitComponent = require('../circuit/circuitComponent.coffee')
ComponentRegistry = require('../circuit/componentRegistry.coffee')
Settings = require('../settings/settings.coffee')
Rectangle = require('../geom/rectangle.coffee')
Polygon = require('../geom/polygon.coffee')
Point = require('../geom/point.coffee')
Util = require('../util/util.coffee')
environment = require('../environment.coffee')

AntennaElm = require('../circuit/components/AntennaElm.coffee')
WireElm = require('../circuit/components/WireElm.coffee')
ResistorElm = require('../circuit/components/ResistorElm.coffee')
GroundElm = require('../circuit/components/GroundElm.coffee')
VoltageElm = require('../circuit/components/VoltageElm.coffee')
DiodeElm = require('../circuit/components/DiodeElm.coffee')
OutputElm = require('../circuit/components/OutputElm.coffee')
SwitchElm = require('../circuit/components/SwitchElm.coffee')
CapacitorElm = require('../circuit/components/CapacitorElm.coffee')
InductorElm = require('../circuit/components/InductorElm.coffee')
SparkGapElm = require('../circuit/components/SparkGapElm.coffee')
CurrentElm = require('../circuit/components/CurrentElm.coffee')
RailElm = require('../circuit/components/RailElm.coffee')
MosfetElm = require('../circuit/components/MosfetElm.coffee')
JfetElm = require('../circuit/components/JFetElm.coffee')
TransistorElm = require('../circuit/components/TransistorElm.coffee')
VarRailElm = require('../circuit/components/VarRailElm.coffee')
OpAmpElm = require('../circuit/components/OpAmpElm.coffee')
ZenerElm = require('../circuit/components/ZenerElm.coffee')
Switch2Elm = require('../circuit/components/Switch2Elm.coffee')
SweepElm = require('../circuit/components/SweepElm.coffee')
TextElm = require('../circuit/components/TextElm.coffee')
ProbeElm = require('../circuit/components/ProbeElm.coffee')

AndGateElm = require('../circuit/components/AndGateElm.coffee')
NandGateElm = require('../circuit/components/NandGateElm.coffee')
OrGateElm = require('../circuit/components/OrGateElm.coffee')
NorGateElm = require('../circuit/components/NorGateElm.coffee')
XorGateElm = require('../circuit/components/XorGateElm.coffee')
InverterElm = require('../circuit/components/InverterElm.coffee')

LogicInputElm = require('../circuit/components/LogicInputElm.coffee')
LogicOutputElm = require('../circuit/components/LogicOutputElm.coffee')
AnalogSwitchElm = require('../circuit/components/AnalogSwitchElm.coffee')
AnalogSwitch2Elm = require('../circuit/components/AnalogSwitch2Elm.coffee')
MemristorElm = require('../circuit/components/MemristorElm.coffee')
RelayElm = require('../circuit/components/RelayElm.coffee')
TunnelDiodeElm = require('../circuit/components/TunnelDiodeElm.coffee')

ScrElm = require('../circuit/components/SCRElm.coffee')
TriodeElm = require('../circuit/components/TriodeElm.coffee')

DecadeElm = require('../circuit/components/DecadeElm.coffee')
LatchElm = require('../circuit/components/LatchElm.coffee')
TimerElm = require('../circuit/components/TimerElm.coffee')
JkFlipFlopElm = require('../circuit/components/JKFlipFlopElm.coffee')
DFlipFlopElm = require('../circuit/components/DFlipFlopElm.coffee')
CounterElm = require('../circuit/components/CounterElm.coffee')
DacElm = require('../circuit/components/DacElm.coffee')
AdcElm = require('../circuit/components/AdcElm.coffee')
VcoElm = require('../circuit/components/VcoElm.coffee')
PhaseCompElm = require('../circuit/components/PhaseCompElm.coffee')
SevenSegElm = require('../circuit/components/SevenSegElm.coffee')
CC2Elm = require('../circuit/components/CC2Elm.coffee')

TransLineElm = require('../circuit/components/TransLineElm.coffee')

TransformerElm = require('../circuit/components/TransformerElm.coffee')
TappedTransformerElm = require('../circuit/components/TappedTransformerElm.coffee')

LedElm = require('../circuit/components/LedElm.coffee')
PotElm = require('../circuit/components/PotElm.coffee')
ClockElm = require('../circuit/components/ClockElm.coffee')

Scope = require('../circuit/components/Scope.coffee')


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
      renderContext.drawLine @x1, @y1, @x2, @y1, "#FFFF00", 1
      renderContext.drawLine @x1, @y2, @x2, @y2, "#FFFF00", 1

      renderContext.drawLine @x1, @y1, @x1, @y2, "#FFFF00", 1
      renderContext.drawLine @x2, @y1, @x2, @y2, "#FFFF00", 1


class Renderer extends BaseRenderer
  @ON_COMPONENT_HOVER = "ON_COMPONENT_HOVER"
  @ON_COMPONENT_CLICKED = "ON_COMPONENT_CLICKED"
  @ON_COMPONENTS_SELECTED = "ON_COMPONENTS_SELECTED"
  @ON_COMPONENTS_DESELECTED = "ON_COMPONENTS_DESELECTED"
  @ON_COMPONENTS_MOVED = "ON_COMPONENTS_MOVED"

  @STATE_EDIT
  @STATE_PLACE
  @STATE_RUN

  MOUSEDOWN = 1

  constructor: (@Circuit, @Canvas) ->
    super()

    @highlightedComponent = null
    @addComponent = null
    @selectedNode = null
    @selectedComponents = []

    # TODO: Width and height are currently undefined
    @width = @Canvas.width
    @height = @Canvas.height

    @state = @STATE_RUN

    @config = {
      keyboard: true
    }

    if environment.isBrowser
      @context = Sketch.augment @Canvas.getContext("2d"), {
        draw: @draw
        mousemove: @mousemove
        mousedown: @mousedown
        mouseup: @mouseup
        fullscreen: false
        width: @width
        height: @height
      }

      @context.lineJoin = 'miter'

    # Callbacks
    @onSelectionChanged = null
    @onComponentClick = null
    @onComponentHover = null
    @onNodeHover = null
    @onNodeClick = null   # @onNodeClick(component)
    @onUpdateComplete = null  # @onUpdateComplete(circuit)
#
    #@setPlaceComponent("ResistorElm")

    # @Circuit.addObserver Circuit.ON_START_UPDATE, @clear
    # @Circuit.addObserver Circuit.ON_RESET, @clear
    # @Circuit.addObserver Circuit.ON_END_UPDATE, @clear

  getSelectedComponents: ->
    @selectedComponents

  getPlaceComponent: ->
    @placeComponent

  pause: ->
  play: ->
  restart: ->

  clearPlaceComponent: ->
    @placeComponent = null

  setPlaceComponent: (componentName) ->
    klass = eval(componentName)

    @placeComponent = new klass(100, 100, 100, 200)

    console.log(componentName, "default params:", @placeComponent.params)

    @placeComponent

  remove: (components) ->
    console.log("components", components)
    @Circuit.destroy(components)

  mousemove: (event) =>
    x = event.offsetX
    y = event.offsetY

    @newlyHighlightedComponent = null

    @lastX = @snapX
    @lastY = @snapY

    @snapX = Util.snapGrid(x)
    @snapY = Util.snapGrid(y)

    if @marquee?
      @marquee?.reposition(x, y)
      @selectedComponents = []

      for component in @Circuit.getElements()
        if @marquee?.collidesWithComponent(component)
          @selectedComponents.push(component)
          @onSelectionChanged?(@selectedComponents)

    else
      @previouslyHighlightedNode = @highlightedNode
      @highlightedNode = @Circuit.getNodeAtCoordinates(@snapX, @snapY)

      if @highlightedNode
        @onNodeHover?(@highlightedNode)

      else
        # TODO: WIP for interactive element placing
        if @placeComponent
          @placeComponent.setPoints()
          if @placeComponent.x1() && @placeComponent.y1()
            console.log(@snapX, @lastX," ", @snapY, @lastY)
            console.log(@snapX - @lastX," ", @snapY - @lastY)

            @placeComponent.moveTo(@snapX, @snapY)

        for component in @Circuit.getElements()
          if component.getBoundingBox().contains(x, y)
            @newlyHighlightedComponent = component

      if @previouslyHighlightedNode && !@highlightedNode
        @onNodeUnhover?(@previouslyHighlightedNode)

      if @selectedNode
        for element in @selectedNode.getNeighboringElements()
          if element
            console.log(element)
            post = element.getPostAt(@selectedNode.x, @selectedNode.y)
            if post
              post.x = @snapX
              post.y = @snapY
            else
              console.warn("No post at", @selectedNode.x, @selectedNode.y)

            element.recomputeBounds()

        @selectedNode.x = @snapX
        @selectedNode.y = @snapY

      if @newlyHighlightedComponent
        if @newlyHighlightedComponent != @highlightedComponent
          @highlightedComponent = @newlyHighlightedComponent
          @onComponentHover?(@highlightedComponent)
          @notifyObservers(Renderer.ON_COMPONENT_HOVER, @highlightedComponent)

      else
        if @highlightedComponent
          @onComponentUnhover?(@highlightedComponent)

        @highlightedComponent = null

    if !@marquee and !@selectedNode and @selectedComponents?.length > 0 and event.which == MOUSEDOWN and (@lastX != @snapX or @lastY != @snapY)
      for component in @selectedComponents
        component.move(@snapX - @lastX, @snapY - @lastY)

  mousedown: (event) =>
    x = event.offsetX
    y = event.offsetY

    console.log(@highlightedComponent, @placeComponent, @highlightedNode)

    if @placeComponent
      @Circuit.solder(@placeComponent)
      @placeComponent = null

    if !@highlightedComponent && !@placeComponent && !@highlightedNode
      if @selectedComponents && @selectedComponents.length > 0
        @onSelectionChanged?([])

      @selectedComponents = []

      @marquee = new SelectionMarquee(x, y)

    @selectedNode = @Circuit.getNodeAtCoordinates(@snapX, @snapY)

    if @selectedNode
      @onNodeClick?(@selectedNode)

    for component in @Circuit.getElements()
      if component.getBoundingBox().contains(x, y)
        @notifyObservers(Renderer.ON_COMPONENT_CLICKED, component)

        unless component in @selectedComponents
          @selectedComponents = [component]
          @onSelectionChanged?(@selectedComponents)

        component.toggle?()
        component.onclick?()

        @onComponentClick?(component)

  mouseup: (event) =>
    @marquee = null
    @selectedNode = null

    if @selectedComponents?.length > 0
      @notifyObservers(Renderer.ON_COMPONENTS_DESELECTED, @selectedComponents)


  draw: =>
    if @snapX? && @snapY?
      @drawCircle(@snapX, @snapY, 1, "#F00")

    @drawInfoText()
    @marquee?.draw(this)

    # UPDATE FRAME ----------------------------------------------------------------
    @Circuit.updateCircuit()
    @onUpdateComplete?(this)
    # -----------------------------------------------------------------------------

    @drawComponents()

    if @context
      if @placeComponent
        @context.fillText("Placing #{@placeComponent.constructor.name}", @snapX, @snapY)

        if @placeComponent.x1() && @placeComponent.x2()
          @drawComponent(@placeComponent)

      if @selectedNode
        @drawCircle(@selectedNode.x, @selectedNode.y, Settings.POST_RADIUS + 3, 3, Settings.HIGHLIGHT_COLOR)

      if @highlightedComponent
        @drawCircle(@highlightedComponent.x1(), @highlightedComponent.y1(), Settings.POST_RADIUS + 2, 2, Settings.HIGHLIGHT_COLOR)
        @drawCircle(@highlightedComponent.x2(), @highlightedComponent.y2(), Settings.POST_RADIUS + 2, 2, Settings.HIGHLIGHT_COLOR)

    if CircuitComponent.DEBUG
      for nodeIdx in [0...@Circuit.numNodes()]
        node = @Circuit.getNode(nodeIdx)
        @fillText "#{nodeIdx} #{node.x},#{node.y}", node.x + 5, node.y - 5

  drawComponents: ->
    if @context
      for component in @Circuit.getElements()
        if @marquee?.collidesWithComponent(component)
          console.log("MARQUEE COLLIDE: " + component)

        @drawComponent(component)

      if CircuitComponent.DEBUG
        nodeIdx = 0
        for node in @Circuit.getNodes()
          x = node.x
          y = node.y
          voltage = Util.singleFloat(@Circuit.getVoltageForNode(nodeIdx))

          @context.fillText("#{nodeIdx}:#{voltage}", x+10, y-10, "#FF8C00")
          nodeIdx++

  drawBoldLines: ->
    @boldLines = true

  drawDefaultLines: ->
    @boldLines = false

  drawComponent: (component) ->
    if component && component in @selectedComponents
      @drawBoldLines()
      for i in [0...component.getPostCount()]
        post = component.getPost(i)
        @drawCircle(post.x, post.y, Settings.POST_RADIUS + 2, 2, Settings.SELECT_COLOR)

    else
      @drawDefaultLines()

    # Main entry point to draw component
    component.draw(this)


  drawInfoText: ->
    if @highlightedComponent?
      arr = []
      @highlightedComponent.getInfo(arr)

      for idx in [0...arr.length]
        @context.fillText(arr[idx], 500, idx * 10 + 15)

  drawValue: (perpindicularOffset, parallelOffset, component, text = null, rotation = 0) ->
    @context.save()
    @context.textAlign = "center"

    @context.font = "7pt Courier"

    stringWidth = @context.measureText(text).width
    stringHeight = @context.measureText(text).actualBoundingBoxAscent || 0

    @context.fillStyle = Settings.TEXT_COLOR
    if component.isVertical()

      x = component.getCenter().x #+ perpindicularOffset
      y = component.getCenter().y #+ parallelOffset - stringHeight / 2.0

      @context.translate(x, y)
      @context.rotate(Math.PI/2)
      @fillText text, parallelOffset, -perpindicularOffset
    else
      x = component.getCenter().x + parallelOffset
      y = component.getCenter().y + perpindicularOffset

      @fillText text, x, y, Settings.TEXT_COLOR

    @context.restore()


  # TODO: Move to CircuitComponent
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

      if Settings.CURRENT_DISPLAY_TYPE == Settings.CURENT_TYPE_DOTS
        @fillCircle(xOffset, yOffset, Settings.CURRENT_RADIUS, 1, Settings.CURRENT_COLOR)
      else
        xOffset0 = xOffset - 3 * dx / dn
        yOffset0 = yOffset - 3 * dy / dn

        xOffset1 = xOffset + 3 * dx / dn
        yOffset1 = yOffset + 3 * dy / dn

        @context.save()
        @context.strokeStyle = Settings.CURRENT_COLOR
        @context.lineWidth = Settings.CURRENT_RADIUS
        @context.beginPath()
        @context.moveTo xOffset0, yOffset0
        @context.lineTo xOffset1, yOffset1
        @context.stroke()
        @context.closePath()
        @context.restore()

      newPos += ds

  # TODO: Move to CircuitComponent
  drawLeads: (component) ->
    if component.point1? and component.lead1?
      @drawLinePt component.point1, component.lead1, Util.getVoltageColor(component.volts[0])
    if component.point2? and component.lead2?
      @drawLinePt component.lead2, component.point2, Util.getVoltageColor(component.volts[1])

  # TODO: Move to CircuitComponent
  drawPosts: (component, color = Settings.POST_COLOR) ->
    for i in [0...component.getPostCount()]
      post = component.getPost(i)
      @drawPost post.x, post.y, color, color

  drawPost: (x0, y0, fillColor = Settings.POST_COLOR, strokeColor = Settings.POST_COLOR) ->
    @fillCircle x0, y0, Settings.POST_RADIUS, 1, fillColor, strokeColor


module.exports = Renderer
