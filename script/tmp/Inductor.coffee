# <DEFINE>
define([
], (
) ->
# </DEFINE>


Inductor = ->
  @nodes = new Array(2)
  @flags = 0
  @inductance = 0
  @compResistance = 0
  @current = 0
  @curSourceValue = 0
Inductor.FLAG_BACK_EULER = 2
Inductor::setup = (ic, cr, f) ->
  @inductance = ic
  @current = cr
  @flags = f

Inductor::isTrapezoidal = ->
  (@flags & Inductor.FLAG_BACK_EULER) is 0

Inductor::reset = ->
  @current = 0

Inductor::stamp = (n0, n1) ->
  
  # inductor companion model using trapezoidal or backward euler
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
  Circuit.stampResistor @nodes[0], @nodes[1], @compResistance
  Circuit.stampRightSide @nodes[0]
  Circuit.stampRightSide @nodes[1]

Inductor::nonLinear = ->
  false

Inductor::startIteration = (voltdiff) ->
  if @isTrapezoidal()
    @curSourceValue = voltdiff / @compResistance + @current
  # backward euler
  else
    @curSourceValue = @current

Inductor::calculateCurrent = (voltdiff) ->
  
  # we check compResistance because this might get called
  # before stamp(), which sets compResistance, causing
  # infinite current
  @current = voltdiff / @compResistance + @curSourceValue  if @compResistance > 0
  @current

Inductor::doStep = (voltdiff) ->
  Circuit.stampCurrentSource @nodes[0], @nodes[1], @curSourceValue
