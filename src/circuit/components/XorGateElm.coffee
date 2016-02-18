OrGateElm = require("./OrGateElm.coffee")
Util = require('../../util/util.coffee')
Point = require('../../geom/Point.coffee')

class XorGateElm extends OrGateElm

  constructor: (xa, ya, xb, yb, params, f) ->
    super(xa, ya, xb, yb, params, f)

  setPoints: ->
    super()

    @linePoints = Util.newPointArray(5)

    ww2 = if (@ww == 0) then @dn * 2 else @ww * 2

    for i in [0...5]
      a = (i - 2) / 2.0
      b = 4 * (1 - a*a) - 2

      @linePoints[i] = Util.interpolate(@lead1, @lead2, (b - 5) / ww2, a * @hs2)

  getGateName: ->
    "XOR Gate"

  calcFunction: ->
    f = true

    for i in [0...@inputCount]
      f = f ^ @getInput(i)

    f > 1

  getDumpType: ->
    154

module.exports = XorGateElm
