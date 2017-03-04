let CircuitComponent = require('./CircuitComponent.js');

let Polygon = require('../geom/Polygon.js');
let Rectangle = require('../geom/Rectangle.js');
let Point = require('../geom/Point.js');
let Util = require('../util/Util.js');

class InductorElm extends CircuitComponent {
  static initClass() {
    this.FLAG_BACK_EULER = 2;
  }

  static get Fields() {
    return {
      "inductance": {
        title: "Inductance",
        unit: "Henries",
        symbol: "H",
        default_value: 1e-3,
        data_type: parseFloat,
        range: [0, Infinity]
      },
      "current": {
        title: "Initial Current",
        unit: "Amperes",
        symbol: "A",
        default_value: 0,
        data_type: parseFloat
      }
    };
  }

  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);

    this.nodes = new Array(2);
    this.compResistance = 0;  //1e-3
    this.curSourceValue = 0;

    this.place()
  }

  reset() {
    this.current = 0;
    this.volts[0] = 0;
    this.volts[1] = 0;
    this.curcount = 0;
    this.curSourceValue = 0;
  }

  place() {
    //super.setPoints(...arguments);
    this.calcLeads(40);
  }

  stamp(stamper) {
    // Inductor companion model using trapezoidal or backward euler
    // approximations (Norton equivalent) consists of a current
    // source in parallel with a resistor.  Trapezoidal is more
    // accurate than backward euler but can cause oscillatory behavior.
    // The oscillation is a real problem in circuits with switches.
    let ts = this.getParentCircuit().timeStep();

    if (this.isTrapezoidal()) {
      this.compResistance = (2 * this.inductance) / ts;
    } else {
      this.compResistance = this.inductance / ts;
    }

    stamper.stampResistor(this.nodes[0], this.nodes[1], this.compResistance);
    stamper.stampRightSide(this.nodes[0]);
    return stamper.stampRightSide(this.nodes[1]);
  }


  doStep(stamper) {
    return stamper.stampCurrentSource(this.nodes[0], this.nodes[1], this.curSourceValue);
  }

  draw(renderContext, Settings) {

    let v1 = this.volts[0];
    let v2 = this.volts[1];
    let hs = 8;

//    @setBboxPt @point1, @point2, hs
    renderContext.drawLeads(this);

    renderContext.drawValue(-14, 0, this, Util.getUnitText(this.inductance, "H", Settings.COMPONENT_DECIMAL_PLACES));

//    renderContext.drawDots(@point1, @point2, this)
    this.updateDots();
    renderContext.drawDots(this.point1, this.lead1, this);
    renderContext.drawDots(this.lead2, this.point2, this);

    renderContext.drawCoil(this.lead1, this.lead2, v1, v2);

    renderContext.drawPosts(this);

    if (this.Circuit && this.Circuit.debugModeEnabled()) {
      return super.debugdraw(renderContext, Settings);
    }
  }

  startIteration() {
    if (this.isTrapezoidal()) {
      return this.curSourceValue = (this.getVoltageDiff() / this.compResistance) + this.current;
    // backward euler
    } else {
      return this.curSourceValue = this.current;
    }
  }

  nonLinear() {
    return false;
  }

  isTrapezoidal() {
    return true;
  }

  calculateCurrent() {
    if (this.compResistance > 0) {
      this.current = (this.getVoltageDiff() / this.compResistance) + this.curSourceValue;
    }

    return this.current;
  }

  getVoltageDiff() {
    return this.volts[0] - this.volts[1];
  }

  static get NAME() {
    return "Inductor";
  }
}
InductorElm.initClass();


module.exports = InductorElm;
