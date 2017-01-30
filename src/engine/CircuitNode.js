class CircuitNode {
  constructor(solver, x = 0, y = 0, intern = false, links = []) {
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
    return `Node: ${this.x} ${this.y} [${this.links}]`;
  }

  getVoltage() {
    return this.links.map(link => link.elm.nodes);
  }
      
  getNeighboringElements() {
    return this.links.map(link => link.elm);
  }
}

module.exports = CircuitNode;
