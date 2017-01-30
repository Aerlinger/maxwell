class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  equals(otherPoint) {
    return ((this.x === otherPoint.x) && (this.y === otherPoint.y));
  }

  diff(otherPoint) {
    return new Point(this.x - otherPoint.x, this.y - otherPoint.y);
  }

  static distanceSq(x1, y1, x2, y2) {
    x2 -= x1;
    y2 -= y1;
    return (x2 * x2) + (y2 * y2);
  }

  static toArray(num) {
    return (Array.from(Array(num)).map((i) => new Point(0, 0)));
  }

  toString() {
    return `[${this.x}, ${this.y}]`;
  }
}

module.exports = Point;
