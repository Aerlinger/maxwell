CircuitComponent = require('../circuitComponent')
Settings = require('../../settings/settings')
Polygon = require('../../geom/polygon')
Rectangle = require('../../geom/rectangle')
Point = require('../../geom/point')

class LogicInputElm extends CircuitComponent

  constructor: (xa, ya, xb, yb, params, f) ->
    super(xa, ya, xb, yb, params, f)

module.exports = LogicInputElm

