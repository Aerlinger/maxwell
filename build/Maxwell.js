(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!Settings', 'cs!DrawHelper', 'cs!Polygon', 'cs!Rectangle', 'cs!Point', 'cs!MathUtils', 'cs!ArrayUtils', 'cs!Observer', 'cs!Module'], function(Settings, DrawHelper, Polygon, Rectangle, Point, MathUtils, ArrayUtils, Observer, Module) {
    var CircuitComponent;
    CircuitComponent = (function(_super) {
      __extends(CircuitComponent, _super);

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
        this.curcount = 5;
        this.noDiagonal = false;
        this.selected = false;
        this.dragging = false;
        this.parentCircuit = null;
        this.flags = flags || this.getDefaultFlags();
        this.setPoints();
        this.allocNodes();
        this.initBoundingBox();
        this.component_id = (new Date()).getTime();
        console.log("Instantiating Circuit Component");
      }

      CircuitComponent.prototype.getParentCircuit = function() {
        return this.Circuit;
      };

      CircuitComponent.prototype.isBeingDragged = function() {
        return this.Circuit.dragElm === this;
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

      CircuitComponent.prototype.setColor = function(color) {
        return this.color = color;
      };

      CircuitComponent.prototype.getDumpType = function() {
        return 0;
      };

      CircuitComponent.prototype.isSelected = function() {
        return this.selected;
      };

      CircuitComponent.prototype.reset = function() {
        this.volts = ArrayUtils.zeroArray(this.volts.length);
        return this.curcount = 5;
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
          return;
        }
        this.lead1 = DrawHelper.interpPoint(this.point1, this.point2, (this.dn - len) / (2 * this.dn));
        return this.lead2 = DrawHelper.interpPoint(this.point1, this.point2, (this.dn + len) / (2 * this.dn));
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
        throw "Called abstract function stamp() in Circuit";
      };

      CircuitComponent.prototype.getDumpClass = function() {
        return this.toString();
      };

      CircuitComponent.prototype.toString = function() {
        return arguments.callee.name;
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
        return printStackTrace();
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
        this.setBbox(p1.x1, p1.y, p2.x1, p2.y);
        deltaX = this.dpx1 * width;
        deltaY = this.dpy1 * width;
        return this.adjustBbox(p1.x1 + deltaX, p1.y + deltaY, p1.x1 - deltaX, p1.y - deltaY);
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
        throw "Called abstract function getInfo() in AbstractCircuitElement";
      };

      CircuitComponent.prototype.getEditInfo = function(n) {
        throw "Called abstract function getEditInfo() in AbstractCircuitElement";
      };

      CircuitComponent.prototype.setEditValue = function(n, ei) {
        throw "Called abstract function setEditInfo() in AbstractCircuitElement";
      };

      CircuitComponent.prototype.getBasicInfo = function(arr) {
        arr[1] = "I = " + CircuitComponent.getCurrentDText(this.getCurrent());
        arr[2] = "Vd = " + CircuitComponent.getVoltageDText(this.getVoltageDiff());
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
        var _ref;
        return ((_ref = this.Circuit) != null ? _ref.mouseElm : void 0) === this || this.selected;
      };

      CircuitComponent.prototype.isSelected = function() {
        return this.selected;
      };

      CircuitComponent.prototype.setSelected = function(selected) {
        return this.selected = selected;
      };

      CircuitComponent.prototype.selectRect = function(rect) {
        return this.selected = rect.intersects(this.boundingBox);
      };

      CircuitComponent.prototype.needsShortcut = function() {
        return false;
      };


      /* */


      /* */

      CircuitComponent.prototype.draw = function(renderContext) {
        throw "Called abstract function draw() in AbstractCircuitElement";
      };

      CircuitComponent.prototype.draw2Leads = function(renderContext) {
        renderContext.drawThickLinePt(this.point1, this.lead1, DrawHelper.getVoltageColor(this.volts[0]));
        return renderContext.drawThickLinePt(this.lead2, this.point2, DrawHelper.getVoltageColor(this.volts[1]));
      };

      CircuitComponent.prototype.drawDots = function(point1, point2, renderContext) {
        var currentIncrement, deltaSegment, dn, dx, dy, newPos, x0, y0, _ref, _ref1, _results;
        if (point1 == null) {
          point1 = this.point1;
        }
        if (point2 == null) {
          point2 = this.point2;
        }
        if (((_ref = this.Circuit) != null ? _ref.isStopped() : void 0) || this.current === 0) {
          return;
        }
        deltaSegment = 16;
        currentIncrement = this.current * ((_ref1 = this.Circuit) != null ? _ref1.currentSpeed() : void 0);
        this.curcount = (this.curcount + currentIncrement) % deltaSegment;
        if (this.curcount < 0) {
          this.curcount += deltaSegment;
        }
        dx = point2.x - point1.x;
        dy = point2.y - point1.y;
        dn = Math.sqrt(dx * dx + dy * dy);
        newPos = this.curcount;
        _results = [];
        while (newPos < dn) {
          x0 = point1.x + newPos * dx / dn;
          y0 = point1.y + newPos * dy / dn;
          renderContext.fillCircle(x0, y0, Settings.CURRENT_RADIUS);
          _results.push(newPos += deltaSegment);
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

      return CircuitComponent;

    })(Module);
    return CircuitComponent;
  });

}).call(this);

