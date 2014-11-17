# <DEFINE>
define [
  'cs!MatrixStamper',
  'cs!GroundElm',
  'cs!RailElm',
  'cs!VoltageElm',
  'cs!WireElm',
  'cs!Pathfinder',
  'cs!CircuitNode',
  'cs!CircuitNodeLink',
  'cs!RowInfo',
  'cs!Settings',
  'cs!ArrayUtils',


  # Components
  'cs!CapacitorElm',
  'cs!InductorElm',
  'cs!CurrentElm',
], (
  MatrixStamper,
  GroundElm,
  RailElm,
  VoltageElm,
  WireElm,
  Pathfinder,
  CircuitNode,
  CircuitNodeLink,
  RowInfo,
  Settings,
  ArrayUtils,


  CapacitorElm,
  InductorElm,
  CurrentElm
) ->
# </DEFINE>



  class CircuitSolver

    constructor: (@Circuit) ->
      @timeStep = @Circuit.timeStep()
      @scaleFactors = ArrayUtils.zeroArray(400)
      @reset()
      @Stamper = new MatrixStamper(@Circuit)


    reset: ->
      # simulation variables
      @Circuit.resetTimings()
      @converged = true     # true if numerical analysis has converged
      @subIterations = 5000

      @circuitMatrix    = []
      @circuitRightSide = []

      @origMatrix       = []
      @origRightSide    = []

      @circuitRowInfo   = []
      @circuitPermute   = []

      @circuitNonLinear = false

#      @lastFrameTime = 0
      @lastIterTime = 0
#      @lastTime = 0
#      @secTime = 0

      @invalidate()


    # When the circuit has changed we will need to rebuild the node graph and the circuit matrix.
    invalidate: ->
      @analyzeFlag = true


    updateVoltageSource: (n1, n2, vs, voltage) ->
      @Stamper.updateVoltageSource(n1, n2, vs, voltage)

    getStamper: ->
      return @Stamper

    needsRemap: ->
      return @analyzeFlag


    pause: (message = "Simulator stopped") ->
      Logger.log message
      @isStopped = true


    run: (message = "Simulator running") ->
      Logger.log message
      @isStopped = false


    getIterCount: ->
