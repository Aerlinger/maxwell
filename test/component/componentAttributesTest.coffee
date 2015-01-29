CircuitComponent = require('../../src/circuit/circuitComponent.coffee')
ResistorElm = require('../../src/circuit/components/ResistorElm.coffee')

describe.only "Each component defines parameters for physical units and custom attributes", ->
  describe "Resistor", ->
#    it "inherits a name parameter from CircuitComponent", ->
#      expect(ResistorElm.Params[0]).to.deep.equal({
#        name: "name",
#        default: "",
#        type: "string"
#      })
#
    it "has resistance", ->
      expect(ResistorElm.ParameterDefinitions["resistance"]).to.deep.equal({
        default: "1000",
        symbol: "Ω",
        type: "float"
        range: [0, Infinity]
      })

    it "can be initialized through a hash object matching the parameter definitions", ->
      resistorElm = new ResistorElm(0, 0, 0, 0, null, {resistance: "3"})
      expect(resistorElm.resistance).to.equal(3)

    it "rejects a parameter that isn't defined for this object", ->
      resistorElm = new ResistorElm(0, 0, 0, 0, null, {cubits: "3"})
      expect(resistorElm.resistance).to.equal(3)

#    it "sets default resistance if none provided", ->
#      resistorElm = new ResistorElm(0, 0, 0, 0, null)
#      expect(resistorElm.resistance).to.
