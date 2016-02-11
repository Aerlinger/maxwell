fs = require('fs')
Canvas = require('canvas')

describe "Resistor Component", ->
  beforeEach ->
    @Circuit = new Circuit("SingleResistor")
    @resistor = new ResistorElm(50, 150, 50, 50, {resistance: 50})

  describe "Initialization", ->
    it "can be initialized through a hash object matching the parameter definitions", ->
      resistorElm = new ResistorElm(0, 0, 0, 0, {resistance: "3"})
      expect(resistorElm.resistance).to.equal(3)

    it "throws an exception for a parameter that isn't defined on this object", ->
      bad_resistor_definition = ->
        new ResistorElm(0, 0, 0, 0, {cubits: "3"})

      expect(bad_resistor_definition).to.throw(Error)

    it "sets default resistance if none provided", ->
      resistorElm = new ResistorElm(0, 0, 0, 0)
      expect(resistorElm.resistance).to.equal(1000)

    it "has correct full-scale range", ->
      expect(@Circuit.voltageRange()).to.eql(10)

    it "has correct resistance", ->
      @resistor.resistance.should.equal 50

    it "is not have any internal voltage sources", ->
      @resistor.getVoltageSourceCount().should.equal 0

    it "calculates current when voltage is applied", ->
      @resistor.getPostCount().should.equal 2
      @resistor.getInternalNodeCount().should.equal 0

    it "has correct dump type", ->
      expect(@resistor.getDumpType()).to.equal "r"

    it "is orphaned", ->
      expect(@resistor.orphaned()).to.equal true

    it "has correct properties", ->
      console.log("PARAMS", @resistor.getFieldWithValue("resistance"))
      expect(@resistor.getFieldWithValue("resistance")).to.eql({
        "default_value": 1000
        "name": "Resistance"
        "range": [
          0
          Infinity
        ]
        "symbol": "Ω"
        "type": "physical"
        "unit": "Ohms"
        "value": 50
      })

    it "has correct initial position", ->
      expect(@resistor.point1.x).to.eq 50
      expect(@resistor.point1.y).to.eq 150
      expect(@resistor.point2.x).to.eq 50
      expect(@resistor.point2.y).to.eq 50
      @resistor.dx.should.eq 0
      @resistor.dy.should.eq -100
      @resistor.dn.should.eq 100

    it "has correct initial values", ->
      @resistor.current.should.eq 0
      @resistor.noDiagonal = false
      @resistor.dragging = false
      @resistor.parentCircuit = null

    it "has correct sign (orientation)", ->
      @resistor.dsign.should.eq -1

    it "has correct bounding box", ->
      @resistor.boundingBox.x.should.equal 50
      @resistor.boundingBox.y.should.equal 50
      @resistor.boundingBox.width.should.equal 3
      @resistor.boundingBox.height.should.equal 100

    it "Has 0 voltage at its terminals", ->
      @resistor.getPostVoltage(0).should.equal 0
      @resistor.getPostVoltage(1).should.equal 0
      @resistor.getVoltageDiff().should.equal 0

    it "Has 0 current at its terminals", ->
      @resistor.getCurrent().should.equal 0

    it "Has 0 power", ->
      @resistor.getPower().should.equal 0

    it "Has the correct number of posts", ->
      @resistor.getPostCount().should.equal 2

    it "Has no internal nodes", ->
      @resistor.getInternalNodeCount().should.equal 0


    describe "after soldering to circuit", ->
      beforeEach ->
        @Circuit.solder(@resistor)

      it "is not be orphaned", ->
        @resistor.orphaned().should.equal false

      it "belongs to @Circuit", ->
        @Circuit.getElmByIdx(0) == @resistor

      it "belongs to @Circuit", ->
        @Circuit.numElements() == 1

      it "has two unconnected nodes", ->
        @Circuit.updateCircuit()
        @Circuit.findBadNodes().should == []
        @Circuit.numNodes().should == 2

      describe "then destroying the resistor", ->
        beforeEach ->
          @resistor.destroy()

        it "is orphaned", ->
          @resistor.orphaned().should.equal true

        it "no longer belongs to @Circuit", ->
          @Circuit.getElmByIdx(0) == null

        it "belongs to @Circuit", ->
          @Circuit.numElements().should.equal 0

      describe "then desoldering the resistor", ->
        beforeEach ->
          @Circuit.desolder(@resistor)

        it "is orphaned", ->
          @resistor.orphaned().should.equal true

        it "no longer belongs to @Circuit", ->
          @Circuit.getElmByIdx(0) == null

        it "belongs to @Circuit", ->
          @Circuit.numElements().should.equal 0

  describe "Rendering", ->
    before (done) ->
      Canvas = require('canvas')
      @canvas = new Canvas(100, 200)
      @ctx = @canvas.getContext('2d')

      @renderer = new Renderer(@Circuit, @canvas)
      @renderer.context = @ctx

      #      @ctx.clearRect(0, 0, 100, 200)

      @Circuit.clearAndReset()
      @Circuit.solder(@resistor)

      done()

    it "renders initial circuit", ->
      @renderer.drawComponents()

      fs.writeFileSync("test/fixtures/componentRenders/#{@Circuit.name}_initial.png", @canvas.toBuffer())

    it "renders voltage", ->
      @resistor.volts[1] = 5
      @resistor.volts[0] = 0

      @renderer.drawComponents()

      fs.writeFileSync("test/fixtures/componentRenders/#{@Circuit.name}_voltage.png", @canvas.toBuffer())

    it "renders 45 degree angle", ->
      @resistor.x1 = 0
      @resistor.y1 = 0

      @renderer.drawComponents()

      fs.writeFileSync("test/fixtures/componentRenders/#{@Circuit.name}_angle.png", @canvas.toBuffer())