#      if Settings.SPEED is 0
#        return 0
#      sim_speed = @Circuit.simSpeed()
      sim_speed = 50
      return 0.1 * Math.exp((sim_speed - 61.0) / 24.0)


    reconstruct: ->
      return if !@analyzeFlag || (@Circuit.numElements() is 0)

      @Circuit.getCircuitBottom()
      @Circuit.clearErrors()
      @Circuit.resetNodes()

      voltageSourceCount = 0

      gotGround = false
      gotRail = false
      volt = null

      # Check if this circuit has a voltage rail and if it has a voltage element.
      for circuitElm in @Circuit.getElements()
        if circuitElm instanceof GroundElm
          @gotGround = true
          break
        if circuitElm instanceof RailElm
          gotRail = true
        if !volt? and circuitElm instanceof VoltageElm
          volt = circuitElm

      circuitNode = new CircuitNode()

      # If no ground and no rails then voltage element's first terminal is referenced to ground:
      if !gotGround and volt? and not gotRail
        terminalPt = volt.getPost(0)
        circuitNode.x = terminalPt.x
        circuitNode.y = terminalPt.y
      # Else allocate extra node for ground
      else
        circuitNode.x = circuitNode.y = -1

      @Circuit.addCircuitNode circuitNode

      # Allocate nodes and voltage sources
      for i in [0...@Circuit.numElements()]
        circuitElm = @Circuit.getElmByIdx(i)
        internalNodeCount = circuitElm.getInternalNodeCount()
        internalVSCount = circuitElm.getVoltageSourceCount()
        postCount = circuitElm.getPostCount()

        # allocate a node for each post and match postCount to nodes
        for j in [0...postCount]
          postPt = circuitElm.getPost(j)

          k = 0
          for node in @Circuit.getNodes()
            break if postPt.x is node.x and postPt.y is node.y
            k++

          if k is @Circuit.numNodes()
            circuitNode = new CircuitNode()
            circuitNode.x = postPt.x
            circuitNode.y = postPt.y
            circuitNodeLink = new CircuitNodeLink()
            circuitNodeLink.num = j
            circuitNodeLink.elm = circuitElm
            circuitNode.links.push circuitNodeLink
            circuitElm.setNode j, @Circuit.numNodes()
            @Circuit.addCircuitNode circuitNode
          else
            circuitNodeLink = new CircuitNodeLink()
            circuitNodeLink.num = j
            circuitNodeLink.elm = circuitElm
            @Circuit.getNode(k).links.push circuitNodeLink
            circuitElm.setNode(j, k)
            # If it's the ground node, make sure the node voltage instanceof 0, because it may not get set later.
            circuitElm.setNodeVoltage(j, 0) if k is 0

        for j in [0...internalNodeCount]
          circuitNode = new CircuitNode(-1, -1, true)
          circuitNodeLink = new CircuitNodeLink()
          circuitNodeLink.num = j + postCount
          circuitNodeLink.elm = circuitElm
          circuitNode.links.push circuitNodeLink
          circuitElm.setNode circuitNodeLink.num, @Circuit.numNodes()
          @Circuit.addCircuitNode circuitNode

        voltageSourceCount += internalVSCount

      @Circuit.voltageSources = new Array(voltageSourceCount)
      voltageSourceCount = 0
      @circuitNonLinear = false

      # Determine if circuit is nonlinear
      for circuitElement in @Circuit.getElements()
        if circuitElement.nonLinear()
          @circuitNonLinear = true
        internalVSCount = circuitElement.getVoltageSourceCount()
        for j in [0...internalVSCount]
          @Circuit.voltageSources[voltageSourceCount] = circuitElement
          circuitElement.setVoltageSource j, voltageSourceCount++

      @Circuit.voltageSourceCount = voltageSourceCount

      @matrixSize = @Circuit.numNodes() - 1 + voltageSourceCount
      @circuitMatrixSize = @circuitMatrixFullSize = @matrixSize

      @circuitMatrix = ArrayUtils.zeroArray2(@matrixSize, @matrixSize)
      @origMatrix = ArrayUtils.zeroArray2(@matrixSize, @matrixSize)

      # Todo: check
      @circuitRightSide = ArrayUtils.zeroArray @matrixSize
      @origRightSide = ArrayUtils.zeroArray @matrixSize
      @circuitRowInfo = ArrayUtils.zeroArray @matrixSize
      @circuitPermute = ArrayUtils.zeroArray @matrixSize

      vs = 0

      for i in [0...@matrixSize]
        @circuitRowInfo[i] = new RowInfo()

      @circuitNeedsMap = false

      for circuitElm in @Circuit.getElements()
        circuitElm.stamp(@Stamper)

      # Determine nodes that are unconnected
      closure = new Array(@Circuit.numNodes())
      tempclosure = new Array(@Circuit.numNodes())
      closure[0] = true
      changed = true

      while changed
        changed = false
        for i in [0...@Circuit.numElements()]
          circuitElm = @Circuit.getElmByIdx(i)

          # Loop through all ce's nodes to see if they are connected to other nodes not in closure
          for j in [0...circuitElm.getPostCount()]
            unless closure[circuitElm.getNode(j)]
              if circuitElm.hasGroundConnection(j)
                changed = true
                closure[circuitElm.getNode(j)] = true
              continue
            for k in [0..circuitElm.getPostCount()]
              continue if j is k
              kn = circuitElm.getNode(k)
              if circuitElm.getConnection(j, k) and !closure[kn]
                closure[kn] = true
                changed = true

        continue if changed

        # connect unconnected nodes
        for i in [0...@Circuit.numNodes()]
          if not closure[i] and not @Circuit.nodeList[i].intern
            console.log("Node #{i} unconnected!")
            @Stamper.stampResistor 0, i, 1e8
            closure[i] = true
            changed = true
            break

      for i in [0...@Circuit.numElements()]
        ce = @Circuit.getElmByIdx(i)
        if ce instanceof InductorElm
          fpi = new Pathfinder(Pathfinder.INDUCT, ce, ce.getNode(1), @Circuit.getElements(), @Circuit.numNodes())

#          # try findPath with maximum depth of 5, to avoid slowdown
          if not fpi.findPath(ce.getNode(0), 5) and not fpi.findPath(ce.getNode(0))
            ce.reset()

