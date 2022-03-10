const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  mode: "development", // 模式，也可以在 package.json 中设置
  devtool: false,
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    publicPath: "", // 指定打包后的文件插入html文件html文件时访问路径的前缀
  },
  devServer: {
    // contentBase已经废弃
    static: path.resolve(__dirname, "public"), // 额外的静态文件根目录，可以配置成多个
    port: 8000,
    open: false,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        pathRewrite: { "^/api": "" },
      },
    },
    onBeforeSetupMiddleware(devServer) {
      // express()
      devServer.app.get("/api/users", (req, res) => {
        res.json([{ id: 1 }, { id: 2 }]);
      });
    },
  },
  // 解析相关
  resolve: {
    alias: {
      // 配置别名
      "@": path.resolve("src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "eslint-loader",
        enforce: "pre",
        options: { fix: true },
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [
              [
                "@babel/plugin-proposal-decorators", // 装饰器
                {
                  legacy: true, //
                  // decoratorsBeforeExport: false,
                },
              ],
              [
                "@babel/plugin-proposal-private-property-in-object", // 私有属性
                {
                  loose: true, //
                },
              ],
              [
                "@babel/plugin-proposal-private-methods", // 私有方法
                {
                  loose: true,
                },
              ],
              [
                "@babel/plugin-proposal-class-properties", // 类的方法
                {
                  loose: true,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          "style-loader", // style-loader可以把CSS插入DOM中
          "css-loader", // css-loader用来翻译处理@import和url()
          "postcss-loader",
        ],
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              url: true, // 处理 url 地址，background-image: url('XXX')
              import: true, // 处理 import
              modules: false, // 模块化，如果是true，改成模块化的写法
              sourceMap: true, // 是否生成sourceMap
              esModule: false, // true 会用 default 包裹 { default: xxx }，tree shaking只支持esModule
              importLoaders: true, // 在处理引入@import引入的css之前需要先使用几个loader对它进行处理
            },
          },
          "postcss-loader",
          "less-loader",
        ],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpg|webp|gif|svg|jpeg)$/,
        type: "asset/resource", // 相当于以前的file-loader，它可以发射一个文件到输出目录里
      },
      {
        test: /\.ico$/,
        type: "asset/inline", // 相当于以前的url-loader，它可以把文件内容变成一个base64字符串，并内联到html中
      },
      {
        test: /\.txt$/,
        type: "asset/source", // 相当于以前的raw-loader，不对内容做任何转换
      },
      {
        test: /\.webp$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 24 * 1024, // 指定内联的条件，大于4k，就发射文件，否则base64内联
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new webpack.DefinePlugin({
      globalA: JSON.stringify("666"), // 定义全局变量，需要使用JSON.stringify包裹，否则打包之后会变成一个变量
    }),
    // 拷贝静态资源
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve("public"),
    //       to: path.resolve("dist"),
    //     },
    //   ],
    // }),
  ],
};
