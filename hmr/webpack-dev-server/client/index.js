// 这个文件的代码会被打包到bundle.js中，运行在浏览器中
var hotEmitter = require("../../webpack/hot/emitter");
var socket = io();
var currentHash = "";
var initial = true;

// socket方法建立了websocket和服务端的连接
// 并注册了 2 个监听事件。
// hash事件，更新最新一次打包后的hash值
// ok事件，进行热更新检查。
socket.on("hash", (hash) => {
  currentHash = hash;
});

socket.on("ok", () => {
  console.log("ok");
  if (initial) {
    return (initial = false);
  }
  reloadApp();
});

function reloadApp() {
  hotEmitter.emit("webpackHotUpdate", currentHash);
}
