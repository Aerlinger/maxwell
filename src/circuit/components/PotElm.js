let CircuitComponent = require("../circuitComponent.js");
let Util = require("../../util/util.js");
let Settings = require('../../settings/settings.js');

let Point = require("../../geom/point.js");

class PotElm extends CircuitComponent {
  static get Fields() {
    return {
      "maxResistance": {
        name: "Max Resistance",
        default_value: 1e4,
        data_type: parseFloat,
        range: [0, Infinity]
      },
      "position": {
        name: "Position",
        default_value: 1,
        range: [0, 1e5],
        data_type: parseFloat
      },
      "sliderText": {
        name: "sliderText",
        default_value: "",
        data_type(x) {
          return x;
        }
      }
    };
  }

  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);

    this.sliderValue = this.position * 100;
  }

//  draw: (renderContext) ->
//    super()
//
//    @getParentCircuit.halt("Draw not yet implemented for #{this}")

  adjustmentValueChanged() {
    this.getParentCircuit().Solver.analyzeFlag = true;
    return this.setPoints();
  }

  getPostCount() {
    return 3;
  }

  setPoints() {
    let dx;
    super.setPoints(...arguments);

    let offset = 0;

    // TODO: Check
    if (Math.abs(this.dx()) > Math.abs(this.dy())) {
      dx = Util.snapGrid(this.dx() / 2) * 2;
      this.point2.x = this.point1.x + dx;

      offset = (this.dx() < 0) ? this.dy() : -this.dy();

      this.point2.y = this.point1.y;
    } else {
      let dy = Util.snapGrid(this.dy() / 2) * 2;
      this.point2.y = this.point1.y + dy;
      offset = (this.dy() > 0) ? this.dx() : -this.dx();
      this.point2.x = this.point1.x;
    }

    if (offset === 0) {
      offset = Settings.GRID_SIZE;
    }

    let dn = Math.sqrt(Math.pow(this.point1.x - this.point2.x, 2), Math.pow(this.point1.y - this.point2.y, 2));

    let bodyLen = 32;

    this.calcLeads(bodyLen);
    //    @position = @getSliderValue() * 0.0099 + 0.005
    let soff = Math.floor((this.position - 0.5) * bodyLen);

    this.post3 = Util.interpolate(this.point1, this.point2, 0.5, offset);
    this.corner2 = Util.interpolate(this.point1, this.point2, (soff / dn) + 0.5, offset);
    this.arrowPoint = Util.interpolate(this.point1, this.point2, (soff / dn) + 0.5, 8 * Math.sign(offset));
    this.midpoint = Util.interpolate(this.point1, this.point2, (soff / dn) + 0.5);

    let clen = Math.abs(offset) - 8;

    [this.arrow1, this.arrow2] = Util.interpolateSymmetrical(this.corner2, this.arrowPoint, (clen - 8) / clen, 8);

    this.ps3 = new Point(0, 0);
    return this.ps4 = new Point(0, 0);
  }

  getPost(n) {
    if (n === 0) {
      return this.point1;
    } else if (n === 1) {
      return this.point2;
    } else {
      return this.post3;
    }
  }

  calculateCurrent() {
    this.current1 = (this.volts[0] - this.volts[2]) / this.resistance1;
    this.current2 = (this.volts[1] - this.volts[2]) / this.resistance2;
    return this.current3 = -this.current1 - this.current2;
  }

  stamp(stamper) {
    this.resistance1 = this.maxResistance * this.position;
    this.resistance2 = this.maxResistance * (1 - this.position);
    stamper.stampResistor(this.nodes[0], this.nodes[2], this.resistance1);
    return stamper.stampResistor(this.nodes[2], this.nodes[1], this.resistance2);
  }
}
PotElm.initClass();


module.exports = PotElm;