(function() {
  define(['cs!WireElm', 'cs!ResistorElm', 'cs!GroundElm', 'cs!VoltageElm', 'cs!Oscilloscope'], function(WireElm, ResistorElm, GroundElm, VoltageElm, Oscilloscope) {
    var ComponentRegistry;
    ComponentRegistry = (function() {
      function ComponentRegistry() {}

      ComponentRegistry.DumpTypeConversions = {
        'r': 'ResistorElm',
        'w': 'WireElm',
        'g': 'GroundElm',
        'v': 'VoltageElm'
      };

      ComponentRegistry.ComponentDefs = {
        'w': WireElm,
        'r': ResistorElm,
        'g': GroundElm,
        'v': VoltageElm
      };

      ComponentRegistry.registerAll = function() {
        var Component, _i, _len, _ref, _results;
        _ref = this.ComponentDefs;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          Component = _ref[_i];
          if (process.env.NODE_ENV === 'development') {
            console.log("Registering Element: " + Component.prototype + " ");
          }
          _results.push(this.register(Component));
        }
        return _results;
      };

      ComponentRegistry.register = function(componentConstructor) {
        var dumpClass, dumpType, e, newComponent;
        try {
          newComponent = new componentConstructor(0, 0, 0, 0, 0, null);
          dumpType = newComponent.getDumpType();
          dumpClass = componentConstructor;
          if (this.dumpTypes[dumpType] === dumpClass) {
            console.log("" + componentConstructor + " is a dump class");
            return;
          }
          if (this.dumpTypes[dumpType] != null) {
            console.log("Dump type conflict: " + dumpType + " " + this.dumpTypes[dumpType]);
            return;
          }
          return this.dumpTypes[dumpType] = componentConstructor;
        } catch (_error) {
          e = _error;
          if (process.env.NODE_ENV === 'development') {
            return Logger.warn("Element: " + componentConstructor.prototype + " Not yet implemented: [" + e.message + "]");
          }
        }
      };

      return ComponentRegistry;

    })();
    return ComponentRegistry;
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!Settings', 'cs!DrawHelper', 'cs!Polygon', 'cs!Rectangle', 'cs!Point', 'cs!CircuitComponent', 'cs!Units'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent, Units) {
    var AntennaElm;
    AntennaElm = (function(_super) {
      __extends(AntennaElm, _super);

      function AntennaElm(xa, ya, xb, yb, f, st) {
        AntennaElm.__super__.constructor.call(this, this, xa, ya, xb, yb, f);
      }

      return AntennaElm;

    })(CircuitComponent);
    return AntennaElm;
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!CircuitComponent', 'cs!DrawHelper', 'cs!Units', 'cs!Point'], function(CircuitComponent, DrawHelper, Units, Point) {
    var CapacitorElm;
    CapacitorElm = (function(_super) {
      __extends(CapacitorElm, _super);

      CapacitorElm.FLAG_BACK_EULER = 2;

      function CapacitorElm(xa, ya, xb, yb, f, st) {
        CircuitComponent.call(this, xa, ya, xb, yb, f);
        this.capacitance = 5e-6;
        this.compResistance = 0;
        this.voltDiff = 10;
        this.plate1 = [];
        this.plate2 = [];
        this.curSourceValue = 0;
        if (st) {
          if (typeof st === "string") {
            st = st.split(" ");
          }
          this.capacitance = Number(st[0]);
          this.voltdiff = Number(st[1]);
        }
      }

      CapacitorElm.prototype.isTrapezoidal = function() {
        return (this.flags & CapacitorElm.FLAG_BACK_EULER) === 0;
      };

      CapacitorElm.prototype.setNodeVoltage = function(n, c) {
        CapacitorElm.__super__.setNodeVoltage.apply(this, arguments).setNodeVoltage(n, c);
        return this.voltdiff = this.volts[0] - this.volts[1];
      };

      CapacitorElm.prototype.reset = function() {
        this.current = this.curcount = 0;
        return this.voltdiff = 1e-3;
      };

      CapacitorElm.prototype.getDumpType = function() {
        return "c";
      };

      CapacitorElm.prototype.dump = function() {
        return CircuitComponent.prototype.dump.call(this) + " " + this.capacitance + " " + this.voltdiff;
      };

      CapacitorElm.prototype.setPoints = function() {
        var f;
        CircuitComponent.prototype.setPoints.call(this);
        f = (this.dn / 2 - 4) / this.dn;
        this.lead1 = DrawHelper.interpPoint(this.point1, this.point2, f);
        this.lead2 = DrawHelper.interpPoint(this.point1, this.point2, 1 - f);
        this.plate1 = [new Point(), new Point()];
        this.plate2 = [new Point(), new Point()];
        DrawHelper.interpPoint(this.point1, this.point2, f, 12, this.plate1[0], this.plate1[1]);
        return DrawHelper.interpPoint(this.point1, this.point2, 1 - f, 12, this.plate2[0], this.plate2[1]);
      };

      CapacitorElm.prototype.draw = function(renderContext) {
        var color, hs;
        hs = 12;
        this.setBboxPt(this.point1, this.point2, hs);
        this.curcount = this.updateDotCount();
        if (!this.isBeingDragged()) {
          this.drawDots(this.point1, this.lead1, this.curcount);
          this.drawDots(this.point2, this.lead2, -this.curcount);
        }
        color = this.setVoltageColor(this.volts[0]);
        renderContext.drawThickLinePt(this.point1, this.lead1, color);
        this.setPowerColor(false);
        renderContext.drawThickLinePt(this.plate1[0], this.plate1[1], color);
        color = this.setVoltageColor(this.volts[1]);
        renderContext.drawThickLinePt(this.point2, this.lead2, color);
        this.setPowerColor(false);
        renderContext.drawThickLinePt(this.plate2[0], this.plate2[1], color);
        return this.drawPosts();
      };

      CapacitorElm.prototype.drawUnits = function() {
        var s;
        s = Units.getUnitText(this.capacitance, "F");
        return this.drawValues(s, hs);
      };

      CapacitorElm.prototype.stamp = function(stamper) {
        var Solver;
        Solver = this.getParentCircuit().Solver;
        if (this.isTrapezoidal()) {
          this.compResistance = Solver.timeStep / (2 * this.capacitance);
        } else {
          this.compResistance = Solver.timeStep / this.capacitance;
        }
        stamper.stampResistor(this.nodes[0], this.nodes[1], this.compResistance);
        stamper.stampRightSide(this.nodes[0]);
        return stamper.stampRightSide(this.nodes[1]);
      };

      CapacitorElm.prototype.startIteration = function() {
        if (this.isTrapezoidal()) {
          return this.curSourceValue = -this.voltdiff / this.compResistance - this.current;
        } else {
          return this.curSourceValue = -this.voltdiff / this.compResistance;
        }
      };

      CapacitorElm.prototype.calculateCurrent = function() {
        var voltdiff;
        voltdiff = this.volts[0] - this.volts[1];
        if (this.compResistance > 0) {
          return this.current = voltdiff / this.compResistance + this.curSourceValue;
        }
      };

      CapacitorElm.prototype.doStep = function() {
        var Circuit;
        Circuit = this.getParentCircuit();
        return Circuit.Solver.Stamper.stampCurrentSource(this.nodes[0], this.nodes[1], this.curSourceValue);
      };

      CapacitorElm.prototype.getInfo = function(arr) {
        var v;
        arr[0] = "capacitor";
        this.getBasicInfo(arr);
        arr[3] = "C = " + Units.getUnitText(this.capacitance, "F");
        arr[4] = "P = " + Units.getUnitText(this.getPower(), "W");
        v = this.getVoltageDiff();
        return arr[4] = "U = " + Units.getUnitText(.5 * this.capacitance * v * v, "J");
      };

      CapacitorElm.prototype.getEditInfo = function(n) {
        var ei;
        if (n === 0) {
          return new EditInfo("Capacitance (F)", this.capacitance, 0, 0);
        }
        if (n === 1) {
          ei = new EditInfo("", 0, -1, -1);
          ei.checkbox = "Trapezoidal Approximation";
          return ei;
        }
        return null;
      };

      CapacitorElm.prototype.setEditValue = function(n, ei) {
        if (n === 0 && ei.value > 0) {
          this.capacitance = ei.value;
        }
        if (n === 1) {
          if (ei.isChecked) {
            return this.flags &= ~CapacitorElm.FLAG_BACK_EULER;
          } else {
            return this.flags |= CapacitorElm.FLAG_BACK_EULER;
          }
        }
      };

      CapacitorElm.prototype.needsShortcut = function() {
        return true;
      };

      CapacitorElm.prototype.toString = function() {
        return "Capacitor";
      };

      return CapacitorElm;

    })(CircuitComponent);
    return CapacitorElm;
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!Settings', 'cs!DrawHelper', 'cs!Polygon', 'cs!Rectangle', 'cs!Point', 'cs!CircuitComponent', 'cs!Units'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent, Units) {
    var CurrentElm;
    CurrentElm = (function(_super) {
      __extends(CurrentElm, _super);

      function CurrentElm(xa, ya, xb, yb, f, st) {
        var e;
        CurrentElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
        try {
          if (typeof st === "string") {
            st = st.split(" ");
          }
          this.currentValue = parseFloat(st[0]);
        } catch (_error) {
          e = _error;
          this.currentValue = .01;
        }
      }

      CurrentElm.prototype.dump = function() {
        return CurrentElm.__super__.dump.apply(this, arguments).dump(this) + " " + this.currentValue;
      };

      CurrentElm.prototype.getDumpType = function() {
        return "i";
      };

      CurrentElm.prototype.setPoints = function() {
        var p2;
        this.setPoints(this);
        this.calcLeads(26);
        this.ashaft1 = DrawHelper.interpPoint(this.lead1, this.lead2, .25);
        this.ashaft2 = DrawHelper.interpPoint(this.lead1, this.lead2, .6);
        this.center = DrawHelper.interpPoint(this.lead1, this.lead2, .5);
        p2 = DrawHelper.interpPoint(this.lead1, this.lead2, .75);
        return this.arrow = DrawHelper.calcArrow(this.center, p2, 4, 4);
      };

      CurrentElm.prototype.draw = function(renderContext) {
        var cr, s;
        cr = 12;
        this.draw2Leads();
        this.setVoltageColor((this.volts[0] + this.volts[1]) / 2);
        this.setPowerColor(false);
        CircuitComponent.drawCircle(this.center.x1, this.center.y, cr);
        CircuitComponent.drawCircle(this.ashaft1, this.ashaft2);
        CircuitComponent.fillPolygon(this.arrow);
        CircuitComponent.setBboxPt(this.point1, this.point2, cr);
        this.doDots();
        if (Circuit.showValuesCheckItem) {
          s = CircuitComponent.getShortUnitText(this.currentValue, "A");
          if (this.dx === 0 || this.dy === 0) {
            this.drawValues(s, cr);
          }
        }
        return this.drawPosts();
      };

      CurrentElm.prototype.stamp = function() {
        this.current = this.currentValue;
        return Circuit.stampCurrentSource(this.nodes[0], this.nodes[1], this.current);
      };

      CurrentElm.prototype.getEditInfo = function(n) {
        if (n === 0) {
          return new EditInfo("Current (A)", this.currentValue, 0, .1);
        }
      };

      CurrentElm.prototype.setEditValue = function(n, ei) {
        return this.currentValue = ei.value;
      };

      CurrentElm.prototype.getInfo = function(arr) {
        arr[0] = "current source";
        return this.getBasicInfo(arr);
      };

      CurrentElm.prototype.getVoltageDiff = function() {
        return this.volts[1] - this.volts[0];
      };

      return CurrentElm;

    })(CircuitComponent);
    return CurrentElm;
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!Settings', 'cs!DrawHelper', 'cs!Polygon', 'cs!Rectangle', 'cs!Point', 'cs!CircuitComponent', 'cs!Units'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent, Units) {
    var DiodeElm;
    DiodeElm = (function(_super) {
      __extends(DiodeElm, _super);

      DiodeElm.FLAG_FWDROP = 1;

      DiodeElm.DEFAULT_DROP = .805904783;

      function DiodeElm(xa, ya, xb, yb, f, st) {
        DiodeElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
        this.hs = 8;
        this.poly;
        this.cathode = [];
        this.diode = new Diode();
        this.fwdrop = DiodeElm.DEFAULT_DROP;
        this.zvoltage = 0;
        if ((f & DiodeElm.FLAG_FWDROP) > 0) {
          try {
            this.fwdrop = parseFloat(st);
          } catch (_error) {}
        }
        this.setup();
      }

      DiodeElm.prototype.nonLinear = function() {
        return true;
      };

      DiodeElm.prototype.setup = function() {
        return this.diode.setup(this.fwdrop, this.zvoltage);
      };

      DiodeElm.prototype.getDumpType = function() {
        return "d";
      };

      DiodeElm.prototype.dump = function() {
        this.flags |= DiodeElm.FLAG_FWDROP;
        return CircuitComponent.prototype.dump.call(this) + " " + this.fwdrop;
      };

      DiodeElm.prototype.setPoints = function() {
        var ca, cb, pa, pb, _ref, _ref1;
        DiodeElm.__super__.setPoints.call(this);
        this.calcLeads(16);
        this.cathode = CircuitComponent.newPointArray(2);
        _ref = DrawHelper.interpPoint(this.lead1, this.lead2, 0, this.hs), pa = _ref[0], pb = _ref[1];
        _ref1 = DrawHelper.interpPoint(this.lead1, this.lead2, 1, this.hs), ca = _ref1[0], cb = _ref1[1];
        return this.poly = CircuitComponent.createPolygon(pa, pb, this.lead2);
      };

      DiodeElm.prototype.draw = function() {
        this.drawDiode();
        this.doDots();
        return this.drawPosts();
      };

      DiodeElm.prototype.reset = function() {
        this.diode.reset();
        return this.volts[0] = this.volts[1] = this.curcount = 0;
      };

      DiodeElm.prototype.drawDiode = function() {
        var color, v1, v2;
        this.setBboxPt(this.point1, this.point2, this.hs);
        v1 = this.volts[0];
        v2 = this.volts[1];
        this.draw2Leads();
        color = this.setVoltageColor(v1);
        CircuitComponent.drawThickPolygonP(this.poly, color);
        color = this.setVoltageColor(v2);
        return CircuitComponent.drawThickLinePt(this.cathode[0], this.cathode[1], color);
      };

      DiodeElm.prototype.stamp = function() {
        return this.diode.stamp(this.nodes[0], this.nodes[1]);
      };

      DiodeElm.prototype.doStep = function() {
        return this.diode.doStep(this.volts[0] - this.volts[1]);
      };

      DiodeElm.prototype.calculateCurrent = function() {
        return this.current = this.diode.calculateCurrent(this.volts[0] - this.volts[1]);
      };

      DiodeElm.prototype.getInfo = function(arr) {
        arr[0] = "diode";
        arr[1] = "I = " + CircuitComponent.getCurrentText(this.getCurrent());
        arr[2] = "Vd = " + CircuitComponent.getVoltageText(this.getVoltageDiff());
        arr[3] = "P = " + CircuitComponent.getUnitText(this.getPower(), "W");
        return arr[4] = "Vf = " + CircuitComponent.getVoltageText(this.fwdrop);
      };

      DiodeElm.prototype.getEditInfo = function(n) {
        if (n === 0) {
          return new EditInfo("Fwd Voltage @ 1A", this.fwdrop, 10, 1000);
        }
      };

      DiodeElm.prototype.setEditValue = function(n, ei) {
        this.fwdrop = ei.value;
        return this.setup();
      };

      DiodeElm.prototype.needsShortcut = function() {
        return true;
      };

      return DiodeElm;

    })(CircuitComponent);
    return DiodeElm;
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!Settings', 'cs!DrawHelper', 'cs!Polygon', 'cs!Rectangle', 'cs!Point', 'cs!CircuitComponent', 'cs!Units'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent, Units) {
    var GroundElm;
    GroundElm = (function(_super) {
      __extends(GroundElm, _super);

      function GroundElm(xa, ya, xb, yb, f, st) {
        GroundElm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
      }

      GroundElm.prototype.getDumpType = function() {
        return "g";
      };

      GroundElm.prototype.getPostCount = function() {
        return 1;
      };

      GroundElm.prototype.draw = function(renderContext) {
        var color, endPt, pt1, pt2, row, startPt, _i, _ref;
        color = DrawHelper.getVoltageColor(0);
        this.doDots(renderContext);
        renderContext.drawThickLinePt(this.point1, this.point2, color);
        for (row = _i = 0; _i < 3; row = ++_i) {
          startPt = 10 - row * 2;
          endPt = row * 3;
          _ref = DrawHelper.interpPoint(this.point1, this.point2, 1 + endPt / this.dn, startPt), pt1 = _ref[0], pt2 = _ref[1];
          renderContext.drawThickLinePt(pt1, pt2, color);
        }
        DrawHelper.interpPoint(this.point1, this.point2, pt2, 1 + 11.0 / this.dn);
        this.setBboxPt(this.point1, pt2, 11);
        return this.drawPost(this.x1, this.y1, this.nodes[0], renderContext);
      };

      GroundElm.prototype.setCurrent = function(x, currentVal) {
        return this.current = -currentVal;
      };

      GroundElm.prototype.stamp = function(stamper) {
        return stamper.stampVoltageSource(0, this.nodes[0], this.voltSource, 0);
      };

      GroundElm.prototype.getVoltageDiff = function() {
        return 0;
      };

      GroundElm.prototype.getVoltageSourceCount = function() {
        return 1;
      };

      GroundElm.prototype.getInfo = function(arr) {
        arr[0] = "ground";
        return arr[1] = "I = " + Units.getCurrentText(this.getCurrent());
      };

      GroundElm.prototype.hasGroundConnection = function(n1) {
        return true;
      };

      GroundElm.prototype.needsShortcut = function() {
        return true;
      };

      GroundElm.prototype.toString = function() {
        return "GroundElm";
      };

      return GroundElm;

    })(CircuitComponent);
    return GroundElm;
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!Settings', 'cs!DrawHelper', 'cs!Polygon', 'cs!Rectangle', 'cs!Point', 'cs!CircuitComponent', 'cs!Units'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent, Units) {
    var InductorElm;
    InductorElm = (function(_super) {
      __extends(InductorElm, _super);

      function InductorElm(xa, ya, xb, yb, f, st) {
        InductorElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
        this.ind = new Inductor();
        this.inductance = 0;
        if (st) {
          if (typeof st === "string") {
            st = st.split(" ");
          }
          this.inductance = parseFloat(st[0]);
          this.current = parseFloat(st[1]);
        }
        this.ind.setup(this.inductance, this.current, this.flags);
      }

      InductorElm.prototype.draw = function(renderContext) {
        var hs, s, v1, v2;
        this.doDots();
        v1 = this.volts[0];
        v2 = this.volts[1];
        hs = 8;
        this.setBboxPt(this.point1, this.point2, hs);
        this.draw2Leads();
        this.setPowerColor(false);
        this.drawCoil(8, this.lead1, this.lead2, v1, v2);
        if (Circuit.showValuesCheckItem) {
          s = CircuitComponent.getShortUnitText(this.inductance, "H");
          this.drawValues(s, hs);
        }
        return this.drawPosts();
      };

      InductorElm.prototype.dump = function() {
        return CircuitComponent.prototype.dump.call(this) + " " + this.inductance + " " + this.current;
      };

      InductorElm.prototype.getDumpType = function() {
        return "l";
      };

      InductorElm.prototype.startIteration = function() {
        return this.ind.startIteration(this.volts[0] - this.volts[1]);
      };

      InductorElm.prototype.nonLinear = function() {
        return this.ind.nonLinear();
      };

      InductorElm.prototype.calculateCurrent = function() {
        var voltdiff;
        voltdiff = this.volts[0] - this.volts[1];
        return this.current = this.ind.calculateCurrent(voltdiff);
      };

      InductorElm.prototype.doStep = function() {
        var voltdiff;
        voltdiff = this.volts[0] - this.volts[1];
        return this.ind.doStep(voltdiff);
      };

      InductorElm.prototype.getInfo = function(arr) {
        arr[0] = "inductor";
        this.getBasicInfo(arr);
        arr[3] = "L = " + CircuitComponent.getUnitText(this.inductance, "H");
        return arr[4] = "P = " + CircuitComponent.getUnitText(this.getPower(), "W");
      };

      InductorElm.prototype.reset = function() {
        this.current = this.volts[0] = this.volts[1] = this.curcount = 0;
        return this.ind.reset();
      };

      InductorElm.prototype.getEditInfo = function(n) {
        var ei;
        if (n === 0) {
          return new EditInfo("Inductance (H)", this.inductance, 0, 0);
        }
        if (n === 1) {
          ei = new EditInfo("", 0, -1, -1);
          ei.checkbox = "Trapezoidal Approximation";
          return ei;
        }
        return null;
      };

      InductorElm.prototype.setEditValue = function(n, ei) {
        if (n === 0) {
          this.inductance = ei.value;
        }
        if (n === 1) {
          if (ei.checkbox.getState()) {
            this.flags &= ~Inductor.FLAG_BACK_EULER;
          } else {
            this.flags |= Inductor.FLAG_BACK_EULER;
          }
        }
        return this.ind.setup(this.inductance, this.current, this.flags);
      };

      InductorElm.prototype.setPoints = function() {
        InductorElm.__super__.setPoints.call(this);
        return this.calcLeads(32);
      };

      InductorElm.prototype.stamp = function() {
        return this.ind.stamp(this.nodes[0], this.nodes[1]);
      };

      return InductorElm;

    })(CircuitComponent);
    return InductorElm;
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!Settings', 'cs!DrawHelper', 'cs!Polygon', 'cs!Rectangle', 'cs!Point', 'cs!CircuitComponent', 'cs!Units'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent, Units) {
    var JFetElm;
    JFetElm = (function(_super) {
      __extends(JFetElm, _super);

      function JFetElm(xa, ya, xb, yb, f, st) {
        JFetElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
      }

      return JFetElm;

    })(CircuitComponent);
    return JFetElm;
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!Settings', 'cs!DrawHelper', 'cs!Polygon', 'cs!Rectangle', 'cs!Point', 'cs!CircuitComponent', 'cs!Units'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent, Units) {
    var LogicInputElm;
    LogicInputElm = (function(_super) {
      __extends(LogicInputElm, _super);

      function LogicInputElm(xa, ya, xb, yb, f, st) {
        LogicInputElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
      }

      return LogicInputElm;

    })(CircuitComponent);
    return LogicInputElm;
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!Settings', 'cs!DrawHelper', 'cs!Polygon', 'cs!Rectangle', 'cs!Point', 'cs!CircuitComponent', 'cs!Units'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent, Units) {
    var LogicOutputElm;
    LogicOutputElm = (function(_super) {
      __extends(LogicOutputElm, _super);

      function LogicOutputElm(xa, ya, xb, yb, f, st) {
        LogicOutputElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
      }

      return LogicOutputElm;

    })(CircuitComponent);
    return LogicOutputElm;
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!Settings', 'cs!DrawHelper', 'cs!Polygon', 'cs!Rectangle', 'cs!Point', 'cs!CircuitComponent', 'cs!Units'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent, Units) {
    var MosfetElm;
    MosfetElm = (function(_super) {
      __extends(MosfetElm, _super);

      MosfetElm.FLAG_PNP = 1;

      MosfetElm.FLAG_SHOWVT = 2;

      MosfetElm.FLAG_DIGITAL = 4;

      function MosfetElm(xa, ya, xb, yb, f, st) {
        MosfetElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
        this.lastv1 = 0;
        this.lastv2 = 0;
        this.ids = 0;
        this.mode = 0;
        this.gm = 0;
        this.vt = 1.5;
        this.pcircler;
        this.src = [];
        this.drn = [];
        this.gate = [];
        this.pcircle = [];
        this.pnp = ((f & MosfetElm.FLAG_PNP) !== 0 ? -1 : 1);
        this.noDiagonal = true;
        this.vt = this.getDefaultThreshold();
        this.hs = 16;
        try {
          if (st && st.length > 0) {
            if (typeof st === "string") {
              st = st.split(" ");
            }
            this.vt = st[0];
          }
        } catch (_error) {}
      }

      MosfetElm.prototype.getDefaultThreshold = function() {
        return 1.5;
      };

      MosfetElm.prototype.getBeta = function() {
        return .02;
      };

      MosfetElm.prototype.nonLinear = function() {
        return true;
      };

      MosfetElm.prototype.drawDigital = function() {
        return (this.flags & MosfetElm.FLAG_DIGITAL) !== 0;
      };

      MosfetElm.prototype.reset = function() {
        return this.lastv1 = this.lastv2 = this.volts[0] = this.volts[1] = this.volts[2] = this.curcount = 0;
      };

      MosfetElm.prototype.dump = function() {
        return CircuitComponent.prototype.dump.call(this) + " " + this.vt;
      };

      MosfetElm.prototype.getDumpType = function() {
        return "f";
      };

      MosfetElm.prototype.draw = function() {
        var color, ds, i, s, segf, segments, v;
        this.setBboxPt(this.point1, this.point2, this.hs);
        color = this.setVoltageColor(this.volts[1]);
        CircuitComponent.drawThickLinePt(this.src[0], this.src[1], color);
        color = this.setVoltageColor(this.volts[2]);
        CircuitComponent.drawThickLinePt(this.drn[0], this.drn[1], color);
        segments = 6;
        this.setPowerColor(true);
        segf = 1.0 / segments;
        i = 0;
        while (i !== segments) {
          v = this.volts[1] + (this.volts[2] - this.volts[1]) * i / segments;
          color = this.setVoltageColor(v);
          DrawHelper.interpPoint(this.src[1], this.drn[1], CircuitComponent.ps1, i * segf);
          DrawHelper.interpPoint(this.src[1], this.drn[1], CircuitComponent.ps2, (i + 1) * segf);
          CircuitComponent.drawThickLinePt(CircuitComponent.ps1, CircuitComponent.ps2, color);
          i++;
        }
        color = this.setVoltageColor(this.volts[1]);
        CircuitComponent.drawThickLinePt(this.src[1], this.src[2], color);
        color = this.setVoltageColor(this.volts[2]);
        CircuitComponent.drawThickLinePt(this.drn[1], this.drn[2], color);
        if (!this.drawDigital()) {
          color = this.setVoltageColor((this.pnp === 1 ? this.volts[1] : this.volts[2]));
          CircuitComponent.drawThickPolygonP(this.arrowPoly, color);
        }
        Circuit.powerCheckItem;
        color = this.setVoltageColor(this.volts[0]);
        CircuitComponent.drawThickLinePt(this.point1, this.gate[1], color);
        CircuitComponent.drawThickLinePt(this.gate[0], this.gate[2], color);
        this.drawDigital() && this.pnp === -1;
        if ((this.flags & MosfetElm.FLAG_SHOWVT) !== 0) {
          s = "" + (this.vt * this.pnp);
          this.drawCenteredText(s, this.x2 + 2, this.y2, false);
        }
        if ((this.needsHighlight() || Circuit.dragElm === this) && this.dy === 0) {
          ds = MathUtils.sign(this.dx);
        }
        this.curcount = this.updateDotCount(-this.ids, this.curcount);
        this.drawDots(this.src[0], this.src[1], this.curcount);
        this.drawDots(this.src[1], this.drn[1], this.curcount);
        this.drawDots(this.drn[1], this.drn[0], this.curcount);
        return this.drawPosts();
      };

      MosfetElm.prototype.getPost = function(n) {
        if (n === 0) {
          return this.point1;
        } else {
          if (n === 1) {
            return this.src[0];
          } else {
            return this.drn[0];
          }
        }
      };

      MosfetElm.prototype.getCurrent = function() {
        return this.ids;
      };

      MosfetElm.prototype.getPower = function() {
        return this.ids * (this.volts[2] - this.volts[1]);
      };

      MosfetElm.prototype.getPostCount = function() {
        return 3;
      };

      MosfetElm.prototype.setPoints = function() {
        var dist, hs2;
        CircuitComponent.prototype.setPoints.call(this);
        hs2 = this.hs * this.dsign;
        this.src = CircuitComponent.newPointArray(3);
        this.drn = CircuitComponent.newPointArray(3);
        DrawHelper.interpPoint(this.point1, this.point2, 1, -hs2, this.src[0], this.drn[0]);
        DrawHelper.interpPoint(this.point1, this.point2, 1 - 22 / this.dn, -hs2, this.src[1], this.drn[1]);
        DrawHelper.interpPoint(this.point1, this.point2, 1 - 22 / this.dn, -hs2 * 4 / 3, this.src[2], this.drn[2]);
        this.gate = CircuitComponent.newPointArray(3);
        DrawHelper.interpPoint(this.point1, this.point2, 1 - 28 / this.dn, hs2 / 2, this.gate[0], this.gate[2]);
        DrawHelper.interpPoint(this.gate[0], this.gate[2], this.gate[1], .5);
        if (!this.drawDigital()) {
          if (this.pnp === 1) {
            return this.arrowPoly = DrawHelper.calcArrow(this.src[1], this.src[0], 10, 4);
          } else {
            return this.arrowPoly = DrawHelper.calcArrow(this.drn[0], this.drn[1], 12, 5);
          }
        } else if (this.pnp === -1) {
          DrawHelper.interpPoint(this.point1, this.point2, this.gate[1], 1 - 36 / this.dn);
          dist = (this.dsign < 0 ? 32 : 31);
          this.pcircle = this.interpPoint(this.point1, this.point2, 1 - dist / this.dn);
          return this.pcircler = 3;
        }
      };

      MosfetElm.prototype.stamp = function() {
        Circuit.stampNonLinear(this.nodes[1]);
        return Circuit.stampNonLinear(this.nodes[2]);
      };

      MosfetElm.prototype.doStep = function() {
        var Gds, beta, drain, gate, realvds, realvgs, rs, source, vds, vgs, vs;
        vs = new Array(3);
        vs[0] = this.volts[0];
        vs[1] = this.volts[1];
        vs[2] = this.volts[2];
        if (vs[1] > this.lastv1 + .5) {
          vs[1] = this.lastv1 + .5;
        }
        if (vs[1] < this.lastv1 - .5) {
          vs[1] = this.lastv1 - .5;
        }
        if (vs[2] > this.lastv2 + .5) {
          vs[2] = this.lastv2 + .5;
        }
        if (vs[2] < this.lastv2 - .5) {
          vs[2] = this.lastv2 - .5;
        }
        source = 1;
        drain = 2;
        if (this.pnp * vs[1] > this.pnp * vs[2]) {
          source = 2;
          drain = 1;
        }
        gate = 0;
        vgs = vs[gate] - vs[source];
        vds = vs[drain] - vs[source];
        if (Math.abs(this.lastv1 - vs[1]) > .01 || Math.abs(this.lastv2 - vs[2]) > .01) {
          Circuit.converged = false;
        }
        this.lastv1 = vs[1];
        this.lastv2 = vs[2];
        realvgs = vgs;
        realvds = vds;
        vgs *= this.pnp;
        vds *= this.pnp;
        this.ids = 0;
        this.gm = 0;
        Gds = 0;
        beta = this.getBeta();
        if (vgs > .5 && this instanceof JFetElm) {
          Circuit.halt("JFET is reverse biased!", this);
          return;
        }
        if (vgs < this.vt) {
          Gds = 1e-8;
          this.ids = vds * Gds;
          this.mode = 0;
        } else if (vds < vgs - this.vt) {
          this.ids = beta * ((vgs - this.vt) * vds - vds * vds * .5);
          this.gm = beta * vds;
          Gds = beta * (vgs - vds - this.vt);
          this.mode = 1;
        } else {
          this.gm = beta * (vgs - this.vt);
          Gds = 1e-8;
          this.ids = .5 * beta * (vgs - this.vt) * (vgs - this.vt) + (vds - (vgs - this.vt)) * Gds;
          this.mode = 2;
        }
        rs = -this.pnp * this.ids + Gds * realvds + this.gm * realvgs;
        Circuit.stampMatrix(this.nodes[drain], this.nodes[drain], Gds);
        Circuit.stampMatrix(this.nodes[drain], this.nodes[source], -Gds - this.gm);
        Circuit.stampMatrix(this.nodes[drain], this.nodes[gate], this.gm);
        Circuit.stampMatrix(this.nodes[source], this.nodes[drain], -Gds);
        Circuit.stampMatrix(this.nodes[source], this.nodes[source], Gds + this.gm);
        Circuit.stampMatrix(this.nodes[source], this.nodes[gate], -this.gm);
        Circuit.stampRightSide(this.nodes[drain], rs);
        Circuit.stampRightSide(this.nodes[source], -rs);
        if (source === 2 && this.pnp === 1 || source === 1 && this.pnp === -1) {
          return this.ids = -this.ids;
        }
      };

      MosfetElm.prototype.getFetInfo = function(arr, n) {
        arr[0] = (this.pnp === -1 ? "p-" : "n-") + n;
        arr[0] += " (Vt = " + CircuitComponent.getVoltageText(this.pnp * this.vt) + ")";
        arr[1] = (this.pnp === 1 ? "Ids = " : "Isd = ") + CircuitComponent.getCurrentText(this.ids);
        arr[2] = "Vgs = " + CircuitComponent.getVoltageText(this.volts[0] - this.volts[(this.pnp === -1 ? 2 : 1)]);
        arr[3] = (this.pnp === 1 ? "Vds = " : "Vsd = ") + CircuitComponent.getVoltageText(this.volts[2] - this.volts[1]);
        arr[4] = (this.mode === 0 ? "off" : (this.mode === 1 ? "linear" : "saturation"));
        return arr[5] = "gm = " + CircuitComponent.getUnitText(this.gm, "A/V");
      };

      MosfetElm.prototype.getInfo = function(arr) {
        return this.getFetInfo(arr, "MOSFET");
      };

      MosfetElm.prototype.canViewInScope = function() {
        return true;
      };

      MosfetElm.prototype.getVoltageDiff = function() {
        return this.volts[2] - this.volts[1];
      };

      MosfetElm.prototype.getConnection = function(n1, n2) {
        return !(n1 === 0 || n2 === 0);
      };

      MosfetElm.prototype.getEditInfo = function(n) {
        var ei;
        if (n === 0) {
          return new EditInfo("Threshold Voltage", this.pnp * this.vt, .01, 5);
        }
        if (n === 1) {
          ei = new EditInfo("", 0, -1, -1);
          ei.checkbox = "Digital Symbol";
          return ei;
        }
        return null;
      };

      MosfetElm.prototype.setEditValue = function(n, ei) {
        if (n === 0) {
          this.vt = this.pnp * ei.value;
        }
        if (n === 1) {
          this.flags = (ei.checkbox ? this.flags | MosfetElm.FLAG_DIGITAL : this.flags & ~MosfetElm.FLAG_DIGITAL);
          return this.setPoints();
        }
      };

      return MosfetElm;

    })(TransistorElm);
    return MosfetElm;
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!Settings', 'cs!DrawHelper', 'cs!Polygon', 'cs!Rectangle', 'cs!Point', 'cs!CircuitComponent', 'cs!Units'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent, Units) {
    var OpAmpElm;
    OpAmpElm = (function(_super) {
      __extends(OpAmpElm, _super);

      OpAmpElm.FLAG_SWAP = 1;

      OpAmpElm.FLAG_SMALL = 2;

      OpAmpElm.FLAG_LOWGAIN = 4;

      function OpAmpElm(xa, ya, xb, yb, f, st) {
        OpAmpElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
        this.opsize = 0;
        this.opheight = 0;
        this.opwidth = 0;
        this.opaddtext = 0;
        this.maxOut = 0;
        this.minOut = 0;
        this.nOut = 0;
        this.gain = 1e6;
        this.gbw = 0;
        this.reset = false;
        this.in1p = [];
        this.in2p = [];
        this.textp = [];
        this.lastvd = 0;
        this.maxOut = 15;
        this.minOut = -15;
        this.gbw = 1e6;
        if (st && st.length > 0) {
          if (typeof st === "string") {
            st = st.split(" ");
          }
          try {
            this.maxOut = parseFloat(st[0]);
            this.minOut = parseFloat(st[1]);
            this.gbw = parseFloat(st[2]);
          } catch (_error) {}
        }
        this.noDiagonal = true;
        this.setSize(((f & OpAmpElm.FLAG_SMALL) !== 0 ? 1 : 2));
        this.setGain();
      }

      OpAmpElm.prototype.setGain = function() {
        return this.gain = ((this.flags & OpAmpElm.FLAG_LOWGAIN) !== 0 ? 1000 : 100000);
      };

      OpAmpElm.prototype.dump = function() {
        return CircuitComponent.prototype.dump.call(this) + " " + this.maxOut + " " + this.minOut + " " + this.gbw;
      };

      OpAmpElm.prototype.nonLinear = function() {
        return true;
      };

      OpAmpElm.prototype.draw = function() {
        var color;
        this.setBboxPt(this.point1, this.point2, this.opheight * 2);
        color = this.setVoltageColor(this.volts[0]);
        CircuitComponent.drawThickLinePt(this.in1p[0], this.in1p[1], color);
        color = this.setVoltageColor(this.volts[1]);
        CircuitComponent.drawThickLinePt(this.in2p[0], this.in2p[1], color);
        this.setPowerColor(true);
        CircuitComponent.drawThickPolygonP(this.triangle, (this.needsHighlight() ? CircuitComponent.selectColor : CircuitComponent.lightGrayColor));
        color = this.setVoltageColor(this.volts[2]);
        CircuitComponent.drawThickLinePt(this.lead2, this.point2, color);
        this.curcount = this.updateDotCount(this.current, this.curcount);
        this.drawDots(this.point2, this.lead2, this.curcount);
        return this.drawPosts();
      };

      OpAmpElm.prototype.getPower = function() {
        return this.volts[2] * this.current;
      };

      OpAmpElm.prototype.setSize = function(s) {
        this.opsize = s;
        this.opheight = 8 * s;
        this.opwidth = 13 * s;
        return this.flags = (this.flags & ~OpAmpElm.FLAG_SMALL) | (s === 1 ? OpAmpElm.FLAG_SMALL : 0);
      };

      OpAmpElm.prototype.setPoints = function() {
        var hs, tris, ww;
        CircuitComponent.prototype.setPoints.call(this);
        if (this.dn > 150 && this === Circuit.dragElm) {
          this.setSize(2);
        }
        ww = Math.floor(this.opwidth);
        if (ww > this.dn / 2) {
          ww = Math.floor(this.dn / 2);
        }
        this.calcLeads(ww * 2);
        hs = Math.floor(this.opheight * this.dsign);
        if ((this.flags & OpAmpElm.FLAG_SWAP) !== 0) {
          hs = -hs;
        }
        this.in1p = CircuitComponent.newPointArray(2);
        this.in2p = CircuitComponent.newPointArray(2);
        this.textp = CircuitComponent.newPointArray(2);
        DrawHelper.interpPoint(this.point1, this.point2, 0, hs, this.in1p[0], this.in2p[0]);
        DrawHelper.interpPoint(this.lead1, this.lead2, 0, hs, this.in1p[1], this.in2p[1]);
        DrawHelper.interpPoint(this.lead1, this.lead2, .2, hs, this.textp[0], this.textp[1]);
        tris = CircuitComponent.newPointArray(2);
        DrawHelper.interpPoint(this.lead1, this.lead2, 0, hs * 2, tris[0], tris[1]);
        return this.triangle = CircuitComponent.createPolygon(tris[0], tris[1], this.lead2);
      };

      OpAmpElm.prototype.getPostCount = function() {
        return 3;
      };

      OpAmpElm.prototype.getPost = function(n) {
        if (n === 0) {
          return this.in1p[0];
        } else {
          if (n === 1) {
            return this.in2p[0];
          } else {
            return this.point2;
          }
        }
      };

      OpAmpElm.prototype.getVoltageSourceCount = function() {
        return 1;
      };

      OpAmpElm.prototype.getInfo = function(arr) {
        var vo;
        arr[0] = "op-amp";
        arr[1] = "V+ = " + CircuitComponent.getVoltageText(this.volts[1]);
        arr[2] = "V- = " + CircuitComponent.getVoltageText(this.volts[0]);
        vo = Math.max(Math.min(this.volts[2], this.maxOut), this.minOut);
        arr[3] = "Vout = " + CircuitComponent.getVoltageText(vo);
        arr[4] = "Iout = " + CircuitComponent.getCurrentText(this.getCurrent());
        return arr[5] = "range = " + CircuitComponent.getVoltageText(this.minOut) + " to " + CircuitComponent.getVoltageText(this.maxOut);
      };

      OpAmpElm.prototype.stamp = function() {
        var vn;
        vn = Circuit.nodeList.length + this.voltSource;
        Circuit.stampNonLinear(vn);
        return Circuit.stampMatrix(this.nodes[2], vn, 1);
      };

      OpAmpElm.prototype.doStep = function() {
        var dx, vd, vn, x;
        vd = this.volts[1] - this.volts[0];
        if (Math.abs(this.lastvd - vd) > .1) {
          Circuit.converged = false;
        } else {
          if (this.volts[2] > this.maxOut + .1 || this.volts[2] < this.minOut - .1) {
            Circuit.converged = false;
          }
        }
        x = 0;
        vn = Circuit.nodeList.length + this.voltSource;
        dx = 0;
        if (vd >= this.maxOut / this.gain && (this.lastvd >= 0 || getRand(4) === 1)) {
          dx = 1e-4;
          x = this.maxOut - dx * this.maxOut / this.gain;
        } else if (vd <= this.minOut / this.gain && (this.lastvd <= 0 || getRand(4) === 1)) {
          dx = 1e-4;
          x = this.minOut - dx * this.minOut / this.gain;
        } else {
          dx = this.gain;
        }
        Circuit.stampMatrix(vn, this.nodes[0], dx);
        Circuit.stampMatrix(vn, this.nodes[1], -dx);
        Circuit.stampMatrix(vn, this.nodes[2], 1);
        Circuit.stampRightSide(vn, x);
        return this.lastvd = vd;
      };

      OpAmpElm.prototype.getConnection = function(n1, n2) {
        return false;
      };

      OpAmpElm.prototype.hasGroundConnection = function(n1) {
        return n1 === 2;
      };

      OpAmpElm.prototype.getVoltageDiff = function() {
        return this.volts[2] - this.volts[1];
      };

      OpAmpElm.prototype.getDumpType = function() {
        return "a";
      };

      OpAmpElm.prototype.getEditInfo = function(n) {
        if (n === 0) {
          return new EditInfo("Max Output (V)", this.maxOut, 1, 20);
        }
        if (n === 1) {
          return new EditInfo("Min Output (V)", this.minOut, -20, 0);
        }
        return null;
      };

      OpAmpElm.prototype.setEditValue = function(n, ei) {
        if (n === 0) {
          this.maxOut = ei.value;
        }
        if (n === 1) {
          return this.minOut = ei.value;
        }
      };

      return OpAmpElm;

    })(CircuitComponent);
    return OpAmpElm;
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!Settings', 'cs!DrawHelper', 'cs!Polygon', 'cs!Rectangle', 'cs!Point', 'cs!CircuitComponent', 'cs!Units'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent, Units) {
    var OutputElm;
    OutputElm = (function(_super) {
      __extends(OutputElm, _super);

      OutputElm.FLAG_VALUE = 1;

      function OutputElm(xa, ya, xb, yb, f, st) {
        OutputElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
      }

      OutputElm.prototype.getDumpType = function() {
        return "O";
      };

      OutputElm.prototype.getPostCount = function() {
        return 1;
      };

      OutputElm.prototype.setPoints = function() {
        CircuitComponent.prototype.setPoints.call(this);
        return this.lead1 = new Point();
      };

      OutputElm.prototype.draw = function() {
        var color, s, selected;
        selected = this.needsHighlight() || Circuit.plotYElm === this;
        color = (selected ? CircuitComponent.selectColor : CircuitComponent.whiteColor);
        s = ((this.flags & OutputElm.FLAG_VALUE) !== 0 ? CircuitComponent.getVoltageText(this.volts[0]) : "out");
        if (this === Circuit.plotXElm) {
          s = "X";
        }
        if (this === Circuit.plotYElm) {
          s = "Y";
        }
        DrawHelper.interpPoint(this.point1, this.point2, this.lead1, 1 - (3 * s.length / 2 + 8) / this.dn);
        this.setBboxPt(this.point1, this.lead1, 0);
        this.drawCenteredText(s, this.x2, this.y2, true);
        color = this.setVoltageColor(this.volts[0]);
        if (selected) {
          color = Settings.SELECT_COLOR;
        }
        CircuitComponent.drawThickLinePt(this.point1, this.lead1, color);
        return this.drawPosts();
      };

      OutputElm.prototype.getVoltageDiff = function() {
        return this.volts[0];
      };

      OutputElm.prototype.getInfo = function(arr) {
        arr[0] = "output";
        return arr[1] = "V = " + CircuitComponent.getVoltageText(this.volts[0]);
      };

      OutputElm.prototype.getEditInfo = function(n) {
        var ei;
        if (n === 0) {
          ei = new EditInfo("", 0, -1, -1);
          ei.checkbox = "Show Voltage";
          return ei;
        }
        return null;
      };

      OutputElm.prototype.setEditValue = function(n, ei) {};

      return OutputElm;

    })(CircuitComponent);
    return OutputElm;
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!Settings', 'cs!DrawHelper', 'cs!Polygon', 'cs!Rectangle', 'cs!Point', 'cs!CircuitComponent', 'cs!Units'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent, Units) {
    var ProbeElm;
    ProbeElm = (function(_super) {
      __extends(ProbeElm, _super);

      ProbeElm.FLAG_SHOWVOLTAGE = 1;

      function ProbeElm(xa, ya, xb, yb, f, st) {
        ProbeElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
      }

      ProbeElm.prototype.getDumpType = function() {
        return "p";
      };

      ProbeElm.prototype.setPoints = function() {
        var x;
        CircuitComponent.prototype.setPoints.call(this);
        if (this.point2.y < this.point1.y) {
          x = this.point1;
          this.point1 = this.point2;
          this.point2 = this.x1;
        }
        return this.center = DrawHelper.interpPoint(this.point1, this.point2, .5);
      };

      ProbeElm.prototype.draw = function() {
        var color, hs, len, s, selected;
        hs = 8;
        CircuitComponent.setBboxPt(this.point1, this.point2, hs);
        selected = this.needsHighlight() || Circuit.plotYElm === this;
        if (selected || Circuit.dragElm === this) {
          len = 16;
        } else {
          len = this.dn - 32;
        }
        CircuitComponent.calcLeads(Math.floor(len));
        color = this.setVoltageColor(this.volts[0]);
        if (selected) {
          color = CircuitComponent.selectColor;
        }
        CircuitComponent.drawThickLinePt(this.point1, this.lead1, color);
        color = this.setVoltageColor(this.volts[1]);
        if (selected) {
          CircuitComponent.setColor(this.selectColor);
        }
        CircuitComponent.drawThickLinePt(this.lead2, this.point2);
        CircuitComponent.setFont(new Font("SansSerif", Font.BOLD, 14));
        if (this === Circuit.plotXElm) {
          CircuitComponent.drawCenteredText("X", this.center.x1, this.center.y, color);
        }
        if (this === Circuit.plotYElm) {
          CircuitComponent.drawCenteredText("Y", this.center.x1, this.center.y, color);
        }
        if (this.mustShowVoltage()) {
          s = CircuitComponent.getShortUnitText(volts[0], "V");
          this.drawValues(s, 4);
        }
        return this.drawPosts();
      };

      ProbeElm.prototype.mustShowVoltage = function() {
        return (this.flags & ProbeElm.FLAG_SHOWVOLTAGE) !== 0;
      };

      ProbeElm.prototype.getInfo = function(arr) {
        arr[0] = "scope probe";
        return arr[1] = "Vd = " + CircuitComponent.getVoltageText(this.getVoltageDiff());
      };

      ProbeElm.prototype.getConnection = function(n1, n2) {
        return false;
      };

      ProbeElm.prototype.getEditInfo = function(n) {
        var ei;
        if (n === 0) {
          ei = new EditInfo("", 0, -1, -1);
          ei.checkbox = new Checkbox("Show Voltage", this.mustShowVoltage());
          return ei;
        }
        return null;
      };

      ProbeElm.prototype.setEditValue = function(n, ei) {
        var flags;
        if (n === 0) {
          if (ei.checkbox.getState()) {
            return flags = ProbeElm.FLAG_SHOWVOLTAGE;
          } else {
            return flags &= ~ProbeElm.FLAG_SHOWVOLTAGE;
          }
        }
      };

      return ProbeElm;

    })(CircuitComponent);
    return ProbeElm;
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!Settings', 'cs!DrawHelper', 'cs!Polygon', 'cs!Rectangle', 'cs!Point', 'cs!VoltageElm', 'cs!CircuitComponent'], function(Settings, DrawHelper, Polygon, Rectangle, Point, VoltageElm, CircuitComponent) {
    var RailElm;
    RailElm = (function(_super) {
      __extends(RailElm, _super);

      RailElm.FLAG_CLOCK = 1;

      function RailElm(xa, ya, xb, yb, f, st) {
        RailElm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
      }

      RailElm.prototype.getDumpType = function() {
        return "R";
      };

      RailElm.prototype.getPostCount = function() {
        return 1;
      };

      RailElm.prototype.setPoints = function() {
        RailElm.__super__.setPoints.call(this);
        return this.lead1 = DrawHelper.interpPoint(this.point1, this.point2, 1 - VoltageElm.circleSize / this.dn);
      };

      RailElm.prototype.draw = function() {
        var clock, color, s, v;
        this.setBboxPt(this.point1, this.point2, this.circleSize);
        color = this.setVoltageColor(this.volts[0]);
        CircuitComponent.drawThickLinePt(this.point1, this.lead1, color);
        clock = this.waveform === VoltageElm.WF_SQUARE && (this.flags & VoltageElm.FLAG_CLOCK) !== 0;
        if (this.waveform === VoltageElm.WF_DC || this.waveform === VoltageElm.WF_VAR || clock) {
          color = (this.needsHighlight() ? Settings.selectColor : Settings.whiteColor);
          v = this.getVoltage();
          s = CircuitComponent.getShortUnitText(v, "V");
          if (Math.abs(v) < 1) {
            s = v + "V";
          }
          if (this.getVoltage() > 0) {
            s = "+" + s;
          }
          if (this instanceof AntennaElm) {
            s = "Ant";
          }
          if (clock) {
            s = "CLK";
          }
          this.drawCenteredText(s, this.x2, this.y2, true);
        } else {
          this.drawWaveform(this.point2);
        }
        this.drawPosts();
        this.curcount = this.updateDotCount(-this.current, this.curcount);
        if (Circuit.dragElm !== this) {
          return this.drawDots(this.point1, this.lead1, this.curcount);
        }
      };

      RailElm.prototype.getVoltageDiff = function() {
        return this.volts[0];
      };

      RailElm.prototype.stamp = function() {
        if (this.waveform === VoltageElm.WF_DC) {
          return Circuit.stampVoltageSource(0, this.nodes[0], this.voltSource, this.getVoltage());
        } else {
          return Circuit.stampVoltageSource(0, this.nodes[0], this.voltSource);
        }
      };

      RailElm.prototype.doStep = function() {
        if (this.waveform !== VoltageElm.WF_DC) {
          return Circuit.updateVoltageSource(0, this.nodes[0], this.voltSource, this.getVoltage());
        }
      };

      RailElm.prototype.hasGroundConnection = function(n1) {
        return true;
      };

      return RailElm;

    })(VoltageElm);
    return RailElm;
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!Settings', 'cs!DrawHelper', 'cs!Polygon', 'cs!Rectangle', 'cs!Point', 'cs!Units', 'cs!CircuitComponent'], function(Settings, DrawHelper, Polygon, Rectangle, Point, Units, CircuitComponent) {
    var ResistorElm;
    ResistorElm = (function(_super) {
      __extends(ResistorElm, _super);

      function ResistorElm(xa, ya, xb, yb, f, st) {
        if (f == null) {
          f = 0;
        }
        if (st == null) {
          st = null;
        }
        ResistorElm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
        if (st && st.length > 0) {
          this.resistance = parseFloat(st);
        } else {
          this.resistance = 500;
        }
        this.ps3 = new Point(100, 50);
        this.ps4 = new Point(100, 150);
      }

      ResistorElm.prototype.draw = function(renderContext) {
        var hs, i, newOffset, oldOffset, pt1, pt2, resistanceVal, segf, segments, volt1, volt2, voltDrop, _i;
        segments = 16;
        oldOffset = 0;
        hs = 6;
        volt1 = this.volts[0];
        volt2 = this.volts[1];
        this.setBboxPt(this.point1, this.point2, hs);
        this.draw2Leads(renderContext);
        DrawHelper.getPowerColor(this.getPower);
        segf = 1 / segments;
        for (i = _i = 0; 0 <= segments ? _i < segments : _i > segments; i = 0 <= segments ? ++_i : --_i) {
          newOffset = 0;
          switch (i & 3) {
            case 0:
              newOffset = 1;
              break;
            case 2:
              newOffset = -1;
              break;
            default:
              newOffset = 0;
          }
          voltDrop = volt1 + (volt2 - volt1) * i / segments;
          pt1 = DrawHelper.interpPoint(this.lead1, this.lead2, i * segf, hs * oldOffset);
          pt2 = DrawHelper.interpPoint(this.lead1, this.lead2, (i + 1) * segf, hs * newOffset);
          renderContext.drawThickLinePt(pt1, pt2, DrawHelper.getVoltageColor(voltDrop));
          oldOffset = newOffset;
        }
        resistanceVal = Units.getUnitText(this.resistance, "ohm");
        this.drawValues(resistanceVal, hs, renderContext);
        this.drawDots(this.point1, this.point2, renderContext);
        return this.drawPosts(renderContext);
      };

      ResistorElm.prototype.dump = function() {
        return CircuitElement.prototype.dump.call(this) + " " + this.resistance;
      };

      ResistorElm.prototype.getDumpType = function() {
        return "r";
      };

      ResistorElm.prototype.getEditInfo = function(n) {
        if (n === 0) {
          return new EditInfo("Resistance (ohms):", this.resistance, 0, 0);
        }
        return null;
      };

      ResistorElm.prototype.setEditValue = function(n, ei) {
        if (ei.value > 0) {
          return this.resistance = ei.value;
        }
      };

      ResistorElm.prototype.getInfo = function(arr) {
        arr[0] = "resistor";
        this.getBasicInfo(arr);
        arr[3] = "R = " + Units.getUnitText(this.resistance, Circuit.ohmString);
        return arr[4] = "P = " + Units.getUnitText(this.getPower(), "W");
      };

      ResistorElm.prototype.needsShortcut = function() {
        return true;
      };

      ResistorElm.prototype.calculateCurrent = function() {
        return this.current = (this.volts[0] - this.volts[1]) / this.resistance;
      };

      ResistorElm.prototype.setPoints = function() {
        ResistorElm.__super__.setPoints.call(this);
        this.calcLeads(32);
        this.ps3 = new Point(0, 0);
        return this.ps4 = new Point(0, 0);
      };

      ResistorElm.prototype.stamp = function(stamper) {
        if (this.orphaned()) {
          console.warn("attempting to stamp an orphaned resistor");
        }
        return stamper.stampResistor(this.nodes[0], this.nodes[1], this.resistance);
      };

      ResistorElm.prototype.toString = function() {
        return "ResistorElm";
      };

      return ResistorElm;

    })(CircuitComponent);
    return ResistorElm;
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!Settings', 'cs!DrawHelper', 'cs!Polygon', 'cs!Rectangle', 'cs!Point', 'cs!CircuitComponent', 'cs!Units'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent, Units) {
    var SparkGapElm;
    SparkGapElm = (function(_super) {
      __extends(SparkGapElm, _super);

      function SparkGapElm(xa, ya, xb, yb, f, st) {
        SparkGapElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
        this.resistance = 0;
        this.offresistance = 1e9;
        this.onresistance = 1e3;
        this.breakdown = 1e3;
        this.holdcurrent = 0.001;
        this.state = false;
        if (st) {
          if (typeof st === "string") {
            st = st.split(" ");
          }
          if (st) {
            this.onresistance = parseFloat(st != null ? st.shift() : void 0);
          }
          if (st) {
            this.offresistance = parseFloat(st != null ? st.shift() : void 0);
          }
          if (st) {
            this.breakdown = parseFloat(st != null ? st.shift() : void 0);
          }
          if (st) {
            this.holdcurrent = parseFloat(st != null ? st.shift() : void 0);
          }
        }
      }

      SparkGapElm.prototype.nonLinear = function() {
        return true;
      };

      SparkGapElm.prototype.getDumpType = function() {
        return 187;
      };

      SparkGapElm.prototype.dump = function() {
        return CircuitComponent.prototype.dump.call(this) + " " + this.onresistance + " " + this.offresistance + " " + this.breakdown + " " + this.holdcurrent;
      };

      SparkGapElm.prototype.setPoints = function() {
        var alen, dist, p1;
        CircuitComponent.prototype.setPoints.call(this);
        dist = 16;
        alen = 8;
        this.calcLeads(dist + alen);
        p1 = DrawHelper.interpPoint(this.point1, this.point2, (this.dn - alen) / (2 * this.dn));
        this.arrow1 = DrawHelper.calcArrow(this.point1, p1, alen, alen);
        p1 = DrawHelper.interpPoint(this.point1, this.point2, (this.dn + alen) / (2 * this.dn));
        return this.arrow2 = DrawHelper.calcArrow(this.point2, p1, alen, alen);
      };

      SparkGapElm.prototype.draw = function(renderContext) {
        var color, v1, v2;
        v1 = this.volts[0];
        v2 = this.volts[1];
        this.setBboxPt(this.point1, this.point2, 8);
        this.draw2Leads();
        this.setPowerColor(true);
        color = this.setVoltageColor(this.volts[0]);
        CircuitComponent.drawThickPolygonP(this.arrow1, color);
        color = this.setVoltageColor(this.volts[1]);
        CircuitComponent.drawThickPolygonP(this.arrow2, color);
        if (this.state) {
          this.doDots();
        }
        return this.drawPosts();
      };

      SparkGapElm.prototype.calculateCurrent = function() {
        var vd;
        vd = this.volts[0] - this.volts[1];
        return this.current = vd / this.resistance;
      };

      SparkGapElm.prototype.reset = function() {
        CircuitComponent.prototype.reset.call(this);
        return this.state = false;
      };

      SparkGapElm.prototype.startIteration = function() {
        var vd;
        if (Math.abs(this.current) < this.holdcurrent) {
          this.state = false;
        }
        vd = this.volts[0] - this.volts[1];
        if (Math.abs(vd) > this.breakdown) {
          return this.state = true;
        }
      };

      SparkGapElm.prototype.doStep = function() {
        this.resistance = (this.state ? this.onresistance : this.offresistance);
        return Circuit.stampResistor(this.nodes[0], this.nodes[1], this.resistance);
      };

      SparkGapElm.prototype.stamp = function() {
        Circuit.stampNonLinear(this.nodes[0]);
        return Circuit.stampNonLinear(this.nodes[1]);
      };

      SparkGapElm.prototype.getInfo = function(arr) {
        arr[0] = "spark gap";
        this.getBasicInfo(arr);
        arr[3] = (this.state ? "on" : "off");
        arr[4] = "Ron = " + CircuitComponent.getUnitText(this.onresistance, Circuit.ohmString);
        arr[5] = "Roff = " + CircuitComponent.getUnitText(this.offresistance, Circuit.ohmString);
        return arr[6] = "Vbreakdown = " + CircuitComponent.getUnitText(this.breakdown, "V");
      };

      SparkGapElm.prototype.getEditInfo = function(n) {
        if (n === 0) {
          return new EditInfo("On resistance (ohms)", this.onresistance, 0, 0);
        }
        if (n === 1) {
          return new EditInfo("Off resistance (ohms)", this.offresistance, 0, 0);
        }
        if (n === 2) {
          return new EditInfo("Breakdown voltage", this.breakdown, 0, 0);
        }
        if (n === 3) {
          return new EditInfo("Holding current (A)", this.holdcurrent, 0, 0);
        }
        return null;
      };

      SparkGapElm.prototype.getEditInfo = function(n, ei) {
        var breakdown, holdcurrent, offresistance, onresistance;
        if (ei.value > 0 && n === 0) {
          onresistance = ei.value;
        }
        if (ei.value > 0 && n === 1) {
          offresistance = ei.value;
        }
        if (ei.value > 0 && n === 2) {
          breakdown = ei.value;
        }
        if (ei.value > 0 && n === 3) {
          return holdcurrent = ei.value;
        }
      };

      SparkGapElm.prototype.needsShortcut = function() {
        return false;
      };

      return SparkGapElm;

    })(CircuitComponent);
    return SparkGapElm;
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!Settings', 'cs!DrawHelper', 'cs!Polygon', 'cs!Rectangle', 'cs!Point', 'cs!CircuitComponent', 'cs!Units'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent, Units) {
    var SweepElm;
    return SweepElm = (function(_super) {
      __extends(SweepElm, _super);

      SweepElm.FLAG_LOG = 1;

      SweepElm.FLAG_BIDIR = 2;

      SweepElm.circleSize = 17;

      function SweepElm(xa, ya, xb, yb, f, st) {
        SweepElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
        this.dir = 1;
        if (st) {
          if (typeof st === "string") {
            st = st.split(" ");
          }
          this.minF = (st[0] ? parseFloat(st[0]) : 20);
          this.maxF = (st[1] ? parseFloat(st[1]) : 4e4);
          this.maxV = (st[2] ? parseFloat(st[2]) : 5);
          this.sweepTime = (st[3] ? parseFloat(st[3]) : 0.1);
        }
        this.reset();
      }

      SweepElm.prototype.getDumpType = function() {
        return 170;
      };

      SweepElm.prototype.getPostCount = function() {
        return 1;
      };

      SweepElm.prototype.dump = function() {
        return CircuitComponent.prototype.dump.call(this) + " " + this.minF + " " + this.maxF + " " + this.maxV + " " + this.sweepTime;
      };

      SweepElm.prototype.setPoints = function() {
        CircuitComponent.prototype.setPoints.call(this);
        return this.lead1 = DrawHelper.interpPoint(this.point1, this.point2, 1 - this.circleSize / this.dn);
      };

      SweepElm.prototype.draw = function() {
        var color, i, ox, oy, powerColor, s, tm, w, wl, xc, xl, yc, yy;
        this.setBboxPt(this.point1, this.point2, this.circleSize);
        color = this.setVoltageColor(this.volts[0]);
        CircuitComponent.drawThickLinePt(this.point1, this.lead1, color);
        this.setVoltageColor((this.needsHighlight() ? CircuitComponent.selectColor : Color.GREY));
        powerColor = this.setPowerColor(false);
        xc = this.point2.x1;
        yc = this.point2.y;
        CircuitComponent.drawCircle(xc, yc, this.circleSize);
        wl = 8;
        this.adjustBbox(xc - this.circleSize, yc - this.circleSize, xc + this.circleSize, yc + this.circleSize);
        i = void 0;
        xl = 10;
        ox = -1;
        oy = -1;
        tm = (new Date()).getTime();
        tm %= 2000;
        if (tm > 1000) {
          tm = 2000 - tm;
        }
        w = 1 + tm * .002;
        if (!Circuit.stoppedCheck) {
          w = 1 + 2 * (this.frequency - this.minF) / (this.maxF - this.minF);
        }
        i = -xl;
        while (i <= xl) {
          yy = yc + Math.floor(.95 * Math.sin(i * Math.PI * w / xl) * wl);
          if (ox !== -1) {
            CircuitComponent.drawThickLine(ox, oy, xc + i, yy);
          }
          ox = xc + i;
          oy = yy;
          i++;
        }
        if (Circuit.showValuesCheckItem) {
          s = CircuitComponent.getShortUnitText(this.frequency, "Hz");
          if (this.dx === 0 || this.dy === 0) {
            this.drawValues(s, this.circleSize);
          }
        }
        this.drawPosts();
        this.curcount = this.updateDotCount(-this.current, this.curcount);
        if (Circuit.dragElm !== this) {
          return this.drawDots(this.point1, this.lead1, this.curcount);
        }
      };

      SweepElm.prototype.stamp = function() {
        return Circuit.stampVoltageSource(0, this.nodes[0], this.voltSource);
      };

      SweepElm.prototype.setParams = function() {
        if (this.frequency < this.minF || this.frequency > this.maxF) {
          this.frequency = this.minF;
          this.freqTime = 0;
          this.dir = 1;
        }
        if ((this.flags & SweepElm.FLAG_LOG) === 0) {
          this.fadd = this.dir * Circuit.timeStep * (this.maxF - this.minF) / this.sweepTime;
          this.fmul = 1;
        } else {
          this.fadd = 0;
          this.fmul = Math.pow(this.maxF / this.minF, this.dir * Circuit.timeStep / this.sweepTime);
        }
        return this.savedTimeStep = Circuit.timeStep;
      };

      SweepElm.prototype.reset = function() {
        this.frequency = this.minF;
        this.freqTime = 0;
        this.dir = 1;
        return this.setParams();
      };

      SweepElm.prototype.startIteration = function() {
        if (Circuit.timeStep !== this.savedTimeStep) {
          this.setParams();
        }
        this.v = Math.sin(this.freqTime) * this.maxV;
        this.freqTime += this.frequency * 2 * Math.PI * Circuit.timeStep;
        this.frequency = this.frequency * this.fmul + this.fadd;
        if (this.frequency >= this.maxF && this.dir === 1) {
          if ((this.flags & SweepElm.FLAG_BIDIR) !== 0) {
            this.fadd = -this.fadd;
            this.fmul = 1 / this.fmul;
            this.dir = -1;
          } else {
            this.frequency = this.minF;
          }
        }
        if (this.frequency <= this.minF && this.dir === -1) {
          this.fadd = -this.fadd;
          this.fmul = 1 / this.fmul;
          return this.dir = 1;
        }
      };

      SweepElm.prototype.doStep = function() {
        return Circuit.updateVoltageSource(0, this.nodes[0], this.voltSource, this.v);
      };

      SweepElm.prototype.getVoltageDiff = function() {
        return this.volts[0];
      };

      SweepElm.prototype.getVoltageSourceCount = function() {
        return 1;
      };

      SweepElm.prototype.hasGroundConnection = function(n1) {
        return true;
      };

      SweepElm.prototype.getInfo = function(arr) {
        arr[0] = "sweep " + ((this.flags & SweepElm.FLAG_LOG) === 0 ? "(linear)" : "(log)");
        arr[1] = "I = " + CircuitComponent.getCurrentDText(this.getCurrent());
        arr[2] = "V = " + CircuitComponent.getVoltageText(this.volts[0]);
        arr[3] = "f = " + CircuitComponent.getUnitText(this.frequency, "Hz");
        arr[4] = "range = " + CircuitComponent.getUnitText(this.minF, "Hz") + " .. " + CircuitComponent.getUnitText(this.maxF, "Hz");
        return arr[5] = "time = " + CircuitComponent.getUnitText(this.sweepTime, "s");
      };

      SweepElm.prototype.getEditInfo = function(n) {
        var ei;
        if (n === 0) {
          return new EditInfo("Min Frequency (Hz)", this.minF, 0, 0);
        }
        if (n === 1) {
          return new EditInfo("Max Frequency (Hz)", this.maxF, 0, 0);
        }
        if (n === 2) {
          return new EditInfo("Sweep Time (s)", this.sweepTime, 0, 0);
        }
        if (n === 3) {
          ei = new EditInfo("", 0, -1, -1);
          ei.checkbox = new Checkbox("Logarithmic", (this.flags & SweepElm.FLAG_LOG) !== 0);
          return ei;
        }
        if (n === 4) {
          return new EditInfo("Max Voltage", this.maxV, 0, 0);
        }
        if (n === 5) {
          ei = new EditInfo("", 0, -1, -1);
          ei.checkbox = new Checkbox("Bidirectional", (this.flags & SweepElm.FLAG_BIDIR) !== 0);
          return ei;
        }
        return null;
      };

      SweepElm.prototype.setEditValue = function(n, ei) {
        var maxfreq;
        maxfreq = 1 / (8 * Circuit.timeStep);
        if (n === 0) {
          this.minF = ei.value;
          if (this.minF > maxfreq) {
            this.minF = maxfreq;
          }
        }
        if (n === 1) {
          this.maxF = ei.value;
          if (this.maxF > maxfreq) {
            this.maxF = maxfreq;
          }
        }
        if (n === 2) {
          this.sweepTime = ei.value;
        }
        if (n === 3) {
          this.flags &= ~SweepElm.FLAG_LOG;
          if (ei.checkbox.getState()) {
            this.flags |= SweepElm.FLAG_LOG;
          }
        }
        if (n === 4) {
          this.maxV = ei.value;
        }
        if (n === 5) {
          this.flags &= ~SweepElm.FLAG_BIDIR;
          if (ei.checkbox.getState()) {
            this.flags |= SweepElm.FLAG_BIDIR;
          }
        }
        return this.setParams();
      };

      return SweepElm;

    })(CircuitComponent);
  });

}).call(this);

