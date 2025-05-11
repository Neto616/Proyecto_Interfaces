const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const pruebaLocal = true
module.exports = {
    entry: './app/src/index.jsx',
    output: {
      path: path.resolve(__dirname, 'dist/client'),
      filename: 'bundle.js',
      publicPath:pruebaLocal ? '/' : '/static/', 
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,  // Para .js y .jsx
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.css$/,  // Para .css
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/,  // Para imágenes .png, .jpg, .jpeg, .gif, .svg
          type: 'asset/resource',  // Usamos 'asset/resource' para que Webpack gestione las imágenes
          generator: {
            filename: 'images/[name][hash][ext][query]',  // Puedes personalizar la ruta y el nombre de las imágenes
          },
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './app/public/index.html',
      }),
      new MiniCssExtractPlugin({
        filename: 'styles.css',
      }),
    ],
    devServer: {
      static: path.resolve(__dirname, 'app/public'),
      port: 3000,
      open: true,
      hot: true,
      watchFiles: {
        options: {
          ignored: ['**/DumpStack.log.tmp', '**/*.tmp', '**/node_modules/**']
        }
      }
    }
    ,
    mode: 'development',
  };
  