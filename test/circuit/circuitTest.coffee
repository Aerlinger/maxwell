# <DEFINE>
define ['cs!Circuit'], (Circuit) ->
# </DEFINE>


  describe "Circuit", ->

    beforeEach () ->
      canvas = $('canvas').get(0);
      @Circuit = new Circuit(canvas)

    describe "on initialization", ->
      it "should have no errors", ->
        @Circuit.stopMessage == null
        @Circuit.stopElm == null

      it "should have correct initial states", ->
        @Circuit.getState().should.be "RUN"     # Run, Pause, Edit
        @Circuit.getMouseState().should.be "NO_MOUSE_BUTTON"   # Moving, Dragging,
        @Circuit.getKeyboardState().should.be "NO_KEY_DOWN"   # Moving, Dragging,


    describe "should observe", ->

      specify "UIContext", ->
        @Circuit.observers.should.include @Circuit.Context

    describe "should have event listeners for", ->
      describe "onMouseMove (x, y)", ->

      describe "onMouseDown (x, y)", ->

      describe "onError (message)", ->


    describe "should dispatch events for", ->
      describe "update", ->

      describe "start", ->

      describe "pause", ->

      describe "complete", ->

      describe "component added (component)", ->

      describe "component removed (component)", ->

      describe "component moved (component)", ->


    describe "should have one", ->
      describe "Canvas", ->

      describe "Solver", ->
        @Circuit.Solver != null

      describe "Params Object", ->

      describe "Hint Object", ->
        @Circuit.Hint != null


    describe "should have collection of", ->
      specify "Voltage Sources", ->
        @Circuit.getVoltageSources().should.be.empty

      specify "Circuit Components", ->
        @Circuit.getElements().should.be.empty

      specify "GetElmByIdx should return an empty array", ->
        @Circuit.getElmByIdx(0).should.be.empty

      specify "Nodes", ->
        @Circuit.getNodes().should.be.empty

      describe "Oscilloscopes", ->
        @Circuit.getScopes().should.be.empty()


    describe "apply update", ->
      beforeEach () ->
        @Circuit.updateCircuit()

      it "should call analyze circuit on the solver", ->

      it "should update after modifying solver", ->
        @Circuit.restartAndRun()

