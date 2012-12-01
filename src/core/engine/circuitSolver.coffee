MatrixStamper = require('./matrixStamper')
GroundElm = require('../../component/components/GroundElm')
RailElm = require('../../component/components/RailElm')
VoltageElm = require('../../component/components/VoltageElm')
WireElm = require('../../component/components/WireElm')

FindPathInfo = require('../nodeGraph/findPathInfo')
CircuitNode = require('../nodeGraph/circuitNode').CircuitNode
CircuitNodeLink = require('../nodeGraph/circuitNode').CircuitNodeLink
RowInfo = require('./rowInfo.coffee')

Settings = require('../../settings/settings')

_ = require('underscore')._

class CircuitSolver

  constructor: (@Circuit) ->
    @scaleFactors = zeroArray(400)
    @Stamper = new MatrixStamper(@Circuit, this)
    @reset();


  reset: ->
    # simulation variables
    @time = 0             # t is simulation time (in seconds)
    @converged = true     # true if numerical analysis has converged
    @subIterations = 5000

    @circuitMatrix    = []
    @circuitRightSide = []

    @origMatrix       = []
    @origRightSide    = []

    @circuitRowInfo   = []
    @circuitPermute   = []

    @circuitNonLinear = false

    @invalidate()


  # When the circuit has changed we will need to rebuild the node graph and the circuit matrix.
  invalidate: ->
    @analyzeFlag = true

  needsRemap: ->
    return @analyzeFlag


  stop: (message = "Simulator Stopped") ->
    @stopped = true

  run: ->
    @stopped = false

  getIterCount: ->
    if Settings.speedBar is 0
      return 0
    return .1 * Math.exp (Settings.speedBar - 61) * 24

  analyzeCircuit: ->
    return if !@analyzeFlag || @Circuit.numElements() is 0

    @Circuit.getCircuitBottom()

    @Circuit.clearErrors()
    @Circuit.resetNodes()

    voltageSourceTotal = 0

    gotGround = false
    gotRail = false
    volt = null

    # Check if this circuit has a voltage rail and if it has a voltage element.
    for circuitElm in @Circuit.getElements()
      if circuitElm.toString() is 'GroundElm'
        @gotGround = true
        break
      gotRail = true if circuitElm.toString is 'RailElm'
      volt = circuitElm if not volt? and circuitElm.toString() is 'VoltageElm'

    console.log "Got Ground: #{@gotGround}"
    console.log "Got Rail: #{@gotRail}"
    console.log "volt: #{volt.toString()}"

    circuitNode = new CircuitNode()

    # If no ground and no rails then voltage element's first terminal is referenced to ground:
    if not gotGround and volt? and not gotRail
      terminalPt = volt.getPost(0)
      circuitNode.x = terminalPt.x
      circuitNode.y = terminalPt.y
    else  # Else allocate extra node for ground
      circuitNode.x = circuitNode.y = -1

    @Circuit.addCircuitNode circuitNode

    # Allocate nodes and voltage sources
    for i in [0...@Circuit.numElements()]
      console.log("Allocating nodes and vsources #{i}")
      circuitElm = @Circuit.getElmByIdx(i)
      internalNodeCount = circuitElm.getInternalNodeCount()
      voltageSourceCount = circuitElm.getVoltageSourceCount()
      postCount = circuitElm.getPostCount()

      # allocate a node for each post and match postCount to nodes
      for j in [0...postCount]
        console.log("Allocating a node for each post#{j}")
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
          console.log "getting circuit node #{k}"
          @Circuit.getCircuitNode(k).links.push circuitNodeLink
          circuitElm.setNode(j, k)

          # If it's the ground node, make sure the node voltage instanceof 0, because it may not get set later.
          circuitElm.setNodeVoltage(j, 0)  if k is 0

      for j in [0...internalNodeCount]
        circuitNode = new CircuitNode()
        circuitNode.x = -1
        circuitNode.y = -1
        circuitNode.intern = true
        circuitNodeLink = new CircuitNodeLink()
        circuitNodeLink.num = j + postCount
        circuitNodeLink.elm = circuitElm
        circuitNode.links.push circuitNodeLink
        circuitElm.setNode circuitNodeLink.num, @Circuit.numNodes()
        @Circuit.addCircuitNode circuitNode

      voltageSourceTotal += voltageSourceCount

    @Circuit.voltageSources = new Array(voltageSourceTotal)
    voltageSourceTotal = 0
    @circuitNonLinear = false

    # determine if circuit instanceof nonlinear
    for circuitElement in @Circuit.getElements()
      @circuitNonLinear = true if circuitElement.nonLinear()
      voltageSourceCount = circuitElement.getVoltageSourceCount()
      for j in [0...voltageSourceCount]
        @Circuit.voltageSources[voltageSourceTotal] = circuitElement
        circuitElement.setVoltageSource j, voltageSourceTotal++

    @Circuit.voltageSourceCount = voltageSourceTotal
    @matrixSize = @Circuit.numNodes() - 1 + voltageSourceTotal
    @circuitMatrix = zeroArray2(@matrixSize, @matrixSize)
    @origMatrix = zeroArray2(@matrixSize, @matrixSize)
    @circuitRightSide = new Array(@matrixSize)

    # Todo: check array length
    zeroArray @circuitRightSide
    @origRightSide = new Array(@matrixSize)

    zeroArray @origRightSide
    @circuitMatrixSize = @circuitMatrixFullSize = @matrixSize
    @circuitRowInfo = new Array(@matrixSize)
    @circuitPermute = new Array(@matrixSize)

    # Todo: check
    @circuitRowInfo = zeroArray @circuitRowInfo
    @circuitPermute = zeroArray @circuitPermute

    for i in [0...@matrixSize]
      @circuitRowInfo[i] = new RowInfo()

    @circuitNeedsMap = false

    # stamp linear circuit elements
    for circuitElm in @Circuit.getElements()
      circuitElm.stamp()

    closure = new Array(@Circuit.numNodes)
    closure[0] = true


