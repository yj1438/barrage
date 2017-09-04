var path = require('path');
var webpack = require('webpack');
var pkg = require('./package.json');
var merge = require('webpack-merge');

var banner =
  pkg.name + ' - ' + pkg.description + '\n' +
  'Author: ' + pkg.author + '\n' +
  'Version: v' + pkg.version;

var config = {
  entry: {
    Barrage: ['./src/index.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist',
    filename: 'index.debug.js',
    library: ['luna', '[name]'],
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.BannerPlugin(banner)
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-object-assign']
        }
      }
    ]
  }
};

// 是否开发模式
var isDev = (function() {
  var startAppPath = process.argv[1] || '';
  return startAppPath.indexOf('webpack-dev-server') !== -1;
})();
if (isDev) {
  config.devServer = {
    devtool: 'source-map',
    disableHostCheck: true
  };
}

// 压缩版
var minConfig = merge(config, {
  output: {
    filename: 'index.js'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
});

module.exports = [config, minConfig];
