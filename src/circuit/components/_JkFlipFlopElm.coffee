CircuitComponent = require("../CircuitComponent.coffee")
ChipElm = require("./ChipElm.coffee")
Util = require('../../util/util.coffee')

class JkFlipFlopElm extends ChipElm



constructor: (xa, xb, ya, yb, params, f) ->
    super(xa, xb, ya, yb, params, f)

    @pins[4].value = !@pins[3].value;

module.exports = JkFlipFlopElm

