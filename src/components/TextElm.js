let CircuitComponent = require('./CircuitComponent.js');
let Settings = require('../Settings.js');
let Polygon = require('../geom/Polygon.js');
let Rectangle = require('../geom/Rectangle.js');
let Point = require('../geom/Point.js');

class TextElm extends CircuitComponent {
  static initClass() {
    this.FLAG_CENTER = 1;
    this.FLAG_BAR = 2;
  }

  static get Fields() {
    return {
      text: {
        title: "Text value",
        default_value: "<text>",
        type: "attribute",
        data_type(x) { return x; }
      },
      size: {
        title: "Text Size",
        unit: "pt",
        symbol: "pt",
        default_value: 24,
        data_type: parseInt,
        range: [0, 500]
      }
    };
  }

  constructor(xa, ya, xb, yb, params, f) {
    super(xa, ya, xb, yb, params, f);

    // this.text = params.text;

    this.lines = new Array(); // new vector()
    this.lines.push(this.text);
    // this.size = ;

    this.place();

    //this.setBbox(this.point1.x, this.point1.y, this.point2.x, this.point2.y);
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

  static get NAME() {
    return "Text Label"
  }

  place() {
    //super.setPoints(x1, y1, x2 ,y2);

    this.point2 =  new Point(this.point1.x + 5 * this.text.length, this.point1.y);

    this.setBbox(this.point1.x, this.point1.y - this.size, this.point1.x + 5 * this.text.length, this.point1.y + this.size);
  }

  draw(renderContext) {
    let color = Settings.LABEL_COLOR;
    //this.setBbox(this.point1.x, this.point1.y, this.point2.x, this.point2.y);

    let mt = renderContext.drawText(this.text, this.x1(), this.y1(), color, (2/3) * this.size);

    this.point2.x = this.boundingBox.x1 + this.boundingBox.width;
    this.point2.y = this.boundingBox.y1 + this.boundingBox.height;

    //this.setBbox(this.x1(), this.y1() - this.size + 1, this.x1() + mt.width, this.y1());

    if (this.Circuit && this.Circuit.debugModeEnabled()) {
      return super.debugDraw(renderContext);
    }
  }

  isCenteredText() {
    return (this.flags & TextElm.FLAG_CENTER) !== 0;
  }

  numPosts() {
    return 0;
  }
}
TextElm.initClass();


module.exports = TextElm;