#        # look for current sources with no current path
        if ce instanceof CurrentElm
          fpi = new Pathfinder(Pathfinder.INDUCT, ce, ce.getNode(1), @Circuit.getElements(), @Circuit.numNodes())
          unless fpi.findPath(ce.getNode(0))
            @Circuit.halt "No path for current source!", ce
            return
#
        # Look for voltage source loops:
        if (ce.toString() == "VoltageElm" and ce.getPostCount() is 2) or ce.toString() == "WireElm"
          console.log("Examining Loop: #{ce.dump()} #{@Circuit.numNodes()}")
          pathfinder = new Pathfinder(Pathfinder.VOLTAGE, ce, ce.getNode(1), @Circuit.getElements(), @Circuit.numNodes())

          if pathfinder.findPath(ce.getNode(0)) is true
            @Circuit.halt "Voltage source/wire loop with no resistance!", ce
#            return

#        # Look for shorted caps or caps with voltage but no resistance
        if ce instanceof CapacitorElm
          fpi = new Pathfinder(Pathfinder.SHORT, ce, ce.getNode(1), @Circuit.getElements(), @Circuit.numNodes())
          if fpi.findPath(ce.getNode(0))
            ce.reset()
          else
            fpi = new Pathfinder(Pathfinder.CAP_V, ce, ce.getNode(1), @Circuit.getElements(), @Circuit.numNodes())
            if fpi.findPath(ce.getNode(0))
              @Circuit.halt "Capacitor loop with no resistance!", ce
              return

      for iter in [0...@matrixSize]
        qm = -1
        qp = -1
        qv = 0

        re = @circuitRowInfo[iter]
        if re.lsChanges or re.dropRow or re.rsChanges
          continue

        rsadd = 0
        console.log("Start iteration")
        # look for rows that can be removed
        for j in [0...@matrixSize]
          q = @circuitMatrix[iter][j]
          # *
          if @circuitRowInfo[j].type is RowInfo.ROW_CONST
            # Keep a running total of const values that have been removed already
            rsadd -= @circuitRowInfo[j].value * q

            console.log("rsadd -= @circuitRowInfo[j].value * matrix_ij =", @circuitRowInfo[j].value * q)
            continue
          # *
          if q is 0
            console.log("q = 0")
            continue
          if qp is -1
            qp = j
            qv = q

            console.log("qv = #{qv}, qp = #{qp}")
            continue
          if qm is -1 and (q is -qv)
            qm = j
            console.log("qm = #{qm}")
            continue
          break

        if j is @matrixSize
          if qp is -1
            # FIXME: @circuitRowInfo[j] is undefined in some circuits
            @Circuit.halt "Matrix error qp (rsadd = #{rsadd})", null
            console.log("Frame 0 Dump: ----------------------------------")
            console.log("Circuit Matrix size: #{@circuitMatrixSize}")
            console.log("Circuit Matrix size: #{@matrixSize}")
            console.log("Circuit Matrix:")
            ArrayUtils.printArray @circuitMatrix
            console.log("Circuit Permute:")
            ArrayUtils.printArray @circuitPermute
            console.log("Circuit Right Side:")
            ArrayUtils.printArray @circuitRightSide
            console.log("Sim speed: #{@getIterCount()}")
            console.log("Current speed: #{@Circuit.currentSpeed()}")
            console.log(iter)
            console.log("ROWINFO: ")
            console.log(@circuitRowInfo)
            console.log("------------------------------------------------")
