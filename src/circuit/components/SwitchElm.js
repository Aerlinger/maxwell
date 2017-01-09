let CircuitComponent = require('../circuitComponent.js');
let Settings = require('../../settings/settings.js');
let Polygon = require('../../geom/polygon.js');
let Rectangle = require('../../geom/rectangle.js');
let Point = require('../../geom/point.js');
let Util = require('../../util/util.js');

class SwitchElm extends CircuitComponent {
  static initClass() {
  
    this.Fields = {
      "position": {
        name: "Position",
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
        field_type: "boolean"
      },
      "momentary": {
        name: "Momentary",
        default_value: 0,
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

//    if params
//      params = params.split(" ")  if typeof params is "string"
//      str = params.shift()
//      @position = 0
//        if str is "true"
//          @position = (if (this instanceof LogicInputElm) then 0 else 1)
//        else if str is "false"
//          @position = (if (this instanceof LogicInputElm) then 1 else 0)
//        else
//          @position = parseInt(str)
//          @momentary = (st.shift().toLowerCase() is "true")

  }


  setPoints() {
    super.setPoints(...arguments);

    this.calcLeads(32);
    this.ps = new Point(0, 0);
    this.ps2 = new Point(0, 0);

    let openhs = 16;
    return this.setBboxPt(this.point1, this.point2, openhs);
  }

  getDumpType() {
    return "s";
  }

  stamp(stamper) {
//    console.log(@voltSource)
    if (this.position === 0) {
      return stamper.stampVoltageSource(this.nodes[0], this.nodes[1], this.voltSource, 0);
    }
  }

  draw(renderContext) {
    this.calcLeads(32);
    this.ps = new Point(0, 0);
    this.ps2 = new Point(0, 0);

    let openhs = 16;
    let hs1 = ((this.position === 1) ? 0 : 2);
    let hs2 = ((this.position === 1) ? openhs : 2);

    renderContext.drawLeads(this);

    if (this.position === 0) {
      renderContext.drawDots(this.point1, this.point2, this);
    }

    this.ps = Util.interpolate(this.lead1, this.lead2, 0, hs1);
    this.ps2 = Util.interpolate(this.lead1, this.lead2, 1, hs2);

    renderContext.drawLinePt(this.ps, this.ps2);

    renderContext.drawPosts(this);

    if (CircuitComponent.DEBUG) {
      return super.draw(renderContext);
    }
  }

  getName() {
    return "Basic Switch";
  }

  calculateCurrent() {
    if (this.position === 1) { return this.current = 0; }
  }

  getVoltageSourceCount() {
    if (this.position === 1) { return 0; } else { return 1; }
  }

  mouseUp() {
    if (this.momentary) { return this.toggle(); }
  }

  toggle() {
    console.log(`Toggling...${this}`);
    this.position++;
    if (this.position >= this.posCount) { this.position = 0; }
    return this.Circuit.Solver.analyzeFlag = true;
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
SwitchElm.initClass();

module.exports = SwitchElm;
