
// test.js - test that JAM works
(function() {

  var jam = require('./jam')
    , util = require('util');

  jam(function(_) { console.log('one'); this('two'); })
    (function(x) { console.log(x); this(); })
    (function() { console.log('three'); this('fo', 'ur'); })
    (function(y, z) { console.log(y + z); this(); });
    
})();
