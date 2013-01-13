# <DEFINE>
define([
], (
) ->
# </DEFINE>



# Add the following UI elements
VarRailElm = (xa, ya, xb, yb, f, st) ->
  RailElm.call this, xa, ya, xb, yb, f, st
  @sliderText = "voltage"
  @frequency = @maxVoltage
  @createSlider()
VarRailElm:: = new RailElm()
VarRailElm::constructor = VarRailElm
VarRailElm::slider
VarRailElm::label
VarRailElm::sliderText
VarRailElm::dump = ->
  RailElm::dump.call(this) + " " + @sliderText

VarRailElm::getDumpType = ->
  172

VarRailElm::createSlider = ->


# Todo: implement
VarRailElm.getVoltage = ->
  frequency = slider.getValue() * (maxVoltage - bias) / 100. + bias
  frequency

VarRailElm::destroy = ->
  Circuit.main.remove label
  Circuit.main.remove slider

VarRailElm::getEditInfo = (n) ->
  return new EditInfo("Min Voltage", bias, -20, 20)  if n is 0
  return new EditInfo("Max Voltage", maxVoltage, -20, 20)  if n is 1
  if n is 2
    ei = new EditInfo("Slider Text", 0, -1, -1)
    ei.text = sliderText
    return ei
  null

VarRailElm::setEditValue = (n, ei) ->
  bias = ei.value  if n is 0
  maxVoltage = ei.value  if n is 1
  if n is 2
    sliderText = ei.textf.getText()
    label.setText sliderText
