class CircuitNode
  constructor: ->
    @x1 = 0
    @y = 0
    @intern = false

    @links = []

class CircuitNodeLink
  constructor: ->
    @num = 0
    @elm = null

exports.CircuitNode = CircuitNode
exports.CircuitNodeLink = CircuitNodeLink