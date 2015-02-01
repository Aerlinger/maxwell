Settings = require('../../settings/settings.coffee')
DrawHelper = require('../../render/drawHelper.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
CircuitComponent = require('../circuitComponent.coffee')
RailElm = require('./RailElm.coffee')

class VarRailElm extends RailElm

  constructor: (xa, ya, xb, yb, f, params) ->
#      @sliderText = "voltage"
    @frequency = @maxVoltage

    super(xa, ya, xb, yb, f, params)
#      @createSlider()

  getDumpType: ->
    172

  createSlider: ->

  getVoltageDiff: ->
    @volts[0]

    # Todo: implement
  getVoltage: ->
    super()
#      frequency = slider.getValue() * (maxVoltage - bias) / 100.0 + bias
#      frequency

  destroy: ->
#      Circuit.main.remove label
#      Circuit.main.remove slider

module.exports = VarRailElm
