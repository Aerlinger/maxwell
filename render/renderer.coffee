class Renderer

  constructor: (@Circuit) ->

  drawCircuitElement: (CircuitElm) ->

  drawCircuit: ->
    renderContext.clearRect 0, 0, CANVAS.width(), CANVAS.height()

module.exports = Renderer