var express = require('express')
    , http = require('http')
    , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 1337);
  app.set('views', __dirname + '/views');
  //app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, '')));

});

//app.get('/', function(req, res) {
//    res.sendFile('index.html');
//});

console.log("Running Maxwell in environment: " + process.argv[2])
process.env[process.argv[2]] = true


http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

