const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const SpeedMeasureWebpackPlugin = require("speed-measure-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin"); // webpack 内置了 terser-webpack-plugin
const PurgecssWebpackPlugin = require("purgecss-webpack-plugin");
const glob = require("glob"); // 文件匹配模式
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");

function resolve(dir) {
  return path.resolve(__dirname, dir);
}

const smp = new SpeedMeasureWebpackPlugin();

module.exports = (env, argv) => {
  return smp.wrap({
    mode: "production",
    // entry: "./src/index.js",
    entry: {
      page1: "./src/index1.js",
      page2: "./src/index2.js",
      page3: "./src/index3.js",
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].[hash:8].js",
      publicPath: "./",
    },
    resolve: {
      extensions: [".js", ".json", ".vue", "..."], // '...' 保持默认
      modules: [resolve("src"), "node_modules"],
      alias: {
        "@": resolve("src"),
        components: resolve("src/components"),
      },
    },
    // resolveLoader: {} // resolveLoader 与上面的 resolve 对象的属性集合相同， 但仅用于解析 webpack 的 loader 包。
    externals: {
      jquery: "jQuery", // 从输出的 bundle 中排除依赖
    },
    optimization: {
      splitChunks: {
        chunks: "all", //默认作用于异步chunk，值为all/initial/async
        minSize: 0, // 生成 chunk 的最小体积（以 bytes 为单位）
        minChunks: 1, // 拆分前必须共享模块的最小 chunks 数。
        maxAsyncRequests: 2, // 限制异步模块内部的并行最大请求数的，说白了你可以理解为是每个import()它里面的最大并行请求数量
        maxInitialRequests: 4, // 限制入口的拆分数量
        // name: true, // 打包后的名称，默认是chunk的名字通过分隔符（默认是～）分隔开，如vendor~
        automaticNameDelimiter: "~", // 默认webpack将会使用入口名和代码块的名称生成命名,比如 'vendors~main.js'
        cacheGroups: {
          // 设置缓存组用来抽取满足不同规则的chunk,下面以生成common为例
          vendors: {
            chunks: "all",
            test: /node_modules/, //条件
            priority: -10, ///优先级，一个chunk很可能满足多个缓存组，会被抽取到优先级高的缓存组中,为了能够让自定义缓存组有更高的优先级(默认0),默认缓存组的priority属性为负值.
          },
          commons: {
            chunks: "all",
            minSize: 0, //最小提取字节数
            minChunks: 2, //最少被几个chunk引用
            priority: -20,
          },
        },
      },
      minimize: true,
      minimizer: [
        new OptimizeCssAssetsWebpackPlugin({}), // 添加 css 压缩配置
        new TerserWebpackPlugin({}), // 压缩js
      ],
    },
    cache: {
      type: "filesystem",
    },
    module: {
      noParse: /jquery|lodash/, // 不需要解析依赖的第三方大型类库等，可以通过这个字段进行配置，以提高构建速度
      rules: [
        {
          test: /\.js$/,
          include: resolve("src"),
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: {
                cacheDirectory: true, // 启用缓存
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            // 'style-loader',
            MiniCssExtractPlugin.loader,
            "css-loader",
          ],
        },
        {
          test: /\.less$/,
          include: resolve("src"), // 在配置 loader 的时候，我们需要更精确的去指定 loader 的作用目录或者需要排除的目录
          exclude: /node_modules/, // 通过使用 include 和 exclude 两个配置项，可以实现这个功能，
          // 配置在 thread-loader 之后的 loader 都会在一个单独的 worker 池（worker pool）中运行
          // 注意：实际上在小型项目中，开启多进程打包反而会增加时间成本，因为启动进程和进程间通信都会有一定开销。
          // 请仅在耗时的 loader 上使用
          // 多进程打包：某个任务消耗时间较长会卡顿，多进程可以同一时间干多件事，效率更高。
          // 优点是提升打包速度，缺点是每个进程的开启和交流都会有开销
          // 例如：babel-loader消耗时间最久，所以使用thread-loader针对其进行优化
          use: [
            // "thread-loader",
            // "style-loader",
            MiniCssExtractPlugin.loader,
            "css-loader",
            "less-loader",
          ],
        },
        {
          test: /\.(sass|scss)$/, //匹配所有的 sass/scss/css 文件
          use: [
            // 'style-loader',
            //  style-loader 将样式通过 style 标签的形式添加到页面上
            // 但是，更多时候，我们都希望可以通过 CSS 文件的形式引入到页面上
            MiniCssExtractPlugin.loader, // 添加 loader
            "cache-loader", // 获取前面 loader 转换的结果
            "css-loader",
            "postcss-loader",
            "sass-loader",
          ],
        },
        {
          test: /\.(png|svg|jpg|gif|jpeg|ico)$/,
          use: [
            "file-loader",
            {
              loader: "image-webpack-loader",
              options: {
                mozjpeg: {
                  progressive: true,
                  quality: 65,
                },
                optipng: {
                  enabled: false,
                },
                pngquant: {
                  quality: "65-90",
                  speed: 4,
                },
                gifsicle: {
                  interlaced: false,
                },
                webp: {
                  quality: 75,
                },
              },
            },
          ],
        },
      ],
    },
    // stats: "verbose",
    plugins: [
      new FriendlyErrorsWebpackPlugin(),
      new PurgecssWebpackPlugin({
        // 去除无用的css的代码
        paths: glob.sync(`${resolve("src")}/**/*`, { nodir: true }),
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: "disabled", // 不启动展示打包报告的http服务器
        generateStatsFile: true, // 是否生成stats.json文件
      }),
      new MiniCssExtractPlugin({
        // css外联
        filename: "[name].[hash:8].css",
      }),
      new HtmlWebpackPlugin({
        // 将js代码插入到html中
        template: "./src/index.html",
        filename: "index1.html",
        chunks: ["page1"],
      }),
      new HtmlWebpackPlugin({
        // 将js代码插入到html中
        template: "./src/index.html",
        filename: "index2.html",
        chunks: ["page2"],
      }),
      new HtmlWebpackPlugin({
        // 将js代码插入到html中
        template: "./src/index.html",
        filename: "index3.html",
        chunks: ["page3"],
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/, // 目的是将插件中的非中文语音排除掉，这样就可以大大节省打包的体积了
        contextRegExp: /moment$/,
      }),
      new CleanWebpackPlugin(), // 清空dist目录文件夹
    ],
  });
};
