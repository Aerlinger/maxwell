# <DEFINE>
define [
  'jquery'
  'cs!ComponentRegistry',
  'cs!Circuit'
], (
  $,
  ComponentRegistry,
  Circuit
) ->
# </DEFINE>


  class CircuitLoader

    @parseJSON: (circuit, jsonData) ->

      circuitParams = jsonData.shift()
      # Circuit Parameters are stored at the header of the .json file (index 0)
      circuit.setParamsFromJSON(circuitParams)

      # Load each Circuit component from JSON data:
      for elementData in jsonData
        type = elementData['sym']
        sym = ComponentRegistry.ComponentDefs[type]
        x1 = parseInt elementData['x1']
        y1 = parseInt elementData['y1']
        x2 = parseInt elementData['x2']
        y2 = parseInt elementData['y2']
        flags = parseInt elementData['flags']
        params = elementData['params']

        if sym is null
          circuit.halt "Element: #{JSON.stringify(elementData)}"

        if type is 'Hint'
          console.log "Hint found in file!"
        if type is 'Oscilloscope'
          console.log "Scope found in file!"

        try
          if !type
            circuit.warn "Unrecognized Type"
          if !sym
            circuit.warn "Unrecognized dump type: #{type}"
          else
            newCircuitElm = new sym(x1, y1, x2, y2, flags, params)
            circuit.solder newCircuitElm
        catch e
#          circuit.halt e.message + "#{elementData["sym"]}"
          console.error e.message + "#{elementData["sym"]}"

    ###
    Retrieves string data from a circuit text file (via AJAX GET)
    ###
    @createCircuitFromJSON: (circuitFileName, onComplete = null) ->
      $.getJSON circuitFileName, (jsonData) =>
        circuit = new Circuit(context)
        CircuitLoader.parseJSON(circuit, jsonData)

        onComplete?(circuit)


  return CircuitLoader
