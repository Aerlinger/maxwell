class CircuitNodeLink {
  constructor(num = 0, elm = null) {
    this.num = num;
    this.elm = elm;
  }

  toJson() {
    return {
      num: this.num,
      elm: this.elm.toJson()
    };
  }

  toString() {
    return `${this.num} ${this.elm}`;
  }
}

module.exports = CircuitNodeLink;
