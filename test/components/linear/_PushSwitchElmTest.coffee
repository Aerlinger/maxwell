CircuitComponent = require("../CircuitComponent.coffee")
DrawUtil = require('../../util/drawUtil.coffee')

class PushSwitchElm extends SwitchElm

  constructor: (xa, xb) ->
    super(xa, xb, true)


module.exports = PushSwitchElm

