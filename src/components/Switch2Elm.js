let CircuitComponent = require('./CircuitComponent.js');
let Settings = require('../Settings.js');
let Polygon = require('../geom/Polygon.js');
let Rectangle = require('../geom/Rectangle.js');
let Point = require('../geom/Point.js');
let SwitchElm = require('./SwitchElm.js');
let Util = require('../util/Util.js');

let _ = require("lodash");


// Broken
class Switch2Elm extends SwitchElm {
  static initClass() {

    this.FLAG_CENTER_OFF = 1;
  }

  static get Fields() {
    return Util.extend(SwitchElm.Fields, {
      "link": {
        name: "link",
        unit: "",
        default_value: 0,
        data_type: parseInt,
        range: [0, 2],
        field_type: "integer"
      }
    });
  }

  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);

    this.openhs = 16;
    this.noDiagonal = true;

    this.place()
  }

  static get NAME() {
    return "2-way switch"
  }

  place() {
    super.place();
    //super.setPoints(...arguments);
    // @calcLeads(32);

    this.swposts = Util.newPointArray(2);
    this.swpoles = Util.newPointArray(3);

    [this.swpoles[0], this.swpoles[1]] = Util.interpolateSymmetrical(this.lead1, this.lead2, 1, this.openhs);
    this.swpoles[2] = this.lead2;

    [this.swposts[0], this.swposts[1]] = Util.interpolateSymmetrical(this.point1, this.point2, 1, this.openhs);

    this.posCount = this.hasCenterOff() ? 3 : 2;

    this.setBboxPt(this.point1, this.point2, 2*this.openhs);
  }

  draw(renderContext) {
    this.calcLeads(32);

    this.swpoles = Util.newPointArray(3);
    this.swposts = Util.newPointArray(2);

    [this.swpoles[0], this.swpoles[1]] = Util.interpolateSymmetrical(this.lead1, this.lead2, 1, this.openhs);
    this.swpoles[2] = this.lead2;

    [this.swposts[0], this.swposts[1]] = Util.interpolateSymmetrical(this.point1, this.point2, 1, this.openhs);
    if (this.hasCenterOff()) {
      this.posCount = 3;
    } else {
      this.posCount = 2;
    }

    //this.setBboxPt(this.point1, this.point2, this.openhs);

    // draw first lead
    let color = renderContext.getVoltageColor(this.volts[0]);
    renderContext.drawLinePt(this.point1, this.lead1, color);

    // draw second lead
    color = renderContext.getVoltageColor(this.volts[1]);
    renderContext.drawLinePt(this.swpoles[0], this.swposts[0], color);

    // draw third lead
    color = renderContext.getVoltageColor(this.volts[2]);
    renderContext.drawLinePt(this.swpoles[1], this.swposts[1], color);

    this.updateDots();
    renderContext.drawDots(this.point1, this.lead1, this);

    if (this.position !== 2) {
      renderContext.drawDots(this.swpoles[this.position], this.swposts[this.position], this);
    }

    renderContext.drawPosts(this);

    // Switch lever
    renderContext.drawLinePt(this.lead1, this.swpoles[this.position], Settings.SWITCH_COLOR, Settings.LINE_WIDTH + 1);


    renderContext.drawCircle(this.lead1.x, this.lead1.y, Settings.POST_RADIUS, 1, Settings.STROKE_COLOR, Settings.FILL_COLOR);

    renderContext.drawCircle(this.swpoles[0].x, this.swpoles[0].y, Settings.POST_RADIUS, 1, Settings.STROKE_COLOR, Settings.FILL_COLOR);
    renderContext.drawCircle(this.swpoles[2].x, this.swpoles[2].y, Settings.POST_RADIUS, 1, Settings.POST_COLOR);
    renderContext.drawCircle(this.swpoles[1].x, this.swpoles[1].y, Settings.POST_RADIUS, 1, Settings.STROKE_COLOR, Settings.FILL_COLOR);


    if (this.Circuit && this.Circuit.debugModeEnabled()) {
      super.debugDraw(renderContext);
    }

  }

//    if this.Circuit && this.Circuit.debugModeEnabled()
//      super(renderContext)

  getPost(n) {
    if (n === 0) {
      return this.point1;
    } else {
      return this.swposts[n - 1];
    }
  }

  numPosts() {
    return 3;
  }

  calculateCurrent() {
    if (this.position === 2) { return this.current = 0; }
  }

  stamp(stamper) {
    // in center?
    if (this.position === 2) {
      return;
    }
    return stamper.stampVoltageSource(this.nodes[0], this.nodes[this.position + 1], this.voltSource, 0);
  }

  numVoltageSources() {
    if (this.position === 2) { return 0; } else { return 1; }
  }

  toggle() {
    super.toggle();

    if (this.link !== 0) {
      this.getParentCircuit().eachComponent(function(component) {
        if (component instanceof Switch2Elm) {
          let s2 = component;
          if (s2.link === self.link) {
            s2.position = self.position;
          }
        }
      });
    }
  }

  getConnection(n1, n2) {
    if (this.position === 2) {
      return false;
    }
    return Util.comparePair(n1, n2, 0, 1 + this.position);
  }

  hasCenterOff() {
    return (this.flags & Switch2Elm.FLAG_CENTER_OFF) !== 0;
  }
}
Switch2Elm.initClass();

module.exports = Switch2Elm;
