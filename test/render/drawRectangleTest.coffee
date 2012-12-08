Canvas = require 'canvas'
fs = require 'fs'


describe "Canvas", ->
  before () ->
    @canvas = new Canvas(400, 300)
    @context = @canvas.getContext('2d');

  it "should draw line", ->
    @context.beginPath()
    @context.fillStyle = "#FA6B00"
    @context.fillRect(50, 60, 90, 70)

    @canvas.toBuffer (err, buf) ->
      throw err if err
      fs.writeFile(__dirname + '/primitives/block.png', buf)