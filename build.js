var fs = require('fs');
var path = require('path');
var browserify = require('browserify');

var bundled = browserify({ debug: true })
    .addEntry(path.join(__dirname, 'home.js'))
    .bundle();

fs.writeFileSync(path.join(__dirname, 'build/bundle.js'), bundled, 'utf-8');
