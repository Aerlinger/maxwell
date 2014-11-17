# <DEFINE>
define [], () ->
# </DEFINE>

  class CircuitNode
    constructor: (@x=0, @y=0, @intern=false, @links=[]) ->

    toString: () ->
#      "cn: [#{@x},\t#{@y}] #{@intern} [#{@links.toString()}]"
      "cn: [#{@x},\t#{@y}] #{@intern}]"

  return CircuitNode