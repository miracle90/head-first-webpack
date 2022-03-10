# webpack 基础配置

### 设置环境变量四种方式

- --mode
- --env，这样写的话，webpack.config.js 中要导出一个函数
- cross-env，set NODE_ENV 会存在跨平台，cross_env 可以跨平台设置环境变量，在 webpack.config.js 中可以取值
- DefinePlugin

### 如何打包图片

- webpack5 之前使用 file-loader 和 url-loader
- webpack5 使用 Asset Modules，不需要配置额外 loader（raw-loader、url-loader、file-loader）
- 针对图片/txt/ico

### css 兼容性

为了浏览器的兼容性，我们必须加入 -webkit -ms -o -mz

- postcss-loader 可以使用 postcss 处理 css
- postcss-preset-env 把现代的 css 转换成大多数浏览器能理解的
- post-css-preset-env 已经包含了 autoprefixer 和 browser 选项

### js 兼容性

Babel 其实是一个编译 JavaScript 的平台,可以把 ES6/ES7,React 的 JSX 转义为 ES5

- babel-loader
- @babel/core
- @babel/preset-env
- @babel/preset-react
- @babel/plugin-proposal-decorators
- @babel/plugin-proposal-class-properties
- @babel/plugin-proposal-private-property-in-object
- @babel/plugin-proposal-private-methods

> - babel 是一个语法的转换引擎
> - 具体的转换规则是由插件实现的
> - 每个插件可以转换一个语法
> - 插件一个一个配很麻烦，所以可以多个插件打成一个包，变成一个预设，例如 @babel/preset-env

### eslint

- .eslintrc.js
- 自动修复 - 安装 vscode 的 eslint 插件，配置自动修复参数

.vscode\settings.json

```json
{
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### webpack-dev-middleware

webpack-dev-middleware 就是在 Express 中提供 webpack-dev-server 静态服务能力的一个中间件

```js
const express = require("express");
const app = express();
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackOptions = require("./webpack.config");
webpackOptions.mode = "development";
const compiler = webpack(webpackOptions);
app.use(webpackDevMiddleware(compiler, {}));
app.listen(3000);
```

- webpack-dev-server 的好处是相对简单，直接安装依赖后执行命令即可
- 而使用 webpack-dev-middleware 的好处是可以在既有的 Express 代码基础上快速添加 webpack-dev-server 的功能，同时利用 Express 来根据需要添加更多的功能，如 mock 服务、代理 API 请求等
