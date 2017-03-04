let Point = require("./Point.js");

class Rectangle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  x1() {
    return Math.min(this.x, this.x + this.width);
  }

  y1() {
    return Math.min(this.y, this.y + this.height);
  }

  x2() {
    return Math.max(this.x, this.x + this.width);
  }

  y2() {
    return Math.max(this.y, this.y + this.height);
  }

  contains(x, y) {
    return ((x >= this.x) && (x <= (this.x + this.width)) && (y >= this.y) && (y <= (this.y + this.height)));
  }

  getCenter() {
    return new Point(this.x + this.width/2, this.y + this.height/2);
  }

  equals(otherRect) {
    if (otherRect != null) {
      if( (otherRect.x === this.x) && (otherRect.y === this.y) &&
          (otherRect.width === this.width) && (otherRect.height === this.height) ) {
        return true;
      }
    }
    return false;
  }

  intersects(otherRect) {
    return (this.x1() < otherRect.x2()) && (this.x2() > otherRect.x1()) &&
           (this.y1() < otherRect.y2()) && (this.y2() > otherRect.y1())
  }

  collidesWithComponent(circuitComponent) {
    return this.intersects(circuitComponent.getBoundingBox());
  }

  toString() {
    return `(${this.x}, ${this.y}) [w: ${this.width}, h: ${this.height}]`;
  }
}

module.exports = Rectangle;
