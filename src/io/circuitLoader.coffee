
fs = require "fs"
CircuitEngineParams = require('../core/circuitParams')

ComponentDefs = require('../component/componentRegistry').ComponentDefs
DumpTypeConversions = require('../component/componentRegistry').DumpTypeConversions


class CircuitLoader

  ###
  Retrieves string data from a circuit text file (via AJAX GET)
  ###
  @readCircuitFromFile: (circuit, circuitFileName, onComplete) ->
    circuit.clearAndReset()

    jsonRawData = fs.readFileSync(circuitFileName)
    jsonParsed = JSON.parse(jsonRawData)

    # Circuit Parameters are stored at the header of the .json file (index 0)
    circuitParams = jsonParsed.shift()
    circuit.Params = new CircuitEngineParams(circuitParams)

    # Load each Circuit component from JSON data:
    for elementData in jsonParsed
      type = elementData['sym']
      sym = ComponentDefs[type]
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

    # Now that we're finished, Call the callback passed to this function if it exists.
    onComplete?()


# The Footer exports class(es) in this file via Node.js, if Node.js is defined.
# This is necessary for testing through Mocha in development mode.
#
# see script/test and the /test directory for details.
#
# To require this class in another file through Node, write {ClassName} = require(<path_to_coffee_file>)
root = module ? window
module.exports = CircuitLoader