#            @circuitRowInfo[j].type
            return

          elt = @circuitRowInfo[qp]
          if qm is -1
            # We found a row with only one nonzero entry, that value is constant
            k = 0
            while elt.type is RowInfo.ROW_EQUAL and k < 100
              # Follow the chain
              qp = elt.nodeEq
              elt = @circuitRowInfo[qp]
              ++k
            if elt.type is RowInfo.ROW_EQUAL
              # break equal chains
              elt.type = RowInfo.ROW_NORMAL
              continue
            unless elt.type is RowInfo.ROW_NORMAL
              continue

            elt.type = RowInfo.ROW_CONST
            elt.value = (@circuitRightSide[iter] + rsadd) / qv
            @circuitRowInfo[iter].dropRow = true

            console.error("iter = 0 # start over from scratch");
            iter = -1 # start over from scratch

          else if (@circuitRightSide[iter] + rsadd) is 0
            # We found a row with only two nonzero entries, and one is the negative of the other -> the values are equal
            if elt.type != RowInfo.ROW_NORMAL
              qq = qm
              qm = qp
              qp = qq
              elt = @circuitRowInfo[qp]
              if elt.type != RowInfo.ROW_NORMAL
                # We should follow the chain here, but this hardly ever happens so it's not worth worrying about
                console.error("Swap failed!")
                continue
            elt.type = RowInfo.ROW_EQUAL
            elt.nodeEq = qm
            @circuitRowInfo[iter].dropRow = true


      # find size of new matrix:
      newMatDim = 0
      for i in [0...@matrixSize]
        rowInfo = @circuitRowInfo[i]
        if rowInfo.type is RowInfo.ROW_NORMAL
          rowInfo.mapCol = newMatDim++
          continue
        if rowInfo.type is RowInfo.ROW_EQUAL
          # resolve chains of equality; 100 max steps to avoid loops
          while j isnt [0...100]
            rowNodeEq = @circuitRowInfo[rowInfo.nodeEq]
            break  unless rowNodeEq.type is RowInfo.ROW_EQUAL
            break  if i is rowNodeEq.nodeEq
            rowInfo.nodeEq = rowNodeEq.nodeEq
        rowInfo.mapCol = -1  if rowInfo.type is RowInfo.ROW_CONST

      for i in [0...@matrixSize]
        rowInfo  = @circuitRowInfo[i]
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
      newMatx = ArrayUtils.zeroArray2(newSize, newSize)
      newRS = new Array(newSize)

      ArrayUtils.zeroArray newRS
      ii = 0
      for i in [0...@matrixSize]
        circuitRowInfo = @circuitRowInfo[i]
        if circuitRowInfo.dropRow
          circuitRowInfo.mapRow = -1
          continue
        newRS[ii] = @circuitRightSide[i]
        circuitRowInfo.mapRow = ii

        for j in [0...@matrixSize]
          rowInfo = @circuitRowInfo[j]
          if rowInfo.type is RowInfo.ROW_CONST
            newRS[ii] -= rowInfo.value * @circuitMatrix[i][j]
          else
            newMatx[ii][rowInfo.mapCol] += @circuitMatrix[i][j]
        ii++

      @circuitMatrix = newMatx
      @circuitRightSide = newRS
      @matrixSize = @circuitMatrixSize = newSize

      for i in [0...@matrixSize]
        @origRightSide[i] = @circuitRightSide[i]

      for i in [0...@matrixSize]
        for j in [0...@matrixSize]
          @origMatrix[i][j] = @circuitMatrix[i][j]

      @circuitNeedsMap = true
      @analyzeFlag = false

      # if a matrix is linear, we can do the lu_factor here instead of needing to do it every frame
      unless @circuitNonLinear
        if !@luFactor(@circuitMatrix, @circuitMatrixSize, @circuitPermute)
          @Circuit.halt "Singular matrix in linear circuit!", null
          return


    solveCircuit: ->
      if not @circuitMatrix? or @Circuit.numElements() is 0
        @circuitMatrix = null
#        console.log("Called solve circuit when circuit Matrix not initialized")
        return

      debugPrint = @dumpMatrix
      @dumpMatrix = false
      stepRate = Math.floor(160 * @getIterCount())

      tm = (new Date()).getTime()

      lit = @lastIterTime

      # Double-check
#      console.log("Step Rate: ", stepRate)
#      console.log("timeEnd - @lastIterTime", tm - @lastIterTime)
#      console.log(stepRate * (tm - @lastIterTime))
      if 1000 >= stepRate * (tm - @lastIterTime)
