CircuitComponent = require('../circuitComponent.coffee')
Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
RailElm = require('./RailElm.coffee')

class VarRailElm extends RailElm

  @ParameterDefinitions = {
    "waveform": {
      name: "none"
      unit: "none"
      symbol: "none"
      default_value: 0
      data_type: "integer"
      range: [0, 6]
    },
    "frequency": {
      name: "Frequency"
      unit: "Hertz",
      default_value: 40,
      symbol: "Hz",
      data_type: "float"
      range: [-Infinity, Infinity]
    },
    "maxVoltage": {
      name: "Voltage"
      unit: "Voltage"
      symbol: "V"
      default_value: 5
      data_type: "float"
      range: [-Infinity, Infinity]
    },
    "bias": {
      name: "Voltage"
      unit: "Voltage"
      symbol: "V"
      default_value: 0
      data_type: "float"
      range: [-Infinity, Infinity]
    },
    "phaseShift": {
      name: "degrees"
      unit: "degrees",
      default_value: 0,
      symbol: "deg",
      data_type: "float"
      range: [-360, 360]
    },
    "dutyCycle": {
      name: "percentage"
      unit: "",
      default_value: 0,
      symbol: "%",
      data_type: "float"
      range: [0, 100]
    },
    "label": {
      name: "label"
      unit: "",
      default_value: "Voltage",
      symbol: "%",
      data_type: "string"
    }
# Flags:
#    @FLAG_COS: 2
  }


  constructor: (xa, ya, xb, yb, params) ->
#      @sliderText = "voltage"
    @frequency = @maxVoltage

    super(xa, ya, xb, yb, params)
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
