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
    'cs!CanvasContext',
    'cs!Observer',
    'cs!Circuit',
    'cs!KeyHandler',
    'cs!MouseHandler',
    'cs!FormatUtils'
  ],
(
  CanvasContext,
  Observer,
  Circuit,
  KeyHandler,
  MouseHandler,
  FormatUtils
) ->
# </DEFINE>

  class CircuitCanvas extends Observer

    constructor: (@Circuit, @CanvasJQueryElm, @width, @height) ->
      @Context = new CanvasContext(@CanvasJQueryElm.get(0), @width, @height) if @CanvasJQueryElm

      @Circuit.addObserver Circuit.ON_START_UPDATE, @clear
      @Circuit.addObserver Circuit.ON_RESET, @clear
      @Circuit.addObserver Circuit.ON_END_UPDATE, @repaint

      @KeyHandler = new KeyHandler(@Circuit)
      @MouseHandler = new MouseHandler(@Context, @Circuit)

      if @CanvasJQueryElm
        @CanvasJQueryElm.mousedown @onMouseDown
        @CanvasJQueryElm.mouseup @onMouseUp
        @CanvasJQueryElm.click @onMouseClick
        @CanvasJQueryElm.mousemove @onMouseMove

    drawComponents: ->
      @clear()
      if @Context
        for component in @Circuit.getElements()
          @drawComponent(component)

    drawComponent: (component) ->
      if component.isSelected()
        @Context.context.strokeStyle = "#FF0"
      component.draw(@Context)

    drawInfo: ->
      # TODO: Find where to show data; below circuit, not too high unless we need it
      bottomTextOffset = 100
      ybase = @Circuit.getCircuitBottom - (15 * 1) - bottomTextOffset
      @Context.fillText("t = #{FormatUtils.longFormat(@Circuit.time)} s", 10, 10)
#      @Context.fillText("frames = #{@Circuit.time} s", 10, 20)
      @Context.fillText("F.T. = #{@Circuit.frames}", 10, 20)
#      @Context.fillText("F.T. = #{@Circuit.frames}", 10, 30)

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

    clear: ->
      @Context?.clear()

    getContext: () ->
      return @Context

    getCanvas: () ->
      return @Context?.getCanvas()

    getBuffer: () ->
      return @Context?.getCanvas().toBuffer

    getMouseHandler: () ->
      return @MouseHandler

    getKeyHandler: () ->
      return @keyHandler

    ### Event Listeners
    ####################################################################################################################

    getMousePos: (event) =>
      rect = @CanvasJQueryElm.get(0).getBoundingClientRect()
      return {
      x: event.clientX - rect.left
      y: event.clientY - rect.top
      }

    onMouseMove: (event) =>
      mousePos = @getMousePos(event)

      if @MouseHandler.mouseDown
        @MouseHandler.onMouseDrag(mousePos.x, mousePos.y)
      else
        @MouseHandler.onMouseMove(mousePos.x, mousePos.y)

    onMouseDown: (event) =>
      mousePos = @getMousePos(event)
      @MouseHandler?.onMouseDown(mousePos.x, mousePos.y)

    onMouseUp: (event) =>
      mousePos = @getMousePos(event)
      @MouseHandler?.onMouseUp(mousePos.x, mousePos.y)

    onMouseClick: (event) =>
      mousePos = @getMousePos(event)
      @MouseHandler?.onMouseClick(mousePos.x, mousePos.y)

    # Called on Circuit update:
    repaint: (Circuit) =>
      @drawComponents()
      @drawInfo()

  return CircuitCanvas