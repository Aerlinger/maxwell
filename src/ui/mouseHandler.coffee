# #######################################################################
# MouseHandler:
#     A basic state machine to store the current mouse state
#
# @author Anthony Erlinger
# @year 2013
#
# Observes: CircuitCanvas
#
# #######################################################################

define ['cs!Point'], (Point) ->

  class MouseHandler

    constructor: (@Circuit) ->
      @mouseDown = false
      @mouseUp = false
      @mouseDownLocation = new Point()
      @mouseUpLocation = new Point()
      @mouseLocation = new Point()
      @mouseDragLocation = new Point()
      @mouseClickLocation = new Point()

    setState: (newState) ->
      if newState in [@MOUSE_DOWN, @MOUSE_UP]
        @mouseState = newState
      else
        throw Error("State #{newState} is not a valid state")

    onMouseDown: (x, y) ->
      @mouseDownLocation = new Point(x, y)
      @mouseDown = true
      @mouseUp = false
      console.log "DOWN: #{x}, #{y}"

    onMouseUp: (x, y) ->
      @mouseUpLocation = new Point(x, y)
      @mouseUp = true
      @mouseDown = false
      @dragging = false
      console.log "UP: #{x}, #{y}"

    onMouseDrag: (x, y) ->
      @mouseLocation = new Point(x, y)
      @dragging = true

    onMouseClick: (x, y) ->
      @mouseClickLocation = new Point(x, y)


  return MouseHandler