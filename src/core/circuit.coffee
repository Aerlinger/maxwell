# #######################################################################
# Circuit:
#     Top-level-class specification for a circuit
#
# @author Anthony Erlinger
# @year 2012
# #######################################################################

if process.env
  Settings = require('../settings/settings')
  CircuitEngineParams = require('./circuitParams.coffee')
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

  Oscilloscope = require('../scope/oscilloscope.coffee')



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



  ###
  Clears current states, graphs, and errors then Restarts the circuit from time zero.
  ###
  restartAndStop: ->
    @restartAndRun()
    @Solver.stop("Restarted Circuit from time 0")

  restartAndRun: ->
    for element in @elementList
      element.reset()
    for scope in @scopes
      scope.resetGraph()

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

  getRenderContext: ->
    @renderContext

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

  # Returns the y position of the bottom of the circuit
  getCircuitBottom: ->
    if @circuitBottom
      return @circuitBottom

    for element in @elementList
      rect = element.boundingBox
      bottom = rect.height + rect.y
      @circuitBottom = bottom if (bottom > @circuitBottom)

    return @circuitBottom

  ###
  UpdateCircuit: Outermost method in event loops

  Called once each frame
  ###
  updateCircuit: ->
    startTime = (new Date()).getTime()

    realMouseElm = @mouseElm

    # Render Warning and error messages:
    @Solver.analyzeCircuit()

    # TODO Setup edit dialog

    @mouseElm = @stopElm unless @mouseElm?

    # TODO: needs scopes
    @setupScopes()

    unless @Solver.stoppedCheck
      @Solver.runCircuit()

      sysTime = (new Date()).getTime()
      unless @lastTime is 0
        inc = Math.floor(sysTime - @lastTime)
        currentSpeed = Math.exp(@Params.currentSpeed / 3.5 - 14.2)
        @Params.currentMult = 1.7 * inc * currentSpeed
      if (sysTime - @secTime) >= 1000
        @framerate = @frames
        @steprate = @steps
        @frames = 0
        @steps = 0
        @secTime = sysTime
      @lastTime = sysTime
    else
      @lastTime = 0

    @Params.powerMult = Math.exp(@powerBar / 4.762 - 7)

    # Draw each circuit element
    for circuitElm in @elementList
      @Renderer.drawComponent(circuitElm)

    # Draw the posts for each circuit
    if @mouseState.tempMouseMode is MouseState.MODE_DRAG_ROW or
       @mouseState.tempMouseMode is MouseState.MODE_DRAG_COLUMN or
       @mouseState.tempMouseMode is MouseState.MODE_DRAG_POST or
       @mouseState.tempMouseMode is MouseState.MODE_DRAG_SELECTED

      for circuitElm in @elementList
        circuitElm.drawPost circuitElm.x1, circuitElm.y1
        circuitElm.drawPost circuitElm.x2, circuitElm.y2

    # Find bad connections. Nodes not connected to other elements which intersect other elements' bounding boxes
    badNodes = @findBadNodes()

    if @dragElm? and (@dragElm.x1 isnt @dragElm.x2 or @dragElm.y1 isnt @dragElm.y2)
      @dragElm.draw null

    scopeCount = @scopeCount
    scopeCount = 0 if @stopMessage?

    # TODO Implement scopes
    if @stopMessage?
      @printError @stopMessage
    else
      @getCircuitBottom() if @circuitBottom is 0

      info = []
      # Array of messages to be displayed at the bottom of the canvas
      if @mouseElm?
        if @mousePost is -1
          @mouseElm.getInfo info
        else
          info.push "V = " + getUnitText(@mouseElm.getPostVoltage(@mousePost), "V")
      else
        Settings.fractionalDigits = 2
        info.push "t = " + getUnitText(@Solver.time, "s") + "\nf.t.: " + (@lastTime - @lastFrameTime) + "\n"
      unless @Hint.hintType is -1
        s = @Hint.getHint()
        unless s?
          @Hint.hintType = -1
        else
          info.push s

      # TODO: Implement scopes
      x = 0
      x = @scopes[scopeCount - 1].rightEdge() + 20  unless scopeCount is 0
      x = 0 unless x

      info.push "Bad Connections: #{badNodes.length}" if badNodes > 0

      # TODO: DRAW info text
      @Renderer.drawInfo(info)

    # TODO: Draw selection outline:

    @mouseElm = realMouseElm
    @frames++

    endTime = (new Date()).getTime()
    @lastFrameTime = @lastTime


  findBadNodes: ->
    badNodes = []
    for circuitNode in @nodeList
      if not circuitNode.intern and circuitNode.links.length is 1
        bb = 0
        firstCircuitNode = circuitNode.links[0]
        for circuitElm in @elementList
          bb++ if firstCircuitNode.elm.toString() != circuitElm.toString() and circuitElm.boundingBox.contains(circuitNode.x, circuitNode.y)
        if bb > 0
          # Todo: outline bad nodes here
          badNodes.push circuitNode


# The Footer exports class(es) in this file via Node.js, if Node.js is defined.
# This is necessary for testing through Mocha in development mode.
#
# see script/test and the /test directory for details.
#
# To require this class in another file through Node, write {ClassName} = require(<path_to_coffee_file>)
root = module.exports ? window
module.exports = Circuit