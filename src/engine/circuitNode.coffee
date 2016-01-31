class CircuitNode
  constructor: (@x=0, @y=0, @intern=false, @links=[]) ->

  toJson: ->
    {
      x: @x,
      y: @y,
      internal: @intern,
      links: @links.map (link) -> link.toJson()
    }

  toString: ->
    "CircuitNode: #{@x} #{@y} #{@intern} [#{@links.toString()}]"

module.exports = CircuitNode
