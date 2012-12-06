Circuit = require './../core/circuit'

class Renderer

  constructor: (@Circuit) ->

  drawComponent: (component) ->


  drawCircuit: ->
    renderContext.clearRect 0, 0, CANVAS.width(), CANVAS.height()

  drawInfo: ->
    # TODO: Find where to show data; below circuit, not too high unless we need it
    bottomTextOffset = 100
    ybase = @Circuit.getCircuitBottom - 15 * 1 - bottomTextOffset
    #ybase = Math.min(ybase, CanvasBounds.height)
    #ybase = Math.max(ybase, @circuitBottom)

  drawWarning: (context) ->
    msg = ""
    for warning in warningStack
      msg += warning + "\n"

    console.error "Simulation Warning: " + msg
    #context.fillText msg, 150, 70

  drawError: (context) ->
    msg = ""
    for error in errorStack
      msg += error + "\n"

    console.error "Simulation Error: " + msg
    #context.fillText msg, 150, 50

module.exports = Renderer