class MathUtils
  @isInf: (num) ->
    return num > 1e18

  @sign: (x) ->
    return (x < 0) ? -1 : (x == 0) ? 0 : 1

  @getRand: (x) ->
    Math.floor Math.random() * (x + 1)

# The Footer exports class(es) in this file via Node.js, if it is defined.
# This is necessary for testing through Mocha in development mode.
#
# see script/test and the /test directory for details.
#
# To require this class in another file through Node, write {ClassName} = require(<path_to_coffee_file>)
root = module ? window
module.exports = MathUtils