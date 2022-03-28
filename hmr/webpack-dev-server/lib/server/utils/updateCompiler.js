const path = require("path");

// 在入口默默增加了 2 个文件，一同打包到bundle文件中去，也就是线上运行时
let updateCompiler = (compiler) => {
  const config = compiler.options;
  //来自webpack-dev-server/client/index.js 在浏览器启动WS客户端
  config.entry.main.import.unshift(require.resolve("../../client/index.js"));
  //webpack/hot/dev-server.js 在浏览器监听WS发射出来的webpackHotUpdate事件
  config.entry.main.import.unshift(
    require.resolve("../../../../webpack/hot/dev-server.js")
  );
  console.log(config.entry);
  compiler.hooks.entryOption.call(config.context, config.entry);
};
module.exports = updateCompiler;
