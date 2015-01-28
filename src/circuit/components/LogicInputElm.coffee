Settings = require('../../settings/settings.coffee')
DrawHelper = require('../../render/drawHelper.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
CircuitComponent = require('../circuitComponent.coffee')

class LogicInputElm extends CircuitComponent

  constructor: (xa, ya, xb, yb, f, st) ->
    super(xa, ya, xb, yb, f)

module.exports = LogicInputElm
