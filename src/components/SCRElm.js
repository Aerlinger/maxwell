let CircuitComponent = require('./circuitComponent.js');
let Settings = require('../settings/settings.js');
let Point = require('../geom/point.js');
let Util = require('../util/util.js');

// TODO: Extend from Diode?
class ScrElm extends CircuitComponent {
  static get Fields() {
  
    return {
      lastvac: {
        data_type: parseFloat,
        default_value: 0
      },
      lastvag: {
        data_type: parseFloat,
        default_value: 0
      },
      triggerI: {
        data_type: parseFloat,
        default_value: 0.01
      },
      holdingI: {
        data_type: parseFloat,
        default_value: 0.0082
      },
      cresistance: {
        data_type: parseFloat,
        default_value: 50
      }
    };
  }

  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);

    this.anode = 0;
    this.cnode = 1;
    this.gnode = 2;
    this.inode = 3;
    this.hs = 8;

    this.setDefaults();

    this.vt = 0;
    this.vdcoef = 0;
    this.fwdrop = 0;
    this.zvoltage = 0;
    this.zoffset = 0;
    this.lastvoltdiff = 0;
    this.crit = 0;
    this.leakage = 1e-14;

    this.volts[this.anode] = 0;
    this.volts[this.cnode] = -this.lastvac;
    this.volts[this.gnode] = -this.lastvag;

    this.curcount_a = 0;
    this.curcount_c = 0;
    this.curcount_g = 0;

    // this.params['volts'] = this.volts;

    // delete this.params['lastvac'];
    // delete this.params['lastvag'];

    this.setup();
    //this.setPoints();
    this.place()
  }

  place() {
    let dir = 0;
    if (Math.abs(this.dx()) > Math.abs(this.dy())) {
      dir = -Math.sign(this.dx()) * Math.sign(this.dy());
      this.point2.y = this.point1.y;
    } else {
      dir = Math.sign(this.dy()) * Math.sign(this.dx());
      this.point2.x = this.point1.x;
    }

    if (dir === 0) {
      dir = 1;
    }
    this.calcLeads(16);

    this.cathode = new Array(2);
    let pa = new Array(2);

    [pa[0], pa[1]] = Util.interpolateSymmetrical(this.lead1, this.lead2, 0, this.hs);
    [this.cathode[0], this.cathode[1]] = Util.interpolateSymmetrical(this.lead1, this.lead2, 1, this.hs);

    this.poly = Util.createPolygon(pa[0], pa[1], this.lead2);

    this.gate = new Array(2);
    let leadlen = (this.dn() - 16) / 2;

    let gatelen = 2*Settings.GRID_SIZE;
    //gatelen = gatelen + (leadlen % 2*Settings.GRID_SIZE);

    gatelen = 24;

    if (leadlen < gatelen) {
      this.point2.x = this.point1.x;
      this.point2.y = this.point1.y;
      return;
    }

    dir *= -1;
    // leadlen /= 3;
    // console.log("dn", this.dn());
    // console.log("gatelen", gatelen);
    // console.log("dir", dir);
    // console.log("leadlen", leadlen);
    // console.trace("leadlen");

    this.gate[0] = Util.interpolate(this.lead2, this.point2, gatelen / leadlen, gatelen * dir);
    this.gate[1] = Util.interpolate(this.lead2, this.point2, gatelen / leadlen, Settings.GRID_SIZE * 4 * dir);

    this.setBboxPt(this.point1, this.point2, this.hs)


    /*
    let gatelen = Settings.GRID_SIZE;
    gatelen = gatelen + (leadlen % 2*Settings.GRID_SIZE);

    //gatelen = 24;

    if (leadlen < gatelen) {
      this.point2.x = this.point1.x;
      this.point2.y = this.point1.y;
      return;
    }

    //dir *= -1;
    // leadlen /= 3;
    console.log("dn", this.dn());
    console.log("gatelen", gatelen);
    console.log("dir", dir);
    console.log("leadlen", leadlen);
    console.trace("leadlen");

    this.gate[0] = Util.interpolate(this.lead2, this.point2, 2 * gatelen / leadlen, 2 * gatelen * dir);
    this.gate[1] = Util.interpolate(this.lead2, this.point2, 2 * gatelen / leadlen, Settings.GRID_SIZE * 4 * dir);
    */

    this.setBboxPt(this.point1, this.point2, this.hs)
  }

  nonLinear() {
    return true;
  }

  draw(renderContext) {
    //this.setPoints()
    this.setBboxPt(this.point1, this.point2, this.hs)
//    adjustBbox(@gate[0], @gate[1])

    let v1 = this.volts[this.anode];
    let v2 = this.volts[this.cnode];

    renderContext.drawLeads(this);

    let color = renderContext.getVoltageColor(v1);
    renderContext.drawThickPolygonP(this.poly, color);

    renderContext.fillCircle(this.gate[0].x, this.gate[0].y, 4, 2, "#00F");
    renderContext.fillCircle(this.gate[1].x, this.gate[1].y, 4, 2, "#F00");
    // renderContext.fillCircle(this.lead2.x, this.lead2.y, 4, 2, "#F0F");
    // renderContext.fillCircle(this.point2.x, this.point2.y, 4, 2, "#FF0");

    // draw thing arrow is pointing to
    color = renderContext.getVoltageColor(v2);
    renderContext.drawLinePt(this.cathode[0], this.cathode[1], color);

    renderContext.drawLinePt(this.lead2, this.gate[0], color);
    renderContext.drawLinePt(this.gate[0], this.gate[1], color);

    this.curcount_a = this.updateDots(null, this.ia);
    renderContext.drawDots(this.lead2, this.point1, this.curcount_a);

    this.curcount_c = this.updateDots(null, this.ic);
    renderContext.drawDots(this.point2, this.lead2, this.curcount_c);

    //this.curcount_g = this.updateDots(null, this.ig);
    // renderContext.drawDots(this.gate[1], this.gate[0], this.curcount_g);
    // renderContext.drawDots(this.gate[0], this.lead2, this.curcount_g);


    renderContext.drawPosts(this);

//    renderContext.drawDots(@gate[0], @lead2, @curcount_g + distance(@gate[1], @gate[0]))


    if (this.Circuit && this.Circuit.debugModeEnabled()) {
      super.debugDraw(renderContext);
    }
  }

  setDefaults() {
    this.leakage = 1e-14;  // Paramter?

    this.cresistance = 50;
    this.holdingI = .0082;
    return this.triggerI = .01;
  }

  getName() {
    return "Silicon Controlled Rectifier";
  }

  setup() {
    this.fwdrop = 0.8;   // Parameter?
    this.zvoltage = 0;   // zvoltage parameter?

    this.vdcoef = Math.log((1 / this.leakage) + 1) / this.fwdrop;

    this.vt = 1 / this.vdcoef;

    // critical voltage for limiting; current is vt/sqrt(2) at this voltage
    this.vcrit = this.vt * Math.log(this.vt / (Math.sqrt(2) * this.leakage));

    if (this.zvoltage === 0) {
      return this.zoffset = 0;
    } else {
      // calculate offset which will give us 5mA at zvoltage
      let i = -0.005;
      return this.zoffset = this.zvoltage - (Math.log(-(1 + (i / this.leakage))) / this.vdcoef);
    }
  }

  reset() {
    this.volts[this.anode] = this.volts[this.cnode] = this.volts[this.gnode] = 0;
    this.lastvoltdiff = 0;
    return this.lastvag = this.lastvac = this.curcount_a = this.curcount_c = this.curcount_g = 0;
  }

  getPost(n){
    if (n === 0) {
      return this.point1;
    } else {
      if (n === 1) {
        return this.point2;
      } else {
        return this.gate[1];
      }
    }
  }

  getPostCount() {
    return 3;
  }

  getInternalNodeCount() {
    return 1;
  }

  getPower() {
    return ((this.volts[this.anode] - this.volts[this.gnode]) * this.ia) + ((this.volts[this.cnode] - this.volts[this.gnode]) * this.ic);
  }

  stamp(stamper) {
    stamper.stampNonLinear(this.nodes[this.anode]);
    stamper.stampNonLinear(this.nodes[this.cnode]);
    stamper.stampNonLinear(this.nodes[this.gnode]);
    stamper.stampNonLinear(this.nodes[this.inode]);
    stamper.stampResistor(this.nodes[this.gnode], this.nodes[this.cnode], this.cresistance);

//    @diode.stamp(@nodes[@inode], @nodes[@gnode])
//    @nodes[0] = @nodes[@inode]
//    @nodes[1] = @nodes[@gnode]
    stamper.stampNonLinear(this.nodes[this.inode]);
    return stamper.stampNonLinear(this.nodes[this.gnode]);
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
      this.getParentCircuit().Solver.converged = false;

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
        this.getParentCircuit().Solver.converged = false;
      }
      vnew = -(vnew + this.zoffset);
    }
    return vnew;
  }


  doStep(stamper) {
    let geq, nc;
    this.vac = this.volts[this.anode] - this.volts[this.cnode];
    this.vag = this.volts[this.anode] - this.volts[this.gnode];

    if ((Math.abs(this.vac - this.lastvac) > .01) || (Math.abs(this.vag - this.lastvag) > 0.01)) {
      this.getParentCircuit().converged = false;
    }

    this.lastvac = this.vac;
    this.lastvag = this.vag;

    // diode.doStep(@volts[@inode] - @volts[@gnode])

    let voltdiff = this.volts[this.inode] - this.volts[this.gnode];

    //# ------------------------------------------------------
    // DIODE BEHAVIOR
    // TODO: DRY WITH DIODE ELM
    //# ------------------------------------------------------

    if (Math.abs(voltdiff - this.lastvoltdiff) > .01) {
      this.getParentCircuit().Solver.converged = false;
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

      stamper.stampConductance(this.nodes[this.inode], this.nodes[this.gnode], geq);
      stamper.stampCurrentSource(this.nodes[this.inode], this.nodes[this.gnode], nc);
    } else {
      let exp0 = Math.exp(voltdiff * this.vdcoef);
      let exp1 = Math.exp((-voltdiff - this.zoffset) * this.vdcoef);

      geq =  this.leakage * (exp0 + exp1) * this.vdcoef;
      nc =   (this.leakage * (exp0 - exp1 - 1)) + (geq * -voltdiff);

      stamper.stampConductance(this.nodes[this.inode], this.nodes[this.gnode], geq);
      stamper.stampCurrentSource(this.nodes[this.inode], this.nodes[this.gnode], nc);
    }

    //# ------------------------------------------------------
    // END DIODE BEHAVIOR
    //# ------------------------------------------------------


    let icmult = 1 / this.triggerI;
    let iamult = (1 / this.holdingI) - icmult;

    this.aresistance = (((-icmult * this.ic) + (this.ia * iamult)) > 1) ? 0.0105 : 10e5;

    return stamper.stampResistor(this.nodes[this.anode], this.nodes[this.inode], this.aresistance);
  }

  calculateCurrent() {
    this.ic = (this.volts[this.cnode] - this.volts[this.gnode]) / this.cresistance;
    this.ia = (this.volts[this.anode] - this.volts[this.inode]) / this.aresistance;
    this.ig = -this.ic - this.ia;
  }
}
ScrElm.initClass();

module.exports = ScrElm;