// Generated by CoffeeScript 1.4.0
(function() {

  define([], function() {
    var Logger;
    Logger = (function() {
      var errorStack, warningStack;

      function Logger() {}

      errorStack = new Array();

      warningStack = new Array();

      Logger.error = function(msg) {
        console.log("Error: " + msg);
        return errorStack.push(msg);
      };

      Logger.warn = function(msg) {
        console.error("Warning: " + msg);
        return warningStack.push(msg);
      };

      return Logger;

    })();
    return Logger;
  });

}).call(this);