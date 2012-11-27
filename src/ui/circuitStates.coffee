class ColorMapState
  @SHOW_POWER   = "SHOW_POWER"
  @SHOW_VOLTAGE = "SHOW_VOLTAGE"


class MouseState

  # Available mouse modes (Only one can be active at a time)
  @MODE_ADD_ELM       = "MODE_ADD_ELM"
  @MODE_DRAG_ALL      = "MODE_DRAG_ALL"
  @MODE_DRAG_ROW      = "MODE_DRAG_ROW"
  @MODE_DRAG_COLUMN   = "MODE_DRAG_COLUMN"
  @MODE_DRAG_SELECTED = "MODE_DRAG_SELECTED"
  @MODE_DRAG_POST     = "MODE_DRAG_POST"
  @MODE_SELECT        = "MODE_SELECT"     # The default

  mouseMode: @MODE_SELECT

  # Available mouse buttons (Only one can be active at a time)
  @LEFT_MOUSE_BTN   = 0
  @MIDDLE_MOUSE_BTN = 1
  @RIGHT_MOUSE_BTN  = 2
  @NO_MOUSE_BTN     = 3     # The default

  mouseButtonDown: @NO_MOUSE_BTN

  dragX: 0
  dragY: 0
  initDragX: 0
  initDragY: 0

  dragElm = null
  menuElm = null
  dragging = false

  isDragging: ->
    return dragging


class KeyboardState

  @NO_KEY_DOWN  = 0
  @KEY_DELETE   = 46
  @KEY_SHIFT    = 16
  @KEY_CTRL     = 17
  @KEY_ALT      = 18

  @KEY_ESC      = 27

  keyDown: @NO_KEY_DOWN

exports.MouseState = MouseState
exports.KeyboardState = KeyboardState
exports.ColorMapState = ColorMapState
