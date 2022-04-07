const path = require("path");
const RunPlugin = require("./plugins/run-plugin");
const DonePlugin = require("./plugins/done-plugin");

module.exports = {
  mode: "development",
  devtool: false,
  entry: {
    entry1: "./src/entry1.js",
    entry2: "./src/entry2.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          path.resolve(__dirname, "loaders/logger1-loader.js"),
          path.resolve(__dirname, "loaders/logger2-loader.js"),
        ],
      },
    ],
  },
  plugins: [
    new RunPlugin(), //开始编译的时候触发run事件，RunPlugin会监听这个事件执行回调
    new DonePlugin(), //编译完成的时候会触发done事件，DonePlugin会监听这个done事件的回调
  ],
};
