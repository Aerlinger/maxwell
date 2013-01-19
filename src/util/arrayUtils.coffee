# <DEFINE>
define [], () ->
# </DEFINE>


  # Add indexOf to Array prototype (useful for IE <= 8)
  unless Array::indexOf
    Array::indexOf = (searchItem, i = 0) ->
      while i < @length
        return i  if this[i] is searchItem
        ++i
      -1

  # Add a utility function (bound to the Array prototype) allowing
  #  elements to be removed from the array
  #  NOTE: remove() is not idempotent. Modifies the original array!
  Array::remove = ->
    a = arguments
    L = a.length
    while L and @length
      what = a[--L]
      while (ax = @indexOf(what)) isnt -1
        @splice ax, 1
    this


  class ArrayUtils

    @zeroArray: (numElements) ->
      return [] if numElements < 1
      return (0 for i in Array(numElements))

    @zeroArray2: (numRows, numCols) ->
      return [] if numRows < 1
      (@zeroArray(numCols) for i in Array(numRows))

    # Loops through an array, returning false and throwing an error if NaN or Inf values are found.
    #  If no NaN or Inf values are found, this array is determined to be clean and the method returns true.
    @isCleanArray: (arr) ->
      for element in arr
        if element instanceof Array
          valid = arguments.callee element
        else
          if !isFinite(element)
            console.warn("Invalid number found: #{element}")
            console.printStackTrace()
            return false

  return ArrayUtils