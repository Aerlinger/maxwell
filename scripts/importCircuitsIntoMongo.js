let glob = require("glob");
let MongoClient = require('mongodb').MongoClient;
let assert = require("assert");
let fs = require("fs");
let path = require('path');

var url = 'mongodb://localhost:27017/maxwell_dev';

let circuit_names = glob.sync(__dirname + "/../circuits/v5/*.json");

MongoClient.connect(url, function (err, db) {
  console.log(`Connected to ${url}`);

  circuits = [];

  for (let circuit_path of circuit_names) {
    console.log(circuit_path);

    let circuit_data = JSON.parse(fs.readFileSync(circuit_path));
    let name = path.basename(circuit_path, '.json');

    circuits.push({
      name,
      params: circuit_data.params,
      components: circuit_data.components
    });
  }

  db.collection('default_circuits').insertMany(circuits, function (err, r) {
    console.log("Inserted", r.insertedCount, "circuits");

    db.close();
  });

});
