#  == title ==
#   @description:
#  
#   @requires:
#      - foo.js
#
#   @exports:
#      - bar.js
#
# @author: Anthony Erlinger
#


class ArrayUtils
  @zeroArray2: (numRows, numCols) ->
    zeros = [1..numRows].map ->
      0 for i in [1..numCols]

  @zeroArray: (arr) ->
    arr = 0 for i in [1..arr.length]

  # Loops through an array, returning false and throwing an error if NaN or Inf values are found.
  #  If no NaN or Inf values are found, this array is determined to be clean and the method returns true.
  @isClean: (arr) ->
    console.log(arr)
    for element in arr
      if element instanceof Array
        valid = arguments.callee element
      else
        if !isFinite(element)
          console.warn("Invalid number found: #{element}")
          printStackTrace()
          return false


# Footer to allow this class to be exported via node.js. This allows this class to be required by Mocha for testing
# This should be present at the bottom of every file in order to be read through Mocha.
root = exports ? window
module.exports = ArrayUtils
