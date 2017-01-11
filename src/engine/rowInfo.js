class RowInfo {
  static initClass() {
  
    this.ROW_NORMAL = 0;
    this.ROW_CONST = 1;
    this.ROW_EQUAL = 2;
  }

  constructor() {
    this.type = RowInfo.ROW_NORMAL;

    this.nodeEq = 0;
    this.mapCol = 0;
    this.mapRow = 0;

    this.value = 0;
    this.rsChanges = false;
    this.lsChanges = false;
    this.dropRow = false;
  }

  toJson() {
    return {
      nodeEq: this.nodeEq,
      mapCol: this.mapCol,
      mapRow: this.mapRow,
      value: this.value,
      rsChanges: this.rsChanges,
      lsChanges: this.lsChanges,
      dropRow: this.dropRow,
      type: this.type
    };
  }

  toString() {
    return `RowInfo: type: ${this.type}, nodeEq: ${this.nodeEq}, mapCol: ${this.mapCol}, mapRow: ${this.mapRow}, value: ${this.value}, rsChanges: ${this.rsChanges}, lsChanges: ${this.lsChanges}, dropRow: ${this.dropRow}`;
  }
}
RowInfo.initClass();

module.exports = RowInfo;
