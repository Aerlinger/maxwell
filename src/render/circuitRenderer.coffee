# #######################################################################
# CircuitRenderer:
#     Top-level class specification for a circuit
#
# @author Anthony Erlinger
# @year 2012
#
# Observes: Circuit
# Observed By: CircuitComponent>
#
# #######################################################################

# <DEFINE>
define ['cs!CanvasContext', 'cs!Observer', 'cs!Circuit'], (CanvasContext, Observer, Circuit) ->
# </DEFINE>

  class CircuitRenderer extends Observer

    constructor: (@Circuit, CanvasDomElm) ->
      @Context = new CanvasContext(CanvasDomElm) if CanvasDomElm

      @Circuit.addObserver Circuit.ON_START_UPDATE, @clear
      @Circuit.addObserver Circuit.ON_RESET, @clear
      @Circuit.addObserver Circuit.ON_END_UPDATE, @repaint


    drawComponents: ->
      if @Context
        for component in @Circuit.getElements()
          @drawComponent(component)

    drawComponent: (component) ->
      component.draw(@Context) if @Context

    drawInfo: ->
      # TODO: Find where to show data; below circuit, not too high unless we need it
      bottomTextOffset = 100
      ybase = @Circuit.getCircuitBottom - (15 * 1) - bottomTextOffset

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


    ###
    # Event Listeners:
    ###

    # On Circuit update:
    #   redraw()

    repaint: (Circuit) =>
      @drawComponents()
#      realMouseElm = @mouseElm
#      @mouseElm = @stopElm unless @mouseElm?
#
#      if @stopMessage?
#        @halt @stopMessage
#      else
#        @getCircuitBottom() if @circuitBottom is 0
#
#        # Array of messages to be displayed at the bottom of the canvas
#        info = []
#        if @mouseElm?
#          if @mousePost is -1
#            @mouseElm.getInfo info
#          else
#            info.push "V = " + Units.getUnitText(@mouseElm.getPostVoltage(@mousePost), "V")
#        else
#          Settings.fractionalDigits = 2
#          info.push "t = " + Units.getUnitText(@Solver.time, "s") + "\nft: " + (@lastTime - @lastFrameTime) + "\n"
#        unless @Hint.hintType is -1
#          hint = @Hint.getHint()
#          unless hint
#            @Hint.hintType = -1
#          else
#            info.push hint
#
#        @Renderer.drawInfo(info)
#        @mouseElm = realMouseElm

  return CircuitRenderer