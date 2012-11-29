/* TODO: Not yet fully implemented */
TextElm.prototype = new CircuitElement();
TextElm.prototype.constructor = TextElm;

function TextElm(xa, ya, xb, yb, f, st) {
    CircuitElement.call(this, xa, ya, xb, yb, f);

    this.text = "hello";
    this.lines = new Array();  // new vector()
    this.lines.add(text);
    this.size = 24;

    if (st) {
        if (typeof st == 'string')
            st = st.split(" ");

        this.size = Math.floor(st.shift())
        this.text = st.shift();

        while (st.length != 0)
            this.text += ' ' + st.shift();
    }

}
;


TextElm.FLAG_CENTER = 1;
TextElm.FLAG_BAR = 2;


/*
 public TextElm(int xx, int yy) {
 super(xx, yy);
 text = "hello";
 lines = new Vector();
 lines.add(text);
 size = 24;
 }

 public TextElm(int xa, int ya, int xb, int yb, int f,
 StringTokenizer st) {
 super(xa, ya, xb, yb, f);
 size = new Integer(st.nextToken()).intValue();
 text = st.nextToken();
 while (st.hasMoreTokens())
 text += ' ' + st.nextToken();
 split();
 }
 */
TextElm.prototype.split = function () {
    this.lines = this.text.split('\n');
    /*
     int i;
     lines = new Vector();
     StringBuffer sb = new StringBuffer(text);
     for (i = 0; i < sb.length(); i++) {
     char c = sb.charAt(i);
     if (c == '\\') {
     sb.deleteCharAt(i);
     c = sb.charAt(i);
     if (c == 'n') {
     lines.add(sb.substring(0, i));
     sb.delete(0, i + 1);
     i = -1;
     continue;
     }
     }
     }
     lines.add(sb.toString());
     */
};


TextElm.prototype.dump = function () {
    return CircuitElement.prototype.dump.call(this) + " " + this.size + " " + this.text;
};

TextElm.prototype.getDumpType = function () {
    return 'x';
};

TextElm.prototype.drag = function (xx, yy) {
    this.x1 = xx;
    this.y = yy;
    this.x2 = xx + 16;
    this.y2 = yy;
};

TextElm.prototype.draw = function () {
    var color = this.needsHighlight() ? CircuitElement.selectColor : Color.LIGHT_GREY;

    var f = new Font("SansSerif", 0, size);
    g.setFont(f);
    var fm = g.getFontMetrics();
    var i;
    var maxw = -1;
    for (i = 0; i != lines.size(); i++) {
        var w = fm.stringWidth(this.lines[i]);
        if (w > maxw)
            maxw = w;
    }
    var cury = y;
    this.setBbox(this.x1, this.y, this.x1, this.y);
    var i = 0;
    for (i = 0; i != this.lines.length; i++) {
        var s = (this.lines[i]);
        if ((this.flags & TextElm.FLAG_CENTER) != 0)
            x = (Circuit.winSize.width - fm.stringWidth(s)) / 2;
        g.drawString(s, this.x1, cury);
        if ((this.flags & TextElm.FLAG_BAR) != 0) {
            var by = cury - fm.getAscent();
            CircuitElement.drawLine(this.x1, by, this.x1 + fm.stringWidth(s) - 1, by);
        }
        this.adjustBbox(this.x1, cury - fm.getAscent(),
            this.x1 + fm.stringWidth(s), cury + fm.getDescent());
        cury += fm.getHeight();
    }
    this.x2 = this.boundingBox.x1 + this.boundingBox.width;
    this.y2 = this.boundingBox.y + this.boundingBox.height;
};

TextElm.prototype.getEditInfo = function (n) {
    if (n == 0) {
        var ei = new EditInfo("Text", 0, -1, -1);
        ei.text = text;
        return ei;
    }
    if (n == 1)
        return new EditInfo("Size", size, 5, 100);
    if (n == 2) {
        var ei = new EditInfo("", 0, -1, -1);
        ei.checkbox =
            new Checkbox("Center", (this.flags & TextElm.FLAG_CENTER) != 0);
        return ei;
    }
    if (n == 3) {
        var ei = new EditInfo("", 0, -1, -1);
        ei.checkbox =
            new Checkbox("Draw Bar On Top", (this.flags & TextElm.FLAG_BAR) != 0);
        return ei;
    }
    return null;
};

TextElm.setEditValue = function (n, ei) {
    if (n == 0) {
        this.text = ei.textf.getText();
        this.split();
    }
    if (n == 1)
        this.size = Math.floor(ei.value);
    if (n == 3) {
        if (ei.checkbox.getState())
            this.flags |= TextElm.FLAG_BAR;
        else
            this.flags &= ~TextElm.FLAG_BAR;
    }
    if (n == 2) {
        if (ei.checkbox.getState())
            this.flags |= TextElm.FLAG_CENTER;
        else
            this.flags &= ~TextElm.FLAG_CENTER;
    }
};

TextElm.prototype.isCenteredText = function () {
    return (this.flags & TextElm.FLAG_CENTER) != 0;
};

TextElm.prototype.getInfo = function (arr) {
    arr[0] = this.text;
};

TextElm.prototype.getPostCount = function () {
    return 0;
};