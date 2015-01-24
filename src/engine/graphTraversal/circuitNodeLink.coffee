class CircuitNodeLink
  constructor: (@num=0, @elm=null) ->

  toString: () ->
    "#{@num} #{@elm.toString()}"

module.exports = CircuitNodeLink
