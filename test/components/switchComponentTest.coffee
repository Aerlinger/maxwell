describe "Switch element", ->
  describe "default initialization", ->
    before ->
      @transistorElm = new SwitchElm()

    it "doesn't set any positions", ->
      expect(@transistorElm.x2()).to.equal(undefined)
      expect(@transistorElm.y2()).to.equal(undefined)
      expect(@transistorElm.x1()).to.equal(undefined)
      expect(@transistorElm.y1()).to.equal(undefined)

    it "sets default parameters", ->
      expect(@transistorElm.position).to.equal(0)
      expect(@transistorElm.momentary).to.equal(false)

    it "has correct initial rendering conditions", ->
      expect(@transistorElm.curcount).to.equal(undefined)
      expect(@transistorElm.point1).to.eql({ x: undefined, y: undefined })
      expect(@transistorElm.point2).to.eql({ x: undefined, y: undefined })

    it "has correct node relationships", ->
      expect(@transistorElm.nodes).to.eql([0, 0])
      expect(@transistorElm.volts).to.eql([0, 0])

    it "has default method return values", ->
      @transistorElm.getPostCount().should.equal 2
      @transistorElm.isWire().should.equal true
      @transistorElm.hasGroundConnection().should.equal false
      @transistorElm.needsShortcut().should.equal false
      @transistorElm.canViewInScope().should.equal true
      @transistorElm.getInternalNodeCount().should.equal 0
      @transistorElm.orphaned().should.equal true

    it "has correct initial state", ->
      expect(@transistorElm.noDiagonal).to.eql(false)
      expect(@transistorElm.component_id).to.be
      expect(@transistorElm.voltSource).to.equal(0)
      expect(@transistorElm.current).to.equal(0)
      expect(@transistorElm.getCurrent()).to.equal(0)
      expect(@transistorElm.getVoltageDiff()).to.equal(0)

    it "has params", ->
      expect(@transistorElm.params).to.eql({
        momentary: false,
        position: 0
      })

  describe "With params object", ->
    before ->
      @transistorElm = new SwitchElm(50, 75, 50, 150, {"momentary": true, "position": 1})

    it "has params", ->
      expect(@transistorElm.params).to.eql({
        "position": 1,
        "momentary": true
      })

  describe "With params array", ->
    before ->
      @transistorElm = new SwitchElm(50, 75, 50, 150, {position: 0, momentary: false})

      @Circuit = new Circuit("Basic Switch")

      @transistorElm.setPoints()
      @Circuit.solder(@transistorElm)

    it "has params", ->
      expect(@transistorElm.position).to.eql(0)
      expect(@transistorElm.momentary).to.eql(false)
      expect(@transistorElm.params).to.eql({
        "position": 0
        "momentary": false
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

      expect(@transistorElm.getBoundingBox()).to.eql({x: 49, y: 75, width: 5, height: 75})

    it "snaps to grid when moved", ->
      @transistorElm.moveTo(100, 162.5)
      expect(@transistorElm.getCenter()).to.eql({x: 98, y: 160.5})

      expect(@transistorElm.x1()).to.equal(98)
      expect(@transistorElm.y1()).to.equal(123)
      expect(@transistorElm.x2()).to.equal(98)
      expect(@transistorElm.y2()).to.equal(198)

    it "can be stringified", ->
      expect(@transistorElm.toString()).to.eql("""SwitchElm@[98 123 98 198]: {"position":0,"momentary":false}""")
      expect(@transistorElm.getName()).to.eql("Basic Switch")

    it "can stamp", ->
      @transistorElm.stamp(@Circuit.Solver.Stamper)

    describe "Rendering", ->
      before ->
        @Circuit.clearAndReset()
        @Circuit.solder(@transistorElm)

        Canvas = require('canvas')
        @canvas = new Canvas(200, 300)

        @renderer = new Renderer(@Circuit, @canvas)
        @renderer.context = @canvas.getContext('2d')
        @renderer.drawComponents()

        @componentImageFileName = "test/fixtures/componentRenders/switch_init.png"

      it "renders initial circuit", ->
        fs.writeFileSync(@componentImageFileName, @canvas.toBuffer())

      it "compares buffer", (done) ->

        resemble(@canvas.toBuffer()).compareTo(@componentImageFileName).ignoreAntialiasing().onComplete (data) =>
          data.getDiffImage().pack().pipe(fs.createWriteStream(@componentImageFileName + "_diff.png"));

          expect(data.misMatchPercentage).to.be.at.most(0.01)

          done()



