describe "Matrix Solver", ->
  beforeEach ->
    @Circuit = new Circuit()
    @Solver = @Circuit.Solver

  describe "4x4 matrix", ->
    beforeEach ->
      @circuitPermute = [0, 0, 0, 0]
      @matrix3 = [
        [2, 1, 1, 0],
        [4, 3, 3, 1],
        [8, 7, 9, 5]
        [6, 7, 9, 8]
      ]

      @Solver.luFactor(@matrix3, @circuitPermute)

    it "does factorization", ->
      expect(@matrix3).to.eql([
        [8, 7, 9, 5],
        [3/4, 7/4, 9/4, 17/4],
        [1/2, -2/7, -0.8571428571428572, -0.2857142857142856]
        [1/4, -3/7, 0.3333333333333334, 0.6666666666666665]
      ])

      expect(@circuitPermute).to.eql([2, 3, 3, 3 ])

    it "does factorization", ->
      rightSide = [1, 2, 3, 4]
      @Solver.luSolve(@matrix3, 4, @circuitPermute, rightSide)

      expect(rightSide).to.eql([0.9999999999999998, 0.5, -1.4999999999999998, 1])

  describe "With singular matrix", ->
    beforeEach ->
      @circuitPermute = [0, 0, 0]
      @matrix3 = [[1, 0, 0],
                  [-2, 0, 0],
                  [4, 6, 1]]
      @solvedMatrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
      @result = @Solver.luFactor(@matrix3, @circuitPermute)

    it "still returns the factored matrix", ->
      expect(@matrix3).to.deep.equal(
        [[4, 6, 1]
         [-0.5, 3, 0.5]
         [0.25, -0.5, 1e-18]]
      )

    describe "then calling lu_solve", ->
      beforeEach ->
        @result = @Solver.luSolve(@matrix3, 3, @circuitPermute, @solvedMatrix)

      it "solves circuit matrix", ->
        expect(@solvedMatrix).to.deep.equal([NaN, NaN, NaN])

      it "doesn't modify circuitPermute", ->
        expect(@circuitPermute).to.deep.equal([2, 1, 2])
