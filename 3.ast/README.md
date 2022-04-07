## 1.抽象语法树(Abstract Syntax Tree)

在计算机科学中，抽象语法树（Abstract Syntax Tree，AST），或简称语法树（Syntax tree），是源代码语法结构的一种抽象表示。它以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中的一种结构

## 2.抽象语法树用途

- 代码语法的检查、代码风格的检查、代码的格式化、代码的高亮、代码错误提示、代码自动补全等等
  - 如 JSLint、JSHint 对代码错误或风格的检查，发现一些潜在的错误
  - IDE 的错误提示、格式化、高亮、自动补全等等
- 代码混淆压缩
  - UglifyJS2 等
- 优化变更代码，改变代码结构使达到想要的结构
  - 代码打包工具 webpack、rollup 等等
  - CommonJS、AMD、CMD、UMD 等代码规范之间的转化
  - CoffeeScript、TypeScript、JSX 等转化为原生 Javascript

## 3.抽象语法树定义

这些工具的原理都是通过 JavaScript Parser 把代码转化为一颗抽象语法树（AST），这颗树定义了代码的结构，通过操纵这颗树，我们可以精准的定位到声明语句、赋值语句、运算语句等等，实现对代码的分析、优化、变更等操作

## 4. JavaScript Parser

- JavaScript Parser 是把 JavaScript 源码转化为抽象语法树的解析器

### 4.1 常用的 JavaScript Parser

- esprima
- traceur
- acorn
- shift

### 4.2 AST 遍历

- astexplorer
- AST 是深度优先遍历

```
npm i esprima estraverse escodegen -S
```

```js
let esprima = require("esprima"); //把JS源代码转成AST语法树
let estraverse = require("estraverse"); ///遍历语法树,修改树上的节点
let escodegen = require("escodegen"); //把AST语法树重新转换成代码
let code = `function ast(){}`;
let ast = esprima.parse(code);
let indent = 0;
const padding = () => " ".repeat(indent);
estraverse.traverse(ast, {
  enter(node) {
    console.log(padding() + node.type + "进入");
    if (node.type === "FunctionDeclaration") {
      node.id.name = "newAst";
    }
    indent += 2;
  },
  leave(node) {
    indent -= 2;
    console.log(padding() + node.type + "离开");
  },
});
```

```
Program进入
  FunctionDeclaration进入
    Identifier进入
    Identifier离开
    BlockStatement进入
    BlockStatement离开
  FunctionDeclaration离开
Program离开
```

## 5.babel

- Babel 能够转译 ECMAScript 2015+ 的代码，使它在旧的浏览器或者环境中也能够运行
- 工作过程分为三个步骤
  - Parse(解析) 将源代码转换成抽象语法树，树上有很多的 estree 节点
  - Transform(转换) 对抽象语法树进行转换
  - Generate(代码生成) 将上一步经过转换过的抽象语法树生成新的代码

