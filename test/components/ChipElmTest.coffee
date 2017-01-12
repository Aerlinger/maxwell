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
      @chipElm = new CC2Elm()

    it "doesn't set any positions", ->
      expect(@chipElm.x2()).to.equal(undefined)
      expect(@chipElm.y2()).to.equal(undefined)
      expect(@chipElm.x1()).to.equal(undefined)
      expect(@chipElm.y1()).to.equal(undefined)

    it "has correct params", ->
      expect(@chipElm.bits).to.equal(-1)
      expect(@chipElm.volts).to.equal(-1)

    it "has correct pins", ->
      expect(@chipElm.pins).to.equal(@pins)

    it "has correct initial rendering conditions", ->
      expect(@chipElm.curcount).to.equal(undefined)
      expect(@chipElm.point1).to.eql({x: undefined, y: undefined})
      expect(@chipElm.point2).to.eql({x: undefined, y: undefined})
      expect(@chipElm.lead1).to.equal(undefined)
      expect(@chipElm.lead2).to.equal(undefined)

    it "has correct node relationships", ->
      expect(@chipElm.nodes).to.eql([0, 0, 0])
      expect(@chipElm.volts).to.eql([0, -0, -0])

    it "has default method return values", ->
      @chipElm.getPostCount().should.equal 3
      @chipElm.isWire().should.equal false
      @chipElm.hasGroundConnection().should.equal false
      @chipElm.needsShortcut().should.equal false
      @chipElm.canViewInScope().should.equal true
      @chipElm.getInternalNodeCount().should.equal 0
      @chipElm.orphaned().should.equal true

    it "has correct initial state", ->
      expect(@chipElm.cspc).to.eql([-1])
      expect(@chipElm.cspc2).to.eql([-1])
      expect(@chipElm.flags).to.eql([-1])
      expect(@chipElm.csize).to.eql(true)
      expect(@chipElm.noDiagonal).to.eql(true)
      expect(@chipElm.component_id).to.be
      expect(@chipElm.voltSource).to.equal(0)
      expect(@chipElm.current).to.equal(0)
      expect(@chipElm.getCurrent()).to.equal(0)
      expect(@chipElm.getVoltageDiff()).to.equal(0)

    it "has params", ->
      expect(@chipElm.params).to.eql({
      })

  describe "With params object", ->
    before ->
      @chipElm = new CC2Elm(50, 75, 50, 150, {"gain": 1})

    it "has params", ->
      expect(@chipElm.bits).to.eql(3)
      expect(@chipElm.params).to.eql({
        "bits": 3
        "gain": 1
        "volts": ["0", "1", "1"]
      })

    it "has correct pins", ->
      expect(@chipElm.pins).to.eql(@pins)

    it "has correct initial state", ->
      expect(@chipElm.cspc).to.eql(16)
      expect(@chipElm.cspc2).to.eql(32)
      expect(@chipElm.flags).to.eql(0)
      expect(@chipElm.csize).to.eql(2)
      expect(@chipElm.noDiagonal).to.eql(true)
      expect(@chipElm.component_id).to.be
      expect(@chipElm.voltSource).to.equal(0)
      expect(@chipElm.current).to.equal(0)
      expect(@chipElm.getCurrent()).to.equal(0)
      expect(@chipElm.getVoltageDiff()).to.equal(-1)


  describe "With params array", ->
    before ->
      @chipElm = new CC2Elm(50, 75, 50, 150, ["1"])

      @Circuit = new Circuit("CC2 Elm")

      @chipElm.setPoints()
      @Circuit.solder(@chipElm)

    it "has params", ->
      expect(@chipElm.volts).to.eql([0, 0, 0])
      expect(@chipElm.params).to.eql({
        "gain": 1
        "volts": [0, 0, 0]
      })

    it "has bits", ->
      expect(@chipElm.bits).to.eql(undefined)

    it "has correct pins", ->
      expect(@chipElm.pins).to.eql(@pins)

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
      expect(@chipElm.toString()).to.eql("""CC2Elm@[98 123 98 198]: {"volts":[0,0,0],"gain":1}""")
      expect(@chipElm.getName()).to.eql("CC2 Chip")

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

        @Circuit.updateCircuit()
        @renderer.drawComponents()

        @componentImageFileName = "test/fixtures/componentRenders/#{@chipElm.getName()}_init.png"

        fs.writeFileSync(@componentImageFileName, @canvas.toBuffer())

      it "compares buffer", (done) ->
        resemble(@canvas.toBuffer()).compareTo(@componentImageFileName).ignoreAntialiasing().onComplete (data) =>
          console.log(data)

          data.getDiffImage().pack().pipe(fs.createWriteStream(@componentImageFileName + "_diff.png"));

          expect(data.misMatchPercentage).to.be.at.most(0.01)

          done()



