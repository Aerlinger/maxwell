// Generated by CoffeeScript 1.4.0
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
