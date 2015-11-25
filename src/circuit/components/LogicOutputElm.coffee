Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
CircuitComponent = require('../circuitComponent.coffee')

class LogicOutputElm extends CircuitComponent

  constructor: (xa, ya, xb, yb, params) ->
    super(xa, ya, xb, yb, params)

module.exports = LogicOutputElm
