let CircuitComponent = require("../circuitComponent.js");
let Util = require('../../util/util.js');
let Point = require('../../geom/point.js');

class AnalogSwitchElm extends CircuitComponent {
  static initClass() {
    this.FLAG_INVERT = 1;
  }

  static get Fields() {
    return {
      r_on: {
        name: "On Resistance",
        data_type: parseFloat,
        default_value: 20
      },
      r_off: {
        name: "Off Resistance",
        data_type: parseFloat,
        default_value: 1e10
      }
    };
  }

  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);
  }

  getDumpType() {
    return 159;
  }

  setPoints() {
    super.setPoints(...arguments);

    this.calcLeads(32);

    this.ps = new Point(0, 0);
    let openhs = 16;

    this.point3 = Util.interpolate(this.point1, this.point2, 0.5, -openhs);
    return this.lead3 = Util.interpolate(this.point1, this.point2, 0.5, -openhs / 2);
  }

  calculateCurrent() {
    return this.current = (this.volts[0] - this.volts[1]) / this.resistance;
  }

  nonLinear() {
    return true;
  }

  stamp(stamper) {
    stamper.stampNonLinear(this.nodes[0]);
    return stamper.stampNonLinear(this.nodes[1]);
  }

  doStep(stamper) {
    this.open = this.volts[2] < 2.5;

    if ((this.flags & AnalogSwitchElm) !== 0) {
      this.open = !this.open;
    }

    this.resistance = this.open ? this.r_off : this.r_on;

    return stamper.stampResistor(this.nodes[0], this.nodes[1], this.resistance);
  }

  getPostCount() {
    return 3;
  }

  getPost(n){
    if (n === 0) {
      return this.point1;
    } else {
      if (n === 1) {
        return this.point2;
      } else {
        return this.point3;
      }
    }
  }

  getConnection(n1, n2) {
    return !((n1 === 2) || (n2 === 2));
  }
}
AnalogSwitchElm.initClass();





module.exports = AnalogSwitchElm;
