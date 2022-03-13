# 1.抽象语法树(Abstract Syntax Tree)

在计算机科学中，抽象语法树（Abstract Syntax Tree，AST），或简称语法树（Syntax tree），是源代码语法结构的一种抽象表示。它以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中的一种结构

# 2.抽象语法树用途

* 代码语法的检查、代码风格的检查、代码的格式化、代码的高亮、代码错误提示、代码自动补全等等
  * 如 JSLint、JSHint 对代码错误或风格的检查，发现一些潜在的错误
  * IDE 的错误提示、格式化、高亮、自动补全等等
* 代码混淆压缩
  * UglifyJS2 等
* 优化变更代码，改变代码结构使达到想要的结构
  * 代码打包工具 webpack、rollup 等等
  * CommonJS、AMD、CMD、UMD 等代码规范之间的转化
  * CoffeeScript、TypeScript、JSX 等转化为原生 Javascript
# 3.抽象语法树定义

这些工具的原理都是通过JavaScript Parser把代码转化为一颗抽象语法树（AST），这颗树定义了代码的结构，通过操纵这颗树，我们可以精准的定位到声明语句、赋值语句、运算语句等等，实现对代码的分析、优化、变更等操作

4. JavaScript Parser

* JavaScript Parser是把JavaScript源码转化为抽象语法树的解析器

### 4.1 常用的 JavaScript Parser

* esprima
* traceur
8 acorn
* shift

### 4.2 AST遍历

* astexplorer
* AST是深度优先遍历

```
npm i esprima estraverse escodegen -S
```

```js
let esprima = require('esprima');//把JS源代码转成AST语法树
let estraverse = require('estraverse');///遍历语法树,修改树上的节点
let escodegen = require('escodegen');//把AST语法树重新转换成代码
let code = `function ast(){}`;
let ast = esprima.parse(code);
let indent = 0;
const padding = ()=>" ".repeat(indent);
estraverse.traverse(ast,{
    enter(node){
        console.log(padding()+node.type+'进入');
        if(node.type === 'FunctionDeclaration'){
            node.id.name = 'newAst';
        }
        indent+=2;
    },
    leave(node){
        indent-=2;
        console.log(padding()+node.type+'离开');
    }
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

# 5.babel

* Babel 能够转译 ECMAScript 2015+ 的代码，使它在旧的浏览器或者环境中也能够运行
* 工作过程分为三个步骤
  * Parse(解析) 将源代码转换成抽象语法树，树上有很多的estree节点
  * Transform(转换) 对抽象语法树进行转换
  * Generate(代码生成) 将上一步经过转换过的抽象语法树生成新的代码

### 5.2 babel 插件

* @babel/parser 可以把源码转换成AST
* @babel/traverse 用于对 AST 的遍历，维护了整棵树的状态，并且负责替换、移除和添加节点
* @babel/generate 可以把AST生成源码，同时生成sourcemap
* @babel/types 用于 AST 节点的 Lodash 式工具库, 它包含了构造、验证以及变换 AST 节点的方法，对编写处理 AST 逻辑非常有用
* @babel/template可以简化AST的创建逻辑
* @babel/code-frame可以打印代码位置
* @babel/core Babel 的编译器，核心 API 都在这里面，比如常见的 transform、parse,并实现了插件功能
* babylon Babel 的解析器，以前叫babel parser,是基于acorn扩展而来，扩展了很多语法,可以支持es2020、jsx、typescript等语法
* babel-types-api
* Babel 插件手册
* babeljs.io babel 可视化编译器

### 5.3 Visitor

* 访问者模式 Visitor 对于某个对象或者一组对象，不同的访问者，产生的结果不同，执行操作也不同
* Visitor 的对象定义了用于 AST 中获取具体节点的方法
* Visitor 上挂载以节点 type 命名的方法，当遍历 AST 的时候，如果匹配上 type，就会执行对应的方法

