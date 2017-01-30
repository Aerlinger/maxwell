let CircuitComponent = require("./circuitComponent.js");
let Util = require('../util/util.js');

class LampElm extends CircuitComponent {
  static get Fields() {
    return {
      temp: {
        name: "Temperature",
        data_type: parseFloat
      },
      nom_pow: {
        name: "Nominal power",
        data_type: parseFloat
      },
      nom_v: {
        name: "Nominal voltage",
        data_type: parseFloat
      },
      warmTime: {
        name: "Warm time",
        dataType: parseFloat
      },
      coolTime: {
        name: "Cool time",
        dataType: parseFloat
      }
    };
  }

  constructor(xa, xb, ya, yb, params, f) {
    super(xa, xb, ya, yb, params, f);
  }
}

module.exports = LampElm;
