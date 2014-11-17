# <DEFINE>
define [
  'cs!Settings',
  'cs!DrawHelper',
  'cs!Polygon',
  'cs!Rectangle',
  'cs!Point',
  'cs!CircuitComponent',
  'cs!RailElm',
  'cs!Units'
], (
  Settings,
  DrawHelper,
  Polygon,
  Rectangle,
  Point,

  CircuitComponent,
  RailElm,
  Units
) ->
# </DEFINE>

  class VarRailElm extends RailElm

    constructor: (xa, ya, xb, yb, f, st) ->
      super xa, ya, xb, yb, f, st

#      @sliderText = "voltage"
      @frequency = @maxVoltage
#      @createSlider()


    dump: ->
      super()

    getDumpType: ->
      172

    createSlider: ->


      # Todo: implement
    getVoltage: ->
      super()
#      frequency = slider.getValue() * (maxVoltage - bias) / 100.0 + bias
#      frequency

    destroy: ->
#      Circuit.main.remove label
#      Circuit.main.remove slider

    getEditInfo: (n) ->
      return new EditInfo("Min Voltage", bias, -20, 20)  if n is 0
      return new EditInfo("Max Voltage", maxVoltage, -20, 20)  if n is 1
      if n is 2
        ei = new EditInfo("Slider Text", 0, -1, -1)
        ei.text = sliderText
        return ei
      null

    setEditValue: (n, ei) ->
      bias = ei.value  if n is 0
      maxVoltage = ei.value  if n is 1
      if n is 2
        sliderText = ei.textf.getText()
        label.setText sliderText

  return VarRailElm