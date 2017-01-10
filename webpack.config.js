module.exports = {
  entry: "./src/Maxwell.js",
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js"
  },
  module: {
    loaders: [
      { test: /\.coffee/, loader: "coffee-loader" },
      { test: /\.(coffee\.md|litcoffee)$/, loader: "coffee-loader?literate" }
    ]
  },
  resolve: {
    // extensions: [".webpack.js", ".web.js", ".js"]
  },
  // TODO: This fixes "module not found" error on the "fs" module used by CircuitLoader et. a
  node: {
    fs: "empty"
  }
};
