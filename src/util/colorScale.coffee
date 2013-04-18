# <DEFINE>
define [], () ->
# </DEFINE>


  class ColorScale
    @colorScaleCount = 32
    @colorScale = []

    # Creates the color scale
    @initializeColorScale: ->
      @colorScale = new Array(@colorScaleCount)

      for i in [1..@colorScaleCount]
        v = i * 2 / @colorScaleCount - 1
        if v < 0
          n1 = Math.floor (128 * -v) + 127
          n2 = Math.floor 127 * (1 + v)

          # Color is red for a negative voltage:
          @colorScale[i] = new Color(n1, n2, n2)
        else
          n1 = Math.floor (128 * v) + 127
          n2 = Math.floor 127 * (1 - v)

          # Color is green for a positive voltage
          @colorScale[i] = new Color(n2, n1, n2)

    @scale: ->
      [ "#ff0000", "#f70707", "#ef0f0f", "#e71717", "#df1f1f", "#d72727", "#cf2f2f", "#c73737",
        "#bf3f3f", "#b74747", "#af4f4f", "#a75757", "#9f5f5f", "#976767", "#8f6f6f", "#877777",
        "#7f7f7f", "#778777", "#6f8f6f", "#679767", "#5f9f5f", "#57a757", "#4faf4f", "#47b747",
        "#3fbf3f", "#37c737", "#2fcf2f", "#27d727", "#1fdf1f", "#17e717", "#0fef0f", "#07f707", "#00ff00" ]


  return ColorScale
