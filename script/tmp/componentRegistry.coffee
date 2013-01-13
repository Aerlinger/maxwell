# <DEFINE> 
define([
  'cs!=',
], (
  '=',
) ->
# </DEFINE> 


# ElementMap
#
#   A Hash Map of circuit components within Maxwell
#
#   Each hash element is a key-value pair of the format {"ElementName": "ElementDescription"}
#
#   Elements that are tested working are prefixed with a '+'
#   Elements that are implemented but not tested have their names (key) prefixed with a '#'
#   Elements that are not yet implemented have their names (key) prefixed with a '-'



DumpTypeConversions = {
  'r':'ResistorElm'
  'w':'WireElm'
  'g':'GroundElm'
  'v':'VoltageElm'
}


ComponentDefs = {
  'w': WireElm
  'r': ResistorElm
  'g': GroundElm
  'v': VoltageElm
}

class ComponentRegistry


#  DumpTypes =
#    "o" : Scope::
#    "h" : Scope::
#    "$" : Scope::
#    "%" : Scope::
#    "?" : Scope::
#    "B" : Scope::

  DumpTypeConversions:
    'r':'ResistorElm'
    'w':'WireElm'
    'g':'GroundElm'
    'v':'VoltageElm'


  ComponentDefs:
    'w': WireElm
    'r': ResistorElm
    'g': GroundElm
    'v': VoltageElm



  @registerAll: () ->
    for symbol, constructor of ComponentDefs
      console.log "#{symbol}  #{constructor}"


  #########################################################################################################
  # Registers, constructs, and places an element with the given class name within this circuit.
  #   This method is called by <code>register</code>
  # ##########`
  register: (componentConstructor) ->
    try
    # Create this component by its className
      newComponent = new componentConstructor 0, 0, 0, 0, 0, null
      dumpType = newComponent.getDumpType()
      dumpClass = componentConstructor

      if @dumpTypes[dumpType] is dumpClass
        console.log "#{componentConstructor} is a dump class"
        return
      if @dumpTypes[dumpType]?
        console.log "Dump type conflict: " + dumpType + " " + @dumpTypes[dumpType]
        return

      @dumpTypes[dumpType] = componentConstructor
    catch e
      if process.env.NODE_ENV == 'development'
        Logger.warn "Element: #{componentConstructor.prototype} Not yet implemented: [#{e.message}]"



exports.ComponentDefs = ComponentDefs
exports.DumpTypeConversions = DumpTypeConversions
