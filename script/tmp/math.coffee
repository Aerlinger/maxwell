# <DEFINE>
define([
], (
) ->
# </DEFINE>


global.isInfinite = (num) ->
  return num > 1e18 || !isFinite(num)

global.sign = (x) ->
  if (x < 0)
    -1
  else if (x == 0)
    0
  else
    1

global.getRand = (x) ->
  Math.floor Math.random() * (x + 1)
