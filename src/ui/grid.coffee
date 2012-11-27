Settings = require('../settings/settings')

class Grid
  constructor: () ->
    @updateSize()


  updateSize: () ->
    #@gridSize = Settings.SMALL_GRID ? (Settings.GRID_SIZE / 2) : Settings.GRID_SIZE

  snapGrid: (x) ->
    (x + @gridRound) & @gridMask;

module.exports = Grid