MatrixStamper = require('./MatrixStamper.js')

Pathfinder = require('./Pathfinder.js')
CircuitNode = require('./CircuitNode.js')
CircuitNodeLink = require('./CircuitNodeLink.js')
RowInfo = require('./RowInfo.js')
Setting = require('../Settings.js')
Util = require('../util/Util.js')

SimulationFrame = require('../circuit/SimulationFrame.js')

GroundElm = require('../components/GroundElm.js')
RailElm = require('../components/RailElm.js')
VoltageElm = require('../components/VoltageElm.js')
WireElm = require('../components/WireElm.js')
CapacitorElm = require('../components/CapacitorElm.js')
InductorElm = require('../components/InductorElm.js')
CurrentElm = require('../components/CurrentElm.js')

sprintf = require("sprintf-js").sprintf

class CircuitSolver
  @SIZE_LIMIT = 100
  @MAXIMUM_SUBITERATIONS = 5000

  constructor: (@Circuit) ->
    @scaleFactors = Util.zeroArray(400)
    @reset()
    @Stamper = new MatrixStamper(@Circuit)

  reset: ->
    @Circuit.time = 0
    @iterations = 0

    @converged = true # true if numerical analysis has converged
    @subIterations = 5000

    @circuitMatrix = []
    @circuitRightSide = []

    @origMatrix = []
    @origRightSide = []

    @circuitRowInfo = []
    @circuitPermute = []

    @circuitNonLinear = false

    @lastTime = 0
    @secTime = 0
    @lastFrameTime = 0
    @lastIterTime = 0

    @analyzeFlag = true

    @simulationFrames = []

  reconstruct: ->
    return if !@analyzeFlag || (@Circuit.numElements() is 0)

    @Circuit.clearErrors()
    @Circuit.resetNodes()

    @discoverGroundReference()
    @constructCircuitGraph()
    @constructMatrixEquations()
    @checkConnectivity()
    @findInvalidPaths()
    @optimize()

    # if a matrix is linear, we can do the lu_factor here instead of needing to do it every frame
    if @circuitLinear()
      @luFactor(@circuitMatrix, @circuitMatrixSize, @circuitPermute)

  solveCircuit: ->
    if not @circuitMatrix? or @Circuit.numElements() is 0
      @circuitMatrix = null
      #console.error("Called solve circuit when circuit Matrix not initialized")
      return

    @sysTime = (new Date()).getTime()

    stepRate = Math.floor(160 * @getIterCount())

    tm = (new Date()).getTime()
    lit = @lastIterTime

    if 1000 >= (stepRate * (tm - @lastIterTime))
      return

    iter = 1
    loop
      ++@steps

      for circuitElm in @Circuit.getElements()
        circuitElm.startIteration()

      # Sub iteration
      for subiter in [0...CircuitSolver.MAXIMUM_SUBITERATIONS]
        @converged = true
        @subIterations = subiter

        @restoreOriginalMatrixState()

        for circuitElm in @Circuit.getElements()
          circuitElm.doStep(@Stamper)

        if @circuitNonLinear
          break if @converged and subiter > 0
          @sub_luFactor(@circuitMatrix, @circuitMatrixSize, @circuitPermute)

        @luSolve @circuitMatrix, @circuitMatrixSize, @circuitPermute, @circuitRightSide

        # backsolve and update each component current/voltage...
        for j in [0...@circuitMatrixFullSize]
          res = @getValueFromNode(j)
          break unless @updateComponent(j, res)

        break if @circuitLinear()

      if subiter >= CircuitSolver.MAXIMUM_SUBITERATIONS
        @halt "Convergence failed: " + subiter, null
        break

      @Circuit.time += @Circuit.timeStep()

      if ((iter + 20) % 21 == 0)
        for scope in @Circuit.scopes
          if (scope.circuitElm)
            scope.sampleVoltage(@Circuit.time, scope.circuitElm.getVoltageDiff());
            scope.sampleCurrent(@Circuit.time, scope.circuitElm.getCurrent());

      tm = (new Date()).getTime()
      lit = tm

      if (tm - @lastFrameTime) > 250
