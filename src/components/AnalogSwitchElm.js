let CircuitComponent = require("./CircuitComponent.js");
let Util = require('../util/Util');
let Point = require('../geom/Point');


class AnalogSwitchElm extends CircuitComponent {
  static initClass() {
    this.FLAG_INVERT = 1;
  }

  static get Fields() {
    return {
      r_on: {
        title: "On Resistance",
        default_value: 20,
        unit: "Ohms",
        symbol: "Ω",
        data_type: parseFloat,
        range: [0, Infinity]
      },
      r_off: {
        title: "Off Resistance",
        default_value: 1e10,
        unit: "Ohms",
        symbol: "Ω",
        data_type: parseFloat,
        range: [0, Infinity]
      }
    };
  }

  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);

    this.place()
  }

  place() {
    this.calcLeads(32);
    this.open = false;

    this.ps = new Point(0, 0);
    let openhs = 16;

    this.point3 = Util.interpolate(this.point1, this.point2, 0.5, -openhs);
    this.lead3 = Util.interpolate(this.point1, this.point2, 0.5, -openhs / 2);

    this.setBboxPt(this.point1, this.point2, openhs);
  }

  draw(renderContext) {
    let openhs = 16;

    let hs = this.open ? openhs : 0;

    renderContext.drawLeads(this)

    this.ps = Util.interpolate(this.lead1, this.lead2, 1, hs);

    // SWITCH LEVER
    renderContext.drawLinePt(this.lead1, this.ps, renderContext.SWITCH_COLOR, renderContext.LINE_WIDTH + 1);

    renderContext.drawLinePt(this.point3, this.lead3);

    this.updateDots();
    renderContext.drawDots(this.point1, this.point2, this);

    renderContext.drawPosts(this);

    if (this.Circuit && this.Circuit.debugModeEnabled()) {
      return super.debugdraw(renderContext);
    }
  }

  static get NAME() {
    return "Analog Switch"
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

  numPosts() {
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
