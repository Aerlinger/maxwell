let CircuitComponent = require('../circuitComponent.js');
let Settings = require('../../settings/settings.js');
let Polygon = require('../../geom/polygon.js');
let Rectangle = require('../../geom/rectangle.js');
let Point = require('../../geom/point.js');
let Util = require('../../util/util.js');
//Maxwell = require('../../Maxwell.js')

class ResistorElm extends CircuitComponent {
  static get Fields() {
    return {
      "resistance": {
        name: "Resistance",
        unit: "Ohms",
        default_value: 1000,
        symbol: "Ω",
        data_type: parseFloat,
        range: [0, Infinity],
        type: "physical"
      }
    };
  }

  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);
  }

  value() {
    return this.resistance;
  }

  draw(renderContext) {
    this.calcLeads(32);

    let numSegments = 16;
    let width = 5;

//    @setBboxPt @point1, @point2, width

    renderContext.drawLeads(this);

    let parallelOffset = 1 / numSegments;

    this.updateDots();
    renderContext.drawDots(this.point1, this.lead1, this);
    renderContext.drawDots(this.lead2, this.point2, this);

    // Generate alternating sequence 0, 1, 0, -1, 0 ... to offset perpendicular to wire
    let offsets = [0, 1, 0, -1];
    
    // Draw resistor "zig-zags"
    for (let n = 0; n < numSegments; n++) {
      let resistorSegmentVoltage = this.volts[0] + ((this.volts[1]-this.volts[0]) * (n / numSegments));

      let startPosition = Util.interpolate(this.lead1, this.lead2, n*parallelOffset, width*offsets[n % 4]);
      let endPosition = Util.interpolate(this.lead1, this.lead2, (n+1)*parallelOffset, width*offsets[(n+1) % 4]);

      renderContext.drawLinePt(startPosition, endPosition, Util.getVoltageColor(resistorSegmentVoltage), Settings.LINE_WIDTH);
    }

    renderContext.drawValue(14, 0, this, Util.getUnitText(this.resistance, this.unitSymbol()));

    renderContext.drawPosts(this);

    if (CircuitComponent.DEBUG) {
      return super.draw(renderContext);
    }
  }

  unitSymbol() {
    return "Ω";
  }
  
  getName() {
    "Resistor"
  }

  getDumpType() {
    return "r";
  }

  getInfo(arr) {
    arr[0] = "resistor";
    this.getBasicInfo(arr);
    arr[3] = `R = ${Util.getUnitText(this.resistance, this.unitSymbol())}`;
    arr[4] = `P = ${Util.getUnitText(this.getPower(), "W")}`;

    return arr;
  }

  needsShortcut() {
    return true;
  }

  calculateCurrent() {
    return this.current = (this.volts[0] - this.volts[1]) / this.resistance;
  }

  stamp(stamper) {
    if (this.orphaned()) {
      console.warn("attempting to stamp an orphaned resistor");
    }

    return stamper.stampResistor(this.nodes[0], this.nodes[1], this.resistance);
  }
}
ResistorElm.initClass();

module.exports = ResistorElm;
