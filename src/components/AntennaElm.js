let CircuitComponent = require('./CircuitComponent');

let Polygon = require('../geom/Polygon');
let Rectangle = require('../geom/Rectangle');
let Point = require('../geom/Point');
let RailElm = require('./RailElm');

class AntennaElm extends RailElm {
  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);
    this.waveform = RailElm.WF_DC;
    this.fmphase = 0;
  }

  doStep(stamper) {
    return stamper.updateVoltageSource(0, this.nodes[0], this.voltSource, this.getVoltage());
  }

  stamp(stamper) {
    return stamper.stampVoltageSource(0, this.nodes[0], this.voltSource);
  }

  getVoltage() {

    if (this.Circuit) {
      this.fmphase += 2 * Math.PI * (2200 + (Math.sin(2 * Math.PI * this.Circuit.getTime() * 13) * 100)) * this.getParentCircuit().timeStep();

      let fm = 3 * Math.sin(this.fmphase);

      let pi = Math.PI;
      let t = this.getParentCircuit().time;

      let wave1 = Math.sin(2 * pi * t * 3000) * (1.3 + Math.sin(2 * pi * t * 12)) * 3;
      let wave2 = Math.sin(2 * pi * t * 2710) * (1.3 + Math.sin(2 * pi * t * 13)) * 3;
      let wave3 = (Math.sin(2 * pi * t * 2433) * (1.3 + Math.sin(2 * pi * t * 14)) * 3) + fm;

      return wave1 + wave2 + wave3;
    } else {
      return 0;
    }
  }

  static get NAME() {
    return "Antenna"
  }
}

module.exports = AntennaElm;
