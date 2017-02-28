describe "OpAmp Component", ->
  describe "default initialization", ->
    before ->
      @cc2Elm = new OpAmpElm()

    it "doesn't set any positions", ->
      expect(@cc2Elm.x2()).to.equal(undefined)
      expect(@cc2Elm.y2()).to.equal(undefined)
      expect(@cc2Elm.x1()).to.equal(undefined)
      expect(@cc2Elm.y1()).to.equal(undefined)

    it "sets default parameters", ->
      expect(@cc2Elm.maxOut).to.equal(15)
      expect(@cc2Elm.minOut).to.equal(-15)
      expect(@cc2Elm.gbw).to.equal(1e6)

    it "has correct initial rendering conditions", ->
      expect(@cc2Elm.curcount).to.equal(undefined)
      expect(@cc2Elm.point1).to.eql({ x: undefined, y: undefined })
      expect(@cc2Elm.point2).to.eql({ x: undefined, y: undefined })

    it "has correct node relationships", ->
      expect(@cc2Elm.nodes).to.eql([0, 0, 0])
      expect(@cc2Elm.volts).to.eql([0, 0, 0])

    it "has default method return values", ->
      expect(@cc2Elm.numPosts()).to.equal 3
      expect(@cc2Elm.isWire()).to.equal false
      expect(@cc2Elm.hasGroundConnection()).to.equal false
      expect(@cc2Elm.needsShortcut()).to.equal false
      expect(@cc2Elm.canViewInScope()).to.equal false
      expect(@cc2Elm.numInternalNodes()).to.equal 0
      expect(@cc2Elm.orphaned()).to.equal true

    it "has correct initial state", ->
      expect(@cc2Elm.noDiagonal).to.eql(true)
      expect(@cc2Elm.component_id).to.be
      expect(@cc2Elm.voltSource).to.equal(0)
      expect(@cc2Elm.current).to.equal(0)
      expect(@cc2Elm.getCurrent()).to.equal(0)
      expect(@cc2Elm.getVoltageDiff()).to.equal(0)

    it "has params", ->
      expect(@cc2Elm.params).to.eql({
        "gbw": 1000000
        "maxOut": 15
        "minOut": -15
      })

  describe "With params object", ->
    before ->
      @cc2Elm = new OpAmpElm(50, 75, 50, 150, {
        "gbw": 1000000
        "maxOut": 15
        "minOut": -15
      })

    it "has params", ->
      expect(@cc2Elm.params).to.eql({
        "gbw": 1000000
        "maxOut": 15
        "minOut": -15
      })

  describe "With params array", ->
    before ->
      @cc2Elm = new OpAmpElm(50, 75, 50, 150, {maxOut: "15.0", minOut: "-15.0", gbw: 1e7})

      @Circuit = new Circuit("Basic BJT")

      @cc2Elm.setPoints()
      @Circuit.solder(@cc2Elm)

    it "has params", ->
      expect(@cc2Elm.minOut).to.eql(-15)
      expect(@cc2Elm.maxOut).to.eql(15)
      expect(@cc2Elm.gbw).to.eql(1e7)
      expect(@cc2Elm.params).to.eql({
        "gbw": 1e7
        "minOut": -15.0
        "maxOut": 15.0
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

      expect(@cc2Elm.in1p).to.eql([{ x: 66, y: 75 }, { x: 66, y: 87 }])
      expect(@cc2Elm.in2p).to.eql([ { x: 34, y: 75 }, { x: 34, y: 87 } ])
      expect(@cc2Elm.textp).to.eql([{ x: 66, y: 97 }, { x: 34, y: 97 }])

      expect(@cc2Elm.getBoundingBox()).to.eql({x: 47.5, y: 75, width: 5, height: 75})

    it "snaps to grid when moved", ->
      @cc2Elm.moveTo(100, 162.5)
      expect(@cc2Elm.getCenter()).to.eql({x: 98, y: 160.5})

      expect(@cc2Elm.x1()).to.equal(98)
      expect(@cc2Elm.y1()).to.equal(123)
      expect(@cc2Elm.x2()).to.equal(98)
      expect(@cc2Elm.y2()).to.equal(198)

    it "has name", ->
      expect(@cc2Elm.getName()).to.eql("""OpAmp""")

    it "can stamp", ->
      @cc2Elm.stamp(@Circuit.Solver.Stamper)

    describe "Loading list of parameters", ->
      before ->
        @cc2Elm = new OpAmpElm(100, 200, 100, 300, {minOut: -10, maxOut: 10, gbw: 1e4})

      it "has correct params", ->
        expect(@cc2Elm.minOut).to.eql(-10)
        expect(@cc2Elm.maxOut).to.eql(10)
        expect(@cc2Elm.gbw).to.equal(1e4)

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

