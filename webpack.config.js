var webpack = require('webpack');

module.exports = {
  resolve: {
    extensions: ["", ".webpack.js", ".web.js", ".js", ".jsx"]
  },
  entry: {
    r: './src/public/js/r/r.jsx'
  },
  output: {
    path: __dirname,
    filename: '[name].js'
  },
  module: {
    loaders: [{
      test: /.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['react', 'es2015', 'stage-2']
      }
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"'
    })
    /*,new webpack.optimize.UglifyJsPlugin({
      minimize: true
    })*/
  ]
}
