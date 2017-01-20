describe "CircuitUI", ->
  it "can place components", () ->
    @Canvas = new Canvas(600, 500)
    @Circuit = new Circuit()

    @Renderer = new CircuitUI(@Circuit, @Canvas)

    for sym, component of ComponentRegistry.ComponentDefs
      @placeComponent = @Renderer.setPlaceComponent(component.name)

      expect(@placeComponent.getName()).to.be
      expect(@placeComponent.getName()).to.not.eql ""

