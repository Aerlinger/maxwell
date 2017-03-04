let CircuitComponent = require('./CircuitComponent');

let Polygon = require('../geom/Polygon');
let Rectangle = require('../geom/Rectangle');
let Point = require('../geom/Point');
let RailElm = require('./RailElm');
let VoltageElm = require('./VoltageElm');

let Util = require('../util/Util');

class VarRailElm extends RailElm {
  static get Fields() {
    return Util.extend(RailElm.Fields, {
      "sliderText": {
        title: "sliderText",
        default_value: "Voltage",
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
