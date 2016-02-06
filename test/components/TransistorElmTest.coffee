TransistorElm = require('../../src/circuit/components/TransistorElm')

Circuit = require("../../src/circuit/Circuit.coffee")

#  {"sym":"t",		"x1":"304",		"y1":"240",		"x2":"352",		"y2":"240",		"flags":"0",		"params":["1",		"-4.295",		"0.7049999999999998",		"100.0"]},

describe "TransistorElm", ->
  describe "Loading list of parameters", ->
    before ->
      @transistorElm = new TransistorElm(100, 200, 100, 300, ["0", "1", "-4.295", "0.705", "100.0"])

      @Circuit = new Circuit()

      @transistorElm.setPoints()
      @transistorElm.setup()
      @Circuit.solder(@transistorElm)

      @Circuit.updateCircuit()

    it "is pnp", ->
      expect(@transistorElm.pnp).to.equal(1)

    it "has correct vbe", ->
      expect(@transistorElm.lastvbe).to.equal(-4.295)

    it "has correct vbc", ->
      expect(@transistorElm.lastvbc).to.equal(0.705)

    it "has correct beta", ->
      expect(@transistorElm.beta).to.equal(100.0)

    it "can stamp", ->
      @transistorElm.stamp(@Circuit.Solver.Stamper)



  describe "Loading list of parameters", ->
    before ->
      @transistorElm = new TransistorElm(100, 200, 100, 300, ["0", "-1", "-4.295", "0.705", "100.0"])

    it "is pnp", ->
      expect(@transistorElm.pnp).to.equal(-1)

