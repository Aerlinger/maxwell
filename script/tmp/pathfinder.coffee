# <DEFINE> 
define([
  'cs!=',
  'cs!To',
], (
  '=',
  'To',
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
    if node is @dest
      return true
    if (depth-- is 0) or @used[node]
      return false

    @used[node] = true

    for element in @elementList
      if element is @firstElm
        continue
      # TODO: Add Current Elm
      #if (element instanceof CurrentElm) and (@type is FindPathInfo.INDUCT)
      #  continue
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
        break if element.getNode(terminal_num) is node    #console.log(element + " " + ce.getNode(j));

      # TODO: ENSURE EQUALITY HERE
      continue if terminal_num is element.getPostCount()

      if element.hasGroundConnection(terminal_num) and @findPath(0, depth)
        @used[node] = false
        return true   #console.log(element + " has ground");

      if @type is Pathfinder.INDUCT and element instanceof InductorElm
        current = element.getCurrent()
        current = -current if terminal_num is 0

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
root = exports ? window
module.exports = Pathfinder
