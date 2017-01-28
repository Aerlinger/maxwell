let GateElm = require("./GateElm.js");
let Util = require('../../util/util.js');
let Point = require('../../geom/point.js');

class AndGateElm extends GateElm {
  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);
  }

  place() {
    super.place();

    let triPoints = Util.newPointArray(23);

    [triPoints[0], triPoints[22]] = Util.interpolateSymmetrical(this.lead1, this.lead2, 0, this.hs2);

    for (let i = 0; i < 10; i++) {
      let a = i * 0.1;
      let b = Math.sqrt(1 - (a*a));

      [triPoints[i + 1], triPoints[21 - i]] = Util.interpolateSymmetrical(this.lead1, this.lead2, 0.5 + (a / 2), b * this.hs2);
    }

    triPoints[11] = new Point(this.lead2.x, this.lead2.y);

    if (this.isInverting()) {
      this.pcircle = Util.interpolate(this.point1, this.point2, 0.5 + ((this.ww + 4) / this.dn()));
      this.lead2 = Util.interpolate(this.point1, this.point2, 0.5 + ((this.ww + 8) / this.dn()));
    }

    return this.gatePoly = Util.createPolygonFromArray(triPoints);
  }

  getName() {
    return "AND Gate";
  }

  calcFunction() {
    let f = true;

    for (let i = 0; i < this.inputCount; ++i) {
      f = f & this.getInput(i);
    }

    // console.log(f)

    return f;
  }
}

module.exports = AndGateElm;
