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

      Point.prototype.toString = function() {
        return "[\t" + this.x + ", \t" + this.y + "]";
      };

      return Point;

    })();
    return Point;
  });

}).call(this);
