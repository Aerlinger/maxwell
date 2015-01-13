# <DEFINE>
define [
  'cs!settings/Settings',
  'cs!render/DrawHelper',
  'cs!geom/Polygon',
  'cs!geom/Rectangle',
  'cs!geom/Point',
  'cs!component/CircuitComponent'
], (Settings,
    DrawHelper,
    Polygon,
    Rectangle,
    Point,
    CircuitComponent) ->
# </DEFINE>
  class AntennaElm extends CircuitComponent

    constructor: (xa, ya, xb, yb, f, st) ->
      super this, xa, ya, xb, yb, f

  return AntennaElm
  