fs = require('fs')
Wire = require('../../src/circuit/components/WireElm.coffee')
GroundElm = require('../../src/circuit/components/GroundElm.coffee')
ResistorElm = require('../../src/circuit/components/ResistorElm.coffee')
VoltageElm = require('../../src/circuit/components/VoltageElm.coffee')
#Renderer = require('../../src/render/renderer.coffee')
Maxwell = require('../../src/Maxwell.coffee')

describe "Should render", ->
  before ->
    @Renderer = new Renderer()

  beforeEach (done) ->
    @Renderer.clear()
    done()

  specify "A Resistor", (done) ->
    @Resistor = new Resistor(50, 50, 50, 150, [500])
    @Renderer.drawComponent(@Resistor)

    @Renderer.getCanvas().toBuffer (err, buf) ->
      throw err if err
      fs.writeFile(__dirname + '/componentImages/resistor.png', buf)
      done()

  specify "A Wire", (done) ->
    @Wire = new Wire(50, 50, 50, 150)
    @Renderer.drawComponent(@Wire)

    @Renderer.getCanvas().toBuffer (err, buf) ->
      throw err if err
      fs.writeFile(__dirname + '/componentImages/wire.png', buf)
      done()

  specify "A Voltage Source", (done) ->
    @VoltageSource = new VoltageSource(50, 50, 50, 150, [500])
    @Renderer.drawComponent(@VoltageSource)

    @Renderer.getCanvas().toBuffer (err, buf) ->
      throw err if err
      fs.writeFile(__dirname + '/componentImages/voltSource.png', buf)
      done()

  specify "A Ground Symbol", (done) ->
    @Ground = new Ground(50, 50, 50, 150)
    @Renderer.drawComponent(@Ground)

    @Renderer.getCanvas().toBuffer (err, buf) ->
      throw err if err
      fs.writeFile(__dirname + '/componentImages/ground.png', buf)
      done()
