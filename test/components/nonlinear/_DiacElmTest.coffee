#class DiacElm extends CircuitComponent
#
#  @ParameterDefinitions = {
#    onresistance: {
#      name: "On Resistance"
#      data_type: parseFloat
#    }
#    offresistance: {
#      name: "Off Resistance"
#      data_type: parseFloat
#    }
#    breakdown: {
#      name: "Breakdown Voltage"
#      data_type: parseFloat
#    }
#    holdCurrent: {
#      name: "Hold Current"
#      data_type: parseFloat
#    }
#  }
#
#  constructor: (xa, xb, ya, yb, params, f) ->
#    super(xa, xb, ya, yb, params, f)
#
#    params.put("onresistance", onresistance);
#    params.put("offresistance", offresistance);
#    params.put("breakdown", breakdown);
#    params.put("holdcurrent", holdcurrent);
#

