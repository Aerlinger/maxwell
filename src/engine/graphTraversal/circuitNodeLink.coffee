# <DEFINE>
define [], () ->
  # </DEFINE>

  class CircuitNodeLink
    constructor: (@num=0, @elm=null) ->

    toString: () ->
      "#{@num} #{@elm.toString()}"


  return CircuitNodeLink