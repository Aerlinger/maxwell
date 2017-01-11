describe "Switch element", ->
  describe "default initialization", ->
    before ->
      @chipElm = new SwitchElm()

    it "doesn't set any positions", ->
      expect(@chipElm.x2()).to.equal(undefined)
      expect(@chipElm.y2()).to.equal(undefined)
      expect(@chipElm.x1()).to.equal(undefined)
      expect(@chipElm.y1()).to.equal(undefined)

    it "sets default parameters", ->
      expect(@chipElm.position).to.equal(0)
      expect(@chipElm.momentary).to.equal(false)

    it "has correct initial rendering conditions", ->
      expect(@chipElm.curcount).to.equal(undefined)
      expect(@chipElm.point1).to.eql({ x: undefined, y: undefined })
      expect(@chipElm.point2).to.eql({ x: undefined, y: undefined })

    it "has correct node relationships", ->
      expect(@chipElm.nodes).to.eql([0, 0])
      expect(@chipElm.volts).to.eql([0, 0])

    it "has default method return values", ->
      @chipElm.getPostCount().should.equal 2
      @chipElm.isWire().should.equal true
      @chipElm.hasGroundConnection().should.equal false
      @chipElm.needsShortcut().should.equal false
      @chipElm.canViewInScope().should.equal true
      @chipElm.getInternalNodeCount().should.equal 0
      @chipElm.orphaned().should.equal true

    it "has correct initial state", ->
      expect(@chipElm.noDiagonal).to.eql(false)
      expect(@chipElm.component_id).to.be
      expect(@chipElm.voltSource).to.equal(0)
      expect(@chipElm.current).to.equal(0)
      expect(@chipElm.getCurrent()).to.equal(0)
      expect(@chipElm.getVoltageDiff()).to.equal(0)

    it "has params", ->
      expect(@chipElm.params).to.eql({
        momentary: false,
        position: 0
      })

  describe "With params object", ->
    before ->
      @chipElm = new SwitchElm(50, 75, 50, 150, {"momentary": true, "position": 1})

    it "has params", ->
      expect(@chipElm.params).to.eql({
        "position": 1,
        "momentary": true
      })

  describe "With params array", ->
    before ->
      @chipElm = new SwitchElm(50, 75, 50, 150, [0, false])

      @Circuit = new Circuit("Basic Switch")

      @chipElm.setPoints()
      @Circuit.solder(@chipElm)

    it "has params", ->
      expect(@chipElm.position).to.eql(0)
      expect(@chipElm.momentary).to.eql(false)
      expect(@chipElm.params).to.eql({
        "position": 0
        "momentary": false
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
      expect(@chipElm.toString()).to.eql("""SwitchElm@[98 123 98 198]: {"position":0,"momentary":false}""")
      expect(@chipElm.getName()).to.eql("Basic Switch")

    it "can stamp", ->
      @chipElm.stamp(@Circuit.Solver.Stamper)

    describe "Rendering", ->
      before ->
        @Circuit.clearAndReset()
        @Circuit.solder(@chipElm)

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



