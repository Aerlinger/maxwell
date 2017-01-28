let CircuitComponent = require("../circuitComponent.js");
let Util = require('../../util/util.js');
let Settings = require('../../settings/settings.js');

class GateElm extends CircuitComponent {
  static initClass() {
    this.FLAG_SMALL = 1;
  }

  static get Fields() {
    return {
      inputCount: {
        name: "Input count",
        data_type: parseInt,
        default_value: 2,
        field: "integer"
      },
      lastOutput: {
        name: "Initial State",
        data_type(x) {
          return x > 2.5;
        },
        default_value: false
      }
    };
  }

  constructor(xa, ya, xb, yb, params, f) {
    let size;
    if (parseInt(f) & (GateElm.FLAG_SMALL !== 0)) {
      size = 1;
    } else {
      size = 2;
    }

    super(xa, ya, xb, yb, params, f);

    this.setSize(size);

    this.noDiagonal = true;
    this.linePoints = null;

    this.place()
  }

  isInverting() {
    return false;
  }

  setSize(s) {
    this.gsize = s;
    this.gwidth = 7 * s;
    this.gwidth2 = 14 * s;
    this.gheight = 8 * s;
    if (s === 1) {
      return this.flags = GateElm.FLAG_SMALL;
    } else {
      return this.flags = 0;
    }
  }

  place() {
    //super.setPoints(...arguments);

//    if @dn() > 150
//      @setSize(2)

    let hs = this.gheight;
    this.ww = Math.floor(this.gwidth2);

    if (this.ww > (this.dn()/2)) {
      this.ww = Math.floor(this.dn()/2);
    }

    if (this.isInverting() && ((this.ww + 8) > (this.dn()/2))) {
      this.ww = Math.floor(this.dn() / 2) - 8;
    }

    this.calcLeads(this.ww*2);

    this.inPosts = Util.newPointArray(this.inputCount);
    this.inGates = Util.newPointArray(this.inputCount);

    this.allocNodes();

    let i0 = -Math.floor(this.inputCount / 2);

    for (let i = 0; i<this.inputCount; ++i) {
      if ((i0 === 0) && ((this.inputCount & 1) === 0)) {
        i0 += 1;
      }

      this.inPosts[i] = Util.interpolate(this.point1, this.point2, 0, hs * i0);
      this.inGates[i] = Util.interpolate(this.lead1, this.lead2, 0, hs * i0);

      if (this.lastOutput ^ this.isInverting()) {
        this.volts[i] = 5;
      } else {
        this.volts[i] = 0;
      }

      i0 += 1;
    }

    this.hs2 = this.gwidth * (Math.floor(this.inputCount / 2) + 1);
    this.setBboxPt(this.lead1, this.lead2, 2 * this.hs2);
  }


  doStep(stamper) {
    let res;
    let f = this.calcFunction();

    if (this.isInverting()) {
      f = (f > 0) ? 0 : 1;
    }

    this.lastOutput = (f > 0);
    this.params['lastOutput'] = (f > 0);

    if (f) {
      res = 5;
    } else {
      res = 0;
    }

    // console.log("V", this.volts, f, res);

    // console.log("GATE " + this.getName() + "nodes: " + this.nodes[this.inputCount] + " vs: " +  this.voltSource + "res: " + res)

    return stamper.updateVoltageSource(0, this.nodes[this.inputCount], this.voltSource, res);
  }


  draw(renderContext){
    for (let i = 0; i < this.inputCount; i++) {
      renderContext.drawLinePt(this.inPosts[i], this.inGates[i], renderContext.getVoltageColor(this.volts[i]));
    }

    //this.setBboxPt(this.point1, this.point2, this.hs2)

    renderContext.drawLinePt(this.lead2, this.point2, renderContext.getVoltageColor(this.volts[this.inputCount]));

    renderContext.drawThickPolygonP(this.gatePoly, Settings.STROKE_COLOR);
    if (this.linePoints !== null) {
      for (let i = 0; i< this.linePoints.length - 1; i++) {
        renderContext.drawLinePt(this.linePoints[i], this.linePoints[i + 1]);
      }
    }

    if (this.isInverting()) {
      renderContext.fillCircle(this.pcircle.x, this.pcircle.y, Settings.POST_RADIUS + 2, 2, "#FFFFFF", Settings.STROKE_COLOR);
    }

    this.updateDots();
    renderContext.drawDots(this.lead2, this.point2, this);

    renderContext.drawPosts(this);
    // renderContext.drawPosts(this);

    for (let i = 0; i < this.getPostCount(); i++) {
      let post = this.getPost(i);
      renderContext.drawPost(post.x, post.y)
    }

    if (this.Circuit && this.Circuit.debugModeEnabled()) {
      return super.debugDraw(renderContext);
    }
  }

  getPostCount() {
    return this.inputCount + 1;
  }

  getVoltageSourceCount() {
    return 1;
  }

  getPost(n) {
    if (n === this.inputCount) {
      return this.point2;
    }

    return this.inPosts[n];
  }

  getInput(n){
    //    console.log("INPUT #{n} is #{@volts[n]}")
    return this.volts[n] > 2.5;
  }

  getConnection(n1, n2){
    return false;
  }

  hasGroundConnection(n1) {
    return n1 === this.inputCount;
  }

  stamp(stamper) {
    return stamper.stampVoltageSource(0, this.nodes[this.inputCount], this.voltSource);
  }
}

GateElm.initClass();

module.exports = GateElm;
