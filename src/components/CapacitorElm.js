let CircuitComponent = require('./CircuitComponent.js');
let Settings = require('../Settings.js');
let Polygon = require('../geom/Polygon.js');
let Rectangle = require('../geom/Rectangle.js');
let Point = require('../geom/Point.js');
let Util = require('../util/Util.js');

class CapacitorElm extends CircuitComponent {
  static initClass() {
    this.FLAG_BACK_EULER = 2;
  }

  static get Fields() {
    return {
      "capacitance": {
        name: "Capacitance",
        unit: "Farads",
        default_value: 5e-6,
        symbol: "F",
        data_type: parseFloat,
        range: [0, Infinity]
      },
      "voltdiff": {
        name: "Volts",
        unit: "Volts",
        default_value: 10,
        symbol: "V",
        data_type: parseFloat,
        range: [-Infinity, Infinity]
      }
    };
  }

  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);

    this.compResistance = 11;
    this.plate1 = [];
    this.plate2 = [];
    this.curSourceValue = 0;

    // console.log("ca", xa);
    this.place()
  }

  isTrapezoidal() {
    return true;
  }
//    (@flags & CapacitorElm.FLAG_BACK_EULER) is 0

  nonLinear() {
    return false;
  }

  setNodeVoltage(n, c) {
    super.setNodeVoltage(n, c);
    return this.voltdiff = this.volts[0] - this.volts[1];
  }

  reset() {
    this.current = 0;
    this.curcount = 0;
    this.curSourceValue = 0;

    // put small charge on caps when reset to start oscillators
    this.voltdiff = 1e-3;
  }

  place() {
    // console.log("capelm", arguments);
//    super(arguments...)
    //super.setPoints(...arguments);

    let f = ((this.dn() / 2) - 4) / this.dn();

    this.lead1 = Util.interpolate(this.point1, this.point2, f);
    this.lead2 = Util.interpolate(this.point1, this.point2, 1 - f);

    this.plate1 = [new Point(0, 0), new Point(0, 0)];
    this.plate2 = [new Point(0, 0), new Point(0, 0)];

    [this.plate1[0], this.plate1[1]] = Util.interpolateSymmetrical(this.point1, this.point2, f, 12);
    [this.plate2[0], this.plate2[1]] = Util.interpolateSymmetrical(this.point1, this.point2, 1 - f, 12);
  }

  draw(renderContext) {
    let hs = 12;
//    @setBboxPt @point1, @point2, hs

    // draw leads
    renderContext.drawLinePt(this.point1, this.lead1, renderContext.getVoltageColor(this.volts[0]));
    renderContext.drawLinePt(this.point2, this.lead2, renderContext.getVoltageColor(this.volts[1]));

    this.updateDots();
    renderContext.drawDots(this.point1, this.lead1, this);
    renderContext.drawDots(this.lead2, this.point2, this);

    // draw plates
    renderContext.drawLinePt(this.plate1[0], this.plate1[1], renderContext.getVoltageColor(this.volts[0]), Settings.LINE_WIDTH+1);
    renderContext.drawLinePt(this.plate2[0], this.plate2[1], renderContext.getVoltageColor(this.volts[1]), Settings.LINE_WIDTH+1);

    renderContext.drawValue(17, 0, this, Util.getUnitText(this.capacitance, this.unitSymbol(), Settings.COMPONENT_DECIMAL_PLACES));

    renderContext.drawPosts(this);

    if (this.Circuit && this.Circuit.debugModeEnabled()) {
      super.debugDraw(renderContext);
    }
  }

  unitSymbol() {
    return "F";
  }

  drawUnits() {
    let s;
    return s = Util.getUnitText(this.capacitance, "F");
  }
//    @drawValues s, hs

  doStep(stamper) {
    return stamper.stampCurrentSource(this.nodes[0], this.nodes[1], this.curSourceValue);
  }

  stamp(stamper) {
    // capacitor companion model using trapezoidal approximation (Norton equivalent) consists of a current source in
    // parallel with a resistor.  Trapezoidal is more accurate than Backward Euler but can cause oscillatory behavior
    // if RC is small relative to the timestep.

    if (this.isTrapezoidal()) {
      this.compResistance = this.timeStep() / (2 * this.capacitance);
    } else {
      this.compResistance = this.timeStep() / this.capacitance;
    }

    stamper.stampResistor(this.nodes[0], this.nodes[1], this.compResistance);
    stamper.stampRightSide(this.nodes[0]);
    return stamper.stampRightSide(this.nodes[1]);
  }

  startIteration() {
    if (this.isTrapezoidal()) {
      return this.curSourceValue = (-this.voltdiff / this.compResistance) - this.current;
    } else {
      return this.curSourceValue = -this.voltdiff / this.compResistance;
    }
  }

  calculateCurrent() {
    let vdiff = this.volts[0] - this.volts[1];

    // we check compResistance because this might get called before stamp(), which sets compResistance, causing
    // infinite current
    if (this.compResistance > 0) {
      return this.current = (vdiff / this.compResistance) + this.curSourceValue;
    }
  }

  needsShortcut() {
    return true;
  }

  static get NAME() {
    return "Capacitor";
  }
}
CapacitorElm.initClass();

module.exports = CapacitorElm;
