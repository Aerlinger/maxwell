# <DEFINE>
define [
  'cs!WireElm',
  'cs!ResistorElm',
  'cs!GroundElm',
  'cs!VoltageElm',
  'cs!DiodeElm',
  'cs!OutputElm',
  'cs!Oscilloscope'
], (
  WireElm,
  ResistorElm,
  GroundElm,
  VoltageElm,
  DiodeElm,
  OutputElm,
  Oscilloscope
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


  class ComponentRegistry

    @DumpTypeConversions:
      'r':'ResistorElm'
      'w':'WireElm'
      'g':'GroundElm'
      'v':'VoltageElm'
      'd':'DiodeElm'
      'o':'OutputElm'


    @ComponentDefs:
      'w': WireElm
      'r': ResistorElm
      'g': GroundElm
      'v': VoltageElm
      'd': DiodeElm
      'o': OutputElm



    ## #######################################################################################################
    # Loops through through all existing elements defined within the ElementMap Hash (see
    #   <code>ComponentDefinitions.coffee</code>) and registers their class with the solver engine
    # ##########
    @registerAll: ->
      for Component in @.ComponentDefs
        if process.env.NODE_ENV == 'development'
          console.log "Registering Element: #{Component.prototype} "
        @.register(Component)


    #########################################################################################################
    # Registers, constructs, and places an element with the given class name within this circuit.
    #   This method is called by <code>register</code>
    # ##########`
    @register: (componentConstructor) ->
      if !componentConstructor?
        console.error("nil constructor")

      try
      # Create this component by its className
        newComponent = new componentConstructor(0, 0, 0, 0, 0, null)
        dumpType = newComponent.getDumpType()
        dumpClass = componentConstructor

        if !newComponent?
          console.error("Component is nil!")

        if @dumpTypes[dumpType] is dumpClass
          console.log "#{componentConstructor} is a dump class"
          return
        if @dumpTypes[dumpType]?
          console.log "Dump type conflict: " + dumpType + " " + @dumpTypes[dumpType]
          return

        @dumpTypes[dumpType] = componentConstructor
      catch e
        Logger.warn "Element: #{componentConstructor.prototype} Not yet implemented: [#{e.message}]"



  return ComponentRegistry
