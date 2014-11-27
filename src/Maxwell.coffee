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

          new CircuitCanvas(@Circuit, canvas)
