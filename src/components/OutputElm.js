let CircuitComponent = require('./CircuitComponent');

let Polygon = require('../geom/Polygon');
let Rectangle = require('../geom/Rectangle');
let Point = require('../geom/Point');
let Util = require('../util/Util');

class OutputElm extends CircuitComponent {
  static initClass() {
    this.FLAG_VALUE = 1;
  }

  constructor(xa, ya, xb, yb, params, f) {
    // st not used for OutputElm
    super(xa, ya, xb, yb, params, f);

    this.place()
  }

  numPosts() {
    return 1;
  }

  static get NAME() {
    return "Output Terminal"
  }

  place() {
    this.s = ((this.flags & OutputElm.FLAG_VALUE) !== 0 ? Util.getUnitText(this.volts[0], "V") : "out");
    this.lead1 = Util.interpolate(this.point1, this.point2, 1 - ((((3 * this.s.length) / 2) + 8) / this.dn()));

    this.setBboxPt(this.lead1, this.point1, 8);
  }

  draw(renderContext) {
    renderContext.drawValue(-13, 35, this, this.s, 1.5*renderContext.TEXT_SIZE);

    let color = renderContext.getVoltageColor(this.volts[0]);

    renderContext.drawLinePt(this.point1, this.lead1, color);
    renderContext.drawCircle(this.lead1.x, this.lead1.y, 2 * renderContext.POST_RADIUS, 1, renderContext.STROKE_COLOR, renderContext.FILL_COLOR);
    renderContext.drawPosts(this);

    if (this.Circuit && this.Circuit.debugModeEnabled()) {
      return super.debugdraw(renderContext);
    }
  }

  getVoltageDiff() {
    return this.volts[0];
  }

  stamp(stamper) {}
}
OutputElm.initClass();

module.exports = OutputElm;
