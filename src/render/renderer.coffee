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

module.exports = Renderer