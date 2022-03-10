# webpack 打包后文件分析

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

### 兼容性实现

1. commonjs 加载 commonjs
1. commonjs 加载 esModule
1. esModule 加载 commonjs
1. esModule 加载 esModule

> #### 为什么赋值都要用 Object.defineProperty，而不是直接赋值
> 
> * esModule导出的是一个内部模块的引用地址，任何时候都可以获取它模块内最新的值