![](https://img.zhufengpeixun.com/ast-compiler-flow.jpg)

### 5.2 babel 插件

- @babel/parser 可以把源码转换成 AST
- @babel/traverse 用于对 AST 的遍历，维护了整棵树的状态，并且负责替换、移除和添加节点
- @babel/generate 可以把 AST 生成源码，同时生成 sourcemap
- @babel/types 用于 AST 节点的 Lodash 式工具库, 它包含了构造、验证以及变换 AST 节点的方法，对编写处理 AST 逻辑非常有用
- @babel/template 可以简化 AST 的创建逻辑
- @babel/code-frame 可以打印代码位置
- @babel/core Babel 的编译器，核心 API 都在这里面，比如常见的 transform、parse,并实现了插件功能
- babylon Babel 的解析器，以前叫 babel parser,是基于 acorn 扩展而来，扩展了很多语法,可以支持 es2020、jsx、typescript 等语法
- babel-types-api
- Babel 插件手册
- babeljs.io babel 可视化编译器

### 5.3 Visitor

- 访问者模式 Visitor 对于某个对象或者一组对象，不同的访问者，产生的结果不同，执行操作也不同
- Visitor 的对象定义了用于 AST 中获取具体节点的方法
- Visitor 上挂载以节点 type 命名的方法，当遍历 AST 的时候，如果匹配上 type，就会执行对应的方法

### 5.4 转换箭头函数

```js
//babel核心模块
const core = require("@babel/core");
//用来生成或者判断节点的AST语法树的节点
let types = require("@babel/types");
//let arrowFunctionPlugin = require('babel-plugin-transform-es2015-arrow-functions');
let arrowFunctionPlugin = {
  visitor: {
    //如果是箭头函数，那么就会进来此函数，参数是箭头函数的节点路径对象
    ArrowFunctionExpression(path) {
      let { node } = path;
      hoistFunctionEnvironment(path);
      node.type = "FunctionExpression";
      let body = node.body;
      //如果函数体不是语句块
      if (!types.isBlockStatement(body)) {
        node.body = types.blockStatement([types.returnStatement(body)]);
      }
    },
  },
};
/**
 * 1.要在函数的外面声明一个_this变量，值是this
 * 2.在函数的内容，换this 变成_this
 * @param {*} path
 */
function hoistFunctionEnvironment(path) {
  //1.确定我要用哪里的this 向上找不是箭头函数的函数或者根节点
  const thisEnv = path.findParent((parent) => {
    return (
      (parent.isFunction() && !path.isArrowFunctionExpression()) ||
      parent.isProgram()
    );
  });
  let thisBindings = "_this";
  let thisPaths = getThisPaths(path);
  if (thisPaths.length > 0) {
    //在thisEnv这个节点的作用域中添加一个变量 变量名为_this, 值 为this var _this = this;
    if (!thisEnv.scope.hasBinding(thisBindings)) {
      thisEnv.scope.push({
        id: types.identifier(thisBindings),
        init: types.thisExpression(),
      });
    }
  }
  thisPaths.forEach((thisPath) => {
    //this=>_this
    thisPath.replaceWith(types.identifier(thisBindings));
  });
}
function getThisPaths(path) {
  let thisPaths = [];
  path.traverse({
    ThisExpression(path) {
      thisPaths.push(path);
    },
  });
  return thisPaths;
}
let sourceCode = `
const sum = (a, b) => {
    console.log(this);
    const minus = (c,d)=>{
          console.log(this);
        return c-d;
    }
    return a + b;
}
`;
let targetSource = core.transform(sourceCode, {
  plugins: [arrowFunctionPlugin],
});
console.log(targetSource.code);
```

### 5.5 把类编译成 Function

```js
//babel核心模块
const core = require("@babel/core");
//用来生成或者判断节点的AST语法树的节点
let types = require("@babel/types");
//let transformClassesPlugin = require('@babel/plugin-transform-classes');
let transformClassesPlugin = {
  visitor: {
    //如果是箭头函数，那么就会进来此函数，参数是箭头函数的节点路径对象
    //path代表路径，node代表路径上的节点
    ClassDeclaration(path) {
      let node = path.node;
      let id = node.id; //Identifier name:Person
      let methods = node.body.body; //Array<MethodDefinition>
      let nodes = [];
      methods.forEach((method) => {
        if (method.kind === "constructor") {
          let constructorFunction = types.functionDeclaration(
            id,
            method.params,
            method.body
          );
          nodes.push(constructorFunction);
        } else {
          let memberExpression = types.memberExpression(
            types.memberExpression(id, types.identifier("prototype")),
            method.key
          );
          let functionExpression = types.functionExpression(
            null,
            method.params,
            method.body
          );
          let assignmentExpression = types.assignmentExpression(
            "=",
            memberExpression,
            functionExpression
          );
          nodes.push(assignmentExpression);
        }
      });
      if (nodes.length === 1) {
        //单节点用replaceWith
        //path代表路径，用nodes[0]这个新节点替换旧path上现有老节点node ClassDeclaration
        path.replaceWith(nodes[0]);
      } else {
        //多节点用replaceWithMultiple
        path.replaceWithMultiple(nodes);
      }
    },
  },
};
let sourceCode = `
class Person{
    constructor(name){
        this.name = name;
    }
    sayName(){
        console.log(this.name);
    }
}
`;
let targetSource = core.transform(sourceCode, {
  plugins: [transformClassesPlugin],
});
console.log(targetSource.code);
```

## 6. webpack 中使用 babel 插件

```js
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve("dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: [
              [
                path.resolve(__dirname, "plugins/babel-plugin-import.js"),
                {
                  libraryName: "lodash",
                },
              ],
            ],
          },
        },
      },
    ],
  },
};
```

### 6.1 实现按需加载

```js
//babel核心模块
const core = require("@babel/core");
//用来生成或者判断节点的AST语法树的节点
let types = require("@babel/types");

const visitor = {
  ImportDeclaration(path, state) {
    const { node } = path; //获取节点
    const { specifiers } = node; //获取批量导入声明数组
    const { libraryName, libraryDirectory = "lib" } = state.opts; //获取选项中的支持的库的名称
    //如果当前的节点的模块名称是我们需要的库的名称
    if (
      node.source.value === libraryName &&
      //并且导入不是默认导入才会进来
      !types.isImportDefaultSpecifier(specifiers[0])
    ) {
      //遍历批量导入声明数组
      const declarations = specifiers.map((specifier) => {
        //返回一个importDeclaration节点
        return types.importDeclaration(
          //导入声明importDefaultSpecifier flatten
          [types.importDefaultSpecifier(specifier.local)],
          //导入模块source lodash/flatten
          types.stringLiteral(
            libraryDirectory
              ? `${libraryName}/${libraryDirectory}/${specifier.imported.name}`
              : `${libraryName}/${specifier.imported.name}`
          )
        );
      });
      path.replaceWithMultiple(declarations); //替换当前节点
    }
  },
};

module.exports = function () {
  return {
    visitor,
  };
};
```

### 6.2 实现日志插件

```js
//babel核心模块
const core = require("@babel/core");
//用来生成或者判断节点的AST语法树的节点
const types = require("@babel/types");
const path = require("path");
const visitor = {
  CallExpression(nodePath, state) {
    const { node } = nodePath;
    if (types.isMemberExpression(node.callee)) {
      if (node.callee.object.name === "console") {
        if (
          ["log", "info", "warn", "error", "debug"].includes(
            node.callee.property.name
          )
        ) {
          const { line, column } = node.loc.start;
          const relativeFileName = path
            .relative(__dirname, state.file.opts.filename)
            .replace(/\\/g, "/");
          node.arguments.unshift(
            types.stringLiteral(`${relativeFileName} ${line}:${column}`)
          );
        }
      }
    }
  },
};
module.exports = function () {
  return {
    visitor,
  };
};
/* {
    loc: {
        start: { line: 1, column: 1 }
    }
} */
```
