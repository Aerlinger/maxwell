let CircuitComponent = require('./CircuitComponent.js');

let Polygon = require('../geom/Polygon.js');
let Rectangle = require('../geom/Rectangle.js');
let Point = require('../geom/Point.js');
let Util = require('../util/Util.js');


class MosfetElm extends CircuitComponent {
  static get PNP() {
    return 1
  }

  static get NPN() {
    return  -1
  }

  // TODO: Replace PNP, NPN with P-Type/N-Type
  static get Fields() {
    return {
      "vt": {
        title: "Threshold Voltage",
        description: "Threshold voltage",
        units: "Volts",
        symbol: "V",
        default_value: 1.5,
        data_type: parseFloat,
        range: [-Infinity, Infinity]
      },
      "pnp": {
        title: "Polarity",
        description: "Current multiplier",
        default_value: 1,
        data_type: Math.sign,
        field_type: "select",
        select_values: { "N-Channel": -1, "P-Channel": 1 }
      }
    };
  }

  static initClass() {
    this.FLAG_PNP = 1;
    this.FLAG_SHOWVT = 2;
    this.FLAG_DIGITAL = 4;
  }

  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);

    this.lastv1 = 0;
    this.lastv2 = 0;
    this.ids = 0;
    this.mode = 0;
    this.gm = 0;

    this.vt = 1.5;
    this.pcircler = 3;
    this.src = []; // Array of points
    this.drn = []; // Array of points
    this.gate = [];
    this.pcircle = [];

    this.noDiagonal = true;
    this.vt = this.getDefaultThreshold();

    this.pnp = (parseInt(this.flags) & MosfetElm.FLAG_PNP) !== 0 ? -1 : 1;

    this.params['pnp'] = this.pnp;

    this.place()
  }

  getDefaultThreshold() {
    return 1.5;
  }

  getBeta() {
    return .02;
  }

  nonLinear() {
    return true;
  }

  static get NAME() {
    return "MOSFET Transistor";
  }

  reset() {
    return this.lastv1 = this.lastv2 = this.volts[0] = this.volts[1] = this.volts[2] = this.curcount = 0;
  }

  draw(renderContext, Settings) {
    //this.setBboxPt(this.point1, this.point2, this.hs);

    let color = renderContext.getVoltageColor(this.volts[1]);
    renderContext.drawLinePt(this.src[0], this.src[1], color);

    color = renderContext.getVoltageColor(this.volts[2]);
    renderContext.drawLinePt(this.drn[0], this.drn[1], color);

    let segments = 6;
//      @setPowerColor true
    let segf = 1.0 / segments;
    for (let i = 0; i < segments; ++i) {
      let v = this.volts[1] + (((this.volts[2] - this.volts[1]) * i) / segments);
      color = renderContext.getVoltageColor(v);
      let ps1 = Util.interpolate(this.src[1], this.drn[1], i * segf);
      let ps2 = Util.interpolate(this.src[1], this.drn[1], (i + 1) * segf);

      renderContext.drawLinePt(ps1, ps2, color);
    }

    color = renderContext.getVoltageColor(this.volts[1]);
    renderContext.drawLinePt(this.src[1], this.src[2], color);

    color = renderContext.getVoltageColor(this.volts[2]);
    renderContext.drawLinePt(this.drn[1], this.drn[2], color);

    if (!this.drawDigital()) {
      color = renderContext.getVoltageColor((this.pnp === 1 ? this.volts[1] : this.volts[2]));
      renderContext.drawPolygon(this.arrowPoly, {stroke: color});
    }

    renderContext.drawPolygon(this.arrowPoly);
//      Circuit.powerCheckItem

    //g.setColor(Color.gray);
    color = renderContext.getVoltageColor(this.volts[0]);
    renderContext.drawLinePt(this.point1, this.gate[1], color);
    renderContext.drawLinePt(this.gate[0], this.gate[2], color);
    this.drawDigital() && (this.pnp === -1);

    //Main.getMainCanvas().drawThickCircle(pcircle.x, pcircle.y, pcircler, Settings.FG_COLOR);
    //drawThickCircle(g, pcircle.x, pcircle.y, pcircler);
//    unless (@flags & MosfetElm.FLAG_SHOWVT) is 0
//      s = "" + (@vt * @pnp)

      //g.setColor(whiteColor);
      //g.setFont(unitsFont);
//        @drawCenteredText s, @x2 + 2, @y2, false

    //g.setColor(Color.white);
    //g.setFont(unitsFont);
//      ds = MathUtils.sign(@dx())  if (@needsHighlight() or Circuit.dragElm is this) and @dy() is 0

    //        Main.getMainCanvas().drawString("G", gate[1].x - 10 * ds, gate[1].y - 5);
    //        Main.getMainCanvas().drawString(pnp == -1 ? "D" : "S", src[0].x - 3 + 9 * ds, src[0].y + 4);
    //        Main.getMainCanvas().drawString(pnp == -1 ? "S" : "D", drn[0].x - 3 + 9 * ds, drn[0].y + 4);
    //
    //        g.drawString("G", gate[1].x - 10 * ds, gate[1].y - 5);
    //        g.drawString(pnp == -1 ? "D" : "S", src[0].x - 3 + 9 * ds, src[0].y + 4); // x+6 if ds=1, -12 if -1
    //        g.drawString(pnp == -1 ? "S" : "D", drn[0].x - 3 + 9 * ds, drn[0].y + 4);
//      @curcount = @updateDotCount(-@ids, @curcount)
    renderContext.drawDots(this.src[0], this.src[1], this);
    renderContext.drawDots(this.src[1], this.drn[1], this);
    renderContext.drawDots(this.drn[1], this.drn[0], this);
    renderContext.drawPosts(this);

    if (this.Circuit && this.Circuit.debugModeEnabled()) {
      return super.debugdraw(renderContext, Settings);
    }
  }

  getPost(n) {
    if (n === 0)
      return this.point1
    else if (n === 1)
      return this.src[0]
    else
      return this.drn[0]
  }

  getCurrent() {
    return this.ids;
  }

  getPower() {
    return this.ids * (this.volts[2] - this.volts[1]);
  }

  numPosts() {
    return 3;
  }

  drawDigital() {
    return true;
  }

  place() {
    //super.setPoints(...arguments);
    this.hs = 16;

    // find the coordinates of the various points we need to draw the MOSFET.
    let hs2 = this.hs * this.dsign();
    this.src = Util.newPointArray(3);
    this.drn = Util.newPointArray(3);

    [this.src[0], this.drn[0]] = Util.interpolateSymmetrical(this.point1, this.point2, 1, -hs2);
    [this.src[1], this.drn[1]] = Util.interpolateSymmetrical(this.point1, this.point2, 1 - (22 / this.dn()), -hs2);
    [this.src[2], this.drn[2]] = Util.interpolateSymmetrical(this.point1, this.point2, 1 - (22 / this.dn()), (-hs2 * 4) / 3);

    this.gate = Util.newPointArray(3);

    [this.gate[0], this.gate[2]] = Util.interpolateSymmetrical(this.point1, this.point2, 1 - (28 / this.dn()), 3*hs2 / 4);  //,  # was 1-20/dn
    this.gate[1] = Util.interpolate(this.gate[0], this.gate[2], .5);

    if (this.pnp) {
      this.arrowPoly = Util.calcArrow(this.src[1], this.src[0], 10, 4);
    } else {
      this.arrowPoly = Util.calcArrow(this.drn[0], this.drn[1], 12, 5);
    }

    this.setBboxPt(this.point1, this.point2, 2*this.hs);
  }

