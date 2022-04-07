let fs = require("fs");
let path = require("path");
let { SyncHook } = require("./tapable");
let Complication = require("./Complication");
/**
 * Compiler就是编译大管家
 * 负责整个编译过程，里面保存整个编译所有的信息
 */
class Compiler {
  constructor(options) {
    this.options = options;
    this.hooks = {
      run: new SyncHook(), //会在开始编译的时候触发
      done: new SyncHook(), //会在结束编译的时候触发
    };
  }
  //4.执行Compiler对象的run方法开始执行编译
  run(callback) {
    this.hooks.run.call();
    //5.根据配置中的entry找出入口文件
    const onCompiled = (err, stats, fileDependencies) => {
      //10在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统
      for (let filename in stats.assets) {
        const outputPath = this.options.output.path;
        if (!fs.existsSync(outputPath)) {
          fs.mkdirSync(outputPath);
        }
        let filePath = path.join(outputPath, filename);
        fs.writeFileSync(filePath, stats.assets[filename], "utf8");
      }
      callback(err, {
        toJson: () => stats,
      });
      // 递归
      fileDependencies.forEach((fileDependency) =>
        fs.watch(fileDependency, () => this.compile(onCompiled))
      );
    };
    this.compile(onCompiled);
    this.hooks.done.call();
  }
  compile(callback) {
    //每次编译都会创建一个新的Compilcation
    let complication = new Complication(this.options);
    complication.build(callback);
  }
}
module.exports = Compiler;
