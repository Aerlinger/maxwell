# <DEFINE>
define [
  'cs!Settings',
  'cs!DrawHelper',
  'cs!Polygon',
  'cs!Rectangle',
  'cs!Point',
  'cs!CircuitComponent'
], (
  Settings,
  DrawHelper,
  Polygon,
  Rectangle,
  Point,

  CircuitComponent
) ->
  # </DEFINE>

  class LogicOutputElm extends CircuitComponent

    constructor: (xa, ya, xb, yb, f, st) ->
      super(xa, ya, xb, yb, f)

  return LogicOutputElm
