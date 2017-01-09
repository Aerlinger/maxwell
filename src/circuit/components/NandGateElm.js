let Util = require('../../util/util.js');
let AndGateElm = require("./AndGateElm.js");

class NandGateElm extends AndGateElm {
  constructor(xa, ya, xb, yb, params, f){
    super(xa, ya, xb, yb, params, f);
  }

  isInverting() {
    return true;
  }

  getGameName() {
    return "NAND Gate";
  }

  getDumpType() {
    return 151;
  }
}

module.exports = NandGateElm;
