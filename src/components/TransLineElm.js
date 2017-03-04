let CircuitComponent = require("./CircuitComponent.js");
let Util = require('../util/Util.js');

class TransLineElm extends CircuitComponent {
  static get Fields() {
    return {
      delay: {
        title: "Delay",
        data_type: parseFloat,
        default_value: 1000 * 5e-12,
        unit: "time",
        symbol: "s",
        range: [0, Infinity]
      },
      imped: {
        title: "Impedance",
        data_type: parseFloat,
        default_value: 75,
        range: [0, Infinity]
      },
      channelWidth: {
        title: "Channel Width (m)",
        data_type: parseFloat,
        default_value: 20,
        range: [0, Infinity]
      },
      resistance: {
        title: "Resistance",
        data_type: parseFloat,
        default_value: 50,
        unit: "Ohms",
        symbol: "Ω",
        range: [0, Infinity]
      }
    };
  }

  constructor(xa, xb, ya, yb, params, f) {
    super(xa, xb, ya, yb, params, f);

    this.noDiagonal = true;

    // delete this.params['resistance'];

    this.ptr = 0;

    this.place()
  }

  static get NAME() {
    return "Transmission Line"
  }

  onSolder(circuit) {
    super.onSolder();

    // console.log(circuit.timeStep())

    this.delay = this.delay || (1000 * circuit.timeStep());
    this.params['delay'] = this.delay;

    this.lenSteps = Math.floor(this.delay / circuit.timeStep());
    // console.log("LEN STEPS", this.lenSteps, this.delay, circuit.timeStep())

    if (this.lenSteps > 100000) {
      this.voltageL = null;
      this.voltageR = null;

    } else {
      this.voltageL = Util.zeroArray(this.lenSteps);
      this.voltageR = Util.zeroArray(this.lenSteps);
    }

    this.ptr = 0;
  }

  place() {
    let ds = (this.dy() === 0) ? Math.sign(this.dx()) : -Math.sign(this.dy());

    let p3 = Util.interpolate(this.point1, this.point2, 0, -Math.floor(this.channelWidth * ds));
    let p4 = Util.interpolate(this.point1, this.point2, 1, -Math.floor(this.channelWidth * ds));

    let sep = this.getGridSize() / 2;
    let p5 = Util.interpolate(this.point1, this.point2, 0, -Math.floor((this.channelWidth / 2) - sep) * ds);
    let p6 = Util.interpolate(this.point1, this.point2, 1, -Math.floor((this.channelWidth / 2) - sep) * ds);
    let p7 = Util.interpolate(this.point1, this.point2, 0, -Math.floor((this.channelWidth / 2) + sep) * ds);
    let p8 = Util.interpolate(this.point1, this.point2, 1, -Math.floor((this.channelWidth / 2) + sep) * ds);

    this.posts = [p3, p4, this.point1, this.point2];
    this.inner = [p7, p8, p5, p6];

    this.setBboxPt(this.posts[0], this.posts[3], 5);
  }

  getConnection(n1, n2) {
    return false;
  }

  hasGroundConnection(n1) {
    return false;
  }

  numVoltageSources() {
    return 2;
  }

  numInternalNodes() {
    return 2;
  }

  getPost(n) {
    return this.posts[n];
  }

  numPosts() {
    return 4;
  }

  setVoltageSource(n, v) {
    if (n === 0) {
      return this.voltSource1 = v;
    } else {
      return this.voltSource2 = v;
    }
  }

