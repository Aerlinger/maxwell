glob = require('glob')

Circuit = require("../../src/circuit/circuit")
Renderer = require("../../src/render/renderer")

componentRegistry = require("../../src/circuit/componentRegistry")

Canvas = require('canvas')

describe "Renderer", ->
  it.only "Can place components", () ->
    @Canvas = new Canvas(600, 500)
    @Circuit = new Circuit()

    @Renderer = new Renderer(@Circuit, @Canvas)

    #    console.log(componentRegistry.ComponentDefs)

    for sym, component of componentRegistry.ComponentDefs
      @Renderer.setPlaceComponent(component.name)

