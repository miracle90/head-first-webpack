## webpack 打包后文件分析

- webpack 打包出来的是什么文件
- 打包出来的文件在浏览器里是怎么运行的

```js
// 把所有模块定义全部存放到modules对象里
// 属性名是模块的id，也就是相对于根目录的相对路径，包括文件和扩展名
// 值是此模块的定义函数
const modules = {
  "./src/title.js": function (module, exports, require) {
    module.exports = () => {
      var c = 3;
      var d = 4;
      return c + d;
    };
  },
};

// 缓存
const cache = {};

// webpack自己实现了一个符合commonjs规范的require
function require(moduleId) {
  if (cache[moduleId]) return cache[moduleId].exports;
  // 声明一个模块，里头有个exports属性
  // 如果缓存中没有，先给缓存赋值，然后赋值给模块
  const module = (cache[moduleId] = {
    exports: {},
  });
  // 执行modules中的模块，给module.exports赋值
  modules[moduleId](module, module.exports, require);
  // 返回模块的exports
  return module.exports;
}

// index.js中的代码直接拿过来，require相对路径
let title = require("./src/title.js");
let a = 1;
let b = 2;
console.log(a + b + title());
```

## 兼容性实现

1. commonjs 加载 commonjs
1. commonjs 加载 esModule
1. esModule 加载 commonjs
1. esModule 加载 esModule

> #### 为什么赋值都要用 Object.defineProperty，而不是直接赋值
> 
> * esModule导出的是一个内部模块的引用地址，任何时候都可以获取它模块内最新的值

## 异步加载

导入异步模块

```js
import(/* webpackChunkName: "hello" */ "./hello").then((result) => {
    console.log(result.default);
});
```

dist\app.js

```js
//定义一个模块定义的对象
var modules = ({});
//存放已经加载的模块的缓存
var cache = {};
//在浏览器里实现require方法
function require(moduleId) {
  var cachedModule = cache[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  var module = cache[moduleId] = {
    exports: {}
  };
  modules[moduleId](module, module.exports, require);
  return module.exports;
}
require.d = (exports, definition) => {
  for (var key in definition) {
    Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
  }
};
require.r = (exports) => {
  Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
  Object.defineProperty(exports, '__esModule', { value: true });
};
//存放加载的代码块的状态
//key是代码块的名字
//0表示已经加载完成了
var installedChunks = {
  "main": 0,
  //'hello': [resolve, reject,promise]
};
/**
 * 
 * @param {*} chunkIds 代码块ID数组
 * @param {*} moreModules 额外的模块定义
 */
function webpackJsonpCallback([chunkIds, moreModules]) {
  const resolves = [];
  for (let i = 0; i < chunkIds.length; i++) {
    const chunkId = chunkIds[i];
    resolves.push(installedChunks[chunkId][0]);
    installedChunks[chunkId] = 0;//表示此代码块已经下载完毕
  }
  //合并模块定义到modules去
  for (const moduleId in moreModules) {
    modules[moduleId] = moreModules[moduleId];
  }
  //依次取出resolve方法并执行
  while (resolves.length) {
    resolves.shift()();
  }
}
//给require方法定义一个m属性，指向模块定义对象
require.m = modules;
require.f = {};
//返回此文件对应的访问路径 
require.p = '';
//返回此代码块对应的文件名
require.u = function (chunkId) {
  return chunkId+'.main.js'
}
require.l = function (url) {
  let script = document.createElement('script');
  script.src = url;
  document.head.appendChild(script);
}
/**
 * 通过JSONP异步加载一个chunkId对应的代码块文件，其实就是hello.main.js
 * 会返回一个Promise
 * @param {*} chunkId 代码块ID
 * @param {*} promises promise数组
 */
require.f.j = function (chunkId, promises) {
  //当前的代码块的数据
  let installedChunkData;
  //创建一个promise
  const promise = new Promise((resolve, reject) => {
    installedChunkData = installedChunks[chunkId] = [resolve, reject];
  });
  installedChunkData[2] = promise;
  promises.push(promise);
  //promises.push(installedChunkData[2] = promise);
  const url = require.p + require.u(chunkId);
  require.l(url);
}
require.e = function (chunkId) {
  let promises = [];
  require.f.j(chunkId,promises);
  return Promise.all(promises);
}
var chunkLoadingGlobal = window['webpack5'] = [];
chunkLoadingGlobal.push = webpackJsonpCallback;
/**
 * require.e异步加载hello代码块文件 hello.main.js
 * promise成功后会把 hello.main.js里面的代码定义合并到require.m对象上，也就是modules上
 * 调用require方法加载./src/hello.js模块，获取 模块的导出对象，进行打印
 */
require.e('hello')
  .then(require.bind(require, './src/hello.js'))
  .then(result => { console.log(result) });
```
