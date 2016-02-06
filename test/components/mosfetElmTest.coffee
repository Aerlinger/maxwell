MosfetElm = require('../../src/circuit/components/MosfetElm')
Circuit = require("../../src/circuit/Circuit.coffee")

describe "MosfetElm", ->
  describe "Loading list of parameters", ->
    before ->
      @mosfetElm = new MosfetElm(100, 200, 100, 300, ["0", "1.5"])

    it "has correct position", ->
      expect(@mosfetElm.x1).to.equal(100)
      expect(@mosfetElm.y1).to.equal(200)
      expect(@mosfetElm.x2).to.equal(100)
      expect(@mosfetElm.y2).to.equal(300)

    it "is p-type", ->
      expect(@mosfetElm.pnp).to.equal(1)

    it "has correct vt", ->
      expect(@mosfetElm.vt).to.equal(1.5)


  describe "Loading list of parameters", ->
    before ->
      @mosfetElm = new MosfetElm(100, 200, 100, 300, ["1", "1.5"])

    it "has correct position", ->
      expect(@mosfetElm.x1).to.equal(100)
      expect(@mosfetElm.y1).to.equal(200)
      expect(@mosfetElm.x2).to.equal(100)
      expect(@mosfetElm.y2).to.equal(300)

    it "is n-type", ->
      expect(@mosfetElm.pnp).to.equal(-1)

    it "has correct v5", ->
      expect(@mosfetElm.vt).to.equal(1.5)

