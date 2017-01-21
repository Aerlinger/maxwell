var express = require('express');
var path = require('path');
var fs = require('fs');
var glob = require('glob');

var app = express();

app.set('views', __dirname);
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/js'));
app.use("/foundation", express.static(path.join(__dirname, './vendor/foundation')));
app.use("/bower_components", express.static(path.join(__dirname, '../bower_components')));
app.use("/dist", express.static(path.join(__dirname, '../dist')));
app.use("/scripts", express.static(path.join(__dirname, './scripts')));
app.use("/circuits", express.static(path.join(__dirname, '../circuits')));

var port = 6502;

var circuit_names = glob.sync(__dirname + "/../circuits/v3/*.json").map(function(filename) {
  return path.basename(filename, ".json")
});

app.get('/', function (req, res) {
  res.redirect('/ui')
});

app.get('/plotting', function (req, res) {
  res.render('plotting');
});

app.get('/ui', function (req, res) {
  res.redirect('/ui/opint')
});

app.get('/ui/:circuit_name', function (req, res) {
  res.render('ui', {
    circuit_name: req.params.circuit_name,
    circuit_names: circuit_names
  });
});

app.get('/theme', function (req, res) {
  res.render('theme-test.html');
});

app.get('/circuits/:circuit_name', function (req, res) {
  // console.log(__dirname + "../circuits/v3/*.json")
  console.log(circuit_names);

  res.render('index', {
    circuit: req.params.circuit_name,
    circuit_names: circuit_names
  });
});

app.listen(process.env.PORT || port, function () {
  console.log('Example app listening on port ' + port + '!');
});
