fs = require "fs"
CircuitEngineParams = require('../core/engineParams')

ComponentDefs = require('../core/componentDefs').ComponentDefs
DumpTypeConversions = require('../core/componentDefs').DumpTypeConversions


class CircuitLoader

  ###
  Retrieves string data from a circuit text file (via AJAX GET)
  ###
  @readCircuitFromFile: (circuit, circuitFileName, onComplete) ->
    circuit.clearAndReset()

    jsonRawData = fs.readFileSync(circuitFileName)
    jsonParsed = JSON.parse(jsonRawData)

    # Circuit Parameters are stored at the header of the .json file (index 0)
    circuitParams = jsonDataArray.shift()
    circuit.Params = new CircuitEngineParams(circuitParams)

    # Load each Circuit component from JSON data:
    for elementData in jsonDataArray
      type = elementData['sym']
      sym = ComponentDefs[type]
      x1 = elementData['x1']
      y1 = elementData['y1']
      x2 = elementData['x2']
      y2 = elementData['y2']
      flags = elementData['flags']
      params = elementData['params']

      if type is 'Hint'
        console.log "Hint found in file!"
      if type is 'Scope'
        console.log "Scope found in file!"

      try
        if !type
          circuit.warn ""
        if !sym
          circuit.warn "Unrecognized dump type: #{type}"
        else
          newCircuitElm = new sym(x1, y1, x2, y2, flags, params)
          circuit.solder newCircuitElm
      catch e
        circuit.halt e.message

    onComplete?()


# The Footer exports class(es) in this file via Node.js, if Node.js is defined.
# This is necessary for testing through Mocha in development mode.
#
# see script/test and the /test directory for details.
#
# To require this class in another file through Node, write {ClassName} = require(<path_to_coffee_file>)
root = module ? window
module.exports = CircuitLoader