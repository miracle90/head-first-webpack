const webpack = require("webpack");
const Server = require("./webpack-dev-server/lib/server/index.js");
const config = require("./webpack.config");

function startDevServer(compiler, options) {
  const devServerOptions = options.devServer || {};
  const server = new Server(compiler, devServerOptions);
  const { host = "localhost", port = 8080 } = devServerOptions;
  server.listen(port, host, (err) => {
    console.log(`Project is running at http://${host}:${port}`);
  });
}

const compiler = webpack(config);

startDevServer(compiler, config);
