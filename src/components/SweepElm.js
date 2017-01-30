let CircuitComponent = require('./CircuitComponent.js');
let Settings = require('../settings/Settings.js');
let Polygon = require('../geom/Polygon.js');
let Rectangle = require('../geom/Rectangle.js');
let Point = require('../geom/Point.js');
let Util = require('../util/Util.js');

class SweepElm extends CircuitComponent {
  static initClass() {
    this.FLAG_LOG = 1;
    this.FLAG_BIDIR = 2;
    this.circleSize = 17;
  }

  static get Fields() {
    return {
      "minF": {
        name: "Min. Frequency",
        unit: "Hertz",
        default_value: 20,
        symbol: "Hz",
        data_type: parseFloat
      },
      "maxF": {
        name: "Min. Frequency",
        unit: "Hertz",
        default_value: 4e4,
        symbol: "Hz",
        data_type: parseFloat
      },
      "maxV": {
        name: "Voltage",
        unit: "Voltage",
        symbol: "V",
        default_value: 5,
        data_type: parseFloat
      },
      "sweepTime": {
        unit: "seconds",
        name: "Time",
        symbol: "s",
        default_value: 0.1,
        data_type: parseFloat,
        range: [0, Infinity]
      }
    };
  }

  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);

    this.dir = 1;
  }

  getName() {
    return "Frequency Sweep"
  }

  onSolder(circuit) {
    return this.reset();
  }

  getPostCount() {
    return 1;
  }

  draw(renderContext) {
    if (this.Circuit && this.Circuit.debugModeEnabled()) {
      super.debugDraw(renderContext);
    }

    let color = renderContext.getVoltageColor(this.volts[0]);
    this.lead1 = Util.interpolate(this.point1, this.point2, 1 - (SweepElm.circleSize / this.dn()));

    renderContext.drawLinePt(this.point1, this.lead1, color);
    this.updateDots();
    renderContext.drawDots(this.point2, this.point1, this);

//    @setVoltageColor (if @needsHighlight() then CircuitComponent.selectColor else Color.GREY)
//    @setVoltageColor(Color.GREY)
//    powerColor = @setPowerColor(false)

    let xc = this.point2.x;
    let yc = this.point2.y;

    renderContext.fillCircle(xc, yc, SweepElm.circleSize, 2, Settings.FG_COLOR);
    renderContext.drawCircle(xc, yc, SweepElm.circleSize, 2, "#000000");

    let wl = 8;

//    @adjustBbox xc - SweepElm.circleSize, yc - SweepElm.circleSize, xc + SweepElm.circleSize, yc + SweepElm.circleSize

    let xl = 10;
    let ox = -1;
    let oy = -1;
    let tm = (new Date()).getTime(); //System.currentTimeMillis()
    //double w = (this == mouseElm ? 3 : 2)

    tm %= 2000;
    if (tm > 1000) {
      tm = 2000 - tm;
    }

//    if Circuit.stoppedCheck
//      w = 1 + tm * .002
//    else
    let w = 1 + ((2 * (this.frequency - this.minF)) / (this.maxF - this.minF));

    let i = -xl;

    while (i <= xl) {
      let yy = yc + Math.floor(.95 * Math.sin((i * Math.PI * w) / xl) * wl);

      if (ox !== -1) {
        renderContext.drawLine(ox, oy, xc + i, yy);
      }

      ox = xc + i;
      oy = yy;
      i++;
    }

//    if Circuit.showValuesCheckItem
//      s = renderContext.getShortUnitText(@frequency, "Hz")
//      if @axisAligned()
//        @drawValues s, @circleSize

    return renderContext.drawPosts(this);
  }

  stamp(stamper) {
    return stamper.stampVoltageSource(0, this.nodes[0], this.voltSource);
  }

  setPoints() {
    super.setPoints(...arguments);
    return Util.interpolate(this.point1, this.point2, 1 - (SweepElm.circleSize / this.dn()));
  }

  setParams() {
    if ((this.frequency < this.minF) || (this.frequency > this.maxF)) {
      this.frequency = this.minF;
      this.freqTime = 0;
      this.dir = 1;
    }

    if ((this.flags & SweepElm.FLAG_LOG) === 0) {
      this.fadd = (this.dir * this.getParentCircuit().timeStep() * (this.maxF - this.minF)) / this.sweepTime;
      this.fmul = 1;
    } else {
      this.fadd = 0;
      this.fmul = Math.pow(this.maxF / this.minF, (this.dir * this.getParentCircuit().timeStep()) / this.sweepTime);
    }

    return this.savedTimeStep = this.getParentCircuit().timeStep();
  }

  reset() {
    this.frequency = this.minF;
    this.freqTime = 0;
    this.dir = 1;
    return this.setParams();
  }

  startIteration() {
    // has timestep been changed?
    if (this.getParentCircuit().timeStep() !== this.savedTimeStep) {
      this.setParams();
    }

    this.v = Math.sin(this.freqTime) * this.maxV;

    this.freqTime += this.frequency * 2 * Math.PI * this.getParentCircuit().timeStep();
    this.frequency = (this.frequency * this.fmul) + this.fadd;
    if ((this.frequency >= this.maxF) && (this.dir === 1)) {
      if ((this.flags & SweepElm.FLAG_BIDIR) !== 0) {
        this.fadd = -this.fadd;
        this.fmul = 1 / this.fmul;
        this.dir = -1;
      } else {
        this.frequency = this.minF;
      }
    }
    if ((this.frequency <= this.minF) && (this.dir === -1)) {
      this.fadd = -this.fadd;
      this.fmul = 1 / this.fmul;
      return this.dir = 1;
    }
  }

  doStep(stamper) {
    return stamper.updateVoltageSource(0, this.nodes[0], this.voltSource, this.v);
  }

  getVoltageDiff() {
    return this.volts[0];
  }

  getVoltageSourceCount() {
    return 1;
  }

  hasGroundConnection(n1) {
    return true;
  }

  getInfo(arr) {
    arr[0] = `sweep ${((this.flags & SweepElm.FLAG_LOG) === 0) ? "(linear)" : "(log)"}`;
    arr[1] = `I = ${Util.getUnitText(this.getCurrent(), "A")}`;
    arr[2] = `V = ${Util.getUnitText(this.volts[0], "V")}`;
    arr[3] = `f = ${Util.getUnitText(this.frequency, "Hz")}`;
    arr[4] = `range = ${Util.getUnitText(this.minF, "Hz")} .. ${Util.getUnitText(this.maxF, "Hz")}`;
    return arr[5] = `time = ${Util.getUnitText(this.sweepTime, "s")}`;
  }
}
SweepElm.initClass();

module.exports = SweepElm;
