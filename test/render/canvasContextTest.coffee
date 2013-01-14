# <DEFINE>
define [
  'cs!fs',
  'cs!CanvasContext',
], (
  'fs',
  'CanvasContext'
) ->
# </DEFINE>


describe "Canvas Context", ->
  beforeEach (done) ->
    @canvasContext = new CanvasContext(400, 300)
    @canvasContext.clear()
    done()


  it "should render (46, 32):   10px radius red circle  3px border  fill: #F38   stroke: #0F0601", (done) ->
    @canvasContext.fillCircle(46, 32, 10, 3, '#F38', '#0F0601')
    @canvasContext.getCanvas().toBuffer (err, buf) ->
      throw err if err
      fs.writeFile(__dirname + '/primitives/circle.png', buf)
      done()


  it "should render (46, 32, 100, 150):  #00A", (done) ->
    @canvasContext.drawThickLine(46, 32, 100, 150, '#00A')
    @canvasContext.getCanvas().toBuffer (err, buf) ->
      throw err if err
      fs.writeFile(__dirname + '/primitives/line.png', buf)
      done()


  it "should render polygon:  [46, 32, 100, 150], [150, 46, 32, 100] #0CA", (done) ->
    @canvasContext.drawThickPolygon([46, 32, 100, 150], [150, 46, 32, 100], '#0CA')
    @canvasContext.getCanvas().toBuffer (err, buf) ->
      throw err if err
      fs.writeFile(__dirname + '/primitives/poly.png', buf)
      done()


  it "should clear canvas", (done) ->
    @canvasContext.getCanvas().toBuffer (err, buf) ->
      throw err if err
      fs.writeFile(__dirname + '/primitives/clear.png', buf)
      done()
