(function() {
  define([], function() {
    var RowInfo;
    RowInfo = (function() {
      RowInfo.ROW_NORMAL = 0;

      RowInfo.ROW_CONST = 1;

      RowInfo.ROW_EQUAL = 2;

      function RowInfo() {
        this.type = RowInfo.ROW_NORMAL;
        this.nodeEq = 0;
        this.mapCol = 0;
        this.mapRow = 0;
        this.value = 0;
        this.rsChanges = false;
        this.lsChanges = false;
        this.dropRow = false;
      }

      RowInfo.prototype.toString = function() {
        return "RowInfo: type: " + this.type + ", nodeEq: " + this.nodeEq + ", mapCol: " + this.mapCol + ", mapRow: " + this.mapRow + ", value: " + this.value + ", rsChanges: " + this.rsChanges + ", lsChanges: " + this.lsChanges + ", dropRow: " + this.dropRow;
      };

      return RowInfo;

    })();
    return RowInfo;
  });

}).call(this);
