let SwitchElm = require("./SwitchElm.js");

class PushSwitchElm extends SwitchElm {
  constructor(xa, xb) {
    super(xa, xb, true);
  }
}

module.exports = PushSwitchElm;
