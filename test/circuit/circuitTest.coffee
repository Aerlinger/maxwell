Circuit = require('../../src/circuit/circuit.coffee')
ResistorElm = require('../../src/circuit/components/ResistorElm.coffee')

describe "Circuit", ->
  beforeEach ->
    @Circuit = new Circuit()

  describe "initial state", ->
    it "has no errors", ->
      @Circuit.stopMessage == null
      @Circuit.stopElm == null

    it "has no observers", ->
      @Circuit.getObservers().should == []

    it "has a time of zero", ->
      expect(@Circuit.Solver.time).to.equal(0)
      expect(@iterations).to.equal(0)

    it "has a default timestep", ->
      @Circuit.timeStep().should.equal 0.000005

    it "needs analysis", ->
      expect(@Circuit.Solver.analyzeFlag).to.eq(true)

    it "has no components or nodes", ->
      @Circuit.getElements().should.be.empty
      @Circuit.getVoltageSources().should.be.empty
      @Circuit.getNodes().should.be.empty
      @Circuit.getScopes().should.be.empty

    specify "GetElmByIdx should return an empty array", ->
      @Circuit.getElmByIdx(0) == null

    describe "Adding components", ->
      before ->
        @resistor = new ResistorElm(100, 100, 200, 300, { resistance: 410 })
        @Circuit.solder(@resistor)

      it "has one resistor", ->
        expect(@Circuit.getElements()).to.eq([@resistor])

      it "can also remove the component", ->
        @Circuit.desolder(@resistor)
        expect(@Circuit.getElements()).to.eq([])
