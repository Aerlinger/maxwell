module.exports = {
  entry: "./src/Maxwell.js",
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: "coffee-loader" },
      { test: /\.(coffee\.md|litcoffee)$/, loader: "coffee-loader?literate" }
    ]
  },
  resolve: {
    // extensions: [".webpack.js", ".web.js", ".js"]
  }
};
