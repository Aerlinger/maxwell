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


    findPath: (node, depth) ->
      return true if node is @dest
      return false if (depth-- is 0)
      return false if @used[node]

      @used[node] = true

      for element in @elementList
        if element is @firstElm
          continue
        # TODO: Add Current Elm
        if (element instanceof CurrentElm) and (@type is FindPathInfo.INDUCT)
          continue
        if @type is Pathfinder.VOLTAGE and (element.isWire() or element instanceof VoltageElm)
          continue
        if @type is Pathfinder.SHORT and not element.isWire()
          continue
        if (@type is Pathfinder.CAP_V)
          continue unless element.isWire() or element instanceof CapacitorElm or element instanceof VoltageElm

        if node is 0
          # Look for posts which have a ground connection. Our path can go through ground!
          for j in Array(element.getPostCount())
            if element.hasGroundConnection(j) and @findPath(element.getNode(j), depth)
              @used[node] = false
              return true

        terminal_num = 0
        for terminal_num in Array(element.getPostCount())
          console.log(element + " " + element.getNode(terminal_num));
          break if element.getNode(terminal_num) is node

        # TODO: ENSURE EQUALITY HERE
        continue if terminal_num is element.getPostCount()

        if element.hasGroundConnection(terminal_num) and @findPath(0, depth)
          @used[node] = false
          console.log(element + " has ground");
          return true

        if @type is Pathfinder.INDUCT and element instanceof InductorElm
          current = element.getCurrent()
          current = -current if terminal_num is 0

          console.log(element + " > " + @firstElm + " >> matching " + element + " to " + @firstElm.getCurrent());
          continue if Math.abs(current - @firstElm.getCurrent()) > 1e-10

        for next_terminal_num in [0...element.getPostCount()]
          continue if terminal_num is next_terminal_num

          console.log(element + " " + element.getNode(terminal_num) + " - " + element.getNode(next_terminal_num));
          if element.getConnection(terminal_num, next_terminal_num) and @findPath(element.getNode(next_terminal_num), depth)
            @used[node] = false
            console.log("got findpath " + node + " on element " + element);
            return true

      console.log("back on findpath " + node);
      @used[node] = false

      console.log(node + " failed");
      return false


  return Pathfinder