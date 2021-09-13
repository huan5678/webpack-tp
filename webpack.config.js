const webpack = require('webpack')

const path = require('path')
const glob = require('glob-all')
const chalk = require('chalk')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const resolveApp = (relativePath) => path.resolve(__dirname, relativePath)

const assets = (path) => resolveApp(`app/assets/${path}`)

const modeEnv = process.env.NODE_ENV === 'production' ? 'production' : 'development'

module.exports = {
    mode: modeEnv,
    resolve: {
        alias: {
            '@img': assets('images/'),
            '@js': assets('js/'),
            '@style': assets('style/'),
            '@assets': assets(''),
        },
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
        ],
    },

    context: path.resolve(__dirname, 'app/assets'),

    entry: {
        bundle: './main.js',
        './js/vendors': ['jquery'],
    },

    output: {
        path: resolveApp('dist'),
        filename: '[name].[hash:8].js',
        clean: true,
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
                include: assets('style/'),
                // 把 sass-loader 放在首要處理 (第一步)
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.(ico|gif|png|jpg|jpeg|svg)$/i,
                type: 'asset/resource',
                include: assets('images/'),
                generator: {
                    filename: 'images/[name][ext]',
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                include: assets('fonts/'),
                generator: {
                    filename: 'font/[hash][ext][query]',
                },
            },
        ],
    },
    devtool: 'eval-cheap-module-source-map',
    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            title: '首頁',
            template: '../index.ejs',
            filename: 'index.html',
            inject: 'body',
        }),
        new PurgecssPlugin({
            paths: glob.sync(
                [`${assets('')}/**/*`, path.resolve(__dirname, 'node_modules/jquery/dist/jquery.slim.js')],
                {
                    nodir: true,
                }
            ),
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
        }),
        new ProgressBarPlugin({
            format: `  :msg [:bar] ${chalk.green.bold(':percent')} (:elapsed s)`,
        }),
    ],
}
