# <DEFINE>
define [], () ->
# </DEFINE>

  class Hint

    @HINT_LC = "@HINT_LC"
    @HINT_RC = "@HINT_RC"
    @HINT_3DB_C = "@HINT_3DB_C"
    @HINT_TWINT = "@HINT_TWINT"
    @HINT_3DB_L = "@HINT_3DB_L"

    @hintType = -1
    @hintItem1 = -1
    @hintItem2 = -1


    constructor: (@Circuit) ->


    readHint: (st) ->
      if (typeof st == 'string')
        st = st.split(' ')

      @hintType = st[0]
      @hintItem1 = st[1]
      @hintItem2 = st[2]


    getHint: ->
      c1 = @Circuit.getElmByIdx(@hintItem1)
      c2 = @Circuit.getElmByIdx(@hintItem2)

      return null  if not c1? or not c2?

      if @hintType is @HINT_LC
        return null  unless c1 instanceof InductorElm
        return null  unless c2 instanceof CapacitorElm

        ie = c1   # as InductorElm
        ce = c2   # as CapacitorElm

        return "res.f = " + getUnitText(1 / (2 * Math.PI * Math.sqrt(ie.inductance * ce.capacitance)), "Hz")

      if @hintType is @HINT_RC
        return null  unless c1 instanceof ResistorElm
        return null  unless c2 instanceof CapacitorElm

        re = c1   # as ResistorElm
        ce = c2   # as CapacitorElm

        return "RC = " + getUnitText(re.resistance * ce.capacitance, "s")

      if @hintType is @HINT_3DB_C
        return null  unless c1 instanceof ResistorElm
        return null  unless c2 instanceof CapacitorElm

        re = c1   # as ResistorElm
        ce = c2   # as CapacitorElm

        return "f.3db = " + getUnitText(1 / (2 * Math.PI * re.resistance * ce.capacitance), "Hz")

      if @hintType is @HINT_3DB_L
        return null  unless c1 instanceof ResistorElm
        return null  unless c2 instanceof InductorElm

        re = c1   # as ResistorElm
        ie = c2   # as InductorElm

        return "f.3db = " + getUnitText(re.resistance / (2 * Math.PI * ie.inductance), "Hz")

      if @hintType is @HINT_TWINT
        return null  unless c1 instanceof ResistorElm
        return null  unless c2 instanceof CapacitorElm

        re = c1   # as ResistorElm
        ce = c2   # as CapacitorElm

        return "fc = " + getUnitText(1 / (2 * Math.PI * re.resistance * ce.capacitance), "Hz")

      null

  return Hint
