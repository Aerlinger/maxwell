# <DEFINE>
define [
  'cs!VoltageElm',
  'cs!CurrentElm',
  'cs!ResistorElm'
], (
VoltageElm,
CurrentElm,
ResistorElm
) ->
# </DEFINE>

  class Pathfinder
    @INDUCT: 1
    @VOLTAGE: 2
    @SHORT: 3
    @CAP_V: 4

    constructor: (@type, @firstElm, @dest, @elementList, numNodes) ->
      @used = new Array(numNodes)


    findPath: (n1, depth) ->
      return true if n1 is @dest
      return false if (depth-- is 0)

      if @used[n1]
        return false

      @used[n1] = true

      for ce in @elementList
        if ce is @firstElm
          continue
        if (ce instanceof CurrentElm) and (@type is FindPathInfo.INDUCT)
          continue
        if @type is Pathfinder.VOLTAGE
          if (ce.isWire() or ce instanceof VoltageElm)
            continue
        if @type is Pathfinder.SHORT and not ce.isWire()
          continue 
        if (@type is Pathfinder.CAP_V)
          if !(ce.isWire() or ce instanceof CapacitorElm or ce instanceof VoltageElm)
            continue

        if n1 is 0
          # Look for posts which have a ground connection. Our path can go through ground!
          for j in [0...ce.getPostCount()]
            if ce.hasGroundConnection(j) and @findPath(ce.getNode(j), depth)
              @used[n1] = false
              return true

        j = 0
        for j in [0...ce.getPostCount()]
          console.log(ce + " " + ce.getNode(j));
          if ce.getNode(j) is n1
            break

        # TODO: ENSURE EQUALITY HERE
        if j is ce.getPostCount()
          continue

        if ce.hasGroundConnection(j) and @findPath(0, depth)
          console.log(ce + " has ground");
          @used[n1] = false
          return true

        if @type is Pathfinder.INDUCT and ce instanceof InductorElm
          c = ce.getCurrent()
          if j is 0
            c = -c

          console.log(ce + " > " + @firstElm + " >> matching " + ce + " to " + @firstElm.getCurrent());
          if Math.abs(c - @firstElm.getCurrent()) > 1e-10
            continue

        for k in [0...ce.getPostCount()]
          continue if j is k

          console.log(ce + " " + ce.getNode(j) + " - " + ce.getNode(k));
          if ce.getConnection(j, k) and @findPath(ce.getNode(k), depth)
            @used[n1] = false
            console.log("got findpath " + n1 + " on element " + ce);
            return true

      @used[n1] = false

      console.log(n1 + " failed");

      return false


  return Pathfinder