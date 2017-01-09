describe "Switch element", ->
  describe "default initialization", ->
    before ->
      @switchElm = new SwitchElm()

    it "doesn't set any positions", ->
      expect(@switchElm.x2()).to.equal(undefined)
      expect(@switchElm.y2()).to.equal(undefined)
      expect(@switchElm.x1()).to.equal(undefined)
      expect(@switchElm.y1()).to.equal(undefined)

    it "sets default parameters", ->
      expect(@switchElm.position).to.equal(0)
      expect(@switchElm.momentary).to.equal(false)

    it "has correct initial rendering conditions", ->
      expect(@switchElm.curcount).to.equal(undefined)
      expect(@switchElm.point1).to.eql({ x: undefined, y: undefined })
      expect(@switchElm.point2).to.eql({ x: undefined, y: undefined })

    it "has correct node relationships", ->
      expect(@switchElm.nodes).to.eql([0, 0])
      expect(@switchElm.volts).to.eql([0, 0])

    it "has default method return values", ->
      @switchElm.getPostCount().should.equal 2
      @switchElm.isWire().should.equal true
      @switchElm.hasGroundConnection().should.equal false
      @switchElm.needsShortcut().should.equal false
      @switchElm.canViewInScope().should.equal true
      @switchElm.getInternalNodeCount().should.equal 0
      @switchElm.orphaned().should.equal true

    it "has correct initial state", ->
      expect(@switchElm.noDiagonal).to.eql(false)
      expect(@switchElm.component_id).to.be
      expect(@switchElm.voltSource).to.equal(0)
      expect(@switchElm.current).to.equal(0)
      expect(@switchElm.getCurrent()).to.equal(0)
      expect(@switchElm.getVoltageDiff()).to.equal(0)

    it "has params", ->
      expect(@switchElm.params).to.eql({
        momentary: false,
        position: 0
      })

  describe "With params object", ->
    before ->
      @switchElm = new SwitchElm(50, 75, 50, 150, {"momentary": true, "position": 1})

    it "has params", ->
      expect(@switchElm.params).to.eql({
        "position": 1,
        "momentary": true
      })

  describe "With params array", ->
    before ->
      @switchElm = new SwitchElm(50, 75, 50, 150, [0, false])

      @Circuit = new Circuit("Basic Switch")

      @switchElm.setPoints()
      @Circuit.solder(@switchElm)

    it "has params", ->
      expect(@switchElm.position).to.eql(0)
      expect(@switchElm.momentary).to.eql(false)
      expect(@switchElm.params).to.eql({
        "position": 0
        "momentary": false
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
      expect(@switchElm.toString()).to.eql("""SwitchElm@[98 123 98 198] : {"position":0,"momentary":false}""")
      expect(@switchElm.getName()).to.eql("Basic Switch")

    it "can stamp", ->
      @switchElm.stamp(@Circuit.Solver.Stamper)

    describe "Rendering", ->
      before ->
        @Circuit.clearAndReset()
        @Circuit.solder(@switchElm)

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



