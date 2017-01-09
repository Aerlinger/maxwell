class CircuitNode {
  constructor(solver, x, y, intern, links) {
    if (x == null) { x = 0; }
    if (y == null) { y = 0; }
    if (intern == null) { intern = false; }
    if (links == null) { links = []; }
    this.solver = solver;
    this.x = x;
    this.y = y;
    this.intern = intern;
    this.links = links;
  }

  toJson() {
    return {
      x: this.x,
      y: this.y,
      internal: this.intern,
      links: this.links.map(link => link.toJson())
    };
  }

  toString() {
    return `CircuitNode: ${this.x} ${this.y} ${this.intern} [${this.links.toString()}]`;
  }

  getVoltage() {
    return this.links.map(link => link.elm.nodes);
  }
      
  getNeighboringElements() {
    return this.links.map(link => link.elm);
  }
}

module.exports = CircuitNode;
