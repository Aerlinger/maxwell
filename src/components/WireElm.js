let CircuitComponent = require('./CircuitComponent.js');

let Rectangle = require('../geom/Rectangle.js');
let Util = require('../util/Util.js');
let GateElm = require('./GateElm.js');

class WireElm extends CircuitComponent {
  static initClass() {
    this.FLAG_SHOWCURRENT = 1;
    this.FLAG_SHOWVOLTAGE = 2;
  }

  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);
  }

  static get NAME() {
    return "Wire";
  }

  draw(renderContext, Settings) {
    let s;
    renderContext.drawLinePt(this.point1, this.point2, renderContext.getVoltageColor(this.volts[0]));

    if (this.mustShowCurrent()) {
      s = Util.getUnitText(Math.abs(this.getCurrent()), "A");
    } else if (this.mustShowVoltage()) {
      s = Util.getUnitText(this.volts[0], "V");
    }

    this.updateDots();
    renderContext.drawDots(this.point1, this.point2, this);

    if (Settings.WIRE_POSTS)
      renderContext.drawPosts(this);

    if (this.Circuit && this.Circuit.debugModeEnabled())
      return super.debugdraw(renderContext, Settings);
  }

  stamp(stamper) {
    return stamper.stampVoltageSource(this.nodes[0], this.nodes[1], this.voltSource, 0);
  }

  mustShowCurrent() {
    return (this.flags & WireElm.FLAG_SHOWCURRENT) !== 0;
  }

  mustShowVoltage() {
    return (this.flags & WireElm.FLAG_SHOWVOLTAGE) !== 0;
  }

  numVoltageSources() {
    return 1;
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
