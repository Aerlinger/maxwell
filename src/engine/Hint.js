class Hint {
  static initClass() {
    this.HINT_LC = "@HINT_LC";
    this.HINT_RC = "@HINT_RC";
    this.HINT_3DB_C = "@HINT_3DB_C";
    this.HINT_TWINT = "@HINT_TWINT";
    this.HINT_3DB_L = "@HINT_3DB_L";
  
    this.hintType = -1;
    this.hintItem1 = -1;
    this.hintItem2 = -1;
  }

  constructor(Circuit) {
    this.Circuit = Circuit;
  }

  readHint(st) {
    if (typeof st === 'string') {
      st = st.split(' ');
    }

    this.hintType = st[0];
    this.hintItem1 = st[1];
    return this.hintItem2 = st[2];
  }

  getHint() {
    let ce, ie, re;
    let c1 = this.Circuit.getElmByIdx(this.hintItem1);
    let c2 = this.Circuit.getElmByIdx(this.hintItem2);

    if ((c1 == null) || (c2 == null)) { return null; }

    if (this.hintType === this.HINT_LC) {
      if (!(c1 instanceof InductorElm)) { return null; }
      if (!(c2 instanceof CapacitorElm)) { return null; }

      ie = c1;   // as InductorElm
      ce = c2;   // as CapacitorElm

      return `res.f = ${getUnitText(1 / (2 * Math.PI * Math.sqrt(ie.inductance * ce.capacitance)), "Hz")}`;
    }

    if (this.hintType === this.HINT_RC) {
      if (!(c1 instanceof ResistorElm)) { return null; }
      if (!(c2 instanceof CapacitorElm)) { return null; }

      re = c1;   // as ResistorElm
      ce = c2;   // as CapacitorElm

      return `RC = ${getUnitText(re.resistance * ce.capacitance, "s")}`;
    }

    if (this.hintType === this.HINT_3DB_C) {
      if (!(c1 instanceof ResistorElm)) { return null; }
      if (!(c2 instanceof CapacitorElm)) { return null; }

      re = c1;   // as ResistorElm
      ce = c2;   // as CapacitorElm

      return `f.3db = ${getUnitText(1 / (2 * Math.PI * re.resistance * ce.capacitance), "Hz")}`;
    }

    if (this.hintType === this.HINT_3DB_L) {
      if (!(c1 instanceof ResistorElm)) { return null; }
      if (!(c2 instanceof InductorElm)) { return null; }

      re = c1;   // as ResistorElm
      ie = c2;   // as InductorElm

      return `f.3db = ${getUnitText(re.resistance / (2 * Math.PI * ie.inductance), "Hz")}`;
    }

    if (this.hintType === this.HINT_TWINT) {
      if (!(c1 instanceof ResistorElm)) { return null; }
      if (!(c2 instanceof CapacitorElm)) { return null; }

      re = c1;   // as ResistorElm
      ce = c2;   // as CapacitorElm

      return `fc = ${getUnitText(1 / (2 * Math.PI * re.resistance * ce.capacitance), "Hz")}`;
    }

    return null;
  }
}
Hint.initClass();

module.exports = Hint;
