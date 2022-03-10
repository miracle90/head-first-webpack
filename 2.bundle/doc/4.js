/**
 * 引用的变量
 */
let a = 1;
let obj = { a: () => a };
console.log(obj.a());
a = 2;
console.log(obj.a());

/**
 * 值的拷贝
 */
let b = 1;
let o = { b };
console.log(o.b);
b = 2;
console.log(o.b);
