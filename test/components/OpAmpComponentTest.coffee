describe "OpAmp Component", ->
  describe "default initialization", ->
    before ->
      @chipElm = new OpAmpElm()

    it "doesn't set any positions", ->
      expect(@chipElm.x2()).to.equal(undefined)
      expect(@chipElm.y2()).to.equal(undefined)
      expect(@chipElm.x1()).to.equal(undefined)
      expect(@chipElm.y1()).to.equal(undefined)

    it "sets default parameters", ->
      expect(@chipElm.maxOut).to.equal(15)
      expect(@chipElm.minOut).to.equal(-15)
      expect(@chipElm.gbw).to.equal(1e6)

    it "has correct initial rendering conditions", ->
      expect(@chipElm.curcount).to.equal(undefined)
      expect(@chipElm.point1).to.eql({ x: undefined, y: undefined })
      expect(@chipElm.point2).to.eql({ x: undefined, y: undefined })
      expect(@chipElm.in1p).to.eql([])
      expect(@chipElm.in2p).to.eql([])
      expect(@chipElm.textp).to.eql([])

    it "has correct node relationships", ->
      expect(@chipElm.nodes).to.eql([0, 0, 0])
      expect(@chipElm.volts).to.eql([0, 0, 0])

    it "has default method return values", ->
      expect(@chipElm.getPostCount()).to.equal 3
      expect(@chipElm.isWire()).to.equal false
      expect(@chipElm.hasGroundConnection()).to.equal false
      expect(@chipElm.needsShortcut()).to.equal false
      expect(@chipElm.canViewInScope()).to.equal false
      expect(@chipElm.getInternalNodeCount()).to.equal 0
      expect(@chipElm.orphaned()).to.equal true

    it "has correct initial state", ->
      expect(@chipElm.noDiagonal).to.eql(true)
      expect(@chipElm.component_id).to.be
      expect(@chipElm.voltSource).to.equal(0)
      expect(@chipElm.current).to.equal(0)
      expect(@chipElm.getCurrent()).to.equal(0)
      expect(@chipElm.getVoltageDiff()).to.equal(0)

    it "has params", ->
      expect(@chipElm.params).to.eql({
        "gbw": 1000000
        "maxOut": 15
        "minOut": -15
      })

  describe "With params object", ->
    before ->
      @chipElm = new OpAmpElm(50, 75, 50, 150, {
        "gbw": 1000000
        "maxOut": 15
        "minOut": -15
      })

    it "has params", ->
      expect(@chipElm.params).to.eql({
        "gbw": 1000000
        "maxOut": 15
        "minOut": -15
      })

  describe "With params array", ->
    before ->
      @chipElm = new OpAmpElm(50, 75, 50, 150, ["15.0", "-15.0", 1e7])

      @Circuit = new Circuit("Basic BJT")

      @chipElm.setPoints()
      @Circuit.solder(@chipElm)

    it "has params", ->
      expect(@chipElm.minOut).to.eql(-15)
      expect(@chipElm.maxOut).to.eql(15)
      expect(@chipElm.gbw).to.eql(1e7)
      expect(@chipElm.params).to.eql({
        "gbw": 1e7
        "minOut": -15.0
        "maxOut": 15.0
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

      expect(@chipElm.in1p).to.eql([{ x: 66, y: 75 }, { x: 66, y: 87 }])
      expect(@chipElm.in2p).to.eql([ { x: 34, y: 75 }, { x: 34, y: 87 } ])
      expect(@chipElm.textp).to.eql([{ x: 66, y: 97 }, { x: 34, y: 97 }])

      expect(@chipElm.getBoundingBox()).to.eql({x: 49, y: 75, width: 5, height: 75})

    it "snaps to grid when moved", ->
      @chipElm.moveTo(100, 162.5)
      expect(@chipElm.getCenter()).to.eql({x: 98, y: 160.5})

      expect(@chipElm.x1()).to.equal(98)
      expect(@chipElm.y1()).to.equal(123)
      expect(@chipElm.x2()).to.equal(98)
      expect(@chipElm.y2()).to.equal(198)

    it "can be stringified", ->
      expect(@chipElm.toString()).to.eql("""OpAmpElm@[98 123 98 198]: {"maxOut":15,"minOut":-15,"gbw":10000000}""")
      expect(@chipElm.getName()).to.eql("""OpAmpElm@[98 123 98 198] : {"maxOut":15,"minOut":-15,"gbw":10000000}""")

    it "can stamp", ->
      @chipElm.stamp(@Circuit.Solver.Stamper)

    describe "Loading list of parameters", ->
      before ->
        @chipElm = new OpAmpElm(100, 200, 100, 300, [-10, 10, 1e4])

      it "has correct params", ->
        expect(@chipElm.minOut).to.eql(10)
        expect(@chipElm.maxOut).to.eql(-10)
        expect(@chipElm.gbw).to.equal(1e4)

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