#        console.log("force break", iter)
        break

      if ((iter * 1000) >= (stepRate * (tm - @lastIterTime)))
#        console.log("Break", iter)
        break

      ++iter

    @frames++
    @Circuit.iterations++

    @simulationFrames.push(new SimulationFrame(@Circuit))

    @_updateTimings(lit)

  circuitLinear: ->
    !@circuitNonLinear

  _updateTimings: (lastIterationTime) ->
    @lastIterTime = lastIterationTime

    sysTime = (new Date()).getTime()

    if @lastTime != 0
      inc = Math.floor(sysTime - @lastTime)
      currentSpeed = Math.exp(@Circuit.currentSpeed() / 3.5 - 14.2)

      @Circuit.Params.setCurrentMult(1.7 * inc * currentSpeed)

    if (sysTime - @secTime) >= 1000
      # console.log("Reset!")
      @frames = 0
      @steps = 0
      @secTime = sysTime

    @lastTime = sysTime
    @lastFrameTime = @lastTime
    @iterations++


  getStamper: ->
    return @Stamper

  getIterCount: ->
    sim_speed = @Circuit.simSpeed()
    return 0.1 * Math.exp((sim_speed - 61.0) / 24.0)

  discoverGroundReference: ->
    gotGround = false
    gotRail = false
    volt = null

    # Check if this circuit has a voltage rail and if it has a voltage element.
    for ce in @Circuit.getElements()
      if ce instanceof GroundElm
        gotGround = true
        break
      if Util.typeOf(ce, RailElm)
        gotRail = true
      if !volt? and Util.typeOf(ce, VoltageElm)
        volt = ce

    circuitNode = new CircuitNode(@)
    circuitNode.x = circuitNode.y = -1

    # If no ground and no rails then voltage element's first terminal is referenced to ground:
    if !gotGround and !gotRail and volt?
      pt = volt.getPost(0)

      circuitNode.x = pt.x
      circuitNode.y = pt.y

    @Circuit.addCircuitNode circuitNode

  buildComponentNodes: ->
    voltageSourceCount = 0

    for circuitElm in @Circuit.getElements()
      internalNodeCount = circuitElm.numInternalNodes()
      internalVSCount = circuitElm.numVoltageSources()
      postCount = circuitElm.numPosts()

      # allocate a node for each post and match postCount to nodes
      for postIdx in [0...postCount]
        postPt = circuitElm.getPost(postIdx)

        for nodeIdx in [0...@Circuit.numNodes()]
          circuitNode = @Circuit.getNode(nodeIdx)
          if Util.overlappingPoints(postPt, circuitNode)
            break

        nodeLink = new CircuitNodeLink()
        nodeLink.num = postIdx
        nodeLink.elm = circuitElm

        if nodeIdx == @Circuit.numNodes()
          circuitNode = new CircuitNode(@, postPt.x, postPt.y)
          circuitNode.links.push nodeLink

          circuitElm.setNode postIdx, @Circuit.numNodes()
          @Circuit.addCircuitNode circuitNode

        else
          @Circuit.getNode(nodeIdx).links.push nodeLink
          circuitElm.setNode(postIdx, nodeIdx)

          if nodeIdx is 0
            circuitElm.setNodeVoltage(postIdx, 0)

      for internalNodeIdx in [0...internalNodeCount]
        internalLink = new CircuitNodeLink()
        internalLink.num = internalNodeIdx + postCount
        internalLink.elm = circuitElm

        internalNode = new CircuitNode(@, -1, -1, true)
        internalNode.links.push internalLink
        circuitElm.setNode internalLink.num, @Circuit.numNodes()

        @Circuit.addCircuitNode internalNode

      voltageSourceCount += internalVSCount


  constructCircuitGraph: ->
    # Allocate nodes and voltage sources
    @buildComponentNodes()

    @Circuit.voltageSources = new Array(voltageSourceCount)

    voltageSourceCount = 0
    @circuitNonLinear = false

    # Determine if circuit is nonlinear
    for circuitElement in @Circuit.getElements()
      if circuitElement.nonLinear()
        @circuitNonLinear = true

      for voltSourceIdx in [0...circuitElement.numVoltageSources()]
        @Circuit.voltageSources[voltageSourceCount] = circuitElement
        circuitElement.setVoltageSource voltSourceIdx, voltageSourceCount++

    @Circuit.voltageSourceCount = voltageSourceCount

    @matrixSize = @Circuit.numNodes() + voltageSourceCount - 1

  constructMatrixEquations: ->
    @circuitMatrixSize = @circuitMatrixFullSize = @matrixSize

    @circuitMatrix = Util.zeroArray2(@matrixSize, @matrixSize)
    @origMatrix = Util.zeroArray2(@matrixSize, @matrixSize)

    @circuitRightSide = Util.zeroArray @matrixSize
    @origRightSide = Util.zeroArray @matrixSize
    @circuitRowInfo = Util.zeroArray @matrixSize
    @circuitPermute = Util.zeroArray @matrixSize

    for rowIdx in [0...@matrixSize]
      @circuitRowInfo[rowIdx] = new RowInfo()

    @circuitNeedsMap = false

    # Construct Matrix Equations
    for circuitElm in @Circuit.getElements()
      circuitElm.stamp(@Stamper)

  checkConnectivity: -># Determine nodes that are unconnected
    closure = new Array(@Circuit.numNodes())
    closure[0] = true
    changed = true

    while changed
      changed = false
      for circuitElm in @Circuit.getElements()

        # Loop through all ce's nodes to see if they are connected to other nodes not in closure
        for postIdx in [0...circuitElm.numPosts()]
          unless closure[circuitElm.getNode(postIdx)]
            if circuitElm.hasGroundConnection(postIdx)
              changed = true
              closure[circuitElm.getNode(postIdx)] = true
            continue

          for siblingPostIdx in [0...circuitElm.numPosts()]
            if postIdx is siblingPostIdx
              continue

            siblingNode = circuitElm.getNode(siblingPostIdx)
            if circuitElm.getConnection(postIdx, siblingPostIdx) and !closure[siblingNode]
              closure[siblingNode] = true
              changed = true

      continue if changed

      # connect unconnected nodes
      for nodeIdx in [0...@Circuit.numNodes()]
        if !closure[nodeIdx] and !@Circuit.nodeList[nodeIdx].intern
          console.warn("Node #{nodeIdx} unconnected! -> #{@Circuit.nodeList[nodeIdx].toString()}")
          @Stamper.stampResistor 0, nodeIdx, 1e8
          closure[nodeIdx] = true
          changed = true
          break


  findInvalidPaths: ->
    for ce in @Circuit.getElements()
      if ce instanceof InductorElm
        fpi = new Pathfinder(Pathfinder.INDUCT, ce, ce.getNode(1), @Circuit.getElements(), @Circuit.numNodes())

        if not fpi.findPath(ce.getNode(0), 5) and not fpi.findPath(ce.getNode(0))
          ce.reset()

      # look for current sources with no current path
      if ce instanceof CurrentElm
        fpi = new Pathfinder(Pathfinder.INDUCT, ce, ce.getNode(1), @Circuit.getElements(), @Circuit.numNodes())
        unless fpi.findPath(ce.getNode(0))
          console.warn "No path for current source!", ce
          return

      # Look for voltage source loops:
      if (Util.typeOf(ce, VoltageElm) and ce.numPosts() is 2) or ce instanceof WireElm
        pathfinder = new Pathfinder(Pathfinder.VOLTAGE, ce, ce.getNode(1), @Circuit.getElements(), @Circuit.numNodes())

        if pathfinder.findPath(ce.getNode(0))
          @Circuit.halt "Voltage source/wire loop with no resistance!", ce
          # return

      # Look for shorted caps or caps with voltage but no resistance
      if ce instanceof CapacitorElm
        fpi = new Pathfinder(Pathfinder.SHORT, ce, ce.getNode(1), @Circuit.getElements(), @Circuit.numNodes())
        if fpi.findPath(ce.getNode(0))
          ce.reset()
        else
          fpi = new Pathfinder(Pathfinder.CAP_V, ce, ce.getNode(1), @Circuit.getElements(), @Circuit.numNodes())
          if fpi.findPath(ce.getNode(0))
            console.warn "Capacitor loop with no resistance!", ce
            return

  optimize: ->
    row = -1
    while row < @matrixSize-1
      row += 1

      re = @circuitRowInfo[row]
      if re.lsChanges or re.dropRow or re.rsChanges
        continue

      rsadd = 0
      qm = -1
      qp = -1
      lastVal = 0

      # look for rows that can be removed
      for col in [0...@matrixSize]
        if @circuitRowInfo[col].type is RowInfo.ROW_CONST
          # Keep a running total of const values that have been removed already
          rsadd -= @circuitRowInfo[col].value * @circuitMatrix[row][col]
        else if @circuitMatrix[row][col] is 0
        else if qp is -1 # First col
          qp = col  # First nonzero value is qp
          lastVal = @circuitMatrix[row][col]
        else if qm is -1 and (@circuitMatrix[row][col] is -lastVal)
          qm = col
        else
          break

      if col is @matrixSize
        if qp is -1
          @Circuit.halt "Matrix error qp (row with all zeros) (rsadd = #{rsadd})", null
          return

        elt = @circuitRowInfo[qp]

        # We found a row with only one nonzero entry, that value is constant
        if qm is -1
          k = 0
          while elt.type is RowInfo.ROW_EQUAL and k < CircuitSolver.SIZE_LIMIT
            # Follow the chain
            qp = elt.nodeEq
            elt = @circuitRowInfo[qp]
            ++k

          if elt.type is RowInfo.ROW_EQUAL
            # break equal chains
            elt.type = RowInfo.ROW_NORMAL

          else if elt.type != RowInfo.ROW_NORMAL
          else
            elt.type = RowInfo.ROW_CONST
            elt.value = (@circuitRightSide[row] + rsadd) / lastVal

            @circuitRowInfo[row].dropRow = true

            row = -1 # start over from scratch

        # We found a row with only two nonzero entries, and one is the negative of the other -> the values are equal
        else if (@circuitRightSide[row] + rsadd) is 0
          if elt.type != RowInfo.ROW_NORMAL
            qq = qm
            qm = qp
            qp = qq
            elt = @circuitRowInfo[qp]

            if elt.type != RowInfo.ROW_NORMAL
              # We should follow the chain here, but this hardly ever happens so it's not worth worrying about
              #console.warn("elt.type != RowInfo.ROW_NORMAL", elt)
              continue

          elt.type = RowInfo.ROW_EQUAL
          elt.nodeEq = qm
          @circuitRowInfo[row].dropRow = true

    # END WHILE row < @matrixSize-1

    # Find size of new matrix:
    newMatDim = 0
    for row in [0...@matrixSize]
      rowInfo = @circuitRowInfo[row]

      if rowInfo.type is RowInfo.ROW_NORMAL
        rowInfo.mapCol = newMatDim++

      else
        if rowInfo.type is RowInfo.ROW_EQUAL
          # resolve chains of equality; 100 max steps to avoid loops
          for j in [0...CircuitSolver.SIZE_LIMIT]
            rowNodeEq = @circuitRowInfo[rowInfo.nodeEq]

            if (rowNodeEq.type != RowInfo.ROW_EQUAL) or (row is rowNodeEq.nodeEq)
              break

            rowInfo.nodeEq = rowNodeEq.nodeEq

        if rowInfo.type is RowInfo.ROW_CONST
          rowInfo.mapCol = -1

    for row in [0...@matrixSize]
      rowInfo = @circuitRowInfo[row]
      if rowInfo.type is RowInfo.ROW_EQUAL
        rowNodeEq = @circuitRowInfo[rowInfo.nodeEq]
        if rowNodeEq.type is RowInfo.ROW_CONST
          # if something is equal to a const, it's a const
          rowInfo.type = rowNodeEq.type
          rowInfo.value = rowNodeEq.value
          rowInfo.mapCol = -1
        else
          rowInfo.mapCol = rowNodeEq.mapCol

    # make the new, simplified matrix
    newSize = newMatDim
    newMatx = Util.zeroArray2(newSize, newSize)
    newRS = new Array(newSize)

    Util.zeroArray newRS

    newIdx = 0
    for row in [0...@matrixSize]
      circuitRowInfo = @circuitRowInfo[row]

      if circuitRowInfo.dropRow
        circuitRowInfo.mapRow = -1
      else
        newRS[newIdx] = @circuitRightSide[row]

        circuitRowInfo.mapRow = newIdx
        for col in [0...@matrixSize]
          rowInfo = @circuitRowInfo[col]
          if rowInfo.type is RowInfo.ROW_CONST
            newRS[newIdx] -= rowInfo.value * @circuitMatrix[row][col]
          else
            newMatx[newIdx][rowInfo.mapCol] += @circuitMatrix[row][col]

        newIdx++

    @circuitMatrix = newMatx
    @circuitRightSide = newRS
    @matrixSize = @circuitMatrixSize = newSize

    @saveOriginalMatrixState()

    @circuitNeedsMap = true
    @analyzeFlag = false


  saveOriginalMatrixState: ->
    for row in [0...@matrixSize]
      @origRightSide[row] = @circuitRightSide[row]

    if @circuitNonLinear
      for row in [0...@matrixSize]
        for col in [0...@matrixSize]
          @origMatrix[row][col] = @circuitMatrix[row][col]

  restoreOriginalMatrixState: ->
    for row in [0...@circuitMatrixSize]
      @circuitRightSide[row] = @origRightSide[row]

    if @circuitNonLinear
      for row in [0...@circuitMatrixSize]
        for col in [0...@circuitMatrixSize]
          @circuitMatrix[row][col] = @origMatrix[row][col]

  getValueFromNode: (idx) ->
    rowInfo = @circuitRowInfo[idx]

    if rowInfo.type is RowInfo.ROW_CONST
      return rowInfo.value
    else
      return @circuitRightSide[rowInfo.mapCol]

  updateComponent: (nodeIdx, value) ->
    if isNaN(value)
      @converged = false
      return false

    if nodeIdx < (@Circuit.numNodes() - 1)
      circuitNode = @Circuit.nodeList[nodeIdx + 1]
      for circuitNodeLink in circuitNode.links
        circuitNodeLink.elm.setNodeVoltage circuitNodeLink.num, value

    else
      ji = nodeIdx - (@Circuit.numNodes() - 1)
      @Circuit.voltageSources[ji].setCurrent ji, value

    true

  sub_luFactor: (circuitMatrix, matrixSize, pivotArray) ->
