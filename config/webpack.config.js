const path = require('path')
const yargs = require('yargs')
const HTMLWebpackPlugin = require('html-webpack-plugin')

const mode = yargs.argv.mode || 'development'
const _$dirname = process.cwd()

module.exports = {
  entry: {
    index: path.resolve(_$dirname, 'src/index.js'),
    test: path.resolve(_$dirname, 'src/test.js')
  },
  mode: mode,
  output: {
    filename: '[name].js',
    path: path.resolve(_$dirname, 'example')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ],
        exclude: [
          /node_modules/
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  plugins: [
    new HTMLWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(_$dirname, 'index.html'),
      inject: 'body',
      chunks: ['test']
    })
  ],
  devServer: {
    disableHostCheck: true,
    host: '0.0.0.0',
    port: '9098'
  }
}