(function() {
  define(['cs!Settings', 'cs!DrawHelper', 'cs!Polygon', 'cs!Rectangle', 'cs!Point', 'cs!CircuitComponent', 'cs!Units'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent, Units) {

    /*
    Todo: Click functionality does not work
     */
    var Switch2Elm;
    Switch2Elm = (function() {
      Switch2Elm.FLAG_CENTER_OFF = 1;

      function Switch2Elm() {
        Switch2Elm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
        this.openhs = 16;
        this.swpoled = new Array();
        this.swposts = new Array();
        this.noDiagonal = true;
        if (st && st[0]) {
          this.link = parseInt(st[0]);
        }
      }

      Switch2Elm.prototype.getDumpType = function() {
        return "S";
      };

      Switch2Elm.prototype.dump = function() {
        return SwitchElm.prototype.dump.call(this) + this.link;
      };

      Switch2Elm.prototype.setPoints = function() {
        var _ref;
        SwitchElm.prototype.setPoints.call(this);
        this.calcLeads(32);
        this.swpoles = DrawHelper.interpPoint(this.lead1, this.lead2, 1, this.openhs);
        this.swpoles[2] = this.lead2;
        this.swposts = DrawHelper.interpPoint(this.point1, this.point2, 1, this.openhs);
        return this.posCount = (_ref = this.hasCenterOff()) != null ? _ref : {
          3: 2
        };
      };

      Switch2Elm.prototype.draw = function() {
        var color;
        this.setBbox(this.point1, this.point2, this.openhs);
        color = this.setVoltageColor(this.volts[0]);
        CircuitComponent.drawThickLinePt(this.point1, this.lead1, color);
        color = this.setVoltageColor(this.volts[1]);
        CircuitComponent.drawThickLinePt(this.swpoles[0], this.swposts[0], color);
        this.setVoltageColor(this.volts[2], color);
        CircuitComponent.drawThickLinePt(this.swpoles[1], this.swposts[1], color);
        if (!this.needsHighlight()) {
          color = Settings.SELECT_COLOR;
        }
        CircuitComponent.drawThickLinePt(this.lead1, this.swpoles[this.position], color);
        this.updateDotCount();
        this.drawDots(this.point1, this.lead1, this.curcount);
        if (this.position !== 2) {
          this.drawDots(this.swpoles[this.position], this.swposts[this.position], this.curcount);
        }
        return this.drawPosts();
      };

      Switch2Elm.prototype.getPost = function(n) {
        if (n === 0) {
          return this.point1;
        } else {
          return this.swposts[n - 1];
        }
      };

      Switch2Elm.prototype.getPostCount = function() {
        return 3;
      };

      Switch2Elm.prototype.calculateCurrent = function() {
        if (this.position === 2) {
          return this.current = 0;
        }
      };

      Switch2Elm.stamp = function() {
        if (this.position === 2) {
          return;
        }
        return Circuit.stampVoltageSource(this.nodes[0], this.nodes[this.position + 1], this.voltSource, 0);
      };

      Switch2Elm.getVoltageSourceCount = function() {
        if (this.position === 2) {
          return 0;
        } else {
          return 1;
        }
      };

      Switch2Elm.toggle = function() {
        var i, o, s2, _results;
        Switch2Elm.prototype.toggle();
        if (this.link !== 0) {
          i = 0;
          _results = [];
          while (i !== Circuit.elementList.length) {
            o = Circuit.elementList.elementAt(i);
            if (o instanceof Switch2Elm) {
              s2 = o;
              if (s2.link === this.link) {
                s2.position = this.position;
              }
            }
            _results.push(i++);
          }
          return _results;
        }
      };

      Switch2Elm.prototype.getConnection = function(n1, n2) {
        if (this.position === 2) {
          return false;
        }
        return this.comparePair(n1, n2, 0, 1 + this.position);
      };

      Switch2Elm.prototype.getInfo = function(arr) {
        arr[0] = (this.link === 0 ? "switch (SPDT)" : "switch (DPDT)");
        return arr[1] = "I = " + this.getCurrentDText(this.getCurrent());
      };

      Switch2Elm.prototype.getEditInfo = function(n) {
        var ei;
        if (n === 1) {
          ei = new EditInfo("", 0, -1, -1);
          ei.checkbox = new Checkbox("Center Off", this.hasCenterOff());
          return ei;
        }
        return SwitchElm.prototype.getEditInfo.call(this, n);
      };

      Switch2Elm.prototype.setEditValue = function(n, ei) {
        if (n === 1) {
          this.flags &= ~Switch2Elm.FLAG_CENTER_OFF;
          if (ei.checkbox.getState()) {
            this.flags |= Switch2Elm.FLAG_CENTER_OFF;
          }
          if (this.hasCenterOff()) {
            this.momentary = false;
          }
          return this.setPoints();
        } else {
          return Switch2Elm.prototype.setEditValue.call(this, n, ei);
        }
      };

      Switch2Elm.prototype.hasCenterOff = function() {
        return (this.flags & Switch2Elm.FLAG_CENTER_OFF) !== 0;
      };

      return Switch2Elm;

    })();
    return Switch2Elm;
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!Settings', 'cs!DrawHelper', 'cs!Polygon', 'cs!Rectangle', 'cs!Point', 'cs!CircuitComponent', 'cs!Units'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent, Units) {
    var SwitchElm;
    SwitchElm = (function(_super) {
      __extends(SwitchElm, _super);

      function SwitchElm(xa, ya, xb, yb, f, st) {
        var str;
        SwitchElm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
        this.momentary = false;
        this.position = 0;
        this.posCount = 2;
        this.ps = new Point(0, 0);
        CircuitComponent.ps2 = new Point(0, 0);
        if (st) {
          if (typeof st === "string") {
            st = st.split(" ");
          }
          str = st[0];
          if (str === "true") {
            this.position = (this instanceof LogicInputElm ? 0 : 1);
          } else if (str === "false") {
            this.position = (this instanceof LogicInputElm ? 1 : 0);
          } else {
            this.position = parseInt(str);
          }
          this.momentary = st[1].toLowerCase() === "true";
        }
        this.posCount = 2;
      }

      SwitchElm.prototype.getDumpType = function() {
        return "s";
      };

      SwitchElm.prototype.dump = function() {
        return CircuitComponent.prototype.dump.call(this) + " " + this.position + " " + this.momentary;
      };

      SwitchElm.prototype.setPoints = function() {
        CircuitComponent.prototype.setPoints.call(this);
        this.calcLeads(32);
        this.ps = new Point(0, 0);
        return CircuitComponent.ps2 = new Point(0, 0);
      };

      SwitchElm.prototype.draw = function(renderContext) {
        var hs1, hs2, openhs;
        openhs = 16;
        hs1 = (this.position === 1 ? 0 : 2);
        hs2 = (this.position === 1 ? openhs : 2);
        this.setBboxPt(this.point1, this.point2, openhs);
        this.draw2Leads();
        if (this.position === 0) {
          this.doDots();
        }
        DrawHelper.interpPoint(this.lead1, this.lead2, this.ps, 0, hs1);
        DrawHelper.interpPoint(this.lead1, this.lead2, CircuitComponent.ps2, 1, hs2);
        CircuitComponent.drawThickLinePt(this.ps, CircuitComponent.ps2, Settings.FG_COLOR);
        return this.drawPosts();
      };

      SwitchElm.prototype.calculateCurrent = function() {
        if (this.position === 1) {
          return this.current = 0;
        }
      };

      SwitchElm.prototype.stamp = function() {
        if (this.position === 0) {
          return Circuit.stampVoltageSource(this.nodes[0], this.nodes[1], this.voltSource, 0);
        }
      };

      SwitchElm.prototype.getVoltageSourceCount = function() {
        if (this.position === 1) {
          return 0;
        } else {
          return 1;
        }
      };

      SwitchElm.prototype.mouseUp = function() {
        if (this.momentary) {
          return this.toggle();
        }
      };

      SwitchElm.prototype.toggle = function() {
        this.position++;
        if (this.position >= this.posCount) {
          return this.position = 0;
        }
      };

      SwitchElm.prototype.getInfo = function(arr) {
        arr[0] = (this.momentary ? "push switch (SPST)" : "switch (SPST)");
        if (this.position === 1) {
          arr[1] = "open";
          return arr[2] = "Vd = " + CircuitComponent.getVoltageDText(this.getVoltageDiff());
        } else {
          arr[1] = "closed";
          arr[2] = "V = " + CircuitComponent.getVoltageText(this.volts[0]);
          return arr[3] = "I = " + CircuitComponent.getCurrentDText(this.getCurrent());
        }
      };

      SwitchElm.prototype.getConnection = function(n1, n2) {
        return this.position === 0;
      };

      SwitchElm.prototype.isWire = function() {
        return true;
      };

      SwitchElm.prototype.getEditInfo = function(n) {};

      SwitchElm.prototype.setEditValue = function(n, ei) {
        return n === 0;
      };

      SwitchElm.prototype.toString = function() {
        return "SwitchElm";
      };

      return SwitchElm;

    })(CircuitComponent);
    return SwitchElm;
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!Settings', 'cs!DrawHelper', 'cs!Polygon', 'cs!Rectangle', 'cs!Point', 'cs!CircuitComponent', 'cs!Units'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent, Units) {
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
        return CircuitComponent.prototype.dump.call(this) + " " + this.size + " " + this.text;
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

      TextElm.prototype.draw = function() {
        var by_, color, cury, f, fm, i, maxw, s, w, x;
        color = (this.needsHighlight() ? CircuitComponent.selectColor : Color.LIGHT_GREY);
        f = new Font("SansSerif", 0, size);
        g.setFont(f);
        fm = g.getFontMetrics();
        i = void 0;
        maxw = -1;
        i = 0;
        while (i !== lines.size()) {
          w = fm.stringWidth(this.lines[i]);
          if (w > maxw) {
            maxw = w;
          }
          i++;
        }
        cury = y;
        this.setBbox(this.x1, this.y, this.x1, this.y);
        i = 0;
        i = 0;
        while (i !== this.lines.length) {
          s = this.lines[i];
          if ((this.flags & TextElm.FLAG_CENTER) !== 0) {
            x = (Circuit.winSize.width - fm.stringWidth(s)) / 2;
          }
          g.drawString(s, this.x1, cury);
          if ((this.flags & TextElm.FLAG_BAR) !== 0) {
            by_ = cury - fm.getAscent();
            CircuitComponent.drawLine(this.x1, by_, this.x1 + fm.stringWidth(s) - 1, by_);
          }
          this.adjustBbox(this.x1, cury - fm.getAscent(), this.x1 + fm.stringWidth(s), cury + fm.getDescent());
          cury += fm.getHeight();
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

(function() {
  define(['cs!Settings', 'cs!DrawHelper', 'cs!Polygon', 'cs!Rectangle', 'cs!Point', 'cs!CircuitComponent', 'cs!Units'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent, Units) {
    var TransistorElm;
    TransistorElm = (function() {
      TransistorElm.FLAG_FLIP = 1;

      function TransistorElm(xa, ya, xb, yb, f, st) {
        var beta, lastvbc, lastvbe, pnp;
        TransistorElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
        this.beta = 100;
        this.rect = [];
        this.coll = [];
        this.emit = [];
        this.base = new Point();
        this.pnp = 0;
        this.fgain = 0;
        this.gmin = 0;
        this.ie = 0;
        this.ic = 0;
        this.ib = 0;
        this.curcount_c = 0;
        this.curcount_e = 0;
        this.curcount_b = 0;
        this.rectPoly = 0;
        this.arrowPoly = 0;
        this.vt = .025;
        this.vdcoef = 1 / this.vt;
        this.rgain = .5;
        this.vcrit = 0;
        this.lastvbc = 0;
        this.lastvbe = 0;
        this.leakage = 1e-13;
        if (st && st.length > 0) {
          if (typeof st === "string") {
            st = st.split(" ");
          }
          pnp = st.shift();
          if (pnp) {
            this.pnp = parseInt(pnp);
          }
          lastvbe = st.shift();
          if (lastvbe) {
            this.lastvbe = parseFloat(lastvbe);
          }
          lastvbc = st.shift();
          if (lastvbc) {
            this.lastvbc = parseFloat(lastvbc);
          }
          beta = st.shift();
          if (beta) {
            this.beta = parseFloat(beta);
          }
        }
        this.volts[0] = 0;
        this.volts[1] = -this.lastvbe;
        this.volts[2] = -this.lastvbc;
        this.setup();
      }

      TransistorElm.prototype.setup = function() {
        this.vcrit = this.vt * Math.log(this.vt / (Math.sqrt(2) * this.leakage));
        this.fgain = this.beta / (this.beta + 1);
        return this.noDiagonal = true;
      };

      TransistorElm.prototype.nonLinear = function() {
        return true;
      };

      TransistorElm.prototype.reset = function() {
        this.volts[0] = this.volts[1] = this.volts[2] = 0;
        return this.lastvbc = this.lastvbe = this.curcount_c = this.curcount_e = this.curcount_b = 0;
      };

      TransistorElm.prototype.getDumpType = function() {
        return "t";
      };

      TransistorElm.prototype.dump = function() {
        return CircuitComponent.prototype.dump.call(this) + " " + this.pnp + " " + (this.volts[0] - this.volts[1]) + " " + (this.volts[0] - this.volts[2]) + " " + this.beta;
      };

      TransistorElm.prototype.draw = function() {
        var color, ds;
        this.setBboxPt(this.point1, this.point2, 16);
        this.setPowerColor(true);
        color = this.setVoltageColor(this.volts[1]);
        CircuitComponent.drawThickLinePt(this.coll[0], this.coll[1], color);
        color = this.setVoltageColor(this.volts[2]);
        CircuitComponent.drawThickLinePt(this.emit[0], this.emit[1], color);
        CircuitComponent.drawThickPolygonP(this.arrowPoly, Color.CYAN);
        color = this.setVoltageColor(this.volts[0]);
        if (Circuit.powerCheckItem) {
          g.setColor(Color.gray);
        }
        CircuitComponent.drawThickLinePt(this.point1, this.base, color);
        this.curcount_b = this.updateDotCount(-this.ib, this.curcount_b);
        this.drawDots(this.base, this.point1, this.curcount_b);
        this.curcount_c = this.updateDotCount(-this.ic, this.curcount_c);
        this.drawDots(this.coll[1], this.coll[0], this.curcount_c);
        this.curcount_e = this.updateDotCount(-this.ie, this.curcount_e);
        this.drawDots(this.emit[1], this.emit[0], this.curcount_e);
        color = this.setVoltageColor(this.volts[0]);
        this.setPowerColor(true);
        CircuitComponent.drawThickPolygonP(this.rectPoly, color);
        if ((this.needsHighlight() || Circuit.dragElm === this) && this.dy === 0) {
          CircuitComponent.setColor(Color.white);
          ds = MathUtils.sign(this.dx);
          this.drawCenteredText("B", this.base.x1 - 10 * ds, this.base.y - 5, Color.WHITE);
          this.drawCenteredText("C", this.coll[0].x1 - 3 + 9 * ds, this.coll[0].y + 4, Color.WHITE);
          this.drawCenteredText("E", this.emit[0].x1 - 3 + 9 * ds, this.emit[0].y + 4, Color.WHITE);
        }
        return this.drawPosts();
      };

      TransistorElm.prototype.getPost = function(n) {
        if (n === 0) {
          return this.point1;
        } else {
          if (n === 1) {
            return this.coll[0];
          } else {
            return this.emit[0];
          }
        }
      };

      TransistorElm.prototype.getPostCount = function() {
        return 3;
      };

      TransistorElm.prototype.getPower = function() {
        return (this.volts[0] - this.volts[2]) * this.ib + (this.volts[1] - this.volts[2]) * this.ic;
      };

      TransistorElm.prototype.setPoints = function() {
        var hs, hs2, pt;
        CircuitComponent.prototype.setPoints.call(this);
        hs = 16;
        if ((this.flags & TransistorElm.FLAG_FLIP) !== 0) {
          this.dsign = -this.dsign;
        }
        hs2 = hs * this.dsign * this.pnp;
        this.coll = CircuitComponent.newPointArray(2);
        this.emit = CircuitComponent.newPointArray(2);
        DrawHelper.interpPoint(this.point1, this.point2, 1, hs2, this.coll[0], this.emit[0]);
        this.rect = CircuitComponent.newPointArray(4);
        DrawHelper.interpPoint(this.point1, this.point2, 1 - 16 / this.dn, hs, this.rect[0], this.rect[1]);
        DrawHelper.interpPoint(this.point1, this.point2, 1 - 13 / this.dn, hs, this.rect[2], this.rect[3]);
        DrawHelper.interpPoint(this.point1, this.point2, 1 - 13 / this.dn, 6 * this.dsign * this.pnp, this.coll[1], this.emit[1]);
        this.base = new Point();
        DrawHelper.interpPoint(this.point1, this.point2, this.base, 1 - 16 / this.dn);
        this.rectPoly = CircuitComponent.createPolygon(this.rect[0], this.rect[2], this.rect[3], this.rect[1]);
        if (this.pnp !== 1) {
          pt = DrawHelper.interpPoint(this.point1, this.point2, 1 - 11 / this.dn, -5 * this.dsign * this.pnp);
          return this.arrowPoly = DrawHelper.calcArrow(this.emit[0], pt, 8, 4);
        }
      };

      TransistorElm.prototype.limitStep = function(vnew, vold) {
        var arg, oo;
        arg = void 0;
        oo = vnew;
        if (vnew > this.vcrit && Math.abs(vnew - vold) > (this.vt + this.vt)) {
          if (vold > 0) {
            arg = 1 + (vnew - vold) / this.vt;
            if (arg > 0) {
              vnew = vold + this.vt * Math.log(arg);
            } else {
              vnew = this.vcrit;
            }
          } else {
            vnew = this.vt * Math.log(vnew / this.vt);
          }
          Circuit.converged = false;
        }
        return vnew;
      };

      TransistorElm.prototype.stamp = function(solver) {
        Circuit.stampNonLinear(this.nodes[0]);
        Circuit.stampNonLinear(this.nodes[1]);
        return Circuit.stampNonLinear(this.nodes[2]);
      };

      TransistorElm.prototype.doStep = function() {
        var expbc, expbe, gcc, gce, gec, gee, pcoef, vbc, vbe;
        vbc = this.volts[0] - this.volts[1];
        vbe = this.volts[0] - this.volts[2];
        if (Math.abs(vbc - this.lastvbc) > .01 || Math.abs(vbe - this.lastvbe) > .01) {
          Circuit.converged = false;
        }
        this.gmin = 0;
        if (Circuit.subIterations > 100) {
          this.gmin = Math.exp(-9 * Math.log(10) * (1 - Circuit.subIterations / 3000.0));
          if (this.gmin > .1) {
            this.gmin = .1;
          }
        }
        vbc = this.pnp * this.limitStep(this.pnp * vbc, this.pnp * this.lastvbc);
        vbe = this.pnp * this.limitStep(this.pnp * vbe, this.pnp * this.lastvbe);
        this.lastvbc = vbc;
        this.lastvbe = vbe;
        pcoef = this.vdcoef * this.pnp;
        expbc = Math.exp(vbc * pcoef);
        expbe = Math.exp(vbe * pcoef);
        if (expbe < 1) {
          expbe = 1;
        }
        this.ie = this.pnp * this.leakage * (-(expbe - 1) + this.rgain * (expbc - 1));
        this.ic = this.pnp * this.leakage * (this.fgain * (expbe - 1) - (expbc - 1));
        this.ib = -(this.ie + this.ic);
        gee = -this.leakage * this.vdcoef * expbe;
        gec = this.rgain * this.leakage * this.vdcoef * expbc;
        gce = -gee * this.fgain;
        gcc = -gec * (1 / this.rgain);
        Circuit.stampMatrix(this.nodes[0], this.nodes[0], -gee - gec - gce - gcc + this.gmin * 2);
        Circuit.stampMatrix(this.nodes[0], this.nodes[1], gec + gcc - this.gmin);
        Circuit.stampMatrix(this.nodes[0], this.nodes[2], gee + gce - this.gmin);
        Circuit.stampMatrix(this.nodes[1], this.nodes[0], gce + gcc - this.gmin);
        Circuit.stampMatrix(this.nodes[1], this.nodes[1], -gcc + this.gmin);
        Circuit.stampMatrix(this.nodes[1], this.nodes[2], -gce);
        Circuit.stampMatrix(this.nodes[2], this.nodes[0], gee + gec - this.gmin);
        Circuit.stampMatrix(this.nodes[2], this.nodes[1], -gec);
        Circuit.stampMatrix(this.nodes[2], this.nodes[2], -gee + this.gmin);
        Circuit.stampRightSide(this.nodes[0], -this.ib - (gec + gcc) * vbc - (gee + gce) * vbe);
        Circuit.stampRightSide(this.nodes[1], -this.ic + gce * vbe + gcc * vbc);
        return Circuit.stampRightSide(this.nodes[2], -this.ie + gee * vbe + gec * vbc);
      };

      TransistorElm.prototype.getInfo = function(arr) {
        var vbc, vbe, vce;
        arr[0] = "transistor (" + (this.pnp === -1 ? "PNP)" : "NPN)") + " beta=" + showFormat.format(this.beta);
        vbc = this.volts[0] - this.volts[1];
        vbe = this.volts[0] - this.volts[2];
        vce = this.volts[1] - this.volts[2];
        if (vbc * this.pnp > .2) {
          arr[1] = (vbe * this.pnp > .2 ? "saturation" : "reverse active");
        } else {
          arr[1] = (vbe * this.pnp > .2 ? "fwd active" : "cutoff");
        }
        arr[2] = "Ic = " + this.getCurrentText(this.ic);
        arr[3] = "Ib = " + this.getCurrentText(this.ib);
        arr[4] = "Vbe = " + this.getVoltageText(vbe);
        arr[5] = "Vbc = " + this.getVoltageText(vbc);
        return arr[6] = "Vce = " + this.getVoltageText(vce);
      };

      TransistorElm.prototype.getScopeValue = function(x) {
        switch (x) {
          case Oscilloscope.VAL_IB:
            return this.ib;
          case Oscilloscope.VAL_IC:
            return this.ic;
          case Oscilloscope.VAL_IE:
            return this.ie;
          case Oscilloscope.VAL_VBE:
            return this.volts[0] - this.volts[2];
          case Oscilloscope.VAL_VBC:
            return this.volts[0] - this.volts[1];
          case Oscilloscope.VAL_VCE:
            return this.volts[1] - this.volts[2];
        }
        return 0;
      };

      TransistorElm.prototype.getScopeUnits = function(x) {
        switch (x) {
          case Oscilloscope.VAL_IB:
          case Oscilloscope.VAL_IC:
          case Oscilloscope.VAL_IE:
            return "A";
          default:
            return "V";
        }
      };

      TransistorElm.prototype.getEditInfo = function(n) {
        var ei;
        if (n === 0) {
          return new EditInfo("Beta/hFE", this.beta, 10, 1000).setDimensionless();
        }
        if (n === 1) {
          ei = new EditInfo("", 0, -1, -1);
          ei.checkbox = new Checkbox("Swap E/C", (this.flags & TransistorElm.FLAG_FLIP) !== 0);
          return ei;
        }
        return null;
      };

      TransistorElm.prototype.setEditValue = function(n, ei) {
        if (n === 0) {
          this.beta = ei.value;
          this.setup();
        }
        if (n === 1) {
          if (ei.checkbox.getState()) {
            this.flags |= TransistorElm.FLAG_FLIP;
          } else {
            this.flags &= ~TransistorElm.FLAG_FLIP;
          }
          return this.setPoints();
        }
      };

      TransistorElm.prototype.canViewInScope = function() {
        return true;
      };

      return TransistorElm;

    })();
    return TransistorElm;
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!Settings', 'cs!DrawHelper', 'cs!Polygon', 'cs!Rectangle', 'cs!Point', 'cs!CircuitComponent', 'cs!Units'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent, Units) {
    var VarRailElm;
    VarRailElm = (function(_super) {
      __extends(VarRailElm, _super);

      function VarRailElm(xa, ya, xb, yb, f, st) {
        VarRailElm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
        this.sliderText = "voltage";
        this.frequency = this.maxVoltage;
        this.createSlider();
      }

      VarRailElm.prototype.dump = function() {
        return RailElm.prototype.dump.call(this) + " " + this.sliderText;
      };

      VarRailElm.prototype.getDumpType = function() {
        return 172;
      };

      VarRailElm.prototype.createSlider = function() {};

      VarRailElm.prototype.getVoltage = function() {
        var frequency;
        frequency = slider.getValue() * (maxVoltage - bias) / 100.0 + bias;
        return frequency;
      };

      VarRailElm.prototype.destroy = function() {
        Circuit.main.remove(label);
        return Circuit.main.remove(slider);
      };

      VarRailElm.prototype.getEditInfo = function(n) {
        var ei;
        if (n === 0) {
          return new EditInfo("Min Voltage", bias, -20, 20);
        }
        if (n === 1) {
          return new EditInfo("Max Voltage", maxVoltage, -20, 20);
        }
        if (n === 2) {
          ei = new EditInfo("Slider Text", 0, -1, -1);
          ei.text = sliderText;
          return ei;
        }
        return null;
      };

      VarRailElm.prototype.setEditValue = function(n, ei) {
        var bias, maxVoltage, sliderText;
        if (n === 0) {
          bias = ei.value;
        }
        if (n === 1) {
          maxVoltage = ei.value;
        }
        if (n === 2) {
          sliderText = ei.textf.getText();
          return label.setText(sliderText);
        }
      };

      return VarRailElm;

    })(RailElm);
    return VarRailElm;
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!Settings', 'cs!DrawHelper', 'cs!Polygon', 'cs!Rectangle', 'cs!Point', 'cs!CircuitComponent'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent) {
    var VoltageElm;
    VoltageElm = (function(_super) {
      __extends(VoltageElm, _super);

      VoltageElm.FLAG_COS = 2;

      VoltageElm.WF_DC = 0;

      VoltageElm.WF_AC = 1;

      VoltageElm.WF_SQUARE = 2;

      VoltageElm.WF_TRIANGLE = 3;

      VoltageElm.WF_SAWTOOTH = 4;

      VoltageElm.WF_PULSE = 5;

      VoltageElm.WF_VAR = 6;

      VoltageElm.circleSize = 17;

      function VoltageElm(xa, ya, xb, yb, f, st) {
        VoltageElm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
        this.waveform = VoltageElm.WF_DC;
        this.frequency = 40;
        this.maxVoltage = 5;
        this.freqTimeZero = 0;
        this.bias = 0;
        this.phaseShift = 0;
        this.dutyCycle = 0.5;
        if (st) {
          if (typeof st === "string") {
            st = st.split(" ");
          }
          this.waveform = (st[0] ? Math.floor(parseInt(st[0])) : VoltageElm.WF_DC);
          this.frequency = (st[1] ? parseFloat(st[1]) : 40);
          this.maxVoltage = (st[2] ? parseFloat(st[2]) : 5);
          this.bias = (st[3] ? parseFloat(st[3]) : 0);
          this.phaseShift = (st[4] ? parseFloat(st[4]) : 0);
          this.dutyCycle = (st[5] ? parseFloat(st[5]) : 0.5);
        }
        if (this.flags & VoltageElm.FLAG_COS !== 0) {
          this.flags &= ~VoltageElm.FLAG_COS;
          this.phaseShift = Math.PI / 2;
        }
        this.reset();
      }

      VoltageElm.prototype.getDumpType = function() {
        return "v";
      };

      VoltageElm.prototype.dump = function() {
        return CircuitComponent.prototype.dump.call(this) + " " + this.waveform + " " + this.frequency + " " + this.maxVoltage + " " + this.bias + " " + this.phaseShift + " " + this.dutyCycle;
      };

      VoltageElm.prototype.reset = function() {
        this.freqTimeZero = 0;
        return this.curcount = 5;
      };

      VoltageElm.prototype.triangleFunc = function(x) {
        if (x < Math.PI) {
          return x * (2 / Math.PI) - 1;
        }
        return 1 - (x - Math.PI) * (2 / Math.PI);
      };

      VoltageElm.prototype.stamp = function() {
        if (this.waveform === VoltageElm.WF_DC) {
          return this.Circuit.Solver.Stamper.stampVoltageSource(this.nodes[0], this.nodes[1], this.voltSource, this.getVoltage());
        } else {
          return this.Circuit.Solver.Stamper.stampVoltageSource(this.nodes[0], this.nodes[1], this.voltSource);
        }
      };

      VoltageElm.prototype.doStep = function() {
        if (this.waveform !== VoltageElm.WF_DC) {
          return this.Circuit.Solver.updateVoltageSource(this.nodes[0], this.nodes[1], this.voltSource, this.getVoltage());
        }
      };

      VoltageElm.prototype.getVoltage = function() {
        var omega;
        omega = 2 * Math.PI * (this.Circuit.Solver.time - this.freqTimeZero) * this.frequency + this.phaseShift;
        switch (this.waveform) {
          case VoltageElm.WF_DC:
            return this.maxVoltage + this.bias;
          case VoltageElm.WF_AC:
            return Math.sin(omega) * this.maxVoltage + this.bias;
          case VoltageElm.WF_SQUARE:
            return this.bias + (omega % (2 * Math.PI) > (2 * Math.PI * this.dutyCycle) ? -this.maxVoltage : this.maxVoltage);
          case VoltageElm.WF_TRIANGLE:
            return this.bias + this.triangleFunc(omega % (2 * Math.PI)) * this.maxVoltage;
          case VoltageElm.WF_SAWTOOTH:
            return this.bias + (omega % (2 * Math.PI)) * (this.maxVoltage / Math.PI) - this.maxVoltage;
          case VoltageElm.WF_PULSE:
            if ((omega % (2 * Math.PI)) < 1) {
              return this.maxVoltage + this.bias;
            } else {
              return this.bias;
            }
            break;
          default:
            return 0;
        }
      };

      VoltageElm.prototype.setPoints = function() {
        VoltageElm.__super__.setPoints.call(this);
        return this.calcLeads((this.waveform === VoltageElm.WF_DC || this.waveform === VoltageElm.WF_VAR ? 8 : VoltageElm.circleSize * 2));
      };

      VoltageElm.prototype.draw = function(renderContext) {
        var ptA, ptB, _ref, _ref1;
        this.setBbox(this.x1, this.y2, this.x2, this.y2);
        this.draw2Leads(renderContext);
        if (this.waveform === VoltageElm.WF_DC) {
          _ref = DrawHelper.interpPoint2(this.lead1, this.lead2, 0, 10), ptA = _ref[0], ptB = _ref[1];
          renderContext.drawThickLinePt(this.lead1, ptA, DrawHelper.getVoltageColor(this.volts[0]));
          renderContext.drawThickLinePt(ptA, ptB, DrawHelper.getVoltageColor(this.volts[0]));
          this.setBboxPt(this.point1, this.point2, 16);
          _ref1 = DrawHelper.interpPoint2(this.lead1, this.lead2, 1, 16), ptA = _ref1[0], ptB = _ref1[1];
          renderContext.drawThickLinePt(ptA, ptB, DrawHelper.getVoltageColor(this.volts[1]));
        } else {
          this.setBboxPt(this.point1, this.point2, VoltageElm.circleSize);
          DrawHelper.interpPoint(this.lead1, this.lead2, 0.5, DrawHelper.ps1);
          this.drawWaveform(DrawHelper.ps1, renderContext);
        }
        this.drawPosts(renderContext);
        return this.drawDots(this.point1, this.point2, renderContext);
      };

      VoltageElm.prototype.drawWaveform = function(center, renderContext) {
        var color, i, ox, oy, valueString, wl, xc, xc2, xl, yc, yy;
        color = this.needsHighlight() ? Settings.FG_COLOR : void 0;
        xc = center.x;
        yc = center.y;
        renderContext.fillCircle(xc, yc, VoltageElm.circleSize, color);
        wl = 8;
        this.adjustBbox(xc - VoltageElm.circleSize, yc - VoltageElm.circleSize, xc + VoltageElm.circleSize, yc + VoltageElm.circleSize);
        xc2 = void 0;
        switch (this.waveform) {
          case VoltageElm.WF_DC:
            break;
          case VoltageElm.WF_SQUARE:
            xc2 = Math.floor(wl * 2 * this.dutyCycle - wl + xc);
            xc2 = Math.max(xc - wl + 3, Math.min(xc + wl - 3, xc2));
            renderContext.drawThickLine(xc - wl, yc - wl, xc - wl, yc, color);
            renderContext.drawThickLine(xc - wl, yc - wl, xc2, yc - wl, color);
            renderContext.drawThickLine(xc2, yc - wl, xc2, yc + wl, color);
            renderContext.drawThickLine(xc + wl, yc + wl, xc2, yc + wl, color);
            renderContext.drawThickLine(xc + wl, yc, xc + wl, yc + wl, color);
            break;
          case VoltageElm.WF_PULSE:
            yc += wl / 2;
            renderContext.drawThickLine(xc - wl, yc - wl, xc - wl, yc, color);
            renderContext.drawThickLine(xc - wl, yc - wl, xc - wl / 2, yc - wl, color);
            renderContext.drawThickLine(xc - wl / 2, yc - wl, xc - wl / 2, yc, color);
            renderContext.drawThickLine(xc - wl / 2, yc, xc + wl, yc, color);
            break;
          case VoltageElm.WF_SAWTOOTH:
            renderContext.drawThickLine(xc, yc - wl, xc - wl, yc, color);
            renderContext.drawThickLine(xc, yc - wl, xc, yc + wl, color);
            renderContext.drawThickLine(xc, yc + wl, xc + wl, yc, color);
            break;
          case VoltageElm.WF_TRIANGLE:
            xl = 5;
            renderContext.drawThickLine(xc - xl * 2, yc, xc - xl, yc - wl, color);
            renderContext.drawThickLine(xc - xl, yc - wl, xc, yc, color);
            renderContext.drawThickLine(xc, yc, xc + xl, yc + wl, color);
            renderContext.drawThickLine(xc + xl, yc + wl, xc + xl * 2, yc, color);
            break;
          case VoltageElm.WF_AC:
            xl = 10;
            ox = -1;
            oy = -1;
            i = -xl;
            while (i <= xl) {
              yy = yc + Math.floor(0.95 * Math.sin(i * Math.PI / xl) * wl);
              if (ox !== -1) {
                renderContext.drawThickLine(ox, oy, xc + i, yy, color);
              }
              ox = xc + i;
              oy = yy;
              i++;
            }
            break;
        }
        if (Settings.showValuesCheckItem) {
          valueString = CircuitComponent.getShortUnitText(this.frequency, "Hz");
          if (this.dx === 0 || this.dy === 0) {
            return this.drawValues(valueString, VoltageElm.circleSize);
          }
        }
      };

      VoltageElm.prototype.getVoltageSourceCount = function() {
        return 1;
      };

      VoltageElm.prototype.getPower = function() {
        return -this.getVoltageDiff() * this.current;
      };

      VoltageElm.prototype.getVoltageDiff = function() {
        return this.volts[1] - this.volts[0];
      };

      VoltageElm.prototype.getInfo = function(arr) {
        var i;
        switch (this.waveform) {
          case VoltageElm.WF_DC:
          case VoltageElm.WF_VAR:
            arr[0] = "voltage source";
            break;
          case VoltageElm.WF_AC:
            arr[0] = "A/C source";
            break;
          case VoltageElm.WF_SQUARE:
            arr[0] = "square wave gen";
            break;
          case VoltageElm.WF_PULSE:
            arr[0] = "pulse gen";
            break;
          case VoltageElm.WF_SAWTOOTH:
            arr[0] = "sawtooth gen";
            break;
          case VoltageElm.WF_TRIANGLE:
            arr[0] = "triangle gen";
        }
        arr[1] = "I = " + CircuitComponent.getCurrentText(this.getCurrent());
        arr[2] = (this instanceof RailElm ? "V = " : "Vd = ") + CircuitComponent.getVoltageText(this.getVoltageDiff());
        if (this.waveform !== VoltageElm.WF_DC && this.waveform !== VoltageElm.WF_VAR) {
          arr[3] = "f = " + CircuitComponent.getUnitText(this.frequency, "Hz");
          arr[4] = "Vmax = " + CircuitComponent.getVoltageText(this.maxVoltage);
          i = 5;
          if (this.bias !== 0) {
            arr[i++] = "Voff = " + this.getVoltageText(this.bias);
          } else {
            if (this.frequency > 500) {
              arr[i++] = "wavelength = " + CircuitComponent.getUnitText(2.9979e8 / this.frequency, "m");
            }
          }
          return arr[i++] = "P = " + CircuitComponent.getUnitText(this.getPower(), "W");
        }
      };

      VoltageElm.prototype.getEditInfo = function(n) {
        var ei;
        if (n === 0) {
          return new EditInfo((this.waveform === VoltageElm.WF_DC ? "Voltage" : "Max Voltage"), this.maxVoltage, -20, 20);
        }
        if (n === 1) {
          ei = new EditInfo("Waveform", this.waveform, -1, -1);
          ei.choice = new Array();
          ei.choice.push("D/C");
          ei.choice.push("A/C");
          ei.choice.push("Square Wave");
          ei.choice.push("Triangle");
          ei.choice.push("Sawtooth");
          ei.choice.push("Pulse");
          ei.choice.push(this.waveform);
          return ei;
          if (this.waveform === VoltageElm.WF_DC) {
            return null;
          }
          if (n === 2) {
            return new EditInfo("Frequency (Hz)", this.frequency, 4, 500);
          }
          if (n === 3) {
            return new EditInfo("DC Offset (V)", this.bias, -20, 20);
          }
          if (n === 4) {
            return new EditInfo("Phase Offset (degrees)", this.phaseShift * 180 / Math.PI, -180, 180).setDimensionless();
          }
          if (n === 5 && this.waveform === VoltageElm.WF_SQUARE) {
            return new EditInfo("Duty Cycle", this.dutyCycle * 100, 0, 100).setDimensionless();
          }
        }
      };

      VoltageElm.prototype.setEditValue = function(n, ei) {
        var adj, maxfreq, oldfreq, waveform, _ref, _ref1, _ref2;
        if (n === 0) {
          this.maxVoltage = ei.value;
        }
        if (n === 3) {
          this.bias = ei.value;
        }
        if (n === 2) {
          oldfreq = this.frequency;
          this.frequency = ei.value;
          maxfreq = 1 / (8 * ((_ref = this.Circuit) != null ? _ref.timeStep : void 0));
          if (this.frequency > maxfreq) {
            this.frequency = maxfreq;
          }
          adj = this.frequency - oldfreq;
          this.freqTimeZero = ((_ref1 = this.Circuit) != null ? _ref1.time : void 0) - oldfreq * (((_ref2 = this.Circuit) != null ? _ref2.time : void 0) - this.freqTimeZero) / this.frequency;
        }
        if (n === 1) {
          waveform = this.waveform;
          if (this.waveform === VoltageElm.WF_DC && waveform !== VoltageElm.WF_DC) {
            this.bias = 0;
          } else {
            this.waveform !== VoltageElm.WF_DC && waveform === VoltageElm.WF_DC;
          }
          if ((this.waveform === VoltageElm.WF_SQUARE || waveform === VoltageElm.WF_SQUARE) && this.waveform !== waveform) {
            this.setPoints();
          }
        }
        if (n === 4) {
          this.phaseShift = ei.value * Math.PI / 180;
        }
        if (n === 5) {
          return this.dutyCycle = ei.value * 0.01;
        }
      };

      VoltageElm.prototype.toString = function() {
        return "VoltageElm";
      };

      return VoltageElm;

    })(CircuitComponent);
    return VoltageElm;
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!Settings', 'cs!DrawHelper', 'cs!Polygon', 'cs!Rectangle', 'cs!Point', 'cs!CircuitComponent'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent) {
    var WireElm;
    WireElm = (function(_super) {
      __extends(WireElm, _super);

      function WireElm(xa, ya, xb, yb, f, st) {
        WireElm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
      }

      WireElm.prototype.toString = function() {
        return "WireElm";
      };

      WireElm.FLAG_SHOWCURRENT = 1;

      WireElm.FLAG_SHOWVOLTAGE = 2;

      WireElm.prototype.draw = function(renderContext) {
        var s;
        renderContext.drawThickLinePt(this.point1, this.point2, DrawHelper.getVoltageColor(this.volts[0]));
        this.setBboxPt(this.point1, this.point2, 3);
        if (this.mustShowCurrent()) {
          s = CircuitComponent.getShortUnitText(Math.abs(this.getCurrent()), "A");
          this.drawValues(s, 4);
        } else if (this.mustShowVoltage()) {
          s = CircuitComponent.getShortUnitText(this.volts[0], "V");
        }
        this.drawValues(s, 4);
        this.drawPosts(renderContext);
        return this.drawDots(this.point1, this.point2, renderContext);
      };

      WireElm.prototype.stamp = function() {
        return this.Circuit.Solver.Stamper.stampVoltageSource(this.nodes[0], this.nodes[1], this.voltSource, 0);
      };

      WireElm.prototype.mustShowCurrent = function() {
        return (this.flags & WireElm.FLAG_SHOWCURRENT) !== 0;
      };

      WireElm.prototype.mustShowVoltage = function() {
        return (this.flags & WireElm.FLAG_SHOWVOLTAGE) !== 0;
      };

      WireElm.prototype.getVoltageSourceCount = function() {
        return 1;
      };

      WireElm.prototype.getInfo = function(arr) {
        arr[0] = "Wire";
        arr[1] = "I = " + CircuitComponent.getCurrentDText(this.getCurrent());
        return arr[2] = "V = " + CircuitComponent.getVoltageText(this.volts[0]);
      };

      WireElm.prototype.getEditInfo = function(n) {};

      WireElm.prototype.setEditValue = function(n, ei) {};

      WireElm.prototype.getDumpType = function() {
        return "w";
      };

      WireElm.prototype.getPower = function() {
        return 0;
      };

      WireElm.prototype.getVoltageDiff = function() {
        return this.volts[0];
      };

      WireElm.prototype.isWire = function() {
        return true;
      };

      WireElm.prototype.needsShortcut = function() {
        return true;
      };

      return WireElm;

    })(CircuitComponent);
    return WireElm;
  });

}).call(this);

(function() {
  define([], function() {
    var Diode;
    return Diode = (function() {
      var Inductor;

      function Diode() {
        this.nodes = new Array(2);
        this.vt = 0;
        this.vdcoef = 0;
        this.fwdrop = 0;
        this.zvoltage = 0;
        this.zoffset = 0;
        this.lastvoltdiff = 0;
        this.crit = 0;
      }

      Diode.prototype.leakage = 1e-14;

      Diode.prototype.setup = function(fw, zv) {
        var i;
        this.fwdrop = fw;
        this.zvoltage = zv;
        this.vdcoef = Math.log(1 / this.leakage + 1) / this.fwdrop;
        this.vt = 1 / this.vdcoef;
        this.vcrit = this.vt * Math.log(this.vt / (Math.sqrt(2) * this.leakage));
        if (this.zvoltage !== 0) {
          i = -.005;
          return this.zoffset = this.zvoltage - Math.log(-(1 + i / this.leakage)) / this.vdcoef;
        }
      };

      Diode.prototype.reset = function() {
        return this.lastvoltdiff = 0;
      };

      Diode.prototype.limitStep = function(vnew, vold) {
        var arg, oo, v0;
        arg = void 0;
        oo = vnew;
        if (vnew > this.vcrit && Math.abs(vnew - vold) > (this.vt + this.vt)) {
          if (vold > 0) {
            arg = 1 + (vnew - vold) / this.vt;
            if (arg > 0) {
              vnew = vold + this.vt * Math.log(arg);
              v0 = Math.log(1e-6 / this.leakage) * this.vt;
              vnew = Math.max(v0, vnew);
            } else {
              vnew = this.vcrit;
            }
          } else {
            vnew = this.vt * Math.log(vnew / this.vt);
          }
          Circuit.converged = false;
        } else if (vnew < 0 && this.zoffset !== 0) {
          vnew = -vnew - this.zoffset;
          vold = -vold - this.zoffset;
          if (vnew > this.vcrit && Math.abs(vnew - vold) > (this.vt + this.vt)) {
            if (vold > 0) {
              arg = 1 + (vnew - vold) / this.vt;
              if (arg > 0) {
                vnew = vold + this.vt * Math.log(arg);
                v0 = Math.log(1e-6 / this.leakage) * this.vt;
                vnew = Math.max(v0, vnew);
              } else {
                vnew = this.vcrit;
              }
            } else {
              vnew = this.vt * Math.log(vnew / this.vt);
            }
            Circuit.converged = false;
          }
          vnew = -(vnew + this.zoffset);
        }
        return vnew;
      };

      Diode.prototype.stamp = function(n0, n1) {
        this.nodes[0] = n0;
        this.nodes[1] = n1;
        Circuit.stampNonLinear(this.nodes[0]);
        return Circuit.stampNonLinear(this.nodes[1]);
      };

      Diode.prototype.doStep = function(voltdiff) {
        var eval_, geq, nc;
        if (Math.abs(voltdiff - Circuit.lastvoltdiff) > .01) {
          Circuit.converged = false;
        }
        voltdiff = this.limitStep(voltdiff, Circuit.lastvoltdiff);
        Circuit.lastvoltdiff = voltdiff;
        if (voltdiff >= 0 || this.zvoltage === 0) {
          eval_ = Math.exp(voltdiff * this.vdcoef);
          if (voltdiff < 0) {
            eval_ = 1;
          }
          geq = this.vdcoef * this.leakage * eval_;
          nc = (eval_ - 1) * this.leakage - geq * voltdiff;
          Circuit.stampConductance(this.nodes[0], this.nodes[1], geq);
          return Circuit.stampCurrentSource(this.nodes[0], this.nodes[1], nc);
        } else {
          geq = this.leakage * this.vdcoef * (Math.exp(voltdiff * this.vdcoef) + Math.exp((-voltdiff - this.zoffset) * this.vdcoef));
          nc = this.leakage * (Math.exp(voltdiff * this.vdcoef) - Math.exp((-voltdiff - this.zoffset) * this.vdcoef) - 1) + geq * (-voltdiff);
          Circuit.stampConductance(this.nodes[0], this.nodes[1], geq);
          return Circuit.stampCurrentSource(this.nodes[0], this.nodes[1], nc);
        }
      };

      Diode.prototype.calculateCurrent = function(voltdiff) {
        if (voltdiff >= 0 || this.zvoltage === 0) {
          return this.leakage * (Math.exp(voltdiff * this.vdcoef) - 1);
        }
        return this.leakage * (Math.exp(voltdiff * this.vdcoef) - Math.exp((-voltdiff - this.zoffset) * this.vdcoef) - 1);
      };

      Inductor = function() {
        this.nodes = new Array(2);
        this.flags = 0;
        this.inductance = 0;
        this.compResistance = 0;
        this.current = 0;
        return this.curSourceValue = 0;
      };

      Inductor.FLAG_BACK_EULER = 2;

      Inductor.prototype.setup = function(ic, cr, f) {
        this.inductance = ic;
        this.current = cr;
        return this.flags = f;
      };

      Inductor.prototype.isTrapezoidal = function() {
        return (this.flags & Inductor.FLAG_BACK_EULER) === 0;
      };

      Inductor.prototype.reset = function() {
        return this.current = 0;
      };

      Inductor.prototype.stamp = function(n0, n1) {
        this.nodes[0] = n0;
        this.nodes[1] = n1;
        if (this.isTrapezoidal()) {
          this.compResistance = 2 * this.inductance / Circuit.timeStep;
        } else {
          this.compResistance = this.inductance / Circuit.timeStep;
        }
        Circuit.stampResistor(this.nodes[0], this.nodes[1], this.compResistance);
        Circuit.stampRightSide(this.nodes[0]);
        return Circuit.stampRightSide(this.nodes[1]);
      };

      Inductor.prototype.nonLinear = function() {
        return false;
      };

      Inductor.prototype.startIteration = function(voltdiff) {
        if (this.isTrapezoidal()) {
          return this.curSourceValue = voltdiff / this.compResistance + this.current;
        } else {
          return this.curSourceValue = this.current;
        }
      };

      Inductor.prototype.calculateCurrent = function(voltdiff) {
        if (this.compResistance > 0) {
          this.current = voltdiff / this.compResistance + this.curSourceValue;
        }
        return this.current;
      };

      Inductor.prototype.doStep = function(voltdiff) {
        return Circuit.stampCurrentSource(this.nodes[0], this.nodes[1], this.curSourceValue);
      };

      return Diode;

    })();
  });

}).call(this);

(function() {
  define([], function() {
    var Diode;
    Diode = (function() {
      Diode.leakage = 1e-14;

      function Diode() {
        this.nodes = new Array(2);
        this.vt = 0;
        this.vdcoef = 0;
        this.fwdrop = 0;
        this.zvoltage = 0;
        this.zoffset = 0;
        this.lastvoltdiff = 0;
        this.crit = 0;
      }

      Diode.prototype.setup = function(fw, zv) {
        var i;
        this.fwdrop = fw;
        this.zvoltage = zv;
        this.vdcoef = Math.log(1 / this.leakage + 1) / this.fwdrop;
        this.vt = 1 / this.vdcoef;
        this.vcrit = this.vt * Math.log(this.vt / (Math.sqrt(2) * this.leakage));
        if (this.zvoltage !== 0) {
          i = -.005;
          return this.zoffset = this.zvoltage - Math.log(-(1 + i / this.leakage)) / this.vdcoef;
        }
      };

      Diode.prototype.reset = function() {
        return this.lastvoltdiff = 0;
      };

      Diode.prototype.limitStep = function(vnew, vold) {
        var arg, oo, v0;
        arg = void 0;
        oo = vnew;
        if (vnew > this.vcrit && Math.abs(vnew - vold) > (this.vt + this.vt)) {
          if (vold > 0) {
            arg = 1 + (vnew - vold) / this.vt;
            if (arg > 0) {
              vnew = vold + this.vt * Math.log(arg);
              v0 = Math.log(1e-6 / this.leakage) * this.vt;
              vnew = Math.max(v0, vnew);
            } else {
              vnew = this.vcrit;
            }
          } else {
            vnew = this.vt * Math.log(vnew / this.vt);
          }
          Circuit.converged = false;
        } else if (vnew < 0 && this.zoffset !== 0) {
          vnew = -vnew - this.zoffset;
          vold = -vold - this.zoffset;
          if (vnew > this.vcrit && Math.abs(vnew - vold) > (this.vt + this.vt)) {
            if (vold > 0) {
              arg = 1 + (vnew - vold) / this.vt;
              if (arg > 0) {
                vnew = vold + this.vt * Math.log(arg);
                v0 = Math.log(1e-6 / this.leakage) * this.vt;
                vnew = Math.max(v0, vnew);
              } else {
                vnew = this.vcrit;
              }
            } else {
              vnew = this.vt * Math.log(vnew / this.vt);
            }
            Circuit.converged = false;
          }
          vnew = -(vnew + this.zoffset);
        }
        return vnew;
      };

      return Diode;

    })();
    return {
      stamp: function(n0, n1) {
        this.nodes[0] = n0;
        this.nodes[1] = n1;
        Circuit.stampNonLinear(this.nodes[0]);
        return Circuit.stampNonLinear(this.nodes[1]);
      },
      doStep: function(voltdiff) {
        var eval_, geq, nc;
        if (Math.abs(voltdiff - Circuit.lastvoltdiff) > .01) {
          Circuit.converged = false;
        }
        voltdiff = this.limitStep(voltdiff, Circuit.lastvoltdiff);
        Circuit.lastvoltdiff = voltdiff;
        if (voltdiff >= 0 || this.zvoltage === 0) {
          eval_ = Math.exp(voltdiff * this.vdcoef);
          if (voltdiff < 0) {
            eval_ = 1;
          }
          geq = this.vdcoef * this.leakage * eval_;
          nc = (eval_ - 1) * this.leakage - geq * voltdiff;
          Circuit.stampConductance(this.nodes[0], this.nodes[1], geq);
          return Circuit.stampCurrentSource(this.nodes[0], this.nodes[1], nc);
        } else {
          geq = this.leakage * this.vdcoef * (Math.exp(voltdiff * this.vdcoef) + Math.exp((-voltdiff - this.zoffset) * this.vdcoef));
          nc = this.leakage * (Math.exp(voltdiff * this.vdcoef) - Math.exp((-voltdiff - this.zoffset) * this.vdcoef) - 1) + geq * (-voltdiff);
          Circuit.stampConductance(this.nodes[0], this.nodes[1], geq);
          return Circuit.stampCurrentSource(this.nodes[0], this.nodes[1], nc);
        }
      },
      calculateCurrent: function(voltdiff) {
        if (voltdiff >= 0 || this.zvoltage === 0) {
          return this.leakage * (Math.exp(voltdiff * this.vdcoef) - 1);
        }
        return this.leakage * (Math.exp(voltdiff * this.vdcoef) - Math.exp((-voltdiff - this.zoffset) * this.vdcoef) - 1);
      }
    };
  });

}).call(this);

(function() {
  define([], function() {
    var Inductor;
    return Inductor = (function() {
      Inductor.FLAG_BACK_EULER = 2;

      function Inductor() {
        this.nodes = new Array(2);
        this.flags = 0;
        this.inductance = 0;
        this.compResistance = 0;
        this.current = 0;
        this.curSourceValue = 0;
      }

      Inductor.prototype.setup = function(ic, cr, f) {
        this.inductance = ic;
        this.current = cr;
        return this.flags = f;
      };

      Inductor.prototype.isTrapezoidal = function() {
        return (this.flags & Inductor.FLAG_BACK_EULER) === 0;
      };

      Inductor.prototype.reset = function() {
        return this.current = 0;
      };

      Inductor.prototype.stamp = function(n0, n1) {
        this.nodes[0] = n0;
        this.nodes[1] = n1;
        if (this.isTrapezoidal()) {
          this.compResistance = 2 * this.inductance / Circuit.timeStep;
        } else {
          this.compResistance = this.inductance / Circuit.timeStep;
        }
        Circuit.stampResistor(this.nodes[0], this.nodes[1], this.compResistance);
        Circuit.stampRightSide(this.nodes[0]);
        return Circuit.stampRightSide(this.nodes[1]);
      };

      Inductor.prototype.nonLinear = function() {
        return false;
      };

      Inductor.prototype.startIteration = function(voltdiff) {
        if (this.isTrapezoidal()) {
          return this.curSourceValue = voltdiff / this.compResistance + this.current;
        } else {
          return this.curSourceValue = this.current;
        }
      };

      Inductor.prototype.calculateCurrent = function(voltdiff) {
        if (this.compResistance > 0) {
          this.current = voltdiff / this.compResistance + this.curSourceValue;
        }
        return this.current;
      };

      Inductor.prototype.doStep = function(voltdiff) {
        return Circuit.stampCurrentSource(this.nodes[0], this.nodes[1], this.curSourceValue);
      };

      return Inductor;

    })();
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!KeyboardState', 'cs!Oscilloscope', 'cs!Logger', 'cs!ColorMapState', 'cs!CircuitState', 'cs!CircuitCanvas', 'cs!Point', 'cs!Rectangle', 'cs!Polygon', 'cs!Grid', 'cs!CircuitEngineParams', 'cs!MouseState', 'cs!Settings', 'cs!ComponentRegistry', 'cs!Hint', 'cs!CommandHistory', 'cs!CircuitSolver', 'cs!Units', 'cs!Module', 'cs!Observer'], function(KeyboardState, Oscilloscope, Logger, ColorMapState, CircuitState, CircuitCanvas, Point, Rectangle, Polygon, Grid, CircuitEngineParams, MouseState, Settings, ComponentRegistry, Hint, CommandHistory, CircuitSolver, Units, Module, Observer) {
    var Circuit;
    Circuit = (function(_super) {
      __extends(Circuit, _super);

      Circuit.ON_START_UPDATE = "ON_START_UPDATE";

      Circuit.ON_COMPLETE_UPDATE = "ON_END_UPDATE";

      Circuit.ON_START = "ON_START";

      Circuit.ON_PAUSE = "ON_PAUSE";

      Circuit.ON_RESET = "ON_RESET";

      Circuit.ON_SOLDER = "ON_SOLDER";

      Circuit.ON_DESOLDER = "ON_DESOLDER";

      Circuit.ON_ADD_COMPONENT = "ON_ADD_COMPONENT";

      Circuit.ON_REMOVE_COMPONENT = "ON_MOVE_COMPONENT";

      Circuit.ON_MOVE_COMPONENT = "ON_MOVE_COMPONENT";

      Circuit.ON_ERROR = "ON_ERROR";

      Circuit.ON_WARNING = "ON_WARNING";

      function Circuit() {
        this.Params = new CircuitEngineParams();
        this.CommandHistory = new CommandHistory();
        this.clearAndReset();
        this.bindListeners();
      }

      Circuit.prototype.setParamsFromJSON = function(jsonData) {
        return this.Params = new CircuitEngineParams(jsonData);
      };

      Circuit.prototype.clearAndReset = function() {
        var element, _i, _len, _ref;
        _ref = this.elementList != null;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          element = _ref[_i];
          element.destroy();
        }
        this.Solver = new CircuitSolver(this);
        this.Grid = new Grid();
        this.nodeList = [];
        this.elementList = [];
        this.voltageSources = [];
        this.scopes = [];
        this.scopeColCount = [];
        this.time = 0;
        this.lastTime = 0;
        this.mouseState = new MouseState();
        this.keyboardState = new KeyboardState();
        this.colorMapState = new ColorMapState();
        this.state = CircuitState.RUNNING;
        this.clearErrors();
        return this.notifyObservers(this.ON_RESET);
      };

      Circuit.prototype.bindListeners = function() {};

      Circuit.prototype.solder = function(newElement) {
        this.notifyObservers(this.ON_SOLDER);
        newElement.Circuit = this;
        newElement.setPoints();
        console.log("Soldering Element: " + newElement);
        return this.elementList.push(newElement);
      };

      Circuit.prototype.desolder = function(component, destroy) {
        if (destroy == null) {
          destroy = false;
        }
        this.notifyObservers(this.ON_DESOLDER);
        component.Circuit = null;
        this.elementList.remove(component);
        if (destroy) {
          return component.destroy();
        }
      };

      Circuit.prototype.getVoltageSources = function() {
        return this.voltageSources;
      };

      Circuit.prototype.getScopes = function() {
        return [];
      };

      Circuit.prototype.setupScopes = function() {};


      /* Circuit Element Accessors:
       */

      Circuit.prototype.findElm = function(searchElm) {
        var circuitElm, _i, _len, _ref;
        _ref = this.elementList;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          circuitElm = _ref[_i];
          if (searchElm === circuitElm) {
            return circuitElm;
          }
        }
        return false;
      };

      Circuit.prototype.getElements = function() {
        return this.elementList;
      };

      Circuit.prototype.getElmByIdx = function(elmIdx) {
        return this.elementList[elmIdx];
      };

      Circuit.prototype.numElements = function() {
        return this.elementList.length;
      };


      /* Circuit Nodes:
       */

      Circuit.prototype.resetNodes = function() {
        return this.nodeList = [];
      };

      Circuit.prototype.addCircuitNode = function(circuitNode) {
        var _ref;
        return (_ref = this.nodeList) != null ? _ref.push(circuitNode) : void 0;
      };

      Circuit.prototype.getNode = function(idx) {
        return this.nodeList[idx];
      };

      Circuit.prototype.getNodes = function() {
        return this.nodeList;
      };

      Circuit.prototype.numNodes = function() {
        var _ref;
        return (_ref = this.nodeList) != null ? _ref.length : void 0;
      };

      Circuit.prototype.getGrid = function() {
        return this.Grid;
      };

      Circuit.prototype.findBadNodes = function() {
        var circuitElm, circuitNode, firstCircuitNode, numBadPoints, _i, _j, _len, _len1, _ref, _ref1;
        this.badNodes = [];
        _ref = this.nodeList;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          circuitNode = _ref[_i];
          if (!circuitNode.intern && circuitNode.links.length === 1) {
            numBadPoints = 0;
            firstCircuitNode = circuitNode.links[0];
            _ref1 = this.elementList;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              circuitElm = _ref1[_j];
              if (firstCircuitNode.elm.equal_to(circuitElm) === false && circuitElm.boundingBox.contains(circuitNode.x, circuitNode.y)) {
                numBadPoints++;
              }
            }
            if (numBadPoints > 0) {
              this.badNodes.push(circuitNode);
            }
          }
        }
        return this.badNodes;
      };


      /* Simulation Frame Computation
       */

      Circuit.prototype.run = function() {
        this.notifyObservers(this.ON_START);
        return this.Solver.run();
      };

      Circuit.prototype.pause = function() {
        this.notifyObservers(this.ON_PAUSE);
        return this.Solver.pause("Circuit is paused");
      };

      Circuit.prototype.restartAndStop = function() {
        this.restartAndRun();
        this.simulation = cancelAnimationFrame();
        return this.Solver.pause("Restarted Circuit from time 0");
      };

      Circuit.prototype.restartAndRun = function() {
        if (!this.Solver) {
          return halt("Solver not initialized!");
        }
      };

      Circuit.prototype.reset = function() {
        var element, scope, _i, _j, _len, _len1, _ref, _ref1;
        _ref = this.elementList;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          element = _ref[_i];
          element.reset();
        }
        _ref1 = this.scopes;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          scope = _ref1[_j];
          scope.resetGraph();
        }
        return this.Solver.reset();
      };


      /* Simulation Frame Computation
       */


      /*
      UpdateCircuit:
      
       Updates the circuit each frame.
      
        1. ) Reconstruct Circuit:
              Rebuilds a data representation of the circuit (only applied when circuit changes)
        2. ) Solve Circuit build matrix representation of the circuit solve for the voltage and current for each component.
              Solving is performed via LU factorization.
       */

      Circuit.prototype.updateCircuit = function() {
        var endTime, frameTime, startTime;
        this.notifyObservers(this.ON_START_UPDATE);
        startTime = (new Date()).getTime();
        this.Solver.reconstruct();
        if (!this.Solver.isStopped) {
          this.Solver.solveCircuit();
          this.lastTime = this.updateTimings();
        } else {
          this.lastTime = 0;
        }
        this.notifyObservers(this.ON_COMPLETE_UPDATE);
        endTime = (new Date()).getTime();
        frameTime = endTime - startTime;
        return this.lastFrameTime = this.lastTime;
      };

      Circuit.prototype.getCircuitBottom = function() {
        var bottom, element, rect, _i, _len, _ref;
        if (this.circuitBottom) {
          return this.circuitBottom;
        }
        _ref = this.elementList;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          element = _ref[_i];
          rect = element.boundingBox;
          bottom = rect.height + rect.y;
          if (bottom > this.circuitBottom) {
            this.circuitBottom = bottom;
          }
        }
        return this.circuitBottom;
      };

      Circuit.prototype.recalculateCircuitBounds = function() {
        var bounds, element, maxX, maxY, minX, minY, _i, _len, _ref, _results;
        maxX = Number.MIN_VALUE;
        maxY = Number.MIN_VALUE;
        minX = Number.MAX_VALUE;
        minY = Number.MAX_VALUE;
        _ref = this.elementList;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          element = _ref[_i];
          bounds = element.boundingBox;
          if (bounds.x < minX) {
            minX = bounds.x;
          }
          if (bounds.y < minY) {
            minY = bounds.y;
          }
          if ((bounds.width + bounds.x) > maxX) {
            maxX = bounds.height + bounds.x;
          }
          if ((bounds.height + bounds.y) > maxY) {
            maxY = bounds.height + bounds.y;
          }
          _results.push(this.circuitBounds = new Rectangle(minX, minY, maxX - minX, maxY - minY));
        }
        return _results;
      };

      Circuit.prototype.updateTimings = function() {
        var currentSpeed, inc, sysTime;
        sysTime = (new Date()).getTime();
        inc = Math.floor(sysTime - this.lastTime);
        currentSpeed = Math.exp(this.Params.currentSpeed / 3.5 - 14.2);
        this.Params.currentMult = 1.7 * inc * currentSpeed;
        if ((sysTime - this.secTime) >= 1000) {
          this.framerate = this.frames;
          this.steprate = this.Solver.steps;
          this.frames = 0;
          this.steps = 0;
          this.secTime = sysTime;
        }
        this.frames++;
        return sysTime;
      };

      Circuit.prototype.warn = function(message) {
        Logger.warn(message);
        return this.warnMessage = message;
      };

      Circuit.prototype.halt = function(message) {
        Logger.error(message);
        return this.stopMessage = message;
      };

      Circuit.prototype.clearErrors = function() {
        this.stopMessage = null;
        return this.stopElm = null;
      };


      /* Simulation Accessor Methods
       */

      Circuit.prototype.isStopped = function() {
        return this.Solver.isStopped;
      };

      Circuit.prototype.voltageRange = function() {
        return this.Params['voltageRange'];
      };

      Circuit.prototype.powerRange = function() {
        return this.Params['powerRange'];
      };

      Circuit.prototype.currentSpeed = function() {
        return 62;
      };

      Circuit.prototype.getState = function() {
        return this.state;
      };

      return Circuit;

    })(Observer);
    return Circuit;
  });

}).call(this);

