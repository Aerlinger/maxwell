let CircuitComponent = require("../circuitComponent.js");
let Util = require('../../util/util.js');

class ThermistorElm extends CircuitComponent {
  static initClass() {
  
    this.Fields = {
      maxresistance: {
        name: "Max. Resistance",
        data_type: parseFloat
      },
      minresistance: {
        name: "Min. Resistance",
        data_type: parseFloat
      }
    };
  }


  constructor(xa, xb, ya, yb, params, f) {
    super(xa, xb, ya, yb, params, f);
  }

  getDumpType() {
    return "188";
  }
}
ThermistorElm.initClass();

module.exports = ThermistorElm;
