const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  devServer: {
    hot: false,
  },
  resolveLoader: {
    alias: {
      "babel-loader": path.resolve(__dirname, "loader/babel-loader.js"),
    },
    modules: [path.resolve("./loader"), "node_modules"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: ["style-loader", "less-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
};
/**
 * 要想在项目中使用自定义loader
 * 1.可以使用绝对路径 path.resolve(__dirname,'loader/babel-loader.js')
 * 2.resolveLoader 配置alias
 * 3.resolveLoader 配置modules
 */
