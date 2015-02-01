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

Oscilloscope = require('../scope/oscilloscope.coffee')
Logger = require('../io/logger.coffee')
SimulationParams = require('../core/simulationParams.coffee')
CircuitSolver = require('../engine/circuitSolver.coffee')
Observer = require('../util/observer.coffee')

class Circuit extends Observer

  # Messages Dispatched to listeners:
  ####################################################################################################################

  @ON_START_UPDATE = "ON_START_UPDATE"
  @ON_COMPLETE_UPDATE = "ON_END_UPDATE"

  @ON_RESET = "ON_RESET"

  @ON_SOLDER = "ON_SOLDER"
  @ON_DESOLDER = "ON_DESOLDER"

  @ON_ADD_COMPONENT = "ON_ADD_COMPONENT"
  @ON_REMOVE_COMPONENT = "ON_MOVE_COMPONENT"
  @ON_MOVE_COMPONENT = "ON_MOVE_COMPONENT"

  @ON_ERROR = "ON_ERROR"
  @ON_WARNING = "ON_WARNING"


  constructor: ->
    @Params = new SimulationParams()

    @clearAndReset()


  ## Removes all circuit elements and scopes from the workspace and resets time to zero.
  ##   Called on initialization and reset.
  clearAndReset: ->
    for element in @elementList?
      element.destroy()

    @Solver = new CircuitSolver(this)

    @nodeList = []
    @elementList = []
    @voltageSources = []

    @scopes = []

    @time = 0
    @iterations = 0

    @clearErrors()
    @notifyObservers @ON_RESET


  # "Solders" a new element to this circuit (adds it to the element list array).
  solder: (newElement) ->
#    console.log("\tSoldering #{newElement}: #{newElement.dump()}")
    @notifyObservers @ON_SOLDER

    newElement.Circuit = this
    newElement.setPoints()
    @elementList.push newElement

  # "Desolders" an existing element to this circuit (removes it to the element list array).
  desolder: (component, destroy = false) ->
    @notifyObservers @ON_DESOLDER

    component.Circuit = null
    @elementList.remove component
    if destroy
      component.destroy()

  toString: ->
    @Params

  invalidate: ->
    @Solver.analyzeFlag = true


  ####################################################################################################################
  ### Simulation Frame Computation
  ####################################################################################################################

  ###
  UpdateCircuit: Updates the circuit each frame.
    1. ) Reconstruct Circuit:
          Rebuilds a data representation of the circuit (only applied when circuit changes)
    2. ) Solve Circuit build matrix representation of the circuit solve for the voltage and current for each component.
          Solving is performed via LU factorization.
  ###
  updateCircuit: ->
    @notifyObservers(@ON_START_UPDATE)

    @Solver.reconstruct()

    if @Solver.isStopped
      @Solver.lastTime = 0
    else
      @Solver.solveCircuit()

    @notifyObservers(@ON_COMPLETE_UPDATE)

  setSelected: (component) ->
    for elm in @elementList
      if elm == component
#        console.log("Selected: #{component.dump()}")
        @selectedElm = component
        component.setSelected(true)

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
  ### Circuit Element Accessors:
  ####################################################################################################################

  # TODO: Scopes aren't implemented yet
  getScopes: ->
    []

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

  #TODO: It may be worthwhile to return a defensive copy here
  getVoltageSources: ->
    @voltageSources


  ####################################################################################################################
  ### Nodes
  ####################################################################################################################

  resetNodes: ->
    @nodeList = []

  addCircuitNode: (circuitNode) ->
    @nodeList.push circuitNode

  getNode: (idx) ->
    @nodeList[idx]

  #TODO: It may be worthwhile to return a defensive copy here
  getNodes: ->
    @nodeList

  numNodes: ->
    @nodeList.length

  findBadNodes: ->
    @badNodes = []

    for circuitNode in @nodeList
      if not circuitNode.intern and circuitNode.links.length is 1
        numBadPoints = 0
        firstCircuitNode = circuitNode.links[0]
        for circuitElm in @elementList
          # If firstCircuitNode isn't the same as the second
          if firstCircuitNode.elm.equalTo(circuitElm) is false and circuitElm.boundingBox.contains(circuitNode.x,
            circuitNode.y)
            numBadPoints++
        if numBadPoints > 0
          # Todo: outline bad nodes here
          @badNodes.push circuitNode

    return @badNodes


  ####################################################################################################################
  ### Simulation Accessor Methods
  ####################################################################################################################

  subIterations: ->
    @Solver.subIterations

  eachComponent: (callback) ->
    for component in @elementList
      callback(component)

  isStopped: ->
    @Solver.isStopped

  timeStep: ->
    @Params.timeStep

  voltageRange: ->
    return @Params.voltageRange

  powerRange: ->
    return @Params.powerRange

  currentSpeed: ->
    return @Params.currentSpeed

  getState: ->
    return @state

  getStamper: ->
    @Solver.getStamper()


module.exports = Circuit
