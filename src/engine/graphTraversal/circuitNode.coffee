class CircuitNode
  constructor: (@x=0, @y=0, @intern=false, @links=[]) ->

  toString: () ->
    "CircuitNode: #{@x} #{@y} #{@intern} [#{@links.toString()}]"

module.exports = CircuitNode
