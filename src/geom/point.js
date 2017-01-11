class Point {
  constructor(x, y) {
    // if (x == null) { x = 0; }
    // if (y == null) { y = 0; }
    this.x = x;
    this.y = y;
  }

  equals(otherPoint) {
    return ((this.x === otherPoint.x) && (this.y === otherPoint.y));
  }

  static toArray(num) {
    return (Array.from(Array(num)).map((i) => new Point(0, 0)));
  }

  static distanceSq(x1, y1, x2, y2) {
    x2 -= x1;
    y2 -= y1;
    return (x2 * x2) + (y2 * y2);
  }

  toString() {
    return `[\t${this.x}, \t${this.y}]`;
  }
}

module.exports = Point;
