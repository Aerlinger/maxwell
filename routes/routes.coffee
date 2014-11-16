fs = require('fs');

routes = (app) ->
  app.get '/', (req, res) ->
    circuits = fs.readdirSync("./circuits")
    console.log("loading: #{circuits}")
    circuit_name = req.query.circuit

    res.render "index.jade", {
               circuits: circuits,
               circuit_name: circuit_name
    }

  app.get '/test', (req, res) ->
    res.render "test.jade"

  app

module.exports = routes
