# <DEFINE>
define ['cs!Circuit', 'cs!CircuitState'], (Circuit, State) ->
# </DEFINE>

  console.log Circuit

  describe "Circuit", ->
    beforeEach () ->
      canvas = $('canvas').get(0);
      @Circuit = new Circuit(canvas)
      console.log "Loading circuit"
      console.log @Circuit

    describe "on initialization", ->
      it "should have no errors", ->
        @Circuit.stopMessage == null
        @Circuit.stopElm == null

      it "should have correct initial state", ->
        @Circuit.getState() == State.RUN     # Run, Pause, Edit


    describe "should observe", ->
      specify "UIContext", ->
        @Circuit.getObservers().should == []

    describe "should have event listeners for", ->
      specify "onMouseMove (x, y)", ->

      specify "onMouseDown (x, y)", ->

      specify "onError (message)", ->


    describe "should dispatch events for", ->
      specify "update", ->

      specify "start", ->

      specify "pause", ->

      specify "complete", ->

      specify "component added (component)", ->

      specify "component removed (component)", ->

      specify "component moved (component)", ->


    describe "should have one", ->
      describe "Canvas", ->

      specify "Solver", ->
        @Circuit.Solver != null

      specify "Params Object", ->

      specify "Hint Object", ->
        @Circuit.Hint != null


    describe "should have collection of", ->
      specify "Voltage Sources", ->
        @Circuit.getVoltageSources().should.be.empty

      specify "Circuit Components", ->
        @Circuit.getElements().should.be.empty

      specify "GetElmByIdx should return an empty array", ->
        @Circuit.getElmByIdx(0) == null

      specify "Nodes", ->
        @Circuit.getNodes().should.be.empty

      specify "Oscilloscopes", ->
        @Circuit.getScopes().should.be.empty


    describe "apply update", ->
      beforeEach () ->
        @Circuit.updateCircuit()

      it "should call analyze circuit on the solver", ->

      it "should update after modifying solver", ->
        @Circuit.restartAndRun()

