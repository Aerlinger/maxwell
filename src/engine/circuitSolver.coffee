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
      @scaleFactors = ArrayUtils.zeroArray(400)
      @reset()
      @Stamper = new MatrixStamper(@Circuit)


    reset: ->
      @Circuit.time = 0
      @Circuit.frames = 0

      @converged = true     # true if numerical analysis has converged
      @subIterations = 5000

      @circuitMatrix    = []
      @circuitRightSide = []

      @origMatrix       = []
      @origRightSide    = []

      @circuitRowInfo   = []
      @circuitPermute   = []

      @circuitNonLinear = false

      @lastTime = 0
      @secTime = 0
      @lastFrameTime = 0
      @lastIterTime = 0

      @analyzeFlag = true

    # TIMING


    _updateTimings: () ->
      sysTime = (new Date()).getTime()

      if @lastTime != 0
        inc = Math.floor(sysTime - @lastTime)
        currentSpeed = Math.exp(@Circuit.currentSpeed / 3.5 - 14.2)

        console.log("Setting current speed: ", 1.7 * inc * currentSpeed);
        @Circuit.Params.setCurrentMult(1.7 * inc * currentSpeed)

      if (sysTime - @secTime) >= 1000
        @frames = 0
        @steps = 0
        @secTime = sysTime

      @lastTime = sysTime

      return sysTime

    getStamper: ->
      return @Stamper

    getIterCount: ->
#      if Settings.SPEED is 0
#        return 0
#      sim_speed = @Circuit.simSpeed()
      sim_speed = 150
      return 0.1 * Math.exp((sim_speed - 61.0) / 24.0)


    reconstruct: ->
      return if !@analyzeFlag || (@Circuit.numElements() is 0)

      @Circuit.clearErrors()
      @Circuit.resetNodes()

      voltageSourceCount = 0

      gotGround = false
      gotRail = false
      volt = null

      # Check if this circuit has a voltage rail and if it has a voltage element.
      for ce in @Circuit.getElements()
        if ce instanceof GroundElm
          console.log("Found ground")
          gotGround = true
          break
        if ce instanceof RailElm
          console.log("Got rail")
          gotRail = true
        if !volt? and ce instanceof VoltageElm
          console.log("Ve")
          volt = ce

      # If no ground and no rails then voltage element's first terminal is referenced to ground:
      if !gotGround and volt? and !gotRail
        cn = new CircuitNode()
        pt = volt.getPost(0)
        console.log("GOT GROUND cn=#{cn}, pt=#{pt}")
        cn.x = pt.x
        cn.y = pt.y
        @Circuit.addCircuitNode cn


      # Else allocate extra node for ground
      else
        cn = new CircuitNode()
        cn.x = cn.y = -1
        @Circuit.addCircuitNode cn

      # Allocate nodes and voltage sources
      for i in [0...@Circuit.numElements()]
        circuitElm = @Circuit.getElmByIdx(i)
        internalNodeCount = circuitElm.getInternalNodeCount()
        internalVSCount = circuitElm.getVoltageSourceCount()
        postCount = circuitElm.getPostCount()

        # allocate a node for each post and match postCount to nodes
        for j in [0...postCount]
          postPt = circuitElm.getPost(j)

          console.log("D: " + circuitElm.dump())
