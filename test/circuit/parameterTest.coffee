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

    it "shows warning when setting invalid param", ->
      @MosfetElm.update({vt: 2})

      expect(@MosfetElm.vt).to.eql(2)

    it "shows warning when setting invalid param", ->
      @MosfetElm.update({nonsense: 2})

      expect(@MosfetElm.vt).to.eql(1.5)

    it "shows warning when setting invalid value for valid param", ->
      @MosfetElm.update({pnp: 2})

      expect(@MosfetElm.pnp).to.eql(1)


  describe "DecadeElm", ->
    beforeEach ->
      @DecadeElm = new DecadeElm(0, 0, 0, 0, {"bits": 10, "volts": [0, 0, 0, 0, 0, 0, 5, 0, 0, 0]})

    it "Has correct initial voltage", ->
      expect(@DecadeElm.bits).to.eql(10)
      expect(@DecadeElm.volts).to.eql([0, 0, 0, 0, 0, 0, 5, 0, 0, 0])

      expect(@DecadeElm.params).to.eql({
        "bits": 10, "volts": [0, 0, 0, 0, 0, 0, 5, 0, 0, 0]
      })

  describe "CounterElm", ->
    beforeEach ->
      @CounterElm = new CounterElm(0, 0, 0, 0, {"bits": 10, "volts": [0, 0, 0, 0, 0, 0, 5, 0, 0, 0]})

    it "Has correct initial voltage", ->
      expect(@CounterElm.bits).to.eql(10)
      expect(@CounterElm.volts).to.eql([0, 0, 0, 0, 0, 0, 5, 0, 0, 0])

      expect(@CounterElm.params).to.eql({
        "bits": 10, "volts": [0, 0, 0, 0, 0, 0, 5, 0, 0, 0]
      })

  describe "CC2Elm", ->
    beforeEach ->
      @CC2Elm = new CC2Elm(0, 0, 0, 0, {"gain": 10})

    it "Has correct initial voltage", ->
      expect(@CC2Elm.gain).to.eql(10)

      expect(@CC2Elm.params).to.eql({
        "gain": 10
      })
