let OrGateElm = require("./OrGateElm.js");

class NorGateElm extends OrGateElm {

  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);
  }

  getName() {
    return "NOR Gate";
  }

  isInverting() {
    return true;
  }
}

module.exports = NorGateElm;
