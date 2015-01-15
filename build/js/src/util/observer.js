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
