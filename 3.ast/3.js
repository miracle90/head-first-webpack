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
