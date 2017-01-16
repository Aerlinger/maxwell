let OrGateElm = require("./OrGateElm.js");
let Util = require('../../util/util.js');

class XorGateElm extends OrGateElm {

  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);
  }

  setPoints() {
    let a, b;
    super.setPoints(...arguments);

    this.linePoints = Util.newPointArray(5);

    let ww2 = (this.ww === 0) ? this.dn() * 2 : this.ww * 2;

    return [0, 1, 2, 3, 4].map((i) =>
      (a = (i - 2) / 2.0,
      b = (4 * (1 - (a*a))) - 2,

      this.linePoints[i] = Util.interpolate(this.lead1, this.lead2, (b - 5) / ww2, a * this.hs2)));
  }

  getName() {
    return "XOR Gate";
  }

  calcFunction() {
    let f = false;

    for (let i = 0; i < this.inputCount; ++i) {
      f = f ^ this.getInput(i);
    }

    return f;
  }
}

module.exports = XorGateElm;
