CircuitComponent = require('../circuitComponent.coffee')
Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')
RailElm = require('./RailElm.coffee')
VoltageElm = require('./VoltageElm.coffee')

sprintf = require("sprintf-js").sprintf
_ = require("lodash")

class VarRailElm extends RailElm

  @ParameterDefinitions = {}

  _.extend(@ParameterDefinitions, RailElm.ParameterDefinitions, {
    "sliderText": {
      name: "sliderText"
      unit: "",
      default_value: "Voltage",
      symbol: "%",
      data_type: (x) -> x
    }
  })

  constructor: (xa, ya, xb, yb, params) ->
    @waveform = VoltageElm.WF_VAR
    super(xa, ya, xb, yb, params)

#    console.log(@toJson())

    @sliderValue = Math.floor((@frequency - @bias) * 100 / (@maxVoltage - @bias));

#    console.log("value: #{@sliderValue}")

#  setPoints: ->
#    super()
#
#    diameter = if (@waveform == VoltageElm.WF_DC || @waveform == VoltageElm.WF_VAR)
#      8
#    else
#      @circleSize * 2
#
#    @calcLeads(diameter)

  getDumpType: ->
    172

  createSlider: ->

  getSliderValue: ->
    @sliderValue

#  getVoltageDiff: ->
#    @volts[0]

    # Todo: implement
  getVoltage: ->
    @frequency = @getSliderValue * (@maxVoltage - @bias) / 100.0 + @bias;

#    console.log("frequency: #{@frequency}")
    return @frequency

module.exports = VarRailElm
