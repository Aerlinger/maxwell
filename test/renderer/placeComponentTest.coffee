glob = require('glob')

Circuit = require("../../src/circuit/circuit")
Renderer = require("../../src/render/renderer")

componentRegistry = require("../../src/circuit/componentRegistry")

Canvas = require('canvas')

describe "Renderer", ->
  it "can place components", () ->
    @Canvas = new Canvas(600, 500)
    @Circuit = new Circuit()

    @Renderer = new Renderer(@Circuit, @Canvas)

    for sym, component of componentRegistry.ComponentDefs
      @placeComponent = @Renderer.setPlaceComponent(component.name)

      expect(@placeComponent.getName()).to.be
      expect(@placeComponent.getName()).to.not.eql ""

