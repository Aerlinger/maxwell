# #######################################################################
# KeyHandler:
#     Handles state for control keydown, etc...
#
# @author Anthony Erlinger
# @year 2013
#
# Observes: CircuitCanvas
#
# #######################################################################

define [], () ->

  class KeyHandler

    @KEY_DOWN = "KEY_DOWN"
    @KEY_UP = "KEY_UP"

    constructor: (@Circuit) ->
      @KeyHandler = @KEY_DOWN

    setState: (newState) ->
      if newState in [@MOUSE_DOWN, @MOUSE_UP]
        @keyState = newState
      else
        throw Error("State #{newState} is not a valid state")