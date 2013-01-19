# <DEFINE>
define [
  'cs!Circuit',
  'cs!ArrayUtils',

], (
  Circuit,
  ArrayUtils
) ->
# </DEFINE>


  describe "Circuit Solver", ->

    beforeEach () ->
      @Circuit = new Circuit()
      @Solver = @Circuit.Solver

    describe "on initialization", ->

      it "should initiate solver", ->
        @Solver != null
        @Solver.Stamper != null
        @Solver.scaleFactors.toString().should.equal ArrayUtils.zeroArray(400).toString()

      it "solver should belong to @Circuit", ->
        @Solver.Circuit.should.equal @Circuit
        @Circuit.Solver.should.equal @Solver

      it "should have correct default values", ->
        @Solver.time.should.equal 0
        @Solver.converged.should.equal true
        @Solver.circuitNonLinear.should.equal false
        @Solver.subIterations == 5000
        @Solver.analyzeFlag.should.equal true

      it "should have empty default matrix values", ->
        @Solver.circuitMatrix.should.be.empty
        @Solver.circuitRightSide.should.be.empty
        @Solver.origMatrix.should.be.empty
        @Solver.origRightSide.should.be.empty
        @Solver.circuitRowInfo.should.be.empty
        @Solver.circuitPermute.should.be.empty
