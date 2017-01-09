#class MemristorElm extends CircuitComponent
#
#  @Fields = {
#    r_on: {
#      name: "On resistance"
#      data_type: parseFloat
#    }
#    r_off: {
#      name: "Off resistance"
#      data_type: parseFloat
#    }
#    dopeWidth: {
#      name: "Doping Width"
#      data_type: parseFloat
#    }
#    totalWidth: {
#      name: "Total Width"
#      data_type: parseFloat
#    }
#    mobility: {
#      name: "Majority carrier mobility"
#      data_type: parseFloat
#    }
#    resistance: {
#      name: "Overall resistance"
#      data_type: parseFloat
#    }
#  }
#
#  constructor: (xa, xb, ya, yb, params, f) ->
#    super(xa, xb, ya, yb, params, f)
#
#    if ((f & FLAG_FWDROP) == 0)
#      fwdrop = 2.1024259;
#
##    params.put("r_on", r_on);
##    params.put("r_off", r_off);
##    params.put("dopeWidth", dopeWidth);
##    params.put("totalWidth", totalWidth);
##    params.put("mobility", mobility);
##    params.put("resistance", resistance);
#
#    @setup();

