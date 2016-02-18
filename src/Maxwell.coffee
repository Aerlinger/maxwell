CircuitComponent = require('./circuit/circuitComponent.coffee')
CircuitLoader = require('./io/circuitLoader.coffee')
ComponentRegistry = require('./circuit/componentRegistry.coffee')
Circuit = require('./circuit/circuit.coffee')
Renderer = require('./render/renderer.coffee')

environment = require("./environment.coffee")

unless environment.isBrowser
  Winston = require('winston')

class Maxwell
  version = "0.0.0"

  @OhmSymbol: "Ω"
  @MuSymbol: "μ"

  @Circuits = {}

  @Components = (v for k,v of ComponentRegistry.ComponentDefs)

  if environment.isBrowser
    @logger = console
  else
    @logger = new (Winston.Logger)({
      transports: [
        new (Winston.transports.Console)(),
        new (Winston.transports.File)({ filename: 'log/maxwell.log' })
      ]
    })

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
        throw new Error("""
          Parameter must either be a path to a JSON file or raw JSON data representing the circuit.
          Use `Maxwell.createCircuit()` to create a new empty circuit object.
        """)
    else
      circuit = new Circuit()

    @Circuits[circuitName] = circuit

    return new Renderer(circuit, canvas)

  @createContext: (circuitName, circuitData, context, onComplete) ->
    circuit = null

    if circuitName
      if typeof circuitData is "string"
        circuit = Maxwell.loadCircuitFromFile circuitData, (circuit) ->
          onComplete(new Renderer(circuit, context))

      else if typeof circuitData is "object"
        circuit = Maxwell.loadCircuitFromJson(circuitData)
      else
        throw new Error("""
          Parameter must either be a path to a JSON file or raw JSON data representing the circuit.
          Use `Maxwell.createCircuit()` to create a new empty circuit object.
        """)
    else
      circuit = new Circuit()

    @Circuits[circuitName] = circuit

#    return new Renderer(circuit, context)


Maxwell.Renderer = Renderer

if environment.isBrowser
  window.Maxwell = Maxwell
else
  console.log("Not in browser, declaring global Maxwell object")
  global.Maxwell = Maxwell

module.exports = Maxwell
