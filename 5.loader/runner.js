const { runLoaders } = require("loader-runner");
const path = require("path");
const fs = require("fs"); //webpack-dev-server启开发服务器的时候 memory-fs
const entryFile = path.resolve(__dirname, "src/index.js");
//如何配置行内
let request = `inline-loader1!inline-loader2!${entryFile}`;
let rules = [
  {
    test: /\.js$/,
    use: ["normal-loader1", "normal-loader2"],
  },
  {
    test: /\.js$/,
    enforce: "post",
    use: ["post-loader1", "post-loader2"],
  },
  {
    test: /\.js$/,
    enforce: "pre",
    use: ["pre-loader1", "pre-loader2"],
  },
];
let parts = request.replace(/^-?!+/, "").split("!");
let resource = parts.pop(); //弹出最后一个元素 entryFile=src/index.js
let inlineLoaders = parts; //[inline-loader1,inline-loader2]
let preLoaders = [],
  postLoaders = [],
  normalLoaders = [];
for (let i = 0; i < rules.length; i++) {
  let rule = rules[i];
  if (rule.test.test(resource)) {
    if (rule.enforce === "pre") {
      preLoaders.push(...rule.use);
    } else if (rule.enforce === "post") {
      postLoaders.push(...rule.use);
    } else {
      normalLoaders.push(...rule.use);
    }
  }
}
let loaders = [
  ...postLoaders,
  ...inlineLoaders,
  ...normalLoaders,
  ...preLoaders,
];
let resolveLoader = (loader) =>
  path.resolve(__dirname, "loaders-chain", loader);
//把loader数组从名称变成绝对路径
loaders = loaders.map(resolveLoader);
runLoaders(
  {
    resource, //你要加载的资源
    loaders,
    context: { name: "zhufeng", age: 100 }, //保存一些状态和值
    readResource: fs.readFile.bind(this),
  },
  (err, result) => {
    console.log(err); //运行错误
    console.log(result); //运行的结果
    console.log(
      result.resourceBuffer ? result.resourceBuffer.toString("utf8") : null
    ); //读到的原始的文件
  }
);
