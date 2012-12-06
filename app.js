require('coffee-script');
var _ = require('underscore')._;

var express = require('express')
    , routes = require('./routes')
    , user = require('./routes/user')
    , http = require('http')
    , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

// Global definitions:
require('./src/global/arrays');
require('./src/global/colorPalette');
require('./src/global/console');
require('./src/global/formats');
require('./src/global/math');
require('./src/global/units');
require('./src/global/mixin');
require('./src/global/typeChecking');

Circuit = require('./src/core/circuit');
CircuitElement = require('src/component/abstractCircuitComponent.coffee');
Settings = require('./src/settings/Settings');

console.log("Running Maxwell in environment: " + process.argv[2])
process.env[process.argv[2]] = true

