# <DEFINE>
define [
  'cs!component/components/WireElm',
  'cs!component/components/ResistorElm',
  'cs!component/components/GroundElm',
  'cs!component/components/VoltageElm',
  'cs!component/components/DiodeElm',
  'cs!component/components/OutputElm',
  'cs!component/components/SwitchElm',
  'cs!component/components/CapacitorElm',
  'cs!component/components/InductorElm',
  'cs!component/components/SparkGapElm',
  'cs!component/components/CurrentElm',
  'cs!component/components/RailElm',
  'cs!component/components/MosfetElm',
  'cs!component/components/TransistorElm',
  'cs!component/components/VarRailElm',
  'cs!component/components/OpAmpElm',
  'cs!component/components/ZenerElm',
  'cs!component/components/Switch2Elm',
  'cs!component/components/TextElm',
  'cs!component/components/ProbeElm'

], (
  WireElm,
  ResistorElm,
  GroundElm,
  VoltageElm,
  DiodeElm,
  OutputElm,
  SwitchElm,
  CapacitorElm,
  InductorElm,
  SparkGapElm,
  CurrentElm,
  RailElm,
  MosfetElm,
  TransistorElm,
  VarRailElm,
  OpAmpElm,
  ZenerElm,
  Switch2Elm,
  TextElm,
  ProbeElm

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
    @ComponentDefs:
      # Working
      'w': WireElm
      'r': ResistorElm
      'g': GroundElm
      'l': InductorElm
      'c': CapacitorElm
      'v': VoltageElm
      'd': DiodeElm
      's': SwitchElm
      '187': SparkGapElm
      'a': OpAmpElm
      'f': MosfetElm

      # Testing
      'R': RailElm
      '172': VarRailElm
      'z': ZenerElm
      'i': CurrentElm
      't': TransistorElm

      # In progress:
      'S': Switch2Elm  # Needs interaction
      'x': TextElm
      'o': ProbeElm
      'O': OutputElm



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
