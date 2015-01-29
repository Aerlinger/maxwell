CircuitLoader = require('./io/CircuitLoader.coffee')
Circuit = require('./circuit/circuit.coffee')
Renderer = require('./render/renderer.coffee')

class Maxwell
  @Circuits = {}

  @_loadCircuitFromFile: (circuitFileName, onComplete) ->
    return CircuitLoader.createCircuitFromJsonFile(circuitFileName, onComplete)

  @_loadCircuitFromJson: (jsonData) ->
    return CircuitLoader.createCircuitFromJsonData(jsonData)

  @createCircuit: (circuitName, circuitData, onComplete) ->
    circuit = null
#    @circuitName = options['circuitName']

    if circuitName
      if typeof circuitData is "string"
        circuit = Maxwell._loadCircuitFromFile(circuitData, onComplete)
      else if typeof circuitData is "object"
        circuit = Maxwell._loadCircuitFromJson(circuitData)
      else
        raise """
            Parameter must either be a path to a JSON file or raw JSON data representing the circuit.
            Use `Maxwell.createCircuit()` to create a new empty circuit object.
        """
    else
      circuit = new Circuit()

    @Circuits[circuitName] = circuit

    return circuit

Maxwell.Renderer = Renderer

if typeof(window) == "undefined"
  console.log("Not in browser, declaring global Maxwell object")
  global.Maxwell = Maxwell
else
  window.Maxwell = Maxwell



module.exports = Maxwell