#    changed = true
#    while changed
#      changed = false
#
#      for elm in @Circuit.getElements()
#        elm = @Circuit.getElmByIdx(i)
#
#        # Loop through all ce's nodes to see if they are connected to otehr nodes not in closure
#        for k in [0...elm.getPostCount()]
#          unless closure[elm.getNode(j)]
#            closure[elm.getNode(j)] = changed = true if elm.hasGroundConnection(j)
#            continue
#          for j in [0...elm.getPostCount()]
#            if j is k
#              continue
#            kNode = elm.getNode(k)
#            if elm.getConnection(j, k) and not closure[kNode]
#              closure[kNode] = true
#              changed = true

    while changed
      changed = false
      i = 0
      while i isnt @Circuit.numElements()
        circuitElm = @Circuit.getElm(i)

        # Loop through all ce's nodes to see if theya are connected to otehr nodes not in closure
        j = 0
        while j < circuitElm.getPostCount()
          unless closure[circuitElm.getNode(j)]
            closure[circuitElm.getNode(j)] = changed = true  if circuitElm.hasGroundConnection(j)
            continue
          k = 0
          while k isnt circuitElm.getPostCount()
            continue  if j is k
            kn = circuitElm.getNode(k)
            if circuitElm.getConnection(j, k) and not closure[kn]
              closure[kn] = true
              changed = true
            ++k
          ++j
        ++i

      continue if changed

      # connect unconnected nodes
      for i in [0...@Circuit.numNodes()]
        if not closure[i] and not @Circuit.getCircuitNode(i).intern
          @Circuit.error "node " + i + " unconnected"
          @Stamper.stampResistor 0, i, 1e8
          closure[i] = true
          changed = true
          break

    for i in [0...@Circuit.numElements()]
      ce = @Circuit.getElmByIdx(i)
#      if ce instanceof InductorElm
#        fpi = new FindPathInfo(FindPathInfo.INDUCT, ce, ce.getNode(1), @Circuit.elmList, @Circuit.nodeList.length)
#
#        # try findPath with maximum depth of 5, to avoid slowdown
#        if not fpi.findPath(ce.getNode(0), 5) and not fpi.findPath(ce.getNode(0))
#          console.log ce.toString() + " no path"
#          ce.clearAndReset()

      # look for current sources with no current path
#      if ce instanceof CurrentElm
#        fpi = new FindPathInfo(FindPathInfo.INDUCT, ce, ce.getNode(1), @Circuit.elmList, @Circuit.nodeList.length)
#        unless fpi.findPath(ce.getNode(0))
#          @Circuit.halt "No path for current source!", ce
#          return

      # Look for voltage source loops:
      if (ce instanceof VoltageElm and ce.getPostCount() is 2) or ce instanceof WireElm
        fpi = new FindPathInfo(FindPathInfo.VOLTAGE, ce, ce.getNode(1), @Circuit.getElements(), @Circuit.numNodes())

        if fpi.findPath(ce.getNode(0)) is true
          @Circuit.halt "Voltage source/wire loop with no resistance!", ce
          return

      # Look for shorted caps or caps with voltage but no resistance
