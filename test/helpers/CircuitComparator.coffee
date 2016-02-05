jsondiffpatch = require('jsondiffpatch').create({});
flatdiff = require('deep-diff').diff;

glob = require("glob")

class CircuitComparator
  constructor: (@circuitJsonActual, @circuitJsonIdeal) ->
    @delta = jsondiffpatch.diff(@circuitJsonActual, @circuitJsonIdeal)
    @deltas = flatdiff.diff(@circuitJsonActual, @circuitJsonIdeal)

  diffType: (diff) ->
    if diff.length == 3
      "deleted"
    else if diff.length == 2
      "modified"
    else if diff.length == 1
      "added"
    else
      raise "Error, #{diff} is not an array"


  assertSameParams: ->
    @delta["startCircuit"] # [ 'ohms.txt', 0, 0 ]
    @delta["timeStep"] # [ 0.000005, 0, 0 ]
    @delta["setupList"] # [ @delta["'"]TBD', 0, 0 ]
    @delta["circuitNonLinear"] # [ false, 0, 0 ]
    @delta["voltageSourceCount"] # [ 7, 0, 0 ]
    @delta["circuitMatrixSize"] # [ 8, 0, 0 ]
    @delta["circuitMatrixFullSize"] # [ 14, 0, 0 ]
    @delta["circuitPermute"] #[ [ 7, 2, 3, 3, 6, 5, 6, 7, 0, 0, 0, 0, 0, 0 ], 0, 0 ]

  deltas: ->
    flatdiff()

  generateReport: (filename) ->


module.exports = CircuitComparator

#cc = new CircuitComparator({a: 3}, {b: 2});

#console.log(cc.delta)

#console.log(cc.numDeltas())

