class NormalModule {
  constructor({ name, context, rawRequest, resource, parser }) {
    this.name = name;
    this.context = context;
    this.rawRequest = rawRequest;
    this.resource = resource;
    this.parser = parser;
    this._source = null;
    this._ast = null;
  }
  //解析依赖
  build(compilation, callback) {
    this.doBuild(compilation, (err) => {
      this._ast = this.parser.parse(this._source);
      callback();
    });
  }
  //获取模块代码
  doBuild(compilation, callback) {
    let originalSource = this.getSource(this.resource, compilation);
    this._source = originalSource;
    callback();
  }
  getSource(resource, compilation) {
    let originalSource = compilation.inputFileSystem.readFileSync(
      resource,
      "utf8"
    );
    return originalSource;
  }
}
module.exports = NormalModule;