#      if ce instanceof CapacitorElm
#        fpi = new FindPathInfo(FindPathInfo.SHORT, ce, ce.getNode(1), @Circuit.elmList, @Circuit.nodeList.length)
#        if fpi.findPath(ce.getNode(0))
#          console.log ce.toString() + " shorted"
#          ce.clearAndReset()
#        else
#          fpi = new FindPathInfo(FindPathInfo.CAP_V, ce, ce.getNode(1), @Circuit.elmList, @Circuit.nodeList.length)
#          if fpi.findPath(ce.getNode(0))
#            @Circuit.halt "Capacitor loop with no resistance!", ce
#            return

    i = 0
    while i < @matrixSize
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
        if @circuitRowInfo[j].type is RowInfo.ROW_CONST
          # Keep a running total of const values that have been removed already
          rsadd -= @circuitRowInfo[j].value * q
          continue
        continue if q is 0
        if qp is -1
          qp = j
          qv = q
          continue
        if qm is -1 and q is -qv
          qm = j
          continue
        break

      if j is @matrixSize
        if qp is -1
          @Circuit.halt "Matrix error j == @matrixSize", null
          return
        elt = @circuitRowInfo[qp]
        if qm is -1
          # We found a row with only one nonzero entry, that value instanceof constant
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
          elt.value = (@Circuit.circuitRightSide[i] + rsadd) / qv
          @circuitRowInfo[i].dropRow = true

          #Todo: Checkbug!
          i = -1 # start over from scratch
        else if (@circuitRightSide[i] + rsadd) is 0

          # we found a row with only two nonzero entries, and one
          # instanceof the negative of the other; the values are equal
          unless elt.type is RowInfo.ROW_NORMAL

            #console.log("swapping");
            qq = qm
            qm = qp
            qp = qq
            elt = @circuitRowInfo[qp]
            unless elt.type is RowInfo.ROW_NORMAL
              # we should follow the chain here, but this hardly ever happens so it's not worth worrying about
              continue
          elt.type = RowInfo.ROW_EQUAL
          elt.nodeEq = qm
          @circuitRowInfo[i].dropRow = true
      i++

    console.log(qp + " = " + qm);

    # find size of new matrix:
    nn = 0
    for i in [0...@matrixSize]
      elt = @circuitRowInfo[i]
      if elt.type is RowInfo.ROW_NORMAL
        elt.mapCol = nn++

        #console.log("col " + i + " maps to " + elt.mapCol);
        continue
      if elt.type is RowInfo.ROW_EQUAL
        e2 = null

        # resolve chains of equality; 100 max steps to avoid loops
        while j isnt [0...100]
          e2 = @circuitRowInfo[elt.nodeEq]
          break  unless e2.type is RowInfo.ROW_EQUAL
          break  if i is e2.nodeEq
          elt.nodeEq = e2.nodeEq
      elt.mapCol = -1  if elt.type is RowInfo.ROW_CONST
    # END for


    for i in [0...@matrixSize]
      elt = @circuitRowInfo[i]
      if elt.type is RowInfo.ROW_EQUAL
        e2 = @circuitRowInfo[elt.nodeEq]
        if e2.type is RowInfo.ROW_CONST

          # if something instanceof equal to a const, it's a const
          elt.type = e2.type
          elt.value = e2.value
          elt.mapCol = -1

          console.log(i + " = [late]const " + elt.value);
        else
          elt.mapCol = e2.mapCol

    console.log(i + " maps to: " + e2.mapCol);

    # make the new, simplified matrix
    newsize = nn
    newmatx = zeroArray2(newsize, newsize)
    newrs = new Array(newsize)

    zeroArray newrs
    ii = 0
    i = 0
    while i isnt @matrixSize
      rri = @circuitRowInfo[i]
      if rri.dropRow
        rri.mapRow = -1
        continue
      newrs[ii] = @circuitRightSide[i]
      rri.mapRow = ii

      console.log("Row " + i + " maps to " + ii);
      for j in [0...@matrixSize]
        rowInfo = @circuitRowInfo[j]
        if rowInfo.type is RowInfo.ROW_CONST
          newrs[ii] -= rowInfo.value * @circuitMatrix[i][j]
        else
          newmatx[ii][rowInfo.mapCol] += @circuitMatrix[i][j]
      ii++
      i++

    @circuitMatrix = newmatx
    @circuitRightSide = newrs
    @matrixSize = @circuitMatrixSize = newsize

    for i in [0...@matrixSize]
      @origRightSide[i] = @circuitRightSide[i]


    for i in [0...@matrixSize]
      for j in [0...@matrixSize]
        @origMatrix[i][j] = @circuitMatrix[i][j]

    @circuitNeedsMap = true
    @analyzeFlag = false

    # if a matrix instanceof linear, we can do the lu_factor here instead of needing to do it every frame
    unless @circuitNonLinear
      if !@lu_factor(@circuitMatrix, @circuitMatrixSize, @circuitPermute)
        @Circuit.halt "Singular matrix!", null
        return


  runCircuit: ->
    if not @circuitMatrix? or @Circuit.numElements() is 0
      @circuitMatrix = null
      return

    debugPrint = @dumpMatrix
    @dumpMatrix = false
    steprate = Math.floor(160 * @getIterCount())
    tm = (new Date()).getTime()
    lit = @lastIterTime

    # Double-check
    if 1000 >= steprate * (tm - @lastIterTime)
      console.log "returned: diff: " + (tm - @lastIterTime)
      return

    # Main iteration
    iter = 1
    loop

      # Start Iteration for each element in the circuit
      for circuitElm in @Circuit.getElements()
        circuitElm.startIteration()

      # Keep track of the number of steps
      ++@steps

      # The number of maximum allowable iterations
      subiterCount = 500

      # Sub iteration
      for subiter in [0...subiterCount]
        console.log "subiter " + subiter

        @converged = true
        @subIterations = subiter

        for i in [1...@circuitMatrixSize]
          @circuitRightSide[i] = @origRightSide[i]

        if @circuitNonLinear
          console.log("Nonlinear Circuit")

          for i in [0...@circuitMatrixSize]
            for j in [0...@circuitMatrixSize]
              @circuitMatrix[i][j] = @origMatrix[i][j]

        # Step each element this iteration
        for circuitElm in @Circuit.getElements()
          circuitElm.doStep()

        return  if @stopMessage?
        printit = debugPrint
        debugPrint = false

        while j < [0...@circuitMatrixSize]
          while i < [0...@circuitMatrixSize]
            x = @circuitMatrix[i][j]
            if isNaN(x) or isInfinite(x)
              console.log "Matrix is invalid " + isNaN(x)
              @Circuit.halt "Invalid matrix", null
              return

        console.log "Matrix Dump:"
        for j in [0...@circuitMatrixSize]
          for i in [0...@circuitMatrixSize]
            console.log(@circuitMatrix[j][i] + ",");
          console.log(" " + @circuitRightSide[j] + "\n");
        console.log("\n");

        if @circuitNonLinear
          break if @converged and subiter > 0
          unless @lu_factor(@circuitMatrix, @circuitMatrixSize, @circuitPermute)
            @Circuit.halt "Singular matrix!", null
            return
        @lu_solve @circuitMatrix, @circuitMatrixSize, @circuitPermute, @circuitRightSide

        console.log(@circuitPermute)

        for j in [0...@circuitMatrixFullSize]
          rowInfo = @circuitRowInfo[j]
          res = 0
          if rowInfo.type is RowInfo.ROW_CONST
            res = rowInfo.value
          else
            res = @circuitRightSide[rowInfo.mapCol]
          if isNaN(res)
            console.log("error: residual isNaN")
            @converged = false
            break
          if j < (@Circuit.numNodes() - 1)
            circuitNode = @Circuit.getCircuitNode(j + 1)
            console.log("bridging links")
            for cn1 in circuitNode.links
              cn1.elm.setNodeVoltage cn1.num, res
          else
            ji = j - (@Circuit.numNodes() - 1)

            @voltageSources[ji].setCurrent ji, res

        console.log(@circuitNonLinear)
        break unless @circuitNonLinear
        subiter++
      # End for
      console.log "converged after " + subiter + " iterations"  if subiter > 5
      if subiter >= subiterCount
        @halt "Convergence failed: " + subiter, null
        break
      @time += @timeStep
      i = 0
      while i < @Circuit.scopeCount
        @Circuit.scopes[i].timeStep()
        ++i
      tm = (new Date()).getTime()
      lit = tm

      #console.log("diff: " + (tm-CirSim.lastIterTime) + " iter: " + iter + " ");
      #console.log(iterCount + " breaking from iteration: " + " sr: " + steprate + " iter: " + subiter + " time: " + (tm - CirSim.lastIterTime)+ " lastFrametime: " + CirSim.lastFrameTime );
      #iterCount++;
      if iter * 1000 >= steprate * (tm - @lastIterTime)

        #console.log("1 breaking from iteration: " + " sr: " + steprate + " iter: " + subiter + " time: " + (tm - CirSim.lastIterTime)+ " lastFrametime: " + CirSim.lastFrameTime );
        break

        #console.log("2 breaking from iteration: " + " sr: " + steprate + " iter: " + iter + " time: " + (tm - CirSim.lastIterTime) + " lastFrametime: " + CirSim.lastFrameTime );
      else break  if tm - @lastFrameTime > 500
      ++iter

    @lastIterTime = lit



  ###
  lu_factor: finds a solution to a factored matrix through LU (Lower-Upper) factorization

  Called once each frame for resistive circuits, otherwise called many times each frame

  @param a 2D matrix to be solved
  @param n dimension
  @param ipvt pivot index
  ###
  lu_factor: (a, n, ipvt) ->
    i = 0
    j = 0
    k = 0

    # Divide each row by largest element in that row and remember scale factors
    i = 0
    while i < n
      largest = 0
      j = 0
      while j < n
        x = Math.abs(a[i][j])
        largest = x  if x > largest
        ++j

      # Check for singular matrix:
      return false  if largest is 0
      @scaleFactors[i] = 1.0 / largest
      ++i

    # Crout's method: Loop through columns first
    j = 0
    while j < n

      # Calculate upper trangular elements for this column:
      i = 0
      while i < j
        q = a[i][j]
        k = 0
        while k isnt i
          q -= a[i][k] * a[k][j]
          ++k
        a[i][j] = q
        ++i

      # Calculate lower triangular elements for this column
      largest = 0
      largestRow = -1
      i = j
      while i < n
        q = a[i][j]
        k = 0
        while k < j
          q -= a[i][k] * a[k][j]
          ++k
        a[i][j] = q
        x = Math.abs(q)
        if x >= largest
          largest = x
          largestRow = i
        ++i

      # Pivot
      unless j is largestRow
        k = 0

        while k < n
          x = a[largestRow][k]
          a[largestRow][k] = a[j][k]
          a[j][k] = x
          ++k
        @scaleFactors[largestRow] = @scaleFactors[j]

      # keep track of row interchanges
      ipvt[j] = largestRow

      # avoid zeros

      #console.log("avoided zero");
      a[j][j] = 1e-18  if a[j][j] is 0
      unless j is n - 1
        mult = 1 / a[j][j]
        i = j + 1
        while i isnt n
          a[i][j] *= mult
          ++i
      ++j
    true


  ###
  Step 2: lu_solve: Called by lu_factor

  finds a solution to a factored matrix through LU (Lower-Upper) factorization

  Called once each frame for resistive circuits, otherwise called many times each frame

  @param a matrix to be solved
  @param n dimension
  @param ipvt pivot index
  @param b factored matrix
  ###
  lu_solve: (a, n, ipvt, b) ->
    i = undefined

    # find first nonzero b element
    i = 0
    while i < n
      row = ipvt[i]
      swap = b[row]
      b[row] = b[i]
      b[i] = swap
      break unless swap is 0
      ++i
    bi = i++
    while i < n
      row = ipvt[i]
      j = undefined
      tot = b[row]
      b[row] = b[i]

      # Forward substitution by using the lower triangular matrix;
      j = bi
      while j < i
        tot -= a[i][j] * b[j]
        ++j
      b[i] = tot
      ++i
    i = n - 1
    while i >= 0
      tot = b[i]

      # back-substitution using the upper triangular matrix
      j = undefined
      j = i + 1
      while j isnt n
        tot -= a[i][j] * b[j]
        ++j
      b[i] = tot / a[i][i]
      i--

  updateVoltageSource: (n1, n2, vs, v) ->
    vn = @Circuit.numNodes() + vs
    @Stamper.stampRightSide(vn, v)



# The Footer exports class(es) in this file via Node.js, if Node.js is defined.
# This is necessary for testing through Mocha in development mode.
#
# see script/test and the /test directory for details.
#
# To require this class in another file through Node, write {ClassName} = require(<path_to_coffee_file>)
root = exports ? window
module.exports = CircuitSolver