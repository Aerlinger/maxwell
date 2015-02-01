Settings = require('../../settings/settings.coffee')
DrawHelper = require('../../render/drawHelper.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
CircuitComponent = require('../circuitComponent.coffee')

class AntennaElm extends CircuitComponent

  constructor: (xa, ya, xb, yb, f, params) ->
    super(xa, ya, xb, yb, f, params)

module.exports = AntennaElm

