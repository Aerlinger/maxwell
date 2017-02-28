describe "CircuitUI", ->
  it "can place components", () ->
    @Canvas = new Canvas(600, 500)
    @Circuit = new Circuit()

    @Renderer = new CircuitApplication(@Circuit, @Canvas)

    for component_name, Component in Components
      @placeComponent = @Renderer.setPlaceElement(component_name)

      expect(@placeComponent.getName()).to.be
      expect(@placeComponent.getName()).to.not.eql ""

