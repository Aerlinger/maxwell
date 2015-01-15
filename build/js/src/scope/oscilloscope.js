(function() {
  define([], function() {
    var Oscilloscope;
    Oscilloscope = (function() {
      function Oscilloscope(timeStep) {
        var chartDiv, i, xbuffer_size, _i;
        this.timeStep = timeStep != null ? timeStep : 1;
        this.timeBase = 0;
        this.frames = 0;
        this.seriesData = [[], [], [], [], [], [], [], [], []];
        xbuffer_size = 150;
        chartDiv = document.getElementById("chart");
        for (i = _i = 0; 0 <= xbuffer_size ? _i <= xbuffer_size : _i >= xbuffer_size; i = 0 <= xbuffer_size ? ++_i : --_i) {
          this.addData(0);
        }
        setInterval((function(_this) {
          return function() {
            _this.step();
            return graph.update();
          };
        })(this), 40);
      }

      Oscilloscope.prototype.step = function() {
        this.frames += 1;
        this.removeData(1);
        return this.addData(0.5 * Math.sin(this.frames / 10) + 0.5);
      };

      Oscilloscope.prototype.addData = function(value) {
        var index, item, _i, _len, _ref, _results;
        index = this.seriesData[0].length;
        _ref = this.seriesData;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          _results.push(item.push({
            x: index * this.timeStep + this.timeBase,
            y: value
          }));
        }
        return _results;
      };

      Oscilloscope.prototype.removeData = function(data) {
        var item, _i, _len, _ref;
        _ref = this.seriesData;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          item.shift();
        }
        return this.timeBase += this.timeStep;
      };

      return Oscilloscope;

    })();
    return Oscilloscope;
  });

}).call(this);
