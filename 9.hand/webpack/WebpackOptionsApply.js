const EntryOptionPlugin = require("./plugins/EntryOptionPlugin");

module.exports = class WebpackOptionsApply {
  process(options, compiler) {
    //挂载入口文件插件
    new EntryOptionPlugin().apply(compiler);
    //触发entryOption事件执行
    compiler.hooks.entryOption.call(options.context, options.entry);
  }
};
