# <DEFINE>
define [], () ->
  # </DEFINE>

  class KeyboardState
    @NO_KEY_DOWN  = 0
    @KEY_DELETE   = 46
    @KEY_SHIFT    = 16
    @KEY_CTRL     = 17
    @KEY_ALT      = 18

    @KEY_ESC      = 27

    keyDown: @NO_KEY_DOWN

  return KeyboardState