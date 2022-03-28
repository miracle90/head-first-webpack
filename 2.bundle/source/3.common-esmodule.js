var modules = {
  "./src/title.js": (module, exports, require) => {
    // 当前的模块是esmodule导出的
    require.r(exports);
    // 给exports上面添加属性
    require.d(exports, {
      default: () => EXPORT,
      age: () => age,
    });
    const EXPORT = "name";
    const age = "18";
  },
};
var cache = {};
function require(moduleId) {
  var cachedModule = cache[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  var module = (cache[moduleId] = {
    exports: {},
  });
  modules[moduleId](module, module.exports, require);
  return module.exports;
}
// 标明这个exports是es模块导出的结果
// 不管是esmodule还是commonjs，导出的都是commonjs
require.r = function (exports) {
  // 给exports增加两个属性
  // exports = {
  //   ...exports,
  //   [Symbol.toStringTag]: 'Module',
  //   '__esModule': true
  // }
  Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
  Object.defineProperty(exports, "__esModule", { value: true });
};
// 将导出的 default、属性，一个个都写到exports上
require.d = function (exports, definition) {
  for (const key in definition) {
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: definition[key],
    });
  }
};
let title = require("./src/title.js");
console.log(title.default);
console.log(title.age);
