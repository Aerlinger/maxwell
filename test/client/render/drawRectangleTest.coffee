fs = require('fs')
#Canvas = require('../../src/render/renderer.js')
Maxwell = require('../../../src/Maxwell.js')

describe "Canvas", ->
  before ->
    @canvas = new Canvas(400, 300)
    @context = @canvas.getContext('2d');

  it "can draw line", ->
    @context.beginPath()
    @context.fillStyle = "#FA6B00"
    @context.fillRect(50, 60, 90, 70)

    @canvas.toBuffer (err, buf) ->
      throw err if err
      fs.writeFile(__dirname + '/primitives/block.png', buf)
