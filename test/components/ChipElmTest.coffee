describe "CC2 Component", ->
  before ->
    @pins = [
      {
        "bubble": false
        "bubbleX": 0
        "bubbleY": 0
        "clock": false
        "curcount": 0
        "current": 0
        "lineOver": false
        "output": true
        "pos": 0
        "post": {"x": 50, "y": 75}
        "side": 2
        "state": false
        "stub": { "x": 66, "y": 75 }
        "text": "X"
        "textloc": {"x": 82, "y": 75}
        "value": false
        "voltSource": 0
      }
      {
        "bubble": false
        "bubbleX": 0
        "bubbleY": 0
        "clock": false
        "curcount": 0
        "current": 0
        "lineOver": false
        "output": false
        "pos": 2
        "post": {
          "x": 50
          "y": 139
        }
        "side": 2
        "state": false
        "stub": {
          "x": 66
          "y": 139
        }
        "text": "Y"
        "textloc": {
          "x": 82
          "y": 139
        }
        "value": false
        "voltSource": 0
      }
      {
        "bubble": false
        "bubbleX": 0
        "bubbleY": 0
        "clock": false
        "curcount": 0
        "current": 0
        "lineOver": false
        "output": false
        "pos": 1
        "post": {
          "x": 146
          "y": 107
        }
        "side": 3
        "state": false
        "stub": {
          "x": 130
          "y": 107
        }
        "text": "Z"
        "textloc": {
          "x": 114
          "y": 107
        }
        "value": false
        "voltSource": 0
      }
    ]


  describe.skip "default initialization", ->
    before ->
      @cc2Elm = new CC2Elm()

    it "doesn't set any positions", ->
      expect(@cc2Elm.x2()).to.equal(undefined)
      expect(@cc2Elm.y2()).to.equal(undefined)
      expect(@cc2Elm.x1()).to.equal(undefined)
      expect(@cc2Elm.y1()).to.equal(undefined)

    it "has correct params", ->
      expect(@cc2Elm.bits).to.equal(-1)
      expect(@cc2Elm.volts).to.equal(-1)

    it "has correct pins", ->
      expect(@cc2Elm.pins).to.equal(@pins)

    it "has correct initial rendering conditions", ->
      expect(@cc2Elm.curcount).to.equal(undefined)
      expect(@cc2Elm.point1).to.eql({x: undefined, y: undefined})
      expect(@cc2Elm.point2).to.eql({x: undefined, y: undefined})
      expect(@cc2Elm.lead1).to.equal(undefined)
      expect(@cc2Elm.lead2).to.equal(undefined)

    it "has correct node relationships", ->
      expect(@cc2Elm.nodes).to.eql([0, 0, 0])
      expect(@cc2Elm.volts).to.eql([0, -0, -0])

    it "has default method return values", ->
      @cc2Elm.getPostCount().should.equal 3
      @cc2Elm.isWire().should.equal false
      @cc2Elm.hasGroundConnection().should.equal false
      @cc2Elm.needsShortcut().should.equal false
      @cc2Elm.canViewInScope().should.equal true
      @cc2Elm.getInternalNodeCount().should.equal 0
      @cc2Elm.orphaned().should.equal true

    it "has correct initial state", ->
      expect(@cc2Elm.cspc).to.eql([-1])
      expect(@cc2Elm.cspc2).to.eql([-1])
      expect(@cc2Elm.flags).to.eql([-1])
      expect(@cc2Elm.csize).to.eql(true)
      expect(@cc2Elm.noDiagonal).to.eql(true)
      expect(@cc2Elm.component_id).to.be
      expect(@cc2Elm.voltSource).to.equal(0)
      expect(@cc2Elm.current).to.equal(0)
      expect(@cc2Elm.getCurrent()).to.equal(0)
      expect(@cc2Elm.getVoltageDiff()).to.equal(0)

    it "has params", ->
      expect(@cc2Elm.params).to.eql({
      })

  describe "With params object", ->
    before ->
      @cc2Elm = new CC2Elm(50, 75, 50, 150, {"gain": 1})

    it "has params", ->
#      expect(@chipElm.bits).to.eql(3)
      expect(@cc2Elm.params).to.eql({
        "gain": 1
      })

    it "has correct pins", ->
      expect(@cc2Elm.pins).to.eql(@pins)

    it "has correct initial state", ->
      expect(@cc2Elm.cspc).to.eql(16)
      expect(@cc2Elm.cspc2).to.eql(32)
      expect(@cc2Elm.flags).to.eql(0)
      expect(@cc2Elm.csize).to.eql(2)
      expect(@cc2Elm.noDiagonal).to.eql(true)
      expect(@cc2Elm.component_id).to.be
      expect(@cc2Elm.voltSource).to.equal(0)
      expect(@cc2Elm.current).to.equal(0)
      expect(@cc2Elm.getCurrent()).to.equal(0)
      expect(@cc2Elm.getVoltageDiff()).to.equal(-1)


  describe "With params array", ->
    before ->
      @cc2Elm = new CC2Elm(50, 75, 50, 150, {"gain": "1"})

      @Circuit = new Circuit("CC2 Elm")

      @cc2Elm.setPoints()
      @Circuit.solder(@cc2Elm)

    it "has params", ->
      expect(@cc2Elm.volts).to.eql([])
      expect(@cc2Elm.params).to.eql({
        "gain": "1"
      })

    it "has bits", ->
      expect(@cc2Elm.bits).to.eql(undefined)

    it "has correct pins", ->
      expect(@cc2Elm.pins).to.eql(@pins)

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

      expect(@cc2Elm.getBoundingBox()).to.eql({x: 49, y: 75, width: 5, height: 75})

    it "snaps to grid when moved", ->
      @cc2Elm.moveTo(100, 162.5)
      expect(@cc2Elm.getCenter()).to.eql({x: 98, y: 160.5})

      expect(@cc2Elm.x1()).to.equal(98)
      expect(@cc2Elm.y1()).to.equal(123)
      expect(@cc2Elm.x2()).to.equal(98)
      expect(@cc2Elm.y2()).to.equal(198)

    it "can be stringified", ->
      expect(@cc2Elm.toString()).to.eql("""CC2Elm@[98 123 98 198]: {"gain":"1"}""")
      expect(@cc2Elm.getName()).to.eql("CC2 Chip")

    it "can stamp", ->
      @cc2Elm.stamp(@Circuit.Solver.Stamper)

    describe "Rendering", ->
      before ->
        @Circuit.clearAndReset()
        @Circuit.solder(@cc2Elm)

        Canvas = require('canvas')
        @canvas = new Canvas(200, 300)

        @renderer = new Renderer(@Circuit, @canvas)
        @renderer.context = @canvas.getContext('2d')

        @Circuit.updateCircuit()
        @renderer.drawComponents()

        @componentImageFileName = "test/fixtures/componentRenders/#{@cc2Elm.getName()}_init.png"

        fs.writeFileSync(@componentImageFileName, @canvas.toBuffer())

      it "compares buffer", (done) ->
        resemble(@canvas.toBuffer()).compareTo(@componentImageFileName).ignoreAntialiasing().onComplete (data) =>
          data.getDiffImage().pack().pipe(fs.createWriteStream(@componentImageFileName + "_diff.png"));

          expect(data.misMatchPercentage).to.be.at.most(0.01)

          done()



