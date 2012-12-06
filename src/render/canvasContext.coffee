Context = require './context'
Canvas = require 'canvas'
Settings = require '../settings/settings'

class CanvasContext extends Context
  constructor: (@width, @height) ->
    @canvas = new Canvas(@width, @height)
    @context = @canvas.getContext('2d')

  fillCircle: (x, y, radius, lineWidth=1, fillColor='#FFFFFF', lineColor="#000000") ->
    @context.fillStyle = fillColor
    @context.strokeStyle = lineColor
    @context.beginPath()
    @context.lineWidth = lineWidth
    @context.arc x, y, radius, 0, 2 * Math.PI, true
    @context.stroke()
    @context.fill()
    @context.closePath()

  drawThickLine: (x, y, x2, y2, color=Settings.color) ->
    @context.strokeStyle = color
    @context.beginPath()
    @context.moveTo x, y
    @context.lineTo x2, y2
    @context.stroke()
    @context.closePath()

  drawThickLinePt: (pa, pb, color) ->
    @drawThickLine pa.x, pa.y, pb.x, pb.y, color

  drawThickPolygon: (xlist, ylist, color) ->
    #while i < (c.length - 1)
    for i in [0...(xlist.length-1)]
      @drawThickLine xlist[i], ylist[i], xlist[i+1], ylist[i+1], color
    @drawThickLine xlist[i], ylist[i], xlist[0], ylist[0], color

  drawThickPolygonP: (polygon, color) ->
    numVertices = polygon.numPoints()
    #while i < (numVertices - 1)
    for i in [0...numVertices]
      @drawThickLine polygon.getX(i), polygon.getY(i), polygon.getX(i+1), polygon.getY(i+1), color
    @drawThickLine polygon.getX(i), polygon.getY(i), polygon.getX(0), polygon.getY(0), color

  clear: () ->
    @context.clearRect(0, 0, @width, @height)

  getContext: () ->
    return @context

  getCanvas: () ->
    return @canvas

module.exports = CanvasContext