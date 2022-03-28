var modules = {
  "./src/title.js": (module) => {
    module.exports = {
      name: "yy",
      age: 18,
    };
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
require.n = (module) => {
  // 如果是esModule导出，取 exports.default，否则返回 exports
  var getter =
    module && module.__esModule ? () => module["default"] : () => module;
  // 给函数 getter 添加 a 属性
  require.d(getter, { a: getter });
  return getter;
};
require.d = (exports, definition) => {
  for (var key in definition) {
    if (require.o(definition, key) && !require.o(exports, key)) {
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: definition[key],
      });
    }
  }
};
require.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
require.r = (exports) => {
  if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
  }
  Object.defineProperty(exports, "__esModule", { value: true });
};
var __webpack_exports__ = {};
// 只要打包前的模块是一个 esModule，那么就先调用 require.r 进行处理，增加属性
require.r(__webpack_exports__);
var _title_0__ = require("./src/title.js");
var _title_0___default = require.n(_title_0__);
// 返回的函数 getter 直接执行
console.log(_title_0___default());
