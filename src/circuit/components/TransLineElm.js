let CircuitComponent = require("../circuitComponent.js");
let Util = require('../../util/util.js');
let Settings = require('../../settings/settings.js');

class TransLineElm extends CircuitComponent {
  static get Fields() {
    return {
      delay: {
        name: "Delay",
        data_type: parseFloat
      },
      imped: {
        name: "Impedance",
        data_type: parseFloat
      },
      width: {
        name: "Width (m)",
        data_type: parseFloat
      },
      resistance: {
        name: "Resistance",
        data_type: parseFloat
      }
    };
  }

  constructor(xa, xb, ya, yb, params, f) {
    super(xa, xb, ya, yb, params, f);

    this.noDiagonal = true;

    // delete this.params['resistance'];

    this.ptr = 0;
  }

  onSolder(circuit){
    super.onSolder();

    this.lenSteps = Math.floor(this.delay / circuit.timeStep());

    if ((this.lenSteps > 100000) || !this.lenSteps) {
      this.voltageL = null;
      this.voltageR = null;

    } else {
      this.voltageL = Util.zeroArray(this.lenSteps);
      this.voltageR = Util.zeroArray(this.lenSteps);
    }

    return this.ptr = 0;
  }

  setPoints() {
    super.setPoints(...arguments);

    let ds = (this.dy() === 0) ? Math.sign(this.dx()) : -Math.sign(this.dy());

    let p3 = Util.interpolate(this.point1, this.point2, 0, -Math.floor(this.width * ds));
    let p4 = Util.interpolate(this.point1, this.point2, 1, -Math.floor(this.width * ds));

    let sep = Settings.GRID_SIZE / 2;
    let p5 = Util.interpolate(this.point1, this.point2, 0, -Math.floor((this.width / 2) - sep) * ds);
    let p6 = Util.interpolate(this.point1, this.point2, 1, -Math.floor((this.width / 2) - sep) * ds);
    let p7 = Util.interpolate(this.point1, this.point2, 0, -Math.floor((this.width / 2) + sep) * ds);
    let p8 = Util.interpolate(this.point1, this.point2, 1, -Math.floor((this.width / 2) + sep) * ds);

    this.posts = [p3, p4, this.point1, this.point2];
    return this.inner = [p7, p8, p5, p6];
  }


  getDumpType() {
    return "171";
  }

  getConnection(n1, n2) {
    return false;
  }

  hasGroundConnection(n1) {
    return false;
  }

  getVoltageSourceCount() {
    return 2;
  }

  getInternalNodeCount() {
    return 2;
  }

  getPost(n) {
    return this.posts[n];
  }

  getPostCount() {
    return 4;
  }

  setVoltageSource(n, v) {
    if (n === 0) {
      return this.voltSource1 = v;
    } else {
      return this.voltSource2 = v;
    }
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
      console.error("Transmission line delay too large!");
      return;
    }

    this.voltageL[this.ptr] = ((this.volts[2] - this.volts[0]) + this.volts[2]) - this.volts[4];
    this.voltageR[this.ptr] = ((this.volts[3] - this.volts[1]) + this.volts[3]) - this.volts[5];

    return this.ptr = (this.ptr + 1) % this.lenSteps;
  }

  doStep(stamper) {
    if (!this.voltageL) {
      console.error("Transmission line delay too large!");
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
