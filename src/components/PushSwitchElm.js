let CircuitComponent = require("./CircuitComponent.js");
let SwitchElm = require("./SwitchElm.js");
let Util = require('../util/Util.js');

class PushSwitchElm extends SwitchElm {

  constructor(xa, xb) {
    super(xa, xb, true);
  }
}

module.exports = PushSwitchElm;