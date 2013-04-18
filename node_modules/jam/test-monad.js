
// test-monad.js - Test monadic helper functions
(function() {

  function slowAdd(x, y, callback) {
    setTimeout(function() {
      callback(x + y);
    }, 3000);
  }

  require('./jam')
    .return(['h', 'e', 'l', 'l', 'o', ' ', '!'])
    .map(function(arr) {
      var str = "";
      for (var i in arr) str += arr[i];
      return str;
    })
    .do(console.log)
    .call(slowAdd, 3, 4)
    .do(console.log);

})();
