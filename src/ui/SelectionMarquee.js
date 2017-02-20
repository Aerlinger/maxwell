let Rectangle = require('./geom/Rectangle.js');

class SelectionMarquee extends Rectangle {
  constructor(x1, y1) {
    super();

    this.x1 = x1;
    this.y1 = y1;
  }

  toString() {
    return `${this.x} ${this.y} ${this.x2} ${this.y2}`;
  }

  reposition(x, y) {
    let _x1 = Math.min(x, this.x1);
    let _x2 = Math.max(x, this.x1);
    let _y1 = Math.min(y, this.y1);
    let _y2 = Math.max(y, this.y1);

    this.x2 = _x2;
    this.y2 = _y2;

    this.x = this.x1 = _x1;
    this.y = this.y1 = _y1;

    this.width = _x2 - _x1;
    this.height = _y2 - _y1;
  }

  draw(renderContext) {
    renderContext.lineWidth = 0.1;

    let lineShift = 0.5;

    if ((this.x1 != null) && (this.x2 != null) && (this.y1 != null) && (this.y2 != null)) {
      renderContext.drawLine(this.x1 + lineShift, this.y1 + lineShift, this.x2 + lineShift, this.y1 + lineShift, Settings.SELECTION_MARQUEE_COLOR, 0);
      renderContext.drawLine(this.x1 + lineShift, this.y2 + lineShift, this.x2 + lineShift, this.y2 + lineShift, Settings.SELECTION_MARQUEE_COLOR, 1);

      renderContext.drawLine(this.x1 + lineShift, this.y1 + lineShift, this.x1 + lineShift, this.y2 + lineShift, Settings.SELECTION_MARQUEE_COLOR, 1);
      renderContext.drawLine(this.x2 + lineShift, this.y1 + lineShift, this.x2 + lineShift, this.y2 + lineShift, Settings.SELECTION_MARQUEE_COLOR, 1);
    }
  }
}
