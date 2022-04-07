class HookCodeFactory {
  setup(hookInstance, options) {
    hookInstance._x = options.taps.map((item) => item.fn);
  }
  init(options) {
    this.options = options;
  }
  deinit() {
    this.options = null;
  }
  args(options = {}) {
    let { before, after } = options;
    let allArgs = this.options.args || [];
    if (before) allArgs = [before, ...allArgs];
    if (after) allArgs = [...allArgs, after];
    if (allArgs.length > 0) return allArgs.join(", ");
    return "";
  }
  header() {
    let code = "";
    code += "var _x = this._x;\n";
    return code;
  }
  create(options) {
    this.init(options);
    let fn;
    switch (this.options.type) {
      case "sync":
        fn = new Function(this.args(), this.header() + this.content());
        break;
      default:
        break;
    }
    this.deinit();
    return fn;
  }
  callTapsSeries() {
    if (this.options.taps.length === 0) {
      return "";
    }
    let code = "";
    for (let j = 0; j < this.options.taps.length; j++) {
      const content = this.callTap(j);
      code += content;
    }
    return code;
  }
  callTap(tapIndex) {
    let code = "";
    code += `var _fn${tapIndex} = _x[${tapIndex}];\n`;
    let tap = this.options.taps[tapIndex];
    switch (tap.type) {
      case "sync":
        code += `_fn${tapIndex}(${this.args()});\n`;
        break;
      default:
        break;
    }
    return code;
  }
}
module.exports = HookCodeFactory;
