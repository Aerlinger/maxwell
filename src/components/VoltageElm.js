let CircuitComponent = require('./CircuitComponent.js');
let Settings = require('../Settings.js');
let Util = require('../util/Util.js');

class VoltageElm extends CircuitComponent {
  static get Fields() {
    return {
      "waveform": {
        name: "Waveform",
        default_value: 0,
        data_type: parseInt,
        range: [0, 6],
        field_type: "select",
        select_values: {
          "DC Source": VoltageElm.WF_DC,
          "AC Source": VoltageElm.WF_AC,
          "Square Wave": VoltageElm.WF_SQUARE,
          "Triangle Wave": VoltageElm.WF_TRIANGLE,
          "Sawtooth Wave": VoltageElm.WF_SAWTOOTH,
          "Pulse Generator": VoltageElm.WF_PULSE,
          "Variable": VoltageElm.WF_VAR
        }
      },
      "frequency": {
        name: "Frequency",
        unit: "Hertz",
        default_value: 40,
        symbol: "Hz",
        data_type: parseFloat
      },
      "maxVoltage": {
        name: "Max Voltage",
        unit: "Voltage",
        symbol: "V",
        default_value: 5,
        data_type: parseFloat
      },
      "bias": {
        name: "Voltage Bias",
        unit: "Voltage",
        symbol: "V",
        default_value: 0,
        data_type: parseFloat
      },
      "phaseShift": {
        name: "Phase Shift",
        unit: "degrees",
        default_value: 0,
        symbol: "deg",
        data_type: parseFloat,
        range: [-360, 360],
        type: parseFloat,
        field_type: "slider"
      },
      "dutyCycle": {
        name: "Duty Cycle",
        unit: "",
        default_value: 0.5,
        symbol: "%",
        data_type: parseFloat,
        range: [0, 100],
        type: parseFloat,
        field_type: "slider"
      }
    };
  }

  static initClass() {
    this.FLAG_COS = 2;
    this.WF_DC = 0;
    this.WF_AC = 1;
    this.WF_SQUARE = 2;
    this.WF_TRIANGLE = 3;
    this.WF_SAWTOOTH = 4;
    this.WF_PULSE = 5;
    this.WF_VAR = 6;

    this.circleSize = 17;
  }

  constructor(xa, ya, xb, yb, params, f) {
    let flags = f;

    // Convert parameters to a maximum length of 7
    // [val1, ..., val2, "Some", "strings"] -> [val1, ..., val2, "Some strings"]
    if (params instanceof Array && (params.length > 6)) {
      let labels = params.slice(6, params.length + 1 || undefined);

      params = params.slice(0, 6);
      params.push(labels.join(" "));
    }

    super(xa, ya, xb, yb, params, flags);

    if (flags & VoltageElm.FLAG_COS) {
      flags &= ~VoltageElm.FLAG_COS;
      this.phaseShift = Math.PI / 2;
    }

    this.flags = flags;

    this.freqTimeZero = 0;

    this.reset();
  }

  reset() {
    this.freqTimeZero = 0;
    return this.curcount = 0;
  }

  triangleFunc(x) {
    if (x < Math.PI) {
      return (x * (2 / Math.PI)) - 1;
    }

    return 1 - ((x - Math.PI) * (2 / Math.PI));
  }

  stamp(stamper) {
    if (this.waveform === VoltageElm.WF_DC) {
      return stamper.stampVoltageSource(this.nodes[0], this.nodes[1], this.voltSource, this.getVoltage());
    } else {
      return stamper.stampVoltageSource(this.nodes[0], this.nodes[1], this.voltSource);
    }
  }

  doStep(stamper) {
    if (this.waveform !== VoltageElm.WF_DC) {
      return stamper.updateVoltageSource(this.nodes[0], this.nodes[1], this.voltSource, this.getVoltage());
    }
  }

