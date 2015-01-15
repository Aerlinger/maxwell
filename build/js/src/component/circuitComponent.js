(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!util/MathUtils', 'cs!util/ArrayUtils'], function(Settings, DrawHelper, Rectangle, Point, MathUtils, ArrayUtils) {
    var CircuitComponent;
    CircuitComponent = (function() {
      function CircuitComponent(x1, y1, x2, y2, flags, st) {
        this.x1 = x1 != null ? x1 : 100;
        this.y1 = y1 != null ? y1 : 100;
        this.x2 = x2 != null ? x2 : 100;
        this.y2 = y2 != null ? y2 : 200;
        if (flags == null) {
          flags = 0;
        }
        if (st == null) {
          st = [];
        }
        this.drawDots = __bind(this.drawDots, this);
        this.destroy = __bind(this.destroy, this);
        this.current = 0;
        this.curcount = 0;
        this.noDiagonal = false;
        this.selected = false;
        this.dragging = false;
        this.parentCircuit = null;
        this.focused = false;
        this.flags = flags || this.getDefaultFlags();
        this.setPoints();
        this.allocNodes();
        this.initBoundingBox();
        this.component_id = MathUtils.getRand(100000000) + (new Date()).getTime();
      }

      CircuitComponent.prototype.getParentCircuit = function() {
        return this.Circuit;
      };

      CircuitComponent.prototype.isBeingDragged = function() {
        return this.dragging;
      };

      CircuitComponent.prototype.beingDragged = function(dragging) {
        return this.dragging = dragging;
      };

      CircuitComponent.prototype.allocNodes = function() {
        this.nodes = ArrayUtils.zeroArray(this.getPostCount() + this.getInternalNodeCount());
        return this.volts = ArrayUtils.zeroArray(this.getPostCount() + this.getInternalNodeCount());
      };

      CircuitComponent.prototype.setPoints = function() {
        this.dx = this.x2 - this.x1;
        this.dy = this.y2 - this.y1;
        this.dn = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
        this.dpx1 = this.dy / this.dn;
        this.dpy1 = -this.dx / this.dn;
        this.dsign = (this.dy === 0 ? MathUtils.sign(this.dx) : MathUtils.sign(this.dy));
        this.point1 = new Point(this.x1, this.y1);
        return this.point2 = new Point(this.x2, this.y2);
      };

      CircuitComponent.prototype.setPowerColor = function(color) {
        return console.warn("Set power color not yet implemented");
      };

      CircuitComponent.prototype.getDumpType = function() {
        return 0;
      };

      CircuitComponent.prototype.reset = function() {
        this.volts = ArrayUtils.zeroArray(this.volts.length);
        return this.curcount = 0;
      };

      CircuitComponent.prototype.setCurrent = function(x, current) {
        return this.current = current;
      };

      CircuitComponent.prototype.getCurrent = function() {
        return this.current;
      };

      CircuitComponent.prototype.getVoltageDiff = function() {
        return this.volts[0] - this.volts[1];
      };

      CircuitComponent.prototype.getPower = function() {
        return this.getVoltageDiff() * this.current;
      };

      CircuitComponent.prototype.calculateCurrent = function() {};

      CircuitComponent.prototype.doStep = function() {};

      CircuitComponent.prototype.orphaned = function() {
        return this.Circuit === null || this.Circuit === void 0;
      };

      CircuitComponent.prototype.destroy = function() {
        return this.Circuit.desolder(this);
      };

      CircuitComponent.prototype.startIteration = function() {};

      CircuitComponent.prototype.getPostVoltage = function(post_idx) {
        return this.volts[post_idx];
      };

      CircuitComponent.prototype.setNodeVoltage = function(node_idx, voltage) {
        this.volts[node_idx] = voltage;
        return this.calculateCurrent();
      };

      CircuitComponent.prototype.calcLeads = function(len) {
        if (this.dn < len || len === 0) {
          this.lead1 = this.point1;
          this.lead2 = this.point2;
          console.log("Len: " + len);
          return;
        }
        this.lead1 = DrawHelper.interpPoint(this.point1, this.point2, (this.dn - len) / (2 * this.dn));
        return this.lead2 = DrawHelper.interpPoint(this.point1, this.point2, (this.dn + len) / (2 * this.dn));
      };

      CircuitComponent.prototype.updateDotCount = function(cur, cc) {
        var cadd;
        if (isNaN(cur) || (cur == null)) {
          cur = this.current;
        }
        if (isNaN(cc) || (cc == null)) {
          cc = this.curcount;
        }
        cadd = cur * this.Circuit.Params.getCurrentMult();
        cadd %= 8;
        this.curcount = cc + cadd;
        return this.curcount;
      };

      CircuitComponent.prototype.getDefaultFlags = function() {
        return 0;
      };

      CircuitComponent.prototype.equal_to = function(otherComponent) {
        return this.component_id === otherComponent.component_id;
      };

      CircuitComponent.prototype.drag = function(newX, newY) {
        newX = this.Circuit.snapGrid(newX);
        newY = this.Circuit.snapGrid(newY);
        if (this.noDiagonal) {
          if (Math.abs(this.x1 - newX) < Math.abs(this.y1 - newY)) {
            newX = this.x1;
          } else {
            newY = this.y1;
          }
        }
        this.x2 = newX;
        this.y2 = newY;
        return this.setPoints();
      };

      CircuitComponent.prototype.move = function(deltaX, deltaY) {
        this.x1 += deltaX;
        this.y1 += deltaY;
        this.x2 += deltaX;
        this.y2 += deltaY;
        this.boundingBox.x += deltaX;
        this.boundingBox.y += deltaY;
        return this.setPoints();
      };

      CircuitComponent.prototype.allowMove = function(deltaX, deltaY) {
        var circuitElm, newX, newX2, newY, newY2, _i, _len, _ref;
        newX = this.x1 + deltaX;
        newY = this.y1 + deltaY;
        newX2 = this.x2 + deltaX;
        newY2 = this.y2 + deltaY;
        _ref = this.Circuit.elementList;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          circuitElm = _ref[_i];
          if (circuitElm.x1 === newX && circuitElm.y1 === newY && circuitElm.x2 === newX2 && circuitElm.y2 === newY2) {
            return false;
          }
          if (circuitElm.x1 === newX2 && circuitElm.y1 === newY2 && circuitElm.x2 === newX && circuitElm.y2 === newY) {
            return false;
          }
        }
        return true;
      };

      CircuitComponent.prototype.movePoint = function(n, deltaX, deltaY) {
        if (n === 0) {
          this.x1 += deltaX;
          this.y1 += deltaY;
        } else {
          this.x2 += deltaX;
          this.y2 += deltaY;
        }
        return this.setPoints();
      };

      CircuitComponent.prototype.stamp = function() {
        throw "Called abstract function stamp() in Circuit " + (this.getDumpType());
      };

      CircuitComponent.prototype.getDumpClass = function() {
        return this.toString();
      };

      CircuitComponent.prototype.toString = function() {
        return console.error("Virtual call on toString in circuitComponent was " + (this.dump()));
      };

      CircuitComponent.prototype.dump = function() {
        return this.getDumpType() + " " + this.x1 + " " + this.y1 + " " + this.x2 + " " + this.y2 + " " + this.flags;
      };

      CircuitComponent.prototype.getVoltageSourceCount = function() {
        return 0;
      };

      CircuitComponent.prototype.getInternalNodeCount = function() {
        return 0;
      };

      CircuitComponent.prototype.setNode = function(nodeIdx, newValue) {
        return this.nodes[nodeIdx] = newValue;
      };

      CircuitComponent.prototype.setVoltageSource = function(node, value) {
        return this.voltSource = value;
      };

      CircuitComponent.prototype.getVoltageSource = function() {
        return this.voltSource;
      };

      CircuitComponent.prototype.nonLinear = function() {
        return false;
      };

      CircuitComponent.prototype.getPostCount = function() {
        return 2;
      };

      CircuitComponent.prototype.getNode = function(nodeIdx) {
        return this.nodes[nodeIdx];
      };

      CircuitComponent.prototype.getPost = function(postIdx) {
        if (postIdx === 0) {
          return this.point1;
        } else if (postIdx === 1) {
          return this.point2;
        }
        return console.printStackTrace();
      };

      CircuitComponent.prototype.getBoundingBox = function() {
        return this.boundingBox;
      };

      CircuitComponent.prototype.initBoundingBox = function() {
        this.boundingBox = new Rectangle();
        this.boundingBox.x = Math.min(this.x1, this.x2);
        this.boundingBox.y = Math.min(this.y1, this.y2);
        this.boundingBox.width = Math.abs(this.x2 - this.x1) + 1;
        return this.boundingBox.height = Math.abs(this.y2 - this.y1) + 1;
      };

      CircuitComponent.prototype.setBbox = function(x1, y1, x2, y2) {
        var temp;
        if (x1 > x2) {
          temp = x1;
          x1 = x2;
          x2 = temp;
        }
        if (y1 > y2) {
          temp = y1;
          y1 = y2;
          y2 = temp;
        }
        this.boundingBox.x = x1;
        this.boundingBox.y = y1;
        this.boundingBox.width = x2 - x1 + 1;
        return this.boundingBox.height = y2 - y1 + 1;
      };

      CircuitComponent.prototype.setBboxPt = function(p1, p2, width) {
        var deltaX, deltaY;
        this.setBbox(p1.x, p1.y, p2.x, p2.y);
        deltaX = this.dpx1 * width;
        deltaY = this.dpy1 * width;
        return this.adjustBbox(p1.x + deltaX, p1.y + deltaY, p1.x - deltaX, p1.y - deltaY);
      };

      CircuitComponent.prototype.adjustBbox = function(x1, y1, x2, y2) {
        var q;
        if (x1 > x2) {
          q = x1;
          x1 = x2;
          x2 = q;
        }
        if (y1 > y2) {
          q = y1;
          y1 = y2;
          y2 = q;
        }
        x1 = Math.min(this.boundingBox.x, x1);
        y1 = Math.min(this.boundingBox.y, y1);
        x2 = Math.max(this.boundingBox.x + this.boundingBox.width - 1, x2);
        y2 = Math.max(this.boundingBox.y + this.boundingBox.height - 1, y2);
        this.boundingBox.x = x1;
        this.boundingBox.y = y1;
        this.boundingBox.width = x2 - x1;
        return this.boundingBox.height = y2 - y1;
      };

      CircuitComponent.prototype.adjustBboxPt = function(p1, p2) {
        return this.adjustBbox(p1.x, p1.y, p2.x, p2.y);
      };

      CircuitComponent.prototype.isCenteredText = function() {
        return false;
      };

      CircuitComponent.prototype.getInfo = function(arr) {
        return arr = new Array(15);
      };

      CircuitComponent.prototype.getEditInfo = function(n) {
        throw "Called abstract function getEditInfo() in AbstractCircuitElement";
      };

      CircuitComponent.prototype.setEditValue = function(n, ei) {
        throw "Called abstract function setEditInfo() in AbstractCircuitElement";
      };

      CircuitComponent.prototype.getBasicInfo = function(arr) {
        arr[1] = "I = " + DrawHelper.getCurrentDText(this.getCurrent());
        arr[2] = "Vd = " + DrawHelper.getVoltageDText(this.getVoltageDiff());
        return 3;
      };

      CircuitComponent.prototype.getScopeValue = function(x) {
        if (x === 1) {
          return this.getPower();
        } else {
          return this.getVoltageDiff();
        }
      };

      CircuitComponent.getScopeUnits = function(x) {
        if (x === 1) {
          return "W";
        } else {
          return "V";
        }
      };

      CircuitComponent.prototype.getConnection = function(n1, n2) {
        return true;
      };

      CircuitComponent.prototype.hasGroundConnection = function(n1) {
        return false;
      };

      CircuitComponent.prototype.isWire = function() {
        return false;
      };

      CircuitComponent.prototype.canViewInScope = function() {
        return this.getPostCount() <= 2;
      };

      CircuitComponent.prototype.needsHighlight = function() {
        return this.focused;
      };

      CircuitComponent.prototype.setSelected = function(selected) {
        return this.selected = selected;
      };

      CircuitComponent.prototype.isSelected = function() {
        return this.selected;
      };

      CircuitComponent.prototype.needsShortcut = function() {
        return false;
      };


      /* */


      /* */

      CircuitComponent.prototype.draw = function(renderContext) {
        this.curcount = this.updateDotCount();
        this.drawPosts(renderContext);
        return this.draw2Leads(renderContext);
      };

      CircuitComponent.prototype.draw2Leads = function(renderContext) {
        if ((this.point1 != null) && (this.lead1 != null)) {
          renderContext.drawThickLinePt(this.point1, this.lead1, DrawHelper.getVoltageColor(this.volts[0]));
        }
        if ((this.point2 != null) && (this.lead2 != null)) {
          return renderContext.drawThickLinePt(this.lead2, this.point2, DrawHelper.getVoltageColor(this.volts[1]));
        }
      };

      CircuitComponent.prototype.drawDots = function(point1, point2, renderContext) {
        var currentIncrement, dn, ds, dx, dy, newPos, x0, y0, _ref, _results;
        if (point1 == null) {
          point1 = this.point1;
        }
        if (point2 == null) {
          point2 = this.point2;
        }
        if (((_ref = this.Circuit) != null ? _ref.isStopped() : void 0) || this.current === 0) {
          return;
        }
        dx = point2.x - point1.x;
        dy = point2.y - point1.y;
        dn = Math.sqrt(dx * dx + dy * dy);
        ds = 16;
        currentIncrement = this.current * this.Circuit.currentSpeed();
        this.curcount = (this.curcount + currentIncrement) % ds;
        if (this.curcount < 0) {
          this.curcount += ds;
        }
        newPos = this.curcount;
        _results = [];
        while (newPos < dn) {
          x0 = point1.x + newPos * dx / dn;
          y0 = point1.y + newPos * dy / dn;
          renderContext.fillCircle(x0, y0, Settings.CURRENT_RADIUS);
          _results.push(newPos += ds);
        }
        return _results;
      };


      /*
      Todo: Not yet implemented
       */

      CircuitComponent.prototype.drawCenteredText = function(text, x, y, doCenter, renderContext) {
        var ascent, descent, strWidth;
        strWidth = 10 * text.length;
        if (doCenter) {
          x -= strWidth / 2;
        }
        ascent = -10;
        descent = 5;
        renderContext.fillStyle = Settings.TEXT_COLOR;
        renderContext.fillText(text, x, y + ascent);
        this.adjustBbox(x, y - ascent, x + strWidth, y + ascent + descent);
        return text;
      };


      /*
       * Draws relevant values near components
       *  e.g. 500 Ohms, 10V, etc...
       */

      CircuitComponent.prototype.drawValues = function(valueText, hs, renderContext) {
        var dpx, dpy, offset, stringWidth, xc, xx, ya, yc;
        if (!valueText) {
          return;
        }
        stringWidth = 100;
        ya = -10;
        xc = (this.x2 + this.x1) / 2;
        yc = (this.y2 + this.y1) / 2;
        dpx = Math.floor(this.dpx1 * hs);
        dpy = Math.floor(this.dpy1 * hs);
        offset = 20;
        renderContext.fillStyle = Settings.TEXT_COLOR;
        if (dpx === 0) {
          return renderContext.fillText(valueText, xc - stringWidth / 2 + 3 * offset / 2, yc - Math.abs(dpy) - offset / 3);
        } else {
          xx = xc + Math.abs(dpx) + offset;
          return renderContext.fillText(valueText, xx, yc + dpy + ya);
        }
      };

      CircuitComponent.prototype.drawPosts = function(renderContext) {
        var i, post, _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = this.getPostCount(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          post = this.getPost(i);
          _results.push(this.drawPost(post.x, post.y, this.nodes[i], renderContext));
        }
        return _results;
      };

      CircuitComponent.prototype.drawPost = function(x0, y0, node, renderContext) {
        var fillColor, strokeColor;
        if (this.needsHighlight()) {
          fillColor = Settings.POST_COLOR_SELECTED;
          strokeColor = Settings.POST_COLOR_SELECTED;
        } else {
          fillColor = Settings.POST_COLOR;
          strokeColor = Settings.POST_COLOR;
        }
        return renderContext.fillCircle(x0, y0, Settings.POST_RADIUS, 1, fillColor, strokeColor);
      };

      CircuitComponent.newPointArray = function(n) {
        var a;
        a = new Array(n);
        while (n > 0) {
          a[--n] = new Point(0, 0);
        }
        return a;
      };

      CircuitComponent.prototype.comparePair = function(x1, x2, y1, y2) {
        (x1 === y1 && x2 === y2) || (x1 === y2 && x2 === y1);
        return this.Circuit.Params;
      };

      CircuitComponent.prototype.timeStep = function() {
        return this.Circuit.timeStep();
      };

      return CircuitComponent;

    })();
    return CircuitComponent;
  });

}).call(this);
