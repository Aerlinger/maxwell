OrGateElm = require("./OrGateElm.coffee")
DrawUtil = require('../../util/drawUtil')
ArrayUtil = require('../../util/arrayUtils')

class NorGateElm extends OrGateElm

  constructor: (xa, ya, xb, yb, params, f) ->
    super(xa, ya, xb, yb, params, f)

  getGateName: ->
    "NOR Gate"

  isInverting: ->
    true

  getDumpType: ->
    153

module.exports = NorGateElm
