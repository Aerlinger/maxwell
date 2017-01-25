let CircuitComponent = require('../circuitComponent.js');
let Settings = require('../../settings/settings.js');
let Polygon = require('../../geom/polygon.js');
let Rectangle = require('../../geom/rectangle.js');
let Point = require('../../geom/point.js');
let Util = require('../../util/util.js');
let GateElm = require('./GateElm.js');

class WireElm extends CircuitComponent {
  static initClass() {
    this.FLAG_SHOWCURRENT = 1;
    this.FLAG_SHOWVOLTAGE = 2;
  }

  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);
  }

  getName() {
    return "Wire";
  }

  draw(renderContext) {
    let s;
    renderContext.drawLinePt(this.point1, this.point2, renderContext.getVoltageColor(this.volts[0]));
    //  @setBboxPt @point1, @point2, 3

    if (this.mustShowCurrent()) {
      s = Util.getUnitText(Math.abs(this.getCurrent()), "A");
    } else if (this.mustShowVoltage()) {
      s = Util.getUnitText(this.volts[0], "V");
    }

    this.updateDots();
    renderContext.drawDots(this.point1, this.point2, this);

    if (Settings.WIRE_POSTS)
      renderContext.drawPosts(this);

    if (this.Circuit.debugModeEnabled()) {
      return super.debugDraw(renderContext);
    }
  }


  stamp(stamper) {
//    console.log("\n::Stamping WireElm::")
    return stamper.stampVoltageSource(this.nodes[0], this.nodes[1], this.voltSource, 0);
  }

  mustShowCurrent() {
    return (this.flags & WireElm.FLAG_SHOWCURRENT) !== 0;
  }

  mustShowVoltage() {
    return (this.flags & WireElm.FLAG_SHOWVOLTAGE) !== 0;
  }

  getVoltageSourceCount() {
    return 1;
  }

  getInfo(arr) {
    super.getInfo();

    arr[0] = "Wire";
    arr[1] = `I = ${Util.getUnitText(this.getCurrent(), "A")}`;
    return arr[2] = `V = ${Util.getUnitText(this.volts[0], "V")}`;
  }

  getPower() {
    return 0;
  }

  getVoltageDiff() {
    return this.volts[0];
  }

  isWire() {
    return true;
  }

  needsShortcut() {
    return true;
  }
}
WireElm.initClass();

module.exports = WireElm;
