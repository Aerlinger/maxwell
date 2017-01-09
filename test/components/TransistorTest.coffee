describe "Transistor Component", ->
  describe "default initialization", ->
    before ->
      @switchElm = new TransistorElm()

    it "doesn't set any positions", ->
      expect(@switchElm.x2()).to.equal(undefined)
      expect(@switchElm.y2()).to.equal(undefined)
      expect(@switchElm.x1()).to.equal(undefined)
      expect(@switchElm.y1()).to.equal(undefined)

    it "sets default parameters", ->
      expect(@switchElm.pnp).to.equal(-1)
      expect(@switchElm.lastvbe).to.equal(0)
      expect(@switchElm.lastvbc).to.equal(0)
      expect(@switchElm.beta).to.equal(100)

    it "has correct initial rendering conditions", ->
      expect(@switchElm.curcount).to.equal(undefined)
      expect(@switchElm.point1).to.eql({ x: undefined, y: undefined })
      expect(@switchElm.point2).to.eql({ x: undefined, y: undefined })
      expect(@switchElm.lead1).to.equal(undefined)
      expect(@switchElm.lead2).to.equal(undefined)
      expect(@switchElm.rect).to.eql([])
      expect(@switchElm.coll).to.eql([])
      expect(@switchElm.emit).to.eql([])

    it "has correct node relationships", ->
      expect(@switchElm.nodes).to.eql([0, 0, 0])
      expect(@switchElm.volts).to.eql([0, -0, -0])

    it "has default method return values", ->
      @switchElm.getPostCount().should.equal 3
      @switchElm.isWire().should.equal false
      @switchElm.hasGroundConnection().should.equal false
      @switchElm.needsShortcut().should.equal false
      @switchElm.canViewInScope().should.equal true
      @switchElm.getInternalNodeCount().should.equal 0
      @switchElm.orphaned().should.equal true

    it "has correct initial state", ->
      expect(@switchElm.noDiagonal).to.eql(true)
      expect(@switchElm.component_id).to.be
      expect(@switchElm.voltSource).to.equal(0)
      expect(@switchElm.current).to.equal(0)
      expect(@switchElm.ie).to.equal(0)
      expect(@switchElm.ic).to.equal(0)
      expect(@switchElm.ib).to.equal(0)
      expect(@switchElm.getCurrent()).to.equal(0)
      expect(@switchElm.getVoltageDiff()).to.equal(0)

    it "has params", ->
      expect(@switchElm.params).to.eql({
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
      @switchElm = new TransistorElm(50, 75, 50, 150, {"pnp": "-1", "lastvbe": "-4.195", "lastvbc": "0.805", "beta": "200.0"})

    it "has params", ->
      expect(@switchElm.params).to.eql({
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
      @switchElm = new TransistorElm(50, 75, 50, 150, ["1", "-4.295", "0.705", "200.0"])

      @Circuit = new Circuit("Basic BJT")

      @switchElm.setPoints()
      @switchElm.setup()
      @Circuit.solder(@switchElm)

    it "has params", ->
      expect(@switchElm.beta).to.eql(200)
      expect(@switchElm.pnp).to.eql(1)
      expect(@switchElm.volts).to.eql([0, 4.295, -0.705])
      expect(@switchElm.params).to.eql({
        "beta": 200
        "pnp": 1
        "volts": [
          0
          4.295
          -0.705
        ]
      })

    it "has correct position", ->
      expect(@switchElm.x1()).to.equal(50)
      expect(@switchElm.y1()).to.equal(75)
      expect(@switchElm.x2()).to.equal(50)
      expect(@switchElm.y2()).to.equal(150)

      expect(@switchElm.dx()).to.equal(0)
      expect(@switchElm.dy()).to.equal(75)
      expect(@switchElm.dn()).to.equal(75)
      expect(@switchElm.dsign()).to.equal(1)
      expect(@switchElm.dpx1()).to.equal(1)
      expect(@switchElm.dpy1()).to.equal(0)
      expect(@switchElm.isVertical()).to.equal(true)
      expect(@switchElm.getCenter()).to.eql({x: 50, y: 112.5})

      expect(@switchElm.getBoundingBox()).to.eql({x: 49, y: 75, width: 5, height: 75})

    it "snaps to grid when moved", ->
      @switchElm.moveTo(100, 162.5)
      expect(@switchElm.getCenter()).to.eql({x: 98, y: 160.5})

      expect(@switchElm.x1()).to.equal(98)
      expect(@switchElm.y1()).to.equal(123)
      expect(@switchElm.x2()).to.equal(98)
      expect(@switchElm.y2()).to.equal(198)

    it "can be stringified", ->
      expect(@switchElm.toString()).to.eql("""TransistorElm@[98 123 98 198]: {"beta":200,"pnp":1,"volts":[0,4.295,-0.705]}""")
      expect(@switchElm.getName()).to.eql("Bipolar Junction Transistor (PNP)")

    it "can stamp", ->
      @switchElm.stamp(@Circuit.Solver.Stamper)

    describe "Loading list of parameters", ->
      before ->
        @switchElm = new TransistorElm(100, 200, 100, 300, ["-1", "-4.295", "0.705", "100.0"])

      it "is pnp", ->
        expect(@switchElm.pnp).to.equal(-1)

    describe "Rendering", ->
      before ->
        @Circuit.clearAndReset()
        @Circuit.solder(@switchElm)

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



