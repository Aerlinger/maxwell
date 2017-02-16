module.exports = {
  entry: "./src/Maxwell.js",
  devtool: 'source-map',
  // debug: true,
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js"
  },
  module: {
    loaders: [
      { test: /\.coffee/, loader: "coffee-loader" },
      { test: /\.(coffee\.md|litcoffee)$/, loader: "coffee-loader?literate" },
      { test: /circuitSolver.js/, loader: 'babel-loader' }
    ]
  },
  resolve: {
    // extensions: [".webpack.js", ".web.js", ".js"]
    alias: {
      'jquery-ui': 'jquery-ui-dist/jquery-ui.js'
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      jqy: "jquery",
      'global.jQuery': 'jquery',
      'd3': 'd3',
      'rickshaw': 'rickshaw'
    })
  ],
  // TODO: This fixes "module not found" error on the "fs" module used by CircuitLoader et. a
  node: {
    fs: "empty"
  }
};
