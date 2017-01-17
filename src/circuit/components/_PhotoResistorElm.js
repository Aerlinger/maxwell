let CircuitComponent = require("../circuitComponent.js");
let Util = require('../../util/util.js');

class PhotoResistorElm extends CircuitComponent {
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
}

PhotoResistorElm.initClass();

module.exports = PhotoResistorElm;
