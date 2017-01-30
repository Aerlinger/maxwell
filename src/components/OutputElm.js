let CircuitComponent = require('./CircuitComponent.js');
let Settings = require('../settings/Settings.js');
let Polygon = require('../geom/Polygon.js');
let Rectangle = require('../geom/Rectangle.js');
let Point = require('../geom/Point.js');
let Util = require('../util/Util.js');

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

  getName() {
    return "Output"
  }

  place() {
    this.s = ((this.flags & OutputElm.FLAG_VALUE) !== 0 ? Util.getUnitText(this.volts[0], "V") : "out");
    this.lead1 = Util.interpolate(this.point1, this.point2, 1 - ((((3 * this.s.length) / 2) + 8) / this.dn()));

    this.setBboxPt(this.lead1, this.point1, 8);
  }

  draw(renderContext) {
    renderContext.drawValue(-13, 35, this, this.s, 1.5*Settings.TEXT_SIZE);

    let color = renderContext.getVoltageColor(this.volts[0]);

    renderContext.drawLinePt(this.point1, this.lead1, color);
    renderContext.fillCircle(this.lead1.x, this.lead1.y, 2*Settings.POST_RADIUS, 1, Settings.FILL_COLOR, Settings.STROKE_COLOR);
    renderContext.drawPosts(this);

    if (this.Circuit && this.Circuit.debugModeEnabled()) {
      return super.debugDraw(renderContext);
    }
  }

  getVoltageDiff() {
    return this.volts[0];
  }

  stamp(stamper) {}
}
OutputElm.initClass();

module.exports = OutputElm;