#          console.log("P: " + postPt)

          k = 0
          while k < @Circuit.numNodes()
            cn = @Circuit.getNode(k)
            console.log("j=" + j + "  k=" + k + "  pt=" + postPt + "  " + cn);
            if postPt.x is cn.x and postPt.y is cn.y
              console.log("#{i} Break!")
              break

            k++

          console.log("NUM NODES: #{i} " + @Circuit.numNodes())

          if k is @Circuit.numNodes()
            cn = new CircuitNode()
            cn.x = postPt.x
            cn.y = postPt.y
            circuitNodeLink = new CircuitNodeLink()
            circuitNodeLink.num = j
            circuitNodeLink.elm = circuitElm
            cn.links.push circuitNodeLink
            circuitElm.setNode j, @Circuit.numNodes()
            @Circuit.addCircuitNode cn
          else
            cnl = new CircuitNodeLink()
            cnl.num = j
            cnl.elm = circuitElm
            @Circuit.getNode(k).links.push cnl
            circuitElm.setNode(j, k)
            # If it's the ground node, make sure the node voltage is 0, because it may not get set later.
            if k is 0
              circuitElm.setNodeVoltage(j, 0)

        for j in [0...internalNodeCount]
          cn = new CircuitNode(null, null, true)
          cnl = new CircuitNodeLink()
          cnl.num = j + postCount
          cnl.elm = circuitElm
          cn.links.push cnl
          circuitElm.setNode cnl.num, @Circuit.numNodes()
          @Circuit.addCircuitNode cn

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
            for k in [0...circuitElm.getPostCount()]
              continue if j is k
              kn = circuitElm.getNode(k)
              if circuitElm.getConnection(j, k) and !closure[kn]
                closure[kn] = true
                changed = true

        continue if changed

        # connect unconnected nodes
        for i in [0...@Circuit.numNodes()]
          if !closure[i] and !@Circuit.nodeList[i].intern
            console.warn("Node #{i} unconnected!")
            @Stamper.stampResistor 0, i, 1e8
            closure[i] = true
            changed = true
            break


      # Check paths:
      for i in [0...@Circuit.numElements()]
        ce = @Circuit.getElmByIdx(i)
        if ce instanceof InductorElm
          fpi = new Pathfinder(Pathfinder.INDUCT, ce, ce.getNode(1), @Circuit.getElements(), @Circuit.numNodes())

          # try findPath with maximum depth of 5, to avoid slowdown
          if not fpi.findPath(ce.getNode(0), 5) and not fpi.findPath(ce.getNode(0))
            ce.reset()

        # look for current sources with no current path
        if ce instanceof CurrentElm
          fpi = new Pathfinder(Pathfinder.INDUCT, ce, ce.getNode(1), @Circuit.getElements(), @Circuit.numNodes())
          unless fpi.findPath(ce.getNode(0))
            @Circuit.halt "No path for current source!", ce
            return
        # Look for voltage source loops:
        if (ce instanceof VoltageElm and ce.getPostCount() is 2) or ce instanceof WireElm
          console.log("Examining Loop: #{ce.dump()}")
          pathfinder = new Pathfinder(Pathfinder.VOLTAGE, ce, ce.getNode(1), @Circuit.getElements(), @Circuit.numNodes())

          if pathfinder.findPath(ce.getNode(0))
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

      # Simplify the matrix to improve performance
      for i in [0...@matrixSize]
        qm = -1
        qp = -1
        qv = 0

        re = @circuitRowInfo[i]
        if re.lsChanges or re.dropRow or re.rsChanges
          continue

        rsadd = 0

        # look for rows that can be removed
        for j in [0...@matrixSize]
          q = @circuitMatrix[i][j]
          # *
          if @circuitRowInfo[j].type is RowInfo.ROW_CONST
            # Keep a running total of const values that have been removed already
            rsadd -= @circuitRowInfo[j].value * q
            continue
          if q is 0
            continue
          if qp is -1
            qp = j
            qv = q
            continue
          if qm is -1 and (q is -qv)
            qm = j
            continue
          break

        if j is @matrixSize
          if qp is -1
            @Circuit.halt "Matrix error qp (rsadd = #{rsadd})", null
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
            elt.value = (@circuitRightSide[i] + rsadd) / qv
            @circuitRowInfo[i].dropRow = true

            console.error("iter = 0 # start over from scratch");
            i = -1 # start over from scratch

          else if (@circuitRightSide[i] + rsadd) is 0
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
            @circuitRowInfo[i].dropRow = true


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
      @sysTime = (new Date()).getTime();

      if not @circuitMatrix? or @Circuit.numElements() is 0
        @circuitMatrix = null
#        console.log("Called solve circuit when circuit Matrix not initialized")
        return

      debugPrint = @dumpMatrix
      @dumpMatrix = false
      stepRate = Math.floor(160 * @getIterCount())

      tm = (new Date()).getTime()

      lit = @lastIterTime

      if 1000 >= stepRate * (tm - @lastIterTime)
        return

      # Main iteration
      iter = 1
      loop
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

        @Circuit.time += @Circuit.timeStep()

#        for scope in @Circuit.scopes
#          scope.timeStep()

        tm = (new Date()).getTime()
        lit = tm

        if iter * 1000 >= stepRate * (tm - @lastIterTime)
          break
        else if (tm - @lastFrameTime) > 500
#          console.log("BREAK: timeEnd - @Circuit.getLastFrameTime() > 500!")
          break

        ++iter

        # End Iteration Loop

      @frames++

      @lastIterTime = lit

      sysTime = (new Date()).getTime()

      if @lastTime != 0
        inc = Math.floor(sysTime - @lastTime)
        currentSpeed = Math.exp(@Circuit.currentSpeed() / 3.5 - 14.2)

        console.log("Setting current speed: ", inc, currentSpeed);
        @Circuit.Params.setCurrentMult(1.7 * inc * currentSpeed)

      if (sysTime - @secTime) >= 1000
        console.log("Reset!")
        @frames = 0
        @steps = 0
        @secTime = sysTime

      @lastTime = sysTime

      @lastFrameTime = @lastTime


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

