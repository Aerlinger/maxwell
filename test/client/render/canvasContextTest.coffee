describe.skip "Canvas Context", ->
  beforeEach (done) ->
    @renderer = new CircuitUI(400, 300)
    @renderer.clear()
    done()

  it "renders (46, 32):   10px radius red circle  3px border  fill: #F38   stroke: #0F0601", (done) ->
    @renderer.drawCircle(46, 32, 10, 3, '#0F0601', '#F38')
    @renderer.getCanvas().toBuffer (err, buf) ->
      throw err if err
      fs.writeFile(__dirname + '/primitives/circle.png', buf)
      done()


  it "renders (46, 32, 100, 150):  #00A", (done) ->
    @renderer.CircuitCanvas.drawLine(46, 32, 100, 150, '#00A')
    @renderer.getCanvas().toBuffer (err, buf) ->
      throw err if err
      fs.writeFile(__dirname + '/primitives/line.png', buf)
      done()


  it "renders polygon:  [46, 32, 100, 150], [150, 46, 32, 100] #0CA", (done) ->
    @renderer.CircuitCanvas.drawPolygon(Polygon.fromCoordinates([46, 32, 100, 150], [150, 46, 32, 100]), '#0CA')
    @renderer.getCanvas().toBuffer (err, buf) ->
      throw err if err
      fs.writeFile(__dirname + '/primitives/poly.png', buf)
      done()


  it "clear canvas", (done) ->
    @renderer.getCanvas().toBuffer (err, buf) ->
      throw err if err
      fs.writeFile(__dirname + '/primitives/clear.png', buf)
      done()
