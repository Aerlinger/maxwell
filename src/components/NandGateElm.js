let Util = require('../util/Util.js');
let AndGateElm = require("./AndGateElm.js");

class NandGateElm extends AndGateElm {
  constructor(xa, ya, xb, yb, params, f){
    super(xa, ya, xb, yb, params, f);
  }

  isInverting() {
    return true;
  }

  static get NAME() {
    return "NAND Gate";
  }
}

module.exports = NandGateElm;
