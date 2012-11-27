zeroArray = (numElements) ->
  return (0 for i in [1..numElements])

zeroArray2 = (numRows, numCols) ->
  (zeroArray(numCols) for i in [1..numRows])

# Loops through an array, returning false and throwing an error if NaN or Inf values are found.
#  If no NaN or Inf values are found, this array is determined to be clean and the method returns true.
isCleanArray = (arr) ->
  console.log(arr)
  for element in arr
    if element instanceof Array
      valid = arguments.callee element
    else
      if !isFinite(element)
        console.warn("Invalid number found: #{element}")
        printStackTrace()
        return false