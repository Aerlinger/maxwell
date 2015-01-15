(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent) {
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
