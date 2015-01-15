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

      ArrayUtils.printArray = function(arr) {
        var subarr, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = arr.length; _i < _len; _i++) {
          subarr = arr[_i];
          _results.push(console.log(subarr));
        }
        return _results;
      };

      return ArrayUtils;

    })();
    return ArrayUtils;
  });

}).call(this);
