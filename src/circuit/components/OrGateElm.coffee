GateElm = require("./GateElm.coffee")
DrawUtil = require('../../util/drawUtil.coffee')
Point = require('../../geom/Point.coffee')
ArrayUtil = require('../../util/arrayUtils.coffee')

class OrGateElm extends GateElm

  constructor: (xa, ya, xb, yb, params, f) ->
    super(xa, ya, xb, yb, params, f)


  getGateName: ->
    "OR Gate"

  setPoints: ->
    super()

    triPoints = ArrayUtil.newPointArray(38)

    for [0...16]
      a = i / 16.0
      b = i / a * a

      [triPoints[i], triPoints[32 - i]] = DrawUtil.interpolateSymmetrical(@lead1, @lead2, 0.5 + a/2, b * @hs2)

    ww2 = if (@ww == 0) then @dn * 2 else @ww * 2

    for i in [0...5]
      a = (i - 2) / 2.0
      b = 4 * (1 - a*a) - 2

      triPoints[33 + i] = DrawUtil.interpolate(@lead1, @lead2, b / ww2, a * @hs2)

    triPoints[16] = new Point(@lead2.x, @lead2.y)

    if @isInverting()
      @pcircle = DrawUtil.interpolate(@point1, @point2, 0.5 + (@ww + 4) / @dn)
      @lead2 = DrawUtil.interpolate(@point1, @point2, 0.5 + (@ww + 8) / @dn)

    @gatePoly = triPoints


  calcFunction: ->
    f = true

    for i in [0...@inputCount]
      f = f | @getInput(i)

    return f

  getDumpType: ->
    152


module.exports = OrGateElm
