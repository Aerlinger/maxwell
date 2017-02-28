pins = [
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

describe "Chip Component", ->
  before ->
    @cc2Elm = new CC2Elm(50, 75, 50, 150, {"gain": "1"})

    @Circuit = new Circuit("CC2 Elm")

    @cc2Elm.setPoints()
    @Circuit.solder(@cc2Elm)

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

  it "has params", ->
    expect(@cc2Elm.volts).to.eql([0, 0, 0])
    expect(@cc2Elm.params).to.eql({
      "gain": "1"
    })

  it "has bits", ->
    expect(@cc2Elm.bits).to.eql(undefined)

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
    expect(@cc2Elm.getCenter()).to.eql({x: 98, y: 107})

    expect(@cc2Elm.getBoundingBox()).to.eql({x: 66, y: 59, width: 64, height: 96})

  it "snaps to grid when moved", ->
    @cc2Elm.moveTo(100, 162.5)
    expect(@cc2Elm.getCenter()).to.eql({x: 98, y: 107})

    expect(@cc2Elm.x1()).to.equal(50)
    expect(@cc2Elm.y1()).to.equal(131)
    expect(@cc2Elm.x2()).to.equal(50)
    expect(@cc2Elm.y2()).to.equal(206)

  it "can stamp", ->
    @cc2Elm.stamp(@Circuit.Solver.Stamper)

  describe "Rendering", ->
    before ->
      @Circuit.clearAndReset()
      @Circuit.solder(@cc2Elm)

      @canvas = new Canvas(200, 300)

      @renderer = new CircuitApplication(@Circuit, @canvas)
      @renderer.context = @canvas.getContext('2d')

      @Circuit.updateCircuit()
      @renderer.draw()

      @componentImageFileName = "test/fixtures/componentRenders/#{@cc2Elm.getName()}_init.png"

      fs.writeFileSync(@componentImageFileName, @canvas.toBuffer())

    it "compares buffer", (done) ->
      resemble(@canvas.toBuffer()).compareTo(@componentImageFileName).ignoreAntialiasing().onComplete (data) =>
        data.getDiffImage().pack().pipe(fs.createWriteStream(@componentImageFileName + "_diff.png"));

        expect(data.misMatchPercentage).to.be.at.most(0.01)

        done()
