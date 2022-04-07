class EntryOptionPlugin {
  constructor(context, entry, name) {
    this.context = context;
    this.entry = entry;
    this.name = name;
  }
  apply(compiler) {
    compiler.hooks.make.tapAsync(
      "SingleEntryPlugin",
      (compilation, callback) => {
        //入口文件 代码块的名称 context上下文绝对路径
        const { entry, name, context } = this;
        compilation.addEntry(context, entry, name, callback);
      }
    );
  }
}
module.exports = EntryOptionPlugin;
