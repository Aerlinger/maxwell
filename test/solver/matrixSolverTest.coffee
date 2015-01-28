CircuitSolver = require('../../src/engine/circuitSolver.coffee')
Circuit = require('../../src/core/circuit.coffee')

describe "Matrix Solver", ->

  beforeEach ->
    @Circuit = new Circuit()
    @Solver = new CircuitSolver(@Circuit)
    @circuitPermute = [0, 0, 0]
    @solvedMatrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    @matrix3 = [[1, 2, 3], [4, 5, 6], [7, 8, 10]]

  describe "calling lu_factor", ->
    beforeEach ->
      @result = @Solver.luFactor(@matrix3, 3, @circuitPermute)

    it "factors a 3x3 nonsingular array", ->
      @result.should.equal true

    it "initializes permute matrix", ->

    it "initializes solve matrix", ->

    it "returns false for a singular matrix", ->

    describe "then calling lu_solve", ->
      beforeEach ->
        @result = @Solver.luSolve(@matrix3, 3, @circuitPermute, @solvedMatrix)

      it "solves circuit matrix", ->

      it "doesn't modify circuitMatrix", ->
