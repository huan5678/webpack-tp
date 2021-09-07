const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

if(process.env.NODE_ENV === 'development'){

}

module.exports = {
  mode: process.env.NODE_ENV,
  resolve: {
    alias: {
      '@img': path.resolve(__dirname, 'src/images'),
      '@src': path.resolve(__dirname, './src')
    }
  },

  context: path.resolve(__dirname, './src'),

  entry: {
    bundle: './main.js',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 8080,
  },

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        // 把 sass-loader 放在首要處理 (第一步)
        // use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
};