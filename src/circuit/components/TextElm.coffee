CircuitComponent = require('../circuitComponent.coffee')
Settings = require('../../settings/settings.coffee')
Polygon = require('../../geom/polygon.coffee')
Rectangle = require('../../geom/rectangle.coffee')
Point = require('../../geom/point.coffee')

class TextElm extends CircuitComponent

  @FLAG_CENTER = 1
  @FLAG_BAR = 2

  @Fields = {
    size: {
      name: "Pixel"
      unit: "Pixel"
      symbol: ""
      default_value: 24
      data_type: parseInt
      range: [0, 500]
      type: "attribute"
    },
    text: {
      default_value: "<text>"
      type: "attribute"
      data_type: (x) -> x
    }
    # FLAGS
#    @FLAG_CENTER: 1
#    @FLAG_BAR: 2
  }

  constructor: (xa, ya, xb, yb, params, f) ->
    @text = "<TextElm>"
    @lines = new Array() # new vector()
    @lines.push @text
    @size = 24

    super(xa, ya, xb, yb, params, f)

#    if st
#      st = st.split(" ")  if typeof st is "string"
#      @size = Math.floor(st.shift())
#      @text = st.shift()
#      @text += " " + st.shift()  until st.length is 0

  stamp: ->

  split: ->
    @lines = @text.split("\n")

  getDumpType: ->
    "x"

  drag: (xx, yy) ->
    @x1 = xx
    @y1 = yy
    @x2 = xx + 16
    @y2 = yy

  draw: (renderContext) ->
    if CircuitComponent.DEBUG
      super(renderContext)
#    color = (if @needsHighlight() then Settings.SELECT_COLOR else Settings.TEXT_COLOR)

    color = Settings.TEXT_COLOR
    @setBbox @x1, @y1, @x2, @y2

#      f = new Font("SansSerif", 0, size)
#      g.setFont f
#      fm = g.getFontMetrics()
#      maxw = -1

#      for i in [0...lines.length]
#        w = fm.stringWidth(@lines[i])
#        maxw = w  if w > maxw

#      cury = y

#      while i in [0...@lines.length]
#        s = (@lines[i])
#        x = (Circuit.winSize.width - fm.stringWidth(s)) / 2  unless (@flags & TextElm.FLAG_CENTER) is 0
#        g.drawString s, @x1, cury
#        unless (@flags & TextElm.FLAG_BAR) is 0
#          by_ = cury - fm.getAscent()
#          CircuitComponent.drawLine @x1, by_, @x1 + fm.stringWidth(s) - 1, by_
#        @adjustBbox @x1, cury - fm.getAscent(), @x1 + fm.stringWidth(s), cury + fm.getDescent()
#        cury += fm.getHeight()
#        i++

    i = 0
    for line in @lines
      renderContext.fillText(line, 40, 15*i + 100)
      i++

    @x2 = @boundingBox.x1 + @boundingBox.width
    @y2 = @boundingBox.y1 + @boundingBox.height

  isCenteredText: ->
    (@flags & TextElm.FLAG_CENTER) isnt 0

  getInfo: (arr) ->
    arr[0] = @text

  getPostCount: ->
    0


module.exports = TextElm
