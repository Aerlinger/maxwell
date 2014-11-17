# <DEFINE>
define [], () ->
# </DEFINE>

  class RowInfo

    @ROW_NORMAL: 0
    @ROW_CONST: 1
    @ROW_EQUAL: 2

    constructor: ->
      @type = RowInfo.ROW_NORMAL

      @nodeEq = null;
      @mapCol = null;
      @mapRow = null;

      @value = null;
      @rsChanges = null;
      @lsChanges = null;
      @dropRow = null;

    toString: () ->
      "RowInfo: type: #{@type}, nodeEq: #{@nodeEq}, mapCol: #{@mapCol}, mapRow: #{@mapRow}, value: #{@value}, rsChanges: #{@rsChanges}, lsChanges: #{@lsChanges}, dropRow: #{@dropRow}"

  return RowInfo
