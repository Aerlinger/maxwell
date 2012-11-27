class RowInfo

  @ROW_NORMAL: 0
  @ROW_CONST: 1
  @ROW_EQUAL: 2

  constructor: ->
    @type = RowInfo.ROW_NORMAL

    @nodeEq = 0;
    @type = 0;
    @mapCol = 0;
    @mapRow = 0;

    @value = 0;
    @rsChanges = false;
    @lsChanges = false;
    @dropRow = false;


module.exports = RowInfo