# Divide each row by largest element in that row and remember scale factors
    i = 0
    while i < matrixSize
      largest = 0
      j = 0
      while j < matrixSize
        x = Math.abs(circuitMatrix[i][j])
        largest = x if x > largest
        ++j

      # Check for singular matrix:
      #if largest == 0
      #  console.error("Singular matrix (#{i}, #{j}) -> #{largest}")

      @scaleFactors[i] = 1.0 / largest
      ++i

    # Crout's method: Loop through columns first
    j = 0
    while j < matrixSize

# Calculate upper trangular elements for this column:
      i = 0
      while i < j
        matrix_ij = circuitMatrix[i][j]
        k = 0
        while k isnt i
          matrix_ij -= circuitMatrix[i][k] * circuitMatrix[k][j]
          ++k
        circuitMatrix[i][j] = matrix_ij
        ++i

      # Calculate lower triangular elements for this column
      largest = 0
      largestRow = -1
      i = j
      while i < matrixSize
        matrix_ij = circuitMatrix[i][j]
        k = 0
        while k < j
          matrix_ij -= circuitMatrix[i][k] * circuitMatrix[k][j]
          ++k

        circuitMatrix[i][j] = matrix_ij
        x = Math.abs(matrix_ij)
        if x >= largest
          largest = x
          largestRow = i
        ++i

      # Pivot
      unless j is largestRow
        k = 0
        while k < matrixSize
          x = circuitMatrix[largestRow][k]
          circuitMatrix[largestRow][k] = circuitMatrix[j][k]
          circuitMatrix[j][k] = x
          ++k
        @scaleFactors[largestRow] = @scaleFactors[j]

      # keep track of row interchanges
      pivotArray[j] = largestRow

      # avoid zeros
      circuitMatrix[j][j] = 1e-18 if circuitMatrix[j][j] is 0
      unless j is matrixSize - 1
        mult = 1 / circuitMatrix[j][j]
        i = j + 1
        while i isnt matrixSize
          circuitMatrix[i][j] *= mult
          ++i
      ++j
    true


  ###
    luFactor: finds a solution to a factored matrix through LU (Lower-Upper) factorization

    Called once each frame for resistive circuits, otherwise called many times each frame

    returns a falsy value if the provided circuitMatrix can't be factored

    @param (input/output) circuitMatrix 2D matrix to be solved
    @param (input) matrixSize number or rows/columns in the matrix
    @param (output) pivotArray pivot index
  ###
  luFactor: (circuitMatrix, matrixSize, pivotArray) ->
