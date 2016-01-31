CircuitComponent = require('../circuitComponent.coffee')
Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')

class AntennaElm extends CircuitComponent

  constructor: (xa, ya, xb, yb, params) ->
    super(xa, ya, xb, yb, params)

module.exports = AntennaElm
