define ['cs!Circuit', 'cs!CircuitRenderer'], (Circuit, CircuitRenderer) ->

  describe "Render should receive a notification when a Circuit updates", ->

    beforeEach () ->
      @Circuit = new Circuit()
      @Renderer = new CircuitRenderer(@Circuit)

    it "Calling update() should also call @Renderer.clear()", ->
      @Circuit.updateCircuit()
      @Circuit.updateCircuit()
      @Circuit.updateCircuit()
      @Circuit.updateCircuit()
      @Circuit.updateCircuit()