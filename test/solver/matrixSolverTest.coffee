Circuit = require('../../src/core/circuit')
CircuitSolver = require('../../src/core/engine/circuitSolver.coffee')


describe "Matrix solver functions", ->

  beforeEach () ->
    @Solver = new CircuitSolver()
    @circuitPermute = [0, 0, 0]
    @matrix3 = [[1, 2, 3], [4, 5, 6], [7, 8, 10]]

  describe "lu_factor", ->
    beforeEach () ->
      @result = lu_factor(@matrix3, 3, @circuitPermute)

    it "should factor a 3x3 nonsingular array", ->
      @result.should.equal true

    it "should initialize permute matrix", ->
      console.log @circuitPermute

    it "should solve matrix", ->
      console.log @matrix3

  describe "lu_solve", ->
    beforeEach () ->
      @result = lu_solve(@matrix3, 3, @circuitPermute)

    it "should factor a 3x3 nonsingular array", ->
      @result.should.equal true

    it "should initialize permute matrix", ->
      console.log @circuitPermute

    it "should solve matrix", ->
      console.log @matrix3
