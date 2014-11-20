# <DEFINE>
define [
  'jquery'
  'cs!ComponentRegistry',
  'cs!Circuit',
  'cs!Oscilloscope',
  'cs!Hint'
], (
  $,
  ComponentRegistry,
  Circuit,
  Oscilloscope,
  Hint
) ->
# </DEFINE>


  class CircuitLoader

    @parseJSON: (circuit, jsonData) ->
#      try
      circuitParams = jsonData.shift()
      # Circuit Parameters are stored at the header of the .json file (index 0)
      circuit.setParamsFromJSON(circuitParams)

      # Load each Circuit component from JSON data:
      console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");
      console.log("Soldering Components:");
      console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");
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
          circuit.halt "Element: #{JSON.stringify(elementData)} is null"
        if type is Hint
          console.log "Hint found in file!"
        if type is Oscilloscope
          console.log "Scope found in file!"

        if !type
          circuit.warn "Unrecognized Type"
        if !sym
          circuit.warn "Unrecognized dump type: #{type}"
        else
          newCircuitElm = new sym(x1, y1, x2, y2, flags, params)
          console.log(sym)
          circuit.solder newCircuitElm
#      catch e
#        console.error "Failed to parse json #{e.message}"

    ###
    Retrieves string data from a circuit text file (via AJAX GET)
    ###
    @createCircuitFromJSON: (circuitFileName, onComplete = null) ->
      $.getJSON circuitFileName, (jsonData) =>
        circuit = new Circuit()
        CircuitLoader.parseJSON(circuit, jsonData)

        onComplete?(circuit)


  return CircuitLoader
