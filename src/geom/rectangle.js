let Point = require("./point.js");

class Rectangle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
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
    this.x2 = this.x + this.width;
    this.y2 = this.y + this.height;

    let otherX = otherRect.x;
    let otherY = otherRect.y;
    let otherX2 = otherRect.x + otherRect.width;
    let otherY2 = otherRect.y + otherRect.height;

    return (this.x < otherX2) && (this.x2 > otherX) && (this.y < otherY2) && (this.y2 > otherY);
  }

  collidesWithComponent(circuitComponent) {
    return this.intersects(circuitComponent.getBoundingBox());
  }

  toString() {
    return `(${this.x}, ${this.y}) [w: ${this.width}, h: ${this.height}]`;
  }
}

module.exports = Rectangle;
