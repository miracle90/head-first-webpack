let getter = {};

Object.defineProperty(getter, "a", {
  get: () => {
    return "aValue";
  },
});
