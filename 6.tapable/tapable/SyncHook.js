let Hook = require("./Hook");

const HookCodeFactory = require("./HookCodeFactory");

class SyncHookCodeFactory extends HookCodeFactory {
  content() {
    return this.callTapsSeries();
  }
}

let factory = new SyncHookCodeFactory();

class SyncHook extends Hook {
  compile(options) {
    factory.setup(this, options);
    return factory.create(options);
  }
}
module.exports = SyncHook;
