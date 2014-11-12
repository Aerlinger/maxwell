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
      @current = 0
      @curSourceValue = 0

    setup: (ic, cr, f) ->
      @inductance = ic
      @current = cr
      @flags = f

    isTrapezoidal: ->
      (@flags & Inductor.FLAG_BACK_EULER) is 0

    # @deprecated
    reset: ->
      @current = 0

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
        @compResistance = 2 * @inductance / Circuit.timeStep
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
        @curSourceValue = voltdiff / @compResistance + @current
      # backward euler
      else
        @curSourceValue = @current

    calculateCurrent: (voltdiff) ->
      # we check compResistance because this might get called
      # before stamp(), which sets compResistance, causing
      # infinite current
      @current = voltdiff / @compResistance + @curSourceValue  if @compResistance > 0
      @current

    doStep: (stamper, voltdiff) ->
      stamper.stampCurrentSource @nodes[0], @nodes[1], @curSourceValue
