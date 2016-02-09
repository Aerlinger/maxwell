fs = require('fs')
Canvas = require('canvas')

describe "MosfetElm", ->
  describe "Loading list of parameters", ->
    before ->
      @mosfetElm = new MosfetElm(100, 200, 100, 300, ["1.5"])

    it "has correct position", ->
      expect(@mosfetElm.x1).to.equal(100)
      expect(@mosfetElm.y1).to.equal(200)
      expect(@mosfetElm.x2).to.equal(100)
      expect(@mosfetElm.y2).to.equal(300)

    it "is p-type", ->
      expect(@mosfetElm.pnp).to.equal(1)

    it "has correct vt", ->
      expect(@mosfetElm.vt).to.equal(1.5)


  describe "Loading list of parameters", ->
    before ->
      @mosfetElm = new MosfetElm(50, 50, 50, 150, ["1.5"], "1")

    it "has correct position", ->
      expect(@mosfetElm.x1).to.equal(50)
      expect(@mosfetElm.y1).to.equal(50)
      expect(@mosfetElm.x2).to.equal(50)
      expect(@mosfetElm.y2).to.equal(150)

    it "is n-type", ->
      expect(@mosfetElm.pnp).to.equal(-1)

    it "has correct v5", ->
      expect(@mosfetElm.vt).to.equal(1.5)

    describe "Rendering", ->
      before (done) ->
        Canvas = require('canvas')
        @canvas = new Canvas(100, 200)
        ctx = @canvas.getContext('2d')

        @Circuit = new Circuit("Mosfet")

        @Circuit.clearAndReset()
        @Circuit.solder(@mosfetElm)

        @renderer = new Renderer(@Circuit, @canvas)
        @renderer.context = ctx
        done()

      it "renders initial circuit", ->
        @renderer.drawComponents()

        fs.writeFileSync("test/fixtures/componentRenders/#{@Circuit.name}_init.png", @canvas.toBuffer())

