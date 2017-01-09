class CircuitNodeLink {
  constructor(num, elm) {
    if (num == null) { num = 0; }
    if (elm == null) { elm = null; }
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
    return `${this.num} ${this.elm.toString()}`;
  }
}

module.exports = CircuitNodeLink;
