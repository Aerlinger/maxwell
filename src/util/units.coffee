# <DEFINE>
define [], () ->
# </DEFINE>

  class Units

    @muString: "u"
    @ohmString: "ohm"

    @getUnitText: (value, unit, decimalPoints = 2) ->
      absValue = Math.abs(value)
      return "0 " + unit  if absValue < 1e-18
      return (value * 1e15).toFixed(decimalPoints) + " f" + unit  if absValue < 1e-12
      return (value * 1e12).toFixed(decimalPoints) + " p" + unit  if absValue < 1e-9
      return (value * 1e9).toFixed(decimalPoints) + " n" + unit  if absValue < 1e-6
      return (value * 1e6).toFixed(decimalPoints) + " " + Units.muString + unit  if absValue < 1e-3
      return (value * 1e3).toFixed(decimalPoints) + " m" + unit  if absValue < 1
      return (value).toFixed(decimalPoints) + " " + unit  if absValue < 1e3
      return (value * 1e-3).toFixed(decimalPoints) + " k" + unit  if absValue < 1e6
      return (value * 1e-6).toFixed(decimalPoints) + " M" + unit  if absValue < 1e9
      (value * 1e-9).toFixed(decimalPoints) + " G" + unit

  return Units