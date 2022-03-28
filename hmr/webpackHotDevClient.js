let socket = io("/");
let currentHash;
let hotCurrentHash;

const onConnected = () => {
  console.log("客户端已经连接");
  //6. 客户端会监听到此hash消息
  socket.on("hash", (hash) => {
    console.log("websocket hash", hash);
    console.log("hotCurrentHash", hotCurrentHash);
    currentHash = hash;
  });
  //7. 客户端收到`ok`的消息
  socket.on("ok", () => {
    console.log("websocket ok");
    hotCheck();
  });
  socket.on("disconnect", () => {
    console.log("websocket disconnect");
    hotCurrentHash = currentHash = null;
  });
};
//8.执行hotCheck方法进行更新
function hotCheck() {
  if (!hotCurrentHash || hotCurrentHash === currentHash) {
    return (hotCurrentHash = currentHash);
  }
  //9.向 server 端发送 Ajax 请求，服务端返回一个hot-update.json文件，该文件包含了所有要更新的模块的 `hash` 值和chunk名
  hotDownloadManifest().then((update) => {
    console.log("update", update);
    let chunkIds = update.c;
    // let chunkIds = Object.keys(update.c);
    chunkIds.forEach((chunkId, b) => {
      //10. 通过JSONP请求获取到最新的模块代码
      hotDownloadUpdateChunk(chunkId);
    });
  });
}
function hotDownloadManifest() {
  var url = "/main." + hotCurrentHash + ".hot-update.json";
  return fetch(url)
    .then((res) => res.json())
    .catch((error) => {
      console.log(error);
    });
}
function hotDownloadUpdateChunk(chunkId) {
  var script = document.createElement("script");
  script.charset = "utf-8";
  script.src = "/" + chunkId + "." + hotCurrentHash + ".hot-update.js";
  document.head.appendChild(script);
}

//11. 补丁JS取回来后会调用`webpackHotUpdate`方法
window.webpackHotUpdate = (chunkId, moreModules) => {
  console.log('webpackHotUpdate', chunkId, moreModules)
  for (let moduleId in moreModules) {
    let oldModule = __webpack_require__.c[moduleId]; //获取老模块
    let { parents, children } = oldModule; //父亲们 儿子们
    var module = (__webpack_require__.c[moduleId] = {
      i: moduleId,
      exports: {},
      parents,
      children,
      hot: window.hotCreateModule(),
    });
    moreModules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );
    parents.forEach((parent) => {
      let parentModule = __webpack_require__.c[parent];
      parentModule.hot &&
        parentModule.hot._acceptedDependencies[moduleId] &&
        parentModule.hot._acceptedDependencies[moduleId]();
    });
    hotCurrentHash = currentHash;
  }
};
socket.on("connect", onConnected);

window.hotCreateModule = () => {
  var hot = {
    _acceptedDependencies: {}, //接收的依赖
    _acceptedDependencies: function (dep, callback) {
      for (var i = 0; i < dep.length; i++) {
        hot._acceptedDependencies[dep[i]] = callback;
      }
    },
  };
  return hot;
};
