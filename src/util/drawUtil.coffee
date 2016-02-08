Point = require('../geom/point')
Polygon = require('../geom/polygon')
Settings = require('../settings/settings')

class DrawUtil
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

    [p1, p2] = DrawUtil.interpolateSymmetrical point1, point2, 1 - al / dist, aw

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

  @printArray: (arr) ->
    console.log(subarr) for subarr in arr



module.exports = DrawUtil
