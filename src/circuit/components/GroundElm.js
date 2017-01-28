let CircuitComponent = require('../circuitComponent.js');
let Settings = require('../../settings/settings.js');
let Polygon = require('../../geom/polygon.js');
let Rectangle = require('../../geom/rectangle.js');
let Point = require('../../geom/point.js');
let Util = require('../../util/util.js');

class GroundElm extends CircuitComponent {

  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);
  }

  getPostCount() {
    return 1;
  }

  getName() {
    return "Ground"
  }

  draw(renderContext) {
    this.updateDots();

    let color = renderContext.getVoltageColor(0);

    renderContext.drawLinePt(this.point1, this.point2, color);

    let pt2 = Util.interpolate(this.point1, this.point2, 1 + (11.0 / this.dn()));

    renderContext.drawDots(this.point1, this.point2, this);
    renderContext.drawPosts(this);

    for (let row = 0; row < 3; row++) {
      let pt1;
      let startPt = 6 - (row * 2);
      let endPt = row * 3;
      [pt1, pt2] = Util.interpolateSymmetrical(this.point1, this.point2, 1 + (endPt / this.dn()), startPt);
      renderContext.drawLinePt(pt1, pt2, color);
    }

    if (this.Circuit && this.Circuit.debugModeEnabled()) {
      return super.debugDraw(renderContext);
    }
  }

  setCurrent(x, currentVal) {
    return this.current = -currentVal;
  }

  stamp(stamper) {
//    console.log("\n::Stamping GroundElm::")
    return stamper.stampVoltageSource(0, this.nodes[0], this.voltSource, 0);
  }

  getVoltageDiff() {
    return 0;
  }

  getVoltageSourceCount() {
    return 1;
  }

  getInfo(arr) {
    super.getInfo();
    arr[0] = "ground";
    return arr[1] = `I = ${Util.getUnitText(this.getCurrent(), "A")}`;
  }

  hasGroundConnection(n1) {
    return true;
  }

  needsShortcut() {
    return true;
  }
}

module.exports = GroundElm;

