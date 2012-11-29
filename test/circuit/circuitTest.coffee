Circuit = require('../../src/core/circuit')

describe "Base Circuit Element", ->

  beforeEach () ->
    @Circuit = new Circuit()

  describe "on initialization", ->

    it "should initiate solver", ->
      @Circuit.Solver != null
      @Circuit.Hint != null

    it "should initialize input states", ->
      @Circuit.mouseState != null
      @Circuit.keyboardState != null
      @Circuit.colorMapState != null

    it "should initialize empty collections", ->
      @Circuit.nodeList.should.be.empty
      @Circuit.elementList.should.be.empty
      @Circuit.voltageSources.should.be.empty
      @Circuit.voltageSourceCount.should.equal 0

    it "should clear all errors", ->
      @Circuit.stopMessage == null
      @Circuit.stopElm == null


  describe "apply update", ->

    beforeEach () ->
      @Circuit.updateCircuit()

    it "should call analyze circuit on the solver", ->

    it "should update after modifying solver", ->
      @Circuit.restartAndRun()

