# <DEFINE>
define ['cs!Circuit', 'cs!CircuitState'], (Circuit, State) ->
# </DEFINE>

  console.log Circuit

  describe "Circuit", ->
    beforeEach () ->
      @Circuit = new Circuit()
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


    describe "should define events for", ->
      specify "update", ->
        Circuit.ON_START_UPDATE != null

      specify "start", ->
        Circuit.ON_START != null

      specify "pause", ->
        Circuit.ON_PAUSE != null

      specify "complete", ->

      specify "component added (component)", ->
        Circuit.ON_ADD_COMPONENT != null

      specify "component removed (component)", ->
        Circuit.ON_REMOVE_COMPONENT != null

      specify "component moved (component)", ->
        Circuit.ON_MOVE_COMPONENT != null

      specify "component moved (component)", ->
        Circuit.ON_WARNING != null

      specify "component moved (component)", ->
        Circuit.ON_ERROR != null


    describe "should have one", ->
      describe "Canvas", ->

      specify "Solver", ->
        @Circuit.Solver != null

      specify "Params Object", ->



    describe "should have collection of", ->
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


    describe "apply update", ->
      beforeEach () ->
        @Circuit.updateCircuit()

      it "should call analyze circuit on the solver", ->

      it "should update after modifying solver", ->
        @Circuit.restartAndRun()

