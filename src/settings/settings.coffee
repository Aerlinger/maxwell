###
Stores Environment-specific settings

These are the global settings for Maxwell and should defined by the user.
Settings do not change by loading a new circuit.
###

# <DEFINE>
define ['cs!ColorPalette'], (ColorPalette) ->

# </DEFINE>

  class Settings
    @SPEED = 112
    @FRACTIONAL_DIGITS: 2

    # Line Widths:
    @POST_RADIUS: 3
    @CURRENT_RADIUS: 3
    @LINE_WIDTH: 2

    # Grid
    @GRID_SIZE: 16
    @SMALL_GRID: false

    # ColorPalettes:
    @SELECT_COLOR: ColorPalette.orange
    @POST_COLOR_SELECTED: ColorPalette.orange
    @POST_COLOR: ColorPalette.black
    @DOTS_COLOR: ColorPalette.yellow
    @DOTS_OUTLINE: ColorPalette.orange

    @TEXT_COLOR: ColorPalette.black
    @TEXT_ERROR_COLOR: ColorPalette.red
    @TEXT_WARNING_COLOR: ColorPalette.yellow

    @SELECTION_MARQUEE_COLOR: ColorPalette.orange

    @GRID_COLOR: ColorPalette.darkyellow
    @BG_COLOR: ColorPalette.white
    @FG_COLOR: ColorPalette.darkgray
    @ERROR_COLOR: ColorPalette.darkred
    @WARNING_COLOR: ColorPalette.orange

  return Settings
