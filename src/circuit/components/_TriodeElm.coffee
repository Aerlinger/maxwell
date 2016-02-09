CircuitComponent = require("../CircuitComponent.coffee")
Util = require('../../util/util.coffee')

class TriodeElm extends CircuitComponent
  @ParameterDefinitions = {
    mu: {
      name: ""
      data_type: parseFloat
    }
    gk1: {
      name: ""
      data_type: parseFloat
    }
  }


  constructor: (xa, xb, ya, yb, params, f) ->
    super(xa, xb, ya, yb, params, f)

    @setup



module.exports = TriodeElm
