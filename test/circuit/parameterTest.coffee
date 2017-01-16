describe "Loading parameters", ->
  describe "MosfetElm", ->
    beforeEach ->
      @MosfetElm = new MosfetElm()

    it "Has correct initial voltage", ->
      expect(@MosfetElm.vt).to.eql 1.5
      expect(@MosfetElm.params.vt).to.eql 1.5

    it "is PNP", ->
      expect(@MosfetElm.params.pnp).to.eql MosfetElm.PNP
      expect(@MosfetElm.pnp).to.eql MosfetElm.PNP

    it "throws exception when initialized with an invalid param", ->
        expect(->
          new MosfetElm(0, 0, 0, 0, {invalid: 1})
        ).to.throw()
