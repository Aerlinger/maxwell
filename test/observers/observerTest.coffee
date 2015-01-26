define ['cs!Circuit', 'cs!CircuitCanvas'], (Circuit, CircuitCanvas) ->
  describe "Render should receive a notification when a Circuit updates", ->

    beforeEach () ->
      @Circuit = new Circuit()
      @Renderer = new CircuitCanvas(@Circuit)

    it "Calling update() should also call @Renderer.clear()", ->
      @Circuit.updateCircuit()
      @Circuit.updateCircuit()
      @Circuit.updateCircuit()
      @Circuit.updateCircuit()
      @Circuit.updateCircuit()
