# <DEFINE>
define [
  'jquery'
  'cs!ComponentRegistry',
  'cs!SimulationParams',
  'cs!Circuit',
  'cs!Oscilloscope',
  'cs!Hint'
], (
  $,
  ComponentRegistry,
  SimulationParams,
  Circuit,
  Oscilloscope,
  Hint
) ->
# </DEFINE>


  class CircuitLoader

    @createCircuitFromJsonData: (jsonData) ->
      circuit = new Circuit()

      # Circuit Parameters are stored at the header of the .json file (index 0)
      circuitParams = jsonData.shift()
      circuit.Params = new SimulationParams(jsonData)

      console.log(circuit.Params.toString())

      # Load each Circuit component from JSON data:
      console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");
      console.log("Soldering Components:");
      console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");
      elms = []

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

          elms.push(newCircuitElm)

          circuit.solder newCircuitElm

      if elms.length == 0
        console.error "No elements loaded. JSON most likely malformed"

      return circuit



    ###
    Retrieves string data from a circuit text file (via AJAX GET)
    ###
    @createCircuitFromJsonFile: (circuitFileName, onComplete = null) ->
      $.getJSON circuitFileName, (jsonData) =>
        circuit = CircuitLoader.createCircuitFromJsonData(jsonData)

        onComplete?(circuit)


  return CircuitLoader
