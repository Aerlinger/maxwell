describe "Circuit", ->
  beforeEach (done)->
    @Circuit = new Circuit()
    done()

  describe "initial state", ->
    it "has no errors", ->
      @Circuit.stopMessage == null
      @Circuit.stopElm == null

    it "has no observers", ->
      expect(@Circuit.getObservers()).to == []

    it "has a time of zero", ->
      expect(@Circuit.time).to.equal(0)
      expect(@Circuit.iterations).to.equal(0)

    it "has a default timestep", ->
      expect(@Circuit.timeStep()).to.equal 0.000005

    it "needs analysis", ->
      expect(@Circuit.Solver.analyzeFlag).to.eq(true)

    it "has no components or nodes", ->
      expect(@Circuit.getElements()).to.be.empty
      expect(@Circuit.getVoltageSources()).to.be.empty
      expect(@Circuit.getNodes()).to.be.empty
      expect(@Circuit.getScopes()).to.be.empty

    specify "GetElmByIdx should return an empty array", ->
      @Circuit.getElmByIdx(0) == null

    describe "Adding components", ->
      beforeEach ->
        @resistor = new ResistorElm(100, 100, 200, 300, { resistance: 410 })

        @Circuit.solder(@resistor)

      it "has one resistor", ->
        expect(@Circuit.getElements()).to.eql([@resistor])

      it "has a bounding box for the resistor", ->
        @resistor = @Circuit.getElements()[0]
        expect(@resistor.getBoundingBox().toString()).to.equal("(100, 100) [w: 100, h: 200]")

      it "recomputes the bounds", ->
        bbox = @Circuit.boundingBox.toString()
        expect(bbox).to.equal("(100, 100) [w: 100, h: 200]")

      it "can also remove the component", ->
        @Circuit.desolder(@resistor)
#        expect(@Circuit.getElements()).to.equal([])
