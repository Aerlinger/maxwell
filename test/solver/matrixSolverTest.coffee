# <DEFINE>
define [
  'cs!CircuitSolver',
  'cs!Circuit',
], (
  CircuitSolver,
  Circuit
) ->
# </DEFINE>


  describe "Matrix Solver", ->

    beforeEach () ->
      @Solver = new CircuitSolver()
      @circuitPermute = [0, 0, 0]
      @solvedMatrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
      @matrix3 = [[1, 2, 3], [4, 5, 6], [7, 8, 10]]

    describe "calling lu_factor", ->
      beforeEach () ->
        @result = @Solver.luFactor(@matrix3, 3, @circuitPermute)

      it "should factor a 3x3 nonsingular array", ->
        @result.should.equal true

      it "should initialize permute matrix", ->

      it "should solve matrix", ->

      it "should return false for a singular matrix", ->

      describe "then calling lu_solve", ->
        beforeEach () ->
          @result = @Solver.luSolve(@matrix3, 3, @circuitPermute, @solvedMatrix)

        it "should solve circuit matrix", ->

        it "should not modify circuitMatrix", ->
