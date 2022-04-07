// webpack-dev-middleware 实现webpack编译和文件相关操作
const express = require("express");
const updateCompiler = require("./utils/updateCompiler");
const webpackDevMiddleware = require("../../../webpack-dev-middleware");
const http = require("http");
const WebsocketServer = require("socket.io");

class Server {
  constructor(compiler, devServerOptions) {
    this.compiler = compiler;
    this.devServerOptions = devServerOptions;
    updateCompiler(compiler);
    this.sockets = [];
    this.setupHooks();
    this.setupApp();
    this.setupDevMiddleware();
    this.createServer();
    this.createSocketServer();
  }
  // 静态服务
  setupDevMiddleware() {
    if (this.devServerOptions.contentBase) {
      this.app.use(express.static(this.devServerOptions.contentBase));
    }
    this.middleware = webpackDevMiddleware(this.compiler);
    this.app.use(this.middleware);
  }
  // webpack钩子
  setupHooks() {
    // 监听webpack的done钩子，tapable提供的监听方法
    this.compiler.hooks.done.tap("webpack-dev-server", (stats) => {
      console.log("stats.hash++++++++", stats.hash);
      this.sockets.forEach((socket) => {
        socket.emit("hash", stats.hash);
        socket.emit("ok");
      });
      this._stats = stats;
    });
  }
  // 启动一个express服务器
  setupApp() {
    this.app = new express();
  }
  // 创建一个服务
  createServer() {
    this.server = http.createServer(this.app);
  }
  // 创建一个websocket服务
  createSocketServer() {
    const io = WebsocketServer(this.server);
    io.on("connection", (socket) => {
      console.log("client connected");
      this.sockets.push(socket);
      socket.on("disconnect", () => {
        let index = this.sockets.indexOf(socket);
        this.sockets = this.sockets.splice(index, 1);
      });
      if (this._stats) {
        socket.emit("hash", this._stats.hash);
        socket.emit("ok");
      }
    });
  }
  listen(port, host = "localhost", callback = () => {}) {
    this.server.listen(port, host, callback);
  }
}
module.exports = Server;
