# #######################################################################
# Circuit:
#     Top-level-class specification for a circuit
#
# @author Anthony Erlinger
# @year 2012
# #######################################################################

if process.env
  Settings = require('../settings/settings')
  CircuitEngineParams = require('./circuitParams')
  CircuitSolver = require('./engine/circuitSolver')
  ComponentRegistry = require('../component/componentRegistry')

  CircuitLoader = require('../io/circuitLoader')
  Logger = require('../io/logger')

  MouseState = require('../ui/circuitStates').MouseState
  KeyboardState = require('../ui/circuitStates').KeyboardState
  ColorMapState = require('../ui/circuitStates').ColorMapState

  Renderer = require('../render/renderer')

  CommandHistory = require('../ui/commandHistory')
  Hint = require('./hint')
  Grid = require('../ui/grid')
  Primitives = require('../util/shapePrimitives')

  Oscilloscope = require('../scope/oscilloscope')



class Circuit

  constructor: ->
    @Params = new CircuitEngineParams()
    @CommandHistory = new CommandHistory()
    @Renderer = new Renderer(this)

    @clearAndReset()

  ###
  Removes all circuit elements and scopes from the workspace and resets time to zero.
  ###
  clearAndReset: ->
    for element in @elementList?
      element.destroy()

    @grid = new Grid()

    @nodeList = []
    @elementList = []

    @voltageSources = [];
    @voltageSourceCount = 0;

    @Solver = new CircuitSolver(this)

    @time = 0
    @lastTime = 0

    @Hint = new Hint(this)

    # State Handlers
    @mouseState = new MouseState()
    @keyboardState = new KeyboardState()
    @colorMapState = new ColorMapState()

    @clearErrors()

    @scopes = []         # Array of scope objects
    @scopeColCount = []  # Array of integers
    @scopeCount = 0


  ## #######################################################################################################
  # Loops through through all existing elements defined within the ElementMap Hash (see
  #   <code>ComponentDefinitions.coffee</code>) and registers their class with the solver engine
  # ##########
  registerAll: ->
    for Component in ComponentDefs
      if process.env.NODE_ENV == 'development'
        console.log "Registering Element: #{Component.prototype} "
      @register(Component)

  setupScopes: ->


  getRenderer: ->
    @Renderer

  # "Solders" a new element to this circuit (adds it to the element list array).
  solder: (newElement) ->
    newElement.Circuit = this
    newElement.setPoints()
    @elementList.push newElement


  # "Desolders" an existing element to this circuit (removes it to the element list array).
  desolder: (oldElement, destroy = true) ->
    oldElement.Circuit = null
    @elementList.remove oldElement
    oldElement.destroy()

  getVoltageSources: ->
    @voltageSources

  #It may be worthwhile to return a defensive copy here
  getElements: ->
    @elementList

  findElm: (searchElm) ->
    for circuitElm in @elementList
      return circuitElm if searchElm == circuitElm
    return false

  getElmByIdx: (elmIdx) ->
    return @elementList[elmIdx]

  numElements: ->
    return @elementList.length

  #########################
  # Nodes:
  #########################

  resetNodes: ->
    @nodeList = []


  addCircuitNode: (circuitNode) ->

    @nodeList.push circuitNode

  getNode: (idx) ->
    @nodeList[idx]


  getNodes: ->
    @nodeList


  numNodes: ->
    @nodeList.length


  getGrid: ->
    return @grid


  # TODO: This is a stub!
  getCanvasBounds: ->
    return new Primitives.Rectangle(0, 0, 500, 400);


  #########################
  # Computation
  #########################

  ###
  UpdateCircuit:

   Updates the circuit each frame.

    1. ) Reconstruct Circuit:
          Rebuilds a data representation of the circuit (only applied when circuit changes)
    2. ) Solve Circuit build matrix representation of the circuit solve for the voltage and current for each component.
          Solving is performed via LU factorization.
  ###
  updateCircuit: ->
    startTime = (new Date()).getTime()

    # Reconstruct circuit
    @Solver.reconstruct()

    # If the circuit isn't stopped, solve
    unless @Solver.isStopped
      @Solver.solveCircuit()
      @lastTime = @updateTimings()
    else
      @lastTime = 0

    @renderCircuit()
    @renderScopes()
    @renderInfo()

    endTime = (new Date()).getTime()
    frameTime = endTime - startTime
    console.log("Time: " + frameTime);
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


  updateTimings: () ->
    sysTime = (new Date()).getTime()
    #if @lastTime != 0
    inc = Math.floor(sysTime - @lastTime)
    currentSpeed = Math.exp(@Params.currentSpeed / 3.5 - 14.2)
    @Params.currentMult = 1.7 * inc * currentSpeed
    console.log "timings"
    console.log inc
    console.log @Params.currentSpeed

    if (sysTime - @secTime) >= 1000
      @framerate = @frames
      @steprate = @Solver.steps
      @frames = 0
      @steps = 0
      @secTime = sysTime

    @frames++
    return sysTime


  renderCircuit: () ->
    @powerMult = Math.exp(@Params.powerRange / 4.762 - 7)

    # Draw each circuit element
    for circuitElm in @elementList
      @Renderer.drawComponent(circuitElm)

    # Draw the posts for each circuit
    tempMouseMode = @mouseState.tempMouseMode
    if tempMouseMode is MouseState.MODE_DRAG_ROW or
       tempMouseMode is MouseState.MODE_DRAG_COLUMN or
       tempMouseMode is MouseState.MODE_DRAG_POST or
       tempMouseMode is MouseState.MODE_DRAG_SELECTED

      for circuitElm in @elementList
        circuitElm.drawPost circuitElm.x1, circuitElm.y1
        circuitElm.drawPost circuitElm.x2, circuitElm.y2

    # TODO: Draw selection outline:


  renderScopes: () ->
    # TODO Implement scopes


  renderInfo: () ->
    realMouseElm = @mouseElm
    @mouseElm = @stopElm unless @mouseElm?

    if @stopMessage?
      @printError @stopMessage
    else
      @getCircuitBottom() if @circuitBottom is 0

      # Array of messages to be displayed at the bottom of the canvas
      info = []
      if @mouseElm?
        if @mousePost is -1
          @mouseElm.getInfo info
        else
          info.push "V = " + getUnitText(@mouseElm.getPostVoltage(@mousePost), "V")
      else
        Settings.fractionalDigits = 2
        info.push "t = " + getUnitText(@Solver.time, "s") + "\nft: " + (@lastTime - @lastFrameTime) + "\n"
      unless @Hint.hintType is -1
        hint = @Hint.getHint()
        unless hint
          @Hint.hintType = -1
        else
          info.push hint
      @Renderer.drawInfo(info)
      @mouseElm = realMouseElm


  findBadNodes: ->
    badNodes = []
    for circuitNode in @nodeList
      if not circuitNode.intern and circuitNode.links.length is 1
        numBadPoints = 0
        firstCircuitNode = circuitNode.links[0]
        for circuitElm in @elementList
          console.log "Compare: #{firstCircuitNode.elm.toString()}  #{circuitElm.toString()}"
          if firstCircuitNode.elm.toString() != circuitElm.toString() and circuitElm.boundingBox.contains(circuitNode.x, circuitNode.y)
            numBadPoints++
        if numBadPoints > 0
          # Todo: outline bad nodes here
          badNodes.push circuitNode
    return badNodes


  ###
  Clears current states, graphs, and errors then Restarts the circuit from time zero.
  ###
  restartAndStop: ->
    @restartAndRun()
    @Solver.stop("Restarted Circuit from time 0")

  restartAndRun: ->
    element.reset() for element in @elementList
    scope.resetGraph() for scope in @scopes

    @Solver.reset()
    @Solver.run()



  warn: (message) ->
    Logger.warn message
    @warnMessage = message

  halt: (message) ->
    Logger.error message
    @stopMessage = message

  clearErrors: ->
    @stopMessage = null
    @stopElm = null

  ###
  Delegations:
  ###
  isStopped: ->
    @Solver.isStopped

  doDots: ->
    true

  voltageRange: ->
    return @Params['voltageRange']

  powerRange: ->
    return @Params['powerRange']

  currentSpeed: ->
    return @Params['currentMult']



# The Footer exports class(es) in this file via Node.js, if Node.js is defined.
# This is necessary for testing through Mocha in development mode.
#
# see script/test and the /test directory for details.
#
# To require this class in another file through Node, write {ClassName} = require(<path_to_coffee_file>)
root = module.exports ? window
module.exports = Circuit