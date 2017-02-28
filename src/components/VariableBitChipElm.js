let ChipElm = require('./ChipElm');

class VariableBitChipElm extends ChipElm {
  static get Fields() {
    return {
      "bits": {
        name: "Number of Bits",
        default_value: 4,
        data_type: (v) => {
          v
        },
        range: [0, Infinity]
      },
      "volts": {
        name: "Volts",
        description: "Initial voltages on output",
        unit: "Volts",
        default_value: 0,
        symbol: "V",
        data_type: (v) => {
          v
        },
        range: [0, Infinity]
      }
    };
  }

  needsBits() {
    return true;
  }
}

module.exports = VariableBitChipElm;