  getVoltage() {
    if (!this.Circuit) {
      return 0;
    }

    let omega = (2 * Math.PI * (this.Circuit.time - this.freqTimeZero) * this.frequency) + this.phaseShift;

    switch (this.waveform) {
      case VoltageElm.WF_DC:
        return this.maxVoltage + this.bias;
      case VoltageElm.WF_AC:
        return (Math.sin(omega) * this.maxVoltage) + this.bias;
      case VoltageElm.WF_SQUARE:
        return this.bias + (((omega % (2 * Math.PI)) > (2 * Math.PI * this.dutyCycle)) ? -this.maxVoltage : this.maxVoltage);
      case VoltageElm.WF_TRIANGLE:
        return this.bias + (this.triangleFunc(omega % (2 * Math.PI)) * this.maxVoltage);
      case VoltageElm.WF_SAWTOOTH:
        return (this.bias + ((omega % (2 * Math.PI)) * (this.maxVoltage / Math.PI))) - this.maxVoltage;
      case VoltageElm.WF_PULSE:
        if ((omega % (2 * Math.PI)) < 1) {
          return this.maxVoltage + this.bias;
        } else {
          return this.bias;
        }
      default:
        return 0;
    }
  }

  setPoints() {
    return super.setPoints(...arguments);
  }

  draw(renderContext) {
    this.updateDots();

    if ((this.waveform === VoltageElm.WF_DC) || (this.waveform === VoltageElm.WF_VAR)) {
      this.calcLeads(8);
    } else {
      this.calcLeads(VoltageElm.circleSize * 2);
    }

    renderContext.drawLeads(this);

    if (this.waveform === VoltageElm.WF_DC) {
      renderContext.drawDots(this.point1, this.lead1, this);
      renderContext.drawDots(this.lead2, this.point2, this);
    } else {
      renderContext.drawDots(this.point1, this.lead1, this);
      renderContext.drawDots(this.lead2, this.point2, this);
    }

    if (this.waveform === VoltageElm.WF_DC) {
      let [ptA, ptB] = Util.interpolateSymmetrical(this.lead1, this.lead2, 0, Settings.GRID_SIZE);
      renderContext.drawLinePt(this.lead1, ptA, renderContext.getVoltageColor(this.volts[0]));

      renderContext.drawLinePt(ptA, ptB, renderContext.getVoltageColor(this.volts[0]), Settings.LINE_WIDTH + 1);

      // this.setBboxPt(this.point1, this.point2, Settings.GRID_SIZE);
      [ptA, ptB] = Util.interpolateSymmetrical(this.lead1, this.lead2, 1, 2 * Settings.GRID_SIZE);
      renderContext.drawLinePt(ptA, ptB, renderContext.getVoltageColor(this.volts[1]), Settings.LINE_WIDTH + 1);

      renderContext.drawValue(-25, 0, this, Util.getUnitText(this.getVoltageDiff(), this.unitSymbol(), Settings.COMPONENT_DECIMAL_PLACES));
    } else {
      // this.setBboxPt(this.point1, this.point2, VoltageElm.circleSize);
      let ps1 = Util.interpolate(this.lead1, this.lead2, 0.5);
      this.drawWaveform(ps1, renderContext);
    }

    renderContext.drawPosts(this);

    if (this.Circuit && this.Circuit.debugModeEnabled()) {
      super.debugDraw(renderContext);
    }
  }

  static get NAME() {
    return "Voltage Source"
  }

