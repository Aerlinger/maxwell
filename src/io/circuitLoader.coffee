CircuitSolver = require('../engine/circuitSolver.coffee')


SimulationParams = require('../core/SimulationParams.coffee')
Circuit = require('../circuit/Circuit.coffee')
Oscilloscope = require('../scope/Oscilloscope.coffee')
Hint = require('../engine/Hint.coffee')

class CircuitLoader
  @createCircuitFromJsonData: (jsonData) ->
    ComponentRegistry = require('../circuit/ComponentRegistry.coffee')

    console.log("CS1: ", CircuitSolver)

    circuit = new Circuit()

    # Valid class identifier name
    validName = /^[$A-Z_][0-9A-Z_$]*$/i

    # Circuit Parameters are stored at the header of the .json file (index 0)
    circuitParams = jsonData.shift()
#    circuit.Params = new SimulationParams(circuitParams)
    circuit.Params = SimulationParams.deserialize(circuitParams)

    console.log(circuit.Params.toString())

    # Load each Circuit component from JSON data:
    elms = []

    for elementData in jsonData
      type = elementData['sym']

      if type in Circuit.components
        console.log("Found #{type}...")

      sym = ComponentRegistry.ComponentDefs[type]
      x1 = parseInt elementData['x1']
      y1 = parseInt elementData['y1']
      x2 = parseInt elementData['x2']
      y2 = parseInt elementData['y2']

      flags = parseInt elementData['flags']

      params = elementData['params']

      if !sym
        circuit.warn "No matching component for #{type}: #{sym}"
#        circuit.halt "Element: #{JSON.stringify(elementData)} is null"
      else if type is Hint
        console.log "Hint found in file!"
      else if type is Oscilloscope
        console.log "Scope found in file!"
      else if !type
        circuit.warn "Unrecognized Type"
#      if _.isEmpty(sym)
#        circuit.warn "Component could not be added to circuit. Unrecognized component symbol: #{type}."
      else
#        console.log(sym)
        newCircuitElm = new sym(x1, y1, x2, y2, params)

        elms.push(newCircuitElm)

        circuit.solder newCircuitElm

    if elms.length == 0
      console.error "No elements loaded. JSON most likely malformed"

    return circuit

  ###
  Retrieves string data from a circuit text file (via AJAX GET)
  ###
  @createCircuitFromJsonFile: (circuitFileName, onComplete = null) ->
    $.getJSON circuitFileName, (jsonData) ->
      circuit = CircuitLoader.createCircuitFromJsonData(jsonData)

      onComplete?(circuit)
      

module.exports = CircuitLoader
