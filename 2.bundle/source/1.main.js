(() => {
  var modules = {
    "./src/title.js": (module) => {
      module.exports = () => {
        var c = 3;
        var d = 4;
        return c + d;
      };
    },
  };
  var cache = {};
  function require(moduleId) {
    var cachedModule = cache[moduleId];
    // 缓存中存在，取缓存的exports
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    // 缓存不存在，给缓存赋值，值为一个带有exports的对象
    var module = (cache[moduleId] = {
      exports: {},
    });
    modules[moduleId](module, module.exports, require);
    return module.exports;
  }
  var __webpack_exports__ = {};
  (() => {
    let title = require("./src/title.js.js");
    let a = 1;
    let b = 2;
    console.log(a + b + title());
  })();
})();