(function() {
  define([], function() {

    /*
      Stores Circuit-specific settings.
      Usually loaded from the params object of a .json file
     */
    var CircuitParams;
    CircuitParams = (function() {
      function CircuitParams(paramsObj) {
        this.completionStatus = (paramsObj != null ? paramsObj['completion_status'] : void 0) || "in development";
        this.createdAt = paramsObj != null ? paramsObj['created_at'] : void 0;
        this.currentSpeed = (paramsObj != null ? paramsObj['current_speed'] : void 0) || 63;
        this.updatedAt = paramsObj != null ? paramsObj['updated_at'] : void 0;
        this.description = paramsObj != null ? paramsObj['description'] : void 0;
        this.flags = paramsObj != null ? paramsObj['flags'] : void 0;
        this.id = paramsObj != null ? paramsObj['id'] : void 0;
        this.name = paramsObj != null ? paramsObj['name_unique'] : void 0;
        this.powerRange = paramsObj != null ? paramsObj['power_range'] : void 0;
        this.voltageRange = paramsObj != null ? paramsObj['voltage_range'] : void 0;
        this.simSpeed = paramsObj != null ? paramsObj['sim_speed'] : void 0;
        this.timeStep = paramsObj != null ? paramsObj['time_step'] : void 0;
        this.title = paramsObj != null ? paramsObj['title'] : void 0;
        this.topic = paramsObj != null ? paramsObj['topic'] : void 0;
      }

      return CircuitParams;

    })();
    return CircuitParams;
  });

}).call(this);

