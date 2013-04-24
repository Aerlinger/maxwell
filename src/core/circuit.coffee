####################################################################################################################

# Circuit:
#     Top-level class for defining a Circuit. An array of components, and nodes are managed by a central
#     solver that updates and recalculates the conductance matrix every frame.
#
# @author Anthony Erlinger
# @date 2011-2013
#
# Uses the Observer Design Pattern:
#   Observes: <none>
#   Observed By: Solver, Render
#
#
# Event Message Passing interface:
#   ON_UPDATE
#   ON_PAUSE
#   ON_RESUME
#
#   ON_ADD_COMPONENT
#   ON_REMOVE_COMPONENT
#
####################################################################################################################

# <DEFINE>
define [
  'cs!KeyboardState',
  'cs!Oscilloscope',
  'cs!Logger',
  'cs!ColorMapState',
  'cs!CircuitState',
  'cs!CircuitCanvas',
  'cs!Point',
  'cs!Rectangle',
  'cs!Polygon',
  'cs!Grid',
  'cs!CircuitEngineParams',
  'cs!MouseState',
  'cs!Settings',
  'cs!ComponentRegistry',
  'cs!Hint',
  'cs!CommandHistory',
  'cs!CircuitSolver',
  'cs!Units',
  'cs!Module',
  'cs!Observer'
], (
  KeyboardState,
  Oscilloscope,
  Logger,
  ColorMapState,
  CircuitState,
  CircuitCanvas,
  Point,
  Rectangle,
  Polygon,
  Grid,
  CircuitEngineParams,
  MouseState,
  Settings,
  ComponentRegistry,
  Hint,
  CommandHistory,
  CircuitSolver,
  Units,
  Module,
  Observer
) ->
# </DEFINE>

  class Circuit extends Observer

    # Messages Dispatched to listeners:
    ####################################################################################################################

    @ON_START_UPDATE = "ON_START_UPDATE"
    @ON_COMPLETE_UPDATE = "ON_END_UPDATE"

    @ON_START = "ON_START"
    @ON_PAUSE = "ON_PAUSE"
    @ON_RESET = "ON_RESET"

    @ON_SOLDER = "ON_SOLDER"
    @ON_DESOLDER = "ON_DESOLDER"

    @ON_ADD_COMPONENT = "ON_ADD_COMPONENT"
    @ON_REMOVE_COMPONENT = "ON_MOVE_COMPONENT"
    @ON_MOVE_COMPONENT = "ON_MOVE_COMPONENT"

    @ON_ERROR = "ON_ERROR"
    @ON_WARNING = "ON_WARNING"


    constructor: () ->
      @Params = new CircuitEngineParams()
      @CommandHistory = new CommandHistory()

      @clearAndReset()
      @bindListeners()

    # Simulator
    setParamsFromJSON: (jsonData) ->
      @Params = new CircuitEngineParams(jsonData)


    ###################################################################################################################
    ## Removes all circuit elements and scopes from the workspace and resets time to zero.
    ##   Called on initialization and reset.
    ###################################################################################################################
    clearAndReset: ->
      # TODO: Prompt to save before destroying components
      for element in @elementList?
        element.destroy()

      @Solver = new CircuitSolver(this)
      @Grid = new Grid()

      @nodeList = []
      @elementList = []
      @voltageSources = []

      @scopes = []
      @scopeColCount = []  # Array of integers

      @time = 0
      @lastTime = 0

      # State Handlers
      @mouseState = new MouseState()
      @keyboardState = new KeyboardState()
      @colorMapState = new ColorMapState()

      @state = CircuitState.RUNNING
      @clearErrors()
      @notifyObservers @ON_RESET


    bindListeners: ->
