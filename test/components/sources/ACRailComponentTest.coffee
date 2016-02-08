ACRailElm = require('../../src/circuit/components/ACRailElm.coffee')

describe "ACRailElmTest", ->
  before ->
    @acRailElm = new ACRailElm(100, 200)

  it "has correct position", ->
    expect(@acRailElm.x1).to.equal(100)
    expect(@acRailElm.y1).to.equal(200)
    expect(@acRailElm.x2).to.equal(100)
    expect(@acRailElm.y2).to.equal(200)
    expect(@acRailElm.waveform).to.equal(ACRailElm.WF_AC)

  describe "Rendering", ->
    before (done) ->
      Canvas = require('canvas')
      @canvas = new Canvas(100, 200)
      ctx = @canvas.getContext('2d')

      @Circuit = new Circuit("ACRailElm")

      @Circuit.clearAndReset()
      @Circuit.solder(@acRailElm)

      @renderer = new Renderer(@Circuit, @canvas)
      @renderer.context = ctx
      done()

    it "renders initial circuit", ->
      @renderer.drawComponents()

      fs.writeFileSync("test/fixtures/componentRenders/#{@Circuit.name}_init.png", @canvas.toBuffer())
