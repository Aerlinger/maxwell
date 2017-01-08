CircuitComponent = require("../circuitComponent.js")
Util = require('../../util/util.coffee')

class PhotoResistorElm extends CircuitComponent

  @Fields = {
    maxresistance: {
      name: "Max. Resistance"
      data_type: parseFloat
    }
    minresistance: {
      name: "Min. Resistance"
      data_type: parseFloat
    }
  }


  constructor: (xa, xb, ya, yb, params, f) ->
    super(xa, xb, ya, yb, params, f)

  getDumpType: ->
    "186"



module.exports = PhotoResistorElm
