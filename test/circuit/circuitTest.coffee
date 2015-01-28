Circuit = require('../../src/core/circuit.coffee')

describe "Circuit", ->
  beforeEach ->
    @Circuit = new Circuit()

  describe "on initialization", ->
    it "has no errors", ->
      @Circuit.stopMessage == null
      @Circuit.stopElm == null

    it "has a default timestep", ->
      @Circuit.timeStep().should.equal 0.000005

  describe "should observe", ->
    specify "UIContext", ->
      @Circuit.getObservers().should == []

  describe "has event listeners for", ->
    specify "onMouseMove (x, y)", ->

    specify "onMouseDown (x, y)", ->

    specify "onError (message)", ->


  describe "should define events for", ->
    it "update", ->
      Circuit.ON_START_UPDATE != null

    it "start", ->
      Circuit.ON_START != null

    it "pause", ->
      Circuit.ON_PAUSE != null

    it "complete", ->

    it " added (component)", ->
      Circuit.ON_ADD_COMPONENT != null

    it "component removed (component)", ->
      Circuit.ON_REMOVE_COMPONENT != null

    it " moved (component)", ->
      Circuit.ON_MOVE_COMPONENT != null

    it " moved (component)", ->
      Circuit.ON_WARNING != null

    it " moved (component)", ->
      Circuit.ON_ERROR != null


  describe "has one", ->
    describe "Canvas", ->

    it "has Solver", ->
      @Circuit.Solver != null

    it "has Params Object", ->


  describe "has collection of", ->
    specify "Voltage Sources", ->
      @Circuit.getVoltageSources().should.be.empty

    specify "Circuit Components", ->
      @Circuit.getElements().should.be.empty

    specify "Nodes", ->
      @Circuit.getNodes().should.be.empty

    specify "Oscilloscopes", ->
      @Circuit.getScopes().should.be.empty

      specify "GetElmByIdx should return an empty array", ->
      @Circuit.getElmByIdx(0) == null
