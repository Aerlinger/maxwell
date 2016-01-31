class CircuitNodeLink
  constructor: (@num=0, @elm=null) ->

  toJson: ->
    {
      num: @num,
      elm: @elm.toJson()
    }

  toString: ->
    "#{@num} #{@elm.toString()}"

module.exports = CircuitNodeLink
