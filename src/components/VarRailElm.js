let CircuitComponent = require('./CircuitComponent.js');
let Settings = require('../Settings.js');
let Polygon = require('../geom/Polygon.js');
let Rectangle = require('../geom/Rectangle.js');
let Point = require('../geom/Point.js');
let RailElm = require('./RailElm.js');
let VoltageElm = require('./VoltageElm.js');

let Util = require('../util/Util.js');

class VarRailElm extends RailElm {
  static get Fields() {
    return Util.extend(RailElm.Fields, {
      "sliderText": {
        name: "sliderText",
        unit: "",
        default_value: "Voltage",
        symbol: "%",
        data_type(x) { return x; }
      }
    });
  }

  static get NAME() {
    return "Variable Voltage Rail"
  }

  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);

    this.waveform = VoltageElm.WF_VAR;

    this.sliderValue = Math.floor(((this.frequency - this.bias) * 100) / (this.maxVoltage - this.bias));
  }

  createSlider() {}

  getSliderValue() {
    return this.sliderValue;
  }

    // Todo: implement
  getVoltage() {
    this.frequency = ((this.getSliderValue() * (this.maxVoltage - this.bias)) / 100.0) + this.bias;

    return this.frequency;
  }
}

module.exports = VarRailElm;
