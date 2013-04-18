# <DEFINE>
define [
  'cs!Settings',
  'cs!DrawHelper',
  'cs!Polygon',
  'cs!Rectangle',
  'cs!Point',
  'cs!CircuitComponent',
  'cs!Units'
], (
  Settings,
  DrawHelper,
  Polygon,
  Rectangle,
  Point,

  CircuitComponent,
  Units
) ->
# </DEFINE>

  class TextElm extends CircuitComponent

    @FLAG_CENTER: 1
    @FLAG_BAR: 2

    constructor: ->
      super(xa, ya, xb, yb, f)
      @text = "hello"
      @lines = new Array() # new vector()
      @lines.add text
      @size = 24
      if st
        st = st.split(" ")  if typeof st is "string"
        @size = Math.floor(st.shift())
        @text = st.shift()
        @text += " " + st.shift()  until st.length is 0


    #
    # public TextElm(int xx, int yy) {
    # super(xx, yy);
    # text = "hello";
    # lines = new Vector();
    # lines.add(text);
    # size = 24;
    # }
    #
    # public TextElm(int xa, int ya, int xb, int yb, int f,
    # StringTokenizer st) {
    # super(xa, ya, xb, yb, f);
    # size = new Integer(st.nextToken()).intValue();
    # text = st.nextToken();
    # while (st.hasMoreTokens())
    # text += ' ' + st.nextToken();
    # split();
    # }
    #
    split: ->
      @lines = @text.split("\n")


    #
    #     int i;
    #     lines = new Vector();
    #     StringBuffer sb = new StringBuffer(text);
    #     for (i = 0; i < sb.length(); i++) {
    #     char c = sb.charAt(i);
    #     if (c == '\\') {
    #     sb.deleteCharAt(i);
    #     c = sb.charAt(i);
    #     if (c == 'n') {
    #     lines.add(sb.substring(0, i));
    #     sb.delete(0, i + 1);
    #     i = -1;
    #     continue;
    #     }
    #     }
    #     }
    #     lines.add(sb.toString());
    #
    dump: ->
      CircuitComponent::dump.call(this) + " " + @size + " " + @text

    getDumpType: ->
      "x"

    drag: (xx, yy) ->
      @x1 = xx
      @y = yy
      @x2 = xx + 16
      @y2 = yy

    draw: ->
      color = (if @needsHighlight() then CircuitComponent.selectColor else Color.LIGHT_GREY)
      f = new Font("SansSerif", 0, size)
      g.setFont f
      fm = g.getFontMetrics()
      i = undefined
      maxw = -1
      i = 0
      while i isnt lines.size()
        w = fm.stringWidth(@lines[i])
        maxw = w  if w > maxw
        i++
      cury = y
      @setBbox @x1, @y, @x1, @y
      i = 0
      i = 0
      while i isnt @lines.length
        s = (@lines[i])
        x = (Circuit.winSize.width - fm.stringWidth(s)) / 2  unless (@flags & TextElm.FLAG_CENTER) is 0
        g.drawString s, @x1, cury
        unless (@flags & TextElm.FLAG_BAR) is 0
          by_ = cury - fm.getAscent()
          CircuitComponent.drawLine @x1, by_, @x1 + fm.stringWidth(s) - 1, by_
        @adjustBbox @x1, cury - fm.getAscent(), @x1 + fm.stringWidth(s), cury + fm.getDescent()
        cury += fm.getHeight()
        i++
      @x2 = @boundingBox.x1 + @boundingBox.width
      @y2 = @boundingBox.y + @boundingBox.height

    getEditInfo: (n) ->
      if n is 0
        ei = new EditInfo("Text", 0, -1, -1)
        ei.text = text
        return ei
      return new EditInfo("Size", size, 5, 100)  if n is 1
      if n is 2
        ei = new EditInfo("", 0, -1, -1)
        ei.checkbox = new Checkbox("Center", (@flags & TextElm.FLAG_CENTER) isnt 0)
        return ei
      if n is 3
        ei = new EditInfo("", 0, -1, -1)
        ei.checkbox = new Checkbox("Draw Bar On Top", (@flags & TextElm.FLAG_BAR) isnt 0)
        return ei
      null

    setEditValue: (n, ei) ->
      if n is 0
        @text = ei.textf.getText()
        @split()
      @size = Math.floor(ei.value)  if n is 1
      if n is 3
        if ei.checkbox.getState()
          @flags |= TextElm.FLAG_BAR
        else
          @flags &= ~TextElm.FLAG_BAR
      if n is 2
        if ei.checkbox.getState()
          @flags |= TextElm.FLAG_CENTER
        else
          @flags &= ~TextElm.FLAG_CENTER

    isCenteredText: ->
      (@flags & TextElm.FLAG_CENTER) isnt 0

    getInfo: (arr) ->
      arr[0] = @text

    getPostCount: ->
      0


  return TextElm