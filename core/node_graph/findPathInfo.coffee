class FindPathInfo

  @INDUCT: 1
  @VOLTAGE: 2
  @SHORT: 3
  @CAP_V: 4

  constructor: (@type, @firstElm, @dest, @elementList, numNodes) ->
    @used = new Array(numNodes)


  findPath: (node, depth) ->

    return true if node is @dest
    return false if (depth-- is 0) or @used[node]

    @used[node] = true

    for element in @elementList
      continue if element is @firstElm
      continue if element instanceof CurrentElm if @type is FindPathInfo.INDUCT
      continue unless element.isWire() or element instanceof VoltageElm if @type is FindPathInfo.VOLTAGE
      continue if @type is FindPathInfo.SHORT and not element.isWire()
      if @type is FindPathInfo.CAP_V
        continue unless element.isWire() or element instanceof CapacitorElm or element instanceof VoltageElm

      if node is 0
        # Look for posts which have a ground connection. Our path can go through ground!
        for j in [0...element.getPostCount()]
          if element.hasGroundConnection(j) and @findPath(element.getNode(j), depth)
            @used[node] = false
            return true

      for terminal_num in [0...element.getPostCount()]
        break if element.getNode(terminal_num) is node    #console.log(element + " " + ce.getNode(j));

      # TODO: ENSURE EQUALITY HERE
      continue if terminal_num is element.getPostCount()

      if element.hasGroundConnection(terminal_num) and @findPath(0, depth)
        @used[node] = false
        return true   #console.log(element + " has ground");

      if @type is FindPathInfo.INDUCT and element instanceof InductorElm
        current = element.getCurrent()
        current = -current  if terminal_num is 0

        #console.log(element + " > " + firstElm + " >> matching " + c + " to " + firstElm.getCurrent());
        continue if Math.abs(current - @firstElm.getCurrent()) > 1e-10

      for next_terminal_num in [0...element.getPostCount()]
        continue if terminal_num is next_terminal_num

        #console.log(ce + " " + ce.getNode(j) + "-" + ce.getNode(k));
        if element.getConnection(terminal_num, next_terminal_num) and @findPath(element.getNode(next_terminal_num), depth)
          @used[node] = false
          return true #console.log("got findpath " + n1);

    @used[node] = false   #console.log("back on findpath " + n1);

    return false   #console.log(n1 + " failed");



# The Footer exports class(es) in this file via Node.js, if Node.js is defined.
# This is necessary for testing through Mocha in development mode.
#
# see script/test and the /test directory for details.
#
# To require this class in another file through Node, write {ClassName} = require(<path_to_coffee_file>)
root = exports ? window
root.FindPathInfo = FindPathInfo