let CircuitComponent = require('../circuitComponent.js');
let Settings = require('../../settings/settings.js');
let Polygon = require('../../geom/polygon.js');
let Rectangle = require('../../geom/rectangle.js');
let Point = require('../../geom/point.js');
let RailElm = require('./RailElm.js');
let VoltageElm = require('./VoltageElm.js');

let { sprintf } = require("sprintf-js");
let Util = require('../../util/util.js');

class VarRailElm extends RailElm {
  static initClass() {
  
    this.Fields = Util.extend(RailElm.Fields, {
      "sliderText": {
        name: "sliderText",
        unit: "",
        default_value: "Voltage",
        symbol: "%",
        data_type(x) { return x; }
      }
    });
  }

  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);
    
    this.waveform = VoltageElm.WF_VAR;

//    console.log(@toJson())

    this.sliderValue = Math.floor(((this.frequency - this.bias) * 100) / (this.maxVoltage - this.bias));
  }

//    console.log("value: #{@sliderValue}")

//  setPoints: ->
//    super
//
//    diameter = if (@waveform == VoltageElm.WF_DC || @waveform == VoltageElm.WF_VAR)
//      8
//    else
//      @circleSize * 2
//
//    @calcLeads(diameter)

  getDumpType() {
    return 172;
  }

  createSlider() {}

  getSliderValue() {
    return this.sliderValue;
  }

//  getVoltageDiff: ->
//    @volts[0]

    // Todo: implement
  getVoltage() {
    this.frequency = ((this.getSliderValue() * (this.maxVoltage - this.bias)) / 100.0) + this.bias;

//    console.log("frequency: #{@frequency}")
    return this.frequency;
  }
}
VarRailElm.initClass();

module.exports = VarRailElm;
