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

    this.text = "<TextElm>";
    this.lines = new Array(); // new vector()
    this.lines.push(this.text);
    this.size = 24;
  }

  stamp() {}

  split() {
    return this.lines = this.text.split("\n");
  }

  getDumpType() {
    return "x";
  }

  drag(xx, yy) {
    this.point1.x = xx;
    this.point1.y = yy;
    this.point2.x = xx + 16;
    return this.point2.y = yy;
  }

  draw(renderContext) {
//    color = (if @needsHighlight() then Settings.SELECT_COLOR else Settings.TEXT_COLOR)

    let color = Settings.TEXT_COLOR;
    this.setBbox(this.point1.x, this.point1.y, this.point2.x, this.point2.y);

//      f = new Font("SansSerif", 0, size)
//      g.setFont f
//      fm = g.getFontMetrics()
//      maxw = -1

//      for i in [0...lines.length]
//        w = fm.stringWidth(@lines[i])
//        maxw = w  if w > maxw

//      cury = y

//      while i in [0...@lines.length]
//        s = (@lines[i])
//        x = (Circuit.winSize.width - fm.stringWidth(s)) / 2  unless (@flags & TextElm.FLAG_CENTER) is 0
//        g.drawString s, @x1, cury
//        unless (@flags & TextElm.FLAG_BAR) is 0
//          by_ = cury - fm.getAscent()
//          CircuitComponent.drawLine @x1, by_, @x1 + fm.stringWidth(s) - 1, by_
//        @adjustBbox @x1, cury - fm.getAscent(), @x1 + fm.stringWidth(s), cury + fm.getDescent()
//        cury += fm.getHeight()
//        i++

    let i = 0;
    for (let line of Array.from(this.lines)) {
      renderContext.fillText(line, 40, (15*i) + 100);
      i++;
    }

    this.point2.x = this.boundingBox.x1 + this.boundingBox.width;
    this.point2.y = this.boundingBox.y1 + this.boundingBox.height;

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
