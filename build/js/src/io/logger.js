(function() {
  define([], function() {
    var Logger;
    Logger = (function() {
      var errorStack, warningStack;

      function Logger() {}

      errorStack = new Array();

      warningStack = new Array();

      Logger.error = function(msg) {
        console.error("Error: " + msg);
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
