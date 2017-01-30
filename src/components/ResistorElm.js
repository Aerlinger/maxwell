let CircuitComponent = require('./CircuitComponent.js');
let Settings = require('../settings/Settings.js');
let Polygon = require('../geom/Polygon.js');
let Rectangle = require('../geom/Rectangle.js');
let Point = require('../geom/Point.js');
let Util = require('../util/Util.js');
//Maxwell = require('../Maxwell.js')

class ResistorElm extends CircuitComponent {
  static get Fields() {
    return {
      "resistance": {
        name: "Resistance",
        description: "Amount of current per unit voltage applied to this resistor (ideal).",
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

    renderContext.drawLeads(this);

    this.updateDots();
    renderContext.drawDots(this.point1, this.lead1, this);
    renderContext.drawDots(this.lead2, this.point2, this);

    let context = renderContext.context;
    context.save();
    context.beginPath();

    context.moveTo(this.lead1.x, this.lead1.y);
    context.lineJoin = 'bevel';

    let grad = context.createLinearGradient(this.lead1.x, this.lead1.y, this.lead2.x, this.lead2.y);
    let voltColor0 = renderContext.getVoltageColor(this.volts[0]);
    let voltColor1 = renderContext.getVoltageColor(this.volts[1]);

    grad.addColorStop(0, voltColor0);
    grad.addColorStop(1, voltColor1);

    context.strokeStyle = grad;

    if (renderContext.boldLines) {
      context.lineWidth = Settings.BOLD_LINE_WIDTH;
      context.strokeStyle = Settings.SELECT_COLOR;
    } else {
      context.lineWidth = Settings.LINE_WIDTH + 1;
    }

    let numSegments = 8;
    let width = 5;
    let parallelOffset = 1 / numSegments;

    // Generate alternating sequence 0, 1, 0, -1, 0 ... to offset perpendicular to wire
    let offsets = [1, -1];

    let startPosition = Util.interpolate(this.lead1, this.lead2, parallelOffset/2, width);
    context.lineTo(startPosition.x + renderContext.lineShift, startPosition.y + renderContext.lineShift);

    // Draw resistor "zig-zags"
    for (let n = 1; n < numSegments; n++) {
      startPosition = Util.interpolate(this.lead1, this.lead2, n*parallelOffset + parallelOffset/2, width*offsets[n % 2]);

      context.lineTo(startPosition.x + renderContext.lineShift, startPosition.y + renderContext.lineShift);
    }

    context.lineTo(this.lead2.x + renderContext.lineShift, this.lead2.y + renderContext.lineShift);

    context.stroke();

    context.closePath();
    context.restore();

    renderContext.drawValue(10, 0, this, Util.getUnitText(this.resistance, this.unitSymbol(), Settings.COMPONENT_DECIMAL_PLACES));

    renderContext.drawPosts(this);

    if (this.Circuit && this.Circuit.debugModeEnabled()) {
      super.debugDraw(renderContext);
    }
  }

  unitSymbol() {
    return "Ω";
  }
  
  getName() {
    return "Resistor"
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
