let CircuitComponent = require("./CircuitComponent.js");
let ChipElm = require("./ChipElm.js");
let Util = require('../util/Util.js');
let Settings = require('../Settings.js');

class TimerElm extends ChipElm {
  static initClass() {
    this.FLAG_RESET = 2;
    this.N_DIS = 0;
    this.N_TRIG = 1;
    this.N_THRES = 2;
    this.N_VIN = 3;
    this.N_CTL = 4;
    this.N_OUT = 5;
    this.N_RST = 6;
  }

  constructor(xa, xb, ya, yb, params = {volts: [0.0], bits: [0]}, f = "0") {
    super(xa, xb, ya, yb, params, f);
  }

  static get NAME() {
    return "555 Timer";
  }

  numPosts() {
    if (this.hasReset()) {
      return 7;
    } else {
      return 6;
    }
  }

  numVoltageSources() {
    return 1;
  }

  nonLinear() {
    return true;
  }

  hasReset() {
    return (this.flags & TimerElm.FLAG_RESET) !== 0;
  }

  draw(renderContext) {
    //this.setPoints();
    this.drawChip(renderContext);

    let textSize = this.csize == 1 ? 8 : 11;

    renderContext.drawText("555", this.getCenter().x - 14, this.getCenter().y, Settings.LABEL_COLOR, textSize)
  }

  setupPins() {
    this.sizeX = 3;
    this.sizeY = 5;

    this.pins = new Array(7);
    this.pins[TimerElm.N_DIS] = new ChipElm.Pin(1, TimerElm.SIDE_W, "dis");
    this.pins[TimerElm.N_TRIG] = new ChipElm.Pin(3, TimerElm.SIDE_W, "tr");
    this.pins[TimerElm.N_TRIG].lineOver = true;
    this.pins[TimerElm.N_THRES] = new ChipElm.Pin(4, TimerElm.SIDE_W, "th");
    this.pins[TimerElm.N_VIN] = new ChipElm.Pin(1, TimerElm.SIDE_N, "Vin");
    this.pins[TimerElm.N_CTL] = new ChipElm.Pin(1, TimerElm.SIDE_S, "ctl");
    this.pins[TimerElm.N_OUT] = new ChipElm.Pin(2, TimerElm.SIDE_E, "out");
    this.pins[TimerElm.N_OUT].output = this.pins[TimerElm.N_OUT].state = true;
    return this.pins[TimerElm.N_RST] = new ChipElm.Pin(1, TimerElm.SIDE_E, "rst");
  }

  stamp(stamper) {
    // stamp voltage divider to put ctl pin at 2/3 V
    stamper.stampResistor(this.nodes[TimerElm.N_VIN], this.nodes[TimerElm.N_CTL], 5000);
    stamper.stampResistor(this.nodes[TimerElm.N_CTL], 0, 10000);

    // output pin
    stamper.stampVoltageSource(0, this.nodes[TimerElm.N_OUT], this.pins[TimerElm.N_OUT].voltSource);

    // discharge pin
    return stamper.stampNonLinear(this.nodes[TimerElm.N_DIS]);
  }

  startIteration() {
    this.out = this.volts[TimerElm.N_OUT] > (this.volts[TimerElm.N_VIN] / 2);

    this.setOut = false;

    if ((this.volts[TimerElm.N_CTL] / 2) > this.volts[TimerElm.N_TRIG]) {
      this.setOut = this.out = true;
    }

    if ((this.volts[TimerElm.N_THRES] > this.volts[TimerElm.N_CTL]) || (this.hasReset() && (this.volts[TimerElm.N_RST] < 0.7))) {
      return this.out = false;
    }
  }

  doStep(stamper) {
    let output = this.out ? this.volts[TimerElm.N_VIN] : 0;

    if (!this.out && !this.setOut) {
      stamper.stampResistor(this.nodes[TimerElm.N_DIS], 0, 10);
    }

    return stamper.updateVoltageSource(0, this.nodes[TimerElm.N_OUT], this.pins[TimerElm.N_OUT].voltSource, output);
  }

  calculateCurrent() {
    this.pins[TimerElm.N_VIN].current = (this.volts[TimerElm.N_CTL] - this.volts[TimerElm.N_VIN]) / 5000;
    this.pins[TimerElm.N_CTL].current = (-this.volts[TimerElm.N_CTL] / 10000) - this.pins[TimerElm.N_VIN].current;

    let discharge_current = (!this.out && !this.setOut) ?
      -this.volts[TimerElm.N_DIS] / 10
    :
      0;

    return this.pins[TimerElm.N_DIS].current = discharge_current;
  }
}
TimerElm.initClass();

module.exports = TimerElm;
