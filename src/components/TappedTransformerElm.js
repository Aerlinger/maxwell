let CircuitComponent = require("./CircuitComponent.js");
let Util = require('../util/Util.js');

class TappedTransformerElm extends CircuitComponent {
  static get Fields() {
    return {
      inductance: {
        title: "Inductance",
        data_type: parseFloat,
        default_value: 4,
        unit: "Henries",
        symbol: "H"
      },
      ratio: {
        title: "Ratio",
        data_type: parseFloat,
        default_value: 1,
        range: [0, Infinity]
      },
      current0: {
        title: "Current0",
        data_type: parseFloat,
        default_value: 0,
        unit: "Amperes",
        symbol: "A"
      },
      current1: {
        title: "Current1",
        data_type: parseFloat,
        default_value: 1,
        unit: "Amperes",
        symbol: "A"
      },
      current2: {
        title: "Current2",
        data_type: parseFloat,
        default_value: 0,
        unit: "Amperes",
        symbol: "A"
      }
    };
  }

  constructor(xa, xb, ya, yb, params, f) {
    super(xa, xb, ya, yb, params, f);

    this.current = [this.current0, this.current1, this.current2, 0];
    // this.params['current'] = this.current;

    // delete this.params['current0'];
    // delete this.params['current1'];
    // delete this.params['current2'];

    this.noDiagonal = true;
    this.place()
  }

  draw(renderContext) {
    super.debugDraw(renderContext);

    this.current[3] = this.current[1] - this.current[2];

    let color;

    for (let i = 0; i != 5; i++) {
      color = renderContext.getVoltageColor(this.volts[i]);
      renderContext.drawLinePt(this.ptEnds[i], this.ptCoil[i], color);
    }
    for (let i = 0; i != 4; i++) {
      if (i == 1)
        continue;

      // setPowerColor(g, current[i] * (volts[i] - volts[i + 1]));
      renderContext.drawCoil(this.ptCoil[i], this.ptCoil[i + 1], this.volts[i], this.volts[i + 1], i > 1 ? -6 : 6);
    }

    //renderContext.getVoltageColor(needsHighlight() ? selectColor : lightGrayColor);

    for (let i = 0; i != 4; i += 2) {
      renderContext.drawLinePt(this.ptCore[i], this.ptCore[i + 1]);
    }

    /*
    // calc current of tap wire
    this.current[3] = this.current[1] - this.current[2];
    for (i = 0; i != 4; i++)
      curcount[i] = updateDotCount(current[i], curcount[i]);


    // primary dots
    drawDots(g, ptEnds[0], ptCoil[0], curcount[0]);
    drawDots(g, ptCoil[0], ptCoil[1], curcount[0]);
    drawDots(g, ptCoil[1], ptEnds[1], curcount[0]);

    // secondary dots
    drawDots(g, ptEnds[2], ptCoil[2], curcount[1]);
    drawDots(g, ptCoil[2], ptCoil[3], curcount[1]);
    drawDots(g, ptCoil[3], ptEnds[3], curcount[3]);
    drawDots(g, ptCoil[3], ptCoil[4], curcount[2]);
    drawDots(g, ptCoil[4], ptEnds[4], curcount[2]);
    */

    renderContext.drawPosts(this);
    
  }

  static get NAME() {
    return "Tapped Transformer"
  }

  place() {
    let b;
    //super.setPoints(...arguments);

    let hs = 32;

    this.ptEnds = new Array(5);
    this.ptCoil = new Array(5);
    this.ptCore = new Array(4);

    this.ptEnds[0] = this.point1;
    this.ptEnds[2] = this.point2;

    this.ptEnds[1] = Util.interpolate(this.point1, this.point2, 0, -hs * 2);
    this.ptEnds[3] = Util.interpolate(this.point1, this.point2, 1, -hs);
    this.ptEnds[4] = Util.interpolate(this.point1, this.point2, 1, -hs * 2);

    let ce = 0.5 - (12 / this.dn());
    let cd = 0.5 - (2 / this.dn());

    this.ptCoil[0] = Util.interpolate(this.ptEnds[0], this.ptEnds[2], ce);
    this.ptCoil[1] = Util.interpolate(this.ptEnds[0], this.ptEnds[2], ce, -hs * 2);
    this.ptCoil[2] = Util.interpolate(this.ptEnds[0], this.ptEnds[2], 1 - ce);
    this.ptCoil[3] = Util.interpolate(this.ptEnds[0], this.ptEnds[2], 1 - ce, -hs);
    this.ptCoil[4] = Util.interpolate(this.ptEnds[0], this.ptEnds[2], 1 - ce, -hs * 2);

    this.setBboxPt(this.ptEnds[0], this.ptEnds[4], 0);
    
    [0, 1].map((i) =>
      (b = -hs * i * 2,
      this.ptCore[i] = Util.interpolate(this.ptEnds[0], this.ptEnds[2], cd, b),
      this.ptCore[i + 2] = Util.interpolate(this.ptEnds[0], this.ptEnds[2], 1 - cd, b)));
  }

