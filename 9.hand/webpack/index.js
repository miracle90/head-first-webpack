const NodeEnvironmentPlugin = require("./plugins/NodeEnvironmentPlugin");
const WebpackOptionsApply = require("./WebpackOptionsApply");
const Compiler = require("./Compiler");

function webpack(options) {
  options.context = options.context || path.resolve(process.cwd());
  //创建compiler
  let compiler = new Compiler(options.context);
  //给compiler指定options
  compiler.options = Object.assign(compiler.options, options);
  //插件设置读写文件的API
  new NodeEnvironmentPlugin().apply(compiler);
  //调用配置文件里配置的插件并依次调用
  if (options.plugins && Array.isArray(options.plugins)) {
    for (const plugin of options.plugins) {
      plugin.apply(compiler);
    }
  }
  return compiler;
}

module.exports = webpack;
