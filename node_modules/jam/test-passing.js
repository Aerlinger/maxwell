
// test-passing.js - Test passing JAMs around
(function() {

  var J = require('./jam')
    , util = require('util');

  function instruct(time, txt) { return function(jam) { 
    util.log(txt);
    setTimeout(this, time);
  }; }

  function instruct(time, txt) {
    return function(jam) {
      return jam(function() {
        util.log(txt);
        setTimeout(this, time);
      });
    };
  }

  // sandwich making instructions
  var growWheat = instruct(3000, 'growing wheats...')
    , makeBread = instruct(1000, 'making breads...')
    , sliceBread = instruct(500, 'slicing breads...')
    , pasteJams = instruct(2000, 'pasting jams...')
    , coupleEm = instruct(200, 'couple em together...');

  var sandwich = J;
  sandwich = growWheat(sandwich);
  sandwich = makeBread(sandwich);
  sandwich = sliceBread(sandwich);
  sandwich = pasteJams(sandwich);
  sandwich = coupleEm(sandwich);
  sandwich(function() { util.log("YUM!"); });

})();
