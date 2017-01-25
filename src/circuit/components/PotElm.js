let CircuitComponent = require("../circuitComponent.js");
let Util = require("../../util/util.js");
let Settings = require('../../settings/settings.js');

let Point = require("../../geom/point.js");

class PotElm extends CircuitComponent {
  static get Fields() {
    return {
      "maxResistance": {
        name: "Max Resistance",
        default_value: 1e4,
        data_type: parseFloat,
        range: [0, Infinity],
        symbol: "Ω"
      },
      "position": {
        name: "Position",
        default_value: 0.5,
        range: [0, 1e5],
        data_type: parseFloat
      },
      "sliderText": {
        name: "Slider Text",
        default_value: "",
        data_type(x) {
          return x;
        }
      }
    };
  }

  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);

    // this.sliderValue = this.position * 100;

    this.setPoints(xa, ya, xb, yb)
  }

//  draw: (renderContext) ->
//    super()
//
//    @getParentCircuit.halt("Draw not yet implemented for #{this}")

  draw(renderContext) {
    this.calcLeads(32);

    let numSegments = 16;
    let width = 5;

//    @setBboxPt @point1, @point2, width

    renderContext.drawLeads(this);

    let parallelOffset = 1 / numSegments;

    // this.updateDots();
    // renderContext.drawDots(this.point1, this.lead1, this);
    // renderContext.drawDots(this.lead2, this.point2, this);

    // Generate alternating sequence 0, 1, 0, -1, 0 ... to offset perpendicular to wire
    let offsets = [0, 1, 0, -1];

    // Draw resistor "zig-zags"
    for (let n = 0; n < numSegments; n++) {
      let resistorSegmentVoltage = this.volts[0] + ((this.volts[1]-this.volts[0]) * (n / numSegments));

      let startPosition = Util.interpolate(this.lead1, this.lead2, n*parallelOffset, width*offsets[n % 4]);
      let endPosition = Util.interpolate(this.lead1, this.lead2, (n+1)*parallelOffset, width*offsets[(n+1) % 4]);

      renderContext.drawLinePt(startPosition, endPosition, renderContext.getVoltageColor(resistorSegmentVoltage), Settings.LINE_WIDTH);
    }

    let voltColor = renderContext.getVoltageColor(this.volts[2]);
    // console.log("POSTS", this.post3, this.corner2, this.arrowPoint, this.arrow1, this.arrow2, this.midpoint);

    renderContext.drawCircle(this.post3, this.corner2, voltColor);
    renderContext.drawLinePt(this.post3, this.corner2, voltColor);
    renderContext.drawLinePt(this.corner2, this.arrowPoint, voltColor);
    renderContext.drawLinePt(this.arrow1, this.arrowPoint, voltColor);
    renderContext.drawLinePt(this.arrow2, this.arrowPoint, voltColor);
    // drawThickLine(g, corner2, arrowPoint);
    // drawThickLine(g, arrow1, arrowPoint);
    // drawThickLine(g, arrow2, arrowPoint);

    // renderContext.drawDots(this.point1, this.lead1, this);
    // renderContext.drawDots(this.lead2, this.point2, this);


    this.curcount_1 = this.updateDots(null, this.current1);
    renderContext.drawDots(this.point1, this.lead1, this.curcount_1);

    renderContext.drawValue(-this.dir*18, 0, this, Util.getUnitText(this.resistance1, this.unitSymbol()));

    renderContext.drawPosts(this);

    if (CircuitComponent.DEBUG) {
      return super.draw(renderContext);
    }
  }

  onToggle() {
    console.log(this.post3);
    console.log(this.corner2);
    console.log(this.arrowPoint);
    console.log(this.arrow1)
    console.log(this.arrow2)
  }

  unitSymbol() {
    return "Ω";
  }

  adjustmentValueChanged() {
    this.getParentCircuit().Solver.analyzeFlag = true;
    this.setPoints();
  }

  getPostCount() {
    return 3;
  }

  getName() {
    return "Potentiometer"
  }

  sliderValue() {
    // return this.position * 100;
    return 50;
  }

  setPoints(x1, y1, x2, y2) {
    let dx;
    let dy;
    super.setPoints(x1, y1, x2, y2);

    let offset = 0;
    this.dir = 0;

    // TODO: Check
    if (Math.abs(this.dx()) > Math.abs(this.dy())) {   // Horizontal
      //dx = Util.snapGrid(this.dx() / 2) * 2;

      offset = (this.dx() < 0) ? this.dx() : -this.dx();

      this.dir = Math.sign(this.dx());

      //this.point2.y = this.point1.y;

      offset = Util.snapGrid(-offset/2 + 2*Settings.GRID_SIZE*this.dir);
    } else {
      //dy = Util.snapGrid(this.dy() / 2) * 2;
      // this.point2.y = this.point1.y + dy;
      offset = (this.dy() > 0) ? this.dy() : -this.dy();

      this.dir = Math.sign(this.dy());

      offset = Util.snapGrid(8*Settings.GRID_SIZE);
      //this.point2.x = this.point1.x;
    }

    //offset = this.dn();


    console.log(this.point1, this.point2, this.dx(), this.dy());

    if (offset === 0) {
      offset = 2 * Settings.GRID_SIZE;
    }

    let dn = this.dn(); //Math.sqrt(Math.pow(this.point1.x - this.point2.x, 2), Math.pow(this.point1.y - this.point2.y, 2));

    let bodyLen = 32;

    this.calcLeads(bodyLen);
    this.position = this.sliderValue() * 0.0099 + 0.005;
    let soff = Math.floor((this.position - 0.5) * bodyLen);

    this.post3 = Util.interpolate(this.point1, this.point2, 0.5, offset);
    this.corner2 = Util.interpolate(this.point1, this.point2, (soff / dn) + 0.5, offset);
    this.arrowPoint = Util.interpolate(this.point1, this.point2, (soff / dn) + 0.5, 8 * Math.sign(offset));
    this.midpoint = Util.interpolate(this.point1, this.point2, (soff / dn) + 0.5);

    let clen = Math.abs(offset) - 8;

    [this.arrow1, this.arrow2] = Util.interpolateSymmetrical(this.corner2, this.arrowPoint, (clen - 8) / clen, 8);

    this.ps3 = new Point(0, 0);
    this.ps4 = new Point(0, 0);

    console.log("POSTS", this.dir, "offset", offset, "dn", dn, clen, this.position, "post3", this.post3, "corner2", this.corner2, "arrowPoint", this.arrowPoint, this.arrow1, this.arrow2, this.midpoint, "p1", this.point1, "p2", this.p2);
  }

  getPost(n) {
    if (n === 0) {
      return this.point1;
    } else if (n === 1) {
      return this.point2;
    } else {
      return this.post3;
    }
  }

  calculateCurrent() {
    this.current1 = (this.volts[0] - this.volts[2]) / this.resistance1;
    this.current2 = (this.volts[1] - this.volts[2]) / this.resistance2;
    this.current3 = -this.current1 - this.current2;
  }

  stamp(stamper) {
    this.resistance1 = this.maxResistance * this.position;
    this.resistance2 = this.maxResistance * (1 - this.position);
    stamper.stampResistor(this.nodes[0], this.nodes[2], this.resistance1);
    return stamper.stampResistor(this.nodes[2], this.nodes[1], this.resistance2);
  }
}
PotElm.initClass();


module.exports = PotElm;
