let CircuitComponent = require("./CircuitComponent.js");
let AnalogSwitchElm = require("./AnalogSwitchElm.js");
let Util = require('../util/Util.js');
let Point = require('../geom/Point.js');
let Settings = require('../Settings.js');

class AnalogSwitch2Elm extends AnalogSwitchElm {

  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);
    this.openhs = 16;
  }

  setPoints() {
    super.setPoints(...arguments);

    this.calcLeads(32);

    this.swposts = Util.newPointArray(2);
    this.swpoles = Util.newPointArray(2);

    [this.swpoles[0], this.swpoles[1]] = Util.interpolateSymmetrical(this.lead1, this.lead2, 1, this.openhs);
    [this.swposts[0], this.swposts[1]] = Util.interpolateSymmetrical(this.point1, this.point2, 1, this.openhs);

    this.ctlPoint = Util.interpolate(this.point1, this.point2, 0.5, this.openhs);

    this.setBboxPt(this.point1, this.point2, this.openhs);
  }

  numPosts() {
    return 4;
  }

  getPost(n) {
    if (n===0) {
      return this.point1;
    } else {
      if (n === 3) {
        return this.ctlPoint;
      } else {
        return this.swposts[n - 1];
      }
    }
  }

  draw(renderContext) {
    this.setBboxPt(this.point1, this.point2, this.openhs);

    let color = renderContext.getVoltageColor(this.volts[0]);
    renderContext.drawLinePt(this.point1, this.lead1, color);

    // draw second lead
    color = renderContext.getVoltageColor(this.volts[0]);
    renderContext.drawLinePt(this.swpoles[0], this.swposts[0], color);

    // draw third lead
    color = renderContext.getVoltageColor(this.volts[2]);
    renderContext.drawLinePt(this.swpoles[1], this.swposts[1], color);

    let position = this.open ? 1 : 0;
    // draw switch
    renderContext.drawLinePt(this.lead1, this.swpoles[position], Settings.SWITCH_COLOR, Settings.LINE_WIDTH + 1);

    this.updateDots();

    renderContext.drawDots(this.point1, this.lead1, this);
    renderContext.drawDots(this.swpoles[position], this.swposts[position], this);

    renderContext.drawCircle(this.lead1.x, this.lead1.y, 3, 0, Settings.LIGHT_POST_COLOR);
    renderContext.drawCircle(this.swpoles[1].x, this.swpoles[1].y, 3, 0, Settings.LIGHT_POST_COLOR);
    renderContext.drawCircle(this.swpoles[0].x, this.swpoles[0].y, 3, 0, Settings.LIGHT_POST_COLOR);

    renderContext.drawPosts(this);

    if (this.Circuit && this.Circuit.debugModeEnabled()) {
      return super.debugDraw(renderContext);
    }
  }

  calculateCurrent() {
    if (this.open) {
      return this.current = (this.volts[0] - this.volts[2]) / this.r_on;
    } else {
      return this.current = (this.volts[0] - this.volts[1]) / this.r_on;
    }
  }

  static get NAME() {
    return "Analog Switch (2-way)"
  }

  stamp(stamper) {
    stamper.stampNonLinear(this.nodes[0]);
    stamper.stampNonLinear(this.nodes[1]);
    return stamper.stampNonLinear(this.nodes[2]);
  }

  doStep(stamper) {
    this.open = this.volts[3] < 2.5;

    if ((this.flags & AnalogSwitch2Elm.FLAG_INVERT) !== 0) {
      this.open = !this.open;
    }

    if (this.open) {
      stamper.stampResistor(this.nodes[0], this.nodes[2], this.r_on);
      return stamper.stampResistor(this.nodes[0], this.nodes[1], this.r_off);
    } else {
      stamper.stampResistor(this.nodes[0], this.nodes[1], this.r_on);
      return stamper.stampResistor(this.nodes[0], this.nodes[2], this.r_off);
    }
  }

  getConnection(n1, n2) {
    if ((n1 === 3) || (n2 === 3)) {
      return false;
    }
    return true;
  }
}

module.exports = AnalogSwitch2Elm;
