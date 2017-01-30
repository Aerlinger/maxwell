let CircuitComponent = require('./CircuitComponent.js');
let Settings = require('../Settings.js');
let Polygon = require('../geom/Polygon.js');
let Rectangle = require('../geom/Rectangle.js');
let Point = require('../geom/Point.js');
let Util = require('../util/Util.js');

class DiodeElm extends CircuitComponent {
  static initClass() {
  
    this.FLAG_FWDROP = 1;
    this.DEFAULT_DROP = 0.805904783;
  }

  static get Fields() {
    return {
      fwdrop: {
        name: "Voltage Drop",
        unit: "Voltage",
        symbol: "V",
        default_value: DiodeElm.DEFAULT_DROP,
        data_type: parseFloat
      }
    }
  }

  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);

    this.hs = 8;
    this.poly;
    this.cathode = [];

//    @fwdrop = DiodeElm.DEFAULT_DROP
    this.zvoltage = 0;

    this.nodes = new Array(2);
    this.vt = 0;
    this.vdcoef = 0;
    this.zvoltage = 0;
    this.zoffset = 0;
    this.lastvoltdiff = 0;
    this.crit = 0;
    this.leakage = 1e-14;

    this.setBboxPt(this.point1, this.point2, this.hs);

    this.setup();
  }

  nonLinear() {
    return true;
  }

  setup() {
    this.vdcoef = Math.log((1 / this.leakage) + 1) / this.fwdrop;
    this.vt = 1 / this.vdcoef;

    // critical voltage for limiting; current is vt/sqrt(2) at this voltage
    this.vcrit = this.vt * Math.log(this.vt / (Math.sqrt(2) * this.leakage));

    if (this.zvoltage === 0) {
      return this.zoffset = 0;
    } else {
    // calculate offset which will give us 5mA at zvoltage
      let i = -.005;
      return this.zoffset = this.zvoltage - (Math.log(-(1 + (i / this.leakage))) / this.vdcoef);
    }
  }

  draw(renderContext) {
    this.calcLeads(16);

    this.cathode = Util.newPointArray(2);
    let [pa, pb] = Util.interpolateSymmetrical(this.lead1, this.lead2, 0, this.hs);
    [this.cathode[0], this.cathode[1]] = Util.interpolateSymmetrical(this.lead1, this.lead2, 1, this.hs);
    this.poly = Util.createPolygonFromArray([pa, pb, this.lead2]);

    this.drawDiode(renderContext);

    this.updateDots();
    renderContext.drawDots(this.point1, this.point2, this);

    renderContext.drawPosts(this);

    if (this.Circuit && this.Circuit.debugModeEnabled()) {
      return super.debugDraw(renderContext);
    }
  }

  static get NAME() {
    return "Diode"
  }

  reset() {
    this.lastvoltdiff = 0;
    return this.volts[0] = this.volts[1] = this.curcount = 0;
  }

  drawDiode(renderContext) {

    let v1 = this.volts[0];
    let v2 = this.volts[1];

    renderContext.drawLeads(this);

    // TODO: RENDER DIODE

    // draw arrow
    //this.setPowerColor(true);
    let color = renderContext.getVoltageColor(v1);
    renderContext.drawPolygon(this.poly, color);

    //g.fillPolygon(poly);

    // draw the diode plate
    color = renderContext.getVoltageColor(v2);
    return renderContext.drawLinePt(this.cathode[0], this.cathode[1], color);
  }

  stamp(stamper) {
    stamper.stampNonLinear(this.nodes[0]);
    return stamper.stampNonLinear(this.nodes[1]);
  }

  doStep(stamper) {
    let geq, nc;
    let voltdiff = this.volts[0] - this.volts[1];

//    console.log("delta v: " + Math.abs(voltdiff - @lastvoltdiff));

    // used to have .1 here, but needed .01 for peak detector
    if (Math.abs(voltdiff - this.lastvoltdiff) > .01) {
      //console.log("CONVERGE FAIL!")
      this.Circuit.Solver.converged = false;
    }

    voltdiff = this.limitStep(voltdiff, this.lastvoltdiff);

    this.lastvoltdiff = voltdiff;

    if ((voltdiff >= 0) || (this.zvoltage === 0)) {
      // regular diode or forward-biased zener
      let eval_ = Math.exp(voltdiff * this.vdcoef);

      // make diode linear with negative voltages; aids convergence
      if (voltdiff < 0) { eval_ = 1; }
      geq = this.vdcoef * this.leakage * eval_;
      nc = ((eval_ - 1) * this.leakage) - (geq * voltdiff);

      // console.log("DIODE", this.fwdrop, this.vdcoef, this.leakage)

      stamper.stampConductance(this.nodes[0], this.nodes[1], geq);
      return stamper.stampCurrentSource(this.nodes[0], this.nodes[1], nc);

      //console.log("1 sim.stampConductance(" + @nodes[0] + ", " + @nodes[1] + ", " + geq + ", " + nc + " " + (eval_ - 1)  + " " + @leakage  + " " +  geq  + " " + voltdiff + " " + @vdcoef);
    } else {
      // Zener diode
      //* I(Vd) = Is * (exp[Vd*C] - exp[(-Vd-Vz)*C] - 1 )
      //*
      //* geq is I'(Vd)
      //* nc is I(Vd) + I'(Vd)*(-Vd)
      geq = this.leakage * this.vdcoef * (Math.exp(voltdiff * this.vdcoef) + Math.exp((-voltdiff - this.zoffset) * this.vdcoef));
      nc = (this.leakage * (Math.exp(voltdiff * this.vdcoef) - Math.exp((-voltdiff - this.zoffset) * this.vdcoef) - 1)) + (geq * (-voltdiff));

      stamper.stampConductance(this.nodes[0], this.nodes[1], geq);
      return stamper.stampCurrentSource(this.nodes[0], this.nodes[1], nc);
    }
  }

      //console.log("2 sim.stampConductance(" + @nodes[0] + ", " + @nodes[1] + ", " + geq + ", " + nc);

    //console.log("geq: ", geq)
    //console.log("nc: ", nc)

  calculateCurrent() {
    let voltdiff = this.volts[0] - this.volts[1];

    if ((voltdiff >= 0) || (this.zvoltage === 0)) {
      return this.current = this.leakage * (Math.exp(voltdiff * this.vdcoef) - 1);
    } else {
      return this.current = this.leakage * (Math.exp(voltdiff * this.vdcoef) - Math.exp((-voltdiff - this.zoffset) * this.vdcoef) - 1);
    }
  }

  // TODO: fix
  needsShortcut() {
    return true;
  }

  limitStep(vnew, vold) {
    let v0;
    let arg = undefined;
    let oo = vnew;

    // check new voltage; has current changed by factor of e^2?
    if ((vnew > this.vcrit) && (Math.abs(vnew - vold) > (this.vt + this.vt))) {
      if (vold > 0) {
        arg = 1 + ((vnew - vold) / this.vt);
        if (arg > 0) {
          // adjust vnew so that the current is the same
          // as in linearized model from previous iteration.
          // current at vnew = old current * arg
          vnew = vold + (this.vt * Math.log(arg));

          // current at v0 = 1uA
          v0 = Math.log(1e-6 / this.leakage) * this.vt;
          vnew = Math.max(v0, vnew);
        } else {
          vnew = this.vcrit;
        }
      } else {
        // adjust vnew so that the current is the same
        // as in linearized model from previous iteration.
        // (1/vt = slope of load line)
        vnew = this.vt * Math.log(vnew / this.vt);
      }

//      console.log("CONVERGE: vnew > @vcrit and Math.abs(vnew - vold) > (@vt + @vt)")
      this.Circuit.Solver.converged = false;

    } else if ((vnew < 0) && (this.zoffset !== 0)) {
      // for Zener breakdown, use the same logic but translate the values
      vnew = -vnew - this.zoffset;
      vold = -vold - this.zoffset;
      if ((vnew > this.vcrit) && (Math.abs(vnew - vold) > (this.vt + this.vt))) {
        if (vold > 0) {
          arg = 1 + ((vnew - vold) / this.vt);
          if (arg > 0) {
            vnew = vold + (this.vt * Math.log(arg));
            v0 = Math.log(1e-6 / this.leakage) * this.vt;
            vnew = Math.max(v0, vnew);

          } else {
            vnew = this.vcrit;
          }
        } else {
          vnew = this.vt * Math.log(vnew / this.vt);
        }

        this.Circuit.Solver.converged = false;
      }
      vnew = -(vnew + this.zoffset);
    }
    return vnew;
  }
}
DiodeElm.initClass();


module.exports = DiodeElm;
