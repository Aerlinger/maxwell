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
SimulationFrame = require('./simulationFrame.coffee')
CircuitSolver = require('../engine/circuitSolver.coffee')
Observer = require('../util/observer.coffee')
Rectangle = require('../geom/rectangle.coffee')
Util = require('../util/util.coffee')
environment = require("../environment.coffee")

fs = require('fs')


class Circuit extends Observer
  @components = [
# Working
    "WireElm"
    "ResistorElm"
    "GroundElm"
    "InductorElm"
    "CapacitorElm"
    "VoltageElm"
    "DiodeElm"
    "SwitchElm"
    "SparkGapElm"
    "OpAmpElm"
    "MosfetElm"

# Testing
    "RailElm"
    "VarRailElm"
    "ZenerElm"
    "CurrentElm"
    "TransistorElm"

# In progress:
    "Switch2Elm"  # Needs interaction
    "TextElm"
    "ProbeElm"
    "OutputElm"
  ]

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


  constructor: (@name = "untitled")->
    @Params = new SimulationParams()

    @flags = 0

    @clearAndReset()

  write: (buffer) ->
#    unless environment.isBrowser
#      @ostream.write(buffer)

  ## Removes all circuit elements and scopes from the workspace and resets time to zero.
  ##   Called on initialization and reset.
  clearAndReset: ->
    for element in @elementList?
      element.destroy()

    @Solver = new CircuitSolver(this)
    @boundingBox = null

    @nodeList = []
    @elementList = []
    @voltageSources = []

    @scopes = []

    @time = 0
    @iterations = 0

    @placementElement = null

    @clearErrors()
    @notifyObservers @ON_RESET


  # "Solders" a new element to this circuit (adds it to the element list array).
  solder: (newElement) =>
    if newElement in @elementList
      @halt("Circuit component #{newElement} is already in element list")

    @notifyObservers @ON_SOLDER

    newElement.Circuit = this
    newElement.setPoints()
    newElement.recomputeBounds()

    @elementList.push newElement

    newElement.onSolder(this)

    @invalidate()
    @recomputeBounds()

  # "Desolders" an existing element to this circuit (removes it to the element list array).
  desolder: (component) ->
    @notifyObservers @ON_DESOLDER

    component.Circuit = null
    Util.removeFromArray @elementList, component

    # TODO: REMOVE NODES
    #for node in component.nodes
    #  if node.getNeighboringElements().length == 1
    #    @nodeList.de

    @recomputeBounds()

  toString: ->
    @Params

  inspect: ->
    @elementList.map (elm) -> elm.inspect()

  invalidate: ->
    @Solver.analyzeFlag = true

  dump: ->
    out = ""

    for elm in @getElements()
      out += elm.dump() + "\n"

    out

  getVoltageForNode: (nodeIdx) ->
    if @nodeList[nodeIdx].links[0]
      @nodeList[nodeIdx].links[0].elm.getVoltageForNode(nodeIdx)

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

    if @Solver.isStopped || @placementElement != null
      @Solver.lastTime = 0
    else
      @Solver.solveCircuit()

#    @write(@Solver.dumpFrame() + "\n")
#    @write(@dump() + "\n")

    @notifyObservers(@ON_COMPLETE_UPDATE)


  setSelected: (component) ->
    for elm in @elementList
      if elm == component
        @selectedElm = component
        component.setSelected(true)

  warn: (message) ->
    Logger.warn message
    @warnMessage = message

  halt: (message) ->
    e = new Error(message)

    console.log(e.stack)

    Logger.error message
    @stopMessage = message

  clearErrors: ->
    @stopMessage = null
    @stopElm = null


  ######################################################N##############################################################
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

  recomputeBounds: ->
    minX = 10000000000
    minY = 10000000000
    maxX = -10000000000
    maxY = -10000000000

    @eachComponent (component) ->
      componentBounds = component.boundingBox

      componentMinX = componentBounds.x
      componentMinY = componentBounds.y
      componentMaxX = componentBounds.x + componentBounds.width
      componentMaxY = componentBounds.y + componentBounds.height

      if componentMinX < minX
        minX = componentMinX

      if componentMinY < minY
        minY = componentMinY

      if componentMaxX > maxX
        maxX = componentMaxX
        
      if componentMaxY > maxY
        maxY = componentMaxY

    @boundingBox = new Rectangle(minX, minY, maxX - minX, maxY - minY)


  getBoundingBox: ->
    @boundingBox

  ####################################################################################################################
  ### Nodes
  ####################################################################################################################

  resetNodes: ->
    @nodeList = []

  addCircuitNode: (circuitNode) ->
    @nodeList.push circuitNode

  getNode: (idx) ->
    @nodeList[idx]

  getNodeAtCoordinates: (x, y) ->
    for node in @nodeList
      if node.x == x and node.y == y
        return node

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

  destroy: (components) ->
    for component in components
      for circuitComponent in @getElements()
        console.log(component, circuitComponent)
        if circuitComponent.equalTo(component)
          @desolder(circuitComponent, true)


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

  getTime: ->
    @time

  voltageRange: ->
    return @Params.voltageRange

  powerRange: ->
    return @Params.powerRange

  currentSpeed: ->
    return @Params.currentSpeed

  simSpeed: ->
    return @Params.simSpeed

  getState: ->
    return @state

  getStamper: ->
    @Solver.getStamper()

  toJson: ->
    {
      startCircuit: @Params.name
      timeStep: @timeStep()
      flags: @flags
      circuitNonLinear: @Solver.circuitNonLinear
      voltageSourceCount: @voltageSourceCount
      circuitMatrixSize: @Solver.circuitMatrixSize
      circuitMatrixFullSize: @Solver.circuitMatrixFullSize
      circuitPermute: @Solver.circuitPermute
      voltageSources: @getVoltageSources().map (elm) -> elm.toJson()
      circuitRowInfo: @Solver.circuitRowInfo.map (rowInfo) -> rowInfo.toJson()
      elmList: @elementList.map (element) -> element.toJson()
      nodeList: @nodeList.map (node) -> node.toJson()
    }

  frameJson: ->
    {
      nFrames: @iterations,
      t: @time,
      circuitMatrix: @Solver.circuitMatrix,
      circuitRightSide: @Solver.circuitRightSide
      simulationFrames: @Solver.simulationFrames.map (element) -> element.toJson()
    }

  dumpFrameJson: (filename = "./dump/#{@Params.name}_FRAMES.json") ->
    circuitFramsJson = JSON.stringify(@frameJson(), null, 2)

    fs.writeFileSync(filename, circuitFramsJson)

  dumpAnalysisJson: ->
    circuitAnalysisJson = JSON.stringify(@toJson(), null, 2)

    fs.writeFileSync("./dump/#{@Params.name}_ANALYSIS.json", circuitAnalysisJson)



module.exports = Circuit
