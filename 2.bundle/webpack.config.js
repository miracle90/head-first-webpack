const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: false,
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  devServer: {},
  module: {},
  plugins: [
    new CleanWebpackPlugin(),
    // new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ["**/*"] }), // 在打包之前清空输出目录
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
    }),
  ],
};
