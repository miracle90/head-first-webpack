const {
  Tapable,
  SyncHook,
  SyncBailHook,
  AsyncParallelHook,
  AsyncSeriesHook,
} = require("tapable");
const Compilation = require("./Compilation");
const NormalModuleFactory = require("./NormalModuleFactory");
const Stats = require("./Stats");

class Compiler extends Tapable {
  constructor(context) {
    super();
    this.options = {};
    this.context = context; //设置上下文路径
    this.hooks = {
      entryOption: new SyncBailHook(["context", "entry"]),
      beforeRun: new AsyncSeriesHook(["compiler"]),
      run: new AsyncSeriesHook(["compiler"]),
      beforeCompile: new AsyncSeriesHook(["params"]),
      compile: new SyncHook(["params"]),
      make: new AsyncParallelHook(["compilation"]),
      thisCompilation: new SyncHook(["compilation", "params"]),
      compilation: new SyncHook(["compilation", "params"]),
      done: new AsyncSeriesHook(["stats"]),
    };
  }
  run(finalCallback) {
    //编译完成后的回调
    const onCompiled = (err, compilation) => {
      console.log("onCompiled");
      finalCallback(err, new Stats(compilation));
    };
    //准备运行编译
    this.hooks.beforeRun.callAsync(this, (err) => {
      //运行
      this.hooks.run.callAsync(this, (err) => {
        this.compile(onCompiled); //开始编译,编译完成后执行conCompiled回调
      });
    });
  }
  compile(onCompiled) {
    const params = this.newCompilationParams();
    this.hooks.beforeCompile.callAsync(params, (err) => {
      this.hooks.compile.call(params);
      const compilation = this.newCompilation(params);
      this.hooks.make.callAsync(compilation, (err) => {
        console.log("make完成");
        onCompiled(err, compilation);
      });
    });
  }
  newCompilationParams() {
    const params = {
      normalModuleFactory: new NormalModuleFactory(),
    };
    return params;
  }
  newCompilation(params) {
    const compilation = new Compilation(this);
    this.hooks.thisCompilation.call(compilation, params);
    this.hooks.compilation.call(compilation, params);
    return compilation;
  }
}
module.exports = Compiler;
