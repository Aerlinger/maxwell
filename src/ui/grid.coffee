# <DEFINE>
define [
  'cs!Settings',
], (
  Settings
) ->
# </DEFINE>

  class Grid
    constructor: () ->
      @updateSize()


    updateSize: () ->
      #@gridSize = Settings.SMALL_GRID ? (Settings.GRID_SIZE / 2) : Settings.GRID_SIZE

    snapGrid: (x) ->
      (x + @gridRound) & @gridMask;

  return Grid