(function() {
  define(['cs!MatrixStamper', 'cs!GroundElm', 'cs!RailElm', 'cs!VoltageElm', 'cs!WireElm', 'cs!Pathfinder', 'cs!CircuitNode', 'cs!CircuitNodeLink', 'cs!RowInfo', 'cs!Settings', 'cs!ArrayUtils'], function(MatrixStamper, GroundElm, RailElm, VoltageElm, WireElm, Pathfinder, CircuitNode, CircuitNodeLink, RowInfo, Settings, ArrayUtils) {
    var CircuitSolver;
    CircuitSolver = (function() {
      function CircuitSolver(Circuit) {
        this.Circuit = Circuit;
        this.scaleFactors = ArrayUtils.zeroArray(400);
        this.reset();
        this.Stamper = new MatrixStamper(this.Circuit);
      }

      CircuitSolver.prototype.reset = function() {
        this.time = 0;
        this.converged = true;
        this.subIterations = 5000;
        this.circuitMatrix = [];
        this.circuitRightSide = [];
        this.origMatrix = [];
        this.origRightSide = [];
        this.circuitRowInfo = [];
        this.circuitPermute = [];
        this.circuitNonLinear = false;
        this.lastFrameTime = 0;
        this.lastIterTime = 0;
        this.frames = 0;
        this.lastTime = 0;
        return this.invalidate();
      };

      CircuitSolver.prototype.invalidate = function() {
        return this.analyzeFlag = true;
      };

      CircuitSolver.prototype.needsRemap = function() {
        return this.analyzeFlag;
      };

      CircuitSolver.prototype.pause = function(message) {
        if (message == null) {
          message = "Simulator stopped";
        }
        Logger.log(message);
        return this.isStopped = true;
      };

      CircuitSolver.prototype.run = function(message) {
        if (message == null) {
          message = "Simulator running";
        }
        Logger.log(message);
        return this.isStopped = false;
      };

      CircuitSolver.prototype.getSimSpeed = function() {
        if (Settings.SPEED === 0) {
          return 0;
        }
        return 0.1 * Math.exp((Settings.SPEED - 61) / 24);
      };

      CircuitSolver.prototype.reconstruct = function() {
        var ce, changed, circuitElement, circuitElm, circuitNode, circuitNodeLink, circuitRowInfo, closure, elt, gotGround, gotRail, i, ii, internalNodeCount, internalVSCount, iter, j, k, kn, matrix_ij, newMatDim, newMatx, newRS, newSize, node, pathfinder, postCount, postPt, qm, qp, qq, qv, re, rowInfo, rowNodeEq, rsadd, terminalPt, volt, voltageSourceCount, _aa, _i, _j, _k, _l, _len, _len1, _len2, _len3, _m, _n, _o, _p, _q, _r, _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _results, _s, _t, _u, _v, _w, _x, _y, _z;
        if (!this.analyzeFlag || this.Circuit.numElements() === 0) {
          return;
        }
        this.Circuit.getCircuitBottom();
        this.Circuit.clearErrors();
        this.Circuit.resetNodes();
        voltageSourceCount = 0;
        gotGround = false;
        gotRail = false;
        volt = null;
        _ref = this.Circuit.getElements();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          circuitElm = _ref[_i];
          if (circuitElm.toString() === 'GroundElm') {
            this.gotGround = true;
            break;
          }
          if (circuitElm.toString === 'RailElm') {
            gotRail = true;
          }
          if ((volt == null) && circuitElm.toString() === 'VoltageElm') {
            volt = circuitElm;
          }
        }
        circuitNode = new CircuitNode();
        if (!gotGround && (volt != null) && !gotRail) {
          terminalPt = volt.getPost(0);
          circuitNode.x = terminalPt.x;
          circuitNode.y = terminalPt.y;
        } else {
          circuitNode.x = circuitNode.y = -1;
        }
        this.Circuit.addCircuitNode(circuitNode);
        for (i = _j = 0, _ref1 = this.Circuit.numElements(); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
          circuitElm = this.Circuit.getElmByIdx(i);
          internalNodeCount = circuitElm.getInternalNodeCount();
          internalVSCount = circuitElm.getVoltageSourceCount();
          postCount = circuitElm.getPostCount();
          for (j = _k = 0; 0 <= postCount ? _k < postCount : _k > postCount; j = 0 <= postCount ? ++_k : --_k) {
            postPt = circuitElm.getPost(j);
            k = 0;
            _ref2 = this.Circuit.getNodes();
            for (_l = 0, _len1 = _ref2.length; _l < _len1; _l++) {
              node = _ref2[_l];
              if (postPt.x === node.x && postPt.y === node.y) {
                break;
              }
              k++;
            }
            if (k === this.Circuit.numNodes()) {
              circuitNode = new CircuitNode();
              circuitNode.x = postPt.x;
              circuitNode.y = postPt.y;
              circuitNodeLink = new CircuitNodeLink();
              circuitNodeLink.num = j;
              circuitNodeLink.elm = circuitElm;
              circuitNode.links.push(circuitNodeLink);
              circuitElm.setNode(j, this.Circuit.numNodes());
              this.Circuit.addCircuitNode(circuitNode);
            } else {
              circuitNodeLink = new CircuitNodeLink();
              circuitNodeLink.num = j;
              circuitNodeLink.elm = circuitElm;
              this.Circuit.getNode(k).links.push(circuitNodeLink);
              circuitElm.setNode(j, k);
              if (k === 0) {
                circuitElm.setNodeVoltage(j, 0);
              }
            }
          }
          for (j = _m = 0; 0 <= internalNodeCount ? _m < internalNodeCount : _m > internalNodeCount; j = 0 <= internalNodeCount ? ++_m : --_m) {
            circuitNode = new CircuitNode(-1, -1, true);
            circuitNodeLink = new CircuitNodeLink();
            circuitNodeLink.num = j + postCount;
            circuitNodeLink.elm = circuitElm;
            circuitNode.links.push(circuitNodeLink);
            circuitElm.setNode(circuitNodeLink.num, this.Circuit.numNodes());
            this.Circuit.addCircuitNode(circuitNode);
          }
          voltageSourceCount += internalVSCount;
        }
        this.Circuit.voltageSources = new Array(voltageSourceCount);
        voltageSourceCount = 0;
        this.circuitNonLinear = false;
        _ref3 = this.Circuit.getElements();
        for (_n = 0, _len2 = _ref3.length; _n < _len2; _n++) {
          circuitElement = _ref3[_n];
          if (circuitElement.nonLinear()) {
            this.circuitNonLinear = true;
          }
          internalVSCount = circuitElement.getVoltageSourceCount();
          for (j = _o = 0; 0 <= internalVSCount ? _o < internalVSCount : _o > internalVSCount; j = 0 <= internalVSCount ? ++_o : --_o) {
            this.Circuit.voltageSources[voltageSourceCount] = circuitElement;
            circuitElement.setVoltageSource(j, voltageSourceCount++);
          }
        }
        this.Circuit.voltageSourceCount = voltageSourceCount;
        this.matrixSize = this.Circuit.numNodes() - 1 + voltageSourceCount;
        this.circuitMatrixSize = this.circuitMatrixFullSize = this.matrixSize;
        this.circuitMatrix = ArrayUtils.zeroArray2(this.matrixSize, this.matrixSize);
        this.origMatrix = ArrayUtils.zeroArray2(this.matrixSize, this.matrixSize);
        this.circuitRightSide = ArrayUtils.zeroArray(this.matrixSize);
        this.origRightSide = ArrayUtils.zeroArray(this.matrixSize);
        this.circuitRowInfo = ArrayUtils.zeroArray(this.matrixSize);
        this.circuitPermute = ArrayUtils.zeroArray(this.matrixSize);
        for (i = _p = 0, _ref4 = this.matrixSize; 0 <= _ref4 ? _p < _ref4 : _p > _ref4; i = 0 <= _ref4 ? ++_p : --_p) {
          this.circuitRowInfo[i] = new RowInfo();
        }
        this.circuitNeedsMap = false;
        _ref5 = this.Circuit.getElements();
        for (_q = 0, _len3 = _ref5.length; _q < _len3; _q++) {
          circuitElm = _ref5[_q];
          circuitElm.stamp(this.Stamper);
        }
        closure = new Array(this.Circuit.numNodes());
        closure[0] = true;
        while (changed) {
          changed = false;
          i = 0;
          while (i !== this.Circuit.numElements()) {
            circuitElm = this.Circuit.getElm(i);
            j = 0;
            while (j < circuitElm.getPostCount()) {
              if (!closure[circuitElm.getNode(j)]) {
                if (circuitElm.hasGroundConnection(j)) {
                  changed = true;
                  closure[circuitElm.getNode(j)] = true;
                }
                continue;
              }
              k = 0;
              while (k !== circuitElm.getPostCount()) {
                if (j === k) {
                  continue;
                }
                kn = circuitElm.getNode(k);
                if (circuitElm.getConnection(j, k) && !closure[kn]) {
                  closure[kn] = true;
                  changed = true;
                }
                ++k;
              }
              ++j;
            }
            ++i;
          }
          if (changed) {
            continue;
          }
          for (i = _r = 0, _ref6 = this.Circuit.numNodes(); 0 <= _ref6 ? _r < _ref6 : _r > _ref6; i = 0 <= _ref6 ? ++_r : --_r) {
            if (!closure[i] && !this.Circuit.getCircuitNode(i).intern) {
              this.Stamper.stampResistor(0, i, 1e8);
              closure[i] = true;
              changed = true;
              break;
            }
          }
        }
        for (i = _s = 0, _ref7 = this.Circuit.numElements(); 0 <= _ref7 ? _s < _ref7 : _s > _ref7; i = 0 <= _ref7 ? ++_s : --_s) {
          ce = this.Circuit.getElmByIdx(i);
          if ((ce instanceof VoltageElm && ce.getPostCount() === 2) || ce instanceof WireElm) {
            pathfinder = new Pathfinder(Pathfinder.VOLTAGE, ce, ce.getNode(1), this.Circuit.getElements(), this.Circuit.numNodes());
          }
        }
        iter = 0;
        while (iter < this.matrixSize) {
          qm = -1;
          qp = -1;
          qv = 0;
          re = this.circuitRowInfo[iter];
          if (re.lsChanges || re.dropRow || re.rsChanges) {
            iter++;
            continue;
          }
          rsadd = 0;
          for (j = _t = 0, _ref8 = this.matrixSize; 0 <= _ref8 ? _t < _ref8 : _t > _ref8; j = 0 <= _ref8 ? ++_t : --_t) {
            matrix_ij = this.circuitMatrix[iter][j];
            if (this.circuitRowInfo[j].type === RowInfo.ROW_CONST) {
              rsadd -= this.circuitRowInfo[j].value * matrix_ij;
              continue;
            }
            if (matrix_ij === 0) {
              continue;
            }
            if (qp === -1) {
              qp = j;
              qv = matrix_ij;
              continue;
            }
            if (qm === -1 && (matrix_ij === -qv)) {
              qm = j;
              continue;
            }
            break;
          }
          if (j === this.matrixSize) {
            if (qp === -1) {
              this.circuitRowInfo[j].type;
              this.Circuit.halt("Matrix error qp", null);
              return;
            }
            elt = this.circuitRowInfo[qp];
            if (qm === -1) {
              k = 0;
              while (elt.type === RowInfo.ROW_EQUAL && k < 100) {
                qp = elt.nodeEq;
                elt = this.circuitRowInfo[qp];
                ++k;
              }
              if (elt.type === RowInfo.ROW_EQUAL) {
                elt.type = RowInfo.ROW_NORMAL;
                iter++;
                continue;
              }
              if (elt.type !== RowInfo.ROW_NORMAL) {
                iter++;
                continue;
              }
              elt.type = RowInfo.ROW_CONST;
              elt.value = (this.circuitRightSide[iter] + rsadd) / qv;
              this.circuitRowInfo[iter].dropRow = true;
              iter = -1;
            } else if ((this.circuitRightSide[iter] + rsadd) === 0) {
              if (elt.type !== RowInfo.ROW_NORMAL) {
                qq = qm;
                qm = qp;
                qp = qq;
                elt = this.circuitRowInfo[qp];
                if (elt.type !== RowInfo.ROW_NORMAL) {
                  iter++;
                  continue;
                }
              }
              elt.type = RowInfo.ROW_EQUAL;
              elt.nodeEq = qm;
              this.circuitRowInfo[iter].dropRow = true;
            }
          }
          iter++;
        }
        newMatDim = 0;
        for (i = _u = 0, _ref9 = this.matrixSize; 0 <= _ref9 ? _u < _ref9 : _u > _ref9; i = 0 <= _ref9 ? ++_u : --_u) {
          rowInfo = this.circuitRowInfo[i];
          if (rowInfo.type === RowInfo.ROW_NORMAL) {
            rowInfo.mapCol = newMatDim++;
            continue;
          }
          if (rowInfo.type === RowInfo.ROW_EQUAL) {
            while (j !== (function() {
                _results = [];
                for (_v = 0; _v < 100; _v++){ _results.push(_v); }
                return _results;
              }).apply(this)) {
              rowNodeEq = this.circuitRowInfo[rowInfo.nodeEq];
              if (rowNodeEq.type !== RowInfo.ROW_EQUAL) {
                break;
              }
              if (i === rowNodeEq.nodeEq) {
                break;
              }
              rowInfo.nodeEq = rowNodeEq.nodeEq;
            }
          }
          if (rowInfo.type === RowInfo.ROW_CONST) {
            rowInfo.mapCol = -1;
          }
        }
        for (i = _w = 0, _ref10 = this.matrixSize; 0 <= _ref10 ? _w < _ref10 : _w > _ref10; i = 0 <= _ref10 ? ++_w : --_w) {
          rowInfo = this.circuitRowInfo[i];
          if (rowInfo.type === RowInfo.ROW_EQUAL) {
            rowNodeEq = this.circuitRowInfo[rowInfo.nodeEq];
            if (rowNodeEq.type === RowInfo.ROW_CONST) {
              rowInfo.type = rowNodeEq.type;
              rowInfo.value = rowNodeEq.value;
              rowInfo.mapCol = -1;
            } else {
              rowInfo.mapCol = rowNodeEq.mapCol;
            }
          }
        }
        newSize = newMatDim;
        newMatx = ArrayUtils.zeroArray2(newSize, newSize);
        newRS = new Array(newSize);
        ArrayUtils.zeroArray(newRS);
        ii = 0;
        i = 0;
        while (i !== this.matrixSize) {
          circuitRowInfo = this.circuitRowInfo[i];
          if (circuitRowInfo.dropRow) {
            circuitRowInfo.mapRow = -1;
            i++;
            continue;
          }
          newRS[ii] = this.circuitRightSide[i];
          circuitRowInfo.mapRow = ii;
          for (j = _x = 0, _ref11 = this.matrixSize; 0 <= _ref11 ? _x < _ref11 : _x > _ref11; j = 0 <= _ref11 ? ++_x : --_x) {
            rowInfo = this.circuitRowInfo[j];
            if (rowInfo.type === RowInfo.ROW_CONST) {
              newRS[ii] -= rowInfo.value * this.circuitMatrix[i][j];
            } else {
              newMatx[ii][rowInfo.mapCol] += this.circuitMatrix[i][j];
            }
          }
          ii++;
          i++;
        }
        this.circuitMatrix = newMatx;
        this.circuitRightSide = newRS;
        this.matrixSize = this.circuitMatrixSize = newSize;
        for (i = _y = 0, _ref12 = this.matrixSize; 0 <= _ref12 ? _y < _ref12 : _y > _ref12; i = 0 <= _ref12 ? ++_y : --_y) {
          this.origRightSide[i] = this.circuitRightSide[i];
        }
        for (i = _z = 0, _ref13 = this.matrixSize; 0 <= _ref13 ? _z < _ref13 : _z > _ref13; i = 0 <= _ref13 ? ++_z : --_z) {
          for (j = _aa = 0, _ref14 = this.matrixSize; 0 <= _ref14 ? _aa < _ref14 : _aa > _ref14; j = 0 <= _ref14 ? ++_aa : --_aa) {
            this.origMatrix[i][j] = this.circuitMatrix[i][j];
          }
        }
        this.circuitNeedsMap = true;
        this.analyzeFlag = false;
        if (!this.circuitNonLinear) {
          if (!this.luFactor(this.circuitMatrix, this.circuitMatrixSize, this.circuitPermute)) {
            this.Circuit.halt("Singular matrix!", null);
          }
        }
      };

      CircuitSolver.prototype.solveCircuit = function() {
        var circuitElm, circuitNode, cn1, debugPrint, i, iter, j, ji, lastIterTime, res, rowInfo, scope, stepRate, subiter, subiterCount, timeEnd, _i, _j, _k, _l, _len, _len1, _len2, _len3, _m, _n, _o, _p, _q, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
        if ((this.circuitMatrix == null) || this.Circuit.numElements() === 0) {
          this.circuitMatrix = null;
          return;
        }
        debugPrint = this.dumpMatrix;
        this.dumpMatrix = false;
        stepRate = Math.floor(160 * this.getSimSpeed());
        timeEnd = (new Date()).getTime();
        lastIterTime = this.lastIterTime;
        if (1000 >= stepRate * (timeEnd - this.lastIterTime)) {
          return;
        }
        iter = 1;
        while (true) {
          _ref = this.Circuit.getElements();
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            circuitElm = _ref[_i];
            circuitElm.startIteration();
          }
          ++this.steps;
          subiterCount = 500;
          for (subiter = _j = 0; 0 <= subiterCount ? _j < subiterCount : _j > subiterCount; subiter = 0 <= subiterCount ? ++_j : --_j) {
            this.converged = true;
            this.subIterations = subiter;
            for (i = _k = 0, _ref1 = this.circuitMatrixSize; 0 <= _ref1 ? _k < _ref1 : _k > _ref1; i = 0 <= _ref1 ? ++_k : --_k) {
              this.circuitRightSide[i] = this.origRightSide[i];
            }
            if (this.circuitNonLinear) {
              for (i = _l = 0, _ref2 = this.circuitMatrixSize; 0 <= _ref2 ? _l < _ref2 : _l > _ref2; i = 0 <= _ref2 ? ++_l : --_l) {
                for (j = _m = 0, _ref3 = this.circuitMatrixSize; 0 <= _ref3 ? _m < _ref3 : _m > _ref3; j = 0 <= _ref3 ? ++_m : --_m) {
                  this.circuitMatrix[i][j] = this.origMatrix[i][j];
                }
              }
            }
            _ref4 = this.Circuit.getElements();
            for (_n = 0, _len1 = _ref4.length; _n < _len1; _n++) {
              circuitElm = _ref4[_n];
              circuitElm.doStep();
            }
            if (this.stopMessage != null) {
              return;
            }
            debugPrint = false;
            if (this.circuitNonLinear) {
              if (this.converged && subiter > 0) {
                break;
              }
              if (!this.luFactor(this.circuitMatrix, this.circuitMatrixSize, this.circuitPermute)) {
                this.Circuit.halt("Singular matrix!", null);
                return;
              }
            }
            this.luSolve(this.circuitMatrix, this.circuitMatrixSize, this.circuitPermute, this.circuitRightSide);
            for (j = _o = 0, _ref5 = this.circuitMatrixFullSize; 0 <= _ref5 ? _o < _ref5 : _o > _ref5; j = 0 <= _ref5 ? ++_o : --_o) {
              rowInfo = this.circuitRowInfo[j];
              res = 0;
              if (rowInfo.type === RowInfo.ROW_CONST) {
                res = rowInfo.value;
              } else {
                res = this.circuitRightSide[rowInfo.mapCol];
              }
              if (isNaN(res)) {
                this.converged = false;
                break;
              }
              if (j < (this.Circuit.numNodes() - 1)) {
                circuitNode = this.Circuit.getNode(j + 1);
                _ref6 = circuitNode.links;
                for (_p = 0, _len2 = _ref6.length; _p < _len2; _p++) {
                  cn1 = _ref6[_p];
                  cn1.elm.setNodeVoltage(cn1.num, res);
                }
              } else {
                ji = j - (this.Circuit.numNodes() - 1);
                this.Circuit.voltageSources[ji].setCurrent(ji, res);
              }
            }
            if (!this.circuitNonLinear) {
              break;
            }
            subiter++;
          }
          if (subiter >= subiterCount) {
            this.halt("Convergence failed: " + subiter, null);
            break;
          }
          this.time += this.timeStep;
          _ref7 = this.Circuit.scopes;
          for (_q = 0, _len3 = _ref7.length; _q < _len3; _q++) {
            scope = _ref7[_q];
            scope.timeStep();
          }
          timeEnd = (new Date()).getTime();
          lastIterTime = timeEnd;
          if (iter * 1000 >= stepRate * (timeEnd - this.lastIterTime)) {
            break;
          } else {
            if (timeEnd - this.lastFrameTime > 500) {
              break;
            }
          }
          ++iter;
        }
        return this.lastIterTime = lastIterTime;
      };


      /*
      luFactor: finds a solution to a factored matrix through LU (Lower-Upper) factorization
      
      Called once each frame for resistive circuits, otherwise called many times each frame
      
      @param circuitMatrix 2D matrix to be solved
      @param matrixSize number or rows/columns in the matrix
      @param pivotArray pivot index
      
      References:
       */

      CircuitSolver.prototype.luFactor = function(circuitMatrix, matrixSize, pivotArray) {
        var i, j, k, largest, largestRow, matrix_ij, mult, x;
        i = 0;
        while (i < matrixSize) {
          largest = 0;
          j = 0;
          while (j < matrixSize) {
            x = Math.abs(circuitMatrix[i][j]);
            if (x > largest) {
              largest = x;
            }
            ++j;
          }
          if (largest === 0) {
            return false;
          }
          this.scaleFactors[i] = 1.0 / largest;
          ++i;
        }
        j = 0;
        while (j < matrixSize) {
          i = 0;
          while (i < j) {
            matrix_ij = circuitMatrix[i][j];
            k = 0;
            while (k !== i) {
              matrix_ij -= circuitMatrix[i][k] * circuitMatrix[k][j];
              ++k;
            }
            circuitMatrix[i][j] = matrix_ij;
            ++i;
          }
          largest = 0;
          largestRow = -1;
          i = j;
          while (i < matrixSize) {
            matrix_ij = circuitMatrix[i][j];
            k = 0;
            while (k < j) {
              matrix_ij -= circuitMatrix[i][k] * circuitMatrix[k][j];
              ++k;
            }
            circuitMatrix[i][j] = matrix_ij;
            x = Math.abs(matrix_ij);
            if (x >= largest) {
              largest = x;
              largestRow = i;
            }
            ++i;
          }
          if (j !== largestRow) {
            k = 0;
            while (k < matrixSize) {
              x = circuitMatrix[largestRow][k];
              circuitMatrix[largestRow][k] = circuitMatrix[j][k];
              circuitMatrix[j][k] = x;
              ++k;
            }
            this.scaleFactors[largestRow] = this.scaleFactors[j];
          }
          pivotArray[j] = largestRow;
          if (circuitMatrix[j][j] === 0) {
            circuitMatrix[j][j] = 1e-18;
          }
          if (j !== matrixSize - 1) {
            mult = 1 / circuitMatrix[j][j];
            i = j + 1;
            while (i !== matrixSize) {
              circuitMatrix[i][j] *= mult;
              ++i;
            }
          }
          ++j;
        }
        return true;
      };


      /*
      Step 2: lu_solve: Called by lu_factor
      
      finds a solution to a factored matrix through LU (Lower-Upper) factorization
      
      Called once each frame for resistive circuits, otherwise called many times each frame
      
      @param circuitMatrix matrix to be solved
      @param numRows dimension
      @param pivotVector pivot index
      @param circuitRightSide Right-side (dependent) matrix
      
      References:
       */

      CircuitSolver.prototype.luSolve = function(circuitMatrix, numRows, pivotVector, circuitRightSide) {
        var bi, i, j, row, swap, tot, total, _results;
        i = 0;
        while (i < numRows) {
          row = pivotVector[i];
          swap = circuitRightSide[row];
          circuitRightSide[row] = circuitRightSide[i];
          circuitRightSide[i] = swap;
          if (swap !== 0) {
            break;
          }
          ++i;
        }
        bi = i++;
        while (i < numRows) {
          row = pivotVector[i];
          tot = circuitRightSide[row];
          circuitRightSide[row] = circuitRightSide[i];
          j = bi;
          while (j < i) {
            tot -= circuitMatrix[i][j] * circuitRightSide[j];
            ++j;
          }
          circuitRightSide[i] = tot;
          ++i;
        }
        i = numRows - 1;
        _results = [];
        while (i >= 0) {
          total = circuitRightSide[i];
          j = i + 1;
          while (j !== numRows) {
            total -= circuitMatrix[i][j] * circuitRightSide[j];
            ++j;
          }
          circuitRightSide[i] = total / circuitMatrix[i][i];
          _results.push(i--);
        }
        return _results;
      };

      CircuitSolver.prototype.updateVoltageSource = function(n1, n2, vs, voltage) {
        var vn;
        vn = this.Circuit.numNodes() + vs;
        return this.Stamper.stampRightSide(vn, voltage);
      };

      return CircuitSolver;

    })();
    return CircuitSolver;
  });

}).call(this);

