// Generated by CoffeeScript 1.4.0
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