//    if @pnp is -1
//      @gate[1] = Util.interpolate @point1, @point2, 1 - 36 / @dn()
//      dist = (if (@dsign() < 0) then 32 else 31)
//
//      @pcircle = Util.interpolate(@point1, @point2, 1 - dist / @dn())
//      @pcircler = 3

  stamp(stamper) {
    stamper.stampNonLinear(this.nodes[1]);
    return stamper.stampNonLinear(this.nodes[2]);
  }

  doStep(stamper) {
    let vs = new Array(3);

    vs[0] = this.volts[0];
    vs[1] = this.volts[1];
    vs[2] = this.volts[2];

    if (vs[1] > (this.lastv1 + .5)) { vs[1] = this.lastv1 + .5; }
    if (vs[1] < (this.lastv1 - .5)) { vs[1] = this.lastv1 - .5; }
    if (vs[2] > (this.lastv2 + .5)) { vs[2] = this.lastv2 + .5; }
    if (vs[2] < (this.lastv2 - .5)) { vs[2] = this.lastv2 - .5; }

    let source_node = 1;
    let drain_node = 2;

    if ((this.pnp * vs[1]) > (this.pnp * vs[2])) {
      source_node = 2;
      drain_node = 1;
    }

    let gate = 0;

    let vgs = vs[gate] - vs[source_node];
    let vds = vs[drain_node] - vs[source_node];

    if ((Math.abs(this.lastv1 - vs[1]) > .01) || (Math.abs(this.lastv2 - vs[2]) > .01)) {
      this.getParentCircuit().Solver.converged = false;
    }

    this.lastv1 = vs[1];
    this.lastv2 = vs[2];

    let realvgs = vgs;
    let realvds = vds;

    vgs *= this.pnp;
    vds *= this.pnp;

    this.ids = 0;
    this.gm = 0;
    let Gds = 0;
    let beta = this.getBeta();

//    if vgs > .5 and this instanceof JFetElm
//      Circuit.halt "JFET is reverse biased!", this
//      return

    if (vgs < this.vt) {
      // should be all zero, but that causes a singular matrix, so instead we treat it as a large resistor
      Gds = 1e-8;
      this.ids = vds * Gds;
      this.mode = 0;
    } else if (vds < (vgs - this.vt)) {

      // linear
      this.ids = beta * (((vgs - this.vt) * vds) - (vds * vds * .5));
      this.gm = beta * vds;
      Gds = beta * (vgs - vds - this.vt);
      this.mode = 1;
    } else {
      // saturation; Gds = 0
      this.gm = beta * (vgs - this.vt);

      // use very small Gds to avoid nonconvergence
      Gds = 1e-8;
      this.ids = (.5 * beta * (vgs - this.vt) * (vgs - this.vt)) + ((vds - (vgs - this.vt)) * Gds);
      this.mode = 2;
    }

    let rs = (-this.pnp * this.ids) + (Gds * realvds) + (this.gm * realvgs);

    //console.log("M " + vds + " " + vgs + " " + ids + " " + gm + " "+ Gds + " " + volts[0] + " " + volts[1] + " " + volts[2] + " " + source + " " + rs + " " + this);
    stamper.stampMatrix(this.nodes[drain_node], this.nodes[drain_node], Gds);
    stamper.stampMatrix(this.nodes[drain_node], this.nodes[source_node], -Gds - this.gm);
    stamper.stampMatrix(this.nodes[drain_node], this.nodes[gate], this.gm);
    stamper.stampMatrix(this.nodes[source_node], this.nodes[drain_node], -Gds);
    stamper.stampMatrix(this.nodes[source_node], this.nodes[source_node], Gds + this.gm);
    stamper.stampMatrix(this.nodes[source_node], this.nodes[gate], -this.gm);
    stamper.stampRightSide(this.nodes[drain_node], rs);
    stamper.stampRightSide(this.nodes[source_node], -rs);

    if (((source_node === 2) && (this.pnp === 1)) || ((source_node === 1) && (this.pnp === -1))) { return this.ids = -this.ids; }
  }

  canViewInScope() {
    return true;
  }

  getVoltageDiff() {
    return this.volts[2] - this.volts[1];
  }

  getConnection(n1, n2) {
    return !((n1 === 0) || (n2 === 0));
  }
}

MosfetElm.initClass();

module.exports = MosfetElm;
