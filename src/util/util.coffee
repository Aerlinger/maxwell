Point = require('../geom/point.coffee')
Polygon = require('../geom/polygon.coffee')
Settings = require('../settings/settings.coffee')
sprintf = require("sprintf-js").sprintf

class Util
  @snapGrid: (x) ->
    (x + (Settings.GRID_SIZE / 2 - 1)) & ~(Settings.GRID_SIZE - 1)

  @interpolate: (ptA, ptB, u, v = 0) ->
    dx = ptB.y - ptA.y
    dy = ptA.x - ptB.x
    v /= Math.sqrt dx*dx + dy*dy

    interpX = Math.round((1-u)*ptA.x + (u*ptB.x) + v*dx)
    interpY = Math.round((1-u)*ptA.y + (u*ptB.y) + v*dy)

    new Point(interpX, interpY)

  @interpolateSymmetrical: (ptA, ptB, u, v) ->
    dx = ptB.y - ptA.y
    dy = ptA.x - ptB.x
    v /= Math.sqrt dx*dx + dy*dy

    interpX = Math.round((1-u)*ptA.x + (u*ptB.x) + v*dx)
    interpY = Math.round((1-u)*ptA.y + (u*ptB.y) + v*dy)

    interpXReflection = Math.round((1-u)*ptA.x + (u*ptB.x) - v*dx)
    interpYReflection = Math.round((1-u)*ptA.y + (u*ptB.y) - v*dy)

    [new Point(interpX, interpY), new Point(interpXReflection, interpYReflection)]

  @calcArrow: (point1, point2, al, aw) ->
    poly = new Polygon()

    dx = point2.x - point1.x
    dy = point2.y - point1.y
    dist = Math.sqrt(dx * dx + dy * dy)

    poly.addVertex point2.x, point2.y

    [p1, p2] = Util.interpolateSymmetrical point1, point2, 1 - al / dist, aw

    poly.addVertex p1.x, p1.y
    poly.addVertex p2.x, p2.y

    return poly

  @createPolygonFromArray: (vertexArray) ->
    newPoly = new Polygon()
    for vertex in vertexArray
      newPoly.addVertex vertex.x, vertex.y

    return newPoly

  @snapGrid: (x) ->
    (x + (Settings.GRID_SIZE / 2 - 1)) & ~(Settings.GRID_SIZE - 1)

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
          return false

  @newPointArray = (n) ->
    a = new Array(n)
    while (n > 0)
      a[--n] = new Point(0, 0)

    return a

  @drawValue: (x1, y1, circuitElm, str) ->

  @printArray: (arr) ->
    console.log(subarr) for subarr in arr

  @removeFromArray: (arr, items...) ->
    for item in items
      while (ax = arr.indexOf(item)) isnt -1
        arr.splice ax, 1

    arr

  @isInfinite: (x)->
    !isFinite(x)

  @getRand: (x) ->
    Math.floor Math.random() * (x + 1)

  @getUnitText: (value, unit, decimalPoints = 2) ->
    absValue = Math.abs(value)
    return "0 " + unit  if absValue < 1e-18
    return (value * 1e15).toFixed(decimalPoints) + " f" + unit  if absValue < 1e-12
    return (value * 1e12).toFixed(decimalPoints) + " p" + unit  if absValue < 1e-9
    return (value * 1e9).toFixed(decimalPoints) + " n" + unit  if absValue < 1e-6
    return (value * 1e6).toFixed(decimalPoints) + " μ" + unit  if absValue < 1e-3
    return (value * 1e3).toFixed(decimalPoints) + " m" + unit  if absValue < 1
    return (value).toFixed(decimalPoints) + " " + unit  if absValue < 1e3
    return (value * 1e-3).toFixed(decimalPoints) + " k" + unit  if absValue < 1e6
    return (value * 1e-6).toFixed(decimalPoints) + " M" + unit  if absValue < 1e9
    (value * 1e-9).toFixed(decimalPoints) + " G" + unit

  @snapGrid: (x) ->
    Settings.GRID_SIZE * Math.round(x/Settings.GRID_SIZE)


  @showFormat: (decimalNum) ->
    decimalNum.toPrecision(2)

  @shortFormat: (decimalNum) ->
    return decimalNum.toPrecision(1);

  @longFormat: (decimalNum) ->
    decimalNum.toPrecision(4)

  @tidyFloat: (f) ->
    sprintf("%0.2f", f)

  ###
  Removes commas from a number containing a string:
  e.g. 1,234,567.99 -> 1234567.99
  ###
  @noCommaFormat: (numberWithCommas) ->
    numberWithCommas.replace(/,/g, '');

  @printArray: (array) ->
    matrixRowCount = array.length

    arrayStr = "["

    for i in [0...matrixRowCount]
      arrayStr += Util.tidyFloat(array[i])

      if(i != matrixRowCount - 1)
        arrayStr += ", "
        circuitMatrixDump += ", "

    arrayStr += "]"

    return arrayStr

  @printMatrix: (matrix) ->


    ###
    Adds commas to a number, and returns the string representation of that number
    e.g. 1234567.99 -> 1,234,567.99
    ###
  @commaFormat: (plainNumber) ->
# Simple method of converting a parameter to a string
    plainNumber += ""

    # Ignore any numbers after a '.'
    x = plainNumber.split(".")
    x1 = x[0]
    x2 = (if x.length > 1 then "." + x[1] else "")
    pattern = /(\d+)(\d{3})/
    x1 = x1.replace(pattern, "$1" + "," + "$2")  while pattern.test(x1)
    x1 + x2


module.exports = Util
