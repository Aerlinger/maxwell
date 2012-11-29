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

  CommandHistory = require('../ui/commandHistory')
  Hint = require('./hint')
  Grid = require('../ui/grid')
  Primitives = require('../util/shapePrimitives')

  Scope = require('../scope/scope')



class Circuit

  constructor: ->
    console.log "Started Simulation"

    @EngineParams = new CircuitEngineParams()
    @CommandHistory = new CommandHistory()

    @clearAndReset()
    @init()


  init: () ->
    @Solver.invalidate()

    @stopElm = null
    @stopMessage  = 0
    @renderContext = null

    @grid = new Grid()
    @registerAll()

    @scopes = new Array(20)         # Array of scope objects
    @scopeColCount = new Array(20)  # Array of integers
    @scopeCount = 0

    @loadCircuit( Settings.defaultCircuit )


  ## #######################################################################################################
  # Loops through through all existing elements defined within the ElementMap Hash (see
  #   <code>ComponentDefinitions.coffee</code>) and registers their class with the solver engine
  # ##########
  registerAll: ->
    for ElementName, ElementDescription of ComponentDefs
      console.log "Registering Element: #{ElementName}   (#{ElementDescription})"
      @register(ElementName)

  setupScopes: ->

  ## #######################################################################################################
  # Registers, constructs, and places an element with the given class name within this circuit.
  #   This method is called by <code>register</code>
  # ##########
  register: (elmClassName) ->
    try
      # Create this component by its className
      elm = CircuitLoader.constructElement elmClassName, 0, 0, 0, 0, 0, null
      dumpType = elm.getDumpType()
      dumpClass = elmClassName

      if @dumpTypes[dumpType] is dumpClass
        console.log "#{elmClassName} is a dump class"
        return
      if @dumpTypes[dumpType]?
        console.log "Dump type conflict: " + dumpType + " " + @dumpTypes[dumpType]
        return

      @dumpTypes[dumpType] = elmClassName
    catch e
      Logger.warn "Element: #{elmClassName} Not yet implemented: [#{e.message}]"


  ## #######################################################################################################
  # Loads the circuit from the given text file
  # ##########
  loadCircuit: (defaultCircuit) ->
    @clearAndReset()    # Clear and reset circuit elements
    @CommandHistory.reset()
    CircuitLoader.readSetupList this, false
    CircuitLoader.readCircuitFromFile this, "#{defaultCircuit}.txt", false


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

    @scopes = new Array(20)        # Array of scope objects
    @scopeColCount = new Array(20) # Array of integers
    @scopeCount = 0

    @circuitBottom = 0;


  ###
  Clears current states, graphs, and errors then Restarts the circuit from time zero.
  ###
  restartAndStop: ->
    @restartAndPlay()
    @Solver.stop("Restarted Circuit from time 0")
    @Solver.invalidate()


  restartAndPlay: ->
    for element in @elementList
      element.reset()
    for scope in @scopes
      scope.resetGraph()

    @Solver.restart()

  # Returns the y position of the bottom of the circuit
  calcCircuitBottom: ->
    @circuitBottom = 0

    for element in @elementList
      rect = element.boundingBox
      bottom = rect.height + rect.y
      @circuitBottom = bottom if (bottom > @circuitBottom)

    return @circuitBottom

  clearErrors: ->
    @stopMessage = null
    @stopElm = null

  getRenderContext: ->
    @renderContext

  #It may be worthwhile to return a defensive copy here
  getElements: ->
    @elementList

  getElm: (elmIdx) ->
    return @elementList[elmIdx]

  numElements: ->
    return @elementList.length

  getNodes: ->
    @nodeList

  numNodes: ->
    @nodeList.length

  getGrid: ->
    return @grid

  # TODO: This is a stub!
  getCanvasBounds: ->
    return new Primitives.Rectangle(0, 0, 500, 400);


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


    # TODO
    #    if(CirSim.editDialog != null && CirSim.editDialog.elm instanceof CircuitElement)
    #		CirSim.mouseElm = CirSim.editDialog.elm;
    # as CircuitElement;

    mouseElm = @stopElm  unless @mouseElm?

    # TODO: test
    @setupScopes()

    unless @Solver.stoppedCheck
      try
        @Solver.runCircuit()
      catch e
        console.log "error in run circuit: " + e.message
        @Solver.invalidate()
        return

      sysTime = (new Date()).getTime()
      unless @lastTime is 0
        inc = Math.floor(sysTime - @lastTime)
        current_speed = Math.exp(@EngineParams.current_speed / 3.5 - 14.2)
        @EngineParams.currentMult = 1.7 * inc * current_speed
      if (sysTime - @secTime) >= 1000
        @framerate = @frames
        @steprate = @steps
        @frames = 0
        @steps = 0
        @secTime = sysTime
      @lastTime = sysTime
    else
      @lastTime = 0
    @EngineParams.powerMult = Math.exp(@powerBar / 4.762 - 7)

    # Draw each circuit element
    for circuitElm in @elementList
      circuitElm.draw()

    # Draw the posts for each circuit
    if @mouseState.tempMouseMode is MouseState.MODE_DRAG_ROW or
       @mouseState.tempMouseMode is MouseState.MODE_DRAG_COLUMN or
       @mouseState.tempMouseMode is MouseState.MODE_DRAG_POST or
       @mouseState.tempMouseMode is MouseState.MODE_DRAG_SELECTED

      for circuitElm in @elementList
        circuitElm.drawPost circuitElm.x, circuitElm.y
        circuitElm.drawPost circuitElm.x2, circuitElm.y2


    # Find bad connections. Nodes not connected to other elements which intersect other elements' bounding boxes
    badNodes = 0
    for circuitNode in @nodeList
      if not circuitNode.intern and circuitNode.links.length is 1
        bb = 0
        firstCircuitNode = circuitNode.links[0]

        for circuitElm in @elementList
          bb++ if firstCircuitNode.elm isnt circuitElm and circuitElm.boundingBox.contains(circuitNode.x, circuitNode.y)
        if bb > 0
          # Todo: outline bad nodes here
          badNodes++

    @dragElm.draw null if @dragElm? and (@dragElm.x isnt @dragElm.x2 or @dragElm.y isnt @dragElm.y2)
    scopeCount = @scopeCount
    scopeCount = 0  if @stopMessage?

    # TODO Implement scopes
    #for(i=0; i!=ct; ++i)
    #    CirSim.scopes[i].draw();
    if @stopMessage?
      @printError @stopMessage
    else
      @calcCircuitBottom()  if @circuitBottom is 0
      info = []

      # Array of messages to be displayed at the bottom of the canvas
      if @mouseElm?
        if @mousePost is -1
          @mouseElm.getInfo info
        else
          info[0] = "V = " + getUnitText(@mouseElm.getPostVoltage(@mousePost), "V")
      else
        Settings.fractionalDigits = 2
        info[0] = "t = " + getUnitText(@Solver.time, "s") + "\nf.t.: " + (@lastTime - @lastFrameTime) + "\n"
      unless @Hint.hintType is -1
        i = 0
        while info[i]?
          ++i
        s = @Hint.getHint()
        unless s?
          @Hint.hintType = -1
        else
          info[i] = s
      x = 0

      # TODO: Implement scopes
      x = @scopes[scopeCount - 1].rightEdge() + 20  unless scopeCount is 0
      CanvasBounds = @getCanvasBounds()
      x = 0 unless x
      x = Math.max(x, CanvasBounds.width * 2 / 3)
      i = 0
      while info[i]?
        ++i
      info[++i] = badNodes + ((if (badNodes is 1) then " bad connection" else " bad connections"))  if badNodes > 0
      bottomTextOffset = 100

      # TODO: Find where to show data; below circuit, not too high unless we need it
      ybase = CanvasBounds.height - 15 * i - bottomTextOffset
      ybase = Math.min(ybase, CanvasBounds.height)
      ybase = Math.max(ybase, @circuitBottom)

      # TODO: DRAW info text

    # TODO: Draw selection outline:
    #if @selectedArea?

    @mouseElm = realMouseElm
    @frames++

    endTime = (new Date()).getTime()
    @lastFrameTime = @lastTime


# The Footer exports class(es) in this file via Node.js, if Node.js is defined.
# This is necessary for testing through Mocha in development mode.
#
# see script/test and the /test directory for details.
#
# To require this class in another file through Node, write {ClassName} = require(<path_to_coffee_file>)
root = module.exports ? window
module.exports = Circuit