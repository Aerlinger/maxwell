// Generated by CoffeeScript 1.4.0
(function() {
  var routes;

  routes = function(app) {
    return app.get('/', function(req, res) {
      var circuit_name;
      circuit_name = req.query.circuit;
      return res.render("index", {
        circuit_name: circuit_name,
        title: circuit_name
      });
    });
  };

  module.exports = routes;

}).call(this);