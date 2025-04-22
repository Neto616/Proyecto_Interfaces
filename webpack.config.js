const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './app/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist/client'),
    filename: 'bundle.js',
    clean: true,
    assetModuleFilename: 'assets/[hash][ext][query]' // Para guardar imágenes
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './dist/client/index.html'
    })
  ],
  devServer: {
    static: path.resolve(__dirname, 'dist/client'),
    hot: true,
    port: 3000
  },
  mode: 'development'
};