(function() {
  define([], function() {
    var CircuitNode;
    CircuitNode = (function() {
      function CircuitNode(x, y, intern, links) {
        this.x = x != null ? x : 0;
        this.y = y != null ? y : 0;
        this.intern = intern != null ? intern : false;
        this.links = links != null ? links : [];
      }

      CircuitNode.prototype.toString = function() {
        return "CircuitNode: " + this.x + " " + this.y + " " + this.intern + " [" + (this.links.toString()) + "]";
      };

      return CircuitNode;

    })();
    return CircuitNode;
  });

}).call(this);

(function() {
  define([], function() {
    var CircuitNodeLink;
    CircuitNodeLink = (function() {
      function CircuitNodeLink(num, elm) {
        this.num = num != null ? num : 0;
        this.elm = elm != null ? elm : null;
      }

      CircuitNodeLink.prototype.toString = function() {
        return "" + this.num + " " + (this.elm.toString());
      };

      return CircuitNodeLink;

    })();
    return CircuitNodeLink;
  });

}).call(this);

(function() {
  define(['cs!VoltageElm'], function(VoltageElm) {
    var FindPathInfo;
    FindPathInfo = (function() {
      FindPathInfo.INDUCT = 1;

      FindPathInfo.VOLTAGE = 2;

      FindPathInfo.SHORT = 3;

      FindPathInfo.CAP_V = 4;

      function FindPathInfo(type, firstElm, dest, elementList, numNodes) {
        this.type = type;
        this.firstElm = firstElm;
        this.dest = dest;
        this.elementList = elementList;
        this.used = new Array(numNodes);
      }

      FindPathInfo.prototype.findPath = function(node, depth) {
        var current, element, j, next_terminal_num, terminal_num, _i, _j, _k, _l, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3;
        if (node === this.dest) {
          return true;
        }
        if ((depth-- === 0) || this.used[node]) {
          return false;
        }
        this.used[node] = true;
        _ref = this.elementList;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          element = _ref[_i];
          if (element === this.firstElm) {
            continue;
          }
          if (this.type === FindPathInfo.VOLTAGE && (element.isWire() || element instanceof VoltageElm)) {
            continue;
          }
          if (this.type === FindPathInfo.SHORT && !element.isWire()) {
            continue;
          }
          if (this.type === FindPathInfo.CAP_V) {
            if (!(element.isWire() || element instanceof CapacitorElm || element instanceof VoltageElm)) {
              continue;
            }
          }
          if (node === 0) {
            _ref1 = Array(element.getPostCount());
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              j = _ref1[_j];
              if (element.hasGroundConnection(j) && this.findPath(element.getNode(j), depth)) {
                this.used[node] = false;
                return true;
              }
            }
          }
          terminal_num = 0;
          _ref2 = Array(element.getPostCount());
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            terminal_num = _ref2[_k];
            if (element.getNode(terminal_num) === node) {
              break;
            }
          }
          if (terminal_num === element.getPostCount()) {
            continue;
          }
          if (element.hasGroundConnection(terminal_num) && this.findPath(0, depth)) {
            this.used[node] = false;
            return true;
          }
          if (this.type === FindPathInfo.INDUCT && element instanceof InductorElm) {
            current = element.getCurrent();
            if (terminal_num === 0) {
              current = -current;
            }
            if (Math.abs(current - this.firstElm.getCurrent()) > 1e-10) {
              continue;
            }
          }
          for (next_terminal_num = _l = 0, _ref3 = element.getPostCount(); 0 <= _ref3 ? _l < _ref3 : _l > _ref3; next_terminal_num = 0 <= _ref3 ? ++_l : --_l) {
            if (terminal_num === next_terminal_num) {
              continue;
            }
            if (element.getConnection(terminal_num, next_terminal_num) && this.findPath(element.getNode(next_terminal_num), depth)) {
              this.used[node] = false;
              return true;
            }
          }
        }
        this.used[node] = false;
        return false;
      };

      return FindPathInfo;

    })();
    return FindPathInfo;
  });

}).call(this);

(function() {
  define(['cs!VoltageElm'], function(VoltageElm) {
    var Pathfinder;
    Pathfinder = (function() {
      Pathfinder.INDUCT = 1;

      Pathfinder.VOLTAGE = 2;

      Pathfinder.SHORT = 3;

      Pathfinder.CAP_V = 4;

      function Pathfinder(type, firstElm, dest, elementList, numNodes) {
        this.type = type;
        this.firstElm = firstElm;
        this.dest = dest;
        this.elementList = elementList;
        this.used = new Array(numNodes);
      }

      Pathfinder.prototype.findPath = function(node, depth) {
        var current, element, j, next_terminal_num, terminal_num, _i, _j, _k, _l, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3;
        if (node === this.dest) {
          return true;
        }
        if ((depth-- === 0) || this.used[node]) {
          return false;
        }
        this.used[node] = true;
        _ref = this.elementList;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          element = _ref[_i];
          if (element === this.firstElm) {
            continue;
          }
          if (this.type === Pathfinder.VOLTAGE && (element.isWire() || element instanceof VoltageElm)) {
            continue;
          }
          if (this.type === Pathfinder.SHORT && !element.isWire()) {
            continue;
          }
          if (this.type === Pathfinder.CAP_V) {
            if (!(element.isWire() || element instanceof CapacitorElm || element instanceof VoltageElm)) {
              continue;
            }
          }
          if (node === 0) {
            _ref1 = Array(element.getPostCount());
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              j = _ref1[_j];
              if (element.hasGroundConnection(j) && this.findPath(element.getNode(j), depth)) {
                this.used[node] = false;
                return true;
              }
            }
          }
          terminal_num = 0;
          _ref2 = Array(element.getPostCount());
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            terminal_num = _ref2[_k];
            if (element.getNode(terminal_num) === node) {
              break;
            }
          }
          if (terminal_num === element.getPostCount()) {
            continue;
          }
          if (element.hasGroundConnection(terminal_num) && this.findPath(0, depth)) {
            this.used[node] = false;
            return true;
          }
          if (this.type === Pathfinder.INDUCT && element instanceof InductorElm) {
            current = element.getCurrent();
            if (terminal_num === 0) {
              current = -current;
            }
            if (Math.abs(current - this.firstElm.getCurrent()) > 1e-10) {
              continue;
            }
          }
          for (next_terminal_num = _l = 0, _ref3 = element.getPostCount(); 0 <= _ref3 ? _l < _ref3 : _l > _ref3; next_terminal_num = 0 <= _ref3 ? ++_l : --_l) {
            if (terminal_num === next_terminal_num) {
              continue;
            }
            if (element.getConnection(terminal_num, next_terminal_num) && this.findPath(element.getNode(next_terminal_num), depth)) {
              this.used[node] = false;
              return true;
            }
          }
        }
        this.used[node] = false;
        return false;
      };

      return Pathfinder;

    })();
    return Pathfinder;
  });

}).call(this);

