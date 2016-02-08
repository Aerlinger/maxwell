CircuitComponent = require("../CircuitComponent.coffee")
ChipElm = require("./ChipElm.coffee")
DrawUtil = require('../../util/drawUtil.coffee')

class DFlipFlopElm extends ChipElm

  constructor: (xa, xb, ya, yb, params, f) ->
    super(xa, xb, ya, yb, params, f)

    @pins[2].value = !@pins[1].value;


module.exports = DFlipFlopElm
