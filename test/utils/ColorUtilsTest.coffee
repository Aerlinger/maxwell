{ColorUtils} = require '../../util/color.coffee'

describe "Color Utilities", ->

  describe "should convert 6-digit HEX to RGB", ->
    specify "when WHITE", ->
      rgb = Color.hexToRgb("#FFFFFF")
      rgb.r.should.equal 255
      rgb.g.should.equal 255
      rgb.b.should.equal 255

    specify "when RED", ->
      rgb = Color.hexToRgb("#FF0000")
      rgb.r.should.equal 255
      rgb.g.should.equal 0
      rgb.b.should.equal 0

    specify "when BLACK", ->
      rgb = Color.hexToRgb("000000")
      rgb.r.should.equal 0
      rgb.g.should.equal 0
      rgb.b.should.equal 0

    specify "when Gray-ish", ->
      rgb = Color.hexToRgb("928f8c")
      rgb.r.should.equal 146
      rgb.g.should.equal 143
      rgb.b.should.equal 140


  describe "should convert RGB to 6-digit HEX", ->

    specify "when WHITE", ->
      hex = Color.rgbToHex(255, 255, 255)
      hex.should.equal "#ffffff"

    specify "when RED", ->
      hex = Color.rgbToHex(255, 0, 0)
      hex.should.equal "#ff0000"

    specify "when BLACK", ->
      hex = Color.rgbToHex(0, 0, 0)
      hex.should.equal "#000000"

    specify "when Gray-ish", ->
      hex = Color.rgbToHex(146, 143, 140)
      hex.should.equal "#928f8c"
