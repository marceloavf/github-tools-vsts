'use strict'

process.env.BABEL_ENV = 'main'

const path = require('path')
const webpack = require('webpack')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

let mainConfig = {
  entry: {
    'GithubReleasePublish/githubReleasePublish': path.join(
      __dirname,
      '../Src/GithubReleasePublish/githubReleasePublish.js'
    )
  },
  output: {
    path: path.join(__dirname, '../Tasks'),
    libraryTarget: 'commonjs2',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
          options: {
            formatter: require('eslint-friendly-formatter')
          }
        }
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      }
    ]
  },
  target: 'node',
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new UglifyJsPlugin(),
    // Copy the images folder and optimize all the images
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, '../Src'),
        to: '[path][name].[ext]',
        ignore: ['**/node_modules/**', '**/*.js']
      }
    ]),
    // Optimize all images on copy
    new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i })
  ],
  resolve: {
    extensions: ['.js', '.json', '.node']
  }
}

module.exports = mainConfig
