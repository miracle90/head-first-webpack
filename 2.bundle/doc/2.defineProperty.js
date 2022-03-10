let obj = {};
var ageValue = 10;

Object.defineProperty(obj, "age", {
  //writable: true, //是否可修改
  //value: 10, //writeable 和 set不能混用
  get() {
    return ageValue;
  },
  set(newValue) {
    ageValue = newValue;
  },
  enumerable: true, //是否可枚举
  configurable: true, //是否可配置可删除
});

console.log(obj.age);
obj.age = 20;
console.log(obj.age);
for (const key in obj) {
  console.log('key', key);
}
