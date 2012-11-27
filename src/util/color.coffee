class Color

  @hexToRgb: (hex) ->
    result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

    if result
      r: parseInt(result[1], 16)
      g: parseInt(result[2], 16)
      b: parseInt(result[3], 16)
    else
      null

  @rgbToHex: (r, g, b) ->
    "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)

  @scale: ->
    [ "#ff0000", "#f70707", "#ef0f0f", "#e71717", "#df1f1f", "#d72727", "#cf2f2f", "#c73737",
      "#bf3f3f", "#b74747", "#af4f4f", "#a75757", "#9f5f5f", "#976767", "#8f6f6f", "#877777",
      "#7f7f7f", "#778777", "#6f8f6f", "#679767", "#5f9f5f", "#57a757", "#4faf4f", "#47b747",
      "#3fbf3f", "#37c737", "#2fcf2f", "#27d727", "#1fdf1f", "#17e717", "#0fef0f", "#07f707", "#00ff00" ]

  # Pallete:
  @WHITE: 0xFFFFFF
  @BLACK: 0x000000
  @GREY: 0xAAAAAA
  @LIGHT_GREY: 0x666666
  @CYAN: 0x00FFFF
  @MAGENTA: 0xFF00FF
  @YELLOW: 0xFFFF00
  @ORANGE: 0xd87f00
  @PURPLE: 0x7500d8
  @SKY: 0x6eb1d8
  @PINK: 0xee7ff2
  @BROWN: 0x521900
  @DEEP_YELLOW: 0xffb11b

  @RED: 0xFF0000
  @GREEN: 0x00FF00
  @BLUE: 0x0000FF


# Footer to allow this class to be exported via node.js. This allows this class to be required by Mocha for testing
# This should be present at the bottom of every file in order to be read through Mocha.
root = exports ? window
module.exports = Color