(function() {
  define([], function() {
    var Hint;
    Hint = (function() {
      Hint.HINT_LC = "@HINT_LC";

      Hint.HINT_RC = "@HINT_RC";

      Hint.HINT_3DB_C = "@HINT_3DB_C";

      Hint.HINT_TWINT = "@HINT_TWINT";

      Hint.HINT_3DB_L = "@HINT_3DB_L";

      Hint.hintType = -1;

      Hint.hintItem1 = -1;

      Hint.hintItem2 = -1;

      function Hint(Circuit) {
        this.Circuit = Circuit;
      }

      Hint.prototype.readHint = function(st) {
        if (typeof st === 'string') {
          st = st.split(' ');
        }
        this.hintType = st[0];
        this.hintItem1 = st[1];
        return this.hintItem2 = st[2];
      };

      Hint.prototype.getHint = function() {
        var c1, c2, ce, ie, re;
        c1 = this.Circuit.getElmByIdx(this.hintItem1);
        c2 = this.Circuit.getElmByIdx(this.hintItem2);
        if ((c1 == null) || (c2 == null)) {
          return null;
        }
        if (this.hintType === this.HINT_LC) {
          if (!(c1 instanceof InductorElm)) {
            return null;
          }
          if (!(c2 instanceof CapacitorElm)) {
            return null;
          }
          ie = c1;
          ce = c2;
          return "res.f = " + getUnitText(1 / (2 * Math.PI * Math.sqrt(ie.inductance * ce.capacitance)), "Hz");
        }
        if (this.hintType === this.HINT_RC) {
          if (!(c1 instanceof ResistorElm)) {
            return null;
          }
          if (!(c2 instanceof CapacitorElm)) {
            return null;
          }
          re = c1;
          ce = c2;
          return "RC = " + getUnitText(re.resistance * ce.capacitance, "s");
        }
        if (this.hintType === this.HINT_3DB_C) {
          if (!(c1 instanceof ResistorElm)) {
            return null;
          }
          if (!(c2 instanceof CapacitorElm)) {
            return null;
          }
          re = c1;
          ce = c2;
          return "f.3db = " + getUnitText(1 / (2 * Math.PI * re.resistance * ce.capacitance), "Hz");
        }
        if (this.hintType === this.HINT_3DB_L) {
          if (!(c1 instanceof ResistorElm)) {
            return null;
          }
          if (!(c2 instanceof InductorElm)) {
            return null;
          }
          re = c1;
          ie = c2;
          return "f.3db = " + getUnitText(re.resistance / (2 * Math.PI * ie.inductance), "Hz");
        }
        if (this.hintType === this.HINT_TWINT) {
          if (!(c1 instanceof ResistorElm)) {
            return null;
          }
          if (!(c2 instanceof CapacitorElm)) {
            return null;
          }
          re = c1;
          ce = c2;
          return "fc = " + getUnitText(1 / (2 * Math.PI * re.resistance * ce.capacitance), "Hz");
        }
        return null;
      };

      return Hint;

    })();
    return Hint;
  });

}).call(this);

(function() {
  define(['cs!MathUtils'], function(MathUtils) {
    var MatrixStamper;
    MatrixStamper = (function() {
      function MatrixStamper(Circuit) {
        this.Circuit = Circuit;
      }


      /*
      control voltage source vs with voltage from n1 to n2 (must also call stampVoltageSource())
       */

      MatrixStamper.prototype.stampVCVS = function(n1, n2, coef, vs) {
        var vn;
        vn = this.Circuit.numNodes() + vs;
        this.stampMatrix(vn, n1, coef);
        return this.stampMatrix(vn, n2, -coef);
      };


      /*
      stamp independent voltage source #vs, from n1 to n2, amount v
       */

      MatrixStamper.prototype.stampVoltageSource = function(n1, n2, vs, v) {
        var vn;
        vn = this.Circuit.numNodes() + vs;
        this.stampMatrix(vn, n1, -1);
        this.stampMatrix(vn, n2, 1);
        this.stampRightSide(vn, v);
        this.stampMatrix(n1, vn, 1);
        return this.stampMatrix(n2, vn, -1);
      };

      MatrixStamper.prototype.updateVoltageSource = function(n1, n2, vs, v) {
        var vn;
        vn = this.Circuit.numNodes() + vs;
        return this.stampRightSide(vn, v);
      };

      MatrixStamper.prototype.stampResistor = function(n1, n2, r) {
        var a, r0;
        r0 = 1 / r;
        if (isNaN(r0) || MathUtils.isInfinite(r0)) {
          this.Circuit.halt("bad resistance");
          a = 0;
          a /= a;
        }
        this.stampMatrix(n1, n1, r0);
        this.stampMatrix(n2, n2, r0);
        this.stampMatrix(n1, n2, -r0);
        return this.stampMatrix(n2, n1, -r0);
      };

      MatrixStamper.prototype.stampConductance = function(n1, n2, r0) {
        this.stampMatrix(n1, n1, r0);
        this.stampMatrix(n2, n2, r0);
        this.stampMatrix(n1, n2, -r0);
        return this.stampMatrix(n2, n1, -r0);
      };


      /*
      current from cn1 to cn2 is equal to voltage from vn1 to 2, divided by g
       */

      MatrixStamper.prototype.stampVCCurrentSource = function(cn1, cn2, vn1, vn2, g) {
        this.stampMatrix(cn1, vn1, g);
        this.stampMatrix(cn2, vn2, g);
        this.stampMatrix(cn1, vn2, -g);
        return this.stampMatrix(cn2, vn1, -g);
      };

      MatrixStamper.prototype.stampCurrentSource = function(n1, n2, value) {
        this.stampRightSide(n1, -value);
        return this.stampRightSide(n2, value);
      };


      /*
      stamp a current source from n1 to n2 depending on current through vs
       */

      MatrixStamper.prototype.stampCCCS = function(n1, n2, vs, gain) {
        var vn;
        vn = this.Circuit.numNodes() + vs;
        this.stampMatrix(n1, vn, gain);
        return this.stampMatrix(n2, vn, -gain);
      };


      /*
      stamp value x in row i, column j, meaning that a voltage change
      of dv in node j will increase the current into node i by x dv.
      (Unless i or j is a voltage source node.)
       */

      MatrixStamper.prototype.stampMatrix = function(row, col, value) {
        var rowInfo;
        if (row > 0 && col > 0) {
          if (this.Circuit.Solver.circuitNeedsMap) {
            row = this.Circuit.Solver.circuitRowInfo[row - 1].mapRow;
            rowInfo = this.Circuit.Solver.circuitRowInfo[col - 1];
            if (rowInfo.type === RowInfo.ROW_CONST) {
              this.Circuit.Solver.circuitRightSide[row] -= value * rowInfo.value;
              return;
            }
            col = rowInfo.mapCol;
          } else {
            row--;
            col--;
          }
          return this.Circuit.Solver.circuitMatrix[row][col] += value;
        }
      };


      /*
      Stamp value x on the right side of row i, representing an
      independent current source flowing into node i
       */

      MatrixStamper.prototype.stampRightSide = function(row, value) {
        if (isNaN(value)) {
          if (row > 0) {
            return this.Circuit.Solver.circuitRowInfo[row - 1].rsChanges = true;
          }
        } else {
          if (row > 0) {
            if (this.Circuit.Solver.circuitNeedsMap) {
              row = this.Circuit.Solver.circuitRowInfo[row - 1].mapRow;
            } else {
              row--;
            }
            return this.Circuit.Solver.circuitRightSide[row] += value;
          }
        }
      };


      /*
      Indicate that the values on the left side of row i change in doStep()
       */

      MatrixStamper.prototype.stampNonLinear = function(row) {
        if (row > 0) {
          return this.Circuit.Solver.circuitRowInfo[row - 1].lsChanges = true;
        }
      };

      return MatrixStamper;

    })();
    return MatrixStamper;
  });

}).call(this);

(function() {
  define([], function() {
    var RowInfo;
    RowInfo = (function() {
      RowInfo.ROW_NORMAL = 0;

      RowInfo.ROW_CONST = 1;

      RowInfo.ROW_EQUAL = 2;

      function RowInfo() {
        this.type = RowInfo.ROW_NORMAL;
        this.nodeEq = 0;
        this.mapCol = 0;
        this.mapRow = 0;
        this.value = 0;
        this.rsChanges = false;
        this.lsChanges = false;
        this.dropRow = false;
      }

      RowInfo.prototype.toString = function() {
        return "RowInfo: " + this.type + " " + this.nodeEq + " " + this.mapCol + " " + this.mapRow + " " + this.value + " " + this.rsChanges + " " + this.lsChanges + " " + this.dropRow;
      };

      return RowInfo;

    })();
    return RowInfo;
  });

}).call(this);

(function() {
  define([], function() {
    var Point;
    Point = (function() {
      function Point(x, y) {
        this.x = x != null ? x : 0;
        this.y = y != null ? y : 0;
      }

      Point.prototype.equals = function(otherPoint) {
        return this.x === otherPoint.x && this.y === otherPoint.y;
      };

      Point.toArray = function(num) {
        var i, _i, _len, _ref, _results;
        _ref = Array(num);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          _results.push(new Point(0, 0));
        }
        return _results;
      };

      Point.comparePair = function(x1, x2, y1, y2) {
        return (x1 === y1 && x2 === y2) || (x1 === y2 && x2 === y1);
      };

      Point.distanceSq = function(x1, y1, x2, y2) {
        x2 -= x1;
        y2 -= y1;
        return x2 * x2 + y2 * y2;
      };

      return Point;

    })();
    return Point;
  });

}).call(this);

(function() {
  define(['cs!Point'], function(Point) {
    var Polygon;
    Polygon = (function() {
      function Polygon(vertices) {
        var i;
        this.vertices = [];
        if (vertices && vertices.length % 2 === 0) {
          i = 0;
          while (i < vertices.length) {
            this.addVertex(vertices[i], vertices[i + 1]);
            i += 2;
          }
        }
      }

      Polygon.prototype.addVertex = function(x, y) {
        return this.vertices.push(new Point(x, y));
      };

      Polygon.prototype.getX = function(n) {
        return this.vertices[n].x;
      };

      Polygon.prototype.getY = function(n) {
        return this.vertices[n].y;
      };

      Polygon.prototype.numPoints = function() {
        return this.vertices.length;
      };

      return Polygon;

    })();
    return Polygon;
  });

}).call(this);

(function() {
  define([], function() {
    var Rectangle;
    Rectangle = (function() {
      function Rectangle(x, y, width, height) {
        this.x = x != null ? x : 0;
        this.y = y != null ? y : 0;
        this.width = width != null ? width : 0;
        this.height = height != null ? height : 0;
      }

      Rectangle.prototype.contains = function(x, y) {
        return x >= this.x && x <= (this.x + this.width) && y >= this.y && (y <= this.y + this.height);
      };

      Rectangle.prototype.equals = function(otherRect) {
        if (otherRect != null) {
          if (otherRect.x === this.x && otherRect.y === this.y && otherRect.width === this.width && otherRect.height === this.height) {
            return true;
          }
        }
        return false;
      };

      Rectangle.prototype.intersects = function(otherRect) {
        var bottomLeftIntersects, bottomRightIntersects, topLeftIntersects, topRightIntersects;
        topLeftIntersects = this.contains(otherRect.x, otherRect.y);
        topRightIntersects = this.contains(otherRect.x + otherRect.width, otherRect.y);
        bottomRightIntersects = this.contains(otherRect.x + otherRect.width, otherRect.y + otherRect.height);
        bottomLeftIntersects = this.contains(otherRect.x, otherRect.y + otherRect.height);
        return topLeftIntersects || topRightIntersects || bottomRightIntersects || bottomLeftIntersects;
      };

      return Rectangle;

    })();
    return Rectangle;
  });

}).call(this);

(function() {
  define(['jquery', 'cs!ComponentRegistry', 'cs!Circuit'], function($, ComponentRegistry, Circuit) {
    var CircuitLoader;
    CircuitLoader = (function() {
      function CircuitLoader() {}

      CircuitLoader.parseJSON = function(circuit, jsonData) {
        var circuitParams, e, elementData, flags, newCircuitElm, params, sym, type, x1, x2, y1, y2, _i, _len, _results;
        circuitParams = jsonData.shift();
        circuit.setParamsFromJSON(circuitParams);
        _results = [];
        for (_i = 0, _len = jsonData.length; _i < _len; _i++) {
          elementData = jsonData[_i];
          type = elementData['sym'];
          sym = ComponentRegistry.ComponentDefs[type];
          x1 = parseInt(elementData['x1']);
          y1 = parseInt(elementData['y1']);
          x2 = parseInt(elementData['x2']);
          y2 = parseInt(elementData['y2']);
          flags = parseInt(elementData['flags']);
          params = elementData['params'];
          if (type === 'Hint') {
            console.log("Hint found in file!");
          }
          if (type === 'Oscilloscope') {
            console.log("Scope found in file!");
          }
          try {
            if (!type) {
              circuit.warn("Unrecognized Type");
            }
            if (!sym) {
              _results.push(circuit.warn("Unrecognized dump type: " + type));
            } else {
              newCircuitElm = new sym(x1, y1, x2, y2, flags, params);
              _results.push(circuit.solder(newCircuitElm));
            }
          } catch (_error) {
            e = _error;
            _results.push(circuit.halt(e.message));
          }
        }
        return _results;
      };


      /*
      Retrieves string data from a circuit text file (via AJAX GET)
       */

      CircuitLoader.createCircuitFromJSON = function(circuitFileName, onComplete) {
        if (onComplete == null) {
          onComplete = null;
        }
        return $.getJSON(circuitFileName, (function(_this) {
          return function(jsonData) {
            var circuit;
            circuit = new Circuit(context);
            CircuitLoader.parseJSON(circuit, jsonData);
            return typeof onComplete === "function" ? onComplete(circuit) : void 0;
          };
        })(this));
      };

      return CircuitLoader;

    })();
    return CircuitLoader;
  });

}).call(this);

(function() {
  define(['jquery', 'cs!ComponentRegistry', 'cs!Circuit'], function($, ComponentRegistry, Circuit) {
    var ConfigurationLoader;
    return ConfigurationLoader = (function() {
      function ConfigurationLoader() {}


      /*
      Configures interface from JSON file
       */

      ConfigurationLoader.configureInterface = function(Circuit, retry) {};

      ConfigurationLoader.createFromJSON = function(circuitFileName, Context, onComplete) {
        if (Context == null) {
          Context = null;
        }
        if (onComplete == null) {
          onComplete = null;
        }
        return $.getJSON(circuitFileName, function(jsonParsed) {
          var circuit, circuitParams, e, elementData, flags, newCircuitElm, params, sym, type, x1, x2, y1, y2, _i, _len;
          circuit = new Circuit(Context);
          circuitParams = jsonParsed.shift();
          circuit.Params = new CircuitEngineParams(circuitParams);
          for (_i = 0, _len = jsonParsed.length; _i < _len; _i++) {
            elementData = jsonParsed[_i];
            type = elementData['sym'];
            sym = ComponentRegistry.ComponentDefs[type];
            x1 = parseInt(elementData['x1']);
            y1 = parseInt(elementData['y1']);
            x2 = parseInt(elementData['x2']);
            y2 = parseInt(elementData['y2']);
            flags = parseInt(elementData['flags']);
            params = elementData['params'];
            if (type === 'Hint') {
              console.log("Hint found in file!");
            }
            if (type === 'Oscilloscope') {
              console.log("Scope found in file!");
            }
            try {
              if (!type) {
                circuit.warn("Unrecognized Type");
              }
              if (!sym) {
                circuit.warn("Unrecognized dump type: " + type);
              } else {
                newCircuitElm = new sym(x1, y1, x2, y2, flags, params);
                circuit.solder(newCircuitElm);
              }
            } catch (_error) {
              e = _error;
              circuit.halt(e.message);
            }
          }
          return onComplete(circuit);
        });
      };

      return ConfigurationLoader;

    })();
  });

}).call(this);

(function() {
  define([], function() {
    var Logger;
    Logger = (function() {
      var errorStack, warningStack;

      function Logger() {}

      errorStack = new Array();

      warningStack = new Array();

      Logger.error = function(msg) {
        console.log("Error: " + msg);
        return errorStack.push(msg);
      };

      Logger.warn = function(msg) {
        console.error("Warning: " + msg);
        return warningStack.push(msg);
      };

      return Logger;

    })();
    return Logger;
  });

}).call(this);

(function() {
  define(['cs!Settings', 'jquery'], function(Settings, $) {
    var CanvasContext;
    CanvasContext = (function() {
      function CanvasContext(Canvas, width, height) {
        var _ref;
        this.Canvas = Canvas;
        this.width = width != null ? width : 600;
        this.height = height != null ? height : 400;
        this.context = (_ref = this.Canvas) != null ? typeof _ref.getContext === "function" ? _ref.getContext('2d') : void 0 : void 0;
      }

      CanvasContext.prototype.fillText = function(text, x, y) {
        if (!this.context) {
          return;
        }
        return this.context.fillText(text, x, y);
      };

      CanvasContext.prototype.fillCircle = function(x, y, radius, lineWidth, fillColor, lineColor) {
        if (lineWidth == null) {
          lineWidth = Settings.LINE_WIDTH;
        }
        if (fillColor == null) {
          fillColor = '#FF0000';
        }
        if (lineColor == null) {
          lineColor = "#000000";
        }
        if (!this.context) {
          return;
        }
        this.context.fillStyle = fillColor;
        this.context.strokeStyle = lineColor;
        this.context.beginPath();
        this.context.lineWidth = lineWidth;
        this.context.arc(x, y, radius, 0, 2 * Math.PI, true);
        this.context.stroke();
        this.context.fill();
        return this.context.closePath();
      };

      CanvasContext.prototype.drawThickLinePt = function(pa, pb, color) {
        return this.drawThickLine(pa.x, pa.y, pb.x, pb.y, color);
      };

      CanvasContext.prototype.drawThickLine = function(x, y, x2, y2, color) {
        if (color == null) {
          color = Settings.FG_COLOR;
        }
        if (!this.context) {
          return;
        }
        this.context.strokeStyle = color;
        this.context.beginPath();
        this.context.moveTo(x, y);
        this.context.lineTo(x2, y2);
        this.context.stroke();
        return this.context.closePath();
      };

      CanvasContext.prototype.drawThickPolygon = function(xlist, ylist, color) {
        var i, _i, _ref;
        for (i = _i = 0, _ref = xlist.length; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
          this.drawThickLine(xlist[i], ylist[i], xlist[i + 1], ylist[i + 1], color);
        }
        return this.drawThickLine(xlist[i], ylist[i], xlist[0], ylist[0], color);
      };

      CanvasContext.prototype.drawThickPolygonP = function(polygon, color) {
        var i, numVertices, _i;
        numVertices = polygon.numPoints();
        for (i = _i = 0; 0 <= numVertices ? _i < numVertices : _i > numVertices; i = 0 <= numVertices ? ++_i : --_i) {
          this.drawThickLine(polygon.getX(i), polygon.getY(i), polygon.getX(i + 1), polygon.getY(i + 1), color);
        }
        return this.drawThickLine(polygon.getX(i), polygon.getY(i), polygon.getX(0), polygon.getY(0), color);
      };

      CanvasContext.prototype.clear = function() {
        if (!this.context) {
          return;
        }
        return this.context.clearRect(0, 0, this.width, this.height);
      };

      CanvasContext.prototype.getContext = function() {
        return this.context;
      };

      CanvasContext.prototype.getCanvas = function() {
        return this.Canvas;
      };

      CanvasContext.prototype.toBuffer = function() {
        var _ref;
        return (_ref = this.Canvas) != null ? _ref.toBuffer : void 0;
      };

      return CanvasContext;

    })();
    return CanvasContext;
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!CanvasContext', 'cs!Observer', 'cs!Circuit', 'cs!KeyHandler', 'cs!MouseHandler'], function(CanvasContext, Observer, Circuit, KeyHandler, MouseHandler) {
    var CircuitCanvas;
    CircuitCanvas = (function(_super) {
      __extends(CircuitCanvas, _super);

      function CircuitCanvas(Circuit, CanvasJQueryElm) {
        this.Circuit = Circuit;
        this.CanvasJQueryElm = CanvasJQueryElm;
        this.repaint = __bind(this.repaint, this);
        this.onMouseClick = __bind(this.onMouseClick, this);
        this.onMouseUp = __bind(this.onMouseUp, this);
        this.onMouseDown = __bind(this.onMouseDown, this);
        this.onMouseMove = __bind(this.onMouseMove, this);
        this.getMousePos = __bind(this.getMousePos, this);
        if (this.CanvasJQueryElm) {
          this.Context = new CanvasContext(this.CanvasJQueryElm.get(0));
        }
        this.Circuit.addObserver(Circuit.ON_START_UPDATE, this.clear);
        this.Circuit.addObserver(Circuit.ON_RESET, this.clear);
        this.Circuit.addObserver(Circuit.ON_END_UPDATE, this.repaint);
        this.KeyHandler = new KeyHandler();
        this.MouseHandler = new MouseHandler();
        if (this.CanvasJQueryElm) {
          this.CanvasJQueryElm.mousedown(this.onMouseDown);
          this.CanvasJQueryElm.mouseup(this.onMouseUp);
          this.CanvasJQueryElm.click(this.onMouseClick);
        }
      }

      CircuitCanvas.prototype.drawComponents = function() {
        var component, _i, _len, _ref, _results;
        this.clear();
        if (this.Context) {
          _ref = this.Circuit.getElements();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            component = _ref[_i];
            _results.push(this.drawComponent(component));
          }
          return _results;
        }
      };

      CircuitCanvas.prototype.drawComponent = function(component) {
        if (this.Context) {
          return component.draw(this.Context);
        }
      };

      CircuitCanvas.prototype.drawInfo = function() {
        var bottomTextOffset, ybase;
        bottomTextOffset = 100;
        return ybase = this.Circuit.getCircuitBottom - (15 * 1) - bottomTextOffset;
      };

      CircuitCanvas.prototype.drawWarning = function(context) {
        var msg, warning, _i, _len;
        msg = "";
        for (_i = 0, _len = warningStack.length; _i < _len; _i++) {
          warning = warningStack[_i];
          msg += warning + "\n";
        }
        return console.error("Simulation Warning: " + msg);
      };

      CircuitCanvas.prototype.drawError = function(context) {
        var error, msg, _i, _len;
        msg = "";
        for (_i = 0, _len = errorStack.length; _i < _len; _i++) {
          error = errorStack[_i];
          msg += error + "\n";
        }
        return console.error("Simulation Error: " + msg);
      };

      CircuitCanvas.prototype.clear = function() {
        var _ref;
        return (_ref = this.Context) != null ? _ref.clear() : void 0;
      };

      CircuitCanvas.prototype.getContext = function() {
        return this.Context;
      };

      CircuitCanvas.prototype.getCanvas = function() {
        var _ref;
        return (_ref = this.Context) != null ? _ref.getCanvas() : void 0;
      };

      CircuitCanvas.prototype.getBuffer = function() {
        var _ref;
        return (_ref = this.Context) != null ? _ref.getCanvas().toBuffer : void 0;
      };

      CircuitCanvas.prototype.getMouseHandler = function() {
        return this.mouseHandler;
      };

      CircuitCanvas.prototype.getKeyHandler = function() {
        return this.keyHandler;
      };


      /* Event Listeners
       */

      CircuitCanvas.prototype.getMousePos = function(event) {
        var rect;
        rect = this.CanvasJQueryElm.get(0).getBoundingClientRect();
        return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        };
      };

      CircuitCanvas.prototype.onMouseMove = function(event) {
        var mousePos, _ref;
        mousePos = this.getMousePos(event);
        if ((_ref = this.mouseHandler) != null ? _ref.isMouseDown() : void 0) {
          return this.mouseHandler.onMouseDrag(mousePos.x, mousePos.y);
        } else {
          return this.mouseHandler.onMouseMove(mousePos.x, mousePos.y);
        }
      };

      CircuitCanvas.prototype.onMouseDown = function(event) {
        var mousePos, _ref;
        mousePos = this.getMousePos(event);
        return (_ref = this.mouseHandler) != null ? _ref.onMouseDown(mousePos.x, mousePos.y) : void 0;
      };

      CircuitCanvas.prototype.onMouseUp = function(event) {
        var mousePos, _ref;
        mousePos = this.getMousePos(event);
        return (_ref = this.mouseHandler) != null ? _ref.onMouseUp(mousePos.x, mousePos.y) : void 0;
      };

      CircuitCanvas.prototype.onMouseClick = function(event) {
        var mousePos, _ref;
        mousePos = this.getMousePos(event);
        return (_ref = this.mouseHandler) != null ? _ref.onMouseClick(mousePos.x, mousePos.y) : void 0;
      };

      CircuitCanvas.prototype.repaint = function(Circuit) {
        return this.drawComponents();
      };

      return CircuitCanvas;

    })(Observer);
    return CircuitCanvas;
  });

}).call(this);

