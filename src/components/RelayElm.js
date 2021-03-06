let CircuitComponent = require('./CircuitComponent');
let Util = require('../util/Util');
let Point = require('../geom/Point');


class RelayElm extends CircuitComponent {
  static initClass() {
    this.FLAG_SWAP_COIL = 1;
    this.FLAG_BACK_EULER = 2;
  }

  static get Fields() {
    return {
      poleCount: {
        title: "Pole count",
        data_type: parseInt,
        default_value: 1
      },
      inductance: {
        title: "Coil inductance",
        data_type: parseFloat,
        default_value: 0.2,
        unit: "Henries",
        symbol: "H",
        range: [0, Infinity]
      },
      coilCurrent: {
        title: "Initial coil current",
        data_type: parseFloat,
        default_value: 0
      },
      r_on: {
        title: "'On' resistance",
        unit: "Ohms",
        symbol: "Ω",
        data_type: parseFloat,
        default_value: 0.05,
        range: [0, Infinity]
      },
      r_off: {
        title: "'Off' resistance",
        unit: "Ohms",
        symbol: "Ω",
        data_type: parseFloat,
        default_value: 1e6,
        range: [0, Infinity]
      },
      onCurrent: {
        title: "'On' current",
        unit: "Amperes",
        symbol: "A",
        data_type: parseFloat,
        default_value: 0.02
      },
      coilR: {
        title: "Coil resistance",
        unit: "Ohms",
        symbol: "Ω",
        data_type: parseFloat,
        default_value: 20,
        range: [0, Infinity]
      }
    };
  }

  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);

    if (!this.poleCount) { this.poleCount = 2; } // Temporary

    this.switchCurrent = [];

    this.nSwitch0 = 0;
    this.nSwitch1 = 1;
    this.nSwitch2 = 2;

