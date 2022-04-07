const fs = require("fs");
class NodeEnvironmentPlugin {
  apply(compiler) {
    compiler.inputFileSystem = fs; //设置读文件的模块
    compiler.outputFileSystem = fs; //设置写文件的模块
  }
}
module.exports = NodeEnvironmentPlugin;
