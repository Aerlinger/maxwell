class MatrixStamper

  constructor: (@Circuit) ->

  ###
  control voltage source vs with voltage from n1 to n2 (must also call stampVoltageSource())
  ###
  stampVCVS: (n1, n2, coef, vs) ->
    vn = @Circuit.numNodes() + vs
    @stampMatrix vn, n1, coef
    @stampMatrix vn, n2, -coef


  ###
  stamp independent voltage source #vs, from n1 to n2, amount v
  ###
  stampVoltageSource: (n1, n2, vs, v) ->
    vn = @Circuit.numNodes() + vs
    @stampMatrix vn, n1, -1
    @stampMatrix vn, n2, 1
    @stampRightSide vn, v
    @stampMatrix n1, vn, 1
    @stampMatrix n2, vn, -1

    
  updateVoltageSource: (n1, n2, vs, v) ->
    vn = @Circuit.numNodes() + vs
    @stampRightSide vn, v

    
  stampResistor: (n1, n2, r) ->
    r0 = 1 / r
    if isNaN(r0) or isInfinite(r0)
      @Circuit.error "bad resistance"
      a = 0
      a /= a
    @stampMatrix n1, n1, r0
    @stampMatrix n2, n2, r0
    @stampMatrix n1, n2, -r0
    @stampMatrix n2, n1, -r0

    
  stampConductance: (n1, n2, r0) ->
    @stampMatrix n1, n1, r0
    @stampMatrix n2, n2, r0
    @stampMatrix n1, n2, -r0
    @stampMatrix n2, n1, -r0


  ###
  current from cn1 to cn2 is equal to voltage from vn1 to 2, divided by g
  ###
  stampVCCurrentSource: (cn1, cn2, vn1, vn2, g) ->
    @stampMatrix cn1, vn1, g
    @stampMatrix cn2, vn2, g
    @stampMatrix cn1, vn2, -g
    @stampMatrix cn2, vn1, -g


  stampCurrentSource: (n1, n2, value) ->
    @stampRightSide n1, -value
    @stampRightSide n2, value


  ###
  stamp a current source from n1 to n2 depending on current through vs
  ###
  stampCCCS: (n1, n2, vs, gain) ->
    vn = @Circuit.numNodes() + vs
    @stampMatrix n1, vn, gain
    @stampMatrix n2, vn, -gain


  ###
  stamp value x in row i, column j, meaning that a voltage change
  of dv in node j will increase the current into node i by x dv.
  (Unless i or j is a voltage source node.)
  ###
  stampMatrix: (row, col, value) ->
    if row > 0 and col > 0
      console.log("stamping " + row + " " + col + " " + value);
      if @Circuit.Solver.circuitNeedsMap
        row = @Circuit.Solver.circuitRowInfo[row - 1].mapRow
        rowInfo = @Circuit.Solver.circuitRowInfo[col - 1]
        console.log("circuit needs map #{row}  #{rowInfo}");
        if rowInfo.type is RowInfo.ROW_CONST
          console.log("Stamping constant " + row + " " + col + " " + value);
          @Circuit.Solver.circuitRightSide[row] -= value * rowInfo.value
          return
        col = rowInfo.mapCol
      else
        row--
        col--

      console.log("incrementing value " + value);
      @Circuit.Solver.circuitMatrix[row][col] += value


  ###
  Stamp value x on the right side of row i, representing an
  independent current source flowing into node i
  ###
  stampRightSide: (row, value) ->
    if isNaN(value)
      console.log("rschanges true " + (row-1));
      @Circuit.Solver.circuitRowInfo[row - 1].rsChanges = true if row > 0
    else
      if row > 0
        console.log(" >> stamping rs " + row + " " + value);
        if @Circuit.Solver.circuitNeedsMap
          row = @Circuit.Solver.circuitRowInfo[row - 1].mapRow
        else
          row--
        @Circuit.Solver.circuitRightSide[row] += value


  ###
  Indicate that the values on the left side of row i change in doStep()
  ###
  stampNonLinear: (row) ->
    @Circuit.Solver.circuitRowInfo[row - 1].lsChanges = true  if row > 0


# The Footer exports class(es) in this file via Node.js, if Node.js is defined.
# This is necessary for testing through Mocha in development mode.
#
# see script/test and the /test directory for details.
#
# To require this class in another file through Node, write {ClassName} = require(<path_to_coffee_file>)
root = exports ? window
module.exports= MatrixStamper