let GateElm = require("./GateElm.js");
let Util = require('../util/Util.js');
let Point = require('../geom/Point.js');

class OrGateElm extends GateElm {
  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);
  }

  static get NAME() {
    return "OR Gate";
  }

  place() {
    let a, b, i;
    super.place();

    let triPoints = Util.newPointArray(38);

    for (i = 0; i < 16; i++) {
      a = i / 16.0;
      b = 1 - (a * a);

      [triPoints[i], triPoints[32 - i]] = Util.interpolateSymmetrical(this.lead1, this.lead2, 0.5 + (a/2), b * this.hs2);
    }

    let ww2 = (this.ww === 0) ? this.dn() * 2 : this.ww * 2;

    for (i = 0; i < 5; i++) {
      a = (i - 2) / 2.0;
      b = (4 * (1 - (a*a))) - 2;

      triPoints[33 + i] = Util.interpolate(this.lead1, this.lead2, b / ww2, a * this.hs2);
    }

    triPoints[16] = new Point(this.lead2.x, this.lead2.y);

    if (this.isInverting()) {
      this.pcircle = Util.interpolate(this.point1, this.point2, 0.5 + ((this.ww + 4) / this.dn()));
      this.lead2 = Util.interpolate(this.point1, this.point2, 0.5 + ((this.ww + 8) / this.dn()));
    }

    return this.gatePoly = Util.createPolygonFromArray(triPoints);
  }

  calcFunction() {
    let f = false;

    for (let i = 0; i < this.inputCount; i++) {
      f = f | this.getInput(i);
    }

    return f;
  }
}

module.exports = OrGateElm;