#      @Solver
      #bind(@Solver.completeStep, )

    # "Solders" a new element to this circuit (adds it to the element list array).
    solder: (newElement) ->
      @notifyObservers @ON_SOLDER

      newElement.Circuit = this
      newElement.setPoints()
      console.log("Soldering Element: " + newElement)
      @elementList.push newElement

    # "Desolders" an existing element to this circuit (removes it to the element list array).
    desolder: (component, destroy = false) ->
      @notifyObservers @ON_DESOLDER

      component.Circuit = null
      @elementList.remove component
      if destroy
        component.destroy()

    #TODO: It may be worthwhile to return a defensive copy here
    getVoltageSources: ->
      @voltageSources


    ####################################################################################################################
    # Oscilloscope Accessor:
    ####################################################################################################################

    # TODO: Scopes aren't implemented yet
    getScopes: ->
      []

    setupScopes: ->


    ####################################################################################################################
    ### Circuit Element Accessors:
    ####################################################################################################################

    findElm: (searchElm) ->
      for circuitElm in @elementList
        return circuitElm if searchElm == circuitElm
      return false

    #TODO: It may be worthwhile to return a defensive copy here
    getElements: ->
      @elementList

    getElmByIdx: (elmIdx) ->
      return @elementList[elmIdx]

    numElements: ->
      return @elementList.length


    ####################################################################################################################
    ### Circuit Nodes:
    ####################################################################################################################

    resetNodes: ->
      @nodeList = []

    addCircuitNode: (circuitNode) ->
      @nodeList?.push circuitNode

    getNode: (idx) ->
      @nodeList[idx]

    #TODO: It may be worthwhile to return a defensive copy here
    getNodes: ->
      @nodeList

    numNodes: ->
      @nodeList?.length

    getGrid: ->
      return @Grid

    findBadNodes: ->
      @badNodes = []
      for circuitNode in @nodeList
        if not circuitNode.intern and circuitNode.links.length is 1
          numBadPoints = 0
          firstCircuitNode = circuitNode.links[0]
          for circuitElm in @elementList
            #console.log "Compare: #{firstCircuitNode.elm.equal_to(circuitElm)} #{circuitElm.boundingBox.contains(circuitNode.x, circuitNode.y)}"
            # If firstCircuitNode isn't the same as the second
            if firstCircuitNode.elm.equal_to(circuitElm) is false\
                and circuitElm.boundingBox.contains(circuitNode.x, circuitNode.y)
              numBadPoints++
          if numBadPoints > 0
            # Todo: outline bad nodes here
            @badNodes.push circuitNode
      return @badNodes


    ####################################################################################################################
    ### Simulation Frame Computation
    ####################################################################################################################

    run: ->
      @notifyObservers @ON_START
      @Solver.run()

    pause: ->
      @notifyObservers @ON_PAUSE
      @Solver.pause("Circuit is paused")

    restartAndStop: ->
      @restartAndRun()
      @simulation = cancelAnimationFrame()
      @Solver.pause("Restarted Circuit from time 0")

    restartAndRun: ->
      if(!@Solver)
        halt("Solver not initialized!");

    reset: ->
      element.reset() for element in @elementList
      scope.resetGraph() for scope in @scopes

      @Solver.reset()


    ####################################################################################################################
    ### Simulation Frame Computation
    ####################################################################################################################

    ###
    UpdateCircuit:

     Updates the circuit each frame.

      1. ) Reconstruct Circuit:
            Rebuilds a data representation of the circuit (only applied when circuit changes)
      2. ) Solve Circuit build matrix representation of the circuit solve for the voltage and current for each component.
            Solving is performed via LU factorization.
    ###
    updateCircuit: () ->
      @notifyObservers(@ON_START_UPDATE)
      #@simulation = requestAnimationFrame(Circuit.prototype.updateCircuit, @)
      startTime = (new Date()).getTime()

      # Reconstruct circuit
      @Solver.reconstruct()

      # If the circuit isn't stopped,
      unless @Solver.isStopped
        @Solver.solveCircuit()
        @lastTime = @updateTimings()
      else
        @lastTime = 0

      @notifyObservers(@ON_COMPLETE_UPDATE)

      endTime = (new Date()).getTime()
      frameTime = endTime - startTime
      @lastFrameTime = @lastTime


    # Returns the y position of the bottom of the circuit
    getCircuitBottom: ->
      if @circuitBottom
        return @circuitBottom

      for element in @elementList
        rect = element.boundingBox
        bottom = rect.height + rect.y
        @circuitBottom = bottom if (bottom > @circuitBottom)

      return @circuitBottom

    recalculateCircuitBounds: ->
      maxX = Number.MIN_VALUE
      maxY = Number.MIN_VALUE
      minX = Number.MAX_VALUE
      minY = Number.MAX_VALUE

      for element in @elementList
        bounds = element.boundingBox
        if bounds.x < minX
          minX = bounds.x
        if bounds.y < minY
          minY = bounds.y
        if (bounds.width + bounds.x) > maxX
          maxX = (bounds.height + bounds.x)
        if (bounds.height + bounds.y) > maxY
          maxY = (bounds.height + bounds.y)

        @circuitBounds = new Rectangle(minX, minY, maxX-minX, maxY-minY)


    updateTimings: () ->
      sysTime = (new Date()).getTime()
      #if @lastTime != 0
      inc = Math.floor(sysTime - @lastTime)
      currentSpeed = Math.exp(@Params.currentSpeed / 3.5 - 14.2)
      @Params.currentMult = 1.7 * inc * currentSpeed

      if (sysTime - @secTime) >= 1000
        @framerate = @frames
        @steprate = @Solver.steps
        @frames = 0
        @steps = 0
        @secTime = sysTime

      @frames++
      return sysTime


    warn: (message) ->
      Logger.warn message
      @warnMessage = message

    halt: (message) ->
      Logger.error message
      @stopMessage = message

    clearErrors: ->
      @stopMessage = null
      @stopElm = null


    ####################################################################################################################
    ### Simulation Accessor Methods
    ####################################################################################################################

    isStopped: ->
      @Solver.isStopped

    voltageRange: ->
      return @Params['voltageRange']

    powerRange: ->
      return @Params['powerRange']

    currentSpeed: ->
      return 62
      #return @Params['currentMult']

    getState: ->
      return @state


  return Circuit
