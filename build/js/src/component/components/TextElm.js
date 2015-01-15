(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent) {
    var TextElm;
    TextElm = (function(_super) {
      __extends(TextElm, _super);

      TextElm.FLAG_CENTER = 1;

      TextElm.FLAG_BAR = 2;

      function TextElm() {
        var st;
        TextElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
        this.text = "hello";
        this.lines = new Array();
        this.lines.add(text);
        this.size = 24;
        if (st) {
          if (typeof st === "string") {
            st = st.split(" ");
          }
          this.size = Math.floor(st.shift());
          this.text = st.shift();
          while (st.length !== 0) {
            this.text += " " + st.shift();
          }
        }
      }

      TextElm.prototype.split = function() {
        return this.lines = this.text.split("\n");
      };

      TextElm.prototype.dump = function() {
        return TextElm.__super__.dump.call(this) + " " + this.size + " " + this.text;
      };

      TextElm.prototype.getDumpType = function() {
        return "x";
      };

      TextElm.prototype.drag = function(xx, yy) {
        this.x1 = xx;
        this.y = yy;
        this.x2 = xx + 16;
        return this.y2 = yy;
      };

      TextElm.prototype.draw = function(renderContext) {
        var color, i, line, _i, _len, _ref;
        color = (this.needsHighlight() ? Settings.SELECT_COLOR : Settings.TEXT_COLOR);
        this.setBbox(this.x1, this.y, this.x1, this.y);
        i = 0;
        _ref = this.lines;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          line = _ref[_i];
          renderContext.fillText(line, 40, 15 * i + 100);
          i++;
        }
        this.x2 = this.boundingBox.x1 + this.boundingBox.width;
        return this.y2 = this.boundingBox.y + this.boundingBox.height;
      };

      TextElm.prototype.getEditInfo = function(n) {
        var ei;
        if (n === 0) {
          ei = new EditInfo("Text", 0, -1, -1);
          ei.text = text;
          return ei;
        }
        if (n === 1) {
          return new EditInfo("Size", size, 5, 100);
        }
        if (n === 2) {
          ei = new EditInfo("", 0, -1, -1);
          ei.checkbox = new Checkbox("Center", (this.flags & TextElm.FLAG_CENTER) !== 0);
          return ei;
        }
        if (n === 3) {
          ei = new EditInfo("", 0, -1, -1);
          ei.checkbox = new Checkbox("Draw Bar On Top", (this.flags & TextElm.FLAG_BAR) !== 0);
          return ei;
        }
        return null;
      };

      TextElm.prototype.setEditValue = function(n, ei) {
        if (n === 0) {
          this.text = ei.textf.getText();
          this.split();
        }
        if (n === 1) {
          this.size = Math.floor(ei.value);
        }
        if (n === 3) {
          if (ei.checkbox.getState()) {
            this.flags |= TextElm.FLAG_BAR;
          } else {
            this.flags &= ~TextElm.FLAG_BAR;
          }
        }
        if (n === 2) {
          if (ei.checkbox.getState()) {
            return this.flags |= TextElm.FLAG_CENTER;
          } else {
            return this.flags &= ~TextElm.FLAG_CENTER;
          }
        }
      };

      TextElm.prototype.isCenteredText = function() {
        return (this.flags & TextElm.FLAG_CENTER) !== 0;
      };

      TextElm.prototype.getInfo = function(arr) {
        return arr[0] = this.text;
      };

      TextElm.prototype.getPostCount = function() {
        return 0;
      };

      return TextElm;

    })(CircuitComponent);
    return TextElm;
  });

}).call(this);
