CircuitComponent = require("../CircuitComponent.coffee")
Util = require('../../util/util.coffee')

class PushSwitchElm extends SwitchElm

  constructor: (xa, xb) ->
    super(xa, xb, true)

module.exports = PushSwitchElm

