describe "OpAmp Component", ->
  describe "default initialization", ->
    before ->
      @opampElm = new OpAmpElm()

    it "doesn't set any positions", ->
      expect(@opampElm.x2()).to.equal(undefined)
      expect(@opampElm.y2()).to.equal(undefined)
      expect(@opampElm.x1()).to.equal(undefined)
      expect(@opampElm.y1()).to.equal(undefined)

    it "sets default parameters", ->
      expect(@opampElm.maxOut).to.equal(15)
      expect(@opampElm.minOut).to.equal(-15)
      expect(@opampElm.gbw).to.equal(1e6)

    it "has correct initial rendering conditions", ->
      expect(@opampElm.curcount).to.equal(undefined)
      expect(@opampElm.point1).to.eql({ x: undefined, y: undefined })
      expect(@opampElm.point2).to.eql({ x: undefined, y: undefined })
      expect(@opampElm.in1p).to.eql([])
      expect(@opampElm.in2p).to.eql([])
      expect(@opampElm.textp).to.eql([])

    it "has correct node relationships", ->
      expect(@opampElm.nodes).to.eql([0, 0, 0])
      expect(@opampElm.volts).to.eql([0, 0, 0])

    it "has default method return values", ->
      expect(@opampElm.getPostCount()).to.equal 3
      expect(@opampElm.isWire()).to.equal false
      expect(@opampElm.hasGroundConnection()).to.equal false
      expect(@opampElm.needsShortcut()).to.equal false
      expect(@opampElm.canViewInScope()).to.equal false
      expect(@opampElm.getInternalNodeCount()).to.equal 0
      expect(@opampElm.orphaned()).to.equal true

    it "has correct initial state", ->
      expect(@opampElm.noDiagonal).to.eql(true)
      expect(@opampElm.component_id).to.be
      expect(@opampElm.voltSource).to.equal(0)
      expect(@opampElm.current).to.equal(0)
      expect(@opampElm.getCurrent()).to.equal(0)
      expect(@opampElm.getVoltageDiff()).to.equal(0)

    it "has params", ->
      expect(@opampElm.params).to.eql({
        "gbw": 1000000
        "maxOut": 15
        "minOut": -15
      })

  describe "With params object", ->
    before ->
      @opampElm = new OpAmpElm(50, 75, 50, 150, {
        "gbw": 1000000
        "maxOut": 15
        "minOut": -15
      })

    it "has params", ->
      expect(@opampElm.params).to.eql({
        "gbw": 1000000
        "maxOut": 15
        "minOut": -15
      })

  describe "With params array", ->
    before ->
      @opampElm = new OpAmpElm(50, 75, 50, 150, ["15.0", "-15.0", 1e7])

      @Circuit = new Circuit("Basic BJT")

      @opampElm.setPoints()
      @Circuit.solder(@opampElm)

    it "has params", ->
      expect(@opampElm.minOut).to.eql(-15)
      expect(@opampElm.maxOut).to.eql(15)
      expect(@opampElm.gbw).to.eql(1e7)
      expect(@opampElm.params).to.eql({
        "gbw": 1e7
        "minOut": -15.0
        "maxOut": 15.0
      })

    it "has correct position", ->
      expect(@opampElm.x1()).to.equal(50)
      expect(@opampElm.y1()).to.equal(75)
      expect(@opampElm.x2()).to.equal(50)
      expect(@opampElm.y2()).to.equal(150)

      expect(@opampElm.dx()).to.equal(0)
      expect(@opampElm.dy()).to.equal(75)
      expect(@opampElm.dn()).to.equal(75)
      expect(@opampElm.dsign()).to.equal(1)
      expect(@opampElm.dpx1()).to.equal(1)
      expect(@opampElm.dpy1()).to.equal(0)
      expect(@opampElm.isVertical()).to.equal(true)
      expect(@opampElm.getCenter()).to.eql({x: 50, y: 112.5})

      expect(@opampElm.in1p).to.eql([{ x: 66, y: 75 }, { x: 66, y: 87 }])
      expect(@opampElm.in2p).to.eql([ { x: 34, y: 75 }, { x: 34, y: 87 } ])
      expect(@opampElm.textp).to.eql([{ x: 66, y: 97 }, { x: 34, y: 97 }])

      expect(@opampElm.getBoundingBox()).to.eql({x: 49, y: 75, width: 5, height: 75})

    it "snaps to grid when moved", ->
      @opampElm.moveTo(100, 162.5)
      expect(@opampElm.getCenter()).to.eql({x: 98, y: 160.5})

      expect(@opampElm.x1()).to.equal(98)
      expect(@opampElm.y1()).to.equal(123)
      expect(@opampElm.x2()).to.equal(98)
      expect(@opampElm.y2()).to.equal(198)

    it "can be stringified", ->
      expect(@opampElm.toString()).to.eql("""OpAmpElm@[98 123 98 198]: {"maxOut":15,"minOut":-15,"gbw":10000000}""")
      expect(@opampElm.getName()).to.eql("""OpAmpElm@[98 123 98 198] : {"maxOut":15,"minOut":-15,"gbw":10000000}""")

    it "can stamp", ->
      @opampElm.stamp(@Circuit.Solver.Stamper)

    describe "Loading list of parameters", ->
      before ->
        @opampElm = new OpAmpElm(100, 200, 100, 300, [-10, 10, 1e4])

      it "has correct params", ->
        expect(@opampElm.minOut).to.eql(10)
        expect(@opampElm.maxOut).to.eql(-10)
        expect(@opampElm.gbw).to.equal(1e4)

    describe "Rendering", ->
      before ->
        @Circuit.clearAndReset()
        @Circuit.solder(@opampElm)

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

