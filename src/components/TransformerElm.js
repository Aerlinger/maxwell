let CircuitComponent = require('./CircuitComponent.js');
let Util = require('../util/Util.js');

class TransformerElm extends CircuitComponent {
  static initClass() {
    this.FLAG_BACK_EULER = 2;
  }

  static get Fields() {
    return {
      inductance: {
        title: "Inductance",
        default_value: 1e-3,
        data_type: parseFloat,
        unit: "Henries",
        symbol: "H"
      },
      ratio: {
        title: "Ratio",
        default_value: 1,
        data_type: parseFloat,
        field_type: "integer"
      },
      // TODO: Name collision
      current0: {
        title: "Current L",
        data_type: parseFloat,
        default_value: 1e-3,
        symbol: "A"
      },
      current1: {
        title: "Current R",
        data_type: parseFloat,
        default_value: 1e-3,
        symbol: "A"
      },
      couplingCoef: {
        title: "Coupling Coefficient",
        default_value: 0.999,
        data_type: parseFloat
      }
    };
  }

  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);

    // this.drawWidth = Math.max(32, Math.abs(yb - ya));
    this.drawWidth = this.dn();//Math.max(32, this.dn());
    this.curcount = 0;
    this.current = [this.current0, this.current1];
    this.noDiagonal = true;

    this.place()
  }

  static get NAME() {
    return "Transformer"
  }

  isTrapezoidal() {
    return (this.flags & TransformerElm.FLAG_BACK_EULER) === 0;
  }

  place() {
    // super.setPoints(...arguments);

    //this.point2.y = this.point1.y;

    this.ptEnds = Util.newPointArray(4);
    this.ptCoil = Util.newPointArray(4);
    this.ptCore = Util.newPointArray(4);

    this.ptEnds[0] = this.point1;
    this.ptEnds[1] = this.point2;

//    console.log("SP: ", @point1, @point2, 0, -@dsign(), @width)
    let hs = this.drawWidth;
    hs = 32;
    
    this.ptEnds[2] = Util.interpolate(this.point1, this.point2, 0, -hs);
    this.ptEnds[3] = Util.interpolate(this.point1, this.point2, 1, -hs);

    let ce = 0.5 - (12 / this.dn());
    let cd = 0.5 - (2 / this.dn());

    let i = 0;
    while (i < 4) {
      this.ptCoil[i]     = Util.interpolate(this.ptEnds[i], this.ptEnds[i + 1], ce);
      this.ptCoil[i + 1] = Util.interpolate(this.ptEnds[i], this.ptEnds[i + 1], 1 - ce);
      this.ptCore[i]     = Util.interpolate(this.ptEnds[i], this.ptEnds[i + 1], cd);
      this.ptCore[i + 1] = Util.interpolate(this.ptEnds[i], this.ptEnds[i + 1], 1 - cd);

      i+=2;
    }

    this.setBboxPt(this.point1, this.ptEnds[3]);
  }

  getPost(n) {
    return this.ptEnds[n];
  }

  numPosts() {
    return 4;
  }

  reset() {
    this.current[0] = 0;
    this.current[1] = 0;

    this.volts[0] = 0;
    this.volts[1] = 0;
    this.volts[2] = 0;
    this.volts[3] = 0;

    this.curcount[0] = 0;
    this.curcount[1] = 0;
  }

  draw(renderContext) {
    let i;
    for (i = 0; i < 4; i++) {
      let color = renderContext.getVoltageColor(this.volts[i]);

      // console.log(@ptEnds[i], @ptCoil[i], color)
      renderContext.drawLinePt(this.ptEnds[i], this.ptCoil[i], color);

      renderContext.drawPost(this.ptEnds[i], this.ptCoil[i], "#33FFEE", "#33FFEE");
    }

    for (i = 0; i < 2; i++) {
      renderContext.drawCoil(this.ptCoil[i], this.ptCoil[i + 2], this.volts[i], this.volts[i + 2], this.dsign() * ((i === 1) ? -6 : 6));
    }

    for (i = 0; i < 2; i++) {
      renderContext.drawLinePt(this.ptCore[i], this.ptCore[i + 2]);

      renderContext.drawPost(this.ptCore[i], this.ptCore[i + 2], "#FFEE33", "#FF33EE");
    }
      //      @curcount[i] = updateDot

    renderContext.drawPosts(this);

    if (this.Circuit && this.Circuit.debugModeEnabled()) {
      return super.debugDraw(renderContext);
    }
  }


  stamp(stamper) {
//    double l1 = inductance;
//    double l2 = inductance * ratio * ratio;
//    double m = couplingCoef * Math.sqrt(l1 * l2);
//    // build inverted matrix
//    double deti = 1 / (l1 * l2 - m * m);
//    double ts = isTrapezoidal() ? sim.timeStep / 2 : sim.timeStep;
//    a1 = l2 * deti * ts; // we multiply dt/2 into a1..a4 here
//    a2 = -m * deti * ts;
//    a3 = -m * deti * ts;
//    a4 = l1 * deti * ts;
//    sim.stampConductance(nodes[0], nodes[2], a1);
//    sim.stampVCCurrentSource(nodes[0], nodes[2], nodes[1], nodes[3], a2);
//    sim.stampVCCurrentSource(nodes[1], nodes[3], nodes[0], nodes[2], a3);
//    sim.stampConductance(nodes[1], nodes[3], a4);
//    sim.stampRightSide(nodes[0]);
//    sim.stampRightSide(nodes[1]);
//    sim.stampRightSide(nodes[2]);
//    sim.stampRightSide(nodes[3]);

    let ts;
    let l1 = this.inductance;
    let l2 = this.inductance * this.ratio * this.ratio;

    //    deti = 1 / (l1 * l2 - m * m);
    let m = this.couplingCoef  * Math.sqrt(l1 * l2);

    let deti = 1.0 / ((l1 * l2) - (m * m));

    if (this.isTrapezoidal()) {
      ts = this.getParentCircuit().timeStep() / 2;
    } else {
      ts = this.getParentCircuit().timeStep();
    }

    //console.log("STAMP li: #{l1} l2: #{l2} deti #{deti} ts: #{ts} ratio: #{@ratio} m: #{m}")
    this.a1 = l2 * deti * ts;
    this.a2 = -m * deti * ts;
    this.a3 = -m * deti * ts;
    this.a4 = l1 * deti * ts;
//    console.log("STAMP", @a1, @a2, @a3, @a4)

    stamper.stampConductance(this.nodes[0], this.nodes[2], this.a1);
    stamper.stampVCCurrentSource(this.nodes[0], this.nodes[2], this.nodes[1], this.nodes[3], this.a2);
    stamper.stampVCCurrentSource(this.nodes[1], this.nodes[3], this.nodes[0], this.nodes[2], this.a3);
    stamper.stampConductance(this.nodes[1], this.nodes[3], this.a4);

//    console.log(@nodes)
    stamper.stampRightSide(this.nodes[0]);
    stamper.stampRightSide(this.nodes[1]);
    stamper.stampRightSide(this.nodes[2]);
    stamper.stampRightSide(this.nodes[3]);
  }

  calculateCurrent() {
//    console.log("CALC CURRENT (volts): #{@volts} #{@curSourceValue1} #{@curSourceValue2}")

    let voltdiff1 = this.volts[0] - this.volts[2];
    let voltdiff2 = this.volts[1] - this.volts[3];
    this.current[0] = (voltdiff1 * this.a1) + (voltdiff2 * this.a2) + this.curSourceValue1;
    this.current[1] = (voltdiff1 * this.a3) + (voltdiff2 * this.a4) + this.curSourceValue2;
  }

