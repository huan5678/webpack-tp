const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

const modeEnv = process.env.NODE_ENV === 'production' ? 'production' : 'development'

module.exports = {
  mode: modeEnv,
  resolve: {
    alias: {
      '@img': path.resolve(__dirname, './app/assets/images'),
      '@js': path.resolve(__dirname, './app/assets/js'),
      '@assets': path.resolve(__dirname, './app/assets')
    }
  },

  context: path.resolve(__dirname, './app/assets'),

  entry: {
    bundle: './main.js',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash:8].js',
  },

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
  },

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        // 把 sass-loader 放在首要處理 (第一步)
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader','sass-loader'],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        }
      },
      {
        test: /\.(ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext][query]'
        }
      },
      {
        test: /\.svg/,
        type: 'asset',
        generator: {
          filename: 'images/[hash][ext][query]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset',
        generator: {
          filename: 'font/[hash][ext][query]'
        }
      },
    ],
  },
  devtool: 'source-map',
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin(
      {
      title: '首頁',
      template: '../layout.ejs',
      filename: 'index.html',
      inject: 'body',
      }
    ),
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
  }),
  ],
};