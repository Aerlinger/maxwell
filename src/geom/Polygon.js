let Point = require('./Point.js');

class Polygon {
  constructor(vertices) {
    this.vertices = [];
    if (vertices && ((vertices.length % 2) === 0)) {
      let i = 0;
      while (i < vertices.length) {
        this.addVertex(vertices[i], vertices[i + 1]);
        i += 2;
      }
    }
  }

  addVertex(x, y) {
    return this.vertices.push(new Point(x, y));
  }

  getX(n) {
    return this.vertices[n].x;
  }

  getY(n) {
    return this.vertices[n].y;
  }

  numPoints() {
    return this.vertices.length;
  }

  toString(){
    return JSON.stringify(this.vertices);
  }
}

module.exports = Polygon;