(function() {
  define(['cs!Settings', 'cs!Polygon', 'cs!Rectangle', 'cs!Point'], function(Settings, Polygon, Rectangle, Point) {
    var DrawHelper;
    DrawHelper = (function() {
      function DrawHelper() {}

      DrawHelper.ps1 = new Point(0, 0);

      DrawHelper.ps2 = new Point(0, 0);

      DrawHelper.colorScaleCount = 32;

      DrawHelper.colorScale = [];

      DrawHelper.initializeColorScale = function() {
        var i, n1, n2, voltage, _i, _ref, _results;
        this.colorScale = new Array(this.colorScaleCount);
        _results = [];
        for (i = _i = 0, _ref = this.colorScaleCount; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          voltage = i * 2 / this.colorScaleCount - 1;
          if (voltage < 0) {
            n1 = Math.floor((128 * -voltage) + 127);
            n2 = Math.floor(127 * (1 + voltage));
            _results.push(this.colorScale[i] = new Color(n1, n2, n2));
          } else {
            n1 = Math.floor((128 * voltage) + 127);
            n2 = Math.floor(127 * (1 - voltage));
            _results.push(this.colorScale[i] = new Color(n2, n1, n2));
          }
        }
        return _results;
      };

      DrawHelper.scale = ["#ff0000", "#f70707", "#ef0f0f", "#e71717", "#df1f1f", "#d72727", "#cf2f2f", "#c73737", "#bf3f3f", "#b74747", "#af4f4f", "#a75757", "#9f5f5f", "#976767", "#8f6f6f", "#877777", "#7f7f7f", "#778777", "#6f8f6f", "#679767", "#5f9f5f", "#57a757", "#4faf4f", "#47b747", "#3fbf3f", "#37c737", "#2fcf2f", "#27d727", "#1fdf1f", "#17e717", "#0fef0f", "#07f707", "#00ff00"];

      DrawHelper.unitsFont = "Arial, Helvetica, sans-serif";

      DrawHelper.interpPoint = function(ptA, ptB, f, g) {
        var gx, gy, ptOut;
        if (g == null) {
          g = 0;
        }
        gx = ptB.y - ptA.y;
        gy = ptA.x - ptB.x;
        g /= Math.sqrt(gx * gx + gy * gy);
        ptOut = new Point();
        ptOut.x = Math.floor((1 - f) * ptA.x + (f * ptB.x) + (g * gx + 0.48));
        ptOut.y = Math.floor((1 - f) * ptA.y + (f * ptB.y) + (g * gy + 0.48));
        return ptOut;
      };

      DrawHelper.interpPoint2 = function(ptA, ptB, f, g) {
        var gx, gy, ptOut1, ptOut2;
        gx = ptB.y - ptA.y;
        gy = ptA.x - ptB.x;
        g /= Math.sqrt(gx * gx + gy * gy);
        ptOut1 = new Point();
        ptOut2 = new Point();
        ptOut1.x = Math.floor((1 - f) * ptA.x + (f * ptB.x) + (g * gx + 0.48));
        ptOut1.y = Math.floor((1 - f) * ptA.y + (f * ptB.y) + (g * gy + 0.48));
        ptOut2.x = Math.floor((1 - f) * ptA.x + (f * ptB.x) - (g * gx + 0.48));
        ptOut2.y = Math.floor((1 - f) * ptA.y + (f * ptB.y) - (g * gy + 0.48));
        return [ptOut1, ptOut2];
      };

      DrawHelper.calcArrow = function(a, b, al, aw) {
        var adx, ady, l, p1, p2, poly;
        poly = new Polygon();
        p1 = new Point(0, 0);
        p2 = new Point(0, 0);
        adx = b.x - a.x;
        ady = b.y - a.y;
        l = Math.sqrt(adx * adx + ady * ady);
        poly.addVertex(b.x, b.y);
        this.interpPoint2(a, b, p1, p2, 1 - al / l, aw);
        poly.addVertex(p1.x, p1.y);
        poly.addVertex(p2.x, p2.y);
        return poly;
      };

      DrawHelper.createPolygon = function(pt1, pt2, pt3, pt4) {
        var newPoly;
        newPoly = new Polygon();
        newPoly.addVertex(pt1.x, pt1.y);
        newPoly.addVertex(pt2.x, pt2.y);
        newPoly.addVertex(pt3.x, pt3.y);
        if (pt4) {
          newPoly.addVertex(pt4.x, pt4.y);
        }
        return newPoly;
      };

      DrawHelper.createPolygonFromArray = function(vertexArray) {
        var newPoly, vertex, _i, _len;
        newPoly = new Polygon();
        for (_i = 0, _len = vertexArray.length; _i < _len; _i++) {
          vertex = vertexArray[_i];
          newPoly.addVertex(vertex.x, vertex.y);
        }
        return newPoly;
      };

      DrawHelper.drawCoil = function(hs, point1, point2, vStart, vEnd) {
        var color, cx, hsx, i, segments, voltageLevel, _i, _results;
        segments = 40;
        this.ps1.x = point1.x;
        this.ps1.y = point1.y;
        _results = [];
        for (i = _i = 0; 0 <= segments ? _i < segments : _i > segments; i = 0 <= segments ? ++_i : --_i) {
          cx = (((i + 1) * 8 / segments) % 2) - 1;
          hsx = Math.sqrt(1 - cx * cx);
          this.interpPoint(point1, point2, this.ps2, i / segments, hsx * hs);
          voltageLevel = vStart + (vEnd - vStart) * i / segments;
          color = this.setVoltageColor(voltageLevel);
          this.drawThickLinePt(this.ps1, this.ps2, color);
          this.ps1.x = this.ps2.x;
          _results.push(this.ps1.y = this.ps2.y);
        }
        return _results;
      };

      DrawHelper.getVoltageDText = function(v) {
        return getUnitText(Math.abs(v), "V");
      };

      DrawHelper.getVoltageText = function(v) {
        return getUnitText(v, "V");
      };

      DrawHelper.getCurrentText = function(value) {
        return getUnitText(value, "A");
      };

      DrawHelper.getCurrentDText = function(value) {
        return getUnitText(Math.abs(value), "A");
      };

      DrawHelper.getVoltageColor = function(volts, fullScaleVRange) {
        var value;
        if (fullScaleVRange == null) {
          fullScaleVRange = 10;
        }
        value = Math.floor((volts + fullScaleVRange) * (this.colorScaleCount - 1) / (2 * fullScaleVRange));
        if (value < 0) {
          value = 0;
        } else if (value >= this.colorScaleCount) {
          value = this.colorScaleCount - 1;
        }
        return this.scale[value];
      };

      DrawHelper.getPowerColor = function(power, scaleFactor) {
        var b, powerLevel, rg;
        if (scaleFactor == null) {
          scaleFactor = 1;
        }
        if (!Settings.powerCheckItem) {
          return;
        }
        powerLevel = power * scaleFactor;
        power = Math.abs(powerLevel);
        if (power > 1) {
          power = 1;
        }
        rg = 128 + Math.floor(power * 127);
        return b = Math.floor(128 * (1 - power));
      };

      return DrawHelper;

    })();
    return DrawHelper;
  });

}).call(this);

(function() {
  define([], function() {});

}).call(this);

(function() {
  define([], function() {
    var Oscilloscope;
    Oscilloscope = (function() {
      function Oscilloscope() {}

      return Oscilloscope;

    })();
    return Oscilloscope;
  });

}).call(this);


/*
Stores Environment-specific settings

These are the global settings for Maxwell and should defined by the user.
Settings do not change by loading a new circuit.
 */

(function() {
  define(['cs!ColorPalette'], function(ColorPalette) {
    var Settings;
    Settings = (function() {
      function Settings() {}

      Settings.SPEED = 112;

      Settings.FRACTIONAL_DIGITS = 2;

      Settings.CURRENT_SEGMENT_LENGTH = 16;

      Settings.POST_RADIUS = 3;

      Settings.CURRENT_RADIUS = 2;

      Settings.LINE_WIDTH = 1;

      Settings.GRID_SIZE = 5;

      Settings.SMALL_GRID = false;

      Settings.SELECT_COLOR = ColorPalette.orange;

      Settings.POST_COLOR_SELECTED = ColorPalette.orange;

      Settings.POST_COLOR = ColorPalette.black;

      Settings.DOTS_COLOR = ColorPalette.yellow;

      Settings.DOTS_OUTLINE = ColorPalette.orange;

      Settings.TEXT_COLOR = ColorPalette.black;

      Settings.TEXT_ERROR_COLOR = ColorPalette.red;

      Settings.TEXT_WARNING_COLOR = ColorPalette.yellow;

      Settings.SELECTION_MARQUEE_COLOR = ColorPalette.orange;

      Settings.GRID_COLOR = ColorPalette.darkyellow;

      Settings.BG_COLOR = ColorPalette.white;

      Settings.FG_COLOR = ColorPalette.darkgray;

      Settings.ERROR_COLOR = ColorPalette.darkred;

      Settings.WARNING_COLOR = ColorPalette.orange;

      return Settings;

    })();
    return Settings;
  });

}).call(this);

(function() {
  define([], function() {
    var CircuitState;
    CircuitState = (function() {
      function CircuitState() {}

      CircuitState.RUNNING = "RUN";

      CircuitState.PAUSED = "PAUSE";

      CircuitState.EDITING = "EDIT";

      return CircuitState;

    })();
    return CircuitState;
  });

}).call(this);

(function() {
  define([], function() {
    var ColorMapState;
    ColorMapState = (function() {
      function ColorMapState() {}

      ColorMapState.SHOW_POWER = "SHOW_POWER";

      ColorMapState.SHOW_VOLTAGE = "SHOW_VOLTAGE";

      return ColorMapState;

    })();
    return ColorMapState;
  });

}).call(this);

(function() {
  define([], function() {
    var KeyboardState;
    KeyboardState = (function() {
      function KeyboardState() {}

      KeyboardState.NO_KEY_DOWN = 0;

      KeyboardState.KEY_DELETE = 46;

      KeyboardState.KEY_SHIFT = 16;

      KeyboardState.KEY_CTRL = 17;

      KeyboardState.KEY_ALT = 18;

      KeyboardState.KEY_ESC = 27;

      KeyboardState.prototype.keyDown = KeyboardState.NO_KEY_DOWN;

      return KeyboardState;

    })();
    return KeyboardState;
  });

}).call(this);

(function() {
  define([], function() {
    var MouseState;
    MouseState = (function() {
      var dragElm, dragging, menuElm;

      function MouseState() {}

      MouseState.MODE_ADD_ELM = "MODE_ADD_ELM";

      MouseState.MODE_DRAG_ALL = "MODE_DRAG_ALL";

      MouseState.MODE_DRAG_ROW = "MODE_DRAG_ROW";

      MouseState.MODE_DRAG_COLUMN = "MODE_DRAG_COLUMN";

      MouseState.MODE_DRAG_SELECTED = "MODE_DRAG_SELECTED";

      MouseState.MODE_DRAG_POST = "MODE_DRAG_POST";

      MouseState.MODE_SELECT = "MODE_SELECT";

      MouseState.prototype.mouseMode = MouseState.MODE_SELECT;

      MouseState.LEFT_MOUSE_BTN = 0;

      MouseState.MIDDLE_MOUSE_BTN = 1;

      MouseState.RIGHT_MOUSE_BTN = 2;

      MouseState.NO_MOUSE_BTN = 3;

      MouseState.prototype.mouseButtonDown = MouseState.NO_MOUSE_BTN;

      MouseState.prototype.dragX = 0;

      MouseState.prototype.dragY = 0;

      MouseState.prototype.initDragX = 0;

      MouseState.prototype.initDragY = 0;

      dragElm = null;

      menuElm = null;

      dragging = false;

      MouseState.prototype.isDragging = function() {
        return dragging;
      };

      return MouseState;

    })();
    return MouseState;
  });

}).call(this);

(function() {


}).call(this);

(function() {
  define([], function() {
    var CommandHistory;
    CommandHistory = (function() {
      function CommandHistory() {
        this.reset();
      }

      CommandHistory.prototype.pushRedo = function(action) {
        return this.redoStack.push(action);
      };

      CommandHistory.prototype.popRedo = function() {
        return this.redoStack.pop();
      };

      CommandHistory.prototype.pushUndo = function(action) {
        return this.undoStack.push(action);
      };

      CommandHistory.prototype.popUndo = function() {
        return this.redoStack.pop();
      };

      CommandHistory.prototype.clearUndo = function() {
        return this.undoStack = new Array();
      };

      CommandHistory.prototype.clearRedo = function() {
        return this.redoStack = new Array();
      };

      CommandHistory.prototype.reset = function() {
        this.undoStack = new Array();
        return this.redoStack = new Array();
      };

      return CommandHistory;

    })();
    return CommandHistory;
  });

}).call(this);

(function() {
  define(['cs!Settings'], function(Settings) {
    var Grid;
    Grid = (function() {
      function Grid() {
        this.updateSize();
      }

      Grid.prototype.updateSize = function() {};

      Grid.prototype.snapGrid = function(x) {
        return (x + this.gridRound) & this.gridMask;
      };

      return Grid;

    })();
    return Grid;
  });

}).call(this);

(function() {
  define([], function() {
    var KeyHandler;
    return KeyHandler = (function() {
      KeyHandler.KEY_DOWN = "KEY_DOWN";

      KeyHandler.KEY_UP = "KEY_UP";

      function KeyHandler(Circuit) {
        this.Circuit = Circuit;
        this.KeyHandler = this.KEY_DOWN;
      }

      KeyHandler.prototype.setState = function(newState) {
        if (newState === this.MOUSE_DOWN || newState === this.MOUSE_UP) {
          return this.keyState = newState;
        } else {
          throw Error("State " + newState + " is not a valid state");
        }
      };

      return KeyHandler;

    })();
  });

}).call(this);

(function() {
  define(['cs!Point'], function(Point) {
    var MouseHandler;
    MouseHandler = (function() {
      function MouseHandler(Circuit) {
        this.Circuit = Circuit;
        this.mouseDown = false;
        this.mouseUp = false;
        this.mouseDownLocation = new Point();
        this.mouseUpLocation = new Point();
        this.mouseLocation = new Point();
        this.mouseDragLocation = new Point();
        this.mouseClickLocation = new Point();
      }

      MouseHandler.prototype.setState = function(newState) {
        if (newState === this.MOUSE_DOWN || newState === this.MOUSE_UP) {
          return this.mouseState = newState;
        } else {
          throw Error("State " + newState + " is not a valid state");
        }
      };

      MouseHandler.prototype.onMouseDown = function(x, y) {
        this.mouseDownLocation = new Point(x, y);
        this.mouseDown = true;
        this.mouseUp = false;
        return console.log("DOWN: " + x + ", " + y);
      };

      MouseHandler.prototype.onMouseUp = function(x, y) {
        this.mouseUpLocation = new Point(x, y);
        this.mouseUp = true;
        this.mouseDown = false;
        this.dragging = false;
        return console.log("UP: " + x + ", " + y);
      };

      MouseHandler.prototype.onMouseDrag = function(x, y) {
        this.mouseLocation = new Point(x, y);
        return this.dragging = true;
      };

      MouseHandler.prototype.onMouseClick = function(x, y) {
        return this.mouseClickLocation = new Point(x, y);
      };

      return MouseHandler;

    })();
    return MouseHandler;
  });

}).call(this);

(function() {
  define([], function() {
    var ArrayUtils;
    if (!Array.prototype.indexOf) {
      Array.prototype.indexOf = function(searchItem, i) {
        if (i == null) {
          i = 0;
        }
        while (i < this.length) {
          if (this[i] === searchItem) {
            return i;
          }
          ++i;
        }
        return -1;
      };
    }
    Array.prototype.remove = function() {
      var args, ax, item, num_args;
      args = arguments;
      num_args = args.length;
      while (num_args && this.length) {
        item = args[--num_args];
        while ((ax = this.indexOf(item)) !== -1) {
          this.splice(ax, 1);
        }
      }
      return this;
    };
    ArrayUtils = (function() {
      function ArrayUtils() {}

      ArrayUtils.zeroArray = function(numElements) {
        var i;
        if (numElements < 1) {
          return [];
        }
        return (function() {
          var _i, _len, _ref, _results;
          _ref = Array(numElements);
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            i = _ref[_i];
            _results.push(0);
          }
          return _results;
        })();
      };

      ArrayUtils.zeroArray2 = function(numRows, numCols) {
        var i, _i, _len, _ref, _results;
        if (numRows < 1) {
          return [];
        }
        _ref = Array(numRows);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          _results.push(this.zeroArray(numCols));
        }
        return _results;
      };

      ArrayUtils.isCleanArray = function(arr) {
        var element, valid, _i, _len;
        for (_i = 0, _len = arr.length; _i < _len; _i++) {
          element = arr[_i];
          if (element instanceof Array) {
            valid = arguments.callee(element);
          } else {
            if (!isFinite(element)) {
              console.warn("Invalid number found: " + element);
              console.printStackTrace();
              return false;
            }
          }
        }
      };

      return ArrayUtils;

    })();
    return ArrayUtils;
  });

}).call(this);

(function() {
  define([], function() {
    var ClassUtils;
    ClassUtils = (function() {
      function ClassUtils() {}

      ClassUtils.extend = function(obj, mixin) {
        var method, name;
        for (name in mixin) {
          method = mixin[name];
          obj[name] = method;
        }
        return obj;
      };

      ClassUtils.include = function(klass, mixin) {
        return extend(klass.prototype, mixin);
      };

      ClassUtils.type = function(o) {
        return !!o && Object.prototype.toString.call(o).match(/(\w+)\]/)[1];
      };

      return ClassUtils;

    })();
    return ClassUtils;
  });

}).call(this);

(function() {
  define([], function() {
    var ColorPalette;
    ColorPalette = {
      'voltageScale': ["#ff0000", "#f70707", "#ef0f0f", "#e71717", "#df1f1f", "#d72727", "#cf2f2f", "#c73737", "#bf3f3f", "#b74747", "#af4f4f", "#a75757", "#9f5f5f", "#976767", "#8f6f6f", "#877777", "#7f7f7f", "#778777", "#6f8f6f", "#679767", "#5f9f5f", "#57a757", "#4faf4f", "#47b747", "#3fbf3f", "#37c737", "#2fcf2f", "#27d727", "#1fdf1f", "#17e717", "#0fef0f", "#07f707", "#00ff00"],
      'aliceblue': '#f0f8ff',
      'antiquewhite': '#faebd7',
      'aqua': '#00ffff',
      'aquamarine': '#7fffd4',
      'azure': '#f0ffff',
      'beige': '#f5f5dc',
      'bisque': '#ffe4c4',
      'black': '#000000',
      'blanchedalmond': '#ffebcd',
      'blue': '#0000ff',
      'blueviolet': '#8a2be2',
      'brown': '#a52a2a',
      'burlywood': '#deb887',
      'cadetblue': '#5f9ea0',
      'chartreuse': '#7fff00',
      'chocolate': '#d2691e',
      'coral': '#ff7f50',
      'cornflowerblue': '#6495ed',
      'cornsilk': '#fff8dc',
      'crimson': '#dc143c',
      'cyan': '#00ffff',
      'darkblue': '#00008b',
      'darkcyan': '#008b8b',
      'darkgoldenrod': '#b8860b',
      'darkgray': '#a9a9a9',
      'darkgrey': '#a9a9a9',
      'darkgreen': '#006400',
      'darkkhaki': '#bdb76b',
      'darkmagenta': '#8b008b',
      'darkolivegreen': '#556b2f',
      'darkorange': '#ff8c00',
      'darkorchid': '#9932cc',
      'darkred': '#8b0000',
      'darksalmon': '#e9967a',
      'darkseagreen': '#8fbc8f',
      'darkslateblue': '#483d8b',
      'darkslategray': '#2f4f4f',
      'darkslategrey': '#2f4f4f',
      'darkturquoise': '#00ced1',
      'darkviolet': '#9400d3',
      'deeppink': '#ff1493',
      'deepskyblue': '#00bfff',
      'dimgray': '#696969',
      'dimgrey': '#696969',
      'dodgerblue': '#1e90ff',
      'firebrick': '#b22222',
      'floralwhite': '#fffaf0',
      'forestgreen': '#228b22',
      'fuchsia': '#ff00ff',
      'gainsboro': '#dcdcdc',
      'ghostwhite': '#f8f8ff',
      'gold': '#ffd700',
      'goldenrod': '#daa520',
      'gray': '#808080',
      'grey': '#808080',
      'green': '#008000',
      'greenyellow': '#adff2f',
      'honeydew': '#f0fff0',
      'hotpink': '#ff69b4',
      'indianred': '#cd5c5c',
      'indigo': '#4b0082',
      'ivory': '#fffff0',
      'khaki': '#f0e68c',
      'lavender': '#e6e6fa',
      'lavenderblush': '#fff0f5',
      'lawngreen': '#7cfc00',
      'lemonchiffon': '#fffacd',
      'lightblue': '#add8e6',
      'lightcoral': '#f08080',
      'lightcyan': '#e0ffff',
      'lightgoldenrodyellow': '#fafad2',
      'lightgray': '#d3d3d3',
      'lightgrey': '#d3d3d3',
      'lightgreen': '#90ee90',
      'lightpink': '#ffb6c1',
      'lightsalmon': '#ffa07a',
      'lightseagreen': '#20b2aa',
      'lightskyblue': '#87cefa',
      'lightslategray': '#778899',
      'lightslategrey': '#778899',
      'lightsteelblue': '#b0c4de',
      'lightyellow': '#ffffe0',
      'lime': '#00ff00',
      'limegreen': '#32cd32',
      'linen': '#faf0e6',
      'magenta': '#ff00ff',
      'maroon': '#800000',
      'mediumaquamarine': '#66cdaa',
      'mediumblue': '#0000cd',
      'mediumorchid': '#ba55d3',
      'mediumpurple': '#9370d8',
      'mediumseagreen': '#3cb371',
      'mediumslateblue': '#7b68ee',
      'mediumspringgreen': '#00fa9a',
      'mediumturquoise': '#48d1cc',
      'mediumvioletred': '#c71585',
      'midnightblue': '#191970',
      'mintcream': '#f5fffa',
      'mistyrose': '#ffe4e1',
      'moccasin': '#ffe4b5',
      'navajowhite': '#ffdead',
      'navy': '#000080',
      'oldlace': '#fdf5e6',
      'olive': '#808000',
      'olivedrab': '#6b8e23',
      'orange': '#ffa500',
      'orangered': '#ff4500',
      'orchid': '#da70d6',
      'palegoldenrod': '#eee8aa',
      'palegreen': '#98fb98',
      'paleturquoise': '#afeeee',
      'palevioletred': '#d87093',
      'papayawhip': '#ffefd5',
      'peachpuff': '#ffdab9',
      'peru': '#cd853f',
      'pink': '#ffc0cb',
      'plum': '#dda0dd',
      'powderblue': '#b0e0e6',
      'purple': '#800080',
      'red': '#ff0000',
      'rosybrown': '#bc8f8f',
      'royalblue': '#4169e1',
      'saddlebrown': '#8b4513',
      'salmon': '#fa8072',
      'sandybrown': '#f4a460',
      'seagreen': '#2e8b57',
      'seashell': '#fff5ee',
      'sienna': '#a0522d',
      'silver': '#c0c0c0',
      'skyblue': '#87ceeb',
      'slateblue': '#6a5acd',
      'slategray': '#708090',
      'slategrey': '#708090',
      'snow': '#fffafa',
      'springgreen': '#00ff7f',
      'steelblue': '#4682b4',
      'tan': '#d2b48c',
      'teal': '#008080',
      'thistle': '#d8bfd8',
      'tomato': '#ff6347',
      'turquoise': '#40e0d0',
      'violet': '#ee82ee',
      'wheat': '#f5deb3',
      'white': '#ffffff',
      'whitesmoke': '#f5f5f5',
      'yellow': '#ffff00',
      'yellowgreen': '#9acd32'
    };
    return ColorPalette;
  });

}).call(this);

(function() {
  define([], function() {
    var ColorScale;
    ColorScale = (function() {
      function ColorScale() {}

      ColorScale.colorScaleCount = 32;

      ColorScale.colorScale = [];

      ColorScale.initializeColorScale = function() {
        var i, n1, n2, v, _i, _ref, _results;
        this.colorScale = new Array(this.colorScaleCount);
        _results = [];
        for (i = _i = 1, _ref = this.colorScaleCount; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
          v = i * 2 / this.colorScaleCount - 1;
          if (v < 0) {
            n1 = Math.floor((128 * -v) + 127);
            n2 = Math.floor(127 * (1 + v));
            _results.push(this.colorScale[i] = new Color(n1, n2, n2));
          } else {
            n1 = Math.floor((128 * v) + 127);
            n2 = Math.floor(127 * (1 - v));
            _results.push(this.colorScale[i] = new Color(n2, n1, n2));
          }
        }
        return _results;
      };

      ColorScale.scale = function() {
        return ["#ff0000", "#f70707", "#ef0f0f", "#e71717", "#df1f1f", "#d72727", "#cf2f2f", "#c73737", "#bf3f3f", "#b74747", "#af4f4f", "#a75757", "#9f5f5f", "#976767", "#8f6f6f", "#877777", "#7f7f7f", "#778777", "#6f8f6f", "#679767", "#5f9f5f", "#57a757", "#4faf4f", "#47b747", "#3fbf3f", "#37c737", "#2fcf2f", "#27d727", "#1fdf1f", "#17e717", "#0fef0f", "#07f707", "#00ff00"];
      };

      return ColorScale;

    })();
    return ColorScale;
  });

}).call(this);

(function() {
  define([], function() {
    return console.printStackTrace = function() {
      var e, stack;
      e = new Error("dummy");
      stack = e.stack.replace(/^[^\(]+?[\n$]/gm, '').replace(/^\s+at\s+/gm, '').replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@').split('\n');
      return console.warn(stack);
    };
  });

}).call(this);

(function() {
  define([], function() {
    var FormatUtils;
    FormatUtils = (function() {
      function FormatUtils() {}

      FormatUtils.showFormat = function(decimalNum) {
        return decimalNum.toFixed(2);
      };

      FormatUtils.shortFormat = function(decimalNum) {
        return decimalNum.toFixed(1);
      };


      /*
      Removes commas from a number containing a string:
      e.g. 1,234,567.99 -> 1234567.99
       */

      FormatUtils.noCommaFormat = function(numberWithCommas) {
        return numberWithCommas.replace(/,/g, '');
      };


      /*
      Adds commas to a number, and returns the string representation of that number
      e.g. 1234567.99 -> 1,234,567.99
       */

      FormatUtils.commaFormat = function(plainNumber) {
        var pattern, x, x1, x2;
        plainNumber += "";
        x = plainNumber.split(".");
        x1 = x[0];
        x2 = (x.length > 1 ? "." + x[1] : "");
        pattern = /(\d+)(\d{3})/;
        while (pattern.test(x1)) {
          x1 = x1.replace(pattern, "$1" + "," + "$2");
        }
        return x1 + x2;
      };

      return FormatUtils;

    })();
    return FormatUtils;
  });

}).call(this);

(function() {
  define([], function() {
    var MathUtils;
    MathUtils = (function() {
      function MathUtils() {}

      MathUtils.isInfinite = function(num) {
        return num > 1e18 || !isFinite(num);
      };

      MathUtils.sign = function(x) {
        if (x < 0) {
          return -1;
        } else if (x === 0) {
          return 0;
        } else {
          return 1;
        }
      };

      MathUtils.getRand = function(x) {
        return Math.floor(Math.random() * (x + 1));
      };

      return MathUtils;

    })();
    return MathUtils;
  });

}).call(this);

(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define([], function() {
    var Module, moduleKeywords;
    moduleKeywords = ['extended', 'included'];
    Module = (function() {
      function Module() {}

      Module.extend = function(obj) {
        var key, value, _ref;
        for (key in obj) {
          value = obj[key];
          if (__indexOf.call(moduleKeywords, key) < 0) {
            this[key] = value;
          }
        }
        if ((_ref = obj.extended) != null) {
          _ref.apply(this);
        }
        return this;
      };

      Module.include = function(obj) {
        var key, value, _ref;
        for (key in obj) {
          value = obj[key];
          if (__indexOf.call(moduleKeywords, key) < 0) {
            this.prototype[key] = value;
          }
        }
        if ((_ref = obj.included) != null) {
          _ref.apply(this);
        }
        return this;
      };

      return Module;

    })();
    return Module;
  });

}).call(this);

(function() {
  var __slice = [].slice;

  define([], function() {
    var Observer;
    Observer = (function() {
      function Observer() {}

      Observer.prototype.addObserver = function(event, fn) {
        var _base;
        this._events || (this._events = {});
        (_base = this._events)[event] || (_base[event] = []);
        return this._events[event].push(fn);
      };

      Observer.prototype.removeObserver = function(event, fn) {
        this._events || (this._events = {});
        if (this._events[event]) {
          return this._events[event].splice(this._events[event].indexOf(fn), 1);
        }
      };

      Observer.prototype.notifyObservers = function() {
        var args, callback, event, _i, _len, _ref, _results;
        event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        this._events || (this._events = {});
        if (this._events[event]) {
          _ref = this._events[event];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            callback = _ref[_i];
            _results.push(callback.apply(this, args));
          }
          return _results;
        }
      };

      Observer.prototype.getObservers = function() {
        return this._events;
      };

      return Observer;

    })();
    return Observer;
  });

}).call(this);

(function() {
  define([], function() {
    var Timer;
    Timer = (function() {
      function Timer() {}

      Timer.tick = function(timer_name) {
        this.timers || (this.timers = {});
        return this.timers[timer_name] = (new Date()).getTime();
      };

      Timer.tock = function(timer_name) {
        this.timers || (this.timers = {});
        if (this.timers[timer_name]) {
          return (new Date()).getTime() - this.timers[timer_name];
        } else {
          return console.log("Could not find timer " + timer_name);
        }
      };

      return Timer;

    })();
    return Timer;
  });

}).call(this);

(function() {
  define([], function() {
    var Units;
    Units = (function() {
      function Units() {}

      Units.muString = "u";

      Units.ohmString = "ohm";

      Units.getUnitText = function(value, unit, decimalPoints) {
        var absValue;
        if (decimalPoints == null) {
          decimalPoints = 2;
        }
        absValue = Math.abs(value);
        if (absValue < 1e-18) {
          return "0 " + unit;
        }
        if (absValue < 1e-12) {
          return (value * 1e15).toFixed(decimalPoints) + " f" + unit;
        }
        if (absValue < 1e-9) {
          return (value * 1e12).toFixed(decimalPoints) + " p" + unit;
        }
        if (absValue < 1e-6) {
          return (value * 1e9).toFixed(decimalPoints) + " n" + unit;
        }
        if (absValue < 1e-3) {
          return (value * 1e6).toFixed(decimalPoints) + " " + Units.muString + unit;
        }
        if (absValue < 1) {
          return (value * 1e3).toFixed(decimalPoints) + " m" + unit;
        }
        if (absValue < 1e3) {
          return value.toFixed(decimalPoints) + " " + unit;
        }
        if (absValue < 1e6) {
          return (value * 1e-3).toFixed(decimalPoints) + " k" + unit;
        }
        if (absValue < 1e9) {
          return (value * 1e-6).toFixed(decimalPoints) + " M" + unit;
        }
        return (value * 1e-9).toFixed(decimalPoints) + " G" + unit;
      };

      return Units;

    })();
    return Units;
  });

}).call(this);
