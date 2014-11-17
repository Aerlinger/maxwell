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

    constructor: (@Context, @Circuit) ->
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

    onMouseMove: (x, y) ->
      @Context.context.fillStyle = "#FFFFFF"
      @Context.context.fillRect(150, 0, 200, 20)
      @Context.context.fillStyle = "#000"
      @Context.fillText("Mouse: (#{Math.floor(x)}, #{Math.floor(y)})", 150, 10)

      for component in @Circuit.elementList
        x1 = component.boundingBox.x
        x2 = component.boundingBox.x + component.boundingBox.width
        y1 = component.boundingBox.y
        y2 = component.boundingBox.y + component.boundingBox.height
#        console.log(x1, x2, y1, y2)
        if (x > x1 and x < x2) and (y > y1 and y < y2)
          @Circuit.setSelected(component)
#          console.log("Hit: #{component.dump()}")

    onMouseDrag: (x, y) ->
      @mouseLocation = new Point(x, y)
      @dragging = true

    onMouseClick: (x, y) ->
      @mouseClickLocation = new Point(x, y)


  return MouseHandler