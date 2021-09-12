const Config = require('webpack-chain');
const webpack = require('webpack');

const path = require('path');
const glob = require('glob');
const chalk = require('chalk');
const TerserPlugin = require('terser-webpack-plugin');


const config = new Config();

const PurgecssPlugin = require('purgecss-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const resolveApp = relativePath => path.resolve(__dirname, relativePath);

const assets = path => resolveApp(`app/assets/${path}`);

const modeEnv = process.env.NODE_ENV === 'production' ? 'production' : 'development'


module.exports = {
  mode: modeEnv,
  resolve: {
    alias: {
      '@img': assets('images/'),
      '@js': assets('js/'),
      '@style': assets('style/'),
      '@assets': assets('')
    }
  },

  optimization: {
    runtimeChunk: true,
    splitChunks: {
      chunks: 'async',
    },
    minimizer: [
      new TerserPlugin({
        parallel: 4,
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
      }),
    ]
  },

  context: path.resolve(__dirname,'app/assets'),

  entry: {
    bundle: './main.js',
    './js/vendors': ['jquery'],
  },

  output: {
    path: resolveApp('dist'),
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
        test: /\/app\/assets\/layout.ejs$/,
        use: [{
          loader: 'render-template-loader',
          options: {
            engine: 'ejs',
            locals: {
              title: 'Render Template Loader',
              desc: 'Rendering templates with a Webpack loader since 2017'
            },
            engineOptions: function (info) {
              // Ejs wants the template filename for partials rendering.
              // (Configuring a "views" option can also be done.)
              return { filename: info.filename }
            }
          }
        }],
      },
      {
        test: /\.s[ac]ss$/i,
        include: assets('style/'),
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
        test: /\.(ico|gif|png|jpg|jpeg|svg)$/i,
        type: 'asset/resource',
        include: assets('images/'),
        generator: {
          filename: 'images/[name][ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        include: assets('fonts/'),
        generator: {
          filename: 'font/[hash][ext][query]'
        }
      },
    ],
  },
  devtool: 'eval-cheap-module-source-map',
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
      jQuery: 'jquery',
  }),
  // new PurgecssPlugin({
  //   paths: glob.sync(`${path.resolve(__dirname, 'assets')}/**/*`,  { nodir: true }),
  // }),
  new ProgressBarPlugin({
    format: `  :msg [:bar] ${chalk.green.bold(':percent')} (:elapsed s)`
  }),
  ],
};