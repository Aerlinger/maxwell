global.muString   = "u"
global.ohmString  = "ohm"

global.getUnitText = (v, u) ->
  va = Math.abs(v)
  return "0 " + u  if va < 1e-14
  return (v * 1e12).toFixed(2) + " p" + u  if va < 1e-9
  return (v * 1e9).toFixed(2) + " n" + u  if va < 1e-6
  return (v * 1e6).toFixed(2) + " " + Circuit.muString + u  if va < 1e-3
  return (v * 1e3).toFixed(2) + " m" + u  if va < 1
  return (v).toFixed(2) + " " + u  if va < 1e3
  return (v * 1e-3).toFixed(2) + " k" + u  if va < 1e6
  return (v * 1e-6).toFixed(2) + " M" + u  if va < 1e9
  (v * 1e-9).toFixed(2) + " G" + u