  draw(renderContext) {
    //this.setBboxPt(this.posts[0], this.posts[3], 5);
    let segments = Math.floor(this.dn() / 2);

    let ix0 = this.ptr - 1 + this.lenSteps;
    let segf = 1. / segments;

    //renderContext.setColor(Color.darkGray);
    renderContext.drawRect(this.inner[2].x, this.inner[2].y, this.inner[1].x - this.inner[2].x, this.inner[1].y - this.inner[2].y + 1, {lineColor: renderContext.GRAY});

    for (let i = 0; i != 4; i++) {
      let color = renderContext.getVoltageColor(this.volts[i]);
      renderContext.drawLinePt(this.posts[i], this.inner[i], color);
    }

    if (this.voltageL != null) {
      for (let i = 0; i < segments; i++) {
        let ix1 = Math.floor((ix0 - this.lenSteps * i / segments) % this.lenSteps);
        let ix2 = Math.floor((ix0 - this.lenSteps * (segments - 1 - i) / segments) % this.lenSteps);

        let lhs = this.voltageL[ix1];
        let rhs = this.voltageR[ix2];

        let v = (lhs + rhs) / 2;

        let color = renderContext.getVoltageColor(v);

        let ps1 = Util.interpolate(this.inner[0], this.inner[1], i * segf);
        let ps2 = Util.interpolate(this.inner[2], this.inner[3], i * segf);

        renderContext.drawLine(ps1.x, ps1.y, ps2.x, ps2.y, color);

        //g.drawLine(ps1.x, ps1.y, ps2.x, ps2.y);
        // interpPoint(inner[2], inner[3], ps1, (i + 1) * segf);
        ps1 = Util.interpolate(this.inner[2], this.inner[3], (i + 1) * segf);

        renderContext.drawLinePt(ps1, ps2, color);
      }
    }

    let color = renderContext.getVoltageColor(this.volts[0]);
    //renderContext.drawLinePt(this.inner[0], this.inner[1], color);
    renderContext.drawPosts(this);

    /*
     curCount1 = updateDotCount(-current1, curCount1);
     curCount2 = updateDotCount(current2, curCount2);
     if (sim.dragElm != this) {
     drawDots(g, posts[0], inner[0], curCount1);
     drawDots(g, posts[2], inner[2], -curCount1);
     drawDots(g, posts[1], inner[1], -curCount2);
     drawDots(g, posts[3], inner[3], curCount2);
     }
     */
  }


  setCurrent(v, c) {
    if (v === this.voltSource1) {
      return this.current1 = c;
    } else {
      return this.current2 = c;
    }
  }

  stamp(stamper) {
    stamper.stampVoltageSource(this.nodes[4], this.nodes[0], this.voltSource1);
    stamper.stampVoltageSource(this.nodes[5], this.nodes[1], this.voltSource2);
    stamper.stampResistor(this.nodes[2], this.nodes[4], this.imped);
    return stamper.stampResistor(this.nodes[3], this.nodes[5], this.imped);
  }


  startIteration() {
    if (!this.voltageL) {
      console.error(`Start Iteration: Transmission line delay too large: ${this.params.delay}. Time Step is: ${this.Circuit.timeStep()}`);
      return;
    }


    // console.log("START ITERATION PTR", this.ptr, this.volts, "LENSTEP",  this.lenSteps);

    this.voltageL[this.ptr] = ((this.volts[2] - this.volts[0]) + this.volts[2]) - this.volts[4];
    this.voltageR[this.ptr] = ((this.volts[3] - this.volts[1]) + this.volts[3]) - this.volts[5];

    return this.ptr = (this.ptr + 1) % this.lenSteps;
  }

  doStep(stamper) {
    if (!this.voltageL) {
      console.error(`doStep: Transmission line delay too large: ${this.params.delay}. Time Step is: ${this.Circuit.timeStep()}`);
      return;
    }

    stamper.updateVoltageSource(this.nodes[4], this.nodes[0], this.voltSource1, -this.voltageR[this.ptr]);
    stamper.updateVoltageSource(this.nodes[5], this.nodes[1], this.voltSource2, -this.voltageL[this.ptr]);

    if ((Math.abs(this.volts[0]) > 1e-5) || (Math.abs(this.volts[1]) > 1e-5)) {
      return console.error("Transmission line not grounded!");
    }
  }
}
TransLineElm.initClass();


module.exports = TransLineElm;