# Divide each row by largest element in that row and remember scale factors
    i = 0
    while i < matrixSize
      largest = 0
      j = 0
      while j < matrixSize
        x = Math.abs(circuitMatrix[i][j])
        largest = x if x > largest
        ++j

      # Check for singular matrix:
      #if largest == 0
      #  console.error("Singular matrix (#{i}, #{j}) -> #{largest}")

      @scaleFactors[i] = 1.0 / largest
      ++i

    # Crout's method: Loop through columns first
    j = 0
    while j < matrixSize

# Calculate upper trangular elements for this column:
      i = 0
      while i < j
        matrix_ij = circuitMatrix[i][j]
        k = 0
        while k isnt i
          matrix_ij -= circuitMatrix[i][k] * circuitMatrix[k][j]
          ++k
        circuitMatrix[i][j] = matrix_ij
        ++i

      # Calculate lower triangular elements for this column
      largest = 0
      largestRow = -1
      i = j
      while i < matrixSize
        matrix_ij = circuitMatrix[i][j]
        k = 0
        while k < j
          matrix_ij -= circuitMatrix[i][k] * circuitMatrix[k][j]
          ++k

        circuitMatrix[i][j] = matrix_ij
        x = Math.abs(matrix_ij)
        if x >= largest
          largest = x
          largestRow = i
        ++i

      # Pivot
      unless j is largestRow
        k = 0
        while k < matrixSize
          x = circuitMatrix[largestRow][k]
          circuitMatrix[largestRow][k] = circuitMatrix[j][k]
          circuitMatrix[j][k] = x
          ++k
        @scaleFactors[largestRow] = @scaleFactors[j]

      # keep track of row interchanges
      pivotArray[j] = largestRow

      # avoid zeros
      circuitMatrix[j][j] = 1e-18 if circuitMatrix[j][j] is 0
      unless j is matrixSize - 1
        mult = 1 / circuitMatrix[j][j]
        i = j + 1
        while i isnt matrixSize
          circuitMatrix[i][j] *= mult
          ++i
      ++j
    true


  ###
    Step 2: `lu_solve`: (Called by lu_factor)
    finds a solution to a factored matrix through LU (Lower-Upper) factorization

    Called once each frame for resistive circuits, otherwise called many times each frame

    @param circuitMatrix matrix to be solved
    @param numRows dimension
    @param pivotVector pivot index
    @param circuitRightSide Right-side (dependent) matrix
  ###
  luSolve: (circuitMatrix, numRows, pivotVector, circuitRightSide) ->
    # Find first nonzero element of circuitRightSide
    i = 0
    while i < numRows
      row = pivotVector[i]
      swap = circuitRightSide[row]
      circuitRightSide[row] = circuitRightSide[i]
      circuitRightSide[i] = swap
      break unless swap is 0
      ++i

    bi = i++
    while i < numRows
      row = pivotVector[i]
      tot = circuitRightSide[row]
      circuitRightSide[row] = circuitRightSide[i]

      # Forward substitution by using the lower triangular matrix
      j = bi
      while j < i
        tot -= circuitMatrix[i][j] * circuitRightSide[j]
        ++j
      circuitRightSide[i] = tot
      ++i

    i = numRows - 1
    while i >= 0
      total = circuitRightSide[i]

      # back-substitution using the upper triangular matrix
      j = i + 1
      while j != numRows
        total -= circuitMatrix[i][j] * circuitRightSide[j]
        ++j

      circuitRightSide[i] = total / circuitMatrix[i][i]

      i--

  dump: ->
    out = ""

    out += @Circuit.Params.toString() + "\n"

    for rowInfo in @circuitRowInfo
      out += rowInfo.toString() + "\n"

    out += "\nCircuit permute: " + Util.printArray(@circuitPermute)

    out + "\n"

  dumpOrigFrame: ->
    matrixRowCount = @origRightSide.length

    circuitMatrixDump = ""
    circuitRightSideDump = "  RS: ["

    for i in [0...matrixRowCount]
      circuitRightSideDump += Util.tidyFloat(@origRightSide[i])
      #      circuitMatrixDump += @tidyFloat(@circuitRightSide[i])

      circuitMatrixDump += "  ["
      for j in [0...matrixRowCount]
        circuitMatrixDump += Util.tidyFloat(@origMatrix[i][j])

        if(j != matrixRowCount - 1)
          circuitMatrixDump += ", "

      circuitMatrixDump += "]\n"

      if(i != matrixRowCount - 1)
        circuitRightSideDump += ", "
    #circuitMatrixDump += ", "

    out = ""
    out += circuitMatrixDump + "\n"
    out += circuitRightSideDump + "]"

    out

  dumpFrame: ->
    matrixRowCount = @circuitRightSide.length

    if !@circuitMatrix || !!@circuitMatrix[0]
      return ""

    circuitMatrixDump = ""
    circuitRightSideDump = "  RS: ["

    for i in [0...matrixRowCount]
      circuitRightSideDump += Util.tidyFloat(@circuitRightSide[i])
      #      circuitMatrixDump += @tidyFloat(@circuitRightSide[i])

      circuitMatrixDump += "  ["
      for j in [0...matrixRowCount]
        circuitMatrixDump += Util.tidyFloat(@circuitMatrix[i][j])

        if(j != matrixRowCount - 1)
          circuitMatrixDump += ", "

      circuitMatrixDump += "]\n"

      if(i != matrixRowCount - 1)
        circuitRightSideDump += ", "
        #circuitMatrixDump += ", "

    out = ""
    out += sprintf("  iter: %d, time: %.7f, subiter: %d rows: %d\n", @Circuit.iterations, @Circuit.time, @subIterations, matrixRowCount)
    out += circuitMatrixDump + "\n"
    out += circuitRightSideDump + "]"

    out

module.exports = CircuitSolver