//    ind.setup(@inductance, @coilCurrent, Inductor.FLAG_BACK_EULER)
//    @flags = RelayElm.FLAG_BACK_EULER
    this.tempCurrent = this.coilCurrent;
    this.compResistance = 0;
    this.curSourceValue = 0;

    this.setupPoles();
    this.place();

    this.noDiagonal = true;
  }

  setupPoles() {
    this.nCoil1 = 3 * this.poleCount;
    this.nCoil2 = this.nCoil1 + 1;
    this.nCoil3 = this.nCoil1 + 2;

    if ((this.switchCurrent === null) || (this.switchCurrent == undefined) || (this.switchCurrent.length !== this.poleCount)) {
      this.switchCurrent = new Array(this.poleCount);
      this.switchCurCount = new Array(this.poleCount);
    }
  }

  static get NAME() {
    return "Relay"
  }

  place() {
    let i, j;
    //super.setPoints(...arguments);
    this.setupPoles();
    this.allocNodes();
    this.openhs = -this.dsign() * 16;

    this.calcLeads(32);

    this.swposts = new Array(this.poleCount);
    this.swpoles = new Array(this.poleCount);

    for (let i = 0; i < this.poleCount; ++i) {
      this.swposts[i] = new Array(3);
      this.swpoles[i] = new Array(3);

      for (j = 0; j < 3; j++) {
        this.swposts[i][j] = new Point(0, 0);
        this.swpoles[i][j] = new Point(0, 0);
      }

      this.swpoles[i][0] = Util.interpolate(this.lead1, this.lead2, 0, -this.openhs * 3 * i);
      this.swpoles[i][1] = Util.interpolate(this.lead1, this.lead2, 1, (-this.openhs * 3 * i) - this.openhs);
      this.swpoles[i][2] = Util.interpolate(this.lead1, this.lead2, 1, (-this.openhs * 3 * i) + this.openhs);
      this.swposts[i][0] = Util.interpolate(this.point1, this.point2, 0, -this.openhs * 3 * i);
      this.swposts[i][1] = Util.interpolate(this.point1, this.point2, 1, (-this.openhs * 3 * i) - this.openhs);
      this.swposts[i][2] = Util.interpolate(this.point1, this.point2, 1, (-this.openhs * 3 * i) + this.openhs);
    }

    this.coilPosts = new Array(2);
    this.coilLeads = new Array(2);
    this.ptSwitch = new Array(this.poleCount);

    let x = ((this.flags & RelayElm.FLAG_SWAP_COIL) !== 0) ? 1 : 0;

    this.coilPosts[0] = Util.interpolate(this.point1, this.point2, x, this.openhs * 2);
    this.coilPosts[1] = Util.interpolate(this.point1, this.point2, x, this.openhs * 3);
    this.coilLeads[0] = Util.interpolate(this.point1, this.point2, 0.5, this.openhs * 2);
    this.coilLeads[1] = Util.interpolate(this.point1, this.point2, 0.5, this.openhs * 3);

    if (this.poleCount && this.poleCount > 0)
      this.lines = new Array(this.poleCount * 2);
  }

  getPost(n) {
    if (n < (3 * this.poleCount))
      return this.swposts[Math.floor(n / 3)][n % 3];

    return this.coilPosts[n - (3 * this.poleCount)];
  }

  numPosts() {
    return 2 + (3 * this.poleCount);
  }

  numInternalNodes() {
    return 1;
  }

  isTrapezoidal() {
    return (this.flags & RelayElm.FLAG_BACK_EULER) === 0;
  }

  reset() {
    super.reset();

    this.current = 0;
    this.tempCurrent = 0;
    this.coilCurrent = 0;
    this.coilCurCount = 0;

    for (let p=0; p<this.poleCount; ++p)
      this.switchCurrent[i] = this.switchCurCount[i] = 0;
  }

  stamp(stamper) {
    if (this.isTrapezoidal())
      this.compResistance = (2 * this.inductance) / this.getParentCircuit().timeStep();
    // backward euler
    else
      this.compResistance = this.inductance / this.getParentCircuit().timeStep();

    stamper.stampResistor(this.nodes[this.nCoil1], this.nodes[this.nCoil3], this.compResistance);
    stamper.stampRightSide(this.nodes[this.nCoil1]);
    stamper.stampRightSide(this.nodes[this.nCoil3]);

    stamper.stampResistor(this.nodes[this.nCoil3], this.nodes[this.nCoil2], this.coilR);

    for (let i=0; i<3 * this.poleCount; ++i)
      stamper.stampNonLinear(this.nodes[this.nSwitch0 + i]);
  }

  startIteration() {
    let voltdiff = this.volts[this.nCoil1] - this.volts[this.nCoil3];

    if (this.isTrapezoidal())
      this.curSourceValue = (voltdiff / this.compResistance) + this.tempCurrent;
    // backward euler
    else
      this.curSourceValue = this.tempCurrent;

    let magic = 1.3;
    let pmult = Math.sqrt(magic + 1);
    let p = (this.coilCurrent * pmult) / this.onCurrent;

    this.d_position = Math.abs(p * p) - 1.3;

    if (this.d_position < 0)
      this.d_position = 0;

    if (this.d_position > 1)
      this.d_position = 1;

    if (this.d_position < 0.1)
      this.i_position = 0;
    else if (this.d_position > 0.9)
      this.i_position = 1;
    else
      this.i_position = 2;
  }

  draw(renderContext) {
    let i;
    for (i = 0; i < 2; i++) {
      renderContext.getVoltageColor(this.volts[this.nCoil1 + i]);
      renderContext.drawLinePt(this.coilLeads[i], this.coilPosts[i]);
    }

    renderContext.drawLeads(this);

    let x = ((this.flags & RelayElm.FLAG_SWAP_COIL) !== 0) ? 1 : 0;

    renderContext.drawCoil(this.coilLeads[x], this.coilLeads[1 - x], this.volts[this.nCoil1 + x], this.volts[this.nCoil2 - x], this.dsign() * 6);

    // draw lines
    for (let i = 0; i < this.poleCount; ++i) {
      if (i === 0)
        this.lines[i * 2] = Util.interpolate(this.point1, this.point2, .5, ((this.openhs * 2) + (5 * this.dsign())) - (i * this.openhs * 3));
      else
        this.lines[i * 2] = Util.interpolate(this.point1, this.point2, .5, Math.floor((this.openhs * ((((-i * 3) + 3) - 0.5) + this.d_position)) + (5 * this.dsign())));

      this.lines[(i * 2) + 1] = Util.interpolate(this.point1, this.point2, .5, Math.floor((this.openhs * (((-i * 3) - .5) + this.d_position)) - (5 * this.dsign())));

      renderContext.drawLine(this.lines[i * 2].x, this.lines[i * 2].y, this.lines[(i * 2) + 1].x, this.lines[(i * 2) + 1].y, "#AAA");
    }

    for (let p = 0; p < this.poleCount; ++p) {
      let po = p * 3;

      for (i = 0; i < 3; i++) {
        // draw lead
        renderContext.getVoltageColor(this.volts[this.nSwitch0 + po + i]);
        renderContext.drawLinePt(this.swposts[p][i], this.swpoles[p][i]);
      }

      this.ptSwitch[p] = Util.interpolate(this.swpoles[p][1], this.swpoles[p][2], this.d_position);

      renderContext.drawLinePt(this.swpoles[p][0], this.ptSwitch[p], renderContext.LIGHT_POST_COLOR);
      //      switchCurCount[p] = updateDotCount(@switchCurrent[p], @switchCurCount[p], this)

      this.updateDots();
      renderContext.drawDots(this.swposts[p][0], this.swpoles[p][0], this);
    }

      // TODO: Multi dots
//      if (@i_position != 2)
//        @drawDots(g, @swpoles[p][@i_position + 1], @swposts[p][@i_position + 1], @switchCurCount[p])

//    coilCurCount = updateDotCount(coilCurrent, coilCurCount);

//    drawDots(g, coilPosts[0], coilLeads[0], coilCurCount);
//    drawDots(g, coilLeads[0], coilLeads[1], coilCurCount);
//    drawDots(g, coilLeads[1], coilPosts[1], coilCurCount);

    renderContext.drawPosts(this);

    if (this.Circuit && this.Circuit.debugModeEnabled()) {
      super.debugdraw(renderContext);
    }
  }

  doStep(stamper) {
    stamper.stampCurrentSource(this.nodes[this.nCoil1], this.nodes[this.nCoil3], this.curSourceValue);

    let res0 = this.i_position === 0 ? this.r_on : this.r_off;
    let res1 = this.i_position === 1 ? this.r_on : this.r_off;

    for (let p = 0; p < 3*this.poleCount; ++p) {
      stamper.stampResistor(this.nodes[this.nSwitch0 + p], this.nodes[this.nSwitch1 + p], res0);
      stamper.stampResistor(this.nodes[this.nSwitch0 + p], this.nodes[this.nSwitch2 + p], res1);

      this.nSwitch0 + p;
    }
  }

  calculateCurrent() {
    let voltdiff = this.volts[this.nCoil1 - this.volts[this.nCoil3]];

    if (this.compResistance > 0)
      this.tempCurrent = (voltdiff / this.compResistance) + this.curSourceValue;

    this.coilCurrent = this.tempCurrent;

    for (let p=0; p<this.poleCount; ++p) {
      if (this.i_position === 2)
        this.switchCurrent[p] = 0;
      else
        this.switchCurrent[p] = (this.volts[this.nSwitch0 + (p * 3)] - this.volts[this.nSwitch1 + (p * 3) + this.i_position]) / this.r_on;
    }
  }

  getConnection(n1, n2) {
    return Math.floor(n1 / 3) === Math.floor(n2 / 3);
  }

  nonLinear() {
    return true;
  }
}

RelayElm.initClass();

module.exports = RelayElm;
