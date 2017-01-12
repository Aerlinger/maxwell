let ChipElm = require("./ChipElm.js");

class DecadeElm extends ChipElm {

  constructor(xa, xb, ya, yb, params, f) {
    super(xa, xb, ya, yb, params, f);
  }

  getName() {
    return "Decade counter";
  }

  getDumpType() {
    return "163";
  }

  needsBits() {
    return true;
  }

  getPostCount() {
    return this.bits + 2;
  }

  getVoltageSourceCount() {
    return this.bits;
  }

  setupPins() {
    this.sizeX = this.bits > 2 ? this.bits : 2;
    this.sizeY = 2;

    this.pins = new Array(this.getPostCount());

    this.pins[0] = new ChipElm.Pin(1, ChipElm.SIDE_W, "");
    this.pins[0].clock = true;
    this.pins[1] = new ChipElm.Pin(this.sizeX - 1, ChipElm.SIDE_S, "R");
    this.pins[1].bubble = true;

    for (let i = 0; i < this.bits; i++) {
      let ii = i + 2;
      this.pins[ii] = new ChipElm.Pin(i, ChipElm.SIDE_N, `Q${i}`);
      this.pins[ii].output = this.pins[ii].state = true;
    }

    this.allocNodes();
  }

  execute() {
    let i;
    if (this.pins[0].value && !this.lastClock) {
      for (i = 0, end = this.bits, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
        var asc, end;
        if (this.pins[i + 2].value) {
          break;
        }
      }

      if (i < this.bits) {
        this.pins[i++ + 2].value = false;
      }

      i %= this.bits;

      this.pins[i + 2].value = true;
    }

    if (!this.pins[1].value) {
      for (i = 1, end1 = this.bits, asc1 = 1 <= end1; asc1 ? i < end1 : i > end1; asc1 ? i++ : i--) {
        var asc1, end1;
        this.pins[i + 2].value = false;
      }

      this.pins[2].value = true;
    }

    return this.lastClock = this.pins[0].value;
  }
}

module.exports = DecadeElm;
