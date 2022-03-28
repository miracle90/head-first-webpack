(() => {
  var cache = {};
  var currentHash;
  var lastHash;
  let hotCheck = () => {
    hotDownloadManifest()
      .then((update) => {
        update.c.forEach((chunkID) => {
          hotDownloadUpdateChunk(chunkID);
        });
        lastHash = currentHash;
      })
      .catch((err) => {
        window.location.reload();
      });
  };
  let hotDownloadManifest = () => {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      let hotUpdatePath = `main.${lastHash}.hot-update.json`;
      xhr.open("get", hotUpdatePath);
      xhr.onload = () => {
        let hotUpdate = JSON.parse(xhr.responseText);
        resolve(hotUpdate);
      };
      xhr.onerror = (error) => {
        reject(error);
      };
      xhr.send();
    });
  };
  let hotDownloadUpdateChunk = (chunkID) => {
    let script = document.createElement("script");
    script.src = `${chunkID}.${lastHash}.hot-update.js`;
    document.head.appendChild(script);
  };
  self["webpackHotUpdate"] = (chunkId, moreModules) => {
    hotAddUpdateChunk(chunkId, moreModules);
  };
  let hotUpdate = {};
  function hotAddUpdateChunk(chunkId, moreModules) {
    for (var moduleId in moreModules) {
      hotUpdate[moduleId] = modules[moduleId] = moreModules[moduleId];
    }
    hotApply();
  }
  function hotApply() {
    for (let moduleId in hotUpdate) {
      let oldModule = cache[moduleId];
      delete cache[moduleId];
      oldModule.parents &&
        oldModule.parents.forEach((parentModule) => {
          parentModule.hot._acceptedDependencies[moduleId] &&
            parentModule.hot._acceptedDependencies[moduleId]();
        });
    }
  }
  var modules = {
    "./src/index.js": (module, exports, require) => {
      let render = () => {
        let title = require("./src/title.js");
        root.innerText = title;
      };
      render();
    },
    "./src/title.js": (module) => {
      module.exports = "title3";
    },
    "./webpack/hot/emitter.js": (module) => {
      class EventEmitter {
        constructor() {
          this.events = {};
        }
        on(eventName, fn) {
          this.events[eventName] = fn;
        }
        emit(eventName, ...args) {
          this.events[eventName](...args);
        }
      }
      module.exports = new EventEmitter();
    },
  };
  var cache = {};
  function hotCreateModule() {
    var hot = {
      _acceptedDependencies: {},
      accept: function (deps, callback) {
        for (var i = 0; i < deps.length; i++)
          hot._acceptedDependencies[deps[i]] = callback;
      },
      check: hotCheck,
    };
    return hot;
  }
  function hotCreateRequire(parentModuleId) {
    var parentModule = cache[parentModuleId];
    if (!parentModule) return require;
    var fn = function (childModuleId) {
      parentModule.children.push(childModuleId);
      require(childModuleId);
      let childModule = cache[childModuleId];
      childModule.parents.push(parentModule);
      return childModule.exports;
    };
    return fn;
  }
  function require(moduleId) {
    if (cache[moduleId]) {
      return cache[moduleId].exports;
    }
    var module = (cache[moduleId] = {
      exports: {},
      hot: hotCreateModule(moduleId),
      parents: [],
      children: [],
    });
    modules[moduleId](module, module.exports, hotCreateRequire(moduleId));
    return module.exports;
  }
  (() => {
    var hotEmitter = require("./webpack/hot/emitter.js");
    var socket = io();
    var currentHash = "";
    var initial = true;
    socket.on("hash", (hash) => {
      currentHash = hash;
    });
    socket.on("ok", () => {
      console.log("ok");
      reloadApp();
    });
    function reloadApp() {
      hotEmitter.emit("webpackHotUpdate", currentHash);
    }
  })();
  (() => {
    var hotEmitter = require("./webpack/hot/emitter.js");
    hotEmitter.on("webpackHotUpdate", (currentHash) => {
      if (!lastHash) {
        lastHash = currentHash;
        console.log("lastHash=", lastHash, "currentHash=", currentHash);
        return;
      }
      console.log("lastHash=", lastHash, "currentHash=", currentHash);
      console.log("webpackHotUpdate hotCheck");
      hotCheck();
    });
  })();
  return hotCreateRequire("./src/index.js")("./src/index.js");
})();
