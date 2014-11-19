define [
  'cs!CircuitLoader',
  'cs!CircuitCanvas'
],
(
  CircuitLoader,
  CircuitCanvas
) ->

  class Maxwell
    constructor: (canvas, options = {}) ->
      @Circuit = null
      @circuitName = options['circuitName']

      if @circuitName
        CircuitLoader.createCircuitFromJSON @circuitName, (circuit) =>
          @Circuit = circuit

          console.log("Loading: " + @circuitName)

          new CircuitCanvas(@Circuit, canvas, canvas.width, canvas.height)

          @start()

    start: ->
      @Circuit.updateCircuit()

      setInterval =>
        @Circuit.updateCircuit()
      , 0