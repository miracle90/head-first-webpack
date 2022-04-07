const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.join(__dirname, "dist"),
    hotUpdateGlobal: "webpackHotUpdate",
  },
  devServer: {
    hot: true,
    // contentBase: path.join(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
