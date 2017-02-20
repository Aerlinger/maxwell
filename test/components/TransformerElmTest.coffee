describe "Transformer", ->
  describe "vertical orientation", ->
    before ->
      @transformerElm = new TransformerElm(100, 100, 100, 200)

    it "initializes a valid position", ->
      console.log(@transformerElm.ptEnds)
      console.log(@transformerElm.ptCoil)
      console.log(@transformerElm.ptCore)

      expect(Math.max(@transformerElm.ptEnds)).to.be 
      expect(Math.max(@transformerElm.ptCoil)).to.be 
      expect(Math.max(@transformerElm.ptCore)).to.be 

    describe "Rendering", ->
      before ->
        @Circuit = new Circuit("Basic Transformer")
        @Circuit.clearAndReset()
        @Circuit.solder(@transformerElm)

        @canvas = new Canvas(200, 300)

        @renderer = new CircuitApplication(@Circuit, @canvas)
        @renderer.context = @canvas.getContext('2d')
        @renderer.drawComponents()

        @componentImageFileName = "test/fixtures/componentRenders/#{@transformerElm.getName()}_vert.png"

      it "renders initial circuit", ->
        fs.writeFileSync(@componentImageFileName, @canvas.toBuffer())

  describe "basic initialization", ->
    before ->
      @transformerElm = new TransformerElm()

    it "initializes a valid position", ->
      expect(Math.max(@transformerElm.ptEnds)).to.be
      expect(Math.max(@transformerElm.ptCoil)).to.be
      expect(Math.max(@transformerElm.ptCore)).to.be 

    describe "Rendering", ->
      before ->
        @Circuit = new Circuit("Basic Transformer")
        @Circuit.clearAndReset()
        @Circuit.solder(@transformerElm)

        @canvas = new Canvas(200, 300)

        @renderer = new CircuitApplication(@Circuit, @canvas)
        @renderer.context = @canvas.getContext('2d')
        @renderer.drawComponents()

        @componentImageFileName = "test/fixtures/componentRenders/#{@transformerElm.getName()}_init.png"

      it "renders initial circuit", ->
        fs.writeFileSync(@componentImageFileName, @canvas.toBuffer())

      it "compares buffer", (done) ->

        resemble(@canvas.toBuffer()).compareTo(@componentImageFileName).ignoreAntialiasing().onComplete (data) =>
          data.getDiffImage().pack().pipe(fs.createWriteStream(@componentImageFileName + "_diff.png"));

          expect(data.misMatchPercentage).to.be.at.most(0.01)

          done()

  describe "basic initialization", ->
    before ->
      @transformerElm = new TransformerElm(25, 100, 100, 100, {
        "inductance": 100,
        "ratio": 1,
        "current0": -0.003935272598777283,
        "current1": 0.004618353276268098,
        "couplingCoef": 0.999
      })

    describe "Rendering", ->
      before ->
        @Circuit = new Circuit("Basic Transformer")
        @Circuit.clearAndReset()
        @Circuit.solder(@transformerElm)

        @canvas = new Canvas(400, 300)

        @renderer = new CircuitApplication(@Circuit, @canvas)
        @renderer.context = @canvas.getContext('2d')
        @renderer.drawComponents()

        @componentImageFileName = "test/fixtures/componentRenders/#{@transformerElm.getName()}_params.png"

      it "renders initial circuit", ->
        fs.writeFileSync(@componentImageFileName, @canvas.toBuffer())

      it "compares buffer", (done) ->

        resemble(@canvas.toBuffer()).compareTo(@componentImageFileName).ignoreAntialiasing().onComplete (data) =>
          data.getDiffImage().pack().pipe(fs.createWriteStream(@componentImageFileName + "_diff.png"));

          expect(data.misMatchPercentage).to.be.at.most(0.01)

          done()



