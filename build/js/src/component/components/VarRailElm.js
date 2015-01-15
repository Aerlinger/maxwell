(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent', 'cs!component/components/RailElm'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent, RailElm) {
    var VarRailElm;
    VarRailElm = (function(_super) {
      __extends(VarRailElm, _super);

      function VarRailElm(xa, ya, xb, yb, f, st) {
        VarRailElm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
        this.frequency = this.maxVoltage;
      }

      VarRailElm.prototype.dump = function() {
        return VarRailElm.__super__.dump.call(this);
      };

      VarRailElm.prototype.getDumpType = function() {
        return 172;
      };

      VarRailElm.prototype.createSlider = function() {};

      VarRailElm.prototype.getVoltageDiff = function() {
        return this.volts[0];
      };

      VarRailElm.prototype.getVoltage = function() {
        return VarRailElm.__super__.getVoltage.call(this);
      };

      VarRailElm.prototype.destroy = function() {};

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
