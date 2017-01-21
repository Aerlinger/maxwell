let CircuitComponent = require('../circuitComponent.js');
let Settings = require('../../settings/settings.js');
let Polygon = require('../../geom/polygon.js');
let Rectangle = require('../../geom/rectangle.js');
let Point = require('../../geom/point.js');
let Util = require('../../util/util.js');

class OutputElm extends CircuitComponent {
  static initClass() {
  
    this.FLAG_VALUE = 1;
  }

  constructor(xa, ya, xb, yb, params, f) {
    // st not used for OutputElm
    super(xa, ya, xb, yb, params, f);
  }

  getPostCount() {
    return 1;
  }

  getName() {
    return "Output"
  }

  setPoints() {
    super.setPoints(...arguments);
    this.lead1 = new Point(0, 0);

    return this.setBboxPt(this.lead1, this.point1, 8);
  }

  draw(renderContext) {
    let color = "#FFF";
    let s = ((this.flags & OutputElm.FLAG_VALUE) !== 0 ? Util.getUnitText(this.volts[0], "V") : "out");

    this.lead1 = Util.interpolate(this.point1, this.point2, 1 - ((((3 * s.length) / 2) + 8) / this.dn()));

    renderContext.drawValue(-13, 35, this, s);

    color = Util.getVoltageColor(this.volts[0]);

    renderContext.drawLinePt(this.point1, this.lead1, color);
    renderContext.fillCircle(this.lead1.x + (2*Settings.POST_RADIUS), this.lead1.y, 2*Settings.POST_RADIUS, 1, Settings.FILL_COLOR, Settings.STROKE_COLOR);
    renderContext.drawPosts(this);

    if (CircuitComponent.DEBUG) {
      return super.draw(renderContext);
    }
  }


  getVoltageDiff() {
    return this.volts[0];
  }

  getInfo(arr) {
    arr[0] = "output";
    return arr[1] = `V = ${Util.getUnitText(this.volts[0], "V")}`;
  }

  stamp(stamper) {}

  toString() {
    return "OutputElm";
  }
}
OutputElm.initClass();

module.exports = OutputElm;
