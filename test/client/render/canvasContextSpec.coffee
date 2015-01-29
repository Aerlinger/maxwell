fs = require('fs')
require('../../src/Maxwell.coffee')

#Renderer = require('../../src/render/renderer.coffee')

describe "Canvas Context", ->
  beforeEach (done) ->
    @renderer = new Renderer(400, 300)
    @renderer.clear()
    done()

  it "should render (46, 32):   10px radius red circle  3px border  fill: #F38   stroke: #0F0601", (done) ->
    @renderer.fillCircle(46, 32, 10, 3, '#F38', '#0F0601')
    @renderer.getCanvas().toBuffer (err, buf) ->
      throw err if err
      fs.writeFile(__dirname + '/primitives/circle.png', buf)
      done()


  it "should render (46, 32, 100, 150):  #00A", (done) ->
    @renderer.drawThickLine(46, 32, 100, 150, '#00A')
    @renderer.getCanvas().toBuffer (err, buf) ->
      throw err if err
      fs.writeFile(__dirname + '/primitives/line.png', buf)
      done()


  it "should render polygon:  [46, 32, 100, 150], [150, 46, 32, 100] #0CA", (done) ->
    @renderer.drawThickPolygon([46, 32, 100, 150], [150, 46, 32, 100], '#0CA')
    @renderer.getCanvas().toBuffer (err, buf) ->
      throw err if err
      fs.writeFile(__dirname + '/primitives/poly.png', buf)
      done()


  it "should clear canvas", (done) ->
    @renderer.getCanvas().toBuffer (err, buf) ->
      throw err if err
      fs.writeFile(__dirname + '/primitives/clear.png', buf)
      done()
