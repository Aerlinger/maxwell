RowInfo = require('./rowInfo.coffee')
Util = require('../util/util.coffee')

class MatrixStamper

  constructor: (@Circuit) ->

  ###
  control voltage source vs with voltage from n1 to n2 (must also call stampVoltageSource())
  ###
  stampVCVS: (n1, n2, coef, vs) ->
    if isNaN(vs) or isNaN(coef)
      console.warn("NaN in stampVCVS")

#    console.log("stamp VCVS" + " " + n1 + " " + n2 + " " + coef + " " + vs);

    vn = @Circuit.numNodes() + vs

    @stampMatrix vn, n1, coef
    @stampMatrix vn, n2, -coef


  # stamp independent voltage source #vs, from n1 to n2, amount v
  stampVoltageSource: (n1, n2, vs, v = null) ->
    vn = @Circuit.numNodes() + vs

#    console.log("Stamp voltage source " + " " + n1 + " " + n2 + " " + vs + " " + v)

    @stampMatrix vn, n1, -1
    @stampMatrix vn, n2, 1
    @stampRightSide vn, v
    @stampMatrix n1, vn, 1
    @stampMatrix n2, vn, -1


  updateVoltageSource: (n1, n2, vs, voltage) ->
    if isNaN(voltage) or Util.isInfinite(voltage)
      @Circuit.halt "updateVoltageSource: bad voltage at #{n1} #{n2} #{vs}"
#    console.log("@Circuit.numNodes() #{@Circuit.numNodes()} #{vs} #{voltage}")

    vn = @Circuit.numNodes() + vs
    @stampRightSide vn, voltage


  stampResistor: (n1, n2, r) ->
#    console.log("Stamp resistor: " + n1 + " " + n2 + " " + r)
    r0 = 1 / r
    if isNaN(r0) or Util.isInfinite(r0)
      @Circuit.halt "bad resistance"
      a = 0
      a /= a

#    console.log("Stamp resistor: " + n1 + " " + n2 + " " + r + " ");

    @stampMatrix n1, n1, r0
    @stampMatrix n2, n2, r0
    @stampMatrix n1, n2, -r0
    @stampMatrix n2, n1, -r0


  stampConductance: (n1, n2, r0) ->
    if isNaN(r0) or Util.isInfinite(r0)
      @Circuit.halt "bad conductance at #{n1} #{n2}"

#    console.log("Stamp conductance: " + n1 + " " + n2 + " " + r0 + " ");

    @stampMatrix n1, n1, r0
    @stampMatrix n2, n2, r0
    @stampMatrix n1, n2, -r0
    @stampMatrix n2, n1, -r0


  ###
  current from cn1 to cn2 is equal to voltage from vn1 to 2, divided by g
  ###
  stampVCCurrentSource: (cn1, cn2, vn1, vn2, value) ->
    if isNaN(value) or Util.isInfinite(value)
      @Circuit.halt "Invalid gain on voltage controlled current source"

#    console.log("stampVCCurrentSource: " + cn1 + " " + cn2 + " " + vn1 + " " + vn2 + " " + value)

#    stampMatrix(cn1, vn1, g);
#    stampMatrix(cn2, vn2, g);
#    stampMatrix(cn1, vn2, -g);
#    stampMatrix(cn2, vn1, -g);

    @stampMatrix cn1, vn1, value
    @stampMatrix cn2, vn2, value
    @stampMatrix cn1, vn2, -value
    @stampMatrix cn2, vn1, -value


  stampCurrentSource: (n1, n2, value) ->
#    console.log("stampCurrentSource: " + n1 + " " + n2 + " " + value);

    @stampRightSide n1, -value
    @stampRightSide n2, value


  ###
  stamp a current source from n1 to n2 depending on current through vs
  ###
  stampCCCS: (n1, n2, vs, gain) ->
    if isNaN(gain) or Util.isInfinite(gain)
      @Circuit.halt "Invalid gain on current source"

#    console.log("stampCurrentSource: " + n1 + " " + n2 + " " + vs + " " + gain);

    vn = @Circuit.numNodes() + vs
    @stampMatrix n1, vn, gain
    @stampMatrix n2, vn, -gain


  ###
  stamp value x in row i, column j, meaning that a voltage change
  of dv in node j will increase the current into node i by x dv.
  (Unless i or j is a voltage source node.)
  ###
  stampMatrix: (row, col, value) ->
    if isNaN(value) or Util.isInfinite(value)
      @Circuit.halt "attempted to stamp Matrix with invalid value (#{value}) at #{row} #{col}"

#    console.log("stampMatrix: " + row + " " + col + " " + value);

    if row > 0 and col > 0
      if @Circuit.Solver.circuitNeedsMap
#        console.log("STAMP MATRIX if @Circuit.Solver.circuitNeedsMap", row, col, value)
        row = @Circuit.Solver.circuitRowInfo[row - 1].mapRow
        rowInfo = @Circuit.Solver.circuitRowInfo[col - 1]
        if rowInfo.type is RowInfo.ROW_CONST
#          console.log("if rowInfo.type is RowInfo.ROW_CONST", row, value * rowInfo.value)
          @Circuit.Solver.circuitRightSide[row] -= value * rowInfo.value
          return
        col = rowInfo.mapCol
      else
        row--
        col--

      @Circuit.Solver.circuitMatrix[row][col] += value


  ###
  Stamp value x on the right side of row i, representing an
  independent current source flowing into node i
  ###
  stampRightSide: (row, value) ->
    if isNaN(value) or value == null
      if row > 0
#        console.log("rschanges true " + (row - 1));
        @Circuit.Solver.circuitRowInfo[row - 1].rsChanges = true
    else
      if row > 0
        if @Circuit.Solver.circuitNeedsMap
#          console.log("ELSE " + row + " " + value)
          row = @Circuit.Solver.circuitRowInfo[row - 1].mapRow
#          console.log("if @Circuit.Solver.circuitNeedsMap", row, value)
#            console.log("stamping rs " + row + " " + value);
        else
          row--

#        console.log("circuitRightSide", row, value)
        @Circuit.Solver.circuitRightSide[row] += value


  ###
  Indicate that the values on the left side of row i change in doStep()
  ###
  stampNonLinear: (row) ->
    if isNaN(row) or (row == null)
      console.error("null/NaN in stampNonlinear")
    @Circuit.Solver.circuitRowInfo[row - 1].lsChanges = true  if row > 0


module.exports = MatrixStamper
