let CircuitComponent = require('./circuitComponent.js');
let Settings = require('../settings/settings.js');
let Polygon = require('../geom/polygon.js');
let Rectangle = require('../geom/rectangle.js');
let Point = require('../geom/point.js');
let Util = require('../util/util.js');

class CurrentElm extends CircuitComponent {
  static get Fields() {
    return {
      "currentValue": {
        unit: "Amperes",
        name: "Current",
        symbol: "A",
        default_value: 0.01,
        data_type: parseFloat,
        range: [-Infinity, Infinity],
        type: "physical"
      }
    };
  }

  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);
  }

  draw(renderContext) {
    if (this.Circuit && this.Circuit.debugModeEnabled()) {
      super.debugDraw(renderContext);
    }

    this.calcLeads(26);

    this.ashaft1 = Util.interpolate(this.lead1, this.lead2, .25);
    this.ashaft2 = Util.interpolate(this.lead1, this.lead2, .6);
    this.center = Util.interpolate(this.lead1, this.lead2, .5);

    let p2 = Util.interpolate(this.lead1, this.lead2, .75);

    this.arrow = Util.calcArrow(this.center, p2, 4, 4);

    this.updateDots();
    renderContext.drawLeads(this);
    renderContext.drawDots(this.point1, this.lead1, this);
    renderContext.drawDots(this.lead2, this.point2, this);

    let cr = 12;
    let color = renderContext.getVoltageColor((this.volts[0] + this.volts[1]) / 2);
//      @setPowerColor false
    renderContext.drawCircle(this.center.x, this.center.y, cr);
    renderContext.fillCircle(this.center.x, this.center.y, cr, Settings.LINE_WIDTH, Settings.FG_COLOR);
    renderContext.drawLinePt(this.ashaft1, this.ashaft2);
    renderContext.drawThickPolygonP(this.arrow, Settings.STROKE_COLOR, Settings.STROKE_COLOR);

//      if Circuit.showValuesCheckItem
//        s = DrawHelper.getShortUnitText(@currentValue, "A")
//        @drawValues s, cr  if @dx() is 0 or @dy() is 0

    renderContext.drawValue(20, 0, this, this.params.currentValue + "A");

    return renderContext.drawPosts(this);
  }

  getName() {
    return "Current Source"
  }

  stamp(stamper) {
    this.current = this.currentValue;
    return stamper.stampCurrentSource(this.nodes[0], this.nodes[1], this.current);
  }

  getVoltageDiff() {
    return this.volts[1] - this.volts[0];
  }
}

module.exports = CurrentElm;
