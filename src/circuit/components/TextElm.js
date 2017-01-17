let CircuitComponent = require('../circuitComponent.js');
let Settings = require('../../settings/settings.js');
let Polygon = require('../../geom/polygon.js');
let Rectangle = require('../../geom/rectangle.js');
let Point = require('../../geom/point.js');

class TextElm extends CircuitComponent {
  static initClass() {
    this.FLAG_CENTER = 1;
    this.FLAG_BAR = 2;
  }

  static get Fields() {
    return {
      size: {
        name: "Pixel",
        unit: "Pixel",
        symbol: "",
        default_value: 24,
        data_type: parseInt,
        range: [0, 500],
        type: "attribute"
      },
      text: {
        default_value: "<text>",
        type: "attribute",
        data_type(x) { return x; }
      }
    };
  }

  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);

    // this.text = params.text;

    this.lines = new Array(); // new vector()
    this.lines.push(this.text);
    // this.size = ;
  }

  stamp() {}

  split() {
    return this.lines = this.text.split("\n");
  }

  drag(xx, yy) {
    this.point1.x = xx;
    this.point1.y = yy;
    this.point2.x = xx + 16;
    return this.point2.y = yy;
  }

  getName() {
    return "Text Label"
  }

  draw(renderContext) {
    let color = Settings.TEXT_COLOR;
    this.setBbox(this.point1.x, this.point1.y, this.point2.x, this.point2.y);

    let mt = renderContext.fillText(this.text, this.x1(), this.y1(), color, this.size);

    this.point2.x = this.boundingBox.x1 + this.boundingBox.width;
    this.point2.y = this.boundingBox.y1 + this.boundingBox.height;

    this.setBbox(this.x1(), this.y1() + mt.actualBoundingBoxDescent, this.x1() + mt.width, this.y1() - mt.emHeightAscent + mt.emHeightDescent);

    if (CircuitComponent.DEBUG) {
      return super.draw(renderContext);
    }
  }

  isCenteredText() {
    return (this.flags & TextElm.FLAG_CENTER) !== 0;
  }

  getInfo(arr) {
    return arr[0] = this.text;
  }

  getPostCount() {
    return 0;
  }
}
TextElm.initClass();


module.exports = TextElm;
