(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent) {
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
        this.ps2 = new Point(0, 0);
        if (st) {
          if (typeof st === "string") {
            st = st.split(" ");
          }
          str = st.shift();
          this.position = 0;
        }
      }

      SwitchElm.prototype.getDumpType = function() {
        return "s";
      };

      SwitchElm.prototype.dump = function() {
        return "" + (SwitchElm.__super__.dump.call(this)) + " " + this.position + " " + this.momentary;
      };

      SwitchElm.prototype.setPoints = function() {
        SwitchElm.__super__.setPoints.call(this);
        this.calcLeads(32);
        this.ps = new Point(0, 0);
        return this.ps2 = new Point(0, 0);
      };

      SwitchElm.prototype.stamp = function(stamper) {
        console.log(this.voltSource);
        if (this.position === 0) {
          return stamper.stampVoltageSource(this.nodes[0], this.nodes[1], this.voltSource, 0);
        }
      };

      SwitchElm.prototype.draw = function(renderContext) {
        var hs1, hs2, openhs;
        openhs = 16;
        hs1 = (this.position === 1 ? 0 : 2);
        hs2 = (this.position === 1 ? openhs : 2);
        this.setBboxPt(this.point1, this.point2, openhs);
        this.draw2Leads(renderContext);
        if (this.position === 0) {
          this.drawDots(renderContext);
        }
        this.ps = DrawHelper.interpPoint(this.lead1, this.lead2, 0, hs1);
        this.ps2 = DrawHelper.interpPoint(this.lead1, this.lead2, 1, hs2);
        renderContext.drawThickLinePt(this.ps, this.ps2, Settings.FG_COLOR);
        return this.drawPosts(renderContext);
      };

      SwitchElm.prototype.calculateCurrent = function() {
        if (this.position === 1) {
          return this.current = 0;
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
          this.position = 0;
        }
        return this.Circuit.Solver.analyzeFlag = true;
      };

      SwitchElm.prototype.getInfo = function(arr) {
        arr[0] = (this.momentary ? "push switch (SPST)" : "switch (SPST)");
        if (this.position === 1) {
          arr[1] = "open";
          return arr[2] = "Vd = " + DrawHelper.getVoltageDText(this.getVoltageDiff());
        } else {
          arr[1] = "closed";
          arr[2] = "V = " + DrawHelper.getVoltageText(this.volts[0]);
          return arr[3] = "I = " + DrawHelper.getCurrentDText(this.getCurrent());
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
