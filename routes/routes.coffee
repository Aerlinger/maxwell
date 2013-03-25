routes = (app) ->
  app.get '/', (req, res) ->
    circuit_name = req.query.circuit
    res.render "index",
               circuit_name: circuit_name
               title: circuit_name

module.exports = routes