Circuit = require './../core/circuit'
CanvasContext = require './canvasContext'



class Renderer
  constructor: (@Circuit) ->
    @Context = new CanvasContext()

  drawComponents: ->
    for component in @Circuit.getElements()
      @drawComponent(component)

  drawComponent: (component) ->
    component.draw(@Context)

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

  clear: () ->
    @Context.clear()

  getContext: () ->
    return @Context

  getCanvas: () ->
    return @Context.getCanvas()

  getBuffer: () ->
    return @Context.getCanvas().toBuffer

module.exports = Renderer