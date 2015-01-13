# <DEFINE>
define [
  'cs!settings/Settings',
  'cs!render/DrawHelper',
  'cs!geom/Polygon',
  'cs!geom/Rectangle',
  'cs!geom/Point',
  'cs!component/CircuitComponent'
], (
  Settings,
  DrawHelper,
  Polygon,
  Rectangle,
  Point,

  CircuitComponent
) ->
  # </DEFINE>

  class LogicInputElm extends CircuitComponent

    constructor: (xa, ya, xb, yb, f, st) ->
      super(xa, ya, xb, yb, f)

  return LogicInputElm
