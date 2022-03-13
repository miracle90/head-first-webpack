const esprima = require("esprima"); //把JS源代码转成AST语法树
const estraverse = require("estraverse"); ///遍历语法树,修改树上的节点
const escodegen = require("escodegen"); //把AST语法树重新转换成代码

const sourceCode = "function ast() {}";

const ast = esprima.parse(sourceCode);
// Script {
//   type: 'Program',
//   body: [
//     FunctionDeclaration {
//       type: 'FunctionDeclaration',
//       id: [Identifier],
//       params: [],
//       body: [BlockStatement],
//       generator: false,
//       expression: false,
//       async: false
//     }
//   ],
//   sourceType: 'script'
// }
let indent = 0;
let padding = () => " ".repeat(indent);
/**
 * 当我们遍历一颗抽象语法树时，
 * 以深度优先的方式进行遍历
 * 只会遍历有type属性的节点
 */
estraverse.traverse(ast, {
  enter(node) {
    console.log(padding() + node.type + "进入");
    indent += 2;
  },
  leave(node) {
    indent -= 2;
    console.log(padding() + node.type + "离开");
  },
});
// Program进入
//   FunctionDeclaration进入
//     Identifier进入
//     Identifier离开
//     BlockStatement进入
//     BlockStatement离开
//   FunctionDeclaration离开
// Program离开