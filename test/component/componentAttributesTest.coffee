CircuitComponent = require('../../src/circuit/circuitComponent.coffee')
ResistorElm = require('../../src/circuit/components/ResistorElm.coffee')

describe.only "Each component defines parameters for physical units and custom attributes", ->
  describe "Resistor", ->
    it "can be initialized through a hash object matching the parameter definitions", ->
      resistorElm = new ResistorElm(0, 0, 0, 0, null, {resistance: "3"})
      expect(resistorElm.resistance).to.equal(3)

    it "throws an exception for a parameter that isn't defined on this object", ->
      bad_resistor_definition = ->
        new ResistorElm(0, 0, 0, 0, null, {cubits: "3"})

      expect(bad_resistor_definition).to.throw(Error)

    it "sets default resistance if none provided", ->
      resistorElm = new ResistorElm(0, 0, 0, 0, null)
      expect(resistorElm.resistance).to.equal(1000)
