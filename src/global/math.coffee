isInfinite: (num) ->
  return num > 1e18 || !isFinite(num)

sign: (x) ->
  return (x < 0) ? -1 : (x == 0) ? 0 : 1

getRand: (x) ->
  Math.floor Math.random() * (x + 1)