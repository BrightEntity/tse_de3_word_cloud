const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require("copy-webpack-plugin");



const HtmlWebpackPlugin = require('html-webpack-plugin')




/*
 * We've enabled HtmlWebpackPlugin for you! This generates a html
 * page for you when you compile webpack, which will make you start
 * developing and prototyping faster.
 *
 * https://github.com/jantimon/html-webpack-plugin
 *
 */

module.exports = {
  mode: 'development',

  plugins: [new webpack.ProgressPlugin(), new HtmlWebpackPlugin({
            template: 'index.html'
          }),
          new CopyPlugin({
            patterns: [
              { from: "src/assets", to: "assets"}
            ]
          })],

  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      include: [path.resolve(__dirname, 'src')],
      loader: 'babel-loader'
    }, {
      test: /.(sa|sc|c)ss$/,

      use: [{
        loader: "style-loader"
      }, {
        loader: "css-loader",

        options: {
          sourceMap: true
        }
      }, {
        loader: "sass-loader",

        options: {
          sourceMap: true
        }
      }]
    },
      {
        test: /\.(csv|tsv)$/i,
        use: ['csv-loader'],
      },

      {
        test: /\.xml$/i,
        use: ['xml-loader'],
      }]
  },

  devServer: {
    open: true,
    host: 'localhost'
  }
}