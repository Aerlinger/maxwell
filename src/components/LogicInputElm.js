let CircuitComponent = require('./CircuitComponent');
let SwitchElm = require("./SwitchElm.js");
let Util = require('../util/Util');


class LogicInputElm extends SwitchElm {
  static initClass() {
    this.prototype.FLAG_TERNARY = 1;
    this.prototype.FLAG_NUMERIC = 2;
  }

  static get Fields() {
    return {
      "position": {
        title: "Position",
        default_value: 0,
        data_type(str){
          str = str.toString();
  
          if (str === 'true') {
            return 0;
          } else if (str === 'false') {
            return 1;
          } else {
            return parseInt(str);
          }
        },
        field_type: "boolean"
      },
      "momentary": {
        title: "Momentary",
        default_value: 0,
        data_type(str) { return str.toString() === 'true'; },
        field_type: "boolean"
      },
      hiV: {
        title: "Voltage High",
        data_type: parseFloat,
        unit: "Voltage",
        symbol: "V",
        default_value: 5
      },
      loV: {
        title: "Voltage Low",
        data_type: parseFloat,
        unit: "Voltage",
        symbol: "V",
        default_value: 0
      }
    };
  }

  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);

    if (this.isTernary()) {
      this.posCount = 3;
    }
  }

  draw(renderContext) {
    let s = this.position === 0 ? "0" : "1";

    if (this.isNumeric()) {
      s = `${this.position}`;
    }

    renderContext.drawText(s, this.point2.x - 5, this.point2.y + 6, renderContext.TEXT_COLOR, 1.5*renderContext.TEXT_SIZE);

    let color = renderContext.getVoltageColor(this.volts[0]);
    renderContext.drawLinePt(this.point1, this.lead1, color);

    this.updateDots();
    renderContext.drawDots(this.point1, this.lead1, this);
    renderContext.drawPosts(this);

    if (this.Circuit && this.Circuit.debugModeEnabled()) {
      return super.debugdraw(renderContext);
    }
  }

  getName(){
    return "Input Logic"
  }

  isTernary() {
    return this.flags & (LogicInputElm.FLAG_TERNARY !== 0);
  }

  isNumeric() {
    return this.flags & ((LogicInputElm.FLAG_TERNARY | LogicInputElm.FLAG_NUMERIC) !== 0);
  }

  numPosts() {
    return 1;
  }

  setPoints() {
    super.setPoints(...arguments);

    return this.lead1 = Util.interpolate(this.point1, this.point2, 1 - (12 / this.dn()));
  }

  setCurrent(vs, c) {
    return this.current = -c;
  }

  stamp(stamper) {
    let v = this.position === 0 ? this.loV : this.hiV;

    if (this.isTernary()) {
      v = this.position * 2.5;
    }

    return stamper.stampVoltageSource(0, this.nodes[0], this.voltSource, v);
  }

  numVoltageSources() {
    return 1;
  }

  getVoltageDiff() {
    return this.volts[0];
  }

  hasGroundConnection(n1) {
    return true;
  }
}
LogicInputElm.initClass();

module.exports = LogicInputElm;

