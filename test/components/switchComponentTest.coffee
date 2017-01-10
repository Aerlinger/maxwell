describe "Switch element", ->
  describe "default initialization", ->
    before ->
      @opampElm = new SwitchElm()

    it "doesn't set any positions", ->
      expect(@opampElm.x2()).to.equal(undefined)
      expect(@opampElm.y2()).to.equal(undefined)
      expect(@opampElm.x1()).to.equal(undefined)
      expect(@opampElm.y1()).to.equal(undefined)

    it "sets default parameters", ->
      expect(@opampElm.position).to.equal(0)
      expect(@opampElm.momentary).to.equal(false)

    it "has correct initial rendering conditions", ->
      expect(@opampElm.curcount).to.equal(undefined)
      expect(@opampElm.point1).to.eql({ x: undefined, y: undefined })
      expect(@opampElm.point2).to.eql({ x: undefined, y: undefined })

    it "has correct node relationships", ->
      expect(@opampElm.nodes).to.eql([0, 0])
      expect(@opampElm.volts).to.eql([0, 0])

    it "has default method return values", ->
      @opampElm.getPostCount().should.equal 2
      @opampElm.isWire().should.equal true
      @opampElm.hasGroundConnection().should.equal false
      @opampElm.needsShortcut().should.equal false
      @opampElm.canViewInScope().should.equal true
      @opampElm.getInternalNodeCount().should.equal 0
      @opampElm.orphaned().should.equal true

    it "has correct initial state", ->
      expect(@opampElm.noDiagonal).to.eql(false)
      expect(@opampElm.component_id).to.be
      expect(@opampElm.voltSource).to.equal(0)
      expect(@opampElm.current).to.equal(0)
      expect(@opampElm.getCurrent()).to.equal(0)
      expect(@opampElm.getVoltageDiff()).to.equal(0)

    it "has params", ->
      expect(@opampElm.params).to.eql({
        momentary: false,
        position: 0
      })

  describe "With params object", ->
    before ->
      @opampElm = new SwitchElm(50, 75, 50, 150, {"momentary": true, "position": 1})

    it "has params", ->
      expect(@opampElm.params).to.eql({
        "position": 1,
        "momentary": true
      })

  describe "With params array", ->
    before ->
      @opampElm = new SwitchElm(50, 75, 50, 150, [0, false])

      @Circuit = new Circuit("Basic Switch")

      @opampElm.setPoints()
      @Circuit.solder(@opampElm)

    it "has params", ->
      expect(@opampElm.position).to.eql(0)
      expect(@opampElm.momentary).to.eql(false)
      expect(@opampElm.params).to.eql({
        "position": 0
        "momentary": false
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

      expect(@opampElm.getBoundingBox()).to.eql({x: 49, y: 75, width: 5, height: 75})

    it "snaps to grid when moved", ->
      @opampElm.moveTo(100, 162.5)
      expect(@opampElm.getCenter()).to.eql({x: 98, y: 160.5})

      expect(@opampElm.x1()).to.equal(98)
      expect(@opampElm.y1()).to.equal(123)
      expect(@opampElm.x2()).to.equal(98)
      expect(@opampElm.y2()).to.equal(198)

    it "can be stringified", ->
      expect(@opampElm.toString()).to.eql("""SwitchElm@[98 123 98 198]: {"position":0,"momentary":false}""")
      expect(@opampElm.getName()).to.eql("Basic Switch")

    it "can stamp", ->
      @opampElm.stamp(@Circuit.Solver.Stamper)

    describe "Rendering", ->
      before ->
        @Circuit.clearAndReset()
        @Circuit.solder(@opampElm)

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



