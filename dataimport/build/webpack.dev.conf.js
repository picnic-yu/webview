var config = require('../config')
var webpack = require('webpack')
var merge = require('webpack-merge')
var utils = require('./utils')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var path = require('path');
// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    loaders: utils.styleLoaders()
  },
  /*output:{
    path:path.resolve(__dirname, '/webview'),
    publicPath:'./'
  },*/
  // eval-source-map is faster for development
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      title:'POS数据录入',
      filename: 'index.html',
      template: path.resolve(__dirname, '../index.html'),
      inject: true,
      chunks:['app','vendor']//告诉插件应用entry里面的哪个入口
    }),
    new HtmlWebpackPlugin({
      title:'POS数据记录',
      filename: 'historys.html',
      template: path.resolve(__dirname, '../historys.html'),
      chunks:['historys','vendor'],//告诉插件应用entry里面的哪个入口
      inject: true
    })
  ]
})
