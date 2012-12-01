# #######################################################################
# Circuit:
#     Top-level-class specification for a circuit
#
# @author Anthony Erlinger
# @year 2012
# #######################################################################

if process.env
  Settings = require('../settings/settings')
  CircuitEngineParams = require('./engineParams')
  CircuitSolver = require('./engine/circuitSolver')
  ComponentDefs = require('./componentDefs')

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

  Scope = require('../scope/scope')



class Circuit

  constructor: ->
    @Params = new CircuitEngineParams()
    @CommandHistory = new CommandHistory()
    @Renderer = new Renderer(this)

    @clearAndReset()
    @init()

  ###
  Removes all circuit elements and scopes from the workspace and resets time to zero.
  ###
  clearAndReset: ->

    for element in @elementList?
      element.destroy()

    @dumpTypes = []
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


  init: () ->
    @grid = new Grid()

    @registerAll()
    @loadCircuit( Settings.defaultCircuit )


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

  ## #######################################################################################################
  # Registers, constructs, and places an element with the given class name within this circuit.
  #   This method is called by <code>register</code>
  # ##########
  register: (ComponentConstructor) ->
    try
      # Create this component by its className
      newComponent = CircuitLoader.constructElement ComponentConstructor, 0, 0, 0, 0, 0, null
      dumpType = newComponent.getDumpType()
      dumpClass = ComponentConstructor

      if @dumpTypes[dumpType] is dumpClass
        console.log "#{ComponentConstructor} is a dump class"
        return
      if @dumpTypes[dumpType]?
        console.log "Dump type conflict: " + dumpType + " " + @dumpTypes[dumpType]
        return

      @dumpTypes[dumpType] = ComponentConstructor
    catch e
      if process.env.NODE_ENV == 'development'
        Logger.warn "Element: #{ComponentConstructor.prototype} Not yet implemented: [#{e.message}]"


  ## #######################################################################################################
  # Loads the circuit from the given text file
  # ##########
  loadCircuit: (defaultCircuit) ->
    @clearAndReset()    # Clear and reset circuit elements
    @CommandHistory.reset()
    #TODO: Disabled temporarily
    #CircuitLoader.readSetupList this, false
    #CircuitLoader.readCircuitFromFile this, "#{defaultCircuit}.txt", false

  ###
  Clears current states, graphs, and errors then Restarts the circuit from time zero.
  ###
  restartAndStop: ->
    @restartAndRun()
    @Solver.stop("Restarted Circuit from time 0")
    @Solver.invalidate()


  restartAndRun: ->
    for element in @elementList
      element.reset()
    for scope in @scopes
      scope.resetGraph()

    @Solver.reset()
    @Solver.run()

  halt: (message) ->
    console.warn(message)
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
  desolder: (oldElement) ->
    oldElement.Circuit = null
    @elementList.remove(oldElement)

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

  resetNodes: ->
    @nodeList = []

  addCircuitNode: (circuitNode) ->
    @nodeList.push circuitNode

  getCircuitNode: (idx) ->
    return @nodeList[idx]

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

    # Clear the canvas:
    # TODO: # renderContext.clearRect 0, 0, CANVAS.width(), CANVAS.height()
    realMouseElm = @mouseElm

    # Render Warning and error messages:
    @Solver.analyzeCircuit()

    # TODO Setup edit dialog

    @mouseElm = @stopElm unless @mouseElm?

    # TODO: test
    @setupScopes()

    unless @Solver.stoppedCheck
#      try
      @Solver.runCircuit()
#      catch e
#        console.log "error in run circuit: " + e.message
#        @Solver.invalidate()
#        return

      sysTime = (new Date()).getTime()
      unless @lastTime is 0
        inc = Math.floor(sysTime - @lastTime)
        current_speed = Math.exp(@Params.current_speed / 3.5 - 14.2)
        @Params.currentMult = 1.7 * inc * current_speed
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
        circuitElm.drawPost circuitElm.x, circuitElm.y
        circuitElm.drawPost circuitElm.x2, circuitElm.y2

    # Find bad connections. Nodes not connected to other elements which intersect other elements' bounding boxes
    badNodes = @findBadNodes()

    if @dragElm? and (@dragElm.x isnt @dragElm.x2 or @dragElm.y isnt @dragElm.y2)
      @dragElm.draw null

    scopeCount = @scopeCount
    scopeCount = 0 if @stopMessage?

    # TODO Implement scopes
    #for scope in @scopes
    #  scope.draw();
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
      #x = Math.max(x, CanvasBounds.width * 2 / 3)

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
          bb++ if firstCircuitNode.elm isnt circuitElm and circuitElm.boundingBox.contains(circuitNode.x, circuitNode.y)
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