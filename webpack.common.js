const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './client/src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/public/index.html',
      favicon: './client/public/favicon.ico'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './client/public',
          to: '.',
          globOptions: {
            ignore: ['**/index.html']
          }
        }
      ]
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src')
    }
  }
};
