SparkGapElm = (xa, ya, xb, yb, f, st) ->
  AbstractCircuitComponent.call this, xa, ya, xb, yb, f
  @resistance = 0
  @offresistance = 1e9
  @onresistance = 1e3
  @breakdown = 1e3
  @holdcurrent = 0.001
  @state = false
  if st
    st = st.split(" ")  if typeof st is "string"
    @onresistance = parseFloat(st.shift())  if st
    @offresistance = parseFloat(st.shift())  if st
    @breakdown = parseFloat(st.shift())  if st
    @holdcurrent = parseFloat(st.shift())  if st
SparkGapElm:: = new AbstractCircuitComponent()
SparkGapElm::constructor = SparkGapElm
SparkGapElm::nonLinear = ->
  true

SparkGapElm::getDumpType = ->
  187

SparkGapElm::dump = ->
  AbstractCircuitComponent::dump.call(this) + " " + @onresistance + " " + @offresistance + " " + @breakdown + " " + @holdcurrent

SparkGapElm::arrow1 # Polgons
SparkGapElm::arrow2
SparkGapElm::setPoints = ->
  AbstractCircuitComponent::setPoints.call this
  dist = 16
  alen = 8
  @calcLeads dist + alen
  p1 = AbstractCircuitComponent.interpPointPt(@point1, @point2, (@dn - alen) / (2 * @dn))
  @arrow1 = AbstractCircuitComponent.calcArrow(@point1, p1, alen, alen)
  p1 = AbstractCircuitComponent.interpPointPt(@point1, @point2, (@dn + alen) / (2 * @dn))
  @arrow2 = AbstractCircuitComponent.calcArrow(@point2, p1, alen, alen)

SparkGapElm::draw = ->
  i = undefined
  v1 = @volts[0]
  v2 = @volts[1]
  @setBboxPt @point1, @point2, 8
  @draw2Leads()
  @setPowerColor true
  color = @setVoltageColor(@volts[0])
  AbstractCircuitComponent.drawThickPolygonP @arrow1, color
  color = @setVoltageColor(@volts[1])
  AbstractCircuitComponent.drawThickPolygonP @arrow2, color
  @doDots()  if @state
  @drawPosts()

SparkGapElm::calculateCurrent = ->
  vd = @volts[0] - @volts[1]
  @current = vd / @resistance

SparkGapElm::reset = ->
  AbstractCircuitComponent::reset.call this
  @state = false

SparkGapElm::startIteration = ->
  @state = false  if Math.abs(@current) < @holdcurrent
  vd = @volts[0] - @volts[1]
  @state = true  if Math.abs(vd) > @breakdown

SparkGapElm::doStep = ->
  @resistance = (if (@state) then @onresistance else @offresistance)
  Circuit.stampResistor @nodes[0], @nodes[1], @resistance

SparkGapElm::stamp = ->
  Circuit.stampNonLinear @nodes[0]
  Circuit.stampNonLinear @nodes[1]

SparkGapElm::getInfo = (arr) ->
  arr[0] = "spark gap"
  @getBasicInfo arr
  arr[3] = (if @state then "on" else "off")
  arr[4] = "Ron = " + AbstractCircuitComponent.getUnitText(@onresistance, Circuit.ohmString)
  arr[5] = "Roff = " + AbstractCircuitComponent.getUnitText(@offresistance, Circuit.ohmString)
  arr[6] = "Vbreakdown = " + AbstractCircuitComponent.getUnitText(@breakdown, "V")

SparkGapElm::getEditInfo = (n) ->
  
  # ohmString doesn't work here on linux
  return new EditInfo("On resistance (ohms)", @onresistance, 0, 0)  if n is 0
  return new EditInfo("Off resistance (ohms)", @offresistance, 0, 0)  if n is 1
  return new EditInfo("Breakdown voltage", @breakdown, 0, 0)  if n is 2
  return new EditInfo("Holding current (A)", @holdcurrent, 0, 0)  if n is 3
  null

SparkGapElm::getEditInfo = (n, ei) ->
  onresistance = ei.value  if ei.value > 0 and n is 0
  offresistance = ei.value  if ei.value > 0 and n is 1
  breakdown = ei.value  if ei.value > 0 and n is 2
  holdcurrent = ei.value  if ei.value > 0 and n is 3

SparkGapElm::needsShortcut = ->
  false
