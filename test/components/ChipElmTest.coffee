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
      @transistorElm = new CC2Elm()

    it "doesn't set any positions", ->
      expect(@transistorElm.x2()).to.equal(undefined)
      expect(@transistorElm.y2()).to.equal(undefined)
      expect(@transistorElm.x1()).to.equal(undefined)
      expect(@transistorElm.y1()).to.equal(undefined)

    it "has correct params", ->
      expect(@transistorElm.bits).to.equal(-1)
      expect(@transistorElm.volts).to.equal(-1)

    it "has correct pins", ->
      expect(@transistorElm.pins).to.equal(@pins)

    it "has correct initial rendering conditions", ->
      expect(@transistorElm.curcount).to.equal(undefined)
      expect(@transistorElm.point1).to.eql({x: undefined, y: undefined})
      expect(@transistorElm.point2).to.eql({x: undefined, y: undefined})
      expect(@transistorElm.lead1).to.equal(undefined)
      expect(@transistorElm.lead2).to.equal(undefined)

    it "has correct node relationships", ->
      expect(@transistorElm.nodes).to.eql([0, 0, 0])
      expect(@transistorElm.volts).to.eql([0, -0, -0])

    it "has default method return values", ->
      @transistorElm.getPostCount().should.equal 3
      @transistorElm.isWire().should.equal false
      @transistorElm.hasGroundConnection().should.equal false
      @transistorElm.needsShortcut().should.equal false
      @transistorElm.canViewInScope().should.equal true
      @transistorElm.getInternalNodeCount().should.equal 0
      @transistorElm.orphaned().should.equal true

    it "has correct initial state", ->
      expect(@transistorElm.cspc).to.eql([-1])
      expect(@transistorElm.cspc2).to.eql([-1])
      expect(@transistorElm.flags).to.eql([-1])
      expect(@transistorElm.csize).to.eql(true)
      expect(@transistorElm.noDiagonal).to.eql(true)
      expect(@transistorElm.component_id).to.be
      expect(@transistorElm.voltSource).to.equal(0)
      expect(@transistorElm.current).to.equal(0)
      expect(@transistorElm.getCurrent()).to.equal(0)
      expect(@transistorElm.getVoltageDiff()).to.equal(0)

    it "has params", ->
      expect(@transistorElm.params).to.eql({
      })

  describe "With params object", ->
    before ->
      @transistorElm = new CC2Elm(50, 75, 50, 150, {"gain": 1})

    it "has params", ->
#      expect(@chipElm.bits).to.eql(3)
      expect(@transistorElm.params).to.eql({
        "gain": 1
      })

    it "has correct pins", ->
      expect(@transistorElm.pins).to.eql(@pins)

    it "has correct initial state", ->
      expect(@transistorElm.cspc).to.eql(16)
      expect(@transistorElm.cspc2).to.eql(32)
      expect(@transistorElm.flags).to.eql(0)
      expect(@transistorElm.csize).to.eql(2)
      expect(@transistorElm.noDiagonal).to.eql(true)
      expect(@transistorElm.component_id).to.be
      expect(@transistorElm.voltSource).to.equal(0)
      expect(@transistorElm.current).to.equal(0)
      expect(@transistorElm.getCurrent()).to.equal(0)
#      expect(@cc2Elm.getVoltageDiff()).to.equal(-1)


  describe "With params array", ->
    before ->
      @transistorElm = new CC2Elm(50, 75, 50, 150, {"gain": "1"})

      @Circuit = new Circuit("CC2 Elm")

      @transistorElm.setPoints()
      @Circuit.solder(@transistorElm)

    it "has params", ->
      expect(@transistorElm.volts).to.eql([0, 0, 0])
      expect(@transistorElm.params).to.eql({
        "gain": "1"
      })

    it "has bits", ->
      expect(@transistorElm.bits).to.eql(undefined)

    it "has correct pins", ->
      expect(@transistorElm.pins).to.eql(@pins)

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
      expect(@transistorElm.toString()).to.eql("""CC2Elm@[98 123 98 198]: {"gain":"1"}""")
      expect(@transistorElm.getName()).to.eql("CC2 Chip")

    it "can stamp", ->
      @transistorElm.stamp(@Circuit.Solver.Stamper)

    describe "Rendering", ->
      before ->
        @Circuit.clearAndReset()
        @Circuit.solder(@transistorElm)

        @canvas = new Canvas(200, 300)

        @renderer = new CircuitUI(@Circuit, @canvas)
        @renderer.context = @canvas.getContext('2d')

        @Circuit.updateCircuit()
        @renderer.drawComponents()

        @componentImageFileName = "test/fixtures/componentRenders/#{@transistorElm.getName()}_init.png"

        fs.writeFileSync(@componentImageFileName, @canvas.toBuffer())

      it "compares buffer", (done) ->
        resemble(@canvas.toBuffer()).compareTo(@componentImageFileName).ignoreAntialiasing().onComplete (data) =>
          data.getDiffImage().pack().pipe(fs.createWriteStream(@componentImageFileName + "_diff.png"));

          expect(data.misMatchPercentage).to.be.at.most(0.01)

          done()



