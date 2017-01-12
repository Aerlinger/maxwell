describe "Transistor Component", ->
  describe "default initialization", ->
    before ->
      @chipElm = new TransistorElm()

    it "doesn't set any positions", ->
      expect(@chipElm.x2()).to.equal(undefined)
      expect(@chipElm.y2()).to.equal(undefined)
      expect(@chipElm.x1()).to.equal(undefined)
      expect(@chipElm.y1()).to.equal(undefined)

    it "sets default parameters", ->
      expect(@chipElm.pnp).to.equal(-1)
      expect(@chipElm.lastvbe).to.equal(0)
      expect(@chipElm.lastvbc).to.equal(0)
      expect(@chipElm.beta).to.equal(100)

    it "has correct initial rendering conditions", ->
      expect(@chipElm.curcount).to.equal(undefined)
      expect(@chipElm.point1).to.eql({ x: undefined, y: undefined })
      expect(@chipElm.point2).to.eql({ x: undefined, y: undefined })
      expect(@chipElm.lead1).to.equal(undefined)
      expect(@chipElm.lead2).to.equal(undefined)

    it "has correct node relationships", ->
      expect(@chipElm.nodes).to.eql([0, 0, 0])
      expect(@chipElm.volts).to.eql([0, -0, -0])

    it "has default method return values", ->
      @chipElm.getPostCount().should.equal 3
      @chipElm.isWire().should.equal false
      @chipElm.hasGroundConnection().should.equal false
      @chipElm.needsShortcut().should.equal false
      @chipElm.canViewInScope().should.equal true
      @chipElm.getInternalNodeCount().should.equal 0
      @chipElm.orphaned().should.equal true

    it "has correct initial state", ->
      expect(@chipElm.noDiagonal).to.eql(true)
      expect(@chipElm.component_id).to.be
      expect(@chipElm.voltSource).to.equal(0)
      expect(@chipElm.current).to.equal(0)
      expect(@chipElm.ie).to.equal(0)
      expect(@chipElm.ic).to.equal(0)
      expect(@chipElm.ib).to.equal(0)
      expect(@chipElm.getCurrent()).to.equal(0)
      expect(@chipElm.getVoltageDiff()).to.equal(0)

    it "has params", ->
      expect(@chipElm.params).to.eql({
        "beta": 100
        "pnp": -1
        "volts": [
          0
          -0
          -0
        ]
      })

  describe "With params object", ->
    before ->
      @chipElm = new TransistorElm(50, 75, 50, 150, {"pnp": "-1", "lastvbe": "-4.195", "lastvbc": "0.805", "beta": "200.0"})

    it "has params", ->
      expect(@chipElm.params).to.eql({
        "beta": 200
        "pnp": -1
        "volts": [
          0
          4.195
          -0.805
        ]
      })

  describe "With params array", ->
    before ->
      @chipElm = new TransistorElm(50, 75, 50, 150, ["1", "-4.295", "0.705", "200.0"])

      @Circuit = new Circuit("Basic BJT")

      @chipElm.setPoints()
      @chipElm.setup()
      @Circuit.solder(@chipElm)

    it "has params", ->
      expect(@chipElm.beta).to.eql(200)
      expect(@chipElm.pnp).to.eql(1)
      expect(@chipElm.volts).to.eql([0, 4.295, -0.705])
      expect(@chipElm.params).to.eql({
        "beta": 200
        "pnp": 1
        "volts": [
          0
          4.295
          -0.705
        ]
      })

    it "has correct position", ->
      expect(@chipElm.x1()).to.equal(50)
      expect(@chipElm.y1()).to.equal(75)
      expect(@chipElm.x2()).to.equal(50)
      expect(@chipElm.y2()).to.equal(150)

      expect(@chipElm.dx()).to.equal(0)
      expect(@chipElm.dy()).to.equal(75)
      expect(@chipElm.dn()).to.equal(75)
      expect(@chipElm.dsign()).to.equal(1)
      expect(@chipElm.dpx1()).to.equal(1)
      expect(@chipElm.dpy1()).to.equal(0)
      expect(@chipElm.isVertical()).to.equal(true)
      expect(@chipElm.getCenter()).to.eql({x: 50, y: 112.5})

      expect(@chipElm.getBoundingBox()).to.eql({x: 49, y: 75, width: 5, height: 75})

    it "snaps to grid when moved", ->
      @chipElm.moveTo(100, 162.5)
      expect(@chipElm.getCenter()).to.eql({x: 98, y: 160.5})

      expect(@chipElm.x1()).to.equal(98)
      expect(@chipElm.y1()).to.equal(123)
      expect(@chipElm.x2()).to.equal(98)
      expect(@chipElm.y2()).to.equal(198)

    it "can be stringified", ->
      expect(@chipElm.toString()).to.eql("""TransistorElm@[98 123 98 198]: {"beta":200,"pnp":1,"volts":[0,4.295,-0.705]}""")
      expect(@chipElm.getName()).to.eql("Bipolar Junction Transistor (PNP)")

    it "can stamp", ->
      @chipElm.stamp(@Circuit.Solver.Stamper)

    describe "Loading list of parameters", ->
      before ->
        @chipElm = new TransistorElm(100, 200, 100, 300, ["-1", "-4.295", "0.705", "100.0"])

      it "is pnp", ->
        expect(@chipElm.pnp).to.equal(-1)

    describe "Rendering", ->
      before ->
        @Circuit.clearAndReset()
        @Circuit.solder(@chipElm)

        Canvas = require('canvas')
        @canvas = new Canvas(200, 300)

        @renderer = new Renderer(@Circuit, @canvas)
        @renderer.context = @canvas.getContext('2d')
        @renderer.drawComponents()

        @componentImageFileName = "test/fixtures/componentRenders/#{@Circuit.name}_init.png"

      it "renders initial circuit", ->
        fs.writeFileSync(@componentImageFileName, @canvas.toBuffer())

      it "compares buffer", (done) ->

        resemble(@canvas.toBuffer()).compareTo(@componentImageFileName).ignoreAntialiasing().onComplete (data) =>
          console.log(data)

          data.getDiffImage().pack().pipe(fs.createWriteStream(@componentImageFileName + "_diff.png"));

          expect(data.misMatchPercentage).to.be.at.most(0.01)

          done()



