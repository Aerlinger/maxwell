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

  class ConfigurationLoader

    ###
    Configures interface from JSON file
    ###
    @configureInterface: (Circuit, retry) ->
      # Todo:
      # 1: Read all components, and their corresponding types
      # 2: Read Sample Circuits (and default circuit)
      # 3: Load Color Scheme

    @createFromJSON: (circuitFileName, Context = null, onComplete = null) ->

      $.getJSON circuitFileName, (jsonParsed) ->
        circuit = new Circuit(Context)

        # Circuit Parameters are stored at the header of the .json file (index 0)
        circuitParams = jsonParsed.shift()
        circuit.Params = new CircuitEngineParams(circuitParams)

        # Load each Circuit component from JSON data:
        for elementData in jsonParsed
          type = elementData['sym']
          sym = ComponentRegistry.ComponentDefs[type]
          x1 = parseInt elementData['x1']
          y1 = parseInt elementData['y1']
          x2 = parseInt elementData['x2']
          y2 = parseInt elementData['y2']
          flags = parseInt elementData['flags']
          params = elementData['params']

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
            circuit.halt e.message

        onComplete(circuit)
