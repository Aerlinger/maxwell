describe "Matrix stamper", ->

  beforeEach ->
    @Circuit = new Circuit()
    @CircuitSolver = @Circuit.Solver
    @MatrixStamper = new MatrixStamper(@Circuit)

  it "stamps VCVS", ->

  it "stamps Voltage Source", ->

  it "stamps resistor", ->

  it "stamps conductance", ->

  it "stamps VCCurrentSource", ->

  it "stamps CCCS", ->

  it "stamps Matrix", ->

  it "stamps right side", ->

  it "stamps nonlinear", ->
