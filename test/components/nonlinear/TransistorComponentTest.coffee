fs = require('fs')
Canvas = require('canvas')

describe "TransistorElm", ->
  describe "with no parameters", ->
    before (done) ->
      @transistorElm = new TransistorElm()
      done()

    it "doesn't set any positions", ->
      expect(@transistorElm.x1).to.equal(undefined)
      expect(@transistorElm.y1).to.equal(undefined)
      expect(@transistorElm.x2).to.equal(undefined)
      expect(@transistorElm.y2).to.equal(undefined)

    it "sets default parameters", ->
      expect(@transistorElm.pnp).to.equal(-1)
      expect(@transistorElm.lastvbe).to.equal(0)
      expect(@transistorElm.lastvbc).to.equal(0)
      expect(@transistorElm.beta).to.equal(100)

    it "has correct initial conditions", ->
      @transistorElm.current = 0
      @transistorElm.curcount = undefined
      @transistorElm.point1 = undefined
      @transistorElm.point2 = undefined
      @transistorElm.lead1 = undefined
      @transistorElm.lead2 = undefined

  describe "With params", ->
    before (done) ->
      @transistorElm = new TransistorElm(50, 50, 50, 150, ["1", "-4.295", "0.705", "100.0"])

      @Circuit = new Circuit("Basic BJT")

      @transistorElm.setPoints()
      @transistorElm.setup()
      @Circuit.solder(@transistorElm)
      done()

    describe "parameter assignments", ->
      it "is pnp", ->
        expect(@transistorElm.pnp).to.equal(1)

      it "has correct vbe", ->
        expect(@transistorElm.lastvbe).to.equal(-4.295)

      it "has correct vbc", ->
        expect(@transistorElm.lastvbc).to.equal(0.705)

      it "has correct beta", ->
        expect(@transistorElm.beta).to.equal(100.0)

    it "can stamp", ->
      @transistorElm.stamp(@Circuit.Solver.Stamper)

    describe "Loading list of parameters", ->
      before ->
        @transistorElm = new TransistorElm(100, 200, 100, 300, ["-1", "-4.295", "0.705", "100.0"])

      it "is pnp", ->
        expect(@transistorElm.pnp).to.equal(-1)


    describe "Rendering", ->
      before (done) ->
        Canvas = require('canvas')
        @canvas = new Canvas(100, 200)
        ctx = @canvas.getContext('2d')

        @Circuit.clearAndReset()
        @Circuit.solder(@transistorElm)

        @renderer = new Renderer(@Circuit, @canvas)
        @renderer.context = ctx
        done()

      it "renders initial circuit", ->
        @renderer.drawComponents()

        fs.writeFileSync("test/fixtures/componentRenders/#{@Circuit.name}_init.png", @canvas.toBuffer())
