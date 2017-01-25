let CircuitComponent = require('../circuitComponent.js');
let Settings = require('../../settings/settings.js');
let Polygon = require('../../geom/polygon.js');
let Rectangle = require('../../geom/rectangle.js');
let Point = require('../../geom/point.js');
let Util = require('../../util/util.js');

class SparkGapElm extends CircuitComponent {
  static get Fields() {
    return {
      "onresistance": {
        name: "Resistance",
        unit: "Ohms",
        default_value: 1e3,
        symbol: "Ω",
        data_type: parseFloat,
        range: [0, Infinity],
        type: "physical"
      },
      "offresistance": {
        name: "Resistance",
        unit: "Ohms",
        default_value: 1e9,
        symbol: "Ω",
        data_type: parseFloat,
        range: [0, Infinity],
        type: "physical"
      },
      "breakdown": {
        name: "Voltage",
        unit: "Voltage",
        symbol: "V",
        default_value: 1e3,
        data_type: parseFloat,
        range: [-Infinity, Infinity],
        type: "physical"
      },
      "holdcurrent": {
        unit: "Amperes",
        name: "Current",
        symbol: "A",
        default_value: 0.001,
        data_type: parseFloat,
        range: [-Infinity, Infinity],
        type: "physical"
      },
    };
  }

  getName() {
    return "Spark Gap"
  }


  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);

    this.resistance = 0;
    this.offresistance = 1e9;
    this.onresistance = 1e3;
    this.breakdown = 1e3;
    this.holdcurrent = 0.001;
    this.state = false;
  }

  setPoints() {
    super.setPoints(...arguments);

    let dist = 16;
    let alen = 8;

    this.calcLeads(dist + alen);

    let p1 = Util.interpolate(this.point1, this.point2, (this.dn() - alen) / (2 * this.dn()));
    this.arrow1 = Util.calcArrow(this.point1, p1, alen, alen);

    p1 = Util.interpolate(this.point1, this.point2, (this.dn() + alen) / (2 * this.dn()));
    this.arrow2 = Util.calcArrow(this.point2, p1, alen, alen);

    return this.setBboxPt(this.point1, this.point2, 8);
  }


//    if st
//      st = st.split(" ")  if typeof st is "string"
//      @onresistance = parseFloat(st?.shift())  if st
//      @offresistance = parseFloat(st?.shift())  if st
//      @breakdown = parseFloat(st?.shift())  if st
//      @holdcurrent = parseFloat(st?.shift())  if st

  nonLinear() {
    return true;
  }

//      p1 = DrawHelper.interpPoint(@point1, @point2, (@dn() - alen) / (2 * @dn()))
//      @arrow1 = DrawHelper.calcArrow(@point1, p1, alen, alen)
//      p1 = DrawHelper.interpPoint(@point1, @point2, (@dn() + alen) / (2 * @dn()))
//      @arrow2 = DrawHelper.calcArrow(@point2, p1, alen, alen)

  draw(renderContext) {
    if (this.Circuit.debugModeEnabled()) {
      super.debugDraw(renderContext);
    }

    this.updateDots();

    let dist = 16;
    let alen = 8;
    this.calcLeads(dist + alen);

    let v1 = this.volts[0];
    let v2 = this.volts[1];

    renderContext.drawLeads(this);

    let color = renderContext.getVoltageColor(this.volts[0]);
    renderContext.drawThickPolygonP(this.arrow1, color);

    color = renderContext.getVoltageColor(this.volts[1]);
    renderContext.drawThickPolygonP(this.arrow2, color);

    if (this.state) { renderContext.drawDots(this.point1, this.point2, this); }
    return renderContext.drawPosts(this);
  }

  calculateCurrent() {
    return this.current = (this.volts[0] - this.volts[1]) / this.resistance;
  }

  reset() {
    super.reset();
    return this.state = false;
  }

  startIteration() {
    if (Math.abs(this.current) < this.holdcurrent) { this.state = false; }
    let vd = this.volts[0] - this.volts[1];
    if (Math.abs(vd) > this.breakdown) { return this.state = true; }
  }

  doStep(stamper) {
    if (this.state) {
//      console.log("SPARK!")
      this.resistance = this.onresistance;
    } else {
      this.resistance = this.offresistance;
    }

    return stamper.stampResistor(this.nodes[0], this.nodes[1], this.resistance);
  }

  toString() {
    return "SparkGapElm";
  }

  stamp(stamper) {
    stamper.stampNonLinear(this.nodes[0]);
    return stamper.stampNonLinear(this.nodes[1]);
  }

  getInfo(arr) {
    arr[0] = "spark gap";
    this.getBasicInfo(arr);
    arr[3] = (this.state ? "on" : "off");
    arr[4] = `Ron = ${Util.getUnitText(this.onresistance, "Ω")}`;
    arr[5] = `Roff = ${Util.getUnitText(this.offresistance, "Ω")}`;
    return arr[6] = `Vbreakdown = ${Util.getUnitText(this.breakdown, "V")}`;
  }

  needsShortcut() {
    return false;
  }
}
SparkGapElm.initClass();

module.exports = SparkGapElm;
