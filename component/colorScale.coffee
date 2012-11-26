# Generates Green-to-red array to map voltage colors:
class ColorScale

  @colorScaleCount = 32;
  @colorScale = new Array();

  # Creates the color scale
  initialize: ->
    @colorScale = new Array(@colorScaleCount)

    for i in [1..@colorScaleCount]
      v = i * 2 / @colorScaleCount - 1
      if v < 0
        n1 = Math.floor((128 * -v) + 127)
        n2 = Math.floor(127 * (1 + v))

        # Color is red for a negative voltage:
        @colorScale[i] = new Color(n1, n2, n2)
      else
        n1 = Math.floor((128 * v) + 127)
        n2 = Math.floor(127 * (1 - v))

        # Color is green for a positive voltage
        @colorScale[i] = new Color(n2, n1, n2)