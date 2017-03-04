let Rectangle = require('../geom/Rectangle');

class SelectionMarquee extends Rectangle {
  constructor(x1, y1) {
    super();

    this.x = x1;
    this.y = y1;
  }

  toString() {
    return `${this.x1()} ${this.y1()} ${this.x2()} ${this.y2()}`;
  }

  reposition(x, y) {
    this.width = x - this.x;
    this.height = y - this.y;
  }
}

module.exports = SelectionMarquee;

