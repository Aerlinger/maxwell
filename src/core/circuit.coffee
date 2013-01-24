# #######################################################################
# Circuit:
#     Top-level-class specification for a circuit
#
# @author Anthony Erlinger
# @year 2012
# #######################################################################

# <DEFINE>
define [
  'cs!KeyboardState',
  'cs!Oscilloscope',
  'cs!Logger',
  'cs!ColorMapState',
  'cs!Renderer',
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
  'cs!Units'
], (
  KeyboardState,
  Oscilloscope,
  Logger,
  ColorMapState,
  Renderer,
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
) ->
# </DEFINE>


  #Request Animation Frame polyfill
  (()->
    lastTime = 0
    vendors = ["ms", "moz", "webkit", "o"]
    x = 0

    while x < vendors.length and not window.requestAnimationFrame
      window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"]
      window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] or window[vendors[x] + "CancelRequestAnimationFrame"]
      ++x
    unless window.requestAnimationFrame
      window.requestAnimationFrame = (callback, element) =>
        currTime = new Date().getTime()
        timeToCall = Math.max(0, 16 - (currTime - lastTime))
        id = window.setTimeout(->
          callback currTime + timeToCall
        , timeToCall)
        lastTime = currTime + timeToCall
        id
    unless window.cancelAnimationFrame
      window.cancelAnimationFrame = (id) ->
        clearTimeout id
  )()



  class Circuit

      constructor: (CanvasElm) ->
        @Params = new CircuitEngineParams()
        @CommandHistory = new CommandHistory()
        @Renderer = new Renderer(this, CanvasElm)

        @clearAndReset()


      setParamsFromJSON: (jsonData) ->
        @Params = new CircuitEngineParams(jsonData)

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


      setupScopes: ->


      getRenderer: ->
        @Renderer

      # "Solders" a new element to this circuit (adds it to the element list array).
      solder: (newElement) ->
        newElement.setParentCircuit(this)
        newElement.setPoints()
        console.log("Soldering Element: " + newElement)
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
      updateCircuit: (frameTime) ->
        @Renderer.clear()
        #@simulation = requestAnimationFrame(Circuit.prototype.updateCircuit, @)

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
        @lastFrameTime = @lastTime

      ###
      Clears current states, graphs, and errors then Restarts the circuit from time zero.
      ###
      restartAndStop: ->
        @restartAndRun()
        @simulation = cancelAnimationFrame()
        @Solver.stop("Restarted Circuit from time 0")

      restartAndRun: ->
        if(!@Solver)
          halt("Solver not initialized!");

        element.reset() for element in @elementList
        scope.resetGraph() for scope in @scopes

        @Solver.reset()

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
          @halt @stopMessage
        else
          @getCircuitBottom() if @circuitBottom is 0

          # Array of messages to be displayed at the bottom of the canvas
          info = []
          if @mouseElm?
            if @mousePost is -1
              @mouseElm.getInfo info
            else
              info.push "V = " + Units.getUnitText(@mouseElm.getPostVoltage(@mousePost), "V")
          else
            Settings.fractionalDigits = 2
            info.push "t = " + Units.getUnitText(@Solver.time, "s") + "\nft: " + (@lastTime - @lastFrameTime) + "\n"
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

  return Circuit