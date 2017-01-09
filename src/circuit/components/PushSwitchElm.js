let CircuitComponent = require("../circuitComponent.js");
let Util = require('../../util/util.js');

class PushSwitchElm extends SwitchElm {

  constructor(xa, xb) {
    super(xa, xb, true);
  }
}

module.exports = PushSwitchElm;
