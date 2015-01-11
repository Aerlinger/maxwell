define [
  'cs!CircuitLoader',
  'cs!CircuitCanvas',
  'cs!Circuit'
],
(
  CircuitLoader,
  CircuitCanvas,
  Circuit
) ->

  class Maxwell
    @Circuits = {}

    constructor: (canvas, options = {}) ->
      @Circuit = null
      @circuitName = options['circuitName']

      if @circuitName
        CircuitLoader.createCircuitFromJSON @circuitName, (circuit) =>
          @Circuit = circuit

          new CircuitCanvas(@Circuit, canvas)

    @loadCircuitFromFile: (circuitFileName) ->
      return CircuitLoader.createCircuitFromJSON(circuitFileName)

    @loadCircuitFromJson: (jsonData) ->
      circuit = new Circuit()
      CircuitLoader.parseJSON(circuit, jsonData)

      return circuit

    @createCircuitSync: (circuitName, circuitData) ->

    @createCircuit: (circuitName, circuitData) ->
      circuit = null

      if circuitData
        if typeof circuitData is "string"
          circuit = Maxwell.loadCircuitFromFile(circuitData)
        else if typeof circuitData is "object"
          circuit = Maxwell.loadCircuitFromJson(circuitData)
        else
          raise "Parameter must either be a path to a JSON file or raw JSON data representing the circuit. Use `Maxwell.createCircuit()` to create a new empty circuit object."
      else
        circuit new circuitData()

      @Circuits[circuitName] = circuit

      return circuit