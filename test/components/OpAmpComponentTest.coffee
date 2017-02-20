describe "OpAmp Component", ->
  describe "default initialization", ->
    before ->
      @transistorElm = new OpAmpElm()

    it "doesn't set any positions", ->
      expect(@transistorElm.x2()).to.equal(undefined)
      expect(@transistorElm.y2()).to.equal(undefined)
      expect(@transistorElm.x1()).to.equal(undefined)
      expect(@transistorElm.y1()).to.equal(undefined)

    it "sets default parameters", ->
      expect(@transistorElm.maxOut).to.equal(15)
      expect(@transistorElm.minOut).to.equal(-15)
      expect(@transistorElm.gbw).to.equal(1e6)

    it "has correct initial rendering conditions", ->
      expect(@transistorElm.curcount).to.equal(undefined)
      expect(@transistorElm.point1).to.eql({ x: undefined, y: undefined })
      expect(@transistorElm.point2).to.eql({ x: undefined, y: undefined })

    it "has correct node relationships", ->
      expect(@transistorElm.nodes).to.eql([0, 0, 0])
      expect(@transistorElm.volts).to.eql([0, 0, 0])

    it "has default method return values", ->
      expect(@transistorElm.numPosts()).to.equal 3
      expect(@transistorElm.isWire()).to.equal false
      expect(@transistorElm.hasGroundConnection()).to.equal false
      expect(@transistorElm.needsShortcut()).to.equal false
      expect(@transistorElm.canViewInScope()).to.equal false
      expect(@transistorElm.numInternalNodes()).to.equal 0
      expect(@transistorElm.orphaned()).to.equal true

    it "has correct initial state", ->
      expect(@transistorElm.noDiagonal).to.eql(true)
      expect(@transistorElm.component_id).to.be
      expect(@transistorElm.voltSource).to.equal(0)
      expect(@transistorElm.current).to.equal(0)
      expect(@transistorElm.getCurrent()).to.equal(0)
      expect(@transistorElm.getVoltageDiff()).to.equal(0)

    it "has params", ->
      expect(@transistorElm.params).to.eql({
        "gbw": 1000000
        "maxOut": 15
        "minOut": -15
      })

  describe "With params object", ->
    before ->
      @transistorElm = new OpAmpElm(50, 75, 50, 150, {
        "gbw": 1000000
        "maxOut": 15
        "minOut": -15
      })

    it "has params", ->
      expect(@transistorElm.params).to.eql({
        "gbw": 1000000
        "maxOut": 15
        "minOut": -15
      })

  describe "With params array", ->
    before ->
      @transistorElm = new OpAmpElm(50, 75, 50, 150, {maxOut: "15.0", minOut: "-15.0", gbw: 1e7})

      @Circuit = new Circuit("Basic BJT")

      @transistorElm.setPoints()
      @Circuit.solder(@transistorElm)

    it "has params", ->
      expect(@transistorElm.minOut).to.eql(-15)
      expect(@transistorElm.maxOut).to.eql(15)
      expect(@transistorElm.gbw).to.eql(1e7)
      expect(@transistorElm.params).to.eql({
        "gbw": 1e7
        "minOut": -15.0
        "maxOut": 15.0
      })

    it "has correct position", ->
      expect(@transistorElm.x1()).to.equal(50)
      expect(@transistorElm.y1()).to.equal(75)
      expect(@transistorElm.x2()).to.equal(50)
      expect(@transistorElm.y2()).to.equal(150)

      expect(@transistorElm.dx()).to.equal(0)
      expect(@transistorElm.dy()).to.equal(75)
      expect(@transistorElm.dn()).to.equal(75)
      expect(@transistorElm.dsign()).to.equal(1)
      expect(@transistorElm.dpx1()).to.equal(1)
      expect(@transistorElm.dpy1()).to.equal(0)
      expect(@transistorElm.isVertical()).to.equal(true)
      expect(@transistorElm.getCenter()).to.eql({x: 50, y: 112.5})

      expect(@transistorElm.in1p).to.eql([{ x: 66, y: 75 }, { x: 66, y: 87 }])
      expect(@transistorElm.in2p).to.eql([ { x: 34, y: 75 }, { x: 34, y: 87 } ])
      expect(@transistorElm.textp).to.eql([{ x: 66, y: 97 }, { x: 34, y: 97 }])

      expect(@transistorElm.getBoundingBox()).to.eql({x: 49, y: 75, width: 5, height: 75})

    it "snaps to grid when moved", ->
      @transistorElm.moveTo(100, 162.5)
      expect(@transistorElm.getCenter()).to.eql({x: 98, y: 160.5})

      expect(@transistorElm.x1()).to.equal(98)
      expect(@transistorElm.y1()).to.equal(123)
      expect(@transistorElm.x2()).to.equal(98)
      expect(@transistorElm.y2()).to.equal(198)

    it "can be stringified", ->
      expect(@transistorElm.toString()).to.eql("""OpAmpElm@[98 123 98 198]: {"maxOut":15,"minOut":-15,"gbw":10000000}""")
      expect(@transistorElm.getName()).to.eql("""OpAmp""")

    it "can stamp", ->
      @transistorElm.stamp(@Circuit.Solver.Stamper)

    describe "Loading list of parameters", ->
      before ->
        @transistorElm = new OpAmpElm(100, 200, 100, 300, {minOut: -10, maxOut: 10, gbw: 1e4})

      it "has correct params", ->
        expect(@transistorElm.minOut).to.eql(-10)
        expect(@transistorElm.maxOut).to.eql(10)
        expect(@transistorElm.gbw).to.equal(1e4)

    describe "Rendering", ->
      before ->
        @Circuit.clearAndReset()
        @Circuit.solder(@transistorElm)

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

