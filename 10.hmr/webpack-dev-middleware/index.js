const middleware = require("./middleware");
// 通过“memory-fs”库将打包后的文件写入内存
const MemoryFileSystem = require("memory-fs");

let memoryFileSystem = new MemoryFileSystem();

function webpackDevMiddleware(compiler) {
  // 首先对本地文件代码进行编译打包，也就是webpack的一系列编译流程。
  // 其次编译结束后，开启对本地文件的监听，当文件发生变化，重新编译，编译完成之后继续监听。

  // 为什么代码的改动保存会自动编译，重新打包？这一系列的重新检测编译就归功于compiler.watch这个方法了。监听本地文件的变化主要是通过文件的生成时间是否有变化，
  compiler.watch({}, () => {
    // 编译结束
    console.log("start watching!");
  });
  // （2）执行setFs方法，这个方法主要目的就是将编译后的文件打包到内存。这就是为什么在开发的过程中，你会发现dist目录没有打包后的代码，因为都在内存中。原因就在于访问内存中的代码比访问文件系统中的文件更快，而且也减少了代码写入文件的开销，这一切都归功于memory-fs。
  let fs = (compiler.outputFileSystem = memoryFileSystem);
  return middleware({
    fs,
    outputPath: compiler.options.output.path,
  });
}

module.exports = webpackDevMiddleware;