  getPost(n) {
    return this.ptEnds[n];
  }

  numPosts() {
    return 5;
  }

  setNodeVoltage(node_idx, voltage) {
//    console.log("TRANS", voltage)
    return super.setNodeVoltage();
  }

  reset() {
    this.current[0] = 0;
    this.current[1] = 0;

    this.volts[0] = 0;
    this.volts[1] = 0;
    this.volts[2] = 0;
    this.volts[3] = 0;

    this.curcount[0] = 0;
    return this.curcount[1] = 0;
  }

  stamp(stamper) {
    let l1 = this.inductance;
    let l2 = (this.inductance * this.ratio * this.ratio) / 4;
    let cc = 0.99;

    this.a = new Array(9);

    this.a[0] = (1 + cc) / (l1 * ((1 + cc) - (2 * cc * cc)));
    this.a[1] = this.a[2] = this.a[3] = this.a[6] = (2 * cc) / (((2 * cc * cc) - cc - 1) * this.inductance * this.ratio);
    this.a[4] = this.a[8] = (-4 * (1 + cc)) / (((2 * cc * cc) - cc - 1) * l1 * this.ratio * this.ratio);
    this.a[5] = this.a[7] = (4 * cc) / (((2 * cc * cc) - cc - 1) * l1 * this.ratio * this.ratio);

    return [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) =>
      (this.a[i] *= this.getParentCircuit().timeStep() / 2,

      stamper.stampConductance(this.nodes[0], this.nodes[1], this.a[0]),
      stamper.stampVCCurrentSource(this.nodes[0], this.nodes[1], this.nodes[2], this.nodes[3], this.a[1]),
      stamper.stampVCCurrentSource(this.nodes[0], this.nodes[1], this.nodes[3], this.nodes[4], this.a[2]),
  
      stamper.stampVCCurrentSource(this.nodes[2], this.nodes[3], this.nodes[0], this.nodes[1], this.a[3]),
      stamper.stampConductance(this.nodes[2], this.nodes[3], this.a[4]),
      stamper.stampVCCurrentSource(this.nodes[2], this.nodes[3], this.nodes[3], this.nodes[4], this.a[5]),
  
      stamper.stampVCCurrentSource(this.nodes[3], this.nodes[4], this.nodes[0], this.nodes[1], this.a[6]),
      stamper.stampVCCurrentSource(this.nodes[3], this.nodes[4], this.nodes[2], this.nodes[3], this.a[7]),
      stamper.stampConductance(this.nodes[3], this.nodes[4], this.a[8]),
  
      (() => {
        let result = [];
        for (i = 0; i < 5; i++) {
          result.push(stamper.stampRightSide(this.nodes[i]));
        }
        return result;
      })(),

      this.voltdiff = new Array(3),
      this.curSourceValue = new Array(3))
    );
  }

  doStep(stamper) {
    stamper.stampCurrentSource(this.nodes[0], this.nodes[1], this.curSourceValue[0]);
    stamper.stampCurrentSource(this.nodes[2], this.nodes[3], this.curSourceValue[1]);
    return stamper.stampCurrentSource(this.nodes[3], this.nodes[4], this.curSourceValue[2]);
  }

  startIteration() {
    this.voltdiff[0] = this.volts[0] - this.volts[1];
    this.voltdiff[1] = this.volts[2] - this.volts[3];
    this.voltdiff[2] = this.volts[3] - this.volts[4];

    [0, 1, 2].map((i) =>
      (this.curSourceValue[i] = this.current[i],
      [0, 1, 2].map((j) =>
        this.curSourceValue[i] = this.a[(i*3) + j] * this.voltdiff[j])));
  }

  calculateCurrent() {
    this.voltdiff[0] = this.volts[0] - this.volts[1];
    this.voltdiff[1] = this.volts[2] - this.volts[3];
    this.voltdiff[2] = this.volts[3] - this.volts[4];

    return [0, 1, 2].map((i) =>
      (this.current[i] = this.curSourceValue[i],
      [0, 1, 2].map((j) =>
        this.current[i] += this.a[(i * 3) + j] * this.voltdiff[j])));
  }

  getConnection(n1, n2) {
    if (Util.comparePair(n1, n2, 0, 1)) {
      return true;
    }
    if (Util.comparePair(n1, n2, 2, 3)) {
      return true;
    }
    if (Util.comparePair(n1, n2, 3, 4)) {
      return true;
    }
    if (Util.comparePair(n1, n2, 2, 4)) {
      return true;
    }

    return false;
  }
}
TappedTransformerElm.initClass();

module.exports = TappedTransformerElm;
