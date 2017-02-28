describe "Circuit Solver", ->
  beforeEach ->
    @Circuit = new Circuit()
    @Solver = @Circuit.Solver

  describe "on initialization", ->
    it "initiates solver", ->
      @Solver != null
      @Solver.Stamper != null

    it "solver belongs to @Circuit", ->
      expect(@Solver.Circuit).to.equal @Circuit
      expect(@Circuit.Solver).to.equal @Solver

    it "has correct default values", ->
      expect(@Solver.Circuit.time).to.equal 0
      expect(@Solver.converged).to.equal true
      expect(@Solver.circuitNonLinear).to.equal false
      expect(@Solver.subIterations).to.equal 5000
      expect(@Solver.analyzeFlag).to.equal true

    it "has empty default matrix values", ->
      expect(@Solver.circuitMatrix).to.be.empty
      expect(@Solver.circuitRightSide).to.be.empty
      expect(@Solver.origMatrix).to.be.empty
      expect(@Solver.origRightSide).to.be.empty
      expect(@Solver.circuitRowInfo).to.be.empty
      expect(@Solver.circuitPermute).to.be.empty
