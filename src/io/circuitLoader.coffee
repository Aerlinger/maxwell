ComponentRegistry = require('../circuit/componentRegistry.coffee')
SimulationParams = require('../core/simulationParams.coffee')

Circuit = require('../circuit/circuit.coffee')
CircuitComponent = require('../circuit/circuitComponent.coffee')
Oscilloscope = require('../scope/oscilloscope.coffee')
Hint = require('../engine/hint.coffee')
fs = require('fs')

VoltageElm = require('../circuit/components/VoltageElm.coffee')

Scope = require('../circuit/components/Scope.coffee')

environment = require("../environment.coffee")

class CircuitLoader
  @createCircuitFromJsonData: (jsonData) ->
    circuit = new Circuit()

    # Valid class identifier name
    validName = /^[$A-Z_][0-9A-Z_$]*$/i

    circuitParams = jsonData.shift()
    circuit.Params = SimulationParams.deserialize(circuitParams)
    circuit.flags = parseInt(circuitParams['flags'])

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

      console.log("#{type} #{x1} #{y1} #{x2} #{y2} #{flags} #{params}")

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
        console.log "-> Scope found in file!"
      else if !type
        circuit.warn "Unrecognized Type"
      else
        try
          newCircuitElm = new sym(x1, y1, x2, y2, params, parseInt(flags))
        catch e
          console.log(e)
          console.log("type: #{type}, sym: #{sym}")
          console.log("elm: ", elementData)
          console.log(e.stack)

          unless environment.isBrowser
            process.exit(1)

        elms.push(newCircuitElm)
        circuit.solder newCircuitElm

    if elms.length == 0
      console.error "No elements loaded. JSON most likely malformed"

    unless environment.isBrowser
      circuit.ostream ||= fs.createWriteStream("dump/#{circuit.Params.name}")

    console.log("--------------------------------------------------------------------\n")

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
