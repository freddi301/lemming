const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './index.js',
  output: {
    filename: '[name].[chunkhash].js',
    path: path.join(__dirname, '../app')
  },
  module: {
    rules: [
      { test: /\.js?$/, loader: 'babel-loader', exclude: [path.resolve(__dirname, '../node_modules')] }
    ]
  },
  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => module.context && module.context.indexOf('node_modules') !== -1
    })
  ]
};
