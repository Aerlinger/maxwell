describe "Transistor Component", ->
  describe "default initialization", ->
    before ->
      @cc2Elm = new TransistorElm()

    it "doesn't set any positions", ->
      expect(@cc2Elm.x2()).to.equal(undefined)
      expect(@cc2Elm.y2()).to.equal(undefined)
      expect(@cc2Elm.x1()).to.equal(undefined)
      expect(@cc2Elm.y1()).to.equal(undefined)

    it "sets default parameters", ->
      expect(@cc2Elm.pnp).to.equal(-1)
      expect(@cc2Elm.lastvbe).to.equal(0)
      expect(@cc2Elm.lastvbc).to.equal(0)
      expect(@cc2Elm.beta).to.equal(100)

    it "has correct initial rendering conditions", ->
      expect(@cc2Elm.curcount).to.equal(undefined)
      expect(@cc2Elm.point1).to.eql({ x: undefined, y: undefined })
      expect(@cc2Elm.point2).to.eql({ x: undefined, y: undefined })
      expect(@cc2Elm.lead1).to.equal(undefined)
      expect(@cc2Elm.lead2).to.equal(undefined)

    it "has correct node relationships", ->
      expect(@cc2Elm.nodes).to.eql([0, 0, 0])
      expect(@cc2Elm.volts).to.eql([0, -0, -0])

    it "has default method return values", ->
      @cc2Elm.numPosts().should.equal 3
      @cc2Elm.isWire().should.equal false
      @cc2Elm.hasGroundConnection().should.equal false
      @cc2Elm.needsShortcut().should.equal false
      @cc2Elm.canViewInScope().should.equal true
      @cc2Elm.numInternalNodes().should.equal 0
      @cc2Elm.orphaned().should.equal true

    it "has correct initial state", ->
      expect(@cc2Elm.noDiagonal).to.eql(true)
      expect(@cc2Elm.component_id).to.be
      expect(@cc2Elm.voltSource).to.equal(0)
      expect(@cc2Elm.current).to.equal(0)
      expect(@cc2Elm.ie).to.equal(0)
      expect(@cc2Elm.ic).to.equal(0)
      expect(@cc2Elm.ib).to.equal(0)
      expect(@cc2Elm.getCurrent()).to.equal(0)
      expect(@cc2Elm.getVoltageDiff()).to.equal(0)

    it "has params", ->
      expect(@cc2Elm.params).to.eql({
        "beta": 100
        "pnp": -1
        "lastvbc": 0
        "lastvbe": 0
      })

  describe "With params object", ->
    before ->
      @cc2Elm = new TransistorElm(50, 75, 50, 150, {"pnp": -1, "lastvbe": "-4.295", "lastvbc": "0.705", "beta": "200.0"})
      @Circuit = new Circuit("Basic BJT")

      @cc2Elm.setPoints()
      @cc2Elm.setup()
      @Circuit.solder(@cc2Elm)

    it "has params", ->
      expect(@cc2Elm.params).to.eql({
        "beta": 200
        "pnp": -1
        "lastvbe": -4.295
        "lastvbc": 0.705
      })

    it "has params", ->
      expect(@cc2Elm.beta).to.eql(200)
      expect(@cc2Elm.pnp).to.eql(-1)
      expect(@cc2Elm.volts).to.eql([0, 4.295, -0.705])
      expect(@cc2Elm.params).to.eql({
        "beta": 200
        "pnp": -1
        "lastvbc": 0.705
        "lastvbe": -4.295
      })

    it "has correct position", ->
      expect(@cc2Elm.x1()).to.equal(50)
      expect(@cc2Elm.y1()).to.equal(75)
      expect(@cc2Elm.x2()).to.equal(50)
      expect(@cc2Elm.y2()).to.equal(150)

      expect(@cc2Elm.dx()).to.equal(0)
      expect(@cc2Elm.dy()).to.equal(75)
      expect(@cc2Elm.dn()).to.equal(75)
      expect(@cc2Elm.dsign()).to.equal(1)
      expect(@cc2Elm.dpx1()).to.equal(1)
      expect(@cc2Elm.dpy1()).to.equal(0)
      expect(@cc2Elm.isVertical()).to.equal(true)
      expect(@cc2Elm.getCenter()).to.eql({x: 50, y: 112.5})

      expect(@cc2Elm.getBoundingBox()).to.eql({x: 47.5, y: 75, width: 5, height: 75})

    it "snaps to grid when moved", ->
      @cc2Elm.moveTo(100, 162.5)
      expect(@cc2Elm.getCenter()).to.eql({x: 98, y: 160.5})

      expect(@cc2Elm.x1()).to.equal(98)
      expect(@cc2Elm.y1()).to.equal(123)
      expect(@cc2Elm.x2()).to.equal(98)
      expect(@cc2Elm.y2()).to.equal(198)

    it "can stamp", ->
      @cc2Elm.stamp(@Circuit.Solver.Stamper)

    describe "Rendering", ->
      before ->
        @Circuit.clearAndReset()
        @Circuit.solder(@cc2Elm)

        @canvas = new Canvas(200, 300)

        @renderer = new CircuitApplication(@Circuit, @canvas)
        @renderer.context = @canvas.getContext('2d')
        @renderer.drawComponents()

        @componentImageFileName = "test/fixtures/componentRenders/#{@Circuit.name}_init.png"

      it "renders initial circuit", ->
        fs.writeFileSync(@componentImageFileName, @canvas.toBuffer())

      it "compares buffer", (done) ->

        resemble(@canvas.toBuffer()).compareTo(@componentImageFileName).ignoreAntialiasing().onComplete (data) =>
          data.getDiffImage().pack().pipe(fs.createWriteStream(@componentImageFileName + "_diff.png"));

          expect(data.misMatchPercentage).to.be.at.most(0.01)

          done()