#        console.log("Return!")
        return

      #console.log debugPrint, stepRate, lastIterTime, @circuitMatrix, @circuitMatrixSize, @circuitPermute, @circuitRightSide,

      # Main iteration
      iter = 1
      loop
        # Start Iteration for each element in the circuit
        for circuitElm in @Circuit.getElements()
          circuitElm.startIteration()

        # Keep track of the number of steps
        ++@steps

        # The number of maximum allowable iterations
        subiterCount = 5000

        # Sub iteration
        for subiter in [0...subiterCount]
          @converged = true
          @subIterations = subiter

          for i in [0...@circuitMatrixSize]
            @circuitRightSide[i] = @origRightSide[i]

          if @circuitNonLinear
            for i in [0...@circuitMatrixSize]
              for j in [0...@circuitMatrixSize]
                @circuitMatrix[i][j] = @origMatrix[i][j]

          # Step each element this iteration
          for circuitElm in @Circuit.getElements()
            circuitElm.doStep(@Stamper)

          return if @stopMessage?

          debugPrint = false
#          isCleanArray(@circuitMatrix)

          if @circuitNonLinear
            break if @converged and subiter > 0
            unless @luFactor(@circuitMatrix, @circuitMatrixSize, @circuitPermute)
              @Circuit.halt "Singular matrix in nonlinear circuit!", null
              return

#          if @Circuit.frames == 0
#            console.log("Frame 0 Dump: ----------------------------------")
#            console.log("Circuit Matrix size: #{@circuitMatrixSize}")
#            console.log("Circuit Matrix:")
#            ArrayUtils.printArray @circuitMatrix
#            console.log("Circuit Permute:")
#            ArrayUtils.printArray @circuitPermute
#            console.log("Circuit Right Side:")
#            ArrayUtils.printArray @circuitRightSide
#            console.log("Sim speed: #{@getIterCount()}")
#            console.log("Current speed: #{@Circuit.currentSpeed()}")
#            console.log("------------------------------------------------")

          @luSolve @circuitMatrix, @circuitMatrixSize, @circuitPermute, @circuitRightSide

          for j in [0...@circuitMatrixFullSize]
            rowInfo = @circuitRowInfo[j]
            res = 0
            if rowInfo.type is RowInfo.ROW_CONST
              res = rowInfo.value
            else
              res = @circuitRightSide[rowInfo.mapCol]
            if isNaN(res)
              @converged = false
              break
            if j < (@Circuit.numNodes() - 1)
              circuitNode = @Circuit.nodeList[j + 1]
              for cn1 in circuitNode.links
                cn1.elm.setNodeVoltage cn1.num, res
            else
              ji = j - (@Circuit.numNodes() - 1)
              @Circuit.voltageSources[ji].setCurrent ji, res

          break unless @circuitNonLinear
          subiter++
        # End for

        if (subiter > 5)
          console.log("converged after " + subiter + " iterations\n");
        if subiter >= subiterCount
          @halt "Convergence failed: " + subiter, null
          break

        @Circuit.time += @timeStep

#        for scope in @Circuit.scopes
#          scope.timeStep()

        tm = (new Date()).getTime()
        lit = tm

        if iter * 1000 >= stepRate * (tm - @lastIterTime)
#          console.log("BREAK: iter * 1000 >= stepRate * (timeEnd - @lastIterTime)!")
          break
        else if (tm - @Circuit.getLastFrameTime()) > 500
#          console.log("BREAK: timeEnd - @Circuit.getLastFrameTime() > 500!")
          break

        ++iter

        # End Iteration Loop

      @Circuit.incrementFrames()

      @lastIterTime = lit

    ###
      luFactor: finds a solution to a factored matrix through LU (Lower-Upper) factorization

      Called once each frame for resistive circuits, otherwise called many times each frame

      @param circuitMatrix 2D matrix to be solved
      @param matrixSize number or rows/columns in the matrix
      @param pivotArray pivot index
    ###
    luFactor: (circuitMatrix, matrixSize, pivotArray) ->
      # Divide each row by largest element in that row and remember scale factors
      i = 0
      while i < matrixSize
        largest = 0
        j = 0
        while j < matrixSize
          x = Math.abs(circuitMatrix[i][j])
          largest = x  if x > largest
          ++j

        # Check for singular matrix:
        return false  if largest is 0
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

        # Forward substitution by using the lower triangular matrix;
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
        while j isnt numRows
          total -= circuitMatrix[i][j] * circuitRightSide[j]
          ++j
        circuitRightSide[i] = total / circuitMatrix[i][i]
        i--


  return CircuitSolver

