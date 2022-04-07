## 1.webpack 实现插件机制的大体方式是：

- 创建 - webpack 在其内部对象上创建各种钩子；
- 注册 - 插件将自己的方法注册到对应钩子上，交给 webpack；
- 调用 - webpack 编译过程中，会适时地触发相应钩子，因此也就触发了插件的方法。

Webpack 本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是 Tapable，webpack 中最核心的负责编译的 Compiler 和负责创建 bundle 的 Compilation 都是 Tapable 的实例

通过事件和注册和监听，触发 webpack 生命周期中的函数方法

```js
const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook,
} = require("tapable");
```

## 2.tapable 分类

### 2.1.按同步异步分类

Hook 类型可以分为同步 Sync 和异步 Async，异步又分为并行和串行

### 2.2.按返回值分类

#### 2.2.1 Basic

执行每一个事件函数，不关心函数的返回值,有 SyncHook、AsyncParallelHook、AsyncSeriesHook

#### 2.2.2 Bail

执行每一个事件函数，遇到第一个结果 result !== undefined 则返回，不再继续执行。有：SyncBailHook、AsyncSeriesBailHook, AsyncParallelBailHook

#### 2.2.3 Waterfall

如果前一个事件函数的结果 result !== undefined,则 result 会作为后一个事件函数的第一个参数,有 SyncWaterfallHook，AsyncSeriesWaterfallHook

#### 2.2.4 Loop

不停的循环执行事件函数，直到所有函数结果 result === undefined,有 SyncLoopHook 和 AsyncSeriesLoopHook

## 使用
