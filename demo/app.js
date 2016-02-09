var express = require('express');
var path = require('path');
var fs = require('fs');
var glob = require('glob');

var app = express();

app.set('views', __dirname);
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/css'));
app.use("/bower_components", express.static(path.join(__dirname, '../bower_components')));
app.use("/dist", express.static(path.join(__dirname, '../dist')));
app.use("/circuits", express.static(path.join(__dirname, '../circuits')));

var port = 6502;

app.get('/', function (req, res) {
  res.redirect('/ohms')
});

app.get('/:circuit_name', function (req, res) {
  circuit_names = glob.sync("../circuits/*.json").map(function(filename) {
    return path.basename(filename, ".json")
  });

  console.log(circuit_names);

  res.render('index', {
    circuit: req.params.circuit_name,
    circuit_names: circuit_names
  });
});

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
});