  drawWaveform(center, renderContext) {
    let xc = center.x;
    let yc = center.y;

    renderContext.drawCircle(xc, yc, VoltageElm.circleSize, 2, Settings.FILL_COLOR);

    let color = Settings.SECONDARY_COLOR;

    let wl = 8;
    let xl = 5;
    this.setBbox(xc - VoltageElm.circleSize, yc - VoltageElm.circleSize, xc + VoltageElm.circleSize, yc + VoltageElm.circleSize);
    let xc2 = undefined;
    renderContext.drawCircle(xc, yc, VoltageElm.circleSize, 4);

    switch (this.waveform) {
      case VoltageElm.WF_DC:
        break;

      case VoltageElm.WF_SQUARE:
        xc2 = Math.floor(((wl * 2 * this.dutyCycle) - wl) + xc);
        xc2 = Math.max((xc - wl) + 3, Math.min((xc + wl) - 3, xc2));

        renderContext.drawLine(xc - wl, yc - wl, xc - wl, yc, color);
        renderContext.drawLine(xc - wl, yc - wl, xc2, yc - wl, color);
        renderContext.drawLine(xc2, yc - wl, xc2, yc + wl, color);
        renderContext.drawLine(xc + wl, yc + wl, xc2, yc + wl, color);
        renderContext.drawLine(xc + wl, yc, xc + wl, yc + wl, color);

        let str = this.params.maxVoltage + "V @ " + this.params.frequency + "Hz";
        renderContext.drawValue(35, 0, this, str);
        renderContext.drawValue(45, 0, this, Util.floatToPercent(this.params.dutyCycle));

        break;

      case VoltageElm.WF_PULSE:
        yc += wl / 2;

        renderContext.beginPath();
        renderContext.drawLine(xc - wl, yc - wl, xc - wl, yc, color);
        renderContext.drawLine(xc - wl, yc - wl, xc - wl/2, yc - wl, color);
        renderContext.drawLine(xc - wl/2, yc - wl, xc - wl/2, yc, color);
        renderContext.drawLine(xc - wl/2, yc, xc + wl, yc, color);
        renderContext.closePath();

        renderContext.drawValue(25, 0, this, this.params.maxVoltage + "V @ " + this.params.frequency + "Hz");

        yc -= wl / 2;

        break;

      case VoltageElm.WF_SAWTOOTH:
        renderContext.drawLine(xc, yc - wl, xc - wl, yc, color);
        renderContext.drawLine(xc, yc - wl, xc, yc + wl, color);
        renderContext.drawLine(xc, yc + wl, xc + wl, yc, color);
        renderContext.drawValue(35, 0, this, this.params.maxVoltage + "V @ " + this.params.frequency + "Hz");
        break;

      case VoltageElm.WF_TRIANGLE:

        renderContext.drawLine(xc - (xl * 2), yc, xc - xl, yc - wl, color);
        renderContext.drawLine(xc - xl, yc - wl, xc, yc, color);
        renderContext.drawLine(xc, yc, xc + xl, yc + wl, color);
        renderContext.drawLine(xc + xl, yc + wl, xc + (xl * 2), yc, color);
        renderContext.drawValue(35, 0, this, this.params.maxVoltage + "V @ " + this.params.frequency + "Hz");
        break;

      case VoltageElm.WF_AC:
        xl = 10;
        let ox = -1;
        let oy = -1;

        let i = -xl;
        while (i <= xl) {
          let yy = yc + Math.floor(0.95 * Math.sin((i * Math.PI) / xl) * wl);
          if (ox !== -1) {
            renderContext.drawLine(ox, oy, xc + i, yy, color);
          }
          ox = xc + i;
          oy = yy;
          i++;
        }

        renderContext.drawValue(25, 0, this, this.params.maxVoltage + "V @ " + this.params.frequency + "Hz");
        break;
    }

    if (Settings.SHOW_VALUES) {
      let valueString;
      return valueString = Util.getUnitText(this.frequency, "Hz");
    }
  }

  numVoltageSources() {
    return 1;
  }

  getPower() {
    return -this.getVoltageDiff() * this.current;
  }

  getVoltageDiff() {
    return this.volts[1] - this.volts[0];
  }

  unitSymbol() {
    return "V";
  }

  getInfo(arr) {
    switch (this.waveform) {
      case VoltageElm.WF_DC:
      case VoltageElm.WF_VAR:
        arr[0] = "Voltage source";
        break;
      case VoltageElm.WF_AC:
        arr[0] = "A/C source";
        break;
      case VoltageElm.WF_SQUARE:
        arr[0] = "Square wave gen";
        break;
      case VoltageElm.WF_PULSE:
        arr[0] = "Pulse gen";
        break;
      case VoltageElm.WF_SAWTOOTH:
        arr[0] = "Sawtooth gen";
        break;
      case VoltageElm.WF_TRIANGLE:
        arr[0] = "Triangle gen";
        break;
    }

    arr[1] = `I = ${Util.getUnitText(this.getCurrent(), "A")}`;
//      arr[2] = ((if (this instanceof RailElm) then "V = " else "Vd = ")) + DrawHelper.getVoltageText(@getVoltageDiff())

    if ((this.waveform !== VoltageElm.WF_DC) && (this.waveform !== VoltageElm.WF_VAR)) {
      arr[3] = `f = ${Util.getUnitText(this.frequency, "Hz")}`;
      arr[4] = `Vmax = ${Util.getUnitText(this.maxVoltage, "V")}`;
      let i = 5;
      if (this.bias !== 0) {
        arr[i++] = `Voff = ${Util.getUnitText(this.bias, "V")}`;
      } else if (this.frequency > 500) {
        arr[i++] = `wavelength = ${Util.getUnitText(2.9979e8 / this.frequency, "m")}`;
      }
      return arr[i++] = `P = ${Util.getUnitText(this.getPower(), "W")}`;
    }
  }
}
VoltageElm.initClass();


module.exports = VoltageElm;
