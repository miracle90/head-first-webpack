const NormalModuleFactory = require("./NormalModuleFactory");
const async = require("neo-async");
const { Tapable, SyncHook } = require("tapable");
const Parser = require("./Parser");
const parser = new Parser();
const path = require("path");
class Compilation extends Tapable {
  constructor(compiler) {
    super();
    this.compiler = compiler;
    this.options = compiler.options;
    this.context = compiler.context;
    this.inputFileSystem = compiler.inputFileSystem;
    this.outputFileSystem = compiler.outputFileSystem;
    this.entries = [];
    this.modules = [];
    this.hooks = {
      succeedModule: new SyncHook(["module"]),
    };
  }

  addEntry(context, entry, name, callback) {
    this._addModuleChain(context, entry, name, (err, module) => {
      callback(err, module);
    });
  }
  _addModuleChain(context, entry, name, callback) {
    const moduleFactory = new NormalModuleFactory();
    let module = moduleFactory.create({
      name, //模块所属的代码块的名称
      context: this.context, //上下文
      rawRequest: entry,
      resource: path.posix.join(context, entry),
      parser,
    }); //模块完整路径

    this.modules.push(module);
    this.entries.push(module); //把编译好的模块添加到入口列表里面
    const afterBuild = () => {
      if (module.dependencies) {
        this.processModuleDependencies(module, (err) => {
          callback(null, module);
        });
      } else {
        return callback(null, module);
      }
    };
    this.buildModule(module, afterBuild);
  }
  //context ./src/index.js main callback(终级回调)
  _addModuleChain(context, entry, name, callback) {
    this.createModule(
      {
        name, //所属的代码块的名称 main
        context: this.context, //上下文
        rawRequest: entry, // ./src/index.js
        resource: path.posix.join(context, entry), //此模块entry的的绝对路径
        parser,
      },
      (module) => {
        this.entries.push(module);
      },
      callback
    );
  }
  createModule(data, addEntry, callback) {
    //先创建模块工厂
    const moduleFactory = new NormalModuleFactory();
    let module = moduleFactory.create(data);
    //非常非常重要 模块的ID如何生成? 模块的ID是一个相对于根目录的相对路径
    //index.js ./src/index.js title.js ./src/title.js
    //relative返回一个相对路径 从根目录出出到模块的绝地路径 得到一个相对路径
    module.moduleId =
      "." + path.posix.sep + path.posix.relative(this.context, module.resource);
    addEntry && addEntry(module);
    this.modules.push(module); //把模块添加到完整的模块数组中
    const afterBuild = (err, module) => {
      if (module.dependencies) {
        //如果一个模块编译完成,发现它有依赖的模块,那么递归编译它的依赖模块
        this.processModuleDependencies(module, (err) => {
          //当这个入口模块和它依赖的模块都编译完成了,才会让调用入口模块的回调
          callback(err, module);
        });
      } else {
        callback(err, module);
      }
    };
    this.buildModule(module, afterBuild);
  }
  processModuleDependencies(module, callback) {
    let dependencies = module.dependencies;
    //因为我希望可以并行的同时开始编译依赖的模块,然后等所有依赖的模块全部编译完成后才结束
    async.forEach(
      dependencies,
      (dependency, done) => {
        let { name, context, rawRequest, resource, moduleId } = dependency;
        this.createModule(
          {
            name,
            context,
            rawRequest,
            resource,
            moduleId,
            parser,
          },
          null,
          done
        );
      },
      callback
    );
  }
  buildModule(module, afterBuild) {
    module.build(this, (err) => {
      this.hooks.succeedModule.call(module);
      return afterBuild();
    });
  }
}
module.exports = Compilation;
