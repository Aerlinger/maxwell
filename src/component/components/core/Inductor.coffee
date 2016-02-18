# <DEFINE>
define [], () ->
# </DEFINE>

  # @deprecated
  class Inductor
    @FLAG_BACK_EULER = 2

    constructor: ->
      @nodes = new Array(2)
      @flags = 0
      @inductance = 0
      @compResistance = 0
      @coilCurrent = 0
      @curSourceValue = 0

    setup: (ic, cr, f) ->
      @inductance = ic
      @coilCurrent = cr
      @flags = f

    isTrapezoidal: ->
      (@flags & Inductor.FLAG_BACK_EULER) is 0

    # @deprecated
    reset: ->
      @coilCurrent = 0

    # @deprecated
    stamp: (stamper, n0, n1) ->
      # Inductor companion model using trapezoidal or backward euler
      # approximations (Norton equivalent) consists of a current
      # source in parallel with a resistor.  Trapezoidal is more
      # accurate than backward euler but can cause oscillatory behavior.
      # The oscillation is a real problem in circuits with switches.
      @nodes[0] = n0
      @nodes[1] = n1

      if @isTrapezoidal()
        @compResistance = 2 * @inductance / @simParams().timeStep
      # backward euler
      else
        @compResistance = @inductance / Circuit.timeStep

      stamper.stampResistor @nodes[0], @nodes[1], @compResistance
      stamper.stampRightSide @nodes[0]
      stamper.stampRightSide @nodes[1]

    nonLinear: ->
      false

    startIteration: (voltdiff) ->
      if @isTrapezoidal()
        @curSourceValue = voltdiff / @compResistance + @coilCurrent
      # backward euler
      else
        @curSourceValue = @coilCurrent

    calculateCurrent: (voltdiff) ->
      # we check compResistance because this might get called
      # before stamp(), which sets compResistance, causing
      # infinite current
      @coilCurrent = voltdiff / @compResistance + @curSourceValue  if @compResistance > 0
      @coilCurrent

    doStep: (stamper, voltdiff) ->
      stamper.stampCurrentSource @nodes[0], @nodes[1], @curSourceValue