//  setNode: (j, k) ->
//    super()
//    if j==3
//      console.log("K = #{k}")
//      console.trace()

  doStep(stamper) {
//    console.log("DO STEP", @curSourceValue1, @curSourceValue2, @isTrapezoidal())
//    console.log(@nodes)
    stamper.stampCurrentSource(this.nodes[0], this.nodes[2], this.curSourceValue1);
    stamper.stampCurrentSource(this.nodes[1], this.nodes[3], this.curSourceValue2);
  }

//    console.log(@Circuit.Solver.circuitRightSide)

  startIteration() {

    //    double voltdiff1 = volts[0] - volts[2];
    //    double voltdiff2 = volts[1] - volts[3];
    //    if (isTrapezoidal()) {
    //    curSourceValue1 = voltdiff1 * a1 + voltdiff2 * a2 + current[0];
    //      curSourceValue2 = voltdiff1 * a3 + voltdiff2 * a4 + current[1];
    //    } else {
    //  curSourceValue1 = current[0];
    //    curSourceValue2 = current[1];
    //    }

    let voltdiff1 = this.volts[0] - this.volts[2];
    let voltdiff2 = this.volts[1] - this.volts[3];

    if (this.isTrapezoidal()) {
      this.curSourceValue1 = (voltdiff1 * this.a1) + (voltdiff2 * this.a2) + this.current[0];
      this.curSourceValue2 = (voltdiff1 * this.a3) + (voltdiff2 * this.a4) + this.current[1];
    } else {
      this.curSourceValue1 = this.current[0];
      this.curSourceValue2 = this.current[1];
    }
  }

//    console.log("START ITERATION ", voltdiff1, voltdiff2, @curSourceValue1, @curSourceValue2)

  getConnection(n1, n2) {
    if (Util.comparePair(n1, n2, 0, 2)) {
      return true;
    }

    if (Util.comparePair(n1, n2, 1, 3)) {
      return true;
    }

    return false;
  }
}
TransformerElm.initClass();


module.exports = TransformerElm;
