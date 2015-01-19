class MathUtils

  @isInfinite: (num) ->
    return num > 1e18 || !isFinite(num)

  @sign: (x) ->
    if (x < 0)
      -1
    else if (x == 0)
      0
    else
      1

  @getRand: (x) ->
    Math.floor Math.random() * (x + 1)

module.exports = MathUtils
