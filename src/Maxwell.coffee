CircuitLoader = require('./io/CircuitLoader.coffee')
Circuit = require('./circuit/circuit.coffee')
Renderer = require('./render/renderer.coffee')
DrawHelper = require('./render/drawHelper.coffee')

class Maxwell
  version = "0.0.0"

  @OhmSymbol: "Ω"
  @MuSymbol: "μ"

  @Circuits = {}

  @loadCircuitFromFile: (circuitFileName, onComplete) ->
    circuit = CircuitLoader.createCircuitFromJsonFile(circuitFileName, onComplete)
    @Circuits[circuitFileName] = circuit

    return circuit

  @loadCircuitFromJson: (jsonData) ->
    circuit = CircuitLoader.createCircuitFromJsonData(jsonData)

    @Circuits[circuitFileName] = circuit

    return circuit

  @createCircuit: (circuitName, circuitData, onComplete) ->
    circuit = null

    if circuitName
      if typeof circuitData is "string"
        circuit = Maxwell.loadCircuitFromFile(circuitData, onComplete)
      else if typeof circuitData is "object"
        circuit = Maxwell.loadCircuitFromJson(circuitData)
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
