CircuitComponent = require("../CircuitComponent.coffee")
ChipElm = require("./ChipElm.coffee")
Util = require('../../util/util.coffee')

class TimerElm extends ChipElm
  @FLAG_RESET = 2
  @N_DIS = 0
  @N_TRIG = 1
  @N_THRES = 2
  @N_VIN = 3
  @N_CTL = 4
  @N_OUT = 5
  @N_RST = 6

  constructor: (xa, xb, ya, yb, params, f) ->
    super(xa, xb, ya, yb, params, f)

  getName: ->
    "555 Timer"

  getDumpType: ->
    "165"

  getPostCount: ->
    if @hasReset() then 7 else 6

  getVoltageSourceCount: ->
    1

  getDumpType: ->
    165

  nonLinear: ->
    true

  hasReset: ->
    (@flags & TimerElm.FLAG_RESET) != 0

  setupPins: ->
    @sizeX = 3
    @sizeY = 5

    @pins = new Array(7)
    @pins[TimerElm.N_DIS] = new ChipElm.Pin(1, TimerElm.SIDE_W, "dis")
    @pins[TimerElm.N_TRIG] = new ChipElm.Pin(3, TimerElm.SIDE_W, "tr")
    @pins[TimerElm.N_TRIG].lineOver = true
    @pins[TimerElm.N_THRES] = new ChipElm.Pin(4, TimerElm.SIDE_W, "th")
    @pins[TimerElm.N_VIN] = new ChipElm.Pin(1, TimerElm.SIDE_N, "Vin")
    @pins[TimerElm.N_CTL] = new ChipElm.Pin(1, TimerElm.SIDE_S, "ctl")
    @pins[TimerElm.N_OUT] = new ChipElm.Pin(2, TimerElm.SIDE_E, "out")
    @pins[TimerElm.N_OUT].output = @pins[TimerElm.N_OUT].state = true
    @pins[TimerElm.N_RST] = new ChipElm.Pin(1, TimerElm.SIDE_E, "rst")

  stamp: (stamper) ->
    # stamp voltage divider to put ctl pin at 2/3 V
    stamper.stampResistor(@nodes[TimerElm.N_VIN], @nodes[TimerElm.N_CTL], 5000)
    stamper.stampResistor(@nodes[TimerElm.N_CTL], 0, 10000)

    # output pin
    stamper.stampVoltageSource(0, @nodes[TimerElm.N_OUT], @pins[TimerElm.N_OUT].voltSource)

    # discharge pin
    stamper.stampNonLinear(@nodes[TimerElm.N_DIS])

  startIteration: ->
    @out = @volts[TimerElm.N_OUT] > @volts[TimerElm.N_VIN] / 2

    @setOut = false

    if (@volts[TimerElm.N_CTL] / 2 > @volts[TimerElm.N_TRIG])
      @setOut = @out = true

    if (@volts[TimerElm.N_THRES] > @volts[TimerElm.N_CTL] || (@hasReset() && @volts[TimerElm.N_RST] < 0.7))
      @out = false

  doStep: (stamper) ->
    output = if @out then @volts[TimerElm.N_VIN] else 0

    if !@out && !@setOut
      stamper.stampResistor(@nodes[TimerElm.N_DIS], 0, 10)

    stamper.updateVoltageSource(0, @nodes[TimerElm.N_OUT], @pins[TimerElm.N_OUT].voltSource, output)

  calculateCurrent: ->
    @pins[TimerElm.N_VIN].current = (@volts[TimerElm.N_CTL] - @volts[TimerElm.N_VIN]) / 5000
    @pins[TimerElm.N_CTL].current = -@volts[TimerElm.N_CTL] / 10000 - @pins[TimerElm.N_VIN].current

    discharge_current = if (!@out && !@setOut)
      -@volts[TimerElm.N_DIS] / 10
    else
      0

    @pins[TimerElm.N_DIS].current = discharge_current

module.exports = TimerElm
