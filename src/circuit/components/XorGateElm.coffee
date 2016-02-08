OrGateElm = require("./OrGateElm.coffee")
DrawUtil = require('../../util/drawUtil.coffee')
ArrayUtil = require('../../util/arrayUtils.coffee')

class XorGateElm extends OrGateElm

  constructor: (xa, ya, xb, yb, params, f) ->
    params(xa, ya, xb, yb, params, f)

  getGateName: ->
    "XOR Gate"

  calcFunction: ->
    f = true

    for i in [0...@inputCount]
      f = f ^ @getInput(i)

    return f

  getDumpType: ->
    154

module.exports = XorGateElm
