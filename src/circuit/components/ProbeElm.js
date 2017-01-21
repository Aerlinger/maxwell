let CircuitComponent = require('../circuitComponent.js');
let Settings = require('../../settings/settings.js');
let Polygon = require('../../geom/polygon.js');
let Rectangle = require('../../geom/rectangle.js');
let Point = require('../../geom/point.js');
let Util = require('../../util/util.js');

class ProbeElm extends CircuitComponent {
  static initClass() {
  
    this.FLAG_SHOWVOLTAGE = 1;
  }

  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);
  }

  toString() {
    return "ProbeElm";
  }

  setPoints() {
    super.setPoints(...arguments);

    // swap points so that we subtract higher from lower
    if (this.point2.y < this.point1.y) {
      let x = this.point1;
      this.point1 = this.point2;
      this.point2 = x;
    }

    return this.center = this.getCenter();
  }

  getName() {
    return "Scope Probe"
  }

  draw(renderContext) {
    if (CircuitComponent.DEBUG) {
      super.draw(renderContext);
    }

    let hs = 8;
    this.setBboxPt(this.point1, this.point2, hs);
    //      selected = (@needsHighlight() or Circuit.plotYElm is this)

    //      if selected or Circuit.dragElm is this
    //        len = 16
    //      else
    let len = this.dn() - 32;

    this.calcLeads(Math.floor(len));

//    if @isSelected()
//      color = Settings.SELECT_COLOR
//    else
    let color = renderContext.getVoltageColor(this.volts[0]);

    renderContext.drawLinePt(this.point1, this.lead1, color);

//    if @isSelected()
//      color = Settings.SELECT_COLOR
//    else
    color = renderContext.getVoltageColor(this.volts[1]);

    renderContext.drawLinePt(this.lead2, this.point2, color);

    //      renderContext.setFont new Font("SansSerif", Font.BOLD, 14)

    //      renderContext.drawCenteredText("X", @center.x1, @center.y, color) if this is Circuit.plotXElm
    //      renderContext.drawCenteredText("Y", @center.x1, @center.y, color) if this is Circuit.plotYElm

    if (this.mustShowVoltage()) {
      let unit_text = Util.getUnitText(this.volts[0], "V");
    }
//      @drawValues unit_text, 4, renderContext

    return renderContext.drawPosts(this);
  }

  mustShowVoltage() {
    return (this.flags & ProbeElm.FLAG_SHOWVOLTAGE) !== 0;
  }

  getInfo(arr) {
    arr[0] = "scope probe";
    return arr[1] = `Vd = ${getUnitText(this.getVoltageDiff(), "V")}`;
  }

  stamp(stamper) {}

  getConnection(n1, n2) {
    return false;
  }
}
ProbeElm.initClass();


module.exports = ProbeElm;
