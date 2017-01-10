let CircuitComponent = require("../circuitComponent.js");
let DiodeElm = require("./DiodeElm.js");
let Util = require('../../util/util.js');
let Settings = require('../../settings/settings.js');

class LedElm extends DiodeElm {
  static get Fields() {
    return Util.extend(DiodeElm.Fields, {
      colorR: {
        name: "Red Intensity",
        data_type: parseFloat,
        default_value: 0
      },
      colorG: {
        name: "Green Intensity",
        data_type: parseFloat,
        default_value: 0
      },
      colorB: {
        name: "Blue Intensity",
        data_type: parseFloat,
        default_value: 0
      }
      //    fwdrop: {
      //      name: "Voltage drop"
      //      data_type: parseFloat
      //      default_value: DiodeElm.DEFAULT_DROP
      //    }
    });
  }


  constructor(xa, xb, ya, yb, params, f) {
    super(xa, xb, ya, yb, params, f);
    // TODO: CHECK!
    // this.params = {};

    //    if (f & DiodeElm.FLAG_FWDROP) == 0
    //      @fwdrop = 2.1024259

    if ((f & DiodeElm.FLAG_FWDROP) === 0) {
      this.fwdrop = 2.1024259;  //DiodeElm.DEFAULT_DROP
      this.params['fwdrop'] = 0.805904783;
    } else {
      this.fwdrop = parseFloat(params.shift());
      this.params['fwdrop'] = this.fwdrop;
    }

    this.setPoints();
  }

  getName() {
    return "LED";
  }

  getDumpType() {
    return "162";
  }

  setPoints() {
    super.setPoints(...arguments);

    let cr = 12;
    this.ledLead1 = Util.interpolate(this.point1, this.point2, 0.5 - (cr / this.dn()));
    this.ledLead2 = Util.interpolate(this.point1, this.point2, 0.5 + (cr / this.dn()));
    return this.ledCenter = Util.interpolate(this.point1, this.point2, 0.5);
  }

  needsShortcut() {
    return false;
  }

  draw(renderContext) {
    let voltageColor = Util.getVoltageColor(this.volts[0]);
    renderContext.drawLinePt(this.point1, this.ledLead1, voltageColor);

    voltageColor = Util.getVoltageColor(this.volts[0]);
    renderContext.drawLinePt(this.ledLead2, this.point2, voltageColor);

    let cr = 12;

    renderContext.drawCircle(this.ledCenter.x, this.ledCenter.y, cr, 2, Settings.PostColor);

    cr -= 4;

    let w = Math.min((255 * this.current) / .01, 255);

//    g.fillOval(ledCenter.x - cr, ledCenter.y - cr, cr * 2, cr * 2);
    //console.log(@current, w)
    //console.log("RBG: #{w * @colorR} #{w * @colorG} #{w * @colorB}")
    let hexcolor = Util.rgb2hex(w * this.colorR, w * this.colorG, w * this.colorB);

    renderContext.fillCircle(this.ledCenter.x, this.ledCenter.y, cr, 2, hexcolor);

    this.updateDots();
    renderContext.drawDots(this.point1, this.ledLead1, this.curcount);
    renderContext.drawDots(this.point2, this.ledLead2, -this.curcount);

    return renderContext.drawPosts(this);
  }
}
LedElm.initClass();


module.exports = LedElm;
