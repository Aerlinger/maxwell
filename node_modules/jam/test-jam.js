
// test-jam.js - Test deferred JAMs
(function() {

  var J = require('./jam')
    , util = require('util');

  function vendJams(howMany) {
    var jam = J(function() { util.log('Out of JAMs!'); this(); });

    for (var i = howMany; i > 0; i--) (function(i) {
      jam = jam(function() {
        util.log('' + i + ' JAM(s) left!');
        setTimeout(this, 1000);
      });
    })(i);

    jam = jam(function() { util.log('No more JAMs left!'); this(); });
  }

  vendJams(5);

})();
