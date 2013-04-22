var express = require('express'),
    stylus = require('stylus'),
    path = require('path')

var app = express();

app.configure(function () {
  app.use(stylus.middleware({
    src: __dirname + "/views",
    // It will add /stylesheets to this path.
    dest: __dirname + "/public"
  }));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { layout: false });
  app.set('port', process.env.PORT || 4004);  // In honor of the Intel 4004.
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.static(path.join(__dirname, '')));

});

app.configure('development', function () {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

app.configure('test', function () {
  app.set('port', 3001);
});

app.configure('production', function () {
  app.use(express.errorHandler());
});

require('./routes/routes')(app);

app.listen(app.get('port'), function () {
  console.log("Maxwell server listening on port %d in %s mode", app.settings.port, app.settings.env);
});

