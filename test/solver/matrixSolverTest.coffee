describe "Matrix Solver", ->

  beforeEach ->
    @Circuit = new Circuit()
    @Solver = @Circuit.Solver

  describe "calling lu_factor", ->
    beforeEach ->
      @circuitPermute = [0, 0, 0]
      @matrix3 = [[1, 2, 3],
                  [4, 5, 6],
                  [7, 8, 10]]

      @result = @Solver.luFactor(@matrix3, @circuitPermute)

    it "replaces first param with factored result", ->
      match = [
        [
          7
          8
          10
        ]
        [
          0.14285714285714285
          0.8571428571428572
          1.5714285714285716
        ]
        [
          0.5714285714285714
          0.5000000000000002
          -0.49999999999999967
        ]
      ]
      
      expect(@matrix3).to.deep.equal(match)

    it "initializes permute matrix", ->
      expect(@circuitPermute).to.deep.equal([2, 2, 2])

    it "returns true", ->
      expect(@result).to.be.ok

    describe "then calling lu_solve", ->
      beforeEach ->
        @solvedMatrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
        @result = @Solver.luSolve(@matrix3, 3, @circuitPermute, @solvedMatrix)

      it "solves circuit matrix", ->
        expect(@result).to.deep.equal([2, 1, 0])

      it "solves circuit matrix", ->
        expect(@solvedMatrix).to.deep.equal([NaN, NaN, NaN])

      it "doesn't modify circuitMatrix", ->
        match = [
          [
            7
            8
            10
          ]
          [
            0.14285714285714285
            0.8571428571428572
            1.5714285714285716
          ]
          [
            0.5714285714285714
            0.5000000000000002
            -0.49999999999999967
          ]
        ]

        expect(@matrix3).to.deep.equal(match)

      it "doesn't modify circuitPermute", ->
        expect(@circuitPermute).to.deep.equal([2, 2, 2])

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

    it "still returns true", ->
      expect(@result).to.be.ok

    describe "then calling lu_solve", ->
      beforeEach ->
        @result = @Solver.luSolve(@matrix3, 3, @circuitPermute, @solvedMatrix)

      it "solves circuit matrix", ->
        expect(@result).to.deep.equal([2, 1, 0])

      it "solves circuit matrix", ->
        expect(@solvedMatrix).to.deep.equal([NaN, NaN, NaN])

      it "doesn't modify circuitPermute", ->
        expect(@circuitPermute).to.deep.equal([2, 1, 2])
