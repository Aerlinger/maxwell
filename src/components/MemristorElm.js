let CircuitComponent = require("./CircuitComponent.js");
let Util = require('../util/Util');
let Point = require('../geom/Point');

class MemristorElm extends CircuitComponent {
  static get Fields() {
  
    return {
      r_on: {
        title: "On resistance",
        data_type: parseFloat,
        default_value: 100,
        unit: "Ohms",
        symbol: "Ω",
        range: [0, Infinity]
      },
      r_off: {
        title: "Off resistance",
        data_type: parseFloat,
        default_value: 160 * 100,
        unit: "Oms",
        symbol: "Ω",
        range: [0, Infinity]
      },
      dopeWidth: {
        title: "Doping Width",
        data_type: parseFloat,
        default_value: 0,
        symbol: "m",
        range: [0, Infinity]
      },
      totalWidth: {
        title: "Total Width",
        data_type: parseFloat,
        default_value: 10e-9,
        symbol: "m",
        range: [0, Infinity]
      },
      mobility: {
        title: "Majority carrier mobility",
        data_type: parseFloat,
        default_value: 1e-10,
        symbol: "cm2/(V·s)",
        range: [0, Infinity]
      },
      resistance: {
        title: "Overall resistance",
        data_type: parseFloat,
        default_value: 100,
        unit: "Ohms",
        symbol: "Ω",
        range: [0, Infinity]
      }
    };
  }

  constructor(xa, xb, ya, yb, params, f) {
    super(xa, xb, ya, yb, params, f);

    this.place()
  }

  place() {
    super.setPoints(...arguments);
    this.calcLeads(32);
    this.ps3 = new Point(0, 0);
    this.ps4 = new Point(0, 0);
  }

  static get NAME() {
    return "Memristor"
  }

  reset() {
    return this.dopeWidth = 0;
  }

  draw(renderContext) {
    let segments = 6;
    let ox = 0;
    let v1 = this.volts[0];
    let v2 = this.volts[1];
    let hs = 2 + Math.floor(8 * (1 - this.dopeWidth / this.totalWidth));
    this.setBboxPt(this.point1, this.point2, hs);
    renderContext.drawLeads(this);

    let segf = 1.0 / segments;

    // draw zigzag
    for (let i = 0; i <= segments; i++) {
      let nx = (i & 1) == 0 ? 1 : -1;
      if (i == segments)
        nx = 0;

      let v = v1 + (v2 - v1) * i / segments;

      let color = renderContext.getVoltageColor(v);

      let startPosition = Util.interpolate(this.lead1, this.lead2, i * segf, hs * ox);
      let endPosition = Util.interpolate(this.lead1, this.lead2, i * segf, hs * nx);

      renderContext.drawLinePt(startPosition, endPosition, color);

      if (i == segments)
        break;

      startPosition = Util.interpolate(this.lead1, this.lead2, (i + 1) * segf, hs * nx);
      renderContext.drawLinePt(startPosition, endPosition);

      ox = nx;
    }

    renderContext.drawDots(this.point1, this.lead1, this);
    renderContext.drawDots(this.lead2, this.point2, this);
    renderContext.drawPosts(this);

    if (this.Circuit && this.Circuit.debugModeEnabled()) {
      return super.debugdraw(renderContext);
    }
  }

  nonLinear() {
    return true;
  }

  doStep(stamper) {
    return stamper.stampResistor(this.nodes[0], this.nodes[1], this.resistance);
  }

  stamp(stamper) {
    stamper.stampNonLinear(this.nodes[0]);
    return stamper.stampNonLinear(this.nodes[1]);
  }

  calculateCurrent() {
    return this.current = (this.volts[0] - this.volts[1]) / this.resistance;
  }

  startIteration() {
    let wd = this.dopeWidth / this.totalWidth;
    this.dopeWidth += (this.getParentCircuit().timeStep() * this.mobility * this.r_on * this.current) / this.totalWidth;

    if (this.dopeWidth < 0) {
      this.dopeWidth = 0;
    }
    if (this.dopeWidth > this.totalWidth) {
      this.dopeWidth = this.totalWidth;
    }

    return this.resistance = (this.r_on * wd) + (this.r_off * (1 - wd));
  }
}
MemristorElm.initClass();


module.exports = MemristorElm;
