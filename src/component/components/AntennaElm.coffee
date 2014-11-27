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

CircuitComponent,
) ->
# </DEFINE>


  class AntennaElm extends CircuitComponent

    constructor: (xa, ya, xb, yb, f, st) ->
      super this, xa, ya, xb, yb, f

  return AntennaElm