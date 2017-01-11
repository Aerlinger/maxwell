Circuit = require('../../src/circuit/circuit.js')
Util = require('../../src/util/util.js')

describe "Circuit Solver", ->
  beforeEach ->
    @Circuit = new Circuit()
    @Solver = @Circuit.Solver

  describe "on initialization", ->
    it "initiates solver", ->
      @Solver != null
      @Solver.Stamper != null
      @Solver.scaleFactors.toString().should.equal Util.zeroArray(400).toString()

    it "solver belongs to @Circuit", ->
      @Solver.Circuit.should.equal @Circuit
      @Circuit.Solver.should.equal @Solver

    it "has correct default values", ->
      @Solver.Circuit.time.should.equal 0
      @Solver.converged.should.equal true
      @Solver.circuitNonLinear.should.equal false
      @Solver.subIterations == 5000
      @Solver.analyzeFlag.should.equal true

    it "has empty default matrix values", ->
      @Solver.circuitMatrix.should.be.empty
      @Solver.circuitRightSide.should.be.empty
      @Solver.origMatrix.should.be.empty
      @Solver.origRightSide.should.be.empty
      @Solver.circuitRowInfo.should.be.empty
      @Solver.circuitPermute.should.be.empty
