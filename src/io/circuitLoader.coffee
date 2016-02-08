ComponentRegistry = require('../circuit/componentRegistry')
SimulationParams = require('../core/simulationParams')

Circuit = require('../circuit/circuit')
CircuitComponent = require('../circuit/circuitComponent')
Oscilloscope = require('../scope/oscilloscope')
Hint = require('../engine/hint')
fs = require('fs')

VoltageElm = require('../circuit/components/VoltageElm')

Scope = require('../circuit/components/Scope')

environment = require("../environment")

class CircuitLoader
  @createCircuitFromJsonData: (jsonData) ->
    circuit = new Circuit()

    # Valid class identifier name
    validName = /^[$A-Z_][0-9A-Z_$]*$/i

    circuitParams = jsonData.shift()
    circuit.Params = SimulationParams.deserialize(circuitParams)
    circuit.flags = circuitParams['flags']

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

      flags = parseInt(elementData['flags']) || 0

      params = elementData['params']

      if !sym
        circuit.warn "No matching component for #{type}: #{sym}"
      else if type is "h"
        console.log "Hint found in file!"

        #  TODO: Proper types
        @hintType = x1
        @hintItem1 = x2
        @hintItem2 = y1
        break;
      else if sym is Scope
        console.log "Scope found in file!"
      else if !type
        circuit.warn "Unrecognized Type"
      else
#        params['flags'] = flags
#        params.unshift(flags)

        try
          console.log(params)
          newCircuitElm = new sym(x1, y1, x2, y2, params, flags)
        catch e
          console.log(e)
          console.log("type: #{type}, sym: #{sym}")
          console.log("elm: ", elementData)
          console.log(e.stack)
          process.exit(1);

        elms.push(newCircuitElm)
        circuit.solder newCircuitElm

    if elms.length == 0
      console.error "No elements loaded. JSON most likely malformed"

    circuit.ostream ||= fs.createWriteStream("dump/#{circuit.Params.name}")

    return circuit

  ###
  Retrieves string data from a circuit text file (via AJAX GET)
  ###
  @createCircuitFromJsonFile: (circuitFileName, onComplete = null) ->
    if environment.isBrowser
      $.getJSON circuitFileName, (jsonData) ->
        circuit = CircuitLoader.createCircuitFromJsonData(jsonData)

        onComplete?(circuit)
    else
      jsonData = JSON.parse(fs.readFileSync(circuitFileName))
      CircuitLoader.createCircuitFromJsonData(jsonData)

      

module.exports = CircuitLoader
