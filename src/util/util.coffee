Point = require('../geom/point.coffee')
Polygon = require('../geom/polygon.coffee')
Settings = require('../settings/settings.coffee')
sprintf = require("sprintf-js").sprintf

class Util

  # Calculate fractional vector between AB
  @interpolate: (ptA, ptB, u, v = 0) ->
    dx = ptB.y - ptA.y
    dy = ptA.x - ptB.x
    v /= Math.sqrt dx*dx + dy*dy

    interpX = Math.round((1-u)*ptA.x + (u*ptB.x) + v*dx)
    interpY = Math.round((1-u)*ptA.y + (u*ptB.y) + v*dy)

    new Point(interpX, interpY)

  ##
  # From a vector between points AB, calculate a new point in space relative to some multiple of the parallel (u)
  # and perpindicular (v) components of the the original AB vector.
  #
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

  @createPolygon: (pt1, pt2, pt3, pt4) ->
    newPoly = new Polygon()
    newPoly.addVertex pt1.x, pt1.y
    newPoly.addVertex pt2.x, pt2.y
    newPoly.addVertex pt3.x, pt3.y
    newPoly.addVertex pt4.x, pt4.y if pt4

    return newPoly

  @createPolygonFromArray: (vertexArray) ->
    newPoly = new Polygon()
    for vertex in vertexArray
      newPoly.addVertex vertex.x, vertex.y

    return newPoly

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

  @getVoltageColor: (volts, fullScaleVRange=10) ->
    RedGreen =
      [ "#ff0000", "#f70707", "#ef0f0f", "#e71717", "#df1f1f", "#d72727", "#cf2f2f", "#c73737",
        "#bf3f3f", "#b74747", "#af4f4f", "#a75757", "#9f5f5f", "#976767", "#8f6f6f", "#877777",
        "#7f7f7f", "#778777", "#6f8f6f", "#679767", "#5f9f5f", "#57a757", "#4faf4f", "#47b747",
        "#3fbf3f", "#37c737", "#2fcf2f", "#27d727", "#1fdf1f", "#17e717", "#0fef0f", "#07f707", "#00ff00" ]

    scale =
      ["#B81B00", "#B21F00", "#AC2301", "#A72801", "#A12C02", "#9C3002", "#963503", "#913903",
        "#8B3E04", "#854205", "#804605", "#7A4B06", "#754F06", "#6F5307", "#6A5807", "#645C08",
        "#5F6109", "#596509", "#53690A", "#4E6E0A", "#48720B", "#43760B", "#3D7B0C", "#387F0C",
        "#32840D", "#2C880E", "#278C0E", "#21910F", "#1C950F", "#169910", "#119E10", "#0BA211", "#06A712"]

    blueScale =
      ["#EB1416", "#E91330", "#E7134A", "#E51363", "#E3137C", "#E11394", "#E013AC", "#DE13C3",
        "#DC13DA", "#C312DA", "#AA12D8", "#9012D7", "#7712D5", "#5F12D3", "#4612D1", "#2F12CF",
        "#1712CE", "#1123CC", "#1139CA", "#114FC8", "#1164C6", "#1179C4", "#118EC3", "#11A2C1",
        "#11B6BF", "#10BDB1", "#10BB9B", "#10BA84", "#10B86F", "#10B659", "#10B444", "#10B230", "#10B11C"]

    numColors = scale.length - 1

    value = Math.floor (volts + fullScaleVRange) * numColors / (2 * fullScaleVRange)
    if value < 0
      value = 0
    else if value >= numColors
      value = numColors - 1

    return scale[value]

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
