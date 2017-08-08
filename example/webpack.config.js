var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var config = {

  devtool: 'source-map',

  entry: './example/index.js',

  resolve: {
    extensions: [ '', '.js', '.jsx' ],
    modulesDirectories: [ 'node_modules' ],
  },

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js?[hash]',
  },

  devServer: {
    devtool: 'cheap-module-source-map',
    // hot: true,
    host: '0.0.0.0',
    disableHostCheck: true,
    port: 9080,
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'example/index.html',
    }),
  ],

  module: {
    loaders: [
      // {
      //   test: /\.css/,
      //   loader: 'style-loader!css-loader',
      // },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-object-assign'],
        },
      },
    ],
  },
};

module.exports = config;
