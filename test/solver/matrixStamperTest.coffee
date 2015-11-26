MatrixStamper = require('../../src/engine/matrixStamper.coffee')
Circuit = require('../../src/circuit/circuit.coffee')

describe "Matrix stamper", ->

  beforeEach ->
    @Circuit = new Circuit()
    @CircuitSolver = @Circuit.Solver
    @MatrixStamper = new MatrixStamper(@Circuit)

  it "should stamp VCVS", ->

  it "should stamp Voltage Source", ->

  it "should stamp resistor", ->

  it "should stamp conductance", ->

  it "should stamp VCCurrentSource", ->

  it "should stamp CCCS", ->

  it "should stamp Matrix", ->

  it "should stamp right side", ->

  it "should stamp nonlinear", ->
