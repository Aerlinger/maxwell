// Generated by CoffeeScript 1.4.0
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!Settings', 'cs!DrawHelper', 'cs!Polygon', 'cs!Rectangle', 'cs!Point', 'cs!CircuitComponent', 'cs!Units'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent, Units) {
    var CurrentElm;
    CurrentElm = (function(_super) {

      __extends(CurrentElm, _super);

      function CurrentElm(xa, ya, xb, yb, f, st) {
        CurrentElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
        try {
          if (typeof st === "string") {
            st = st.split(" ");
          }
          this.currentValue = parseFloat(st[0]);
        } catch (e) {
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

<<<<<<< HEAD
      CurrentElm.prototype.draw = function() {
=======
      CurrentElm.prototype.draw = function(renderContext) {
>>>>>>> reorganize_packages
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
