let CircuitComponent = require('./CircuitComponent.js');

let Polygon = require('../geom/Polygon.js');
let Rectangle = require('../geom/Rectangle.js');
let Point = require('../geom/Point.js');
let Util = require('../util/Util.js');

class SwitchElm extends CircuitComponent {
  static get Fields() {
    return {
      "position": {
        title: "Position",
        default_value: 0,
        data_type(str){
          str = str.toString();
  
          if (str === 'true') {
            return 1;
          } else if (str === 'false') {
            return 0;
          } else {
            return parseInt(str);
          }
        },
        field_type: "select",
        select_values: {"ON": 1, "OFF": 0}
      },
      "momentary": {
        title: "Momentary",
        default_value: false,
        data_type(str) { return str.toString() === 'true'; },
        field_type: "boolean"
      }
    };
  }

  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);
    
    this.momentary = false;
    this.position = 0;
    this.posCount = 2;

    this.ps = new Point(0, 0);
    this.ps2 = new Point(0, 0);

    this.place()
  }

  place() {
    //super.setPoints(...arguments);

    this.calcLeads(32);
    this.ps = new Point(0, 0);
    this.ps2 = new Point(0, 0);

    this.openhs = 16;
    this.setBboxPt(this.point1, this.point2, this.openhs/2);
  }

  stamp(stamper) {
//    console.log(@voltSource)
    if (this.position === 0) {
      return stamper.stampVoltageSource(this.nodes[0], this.nodes[1], this.voltSource, 0);
    }
  }

  draw(renderContext, Settings) {
    this.calcLeads(32);
    //this.setBboxPt(this.point1, this.point2, this.openhs/2);

    renderContext.drawLeads(this);

    this.updateDots();
    if (this.position === 0)
      renderContext.drawDots(this.point1, this.point2, this);

    // Draw switch "Lever"
    let baseOffset = (this.position === 1) ? 0 : 2;
    let armOffset = (this.position === 1) ? this.openhs : 2;

    this.ps = Util.interpolate(this.lead1, this.lead2, -0.05, baseOffset);
    this.ps2 = Util.interpolate(this.lead1, this.lead2, 1.05, armOffset);

    renderContext.drawLinePt(this.ps, this.ps2, Settings.SWITCH_COLOR, Settings.LINE_WIDTH + 1);
    renderContext.drawCircle(this.lead2.x, this.lead2.y, Settings.POST_RADIUS, 1, Settings.STROKE_COLOR);
    renderContext.drawCircle(this.lead1.x, this.lead1.y, Settings.POST_RADIUS, 1, Settings.STROKE_COLOR);


    renderContext.drawPosts(this);

    if (this.Circuit && this.Circuit.debugModeEnabled())
      super.debugdraw(renderContext, Settings);
  }

  static get NAME() {
    return "Basic Switch";
  }

  calculateCurrent() {
    if (this.position === 1) { return this.current = 0; }
  }

  numVoltageSources() {
    if (this.position === 1) { return 0; } else { return 1; }
  }

  mouseUp() {
    if (this.momentary) { return this.toggle(); }
  }

  toggle() {
    console.log(`Toggling...${this}`);

    this.params['position']++;
    this.position++;
    if (this.position >= this.posCount) {
      this.params['position'] = 0;
      this.position = 0;
    }
    
    this.Circuit.Solver.analyzeFlag = true;
  }

  getInfo(arr) {
    arr[0] = ((this.momentary) ? "push switch (SPST)" : "switch (SPST)");
    if (this.position === 1) {
      arr[1] = "open";
      return arr[2] = `Vd = ${Util.getUnitText(this.getVoltageDiff(), "V")}`;
    } else {
      arr[1] = "closed";
      arr[2] = `V = ${Util.getUnitText(this.volts[0], "V")}`;
      return arr[3] = `I = ${Util.getUnitText(this.getCurrent(), "A")}`;
    }
  }

  getConnection(n1, n2) {
    return this.position === 0;
  }

  onClick() {
    return toggle();
  }

  isWire() {
    return true;
  }
}

module.exports = SwitchElm;
