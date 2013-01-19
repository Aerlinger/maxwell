# <DEFINE>
define [
  'cs!MatrixStamper',
  'cs!CircuitSolver',
  'cs!Circuit',
], (
  MatrixStamper,
  CircuitSolver,
  Circuit,
) ->
# </DEFINE>



  describe "Matrix stamper", ->

    before () ->
      @Circuit = new Circuit()
      @CircuitSolver = new CircuitSolver()
      @MatrixStamper = new MatrixStamper()

    it "should stamp VCVS", ->

    it "should stamp Voltage Source", ->

    it "should stamp resistor", ->

    it "should stamp conductance", ->

    it "should stamp VCCurrentSource", ->

    it "should stamp CCCS", ->

    it "should stamp Matrix", ->

    it "should stamp right side", ->

    it "should stamp nonlinear", ->
