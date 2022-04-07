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
