let CircuitComponent = require("./CircuitComponent.js");
let Util = require('../util/Util.js');


class InverterElm extends CircuitComponent {
  static get Fields() {
    return {
      slewRate: {
        title: "Slew Rate",
        data_type: parseFloat,
        default_value: 0.5,
        range: [0, Infinity]
      }
    };
  }

  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);

    this.noDiagonal = true;

    this.place()
  }

  static get NAME() {
    return "Inverter"
  }

  place() {
    this.hs = 16;
    let ww = 16;

    if (ww > (this.dn() / 2)) {
      ww = Math.floor(this.dn()/2);
    }

    this.lead1 = Util.interpolate(this.point1, this.point2, 0.5 - (ww / this.dn()));
    this.lead2 = Util.interpolate(this.point1, this.point2, 0.5 + ((ww + 2) / this.dn()));

    this.pcircle = Util.interpolate(this.point1, this.point2, 0.5 + ((ww - 2) / this.dn()));

    let triPoints = Util.newPointArray(3);

    [triPoints[0], triPoints[1]] = Util.interpolateSymmetrical(this.lead1, this.lead2, 0, this.hs);

    triPoints[2] = Util.interpolate(this.point1, this.point2, 0.5 + ((ww - 5) / this.dn()));

    this.gatePoly = Util.createPolygonFromArray(triPoints);

    this.setBboxPt(this.lead1, this.lead2, 2*this.hs);
  }

  draw(renderContext) {
    //this.setBboxPt(this.point1, this.point2, this.hs);

    renderContext.drawLeads(this);

    renderContext.drawPolygon(this.gatePoly);
    renderContext.drawCircle(this.pcircle.x, this.pcircle.y, renderContext.POST_RADIUS + 2, 2, renderContext.STROKE_COLOR, "#FFFFFF");

    this.updateDots();
    renderContext.drawDots(this.point1, this.point2, this);

    renderContext.drawPosts(this);

    if (this.Circuit && this.Circuit.debugModeEnabled()) {
      return super.debugdraw(renderContext);
    }
  }

  numVoltageSources() {
    return 1;
  }

  stamp(stamper) {
    return stamper.stampVoltageSource(0, this.nodes[1], this.voltSource);
  }

  doStep(stamper) {
    let v0 = this.volts[1];
    let out = this.volts[0] > 2.5 ? 0 : 5;

    let maxStep = this.slewRate * this.getParentCircuit().timeStep() * 1e9;

    out = Math.max(Math.min(v0 + maxStep, out), v0 - maxStep);

    return stamper.updateVoltageSource(0, this.nodes[1], this.voltSource, out);
  }

  getVoltageDiff() {
    return this.volts[0];
  }

  getConnection(n1, n2) {
    return false;
  }

  hasGroundConnection(n1) {
    return n1 === 1;
  }
}
InverterElm.initClass();

module.exports = InverterElm;

